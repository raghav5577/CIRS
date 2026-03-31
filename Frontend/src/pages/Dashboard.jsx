import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../api/api';
import './Dashboard.css';
import ReportIssueModal from '../components/ReportIssueModal';
import IssueDetailModal from '../components/IssueDetailModal';

function Dashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

   // 1. Define fetchIssues outside so it's accessible everywhere
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

  // 2. Call it inside useEffect
  useEffect(() => {
    if (user) {
      fetchIssues();
    }
  }, [user]);

  // Calculate status counts dynamically
  const pendingCount = issues.filter(i => i.status === 'Pending').length;
  const progressCount = issues.filter(i => i.status === 'In-Progress').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;

  return (
    <>
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-top">
            <Link to="/dashboard" className="sidebar-link active">
              <i className="fa-solid fa-table-columns"></i> Dashboard
            </Link>
            <Link to="/my-reports" className="sidebar-link">
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
        <main className="dashboard-main">

          {/* --- Title Row --- */}
          <div className="dashboard-header-row">
            <div>
              <h1 className="dashboard-title">Student Dashboard</h1>
              <p className="dashboard-subtitle">
                Welcome back, {user?.name || 'Student'}. Here&apos;s what&apos;s happening on campus today.
              </p>
            </div>
            <button className="report-btn" onClick={() => setIsModalOpen(true)}>
              <i className="fa-solid fa-circle-plus"></i> Report New Issue
            </button>
          </div>

          {/* --- Status Cards --- */}
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

          {/* --- Recent Issues Table --- */}
          <div className="issues-section">
            <div className="issues-header">
              <h2>Recent Issue Submissions</h2>
              <Link to="/my-reports" className="view-all">View All</Link>
            </div>

            {issues.length === 0 ? (
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
                        <button 
                          className="action-btn" 
                          onClick={() => {
                            setSelectedIssue(issue);
                            setIsDetailOpen(true);
                          }}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* --- Bottom Row: Service Updates + Emergency --- */}
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
        </main>
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
export default Dashboard;