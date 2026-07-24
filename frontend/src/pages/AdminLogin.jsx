import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin({ onAdminLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/admin/auth/login', {
        email,
        password,
      });

      const { token, admin } = res.data;

      localStorage.setItem('adminToken', token);
      localStorage.setItem('admin', JSON.stringify(admin));

      onAdminLoginSuccess(admin);
      navigate('/admin');

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🛡️</div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Login</h2>
          <p className="text-xs text-gray-400 mt-1">Hall Management Panel</p>
          <div className="mt-2 inline-block bg-red-100 text-red-700 text-[10px] font-bold px-3 py-1 rounded-full">
            🔒 Authorized Personnel Only
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              placeholder="admin@hall.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold py-2.5 rounded-xl transition shadow-sm disabled:opacity-70"
          >
            {loading ? 'Logging in...' : '🔐 Login as Admin'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Don't have an admin account?{' '}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                alert('📝 Admin registration is managed by the system administrator.\nPlease contact the hall authority.');
              }}
              className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline transition"
            >
              Contact Admin
            </a>
          </p>
        </div>

        <div className="mt-2 text-center">
          <p className="text-[10px] text-gray-400">
            ⚠️ Admin access only. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;