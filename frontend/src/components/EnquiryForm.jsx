import React, { useState } from 'react';
import axios from 'axios';
import '../styles/EnquiryForm.css';

function EnquiryForm({ productId, productName, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: `I'm interested in ${productName}. Please provide more information.`
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            await axios.post('https://products-showcase-nine.vercel.app/api/enquiries', {
                product_id: productId,
                ...formData
            });

            setSuccess(true);
            setTimeout(() => {
                if (onSubmit) onSubmit();
                onClose();
            }, 2000);
        } catch (err) {
            console.error('Error submitting enquiry:', err);
            setErrors({
                submit: err.response?.data?.error || 'Failed to submit enquiry. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="enquiry-form-overlay">
                <div className="enquiry-form success-message">
                    <h2>Thank You!</h2>
                    <p>Your enquiry has been submitted successfully.</p>
                    <p>We'll get back to you soon.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="enquiry-form-overlay">
            <div className="enquiry-form">
                <div className="form-header">
                    <h2>Enquire About {productName}</h2>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={errors.name ? 'error' : ''}
                            placeholder="Enter your full name"
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            placeholder="Enter your email"
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number (Optional)</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message *</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className={errors.message ? 'error' : ''}
                            rows="4"
                            placeholder="Enter your enquiry message"
                        />
                        {errors.message && <span className="error-text">{errors.message}</span>}
                    </div>

                    {errors.submit && (
                        <div className="submit-error">
                            {errors.submit}
                        </div>
                    )}

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cancel-btn"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit Enquiry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EnquiryForm;