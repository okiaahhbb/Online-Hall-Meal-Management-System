import { useState } from 'react';
import axios from 'axios';

export default function SettingsTab({ getHeaders, API }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await axios.post(`${API}/change-password`, { oldPassword, newPassword }, getHeaders());
      setMessage('✅ Password changed.');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed.'}`);
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 max-w-md">
      <h2 className="font-bold text-[#1b382b] mb-4">⚙️ Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="password" placeholder="Current Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm" />
        <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm" />
        <button type="submit" disabled={loading} className="w-full bg-[#1b382b] hover:bg-[#244234] text-white font-semibold py-2 rounded-lg text-sm transition disabled:opacity-50">{loading ? 'Updating...' : 'Change Password'}</button>
        {message && <p className="text-xs text-center mt-1">{message}</p>}
      </form>
    </div>
  );
}