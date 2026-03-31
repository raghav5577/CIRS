import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/api';
import './Dashboard.css'; // Reuse sidebar and layout styles
import './MyReports.css';
import IssueDetailModal from '../components/IssueDetailModal';

function MyReports() {
  const { user, logout } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchIssues = async () => {
    try {
      const { data } = await API.get('/issues');
      setIssues(data);
    } catch (error) {
      console.error("Failed to fetch issues", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchIssues();
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const openDetail = (issue) => {
    setSelectedIssue(issue);
    setIsDetailOpen(true);
  };

  return (
    <>
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-top">
            <Link to="/dashboard" className="sidebar-link">
              <i className="fa-solid fa-table-columns"></i> Dashboard
            </Link>
            <Link to="/my-reports" className="sidebar-link active">
              <i className="fa-solid fa-file-lines"></i> My Reports
            </Link>
            <a href="#" className="sidebar-link">
              <i className="fa-solid fa-map-location-dot"></i> Campus Map
            </a>
            <a href="#" className="sidebar-link">
              <i className="fa-solid fa-circle-question"></i> Knowledge Base
            </a>
          </div>
          <div className="sidebar-bottom">
            <a href="#" className="sidebar-link">
              <i className="fa-solid fa-gear"></i> Settings
            </a>
          </div>
        </aside>

        <main className="dashboard-main reports-main">
          <div className="dashboard-header-row">
            <div>
              <h1 className="dashboard-title">My Reports History</h1>
              <p className="dashboard-subtitle">A complete record of all issues you've submitted to the university.</p>
            </div>
            <Link to="/dashboard" className="back-btn">
                <i className="fa-solid fa-arrow-left"></i> Back to Dashboard
            </Link>
          </div>

          <div className="issues-section full-section">
            <div className="issues-header">
              <h2>All Submitted Issues ({issues.length})</h2>
            </div>

            {loading ? (
              <div className="loading-box">Loading your reports...</div>
            ) : issues.length === 0 ? (
              <div className="empty-box">
                <i className="fa-solid fa-clipboard-check"></i>
                <p>You haven't reported any issues yet.</p>
              </div>
            ) : (
              <table className="issues-table">
                <thead>
                  <tr>
                    <th>REPORT ID</th>
                    <th>ISSUE TITLE</th>
                    <th>CATEGORY</th>
                    <th>LOCATION</th>
                    <th>DATE SUBMITTED</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue._id}>
                      <td>#{issue._id.slice(-6).toUpperCase()}</td>
                      <td>{issue.title}</td>
                      <td>{issue.category}</td>
                      <td>{issue.location}</td>
                      <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-${issue.status.toLowerCase().replace(' ', '-')}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn" onClick={() => openDetail(issue)}>
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      <IssueDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        issue={selectedIssue}
      />
    </>
  );
}

export default MyReports;
