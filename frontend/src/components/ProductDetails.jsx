import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EnquiryForm from './EnquiryForm';
import '../styles/ProductDetails.css';

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEnquiryForm, setShowEnquiryForm] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://products-showcase-nine.vercel.app/api/products/${id}`);
                setProduct(response.data);
                setError('');
            } catch (err) {
                console.error('Error fetching product:', err);
                setError('Product not found or failed to load');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);


    const handleEnquireClick = () => {
        setShowEnquiryForm(true);
    };

    const handleEnquirySubmit = () => {
        setShowEnquiryForm(false);
    };

    if (loading) {
        return <div className="loading">Loading product details...</div>;
    }

    if (error || !product) {
        return (
            <div className="error-container">
                <h2>{error || 'Product not found'}</h2>
                <button onClick={() => navigate('/')} className="back-btn">
                    Back to Products
                </button>
            </div>
        );
    }

    return (
        <div className="product-details">
            <button onClick={() => navigate('/')} className="back-btn">
                ← Back to Products
            </button>

            <div className="product-details-content">
                <div className="product-image-section">
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-main-image"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
                        }}
                    />
                </div>

                <div className="product-info-section">
                    <span className="product-category-badge">{product.category}</span>
                    <h1 className="product-title">{product.name}</h1>

                    <div className="product-meta">
                        <div className="price-section">
                            <span className="product-price">₹{product.price.toFixed(2)}</span>
                            {product.stock_quantity > 0 ? (
                                <span className="in-stock">In Stock ({product.stock_quantity} available)</span>
                            ) : (
                                <span className="out-of-stock">Out of Stock</span>
                            )}
                        </div>

                        <div className="rating-section">
                            <div className="rating-stars">
                                {'⭐'.repeat(Math.floor(product.rating))}
                                <span className="rating-text"> {product.rating.toFixed(1)}/5.0</span>
                            </div>
                        </div>
                    </div>

                    <div className="product-description-section">
                        <h3>Description</h3>
                        <p className="short-desc">{product.short_desc}</p>
                        <p className="long-desc">{product.long_desc}</p>
                    </div>

                    <div className="product-actions">
                        <button
                            onClick={handleEnquireClick}
                            className="enquire-btn"
                            disabled={product.stock_quantity === 0}
                        >
                            {product.stock_quantity > 0 ? 'Enquire Now' : 'Out of Stock'}
                        </button>
                    </div>
                </div>
            </div>

            {showEnquiryForm && (
                <EnquiryForm
                    productId={product.id}
                    productName={product.name}
                    onClose={() => setShowEnquiryForm(false)}
                    onSubmit={handleEnquirySubmit}
                />
            )}
        </div>
    );
}

export default ProductDetails;