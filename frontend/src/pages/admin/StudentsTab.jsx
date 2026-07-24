import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentsTab({ getHeaders, API }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    student_id: '',
    phone: '',
    father_name: '',
    mother_name: '',
    home_district: '',
    department: '',
    room_no: '',
    block: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API}/students`, getHeaders());
      setStudents(res.data || []);
    } catch (err) {
      console.error('Failed to load students:', err);
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      student_id: '',
      phone: '',
      father_name: '',
      mother_name: '',
      home_district: '',
      department: '',
      room_no: '',
      block: '',
      address: ''
    });
    setEditingStudent(null);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (editingStudent) {
        await axios.put(`${API}/students/${editingStudent.id}`, formData, getHeaders());
        setMessage('✅ Student updated successfully!');
      } else {
        await axios.post(`${API}/students`, formData, getHeaders());
        setMessage('✅ Student registered successfully!');
      }
      setShowModal(false);
      fetchStudents();
      resetForm();
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Operation failed'));
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await axios.delete(`${API}/students/${id}`, getHeaders());
      fetchStudents();
    } catch (err) {
      alert('Failed to delete student');
    }
  };

  const openEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || '',
      email: student.email || '',
      password: '',
      student_id: student.student_id || '',
      phone: student.phone || '',
      father_name: student.father_name || '',
      mother_name: student.mother_name || '',
      home_district: student.home_district || '',
      department: student.department || '',
      room_no: student.room_no || '',
      block: student.block || '',
      address: student.address || ''
    });
    setShowModal(true);
  };

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.student_id?.toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4">
        <div className="text-center py-8">
          <p className="text-red-500 text-sm font-medium">⚠️ {error}</p>
          <button onClick={fetchStudents} className="mt-3 bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <h2 className="font-bold text-[#1b382b]">👥 Student List ({students.length})</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by name, ID, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-emerald-200 rounded-lg px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-4 py-1.5 rounded-lg transition"
          >
            ➕ Add Student
          </button>
        </div>
      </div>

      {message && (
        <div className={`mb-3 p-2 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p className="text-slate-400 text-sm text-center py-8">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f0f7f3]">
              <tr className="text-left text-[#1b382b] text-xs uppercase">
                <th className="p-2">Name</th>
                <th className="p-2">Student ID</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Room</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-slate-400 text-sm py-8">
                    {students.length === 0 ? 'No students found. Add a new student using the "Add Student" button.' : 'No matching students found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-emerald-50/30 transition">
                    <td className="p-2 font-medium text-slate-700">{s.name}</td>
                    <td className="p-2 text-slate-500 text-xs">{s.student_id || '—'}</td>
                    <td className="p-2 text-slate-500 text-xs">{s.email}</td>
                    <td className="p-2 text-slate-500 text-xs">{s.phone || '—'}</td>
                    <td className="p-2 text-slate-500 text-xs">{s.room_no || '—'}</td>
                    <td className="p-2">
                      <button
                        onClick={() => openEdit(s)}
                        className="text-emerald-600 hover:text-emerald-800 text-xs font-medium mr-2"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.name)}
                        className="text-red-500 hover:text-red-700 text-xs font-medium"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="bg-[#1b382b] px-6 py-3 flex justify-between items-center sticky top-0">
              <h3 className="text-white font-bold text-sm">
                {editingStudent ? '✏️ Edit Student' : '➕ Register New Student'}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-white text-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Full Name *</label>
                  <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Email *</label>
                  <input name="email" type="email" value={formData.email} onChange={handleInputChange} required className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                </div>
                {!editingStudent && (
                  <div>
                    <label className="text-[10px] text-gray-400 font-bold uppercase">Password *</label>
                    <input name="password" type="password" value={formData.password} onChange={handleInputChange} required={!editingStudent} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                  </div>
                )}
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Student ID</label>
                  <input name="student_id" value={formData.student_id} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Phone</label>
                  <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Department</label>
                  <input name="department" value={formData.department} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Room No</label>
                  <input name="room_no" value={formData.room_no} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Block</label>
                  <input name="block" value={formData.block} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Father's Name</label>
                  <input name="father_name" value={formData.father_name} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Mother's Name</label>
                  <input name="mother_name" value={formData.mother_name} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Home District</label>
                  <input name="home_district" value={formData.home_district} onChange={handleInputChange} className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Address</label>
                  <textarea name="address" value={formData.address} onChange={handleInputChange} rows="2" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                </div>
              </div>

              {message && (
                <div className={`text-sm p-2 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message}
                </div>
              )}

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg transition text-sm">
                {editingStudent ? '💾 Update Student' : '➕ Register Student'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}