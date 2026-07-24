import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BillingTab({ getHeaders, API }) {
  const [date, setDate] = useState('');
  const [breakfastRate, setBreakfastRate] = useState(40);
  const [lunchRate, setLunchRate] = useState(40);
  const [dinnerRate, setDinnerRate] = useState(40);
  const [rates, setRates] = useState([]);
  const [message, setMessage] = useState('');

  const loadRates = () => {
    axios.get(`${API}/meal-rates`, getHeaders())
      .then(res => setRates(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { loadRates(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!date) return;
    try {
      await axios.post(`${API}/meal-rates`, { date, breakfast_rate: breakfastRate, lunch_rate: lunchRate, dinner_rate: dinnerRate }, getHeaders());
      setMessage('✅ Rate updated.');
      loadRates();
    } catch (err) { setMessage('❌ Failed.'); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4">
        <h2 className="font-bold text-[#1b382b] mb-1">💰 Set Meal Rate</h2>
        <p className="text-xs text-slate-400 mb-4">Default: ৳40 per meal.</p>
        <form onSubmit={handleSave} className="space-y-3">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full border border-emerald-200 rounded-lg px-3 py-2 text-sm" />
          <div className="grid grid-cols-3 gap-2">
            <div><label className="text-xs text-slate-500">Breakfast</label><input type="number" value={breakfastRate} onChange={e => setBreakfastRate(Number(e.target.value))} className="w-full border border-emerald-200 rounded-lg px-2 py-1.5 text-sm" /></div>
            <div><label className="text-xs text-slate-500">Lunch</label><input type="number" value={lunchRate} onChange={e => setLunchRate(Number(e.target.value))} className="w-full border border-emerald-200 rounded-lg px-2 py-1.5 text-sm" /></div>
            <div><label className="text-xs text-slate-500">Dinner</label><input type="number" value={dinnerRate} onChange={e => setDinnerRate(Number(e.target.value))} className="w-full border border-emerald-200 rounded-lg px-2 py-1.5 text-sm" /></div>
          </div>
          <button type="submit" className="w-full bg-[#1b382b] hover:bg-[#244234] text-white font-semibold py-2 rounded-lg text-sm transition">Save Rate</button>
          {message && <p className="text-xs text-center">{message}</p>}
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4">
        <h2 className="font-bold text-[#1b382b] mb-4">📋 Rate Overrides</h2>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {rates.map(r => (
            <div key={r.id} className="p-2 border border-emerald-100 rounded-lg text-sm">
              <p className="font-semibold text-slate-700">{r.date}</p>
              <p className="text-xs text-slate-500">🍳 ৳{r.breakfast_rate} · 🍛 ৳{r.lunch_rate} · 🍽️ ৳{r.dinner_rate}</p>
            </div>
          ))}
          {rates.length === 0 && <p className="text-center text-slate-400 text-xs py-6">No overrides yet.</p>}
        </div>
      </div>
    </div>
  );
}