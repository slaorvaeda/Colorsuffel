import React, { useState, useEffect, useRef } from 'react';
import tinycolor from 'tinycolor2';

function CustomColorPicker({ value, onChange, className = '' }) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pickerRef = useRef(null);
  const isUpdating = useRef(false);

  // Initialize from hex value
  useEffect(() => {
    if (value && !isUpdating.current) {
      const color = tinycolor(value);
      if (color.isValid()) {
        const hsl = color.toHsl();
        setHue(hsl.h);
        setSaturation(hsl.s);
        setLightness(hsl.l);
      }
    }
    isUpdating.current = false;
  }, [value]);

  // Update hex value when HSL changes
  useEffect(() => {
    const newColor = tinycolor({ h: hue, s: saturation, l: lightness });
    const hexValue = newColor.toHexString();
    if (hexValue !== value) {
      isUpdating.current = true;
      onChange(hexValue);
    }
  }, [hue, saturation, lightness]); // Removed onChange and value from dependencies

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleHueChange = (e) => {
    setHue(parseInt(e.target.value));
  };

  const handleSaturationChange = (e) => {
    setSaturation(parseInt(e.target.value));
  };

  const handleLightnessChange = (e) => {
    setLightness(parseInt(e.target.value));
  };

  const currentColor = tinycolor({ h: hue, s: saturation, l: lightness });
  const hexValue = currentColor.toHexString();
  const rgbValue = currentColor.toRgbString();

  // Generate gradients
  const hueGradient = `linear-gradient(to right, 
    hsl(0, 100%, 50%), 
    hsl(60, 100%, 50%), 
    hsl(120, 100%, 50%), 
    hsl(180, 100%, 50%), 
    hsl(240, 100%, 50%), 
    hsl(300, 100%, 50%), 
    hsl(360, 100%, 50%)
  )`;

  const saturationGradient = `linear-gradient(to right, 
    hsl(${hue}, 0%, ${lightness}%), 
    hsl(${hue}, 100%, ${lightness}%)
  )`;

  const lightnessGradient = `linear-gradient(to right, 
    hsl(${hue}, ${saturation}%, 0%), 
    hsl(${hue}, ${saturation}%, 50%), 
    hsl(${hue}, ${saturation}%, 100%)
  )`;

  const handleHexInputChange = (e) => {
    const newColor = tinycolor(e.target.value);
    if (newColor.isValid()) {
      const hsl = newColor.toHsl();
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      onChange(newColor.toHexString());
    }
  };





  return (
    <div className={`relative z-10 ${className}`} ref={pickerRef}>
      {/* Color Preview Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-gray-200 dark:border-gray-600 shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden"
        style={{ backgroundColor: hexValue }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
        <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2">
          <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Color Picker Dropdown */}
      {isOpen && (
        <div className={`absolute top-full left-1/2 transform -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 sm:mt-3 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 lg:p-6 min-w-[280px] sm:min-w-[320px] lg:min-w-[500px] xl:min-w-[600px] max-w-[90vw] sm:max-w-none z-10`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Color Picker</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Color Preview */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-3 sm:gap-4 lg:gap-6">
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-600"
                style={{ backgroundColor: hexValue }}
              ></div>
              <div className="flex-1 space-y-2 sm:space-y-3 w-full lg:w-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">HEX</label>
                    <input
                      type="text"
                      value={hexValue}
                      onChange={handleHexInputChange}
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-mono bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#000000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">RGB</label>
                    <input
                      type="text"
                      value={rgbValue}
                      readOnly
                      className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-mono bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* HSL Sliders */}
          <div className="space-y-3 sm:space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4 mb-4 sm:mb-6">
            {/* Hue Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Hue</label>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{parseFloat(hue.toFixed(3))}°</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hue}
                  onChange={handleHueChange}
                  className="w-full h-2.5 sm:h-3 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: hueGradient
                  }}
                />
                <div className="absolute top-1/2 left-0 w-3 h-3 sm:w-4 sm:h-4 bg-white border-2 border-gray-300 rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                     style={{ left: `${(hue / 360) * 100}%` }}></div>
              </div>
            </div>

            {/* Saturation Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Saturation</label>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{parseFloat(saturation.toFixed(3))}%</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={saturation}
                  onChange={handleSaturationChange}
                  className="w-full h-2.5 sm:h-3 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: saturationGradient
                  }}
                />
                <div className="absolute top-1/2 left-0 w-3 h-3 sm:w-4 sm:h-4 bg-white border-2 border-gray-300 rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                     style={{ left: `${saturation}%` }}></div>
              </div>
            </div>

            {/* Lightness Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Lightness</label>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{parseFloat(lightness.toFixed(3))}%</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={lightness}
                  onChange={handleLightnessChange}
                  className="w-full h-2.5 sm:h-3 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: lightnessGradient
                  }}
                />
                <div className="absolute top-1/2 left-0 w-3 h-3 sm:w-4 sm:h-4 bg-white border-2 border-gray-300 rounded-full transform -translate-y-1/2 -translate-x-1/2 pointer-events-none"
                     style={{ left: `${lightness}%` }}></div>
              </div>
            </div>
          </div>


        </div>
      )}
    </div>
  );
}

export default CustomColorPicker; 