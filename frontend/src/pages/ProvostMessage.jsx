import { useNavigate } from 'react-router-dom';

export default function ProvostMessage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f7f3]">
      {/* Top bar */}
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
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1b382b] mb-8">
          👩‍💼 Provost's Message
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 sm:p-8">
          {/* Profile block */}
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center mb-6 pb-6 border-b border-gray-100">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-4xl flex-shrink-0">
              👩‍🏫
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1b382b]">Tahmina Khatun</h2>
              <p className="text-sm text-emerald-700 font-medium">
                Assistant Provost, Female-2 Hall
              </p>
              <p className="text-sm text-gray-500">
                Assistant Professor, Dept. of Humanities
              </p>
              <p className="text-sm text-gray-500">
                Rajshahi University of Engineering &amp; Technology
              </p>
            </div>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide mb-1">📞 Phone</p>
              <p className="text-sm font-semibold text-[#1b382b]">+880-1744960545</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide mb-1">✉️ Email</p>
              <p className="text-sm font-semibold text-[#1b382b] break-all">tahmina16swapna@gmail.com</p>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
            <h3 className="text-lg font-bold text-[#1b382b]">Message</h3>
            <p>
              Welcome to Female-2 Hall. As Assistant Provost, my priority is to ensure every
              resident feels safe, supported, and at home during their time at RUET. We are
              continuously working to improve hall facilities, including our digital dining
              system, to make daily life easier for our students.
            </p>
            <p>
              I encourage all residents to reach out with any concerns or suggestions — the hall
              office and administration are always here to help.
            </p>
            <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
              Note: This is a placeholder message and will be updated with the Assistant
              Provost's official statement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}