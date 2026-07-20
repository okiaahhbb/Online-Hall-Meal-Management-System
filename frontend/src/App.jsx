import { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Login from './pages/Login';

const locales = {};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function App() {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [meals, setMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSelectSlot = ({ start }) => {
    setSelectedDate(start);
  };

  const toggleMeal = (mealType) => {
    setMeals((prev) => ({ ...prev, [mealType]: !prev[mealType] }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Login onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <div className="max-w-4xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">
          🍽️ Meal Management System
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-green-800 font-medium">Hi, {user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-5 border border-green-100">
        <Calendar
          localizer={localizer}
          events={[]}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          selectable
          onSelectSlot={handleSelectSlot}
        />
      </div>

      {selectedDate && (
        <div className="max-w-md mx-auto mt-6 bg-white rounded-xl shadow-md p-5 border border-green-100">
          <h2 className="text-lg font-semibold mb-4 text-green-800">
            📅 {selectedDate.toDateString()}
          </h2>

          <div className="space-y-3">
            {['breakfast', 'lunch', 'dinner'].map((mealType) => (
              <label
                key={mealType}
                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition ${
                  meals[mealType]
                    ? 'bg-green-100 border-green-400'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <span className="capitalize font-medium text-gray-700">
                  {mealType}
                </span>
                <input
                  type="checkbox"
                  checked={meals[mealType]}
                  onChange={() => toggleMeal(mealType)}
                  className="w-5 h-5 accent-green-600"
                />
              </label>
            ))}
          </div>

          <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition">
            Save Meal Selection
          </button>
        </div>
      )}
    </div>
  );
}

export default App;