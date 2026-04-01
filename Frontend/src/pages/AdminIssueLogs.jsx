import { useEffect, useMemo, useState } from 'react';
import API from '../api/api';
import IssueDetailModal from '../components/IssueDetailModal';
import './AdminDashboard.css';

function AdminIssueLogs() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data } = await API.get('/issues');
        setIssues(data);
      } catch (error) {
        console.error('Failed to fetch issue logs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => (statusFilter === 'all' ? true : issue.status === statusFilter));
  }, [issues, statusFilter]);

  return (
    <>
      <section className="issues-section">
        <div className="issues-header">
          <h2>Issue Logs</h2>
          <select
            className="admin-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All status</option>
            <option value="Pending">Pending</option>
            <option value="In-Progress">In-Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-empty-state">Loading issue logs...</div>
        ) : filteredIssues.length === 0 ? (
          <div className="admin-empty-state">No issue logs available.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="issues-table">
              <thead>
                <tr>
                  <th>REPORT ID</th>
                  <th>TITLE</th>
                  <th>CATEGORY</th>
                  <th>DEPARTMENT</th>
                  <th>LOCATION</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredIssues.map((issue) => (
                  <tr key={issue._id}>
                    <td>#{issue._id.slice(-6).toUpperCase()}</td>
                    <td>{issue.title}</td>
                    <td>{issue.category}</td>
                    <td>{issue.department}</td>
                    <td>{issue.location}</td>
                    <td>
                      <span className={`badge badge-${issue.status.toLowerCase().replace(' ', '-')}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
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
          </div>
        )}
      </section>

      <IssueDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        issue={selectedIssue}
      />
    </>
  );
}

export default AdminIssueLogs;
