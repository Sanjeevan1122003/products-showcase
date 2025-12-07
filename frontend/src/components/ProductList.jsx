import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/ProductList.css';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 6,
        total: 0,
        pages: 0
    });

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://products-showcase-nine.vercel.app/api/products', {
                params: {
                    search,
                    category: selectedCategory === 'All' ? '' : selectedCategory,
                    page: pagination.page,
                    limit: pagination.limit
                }
            });
            setProducts(response.data.products);
            setPagination(response.data.pagination);
            setError('');
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    }, [search, selectedCategory, pagination.page, pagination.limit]);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get('https://products-showcase-nine.vercel.app/api/products/categories');
            setCategories(['All', ...response.data]);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(timeoutId);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.pages) {
            setPagination(prev => ({ ...prev, page: newPage }));
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    if (loading && products.length === 0) {
        return <div className="loading">Loading products...</div>;
    }

    return (
        <div className="product-list">
            <div className="filters">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>
                <div className="category-filter">
                    <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="category-select"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {products.length === 0 ? (
                <div className="no-products">
                    <p>No products found. Try a different search or category.</p>
                </div>
            ) : (
                <>
                    <div className="products-grid">
                        {products.map(product => (
                            <div key={product.id} className="product-card">
                                <div className="product-image">
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                                        }}
                                    />
                                </div>
                                <div className="product-info">
                                    <span className="product-category">{product.category}</span>
                                    <h3 className="product-title">{product.name}</h3>
                                    <p className="product-description">{product.short_desc}</p>
                                    <div className="product-footer">
                                        <span className="product-price">₹{product.price.toFixed(2)}</span>
                                        <div className="product-rating">
                                            ⭐ {product.rating} | Stock: {product.stock_quantity}
                                        </div>
                                    </div>
                                    <Link to={`/product/${product.id}`} className="view-details-btn">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {pagination.pages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="page-btn"
                            >
                                Previous
                            </button>
                            <span className="page-info">
                                Page {pagination.page} of {pagination.pages}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
                                className="page-btn"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ProductList;