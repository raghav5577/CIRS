import { useEffect } from 'react';
import './IssueDetailModal.css';

const IssueDetailModal = ({ isOpen, onClose, issue }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen || !issue) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content detail-modal">
                <div className="modal-header">
                    <div className="modal-title-group">
                        <span className={`badge badge-${issue.status.toLowerCase().replace(' ', '-')}`}>
                            {issue.status}
                        </span>
                        <h2>Issue Details</h2>
                    </div>
                    <button className="close-x" onClick={onClose}>&times;</button>
                </div>

                <div className="detail-body">
                    <div className="detail-row">
                        <span className="detail-label">Report ID</span>
                        <span className="detail-value">#{issue._id.slice(-6).toUpperCase()}</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Issue Title</span>
                        <span className="detail-value highlight-text">{issue.title}</span>
                    </div>

                    <div className="detail-grid">
                        <div className="detail-row">
                            <span className="detail-label">Category</span>
                            <span className="detail-value">{issue.category}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Department</span>
                            <span className="detail-value">{issue.department}</span>
                        </div>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Location</span>
                        <span className="detail-value"><i className="fa-solid fa-location-dot"></i> {issue.location}</span>
                    </div>

                    <div className="detail-row">
                        <span className="detail-label">Description</span>
                        <p className="detail-description">{issue.description}</p>
                    </div>

                    {(issue.issueImage || issue.resolutionImage) && (
                        <div className="detail-grid">
                            {issue.issueImage && (
                                <div className="detail-row">
                                    <span className="detail-label">Reported Issue Image (Student)</span>
                                    <div className="detail-value">
                                        <img src={issue.issueImage} alt="Issue reported" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginTop: '5px' }} />
                                    </div>
                                </div>
                            )}
                            {issue.resolutionImage && (
                                <div className="detail-row">
                                    <span className="detail-label">Resolution Image (Staff)</span>
                                    <div className="detail-value">
                                        <img src={issue.resolutionImage} alt="Resolution" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginTop: '5px' }} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="detail-footer">
                        <span className="detail-label">Submitted On</span>
                        <span className="detail-date">{formatDate(issue.createdAt)}</span>
                    </div>
                </div>

                <div className="modal-actions">
                    <button onClick={onClose} className="close-btn">Close</button>
                </div>
            </div>
        </div>
    );
};

export default IssueDetailModal;
