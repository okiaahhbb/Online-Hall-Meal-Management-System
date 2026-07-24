import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { QRCodeSVG } from 'qrcode.react';
import TokenCard from '../components/TokenCard';

const locales = {};
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

function getLocalDateStr(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function Dashboard({ 
  allMeals, myTokens, hallSettings, currentDate, setCurrentDate, 
  handleSelectSlot, totalTaken, totalMissed, breakdown, unusedTokens 
}) {
  const [showMealBreakdown, setShowMealBreakdown] = useState(false);
  const [breakdownData, setBreakdownData] = useState([]);

  const getCalendarEvents = () => {
    const events = [];
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    allMeals.forEach((m) => {
      const d = new Date(m.date);
      if (d >= monthStart && d <= monthEnd) {
        const dateStr = getLocalDateStr(d);
        const setting = hallSettings[dateStr];
        if (setting?.is_hall_closed) {
          events.push({ title: '🚫', start: d, end: d, status: 'hall_closed' });
          return;
        }
        if (setting?.is_meal_off) {
          events.push({ title: '⛔', start: d, end: d, status: 'meal_off' });
          return;
        }
        const meals_taken = [];
        if (m.breakfast) meals_taken.push('🍳');
        if (m.lunch) meals_taken.push('🍛');
        if (m.dinner) meals_taken.push('🍽️');
        events.push({ 
          title: meals_taken.length > 0 ? meals_taken.join('') : '⚪', 
          start: d, end: d, 
          status: meals_taken.length > 0 ? 'taken' : 'not_taken' 
        });
      }
    });
    return events;
  };

  const calendarEvents = getCalendarEvents();

  const eventPropGetter = (event) => {
    const colors = {
      taken: { bg: '#10b981', text: '#fff' },
      meal_off: { bg: '#f59e0b', text: '#fff' },
      hall_closed: { bg: '#ef4444', text: '#fff' },
      not_taken: { bg: '#f3f4f6', text: '#9ca3af' }
    };
    const c = colors[event.status] || colors.not_taken;
    return {
      style: {
        backgroundColor: c.bg,
        color: c.text,
        borderRadius: '4px',
        padding: '2px 4px',
        fontSize: '10px',
        border: 'none',
        fontWeight: '600',
      }
    };
  };

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Welcome */}
      <div className="flex items-center justify-between flex-shrink-0">
        <h2 className="text-lg font-bold text-[#1b382b]">📊 Dashboard</h2>
        <span className="text-xs text-emerald-700/60 bg-white px-3 py-0.5 rounded-full shadow-sm border border-emerald-100">
          📅 {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Summary Cards - White with Green */}
      <div className="flex-shrink-0">
        <div 
          className="bg-white rounded-xl shadow-sm border border-emerald-100 p-4 cursor-pointer hover:shadow-md transition-all"
          onClick={() => { setBreakdownData(breakdown); setShowMealBreakdown(true); }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Meals Taken</p>
              <p className="text-2xl font-bold text-emerald-600">{totalTaken}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">This month</p>
            </div>
            <div className="text-3xl opacity-60">🍽️</div>
          </div>
          <p className="text-[10px] text-emerald-500 mt-1">👆 Click to view breakdown</p>
        </div>
      </div>

      {/* Calendar + Tokens */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 flex-1 min-h-0">
        {/* Calendar - White */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-emerald-100 p-2 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-1 flex-shrink-0">
            <h3 className="text-xs font-semibold text-[#1b382b]">{new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</h3>
            <div className="flex gap-1.5 text-[8px]">
              <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded bg-emerald-500"></span> Taken</span>
              <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded bg-orange-400"></span> Off</span>
              <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded bg-red-500"></span> Closed</span>
              <span className="flex items-center gap-0.5"><span className="w-2 h-2 rounded bg-gray-200"></span> Empty</span>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <Calendar 
              localizer={localizer} 
              events={calendarEvents}
              startAccessor="start" endAccessor="end" 
              style={{ height: '100%' }} 
              selectable 
              date={currentDate} 
              onNavigate={setCurrentDate} 
              onSelectSlot={handleSelectSlot} 
              views={['month']} defaultView="month"
              eventPropGetter={eventPropGetter}
              components={{ event: ({ event }) => <div className="text-center text-[8px] font-bold truncate leading-none">{event.title}</div> }}
            />
          </div>
        </div>

        {/* Active Tokens - White */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-emerald-100 p-2 flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-1 border-b border-emerald-100 pb-1 flex-shrink-0">
            <h3 className="text-xs font-semibold text-[#1b382b]">🎫 Active Tokens</h3>
            <span className="text-[9px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
              {unusedTokens.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
            {unusedTokens.length === 0 ? (
              <div className="text-center py-3">
                <p className="text-2xl mb-0.5">🎯</p>
                <p className="text-[10px] text-gray-400">No active tokens</p>
              </div>
            ) : (
              unusedTokens.slice(0, 4).map((t) => (
                <TokenCard key={t.id} token={t} />
              ))
            )}
            {unusedTokens.length > 4 && (
              <p className="text-[9px] text-gray-400 text-center">+{unusedTokens.length - 4} more</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal - White */}
      {showMealBreakdown && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden shadow-xl">
            <div className="px-4 py-2.5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-sm font-bold text-[#1b382b]">📊 Meal Breakdown</h3>
              <button onClick={() => setShowMealBreakdown(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
            </div>
            <div className="p-3 overflow-y-auto max-h-[350px] space-y-1.5">
              {breakdownData.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-2xl mb-1">🍽️</p>
                  <p className="text-xs text-gray-400">No meals taken this month</p>
                </div>
              ) : (
                breakdownData.map((item, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                    <p className="text-xs font-medium text-gray-700">{item.date}</p>
                    <div className="flex gap-1 mt-0.5 flex-wrap">
                      {item.meals.includes('breakfast') && (
                        <span className="text-[8px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-full">🍳 B</span>
                      )}
                      {item.meals.includes('lunch') && (
                        <span className="text-[8px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">🍛 L</span>
                      )}
                      {item.meals.includes('dinner') && (
                        <span className="text-[8px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">🍽️ D</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}