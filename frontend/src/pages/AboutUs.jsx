import { useNavigate } from 'react-router-dom';

export default function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f0f7f3]">
      {/* Simple top bar */}
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
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1b382b] mb-6">
          🏠 About Female-2 Hall
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 sm:p-8 space-y-5 text-gray-600 text-sm sm:text-base leading-relaxed">
          <p>
            <strong className="text-[#1b382b]">RUET Female-2 Hall</strong> is one of the
            residential halls at Rajshahi University of Engineering and Technology, established
            to provide safe, comfortable, and supportive accommodation for female students
            pursuing their academic goals.
          </p>

          <p>
            The hall is committed to fostering an environment where students can focus on their
            studies while enjoying a strong sense of community. With modern facilities and
            dedicated staff, Female-2 Hall aims to make campus life smooth and worry-free for
            every resident.
          </p>

          <h2 className="text-xl font-bold text-[#1b382b] pt-2">🎯 Our Mission</h2>
          <p>
            To provide a secure, well-managed, and student-friendly residential experience that
            supports academic excellence and personal growth, backed by transparent and efficient
            hall management systems — including our Smart Dining Portal for digital meal
            management.
          </p>

          <h2 className="text-xl font-bold text-[#1b382b] pt-2">🏢 Facilities</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Digital dining system with QR-based meal tokens</li>
            <li>24/7 security and CCTV surveillance</li>
            <li>High-speed WiFi throughout the hall</li>
            <li>Dedicated study rooms and common areas</li>
            <li>On-call medical support</li>
          </ul>

          <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
            This page is a placeholder and will be updated with official information from the
            hall administration.
          </p>
        </div>
      </div>
    </div>
  );
}