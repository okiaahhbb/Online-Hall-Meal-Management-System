import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {};
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

function getLocalDateStr(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function MealManagement({
  currentDate, setCurrentDate, handleSelectSlot,
  selectedDate, meals, isEditing, currentSelectedStatus,
  saveStatus, errorMessage, toggleMeal, handleSave, handleChangeSelection,
  calendarEvents, eventPropGetter, mealMeta, hallSettings,
  isTokenAlreadyTaken
}) {
  return (
    <div className="h-full flex flex-col gap-2">
      <div className="bg-white p-3 rounded-xl shadow-lg border border-emerald-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-shrink-0">
        <div><h2 className="text-sm font-bold text-gray-800">🎫 Meal On/Off Portal</h2><p className="text-[10px] text-gray-400">Tap a date to control your dining orders.</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-1 min-h-0">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-3 border border-emerald-100/80 flex flex-col min-h-0">
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
              components={{ event: ({ event }) => <div className="text-center text-[9px] font-bold truncate leading-none">{event.title}</div> }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 border border-emerald-100/80 overflow-y-auto">
          {selectedDate ? (
            <>
              <div className="flex justify-between items-center border-b border-emerald-100 pb-2 mb-2">
                <h3 className="text-xs font-bold text-gray-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                  📅 {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </h3>
                <button onClick={() => handleSelectSlot({ start: null })} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
              </div>

              {meals.isMealOff || meals.isHallClosed ? (
                <div className={`p-3 text-center border rounded-lg text-xs font-bold ${meals.isHallClosed ? 'bg-red-50 border-red-200 text-red-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
                  🛑 {meals.isHallClosed ? '🏠 Hall Dining Closed' : '⛔ All Meals Off'}
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    {['breakfast', 'lunch', 'dinner'].map((type) => {
                      const active = meals[type];
                      return (
                        <label key={type} className={`flex items-center justify-between p-2 border rounded-lg transition-all ${isEditing ? 'cursor-pointer hover:bg-emerald-50/50' : 'cursor-not-allowed opacity-70 bg-gray-50 text-gray-400'} ${active && isEditing ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900' : 'border-gray-100'}`}>
                          <span className="text-xs flex items-center gap-1.5">{mealMeta[type].icon} {mealMeta[type].label}</span>
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] border-2 ${active ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 text-transparent'}`}>✓</span>
                          <input type="checkbox" checked={active} onChange={() => isEditing && toggleMeal(type)} disabled={!isEditing} className="hidden" />
                        </label>
                      );
                    })}
                  </div>

                  {isEditing && currentSelectedStatus === 'editable' && (
                    <button onClick={handleSave} disabled={saveStatus === 'saving'} className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 rounded-lg shadow-sm transition disabled:opacity-50">
                      {saveStatus === 'saving' ? '⏳...' : '✅ Confirm'}
                    </button>
                  )}

                  {((saveStatus === 'saved') || (!isEditing && isTokenAlreadyTaken)) && currentSelectedStatus === 'editable' && (
                    <div className="mt-2 space-y-1.5">
                      <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-2 rounded-lg text-center text-[10px] leading-relaxed font-medium">
                        🎫 <strong>Saved.</strong> You can still change it till 10:00 PM.
                      </div>
                      <button onClick={handleChangeSelection} className="w-full border border-emerald-500 text-emerald-600 py-1.5 rounded-lg text-[10px] font-bold hover:bg-emerald-50/30 transition">
                        ✏️ Modify Settings
                      </button>
                    </div>
                  )}

                  {currentSelectedStatus === 'locked' && (
                    <div className="mt-2 p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-[10px] text-center font-medium">🔒 10:00 PM cutoff passed.</div>
                  )}
                  {currentSelectedStatus === 'future_locked' && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-[10px] text-center font-medium">⏳ Opens 12:00 AM day before.</div>
                  )}
                  {(currentSelectedStatus === 'past' || currentSelectedStatus === 'today') && (
                    <div className="mt-2 p-2 bg-gray-100 text-gray-500 rounded-lg text-[10px] text-center font-medium">📊 History only</div>
                  )}
                  {saveStatus === 'error' && (
                    <p className="text-[10px] text-rose-600 bg-rose-50 border border-rose-100 rounded-lg p-1.5 mt-1.5 text-center">❌ {errorMessage}</p>
                  )}
                </>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-400 text-xs">👆 Tap a date</div>
          )}
        </div>
      </div>
    </div>
  );
}