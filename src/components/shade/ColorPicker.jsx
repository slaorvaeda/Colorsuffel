import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function ColorPicker({ onColorSelect }) {
  const [color, setColor] = useState('#00FF00'); // Default color set to green
  const [history, setHistory] = useState([]);
  const [showInfo, setShowInfo] = useState(true); // State to control info box visibility

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const handleChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    onColorSelect(newColor);
    setHistory([...history, newColor]);
  };

  // Helper functions to convert hex to rgb, rgba, hsl
  const hexToRgb = (hex) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    return { r, g, b };
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const { r, g, b } = hexToRgb(color);
  const hsl = rgbToHsl(r, g, b);

  return (
    <>
      <h1 className='text-4xl font-bold text-center py-4 text-gray-900 text-clip' data-aos="fade-down">Choose your color</h1>
      {/* Info/instruction box for user */}
      {showInfo && (
        <div className="w-full max-w-lg mx-auto mb-4 bg-blue-50 border border-blue-200 rounded-xl shadow p-3 flex items-center gap-3 relative" data-aos="fade-up">
          <svg className="w-6 h-6 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4m0-4h.01"/></svg>
          <span className="text-blue-700 text-sm font-medium">Tip: Click the color box to copy the HEX code.</span>
          <button
            className="absolute top-2 right-2 text-red-600 hover:text-red-900 text-lg font-bold px-2 py-0.5 rounded transition-colors"
            aria-label="Close info box"
            onClick={() => setShowInfo(false)}
          >
            ×
          </button>
        </div>
      )}
      <div className='flex justify-center items-center flex-col relative' data-aos="zoom-in">
        <input type="color" value={color} onChange={handleChange} className='w-[100px] h-[100px] rounded-2xl border-none outline-offset-0' data-aos="flip-left" data-aos-delay="200" />
        {/* Responsive color code box: absolute for desktop, bottom sheet for mobile */}
        <div
          className="hidden sm:block absolute top-0 right-0 mt-2 mr-2 w-full max-w-xs bg-white/90 rounded-xl shadow-2xl p-4 border border-gray-200 backdrop-blur-md z-20"
          data-aos="fade-left"
          data-aos-delay="400"
        >
          <h2 className="text-lg font-semibold mb-2 text-gray-700 text-center">Color Codes</h2>
          <div className="flex flex-col gap-1 text-sm font-mono text-gray-800">
            <div><span className="font-bold">HEX:</span> {color}</div>
            <div><span className="font-bold">RGB:</span> rgb({r}, {g}, {b})</div>
            <div><span className="font-bold">RGBA:</span> rgba({r}, {g}, {b}, 1)</div>
            <div><span className="font-bold">HSL:</span> hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
            <div><span className="font-bold">HSLA:</span> hsla({hsl.h}, {hsl.s}%, {hsl.l}%, 1)</div>
          </div>
        </div>
       
      </div>
    </>
  );
}

export default ColorPicker;
