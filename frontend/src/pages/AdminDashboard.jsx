import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/admin';

function AdminDashboard({ admin, onLogout }) {
  const [activeTab, setActiveTab] = useState('students');

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
  });

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-lg font-bold">🛡️ Admin Panel — Female-2 Hall Dining</h1>
          <p className="text-xs text-slate-300">Hi, {admin.name}</p>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 flex gap-1 overflow-x-auto">
        {[
          { id: 'students', label: '👥 Students' },
          { id: 'meals', label: '🍽️ Meal Management' },
          { id: 'calendar', label: '📅 Calendar Control' },
          { id: 'billing', label: '💰 Billing' },
          { id: 'settings', label: '⚙️ Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
              activeTab === tab.id
                ? 'border-slate-800 text-slate-800'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        {activeTab === 'students' && <StudentsTab getHeaders={getHeaders} />}
        {activeTab === 'meals' && <MealsTab getHeaders={getHeaders} />}
        {activeTab === 'calendar' && <CalendarTab getHeaders={getHeaders} />}
        {activeTab === 'billing' && <BillingTab getHeaders={getHeaders} />}
        {activeTab === 'settings' && <SettingsTab getHeaders={getHeaders} />}
      </div>
    </div>
  );
}

// ================= STUDENTS TAB =================
function StudentsTab({ getHeaders }) {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/students`, getHeaders())
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.student_id && s.student_id.toLowerCase().includes(search.toLowerCase())) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-slate-800">Student List ({students.length})</h2>
        <input
          type="text"
          placeholder="Search by name, ID, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-slate-400"
        />
      </div>

      {loading ? (
        <p className="text-slate-400 text-sm">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 text-xs uppercase border-b border-slate-100">
                <th className="pb-2">Name</th>
                <th className="pb-2">Student ID</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2 font-medium text-slate-700">{s.name}</td>
                  <td className="py-2 text-slate-500">{s.student_id || '—'}</td>
                  <td className="py-2 text-slate-500">{s.email}</td>
                  <td className="py-2 text-slate-400 text-xs">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-6">No students found.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ================= MEALS TAB =================
function MealsTab({ getHeaders }) {
  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayDetail, setDayDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/meals/history`, getHeaders())
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openDay = async (date) => {
    setSelectedDate(date);
    try {
      const res = await axios.get(`${API}/meals/date/${date}`, getHeaders());
      setDayDetail(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Day-wise stack (history) */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h2 className="font-bold text-slate-800 mb-4">📊 Daily Meal Count History</h2>
        {loading ? (
          <p className="text-slate-400 text-sm">Loading...</p>
        ) : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {history.map((day) => (
              <button
                key={day.date}
                onClick={() => openDay(day.date)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                  selectedDate === day.date
                    ? 'border-slate-800 bg-slate-50'
                    : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 text-sm">{day.date}</span>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold">
                      🍳 {day.breakfast_count}
                    </span>
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold">
                      🍛 {day.lunch_count}
                    </span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">
                      🍽️ {day.dinner_count}
                    </span>
                  </div>
                </div>
              </button>
            ))}
            {history.length === 0 && (
              <p className="text-center text-slate-400 text-sm py-6">No meal data yet.</p>
            )}
          </div>
        )}
      </div>

      {/* Day detail */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h2 className="font-bold text-slate-800 mb-4">
          {selectedDate ? `📅 ${selectedDate}` : 'Select a day'}
        </h2>
        {selectedDate ? (
          <div className="space-y-2 max-h-[450px] overflow-y-auto">
            {dayDetail.map((d) => (
              <div key={d.id} className="p-2 border border-slate-100 rounded-lg">
                <p className="text-sm font-semibold text-slate-700">{d.name}</p>
                <p className="text-xs text-slate-400 mb-1">{d.student_id}</p>
                <div className="flex gap-1">
                  {d.breakfast ? (
                    <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">B</span>
                  ) : null}
                  {d.lunch ? (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">L</span>
                  ) : null}
                  {d.dinner ? (
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">D</span>
                  ) : null}
                </div>
              </div>
            ))}
            {dayDetail.length === 0 && (
              <p className="text-center text-slate-400 text-xs py-6">No records.</p>
            )}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">Click a day from the list to see details.</p>
        )}
      </div>
    </div>
  );
}

// ================= CALENDAR CONTROL TAB =================
function CalendarTab({ getHeaders }) {
  const [date, setDate] = useState('');
  const [isHallClosed, setIsHallClosed] = useState(false);
  const [isMealOff, setIsMealOff] = useState(false);
  const [note, setNote] = useState('');
  const [settings, setSettings] = useState([]);
  const [message, setMessage] = useState('');

  const loadSettings = () => {
    axios
      .get(`${API}/hall-settings`, getHeaders())
      .then((res) => setSettings(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!date) return;
    try {
      await axios.post(
        `${API}/hall-settings`,
        { date, is_hall_closed: isHallClosed, is_meal_off: isMealOff, note },
        getHeaders()
      );
      setMessage('✅ Saved successfully.');
      loadSettings();
    } catch (err) {
      setMessage('❌ Failed to save.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h2 className="font-bold text-slate-800 mb-4">📅 Set Hall / Meal Off</h2>
        <form onSubmit={handleSave} className="space-y-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
          <label className="flex items-center justify-between p-2 border border-slate-100 rounded-lg">
            <span className="text-sm">🛑 Hall Closed (entire hall)</span>
            <input
              type="checkbox"
              checked={isHallClosed}
              onChange={(e) => setIsHallClosed(e.target.checked)}
              className="w-5 h-5 accent-red-600"
            />
          </label>
          <label className="flex items-center justify-between p-2 border border-slate-100 rounded-lg">
            <span className="text-sm">🍽️ All Meals Off (this day)</span>
            <input
              type="checkbox"
              checked={isMealOff}
              onChange={(e) => setIsMealOff(e.target.checked)}
              className="w-5 h-5 accent-amber-600"
            />
          </label>
          <input
            type="text"
            placeholder="Note (optional) e.g. Holiday, maintenance"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 rounded-lg text-sm transition"
          >
            Save Setting
          </button>
          {message && <p className="text-xs text-center">{message}</p>}
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h2 className="font-bold text-slate-800 mb-4">📋 Existing Settings</h2>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {settings.map((s) => (
            <div key={s.id} className="p-2 border border-slate-100 rounded-lg text-sm">
              <p className="font-semibold text-slate-700">{s.date}</p>
              <div className="flex gap-2 mt-1">
                {s.is_hall_closed ? (
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded">Hall Closed</span>
                ) : null}
                {s.is_meal_off ? (
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Meal Off</span>
                ) : null}
              </div>
              {s.note && <p className="text-xs text-slate-400 mt-1">{s.note}</p>}
            </div>
          ))}
          {settings.length === 0 && (
            <p className="text-center text-slate-400 text-xs py-6">No settings configured.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= BILLING TAB =================
function BillingTab({ getHeaders }) {
  const [date, setDate] = useState('');
  const [breakfastRate, setBreakfastRate] = useState(40);
  const [lunchRate, setLunchRate] = useState(40);
  const [dinnerRate, setDinnerRate] = useState(40);
  const [rates, setRates] = useState([]);
  const [message, setMessage] = useState('');

  const loadRates = () => {
    axios
      .get(`${API}/meal-rates`, getHeaders())
      .then((res) => setRates(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!date) return;
    try {
      await axios.post(
        `${API}/meal-rates`,
        {
          date,
          breakfast_rate: breakfastRate,
          lunch_rate: lunchRate,
          dinner_rate: dinnerRate,
        },
        getHeaders()
      );
      setMessage('✅ Rate updated.');
      loadRates();
    } catch (err) {
      setMessage('❌ Failed to update.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h2 className="font-bold text-slate-800 mb-1">💰 Set Meal Rate</h2>
        <p className="text-xs text-slate-400 mb-4">Default: ৳40 per meal. Override for a specific day.</p>
        <form onSubmit={handleSave} className="space-y-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-slate-500">Breakfast (৳)</label>
              <input
                type="number"
                value={breakfastRate}
                onChange={(e) => setBreakfastRate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Lunch (৳)</label>
              <input
                type="number"
                value={lunchRate}
                onChange={(e) => setLunchRate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500">Dinner (৳)</label>
              <input
                type="number"
                value={dinnerRate}
                onChange={(e) => setDinnerRate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 rounded-lg text-sm transition"
          >
            Save Rate
          </button>
          {message && <p className="text-xs text-center">{message}</p>}
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <h2 className="font-bold text-slate-800 mb-4">📋 Rate Overrides</h2>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {rates.map((r) => (
            <div key={r.id} className="p-2 border border-slate-100 rounded-lg text-sm">
              <p className="font-semibold text-slate-700">{r.date}</p>
              <p className="text-xs text-slate-500">
                🍳 ৳{r.breakfast_rate} · 🍛 ৳{r.lunch_rate} · 🍽️ ৳{r.dinner_rate}
              </p>
            </div>
          ))}
          {rates.length === 0 && (
            <p className="text-center text-slate-400 text-xs py-6">
              No overrides yet. Default ৳40 applies everywhere.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ================= SETTINGS TAB (Change Password) =================
function SettingsTab({ getHeaders }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      await axios.post(
        `${API}/change-password`,
        { oldPassword, newPassword },
        getHeaders()
      );
      setMessage('✅ Password changed successfully.');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed to change password.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 max-w-md">
      <h2 className="font-bold text-slate-800 mb-4">⚙️ Change Password</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          placeholder="Current Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 rounded-lg text-sm transition disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Change Password'}
        </button>
        {message && <p className="text-xs text-center mt-1">{message}</p>}
      </form>
    </div>
  );
}

export default AdminDashboard;