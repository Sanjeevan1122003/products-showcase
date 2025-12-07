import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AdminPanel.css';

function AdminPanel() {
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updating, setUpdating] = useState({});
    const [updateMessage, setUpdateMessage] = useState('');

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const response = await axios.get('https://products-showcase-8mvy.vercel.app/api/enquiries');
            setEnquiries(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching enquiries:', err);
            setError('Failed to load enquiries');
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            setUpdating(prev => ({ ...prev, [id]: true }));
            setUpdateMessage('');

            await axios.put(`https://products-showcase-8mvy.vercel.app/api/enquiries/${id}/status`, {
                status: newStatus
            });

            setEnquiries(prevEnquiries =>
                prevEnquiries.map(enquiry =>
                    enquiry.id === id
                        ? { ...enquiry, status: newStatus }
                        : enquiry
                )
            );

            setUpdateMessage({
                text: `Status updated to ${newStatus}`,
                type: 'success'
            });

            setTimeout(() => setUpdateMessage(''), 3000);
        } catch (err) {
            console.error('Error updating status:', err);
            setUpdateMessage({
                text: 'Failed to update status',
                type: 'error'
            });
        } finally {
            setUpdating(prev => ({ ...prev, [id]: false }));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="loading">Loading enquiries...</div>;
    }

    return (
        <div className="admin-panel">
            <h1>Enquiry Management</h1>
            <p>Total enquiries: {enquiries.length}</p>

            {error && <div className="error-message">{error}</div>}

            {updateMessage && (
                <div className={`update-message ${updateMessage.type}`}>
                    {updateMessage.text}
                </div>
            )}

            <div className="enquiries-table-container">
                <table className="enquiries-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Date & Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enquiries.map(enquiry => (
                            <tr key={enquiry.id}>
                                <td>{enquiry.id}</td>
                                <td>
                                    {enquiry.product_name || 'General Enquiry'}
                                    {enquiry.product_id && ` (ID: ${enquiry.product_id})`}
                                </td>
                                <td>{enquiry.name}</td>
                                <td>{enquiry.email}</td>
                                <td>{enquiry.phone || 'N/A'}</td>
                                <td className="message-cell">
                                    <div className="message-preview">
                                        {enquiry.message.length > 50
                                            ? `${enquiry.message.substring(0, 50)}...`
                                            : enquiry.message
                                        }
                                    </div>
                                </td>
                                <td>
                                    <div className="status-container">
                                        <select
                                            value={enquiry.status || 'Pending'}
                                            onChange={(e) => updateStatus(enquiry.id, e.target.value)}
                                            disabled={updating[enquiry.id]}
                                            className={`status-select status-${enquiry.status}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                        {updating[enquiry.id] && (
                                            <span className="updating-spinner">🌀</span>
                                        )}
                                    </div>
                                </td>
                                <td>{formatDate(enquiry.created_at)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {enquiries.length === 0 && !error && (
                <div className="no-enquiries">
                    <p>No enquiries found.</p>
                </div>
            )}

            <button onClick={fetchEnquiries} className="refresh-btn">
                Refresh
            </button>
        </div>
    );
}

export default AdminPanel;
