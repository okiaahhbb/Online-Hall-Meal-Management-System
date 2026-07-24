import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import StudentApp from './pages/StudentApp';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import LandingPage from './pages/LandingPage';
import AboutUs from './pages/AboutUs';
import ProvostMessage from './pages/ProvostMessage';
import Notices from './pages/Notices';
import Feedback from './pages/Feedback';
import Contact from './pages/Contact';

function AdminRoute() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('admin');
    if (stored) setAdmin(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  if (!admin) return <AdminLogin onAdminLoginSuccess={setAdmin} />;
  return <AdminDashboard admin={admin} onLogout={handleLogout} />;
}

function App() {
  return (
    <Routes>
      {/* 🏠 Landing Page - Root */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Student Route */}
      <Route path="/student" element={<StudentApp />} />
      
      {/* Admin Route */}
      <Route path="/admin" element={<AdminRoute />} />
      
      {/* Unknown Route */}
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route path="/about" element={<AboutUs />} />

      <Route path="/provost" element={<ProvostMessage />} />


      <Route path="/notices" element={<Notices />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;