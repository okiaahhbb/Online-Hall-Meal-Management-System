import { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import MealManagement from './MealManagement';
import Profile from './Profile';
import Payments from './Payments';
import axios from 'axios';

function getLocalDateStr(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMealDateStatus(date) {
  const now = new Date();
  const selected = new Date(date);
  selected.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const currentHour = now.getHours();

  if (selected.getTime() < today.getTime()) return 'past';
  if (selected.getTime() === today.getTime()) return 'today';
  if (selected.getTime() === tomorrow.getTime()) {
    return currentHour >= 0 && currentHour < 22 ? 'editable' : 'locked';
  }
  return 'future_locked';
}

export default function StudentApp() {
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [meals, setMeals] = useState({ breakfast: false, lunch: false, dinner: false });
  const [saveStatus, setSaveStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [allMeals, setAllMeals] = useState([]);
  const [myTokens, setMyTokens] = useState([]);
  const [hallSettings, setHallSettings] = useState({});

  const mealMeta = {
    breakfast: { icon: '🍳', label: 'Breakfast' },
    lunch: { icon: '🍛', label: 'Lunch' },
    dinner: { icon: '🍽️', label: 'Dinner' },
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchAllMeals = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/meals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllMeals(res.data);
    } catch (err) {
      console.error('Failed to load meals:', err);
    }
  };

  const fetchMyTokens = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/tokens', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyTokens(res.data);
    } catch (err) {
      console.error('Failed to load tokens:', err);
    }
  };

  const fetchHallSettings = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/hall-settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const settingsMap = {};
      res.data.forEach(s => { settingsMap[s.date] = s; });
      setHallSettings(settingsMap);
    } catch (err) {
      console.error('Failed to load hall settings:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAllMeals();
      fetchMyTokens();
      fetchHallSettings();
    }
  }, [user]);

  const handleDateSelectLogic = (targetDate) => {
    if (!targetDate) {
      setSelectedDate(null);
      return;
    }
    setSelectedDate(targetDate);
    setSaveStatus(null);
    setErrorMessage('');

    localStorage.setItem('selectedDate', targetDate.toISOString());
    const dateStr = getLocalDateStr(targetDate);
    const status = getMealDateStatus(targetDate);
    const dateSetting = hallSettings[dateStr];

    if (dateSetting?.is_hall_closed) {
      setMeals({ breakfast: false, lunch: false, dinner: false, isMealOff: false, isHallClosed: true });
      setIsEditing(false);
      setSaveStatus('saved');
      return;
    }

    if (dateSetting?.is_meal_off) {
      setMeals({ breakfast: false, lunch: false, dinner: false, isMealOff: true, isHallClosed: false });
      setIsEditing(false);
      setSaveStatus('saved');
      return;
    }

    const existing = allMeals.find((m) => {
      const mDate = typeof m.date === 'string' ? m.date.split('T')[0] : getLocalDateStr(new Date(m.date));
      return mDate === dateStr;
    });

    if (existing) {
      setMeals({
        breakfast: !!existing.breakfast,
        lunch: !!existing.lunch,
        dinner: !!existing.dinner,
        isMealOff: false,
        isHallClosed: false,
      });
      setIsEditing(false);
      setSaveStatus('saved');
    } else {
      setMeals({ breakfast: false, lunch: false, dinner: false, isMealOff: false, isHallClosed: false });
      setIsEditing(status === 'editable');
    }
  };

  useEffect(() => {
    if (allMeals.length > 0 && !selectedDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      handleDateSelectLogic(tomorrow);
    }
  }, [allMeals]);

  const handleSelectSlot = ({ start }) => {
    handleDateSelectLogic(start);
  };

  const toggleMeal = (mealType) => {
    if (!isEditing) return;
    setMeals((prev) => ({ ...prev, [mealType]: !prev[mealType] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedDate');
    setUser(null);
    setSelectedDate(null);
    setMyTokens([]);
    window.location.href = '/student';
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    const dateStr = getLocalDateStr(selectedDate);
    const status = getMealDateStatus(selectedDate);

    if (status !== 'editable') {
      setSaveStatus('error');
      setErrorMessage('Booking is not allowed for this date.');
      return;
    }

    setSaveStatus('saving');
    try {
      await axios.post(
        'http://localhost:5000/api/meals',
        {
          date: dateStr,
          breakfast: meals.breakfast,
          lunch: meals.lunch,
          dinner: meals.dinner,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaveStatus('saved');
      setIsEditing(false);
      const res = await axios.get('http://localhost:5000/api/meals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllMeals(res.data);
      await fetchMyTokens();
    } catch (err) {
      setSaveStatus('error');
      setErrorMessage(err.response?.data?.message || 'Failed to save.');
    }
  };

  const handleChangeSelection = () => {
    if (getMealDateStatus(selectedDate) !== 'editable') {
      alert('You cannot change this selection anymore!');
      return;
    }
    setIsEditing(true);
    setSaveStatus(null);
  };

  const getMealSummary = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let totalTaken = 0;
    let totalMissed = 0;
    let breakdown = [];

    allMeals.forEach((m) => {
      const d = new Date(m.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        const meals = [];
        if (m.breakfast) { totalTaken++; meals.push('breakfast'); }
        else { totalMissed++; }
        if (m.lunch) { totalTaken++; meals.push('lunch'); }
        else { totalMissed++; }
        if (m.dinner) { totalTaken++; meals.push('dinner'); }
        else { totalMissed++; }
        if (meals.length > 0) {
          breakdown.push({ date: m.date, meals });
        }
      }
    });
    return { totalTaken, totalMissed, breakdown };
  };

  const { totalTaken, totalMissed, breakdown } = getMealSummary();
  const unusedTokens = myTokens.filter(t => t.status === 'unused');
  const currentSelectedStatus = selectedDate ? getMealDateStatus(selectedDate) : null;

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
          start: d,
          end: d,
          status: meals_taken.length > 0 ? 'taken' : 'not_taken'
        });
      }
    });
    return events;
  };

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

  if (!user) return <Login onLoginSuccess={setUser} />;

  return (
    <div className="min-h-screen bg-[#f0f7f3] flex flex-col font-sans antialiased text-gray-800 h-screen overflow-hidden">
      
      {/* 🎨 Header - Dark Green */}
      <div className="bg-[#1b382b] text-white py-3 px-4 shadow-lg border-b-4 border-emerald-800/40 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center sm:text-left">
          <img src="/ruetlogo.jfif" alt="RUET Logo" className="w-12 h-12 object-contain rounded-full bg-white p-1 shadow-md border-2 border-emerald-700/40" onError={(e) => { e.target.style.display = 'none'; }} />
          <div>
            <h1 className="text-base sm:text-xl font-bold tracking-wide text-white">Rajshahi University of Engineering and Technology</h1>
            <p className="text-[10px] sm:text-xs text-emerald-300/60 font-medium tracking-wider">🌿 Female-2 Hall Smart Dining Portal</p>
          </div>
        </div>
      </div>

      {/* Subbar - Light */}
      <div className="bg-white/90 border-b border-emerald-100 px-4 sm:px-6 py-1.5 flex justify-between items-center text-xs font-semibold text-emerald-800 shadow-sm flex-shrink-0">
        <div className="flex gap-3 overflow-x-auto scrollbar-none">
          <button onClick={() => setActiveMenu('dashboard')} className="hover:text-emerald-600 transition whitespace-nowrap px-2 py-0.5 rounded-lg hover:bg-emerald-50">🏠 Home</button>
          <button className="hover:text-emerald-600 transition whitespace-nowrap px-2 py-0.5 rounded-lg hover:bg-emerald-50">📢 Notice</button>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-600 transition whitespace-nowrap px-2 py-0.5 rounded-lg hover:bg-red-50">🚪 Logout</button>
        </div>
        <div className="font-mono text-emerald-700 hidden sm:block bg-emerald-50 px-3 py-0.5 rounded-full text-[10px]">👋 Hi, <span className="font-bold">{user.name}</span></div>
      </div>

      <div className="flex flex-1 flex-col md:flex-row max-w-7xl w-full mx-auto overflow-hidden">
        {/* Sidebar - Light */}
        <div className="w-full md:w-48 bg-white border-b md:border-b-0 md:border-r border-emerald-100 p-2 md:p-3 shadow-sm flex-shrink-0">
          <nav className="flex md:flex-col gap-0.5 overflow-x-auto md:overflow-x-visible scrollbar-none">
            {[
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'meal-management', label: '🎫 Meal On Off' },
              { id: 'profile', label: '👤 Profile' },
              { id: 'payments', label: '💳 Payments' }
            ].map((menu) => (
              <button key={menu.id} onClick={() => setActiveMenu(menu.id)} className={`text-left px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-1 md:flex-none ${activeMenu === menu.id ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-600 hover:bg-emerald-50'}`}>
                {menu.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content - Light */}
        <div className="flex-1 p-3 sm:p-4 bg-[#f0f7f3] overflow-hidden h-full">
          {activeMenu === 'dashboard' && (
            <Dashboard
              allMeals={allMeals}
              myTokens={myTokens}
              hallSettings={hallSettings}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              handleSelectSlot={handleSelectSlot}
              totalTaken={totalTaken}
              totalMissed={totalMissed}
              breakdown={breakdown}
              unusedTokens={unusedTokens}
            />
          )}

          {activeMenu === 'meal-management' && (
            <MealManagement
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              handleSelectSlot={handleSelectSlot}
              selectedDate={selectedDate}
              meals={meals}
              isEditing={isEditing}
              currentSelectedStatus={currentSelectedStatus}
              saveStatus={saveStatus}
              errorMessage={errorMessage}
              toggleMeal={toggleMeal}
              handleSave={handleSave}
              handleChangeSelection={handleChangeSelection}
              calendarEvents={getCalendarEvents()}
              eventPropGetter={eventPropGetter}
              mealMeta={mealMeta}
              hallSettings={hallSettings}
            />
          )}

          {activeMenu === 'profile' && <Profile />}
          {activeMenu === 'payments' && <Payments />}
        </div>
      </div>
    </div>
  );
}