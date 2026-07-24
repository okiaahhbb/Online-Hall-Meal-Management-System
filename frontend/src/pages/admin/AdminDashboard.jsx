import { useState } from 'react';
import StudentsTab from './StudentsTab';
import MealsTab from './MealsTab';
import CalendarTab from './CalendarTab';
import BillingTab from './BillingTab';
import SettingsTab from './SettingsTab';

const API = 'http://localhost:5000/api/admin';

export default function AdminDashboard({ admin, onLogout }) {
  const [activeTab, setActiveTab] = useState('students');

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
  });

  return (
    <div className="min-h-screen bg-[#f0f7f3]">
      {/* Header */}
      <div className="bg-[#1b382b] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-lg font-bold">🛡️ Admin Panel — Female-2 Hall</h1>
          <p className="text-xs text-emerald-300/70">Hi, {admin.name}</p>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-emerald-100 px-4 flex gap-1 overflow-x-auto">
        {[
          { id: 'students', label: '👥 Students' },
          { id: 'meals', label: '🍽️ Meals' },
          { id: 'calendar', label: '📅 Control' },
          { id: 'billing', label: '💰 Billing' },
          { id: 'settings', label: '⚙️ Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition ${
              activeTab === tab.id
                ? 'border-[#1b382b] text-[#1b382b]'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {activeTab === 'students' && <StudentsTab getHeaders={getHeaders} API={API} />}
        {activeTab === 'meals' && <MealsTab getHeaders={getHeaders} API={API} />}
        {activeTab === 'calendar' && <CalendarTab getHeaders={getHeaders} API={API} />}
        {activeTab === 'billing' && <BillingTab getHeaders={getHeaders} API={API} />}
        {activeTab === 'settings' && <SettingsTab getHeaders={getHeaders} API={API} />}
      </div>
    </div>
  );
}