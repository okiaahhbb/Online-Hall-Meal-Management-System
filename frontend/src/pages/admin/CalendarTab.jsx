import { useState, useEffect } from 'react';
import axios from 'axios';

export default function CalendarTab({ getHeaders, API }) {
  const [date, setDate] = useState('');
  const [isHallClosed, setIsHallClosed] = useState(false);
  const [isMealOff, setIsMealOff] = useState(false);
  const [note, setNote] = useState('');
  const [settings, setSettings] = useState([]);
  const [message, setMessage] = useState('');

  const loadSettings = () => {
    axios.get(`${API}/hall-settings`, getHeaders())
      .then(res => setSettings(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { loadSettings(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!date) return;
    try {
      await axios.post(`${API}/hall-settings`, { date, is_hall_closed: isHallClosed, is_meal_off: isMealOff, note }, getHeaders());
      setMessage('✅ Saved.');
      loadSettings();
    } catch (err) { setMessage('❌ Failed.'); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4">
        <h2 className="font-bold text-[#1b382b] mb-4">📅 Set Hall / Meal Off</h2>
        <form onSubmit={handleSave} className="space-y-3">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm" />
          <label className="flex items-center justify-between p-2 border border-emerald-100 rounded-lg">
            <span className="text-sm">🛑 Hall Closed</span>
            <input type="checkbox" checked={isHallClosed} onChange={e => setIsHallClosed(e.target.checked)} className="w-5 h-5 accent-red-600" />
          </label>
          <label className="flex items-center justify-between p-2 border border-emerald-100 rounded-lg">
            <span className="text-sm">🍽️ All Meals Off</span>
            <input type="checkbox" checked={isMealOff} onChange={e => setIsMealOff(e.target.checked)} className="w-5 h-5 accent-amber-600" />
          </label>
          <input type="text" placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm" />
          <button type="submit" className="w-full bg-[#1b382b] hover:bg-[#244234] text-white font-semibold py-2 rounded-lg text-sm transition">Save Setting</button>
          {message && <p className="text-xs text-center">{message}</p>}
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4">
        <h2 className="font-bold text-[#1b382b] mb-4">📋 Existing Settings</h2>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {settings.map(s => (
            <div key={s.id} className="p-2 border border-emerald-100 rounded-lg text-sm">
              <p className="font-semibold text-slate-700">{s.date}</p>
              <div className="flex gap-2 mt-1">
                {s.is_hall_closed && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded">Hall Closed</span>}
                {s.is_meal_off && <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Meal Off</span>}
              </div>
              {s.note && <p className="text-xs text-slate-400 mt-1">{s.note}</p>}
            </div>
          ))}
          {settings.length === 0 && <p className="text-center text-slate-400 text-xs py-6">No settings.</p>}
        </div>
      </div>
    </div>
  );
}