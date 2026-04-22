import { useEffect, useMemo, useState } from 'react';
import API from '../api/api';
import './AdminDashboard.css';

const HOURS_IN_MS = 1000 * 60 * 60;
const DAYS_IN_MS = 1000 * 60 * 60 * 24;

function AdminAnalytics() {
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const [{ data: issueData }, { data: userData }] = await Promise.all([
          API.get('/issues'),
          API.get('/auth/users'),
        ]);

        setIssues(issueData);
        setUsers(userData);
      } catch (apiError) {
        setError(apiError?.response?.data?.message || 'Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const analytics = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - (7 * DAYS_IN_MS);
    const thirtyDaysAgo = now - (30 * DAYS_IN_MS);

    const totalIssues = issues.length;
    const openIssues = issues.filter((issue) => issue.status !== 'Resolved').length;
    const resolvedIssues = issues.filter((issue) => issue.status === 'Resolved');
    const inProgressIssues = issues.filter((issue) => issue.status === 'In-Progress').length;
    const pendingIssues = issues.filter((issue) => issue.status === 'Pending').length;
    const recentIssues = issues.filter((issue) => new Date(issue.createdAt).getTime() >= sevenDaysAgo).length;

    const resolvedHours = resolvedIssues
      .map((issue) => (new Date(issue.updatedAt).getTime() - new Date(issue.createdAt).getTime()) / HOURS_IN_MS)
      .filter((hours) => Number.isFinite(hours) && hours >= 0);

    const avgResolutionHours = resolvedHours.length
      ? resolvedHours.reduce((sum, hours) => sum + hours, 0) / resolvedHours.length
      : 0;

    const resolvedWithin72Hours = resolvedHours.filter((hours) => hours <= 72).length;
    const slaRate = resolvedHours.length ? (resolvedWithin72Hours / resolvedHours.length) * 100 : 0;

    const categoryCounts = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {});

    const departmentCounts = issues.reduce((acc, issue) => {
      acc[issue.department] = (acc[issue.department] || 0) + 1;
      return acc;
    }, {});

    const locationCounts = issues.reduce((acc, issue) => {
      const key = issue.location?.trim() || 'Unknown';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const dailyBuckets = Array.from({ length: 7 }, (_, offset) => {
      const day = new Date(now - ((6 - offset) * DAYS_IN_MS));
      const dayKey = day.toISOString().slice(0, 10);
      return {
        label: day.toLocaleDateString('en-US', { weekday: 'short' }),
        dayKey,
        count: 0,
      };
    });

    issues.forEach((issue) => {
      const key = new Date(issue.createdAt).toISOString().slice(0, 10);
      const bucket = dailyBuckets.find((entry) => entry.dayKey === key);
      if (bucket) {
        bucket.count += 1;
      }
    });

    const maxDailyCount = Math.max(...dailyBuckets.map((entry) => entry.count), 1);
    const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);

    const activeUsers30d = users.filter((user) => new Date(user.createdAt).getTime() >= thirtyDaysAgo).length;

    return {
      totalIssues,
      openIssues,
      resolvedIssues: resolvedIssues.length,
      inProgressIssues,
      pendingIssues,
      recentIssues,
      avgResolutionHours,
      slaRate,
      categoryCounts,
      departmentCounts,
      locationCounts,
      dailyBuckets,
      maxDailyCount,
      maxCategoryCount,
      totalUsers: users.length,
      activeUsers30d,
      maintenanceUsers: users.filter((user) => user.role === 'maintenance').length,
    };
  }, [issues, users]);

  const topLocations = useMemo(() => {
    return Object.entries(analytics.locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [analytics.locationCounts]);

  if (loading) {
    return <div className="admin-empty-state">Loading analytics...</div>;
  }

  if (error) {
    return <div className="admin-empty-state">{error}</div>;
  }

  return (
    <section className="analytics-root">
      <div className="issues-header">
        <h2>Analytics</h2>
        <span className="dashboard-subtitle">Live organisation-wide issue and user insights</span>
      </div>

      <div className="analytics-kpis">
        <article className="analytics-kpi-card">
          <p>Total Issues</p>
          <h3>{analytics.totalIssues}</h3>
          <small>{analytics.recentIssues} in the last 7 days</small>
        </article>
        <article className="analytics-kpi-card">
          <p>Open Backlog</p>
          <h3>{analytics.openIssues}</h3>
          <small>{analytics.inProgressIssues} in progress, {analytics.pendingIssues} pending</small>
        </article>
        <article className="analytics-kpi-card">
          <p>Avg Resolution Time</p>
          <h3>{analytics.avgResolutionHours.toFixed(1)}h</h3>
          <small>Based on {analytics.resolvedIssues} resolved reports</small>
        </article>
        <article className="analytics-kpi-card">
          <p>SLA (72h)</p>
          <h3>{analytics.slaRate.toFixed(0)}%</h3>
          <small>Resolved within 72 hours</small>
        </article>
      </div>

      <div className="analytics-grid">
        <article className="analytics-panel">
          <h3>Issue Volume (Last 7 Days)</h3>
          <div className="mini-bars">
            {analytics.dailyBuckets.map((day) => (
              <div key={day.dayKey} className="mini-bar-item" title={`${day.label}: ${day.count}`}>
                <div
                  className="mini-bar-fill"
                  style={{ height: `${(day.count / analytics.maxDailyCount) * 100}%` }}
                />
                <span>{day.label}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="analytics-panel">
          <h3>Category Breakdown</h3>
          <div className="category-list">
            {Object.entries(analytics.categoryCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([category, count]) => (
                <div key={category} className="category-row">
                  <span>{category}</span>
                  <div className="category-bar-track">
                    <div
                      className="category-bar-fill"
                      style={{ width: `${(count / analytics.maxCategoryCount) * 100}%` }}
                    />
                  </div>
                  <strong>{count}</strong>
                </div>
              ))}
          </div>
        </article>

        <article className="analytics-panel">
          <h3>Top Locations With Issues</h3>
          <ul className="analytics-list">
            {topLocations.length === 0 ? (
              <li>No location data yet.</li>
            ) : (
              topLocations.map(([location, count]) => (
                <li key={location}>
                  <span>{location}</span>
                  <strong>{count}</strong>
                </li>
              ))
            )}
          </ul>
        </article>

        <article className="analytics-panel">
          <h3>User Distribution</h3>
          <ul className="analytics-list">
            <li>
              <span>Total Users</span>
              <strong>{analytics.totalUsers}</strong>
            </li>
            <li>
              <span>Maintenance Staff</span>
              <strong>{analytics.maintenanceUsers}</strong>
            </li>
            <li>
              <span>New Users (30 Days)</span>
              <strong>{analytics.activeUsers30d}</strong>
            </li>
          </ul>
        </article>

        <article className="analytics-panel full-width">
          <h3>Department Workload</h3>
          <ul className="analytics-list">
            {Object.entries(analytics.departmentCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([department, count]) => (
                <li key={department}>
                  <span>{department}</span>
                  <strong>{count}</strong>
                </li>
              ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

export default AdminAnalytics;
