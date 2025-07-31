import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import tinycolor from 'tinycolor2';
import CustomColorPicker from './CustomColorPicker';
import 'aos/dist/aos.css';

function ColorPicker({ onColorSelect }) {
  const [color, setColor] = useState('#3B82F6'); // Default color set to blue
  const [history, setHistory] = useState([]);
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const handleChange = (newColor) => {
    if (newColor !== color) {
      setColor(newColor);
      onColorSelect(newColor);
      setHistory(prev => [...prev, newColor]);
    }
  };

  // Generate compact palette for the strip
  const generateCompactPalette = (baseColor) => {
    const colors = [];
    
    // Generate tints (lighter variations) - 6 steps
    for (let i = 6; i >= 1; i--) {
      const tint = tinycolor(baseColor).lighten(i * 8).toString();
      colors.push({
        color: tint,
        hex: tinycolor(tint).toHexString().toUpperCase()
      });
    }
    
    // Add base color
    colors.push({
      color: baseColor,
      hex: tinycolor(baseColor).toHexString().toUpperCase(),
      isBase: true
    });
    
    // Generate shades (darker variations) - 6 steps
    for (let i = 1; i <= 6; i++) {
      const shade = tinycolor(baseColor).darken(i * 8).toString();
      colors.push({
        color: shade,
        hex: tinycolor(shade).toHexString().toUpperCase()
      });
    }
    
    return colors;
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
  const compactPalette = generateCompactPalette(color);

  const copyToClipboard = (text, format) => {
    navigator.clipboard.writeText(text).then(() => {
      // You could add a toast notification here
      console.log(`${format} copied to clipboard`);
    });
  };

  const handlePaletteColorClick = (colorValue) => {
    if (colorValue !== color) {
      setColor(colorValue);
      onColorSelect(colorValue);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-4 sm:py-6 lg:py-8 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12" data-aos="fade-down">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Color Shades & Tints Generator
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-2">
            Create professional color palettes with precise shades and tints. Perfect for design systems and brand guidelines.
          </p>
        </div>

        {/* Info Box */}
        {showInfo && (
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6" data-aos="fade-up">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  How to use this tool
                </h3>
                <p className="text-sm sm:text-base text-blue-800 dark:text-blue-200 mb-3">
                  Select your base color using the color picker below. The tool will automatically generate a complete palette of shades (darker variations) and tints (lighter variations) that you can use in your designs.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-blue-700 dark:text-blue-300">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Shades: Darker variations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-300 rounded-full"></div>
                    <span>Tints: Lighter variations</span>
                  </div>
                </div>
              </div>
              <button
                className="flex-shrink-0 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
                onClick={() => setShowInfo(false)}
                aria-label="Close info box"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Color Picker Section */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8" data-aos="zoom-in">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start lg:items-center">
            {/* Color Picker */}
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                Choose Your Base Color
              </h2>
              <div className="flex justify-center">
                <CustomColorPicker 
                  value={color} 
                  onChange={handleChange}
                  className="inline-block"
                />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3 sm:mt-4">
                Click to open the color picker
              </p>
              
              {/* Compact Color Palette Strip */}
              <div className="mt-4 sm:mt-6">
                <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                  Quick Color Palette
                </h3>
                <div className="relative flex ml-auto h-5 sm:h-6 lg:h-8 overflow-hidden rounded-full shadow-lg">
                  {compactPalette.map((item, index) => (
                    <div
                      key={index}
                      className="cursor-pointer relative group flex grow items-center justify-center w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8 basis-[1px] hover:basis-10 sm:hover:basis-12 transition-all duration-300"
                      style={{ 
                        backgroundColor: item.color,
                        color: tinycolor(item.color).isDark() ? '#FFFFFF' : '#000000'
                      }}
                      onClick={() => handlePaletteColorClick(item.color)}
                      title={`Click to select ${item.hex}`}
                    >
                      {item.isBase && (
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="12" 
                          height="12" 
                          fill="currentColor" 
                          viewBox="0 0 256 256" 
                          className="group-hover:opacity-0 transition-opacity opacity-100 absolute sm:w-4 sm:h-4"
                        >
                          <path d="M156,128a28,28,0,1,1-28-28A28,28,0,0,1,156,128Z"></path>
                        </svg>
                      )}
                      <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium">
                        {item.hex}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Hover to see hex codes • Click to select
                </p>
              </div>
            </div>

            {/* Color Information */}
            <div className="space-y-4 sm:space-y-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                Color Information
              </h3>
              
              {/* Current Color Display */}
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-600"
                  style={{ backgroundColor: color }}
                ></div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Selected Color</p>
                  <p className="text-sm sm:text-lg font-mono font-bold text-gray-900 dark:text-white">{color}</p>
                </div>
              </div>

              {/* Color Codes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {[
                  { label: 'HEX', value: color, format: 'hex' },
                  { label: 'RGB', value: `rgb(${r}, ${g}, ${b})`, format: 'rgb' },
                  { label: 'RGBA', value: `rgba(${r}, ${g}, ${b}, 1)`, format: 'rgba' },
                  { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, format: 'hsl' }
                ].map((code, index) => (
                  <div 
                    key={index}
                    className="p-2 sm:p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                    onClick={() => copyToClipboard(code.value, code.label)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">{code.label}</span>
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs sm:text-sm font-mono text-gray-900 dark:text-white mt-1 truncate">{code.value}</p>
                  </div>
                ))}
              </div>

              {/* Color Properties */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Hue</p>
                  <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{hsl.h}°</p>
                </div>
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Saturation</p>
                  <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{hsl.s}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Lightness</p>
                  <p className="text-sm sm:text-lg font-bold text-gray-900 dark:text-white">{hsl.l}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;
