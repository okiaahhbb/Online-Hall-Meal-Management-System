import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMessage, setPasswordMessage] = useState('');

  const token = localStorage.getItem('token');

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/profile/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
      setFormData(res.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.put('http://localhost:5000/api/profile/update', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('✅ Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Update failed'));
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('❌ New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage('❌ Password must be at least 6 characters');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/auth/change-password', {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPasswordMessage('✅ Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setShowPasswordModal(false), 1500);
    } catch (err) {
      setPasswordMessage('❌ ' + (err.response?.data?.message || 'Failed to change password'));
    }
  };

  if (loading && !profile) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mx-auto"></div>
        <p className="text-xs text-gray-400 mt-2">Loading profile...</p>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="text-center py-12">
      <p className="text-red-500">Failed to load profile</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto h-full overflow-y-auto pb-4">
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100/60 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#1b382b] px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">👤 My Profile</h2>
          <button
            onClick={() => setEditing(!editing)}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${editing ? 'bg-gray-500 hover:bg-gray-600 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
          >
            {editing ? 'Cancel' : '✏️ Edit'}
          </button>
        </div>

        {message && (
          <div className={`px-6 py-2 text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700 border-b border-green-100' : 'bg-red-50 text-red-700 border-b border-red-100'}`}>
            {message}
          </div>
        )}

        <div className="p-6">
          {/* Profile Picture & Name */}
          <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700">
              {profile.name?.charAt(0).toUpperCase() || '👤'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{profile.name}</h3>
              <p className="text-sm text-gray-500">{profile.email}</p>
              <p className="text-xs text-gray-400">ID: {profile.student_id || 'N/A'}</p>
            </div>
          </div>

          {/* Profile Info */}
          {editing ? (
            <form onSubmit={handleUpdate} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase">Full Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase">Phone</label>
                <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase">Father's Name</label>
                <input type="text" name="father_name" value={formData.father_name || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase">Mother's Name</label>
                <input type="text" name="mother_name" value={formData.mother_name || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase">Home District</label>
                <input type="text" name="home_district" value={formData.home_district || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase">Department</label>
                <input type="text" name="department" value={formData.department || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase">Room No</label>
                <input type="text" name="room_no" value={formData.room_no || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase">Block</label>
                <input type="text" name="block" value={formData.block || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[10px] text-gray-400 font-bold uppercase">Address</label>
                <textarea name="address" value={formData.address || ''} onChange={handleChange} rows="2" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div className="md:col-span-2 flex gap-2 mt-2">
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg transition text-sm">💾 Save Changes</button>
              </div>
            </form>
          ) : (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Full Name</p>
                <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Email</p>
                <p className="text-sm font-semibold text-gray-800">{profile.email}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Student ID</p>
                <p className="text-sm font-semibold text-gray-800">{profile.student_id || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Phone</p>
                <p className="text-sm font-semibold text-gray-800">{profile.phone || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Father</p>
                <p className="text-sm font-semibold text-gray-800">{profile.father_name || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Mother</p>
                <p className="text-sm font-semibold text-gray-800">{profile.mother_name || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Department</p>
                <p className="text-sm font-semibold text-gray-800">{profile.department || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[9px] text-gray-400 font-bold uppercase">District</p>
                <p className="text-sm font-semibold text-gray-800">{profile.home_district || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Room</p>
                <p className="text-sm font-semibold text-gray-800">{profile.room_no || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Block</p>
                <p className="text-sm font-semibold text-gray-800">{profile.block || 'N/A'}</p>
              </div>
              <div className="md:col-span-2 bg-gray-50 rounded-lg p-3">
                <p className="text-[9px] text-gray-400 font-bold uppercase">Address</p>
                <p className="text-sm font-semibold text-gray-800">{profile.address || 'N/A'}</p>
              </div>
            </div>
          )}
        </div>

        {/* 🔑 Change Password & Contact Provost Section */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="bg-[#1b382b] hover:bg-[#244234] text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                🔑 Change Password
              </button>
              <button
                onClick={() => alert('📧 Provost Office: provost.f2@ruet.ac.bd\n📱 +880 1711-111111')}
                className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                📞 Contact Provost
              </button>
              <button
                onClick={() => alert('📝 Please write your application and submit to the Hall Office.\n\nApplication format:\n1. Subject\n2. Details\n3. Your Signature')}
                className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                📝 Write Application
              </button>
            </div>
            <p className="text-[9px] text-gray-400">
              🔒 For any correction, contact provost office
            </p>
          </div>
        </div>
      </div>

      {/* 🔑 Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
            <div className="bg-[#1b382b] px-6 py-3 flex justify-between items-center">
              <h3 className="text-white font-bold text-sm flex items-center gap-2">🔑 Change Password</h3>
              <button onClick={() => { setShowPasswordModal(false); setPasswordMessage(''); setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' }); }} className="text-gray-400 hover:text-white text-xl">✕</button>
            </div>
            <form onSubmit={handlePasswordChange} className="p-6 space-y-3">
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase">Current Password</label>
                <input type="password" value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase">New Password</label>
                <input type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 font-bold uppercase">Confirm New Password</label>
                <input type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              {passwordMessage && (
                <div className={`text-xs ${passwordMessage.includes('✅') ? 'text-green-600' : 'text-red-600'} bg-gray-50 p-2 rounded-lg`}>
                  {passwordMessage}
                </div>
              )}
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition text-sm">Update Password</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}