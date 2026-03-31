import './IssueDetailModal.css';

const IssueDetailModal = ({ isOpen, onClose, issue }) => {
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
