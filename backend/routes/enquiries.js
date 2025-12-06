const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const enquiries = await db.all(`
            SELECT e.*, p.name as product_name 
            FROM enquiries e 
            LEFT JOIN products p ON e.product_id = p.id 
            ORDER BY e.created_at DESC
        `);
        res.json(enquiries);
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ error: 'Failed to fetch enquiries' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { product_id, name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({
                error: 'Name, email, and message are required'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        if (product_id) {
            const product = await db.get('SELECT id FROM products WHERE id = ?', [product_id]);
            if (!product) {
                return res.status(404).json({ error: 'Product not found' });
            }
        }

        const result = await db.run(
            `INSERT INTO enquiries (product_id, name, email, phone, message) 
             VALUES (?, ?, ?, ?, ?)`,
            [product_id || null, name, email, phone, message]
        );

        res.status(201).json({
            message: 'Enquiry submitted successfully',
            id: result.id
        });
    } catch (error) {
        console.error('Error creating enquiry:', error);
        res.status(500).json({ error: 'Failed to submit enquiry' });
    }
});

router.put('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status. Must be "Pending" or "Completed"'
            });
        }

        const enquiry = await db.get('SELECT id FROM enquiries WHERE id = ?', [id]);
        if (!enquiry) {
            return res.status(404).json({ error: 'Enquiry not found' });
        }

        await db.run(
            `UPDATE enquiries SET status = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [status, id]
        );

        res.json({
            message: 'Enquiry status updated successfully',
            id,
            status
        });
    } catch (error) {
        console.error('Error updating enquiry status:', error);
        res.status(500).json({ error: 'Failed to update enquiry status' });
    }
});

module.exports = router;