import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Notices() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/notices/public')
      .then((res) => setNotices(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f7f3]">
      <div className="bg-[#1b382b] py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-emerald-200 hover:text-white text-sm font-medium flex items-center gap-1 transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1b382b] mb-8">📢 Notices</h1>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : notices.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 text-center text-gray-400 text-sm">
            No notices published yet.
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((n) => (
              <div key={n.id} className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="font-bold text-[#1b382b] text-lg">{n.title}</h2>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {n.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}