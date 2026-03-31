import { NavLink, Outlet } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-top">
          <NavLink to="." end className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <i className="fa-solid fa-table-columns"></i> Dashboard
          </NavLink>
          <NavLink to="analytics" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <i className="fa-solid fa-chart-line"></i> Analytics
          </NavLink>
          <NavLink to="manage-users" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <i className="fa-solid fa-users"></i> Manage Users
          </NavLink>
          <NavLink to="issue-logs" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <i className="fa-solid fa-file-lines"></i> Issue Logs
          </NavLink>
        </div>
        <div className="sidebar-bottom">
          <NavLink to="settings" className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}>
            <i className="fa-solid fa-gear"></i> Settings
          </NavLink>
        </div>
      </aside>
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
export default AdminDashboard;