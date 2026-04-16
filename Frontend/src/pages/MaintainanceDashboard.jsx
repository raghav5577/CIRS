import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/api';
import './MaintainanceDashboard.css';
import IssueDetailModal from '../components/IssueDetailModal';

function MaintenanceDashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [updatingIssueId, setUpdatingIssueId] = useState('');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchIssues = async () => {
    try {
      const { data } = await API.get('/issues');
      setIssues(data);
    } catch (error) {
      console.error('Failed to fetch assigned issues', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchIssues();
  }, [user]);

  const handleStatusUpdate = async (issueId) => {
    const nextStatus = selectedStatuses[issueId];
    if (!nextStatus) return;

    try {
      setUpdatingIssueId(issueId);
      const { data } = await API.put(`/issues/${issueId}/status`, { status: nextStatus });
      setIssues((prev) => prev.map((issue) => (issue._id === issueId ? data : issue)));
    } catch (error) {
      console.error('Failed to update status', error);
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingIssueId('');
    }
  };

  const pendingCount = issues.filter((i) => i.status === 'Pending').length;
  const progressCount = issues.filter((i) => i.status === 'In-Progress').length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;

  return (
    <>
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-top">
            <Link to="/maintenance-dashboard" className="sidebar-link active">
              <i className="fa-solid fa-table-columns"></i> Dashboard
            </Link>
          </div>
          <div className="sidebar-bottom">
            <a href="#" className="sidebar-link">
              <i className="fa-solid fa-gear"></i> Settings
            </a>
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-header-row">
            <div>
              <h1 className="dashboard-title">Staff Dashboard</h1>
              <p className="dashboard-subtitle">
                Welcome back, {user?.name || 'Staff'}. Here are the tasks assigned to you.
              </p>
            </div>
            <button className="report-btn" onClick={fetchIssues}>
              <i className="fa-solid fa-rotate-right"></i> Refresh Tasks
            </button>
          </div>

          <div className="status-cards">
            <div className="status-card">
              <div className="status-icon pending-icon">
                <i className="fa-solid fa-box-open"></i>
              </div>
              <div>
                <span className="status-label">Pending</span>
                <span className="status-value">{pendingCount}</span>
              </div>
            </div>
            <div className="status-card">
              <div className="status-icon progress-icon">
                <i className="fa-solid fa-list-check"></i>
              </div>
              <div>
                <span className="status-label">In-Progress</span>
                <span className="status-value">{progressCount}</span>
              </div>
            </div>
            <div className="status-card">
              <div className="status-icon resolved-icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div>
                <span className="status-label">Resolved</span>
                <span className="status-value">{resolvedCount}</span>
              </div>
            </div>
          </div>

          <div className="issues-section">
            <div className="issues-header">
              <h2>My Assigned Tasks</h2>
            </div>

            {loading ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading tasks...</div>
            ) : issues.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                <i className="fa-solid fa-clipboard-check" style={{ fontSize: '48px', marginBottom: '10px', color: '#ccc' }}></i>
                <p>No tasks assigned to you yet.</p>
              </div>
            ) : (
              <table className="issues-table">
                <thead>
                  <tr>
                    <th>REPORT ID</th>
                    <th>ISSUE TITLE</th>
                    <th>LOCATION</th>
                    <th>DATE SUBMITTED</th>
                    <th>CURRENT STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr
                      key={issue._id}
                      className="issue-row-clickable"
                      onClick={() => {
                        setSelectedIssue(issue);
                        setIsDetailOpen(true);
                      }}
                    >
                      <td>#{issue._id.slice(-6).toUpperCase()}</td>
                      <td>{issue.title}</td>
                      <td>{issue.location}</td>
                      <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-${issue.status.toLowerCase().replace(' ', '-')}`}>
                          {issue.status}
                        </span>
                      </td>
                      <td>
                        {issue.status !== 'Resolved' ? (
                          <div className="assign-cell" onClick={(e) => e.stopPropagation()}>
                            <select
                              className="table-select"
                              value={selectedStatuses[issue._id] || issue.status}
                              onChange={(e) =>
                                setSelectedStatuses((prev) => ({
                                  ...prev,
                                  [issue._id]: e.target.value,
                                }))
                              }
                            >
                              <option value="Pending" disabled>Pending</option>
                              <option value="In-Progress">In-Progress</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                            <button
                              className="assign-btn"
                              onClick={() => handleStatusUpdate(issue._id)}
                              disabled={
                                !selectedStatuses[issue._id] ||
                                selectedStatuses[issue._id] === issue.status ||
                                updatingIssueId === issue._id
                              }
                            >
                              {updatingIssueId === issue._id ? 'Updating...' : 'Update'}
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>Resolved</span>
                        )}
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

export default MaintenanceDashboard;