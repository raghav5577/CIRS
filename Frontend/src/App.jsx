import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './components/Home'
import Features from './components/Features'
import Stats from './components/Stats'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Login from './pages/Login'
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
        <Route path="/dashboard" element={<ProtectedRoutes><Dashboard /></ProtectedRoutes>} />
        <Route path="/my-reports" element={<ProtectedRoutes><MyReports /></ProtectedRoutes>} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App