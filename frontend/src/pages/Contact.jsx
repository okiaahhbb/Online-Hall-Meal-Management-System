import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f7f3]">
      <div className="bg-[#1b382b] py-4 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-emerald-200 hover:text-white text-sm font-medium flex items-center gap-1 transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1b382b] mb-8">📞 Contact Us</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
            <div className="text-3xl mb-2">👩‍💼</div>
            <h3 className="font-bold text-[#1b382b] mb-1">Provost's Office</h3>
            <p className="text-sm text-gray-500 mb-3">Assistant Provost — Tahmina Khatun</p>
            <p className="text-sm text-gray-600">📞 +880-1744960545</p>
            <p className="text-sm text-gray-600 break-all">✉️ tahmina16swapna@gmail.com</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
            <div className="text-3xl mb-2">🏠</div>
            <h3 className="font-bold text-[#1b382b] mb-1">Hall Office</h3>
            <p className="text-sm text-gray-600">📍 RUET Campus, Kazla, Rajshahi-6204</p>
            <p className="text-sm text-gray-600">✉️ female2hall@ruet.ac.bd</p>
            <p className="text-sm text-gray-600">🕐 Sun – Thu, 9AM – 5PM</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 sm:col-span-2">
            <div className="text-3xl mb-2">🚨</div>
            <h3 className="font-bold text-[#1b382b] mb-1">Emergency / Medical</h3>
            <p className="text-sm text-gray-600">
              24/7 support available at the hall office. Please contact hall staff directly for
              urgent matters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}