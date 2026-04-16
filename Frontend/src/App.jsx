import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import Features from './components/Features'
import Stats from './components/Stats'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import AdminOverview from './pages/AdminOverview'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminManageUsers from './pages/AdminManageUsers'
import AdminIssueLogs from './pages/AdminIssueLogs'
import AdminSettings from './pages/AdminSettings'
import MaintenanceDashboard from './pages/MaintainanceDashboard';
import './App.css'
import ProtectedRoutes from './components/ProtectedRoutes'
import MyReports from './pages/MyReports'


function HomePage() {
  return (
    <>
      <Home />
      <Features />
      <Stats />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<ProtectedRoutes allowedRoles = {['student']}><Dashboard /></ProtectedRoutes>} />
         <Route path="/maintenance-dashboard" element={<ProtectedRoutes allowedRoles={['maintenance']}><MaintenanceDashboard /></ProtectedRoutes>} />
        <Route
          path="/admin-dashboard"
          element={<ProtectedRoutes allowedRoles={['admin']}><AdminDashboard /></ProtectedRoutes>}
        >
         
          <Route index element={<AdminOverview />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="manage-users" element={<AdminManageUsers />} />
          <Route path="issue-logs" element={<AdminIssueLogs />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="/my-reports" element={<ProtectedRoutes><MyReports /></ProtectedRoutes>} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App