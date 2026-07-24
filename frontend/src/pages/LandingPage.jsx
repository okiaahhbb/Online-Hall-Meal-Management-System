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

  return (
    <div className="min-h-screen bg-[#fdf8f0] overflow-x-hidden">

      {/* 🔝 Top Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#0d3b3e] shadow-lg py-2' : 'bg-[#0d3b3e]/80 backdrop-blur-sm py-4'
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
                className="text-teal-100/80 hover:text-amber-300 text-sm font-medium transition"
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
          <div className="md:hidden bg-[#0d3b3e] px-4 pb-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link}
                className="text-teal-100/80 hover:text-amber-300 text-sm font-medium text-left transition"
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d3b3e]/70 via-[#0d3b3e]/50 to-[#fdf8f0]"></div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          <span className="bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            🎓 RUET Residential Hall
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 drop-shadow-lg">
            Female-2 Hall
          </h1>
          <p className="text-amber-300 text-lg sm:text-xl font-medium mb-2">
            Smart Dining Management
          </p>
          <p className="text-teal-100/90 text-sm sm:text-base drop-shadow-md">
            Rajshahi University of Engineering and Technology
          </p>
        </div>

        {/* Carousel dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* 📇 Quick Info Cards (overlapping hero bottom) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <InfoCard
            icon="👩‍💼"
            title="Provost's Office"
            line1="For administrative matters"
            line2="Available on working days"
          />
          <InfoCard
            icon="🚨"
            title="Emergency / Medical"
            line1="24/7 support at hall office"
            line2="Contact hall staff anytime"
          />
          <InfoCard
            icon="📍"
            title="Location"
            line1="RUET Campus, Rajshahi"
            line2="Female-2 Residential Hall"
          />
        </div>
      </div>

      {/* 📋 Info + Choose Role Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: About / hours style info */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0d3b3e] mb-4">
              🏠 About Female-2 Hall
            </h2>
            <p className="text-teal-800/70 text-sm sm:text-base leading-relaxed mb-6">
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
          </div>

          {/* Right: Choose Your Role (replaces "Get In Touch" form) */}
          <div className="bg-[#0d3b3e] rounded-2xl p-8 shadow-xl border border-amber-400/20">
            <span className="inline-block bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Get Started
            </span>
            <h3 className="text-2xl font-bold text-white mb-2">Choose Your Role</h3>
            <p className="text-teal-100/60 text-sm mb-6">
              Login to access your personalized dashboard
            </p>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/student')}
                className="group w-full relative bg-amber-500 hover:bg-amber-400 text-[#0d3b3e] font-bold py-4 px-5 rounded-xl transition-all duration-300 flex items-center justify-between overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/30 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
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
                className="group w-full relative bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-5 rounded-xl transition-all duration-300 border border-amber-400/30 flex items-center justify-between overflow-hidden"
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

      {/* 🦶 Footer */}
      <div className="bg-[#082526] text-teal-100/70 pt-12 pb-6 px-4 sm:px-6">
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
                <button key={link} className="text-left hover:text-amber-300 transition w-fit">
                  {link}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Quick Access</h4>
            <div className="flex flex-col gap-2 text-xs">
              <button onClick={() => navigate('/student')} className="text-left hover:text-amber-300 transition w-fit">
                Student Login
              </button>
              <button onClick={() => navigate('/admin')} className="text-left hover:text-amber-300 transition w-fit">
                Admin Login
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-teal-800/40 pt-4 text-center">
          <p className="text-[10px] text-teal-300/50">
            © {new Date().getFullYear()} RUET Female-2 Hall | Smart Dining Management System
          </p>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, line1, line2 }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg border border-amber-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="font-bold text-[#0d3b3e] text-sm mb-1">{title}</h4>
      <p className="text-xs text-teal-700/60">{line1}</p>
      <p className="text-xs text-teal-700/60">{line2}</p>
    </div>
  );
}

function FeatureLine({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-sm text-teal-800/80">
      <span className="text-lg">{icon}</span>
      <span>{text}</span>
    </div>
  );
}