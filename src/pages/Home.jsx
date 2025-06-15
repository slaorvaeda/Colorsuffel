// ColorSuggest.jsx
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Home = () => {
  const heroTitleRef = useRef(null);
  const heroDescRef = useRef(null);
  const heroBtnRef = useRef(null);
  const heroCardRef = useRef(null);

  useEffect(() => {
    gsap.to(heroTitleRef.current, { duration: 1, opacity: 1, y: -20, ease: "power2.out" });
    gsap.to(heroDescRef.current, { duration: 1.2, delay: 0.3, opacity: 1, y: -20, ease: "power2.out" });
    gsap.to(heroBtnRef.current, { duration: 1.4, delay: 0.6, opacity: 1, y: -20, ease: "power2.out" });

    const card = heroCardRef.current;
    const section = card?.parentElement;
    if (!card || !section) return;

    function handleMouseMove(e) {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * 12; // max 12deg
      const rotateX = -((y - centerY) / centerY) * 12;
      gsap.to(card, { rotateY, rotateX, scale: 1.04, duration: 0.4, ease: "power2.out" });
    }
    function handleMouseLeave() {
      gsap.to(card, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.6, ease: "power2.out" });
    }
    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-gradient-to-br rounded-2xl from-zinc-50  dark:bg-transparent text-gray-800 font-inter relative w-full">
      {/* Parallax background */}
      <div className="parallax-bg pointer-events-none fixed top-0 left-0 w-full md:h-[150vh] -z-10 overflow-hidden">
        <div className="color-waterfall absolute w-[200%] h-[200%] bg-gradient-to-br from-purple-400 via-blue-400 via-green-400 via-yellow-400 to-red-400 bg-[length:300%_300%] animate-colorFlow filter blur-[80px] opacity-40 rotate-[15deg]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative  md:h-[90vh] flex flex-col items-center justify-center text-center md:px-6 overflow-hidden">
        {/* Decorative gradient blob */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  h-[32rem] bg-gradient-to-tr from-indigo-300/40 via-purple-200/40 to-pink-200/30 rounded-full blur-3xl -z-10"></div>
        {/* Glassmorphism Card */}
        <div
          ref={heroCardRef}
          className="relative z-10 w-full max-w-screen px-8 py-14 md:py-20 bg-white/60 dark:bg-sky-300/60 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl ring-1 ring-indigo-100/60 mx-auto flex flex-col items-center will-change-transform transition-transform duration-300"
        >
          <span className="uppercase tracking-widest text-xs md:text-sm text-indigo-500 font-semibold mb-4">Auto Color Generator</span>
          <h1
            ref={heroTitleRef}
            id="hero-title"
            className="text-5xl md:text-7xl font-bold mb-6 opacity-0 font-clash bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow"
          >
            Discover Your Perfect Palette
          </h1>
          <p
            ref={heroDescRef}
            id="hero-desc"
            className="text-lg md:text-xl text-gray-700 dark:text-gray-500 max-w-2xl mb-8 opacity-0"
          >
            Get <span className="font-semibold text-indigo-600">Auto-curated</span> color combinations that elevate your creative work.<br className="hidden md:inline" /> Fast. Intuitive. Stunning.
          </p>
          <button
            ref={heroBtnRef}
            id="hero-btn"
            className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition-opacity opacity-0 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <svg className="w-5 h-5 mr-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Try It Now
          </button>
          <div className="mt-12">
            <button
              id="scroll-btn"
              onClick={scrollToFeatures}
              className="text-indigo-600 hover:text-indigo-800 text-3xl animate-bounce transition cursor-pointer"
              aria-label="Scroll to features"
            >
              ↓
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white font-clash">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-8 bg-zinc-50 rounded-3xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-3">🎨 Smart Suggestions</h3>
            <p className="text-gray-600">
              Auto-powered palettes tailored to your project theme or keyword.
            </p>
          </div>
          <div className="p-8 bg-zinc-50 rounded-3xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-3">📦 Export Friendly</h3>
            <p className="text-gray-600">
              One-click exports in HEX, RGB, SCSS, and JSON formats for devs and designers.
            </p>
          </div>
          <div className="p-8 bg-zinc-50 rounded-3xl shadow-lg">
            <h3 className="text-2xl font-semibold mb-3">🧠 Accessibility First</h3>
            <p className="text-gray-600">
              Palettes crafted with accessibility in mind for WCAG compliance.
            </p>
          </div>
        </div>
      </section>

      <section>
        
      </section>

      {/* Demo Preview Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-white to-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 font-clash">Live Color Preview</h2>
          <div className="flex flex-wrap justify-center gap-5">
            {[
              "#EF4444",
              "#F59E0B",
              "#10B981",
              "#3B82F6",
              "#8B5CF6"
            ].map((color) => (
              <div
                key={color}
                className="w-28 h-28 rounded-2xl shadow-lg"
                style={{ backgroundColor: color }}
                aria-label={`Color block ${color}`}
              ></div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 font-clash">Loved by Creators</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 bg-zinc-50 rounded-2xl shadow-md">
              <p className="text-gray-600 italic">
                “ColorSuggest made my portfolio shine. The palettes just work.”
              </p>
              <div className="mt-6 font-semibold text-indigo-600">– Durga, Creative Director </div>
            </div>
            <div className="p-8 bg-zinc-50 rounded-2xl shadow-md">
              <p className="text-gray-600 italic">
                “I use it every week. It's fast, inspiring, and surprisingly accurate.”
              </p>
              <div className="mt-6 font-semibold text-indigo-600">- Anibesh,  Photographer</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6  bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 font-clash">Ready to Find Your Palette?</h2>
          <p className="text-lg mb-8">
            Start exploring beautiful, AI-curated colors for your next project in seconds.
          </p>
          <a
            href="#"
            className="inline-block bg-white text-indigo-700 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition"
          >
            Get Started
          </a>
        </div>
      </section>



      {/* Custom styles for fonts and animations */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap");
        @import url("https://api.fontshare.com/v2/css?f[]=clash-display@700&display=swap");

        .font-inter {
          font-family: "Inter", sans-serif;
        }

        .font-clash {
          font-family: "Clash Display", sans-serif;
        }

        @keyframes colorFlow {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }

        .animate-colorFlow {
          animation: colorFlow 15s linear infinite;
        }

        .parallax-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 150vh;
          z-index: -10;
          overflow: hidden;
          pointer-events: none;
        }

        .color-waterfall {
          position: absolute;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            135deg,
            #c084fc,
            #60a5fa,
            #34d399,
            #facc15,
            #f87171
          );
          background-size: 300% 300%;
          filter: blur(80px);
          opacity: 0.4;
          transform: rotate(15deg);
        }
      `}</style>
    </div>
  );
};

export default Home;
