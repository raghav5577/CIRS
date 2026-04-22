import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/api';
import './AdminDashboard.css';
import ReportIssueModal from '../components/ReportIssueModal';
import IssueDetailModal from '../components/IssueDetailModal';

function AdminOverview() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedWorkers, setSelectedWorkers] = useState({});
  const [assigningIssueId, setAssigningIssueId] = useState('');
  const [closingIssueId, setClosingIssueId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchIssues = async () => {
    try {
      const [{ data: issueData }, { data: userData }] = await Promise.all([
        API.get('/issues'),
        API.get('/auth/users'),
      ]);

      setIssues(issueData);
      setWorkers(userData.filter((u) => u.role === 'maintenance'));
    } catch (error) {
      console.error('Failed to fetch issues', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (issueId) => {
    const workerId = selectedWorkers[issueId];
    if (!workerId) return;

    try {
      setAssigningIssueId(issueId);
      const { data } = await API.put(`/issues/${issueId}/assign`, { workerId });
      setIssues((prev) => prev.map((issue) => (issue._id === issueId ? data : issue)));
    } catch (error) {
      console.error('Failed to assign worker', error);
    } finally {
      setAssigningIssueId('');
    }
  };

  const handleCloseIssue = async (issueId) => {
    const confirmed = window.confirm('Close this ticket as Resolved?');
    if (!confirmed) return;

    try {
      setClosingIssueId(issueId);
      const { data } = await API.put(`/issues/${issueId}/status`, { status: 'Resolved' });
      setIssues((prev) => prev.map((issue) => (issue._id === issueId ? data : issue)));
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to close ticket';
      alert(message);
    } finally {
      setClosingIssueId('');
    }
  };

  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  const pendingCount = issues.filter((i) => i.status === 'Pending').length;
  const progressCount = issues.filter((i) => i.status === 'In-Progress').length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;

  return (
    <>
      <div className="dashboard-header-row">
        <div>
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome back, {user?.name || 'Admin'}. Showing all reports for {user?.university || 'your university'}.
          </p>
        </div>
        <button className="report-btn" onClick={() => setIsModalOpen(true)}>
          <i className="fa-solid fa-circle-plus"></i> Report New Issue
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
          <h2>Recent Issue Submissions</h2>
          <Link to="/admin-dashboard/issue-logs" className="view-all">View All</Link>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading dashboard data...</div>
        ) : issues.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <i className="fa-solid fa-clipboard-check" style={{ fontSize: '48px', marginBottom: '10px', color: '#ccc' }}></i>
            <p>No issues reported yet. Your dashboard is clear!</p>
          </div>
        ) : (
          <table className="issues-table">
            <thead>
              <tr>
                <th>REPORT ID</th>
                <th>ISSUE TITLE</th>
                <th>CATEGORY</th>
                <th>DEPARTMENT</th>
                <th>LOCATION</th>
                <th>DATE SUBMITTED</th>
                <th>STATUS</th>
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
                  <td>{issue.category}</td>
                  <td>{issue.department}</td>
                  <td>{issue.location}</td>
                  <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${issue.status.toLowerCase().replace(' ', '-')}`}>
                      {issue.status}
                    </span>
                  </td>
                  <td>
                    <div className="assign-cell" onClick={(e) => e.stopPropagation()}>
                      <select
                        className="table-select"
                        value={selectedWorkers[issue._id] || issue.assignedTo?._id || ''}
                        onChange={(e) =>
                          setSelectedWorkers((prev) => ({
                            ...prev,
                            [issue._id]: e.target.value,
                          }))
                        }
                      >
                        <option value="">Select worker</option>
                        {workers.map((worker) => (
                          <option key={worker._id} value={worker._id}>
                            {worker.name}
                          </option>
                        ))}
                      </select>
                      <button
                        className="assign-btn"
                        onClick={() => handleAssign(issue._id)}
                        disabled={!selectedWorkers[issue._id] || assigningIssueId === issue._id}
                      >
                        {assigningIssueId === issue._id ? 'Assigning...' : 'Assign'}
                      </button>
                      <button
                        className="close-btn-table"
                        onClick={() => handleCloseIssue(issue._id)}
                        disabled={closingIssueId === issue._id || issue.status === 'Resolved'}
                      >
                        {closingIssueId === issue._id ? 'Closing...' : 'Close'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dashboard-bottom">
        <div className="service-updates">
          <h3>
            <i className="fa-solid fa-circle-info"></i> Campus Service Updates
          </h3>
          <div className="update-item">
            <div className="update-icon">
              <i className="fa-solid fa-wifi"></i>
            </div>
            <div>
              <strong>Library Wi-Fi Maintenance</strong>
              <p>Scheduled maintenance on Oct 28, 2 AM - 5 AM. Connectivity might be intermittent.</p>
            </div>
          </div>
          <div className="update-item">
            <div className="update-icon">
              <i className="fa-solid fa-utensils"></i>
            </div>
            <div>
              <strong>Cafeteria Renovations</strong>
              <p>South Wing cafeteria will be closed for floor upgrades until Monday.</p>
            </div>
          </div>
        </div>

        <div className="emergency-card">
          <h3>Need Immediate Help?</h3>
          <p>For campus security emergencies, call the direct 24/7 hotline.</p>
          <div className="emergency-actions">
            <button className="phone-btn">
              <i className="fa-solid fa-phone"></i> 555-0199
            </button>
            <button className="chat-btn">
              <i className="fa-solid fa-circle-question"></i> Open Chat
            </button>
          </div>
        </div>
      </div>

      <ReportIssueModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onIssueCreated={fetchIssues}
      />
      <IssueDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        issue={selectedIssue}
      />
    </>
  );
}

export default AdminOverview;
