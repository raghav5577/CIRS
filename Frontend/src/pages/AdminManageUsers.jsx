import { useEffect, useMemo, useState } from 'react';
import API from '../api/api';
import './AdminDashboard.css';

function AdminManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get('/auth/users');
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const byRole = roleFilter === 'all' ? true : user.role === roleFilter;
      const query = search.trim().toLowerCase();
      const bySearch = query
        ? user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
        : true;

      return byRole && bySearch;
    });
  }, [users, roleFilter, search]);

  return (
    <section className="issues-section">
      <div className="issues-header">
        <h2>Manage Users</h2>
        <span className="dashboard-subtitle">Total: {filteredUsers.length}</span>
      </div>

      <div className="admin-tools">
        <input
          className="admin-filter-input"
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="admin-filter-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All roles</option>
          <option value="student">Student</option>
          <option value="maintenance">Maintenance</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-empty-state">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="admin-empty-state">No users found.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="issues-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>UNIVERSITY</th>
                <th>JOINED</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="badge">{user.role}</span></td>
                  <td>{user.university}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default AdminManageUsers;
