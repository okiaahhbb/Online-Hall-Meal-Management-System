import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MealsTab({ getHeaders, API }) {
  const [history, setHistory] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayDetail, setDayDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/meals/history`, getHeaders())
      .then(res => setHistory(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const openDay = async (date) => {
    setSelectedDate(date);
    try {
      const res = await axios.get(`${API}/meals/date/${date}`, getHeaders());
      setDayDetail(res.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-emerald-100 p-4">
        <h2 className="font-bold text-[#1b382b] mb-4">📊 Daily Meal History</h2>
        {loading ? <p className="text-slate-400 text-sm">Loading...</p> : (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {history.map(day => (
              <button key={day.date} onClick={() => openDay(day.date)} className={`w-full text-left p-3 rounded-lg border transition ${selectedDate === day.date ? 'border-emerald-600 bg-emerald-50' : 'border-emerald-100 hover:bg-emerald-50'}`}>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 text-sm">{day.date}</span>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold">🍳 {day.breakfast_count}</span>
                    <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold">🍛 {day.lunch_count}</span>
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold">🍽️ {day.dinner_count}</span>
                  </div>
                </div>
              </button>
            ))}
            {history.length === 0 && <p className="text-center text-slate-400 text-sm py-6">No meal data yet.</p>}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4">
        <h2 className="font-bold text-[#1b382b] mb-4">{selectedDate ? `📅 ${selectedDate}` : 'Select a day'}</h2>
        {selectedDate ? (
          <div className="space-y-2 max-h-[450px] overflow-y-auto">
            {dayDetail.map(d => (
              <div key={d.id} className="p-2 border border-emerald-100 rounded-lg">
                <p className="text-sm font-semibold text-slate-700">{d.name}</p>
                <p className="text-xs text-slate-400">{d.student_id}</p>
                <div className="flex gap-1 mt-1">
                  {d.breakfast && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">B</span>}
                  {d.lunch && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">L</span>}
                  {d.dinner && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">D</span>}
                </div>
              </div>
            ))}
            {dayDetail.length === 0 && <p className="text-center text-slate-400 text-xs py-6">No records.</p>}
          </div>
        ) : <p className="text-slate-400 text-sm">Click a day from the list.</p>}
      </div>
    </div>
  );
}