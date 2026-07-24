import { useState, useEffect } from 'react';
import axios from 'axios';

function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem('token');

  // ============================================
  // 📌 Fetch Profile
  // ============================================
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

  useEffect(() => {
    fetchProfile();
  }, []);

  // ============================================
  // 📌 Handle Input Change
  // ============================================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ============================================
  // 📌 Handle Profile Update
  // ============================================
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.put(
        'http://localhost:5000/api/profile/update',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Profile updated successfully!');
      setEditing(false);
      fetchProfile();
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Update failed'));
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 📌 Handle Profile Picture Upload
  // ============================================
  const handlePictureUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('❌ Please select a file first');
      return;
    }

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('profile_picture', selectedFile);

    try {
      const res = await axios.post(
        'http://localhost:5000/api/profile/upload-picture',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setMessage('✅ Profile picture uploaded successfully!');
      fetchProfile();
      setSelectedFile(null);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Upload failed'));
    } finally {
      setUploading(false);
    }
  };

  // ============================================
  // 📌 Handle Picture Removal
  // ============================================
  const handleRemovePicture = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) return;

    try {
      await axios.delete(
        'http://localhost:5000/api/profile/remove-picture',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('✅ Profile picture removed');
      fetchProfile();
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Failed to remove'));
    }
  };

  if (loading && !profile) {
    return <div className="text-center py-12 text-slate-400">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-center py-12 text-red-500">Failed to load profile</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4">
          <h2 className="text-xl font-bold text-white">👤 My Profile</h2>
          <p className="text-sm text-emerald-100">Manage your personal information</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`px-6 py-3 ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'} border-b`}>
            {message}
          </div>
        )}

        <div className="p-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-slate-200">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-emerald-100 overflow-hidden flex items-center justify-center">
                {profile.profile_picture ? (
                  <img
                    src={`http://localhost:5000${profile.profile_picture}`}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl text-slate-400">
                    {profile.name?.charAt(0).toUpperCase() || '👤'}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-slate-800">{profile.name}</h3>
              <p className="text-sm text-slate-500">{profile.email}</p>
              <p className="text-sm text-slate-500">Student ID: {profile.student_id || 'N/A'}</p>
              
              <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                <label className="cursor-pointer bg-emerald-100 hover:bg-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1 rounded-lg transition">
                  📷 Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                  />
                </label>
                {selectedFile && (
                  <button
                    onClick={handlePictureUpload}
                    disabled={uploading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-lg transition"
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                )}
                {profile.profile_picture && (
                  <button
                    onClick={handleRemovePicture}
                    className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold px-3 py-1 rounded-lg transition"
                  >
                    🗑️ Remove
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setEditing(!editing)}
                className="bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold px-4 py-2 rounded-lg transition"
              >
                {editing ? 'Cancel' : '✏️ Edit'}
              </button>
            </div>
          </div>

          {/* Profile Information */}
          {editing ? (
            // ============================================
            // 📌 EDIT MODE
            // ============================================
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Father's Name</label>
                  <input
                    type="text"
                    name="father_name"
                    value={formData.father_name || ''}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    name="mother_name"
                    value={formData.mother_name || ''}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Home District</label>
                  <input
                    type="text"
                    name="home_district"
                    value={formData.home_district || ''}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Blood Group</label>
                  <input
                    type="text"
                    name="blood_group"
                    value={formData.blood_group || ''}
                    onChange={handleChange}
                    placeholder="A+, B+, O+ etc."
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    rows="2"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department || ''}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Degree Level</label>
                  <select
                    name="degree_level"
                    value={formData.degree_level || ''}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="">Select Degree</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="M.Sc.">M.Sc.</option>
                    <option value="Ph.D.">Ph.D.</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Room No</label>
                  <input
                    type="text"
                    name="room_no"
                    value={formData.room_no || ''}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Block</label>
                  <input
                    type="text"
                    name="block"
                    value={formData.block || ''}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth?.split('T')[0] || ''}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData(profile);
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-6 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            // ============================================
            // 📌 VIEW MODE
            // ============================================
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Full Name</p>
                <p className="text-sm font-semibold text-slate-800">{profile.name || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Student ID</p>
                <p className="text-sm font-semibold text-slate-800">{profile.student_id || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Email</p>
                <p className="text-sm font-semibold text-slate-800">{profile.email}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Phone</p>
                <p className="text-sm font-semibold text-slate-800">{profile.phone || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Father's Name</p>
                <p className="text-sm font-semibold text-slate-800">{profile.father_name || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Mother's Name</p>
                <p className="text-sm font-semibold text-slate-800">{profile.mother_name || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Department</p>
                <p className="text-sm font-semibold text-slate-800">{profile.department || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Degree Level</p>
                <p className="text-sm font-semibold text-slate-800">{profile.degree_level || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Room No</p>
                <p className="text-sm font-semibold text-slate-800">{profile.room_no || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Block</p>
                <p className="text-sm font-semibold text-slate-800">{profile.block || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Home District</p>
                <p className="text-sm font-semibold text-slate-800">{profile.home_district || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Blood Group</p>
                <p className="text-sm font-semibold text-slate-800">{profile.blood_group || 'N/A'}</p>
              </div>
              <div className="md:col-span-2 bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Address</p>
                <p className="text-sm font-semibold text-slate-800">{profile.address || 'N/A'}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Date of Birth</p>
                <p className="text-sm font-semibold text-slate-800">
                  {profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 font-bold uppercase">Member Since</p>
                <p className="text-sm font-semibold text-slate-800">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;