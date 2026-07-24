import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const images = ['/hallpic.jpg', '/hallpic2.jpg', '/hallpic3.jpg'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = ['Home', 'About Us', "Provost's Message", 'Notices', 'Feedback', 'Contact'];

  const handleNavClick = (link) => {
    setMenuOpen(false);
    if (link === 'About Us') navigate('/about');
    else if (link === "Provost's Message") navigate('/provost');
    else if (link === 'Notices') navigate('/notices');
    else if (link === 'Feedback') navigate('/feedback');
    else if (link === 'Contact') navigate('/contact');
    else if (link === 'Home') navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#f0f7f3] overflow-x-hidden">

      {/* 🔝 Top Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#1b382b] shadow-lg py-2' : 'bg-[#1b382b]/80 backdrop-blur-sm py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/ruetlogo.jfif"
              alt="RUET Logo"
              className="w-9 h-9 rounded-full bg-white p-0.5"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-white font-bold text-sm sm:text-base">Female-2 Hall</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => handleNavClick(link)}
                className="text-emerald-100/80 hover:text-emerald-300 text-sm font-medium transition"
              >
                {link}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white text-2xl"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#1b382b] px-4 pb-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link}
                onClick={() => handleNavClick(link)}
                className="text-emerald-100/80 hover:text-emerald-300 text-sm font-medium text-left transition"
              >
                {link}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* 🎬 Hero Carousel */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        {images.map((img, index) => (
          <img
            key={img}
            src={img}
            alt={`Hall view ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === current ? 'opacity-100' : 'opacity-0'
            }`}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1b382b]/70 via-[#1b382b]/50 to-[#f0f7f3]"></div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            🎓 RUET Residential Hall
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">
            Female-2 Hall
          </h1>
          <p className="text-emerald-300 text-lg sm:text-xl font-medium mb-2">
            Smart Dining Management
          </p>
          <p className="text-emerald-100/90 text-sm sm:text-base drop-shadow-md">
            Rajshahi University of Engineering and Technology
          </p>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* 📇 Quick Info Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <InfoCard icon="👩‍💼" title="Provost's Office" line1="For administrative matters" line2="Available on working days" />
          <InfoCard icon="🚨" title="Emergency / Medical" line1="24/7 support at hall office" line2="Contact hall staff anytime" />
          <InfoCard icon="📍" title="Location" line1="RUET Campus, Rajshahi" line2="Female-2 Residential Hall" />
        </div>
      </div>

      {/* 📋 Info + Choose Role Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1b382b] mb-4">
              🏠 About Female-2 Hall
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
              RUET Female-2 Hall is a premier residential hall for female students, providing a
              safe, comfortable, and nurturing environment for academic excellence. Our Smart
              Dining Portal lets students manage meals digitally with QR-based tokens.
            </p>

            <div className="space-y-3">
              <FeatureLine icon="🍽️" text="Digital meal booking with QR code tokens" />
              <FeatureLine icon="🔒" text="24/7 security & CCTV surveillance" />
              <FeatureLine icon="📶" text="Free high-speed WiFi throughout the hall" />
              <FeatureLine icon="⚕️" text="24/7 medical support at hall office" />
              <FeatureLine icon="📚" text="Quiet study rooms & common spaces" />
            </div>

            <button
              onClick={() => navigate('/about')}
              className="mt-6 text-sm font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 transition"
            >
              Read more about us →
            </button>
          </div>

          <div className="bg-[#1b382b] rounded-2xl p-8 shadow-xl border border-emerald-400/20">
            <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Get Started
            </span>
            <h3 className="text-2xl font-bold text-white mb-2">Choose Your Role</h3>
            <p className="text-emerald-100/60 text-sm mb-6">
              Login to access your personalized dashboard
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/student')}
                className="group w-full relative bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 px-5 rounded-xl transition-all duration-300 flex items-center justify-between overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative flex items-center gap-3">
                  <span className="text-2xl">👨‍🎓</span>
                  <span>
                    <span className="block text-left">Student Login</span>
                    <span className="block text-[10px] font-normal opacity-70 text-left">
                      Book meals, view tokens & bills
                    </span>
                  </span>
                </span>
                <span className="relative text-xl">→</span>
              </button>

              <button
                onClick={() => navigate('/admin')}
                className="group w-full relative bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-5 rounded-xl transition-all duration-300 border border-emerald-400/30 flex items-center justify-between overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative flex items-center gap-3">
                  <span className="text-2xl">🛡️</span>
                  <span>
                    <span className="block text-left">Admin Login</span>
                    <span className="block text-[10px] font-normal opacity-70 text-left">
                      Manage students, meals & billing
                    </span>
                  </span>
                </span>
                <span className="relative text-xl">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🗺️ Location / Google Map Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1b382b] mb-3">📍 Our Location</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Rajshahi University of Engineering &amp; Technology (RUET), Kazla, Rajshahi-6204, Bangladesh.
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>🕐 <strong className="text-[#1b382b]">Office Hours:</strong> Sunday – Thursday, 9AM – 5PM</p>
              <p>📞 <strong className="text-[#1b382b]">Hall Office:</strong> Contact via Provost's Office</p>
              <p>✉️ <strong className="text-[#1b382b]">Email:</strong> female2hall@ruet.ac.bd</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-emerald-100 h-72 sm:h-80">
            <iframe
              title="RUET Location Map"
              src="https://www.google.com/maps?q=Rajshahi+University+of+Engineering+and+Technology&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      {/* 🦶 Footer */}
      <div className="bg-[#0f231a] text-emerald-100/70 pt-12 pb-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <img
                src="/ruetlogo.jfif"
                alt="RUET Logo"
                className="w-8 h-8 rounded-full bg-white p-0.5"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="text-white font-bold">Female-2 Hall</span>
            </div>
            <p className="text-xs leading-relaxed">
              Smart Dining Management System for RUET Female-2 Hall residents.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Navigation</h4>
            <div className="flex flex-col gap-2 text-xs">
              {navLinks.map((link) => (
                <button
                  key={link}
                  onClick={() => handleNavClick(link)}
                  className="text-left hover:text-emerald-300 transition w-fit"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Quick Access</h4>
            <div className="flex flex-col gap-2 text-xs">
              <button onClick={() => navigate('/student')} className="text-left hover:text-emerald-300 transition w-fit">
                Student Login
              </button>
              <button onClick={() => navigate('/admin')} className="text-left hover:text-emerald-300 transition w-fit">
                Admin Login
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-emerald-800/40 pt-4 text-center">
          <p className="text-[10px] text-emerald-400/50">
            © {new Date().getFullYear()} RUET Female-2 Hall | Smart Dining Management System
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, line1, line2 }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-emerald-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-bold text-[#1b382b] text-sm mb-1">{title}</h4>
      <p className="text-xs text-gray-500">{line1}</p>
      <p className="text-xs text-gray-500">{line2}</p>
    </div>
  );
}

function FeatureLine({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-700">
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
    </div>
  );
}