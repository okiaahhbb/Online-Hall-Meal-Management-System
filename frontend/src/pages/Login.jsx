import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdminContact, setShowAdminContact] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = res.data;

      // ✅ LocalStorage এ সেভ করুন
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // ✅ Parent component এ user পাঠান
      if (typeof onLoginSuccess === 'function') {
        onLoginSuccess(user);
      }

      // ✅ Student Dashboard এ Redirect
      navigate('/student', { replace: true });

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1b382b] p-4 sm:p-6">
      
      {/* Main Container Card */}
      <div className="bg-[#244234] rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 border border-emerald-900/40">
        
        {/* Left Side: Illustration */}
        <div className="hidden md:flex flex-col justify-between bg-[#f0f7f3] p-8 relative rounded-r-[60px] lg:rounded-r-[90px] z-10">
          <div>
            <div className="flex items-center gap-2">
              <img 
                src="/ruetlogo.jfif" 
                alt="RUET Logo" 
                className="w-10 h-10 object-contain rounded-full bg-white p-1 shadow-sm border border-emerald-100"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="text-xs font-bold text-[#1b382b] uppercase tracking-widest">
                Female-2 Hall
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#1b382b] mt-4 leading-snug">
              Smart Hall Dining Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Select meals, pay easily, and manage your daily dining status.
            </p>
          </div>

          <div className="my-6 flex justify-center items-center">
            <img 
              src="/login-amico.svg" 
              alt="Login Vector" 
              className="max-h-60 object-contain drop-shadow-md"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://illustrations.popsy.co/emerald/working-from-home.svg";
              }}
            />
          </div>

          <p className="text-[10px] text-center text-slate-400">
            © RUET Hall Management System
          </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-[#244234] text-white">
          
          {/* Mobile Logo */}
          <div className="text-center md:hidden mb-6">
            <img 
              src="/ruetlogo.jfif" 
              alt="RUET Logo" 
              className="w-14 h-14 object-contain rounded-full mx-auto bg-white p-1 shadow-sm border border-emerald-100 mb-2"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="inline-block bg-[#1b382b] text-emerald-300 text-[10px] font-bold px-3 py-0.5 rounded-full border border-emerald-700/50">
              🏠 Female-2 Hall
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-extrabold text-white tracking-wide">Log In</h2>
            <p className="text-xs text-emerald-200/70 mt-1">Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="bg-red-900/40 border border-red-500/50 text-red-200 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-emerald-200/80 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#1b382b]/80 border border-emerald-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-emerald-200/80 uppercase tracking-wider mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1b382b]/80 border border-emerald-700/60 rounded-xl px-4 py-2.5 text-sm text-white placeholder-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3b7a60] hover:bg-[#468f71] text-white text-sm font-bold py-3 rounded-xl transition duration-200 shadow-md active:scale-[0.99] disabled:opacity-70 mt-3"
            >
              {loading ? 'Logging in...' : '🔐 Log In'}
            </button>
          </form>

          {/* Contact Admin */}
          <div className="mt-6 text-center">
            <p className="text-xs text-emerald-200/60">
              Want to register?{' '}
              <button 
                type="button"
                onClick={() => setShowAdminContact(true)}
                className="text-emerald-300 hover:underline font-bold focus:outline-none ml-1"
              >
                Contact Admin
              </button>
            </p>
          </div>

          {/* Admin Panel Link */}
          <div className="mt-6 border-t border-emerald-800/60 pt-4 text-center">
            <p className="text-[11px] text-emerald-200/50">
              Are you a Dining Manager?{' '}
              <a href="/admin" className="text-emerald-300 hover:underline font-bold">
                Admin Panel
              </a>
            </p>
          </div>

        </div>
      </div>

      {/* Admin Contact Modal */}
      {showAdminContact && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1b382b] text-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-emerald-700/50">
            <div className="flex justify-between items-center mb-4 border-b border-emerald-800/60 pb-3">
              <h3 className="text-base font-bold text-emerald-200">
                📞 Hall Administration
              </h3>
              <button 
                onClick={() => setShowAdminContact(false)}
                className="text-emerald-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            
            <p className="text-xs text-emerald-100/70 mb-4">
              Student accounts are registered manually by hall authority. Please contact:
            </p>

            <div className="space-y-3">
              <div className="p-3 bg-[#244234] border border-emerald-700/50 rounded-xl">
                <p className="text-xs font-bold text-emerald-300">Dining In-Charge</p>
                <p className="text-xs text-emerald-100/80 mt-0.5">📧 admin.female2@ruet.ac.bd</p>
                <p className="text-xs text-emerald-100/80">📱 +880 1700-000000</p>
              </div>

              <div className="p-3 bg-[#244234] border border-emerald-700/50 rounded-xl">
                <p className="text-xs font-bold text-emerald-300">Hall Provost Office</p>
                <p className="text-xs text-emerald-100/80 mt-0.5">📧 provost.f2@ruet.ac.bd</p>
                <p className="text-xs text-emerald-100/80">📱 +880 1711-111111</p>
              </div>
            </div>

            <button
              onClick={() => setShowAdminContact(false)}
              className="w-full mt-5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Login;