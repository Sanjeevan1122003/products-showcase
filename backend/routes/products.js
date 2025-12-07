const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper function to parse numeric values from PostgreSQL
const parseNumericFields = (product) => {
    if (!product) return product;

    return {
        ...product,
        price: product.price ? parseFloat(product.price) : 0,
        rating: product.rating ? parseFloat(product.rating) : 0,
        stock_quantity: parseInt(product.stock_quantity) || 0
    };
};

router.get('/', async (req, res) => {
    try {
        const { search, category, page = 1, limit = 6 } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM products WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) as total FROM products WHERE 1=1';
        let params = [];
        let paramCount = 0;

        if (search && search.trim()) {
            query += ` AND (name ILIKE $${++paramCount} OR short_desc ILIKE $${paramCount} OR long_desc ILIKE $${paramCount})`;
            countQuery += ` AND (name ILIKE $${paramCount} OR short_desc ILIKE $${paramCount} OR long_desc ILIKE $${paramCount})`;
            params.push(`%${search.trim()}%`);
        }

        if (category && category !== 'All') {
            query += ` AND category = $${++paramCount}`;
            countQuery += ` AND category = $${paramCount}`;
            params.push(category);
        }

        const countParams = [...params];
        query += ` ORDER BY created_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
        params.push(parseInt(limit), parseInt(offset));

        const countResult = await db.get(countQuery, countParams);
        const total = parseInt(countResult.total);

        const products = await db.all(query, params);

        // Parse numeric fields for all products
        const formattedProducts = products.map(parseNumericFields);

        res.json({
            products: formattedProducts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            error: 'Failed to fetch products',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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
        const product = await db.get('SELECT * FROM products WHERE id = $1', [req.params.id]);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Parse numeric fields for the single product
        const formattedProduct = parseNumericFields(product);

        res.json(formattedProduct);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            error: 'Failed to fetch product',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Additional endpoints for better functionality

router.get('/featured/:limit?', async (req, res) => {
    try {
        const limit = parseInt(req.params.limit) || 4;
        const products = await db.all(
            'SELECT * FROM products ORDER BY rating DESC, created_at DESC LIMIT $1',
            [limit]
        );

        const formattedProducts = products.map(parseNumericFields);
        res.json(formattedProducts);
    } catch (error) {
        console.error('Error fetching featured products:', error);
        res.status(500).json({ error: 'Failed to fetch featured products' });
    }
});

router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 6 } = req.query;
        const offset = (page - 1) * limit;

        const countResult = await db.get(
            'SELECT COUNT(*) as total FROM products WHERE category = $1',
            [category]
        );

        const products = await db.all(
            'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
            [category, parseInt(limit), parseInt(offset)]
        );

        const formattedProducts = products.map(parseNumericFields);
        const total = parseInt(countResult.total);

        res.json({
            products: formattedProducts,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit),
                category
            }
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ error: 'Failed to fetch products by category' });
    }
});

module.exports = router;