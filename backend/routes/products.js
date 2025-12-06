const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
    try {
        const { search, category, page = 1, limit = 6 } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM products WHERE 1=1';
        let params = [];

        if (search) {
            query += ' AND (name LIKE ? OR short_desc LIKE ? OR long_desc LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        if (category && category !== 'All') {
            query += ' AND category = ?';
            params.push(category);
        }

        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const countResult = await db.get(countQuery, params);
        const total = countResult.total;

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const products = await db.all(query, params);

        res.json({
            products,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});


router.get('/categories', async (req, res) => {
    try {
        const categories = await db.all('SELECT DISTINCT category FROM products ORDER BY category');
        res.json(categories.map(c => c.category));
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const product = await db.get('SELECT * FROM products WHERE id = ?', [req.params.id]);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

module.exports = router;