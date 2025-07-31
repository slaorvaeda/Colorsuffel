import React, { useState } from 'react';
import tinycolor from 'tinycolor2';
import { FaRegHeart, FaHeart, FaCopy, FaCheck } from "react-icons/fa";
import 'aos/dist/aos.css';

function ColorPalette({ color, onLike }) {
  const [copiedColor, setCopiedColor] = useState(null);

  const generateShadesAndTints = (baseColor) => {
    const colors = [];
    const baseColorObj = tinycolor(baseColor);
    
    // Generate tints (lighter variations) - 10 steps
    for (let i = 10; i >= 1; i--) {
      const tint = baseColorObj.clone().lighten(i * 4).toString();
      colors.push({
        color: tint,
        type: 'tint',
        percentage: i * 10,
        label: `${i * 10}% lighter`
      });
    }
    
    // Add base color
    colors.push({
      color: baseColor,
      type: 'base',
      percentage: 0,
      label: 'Base Color'
    });
    
    // Generate shades (darker variations) - 10 steps
    for (let i = 1; i <= 10; i++) {
      const shade = baseColorObj.clone().darken(i * 4).toString();
      colors.push({
        color: shade,
        type: 'shade',
        percentage: i * 10,
        label: `${i * 10}% darker`
      });
    }
    
    return colors;
  };

  const shadesAndTints = generateShadesAndTints(color);

  const handleShadeClick = (colorValue) => {
    navigator.clipboard.writeText(colorValue).then(() => {
      setCopiedColor(colorValue);
      setTimeout(() => setCopiedColor(null), 2000);
    });
  };

  const getContrastColor = (backgroundColor) => {
    const color = tinycolor(backgroundColor);
    return color.isDark() ? '#FFFFFF' : '#000000';
  };

  const formatColorValue = (colorValue) => {
    const color = tinycolor(colorValue);
    return {
      hex: color.toHexString(),
      rgb: color.toRgbString(),
      hsl: color.toHslString()
    };
  };

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 pb-8 sm:pb-12 relative z-0">
      {/* Palette Header */}
      <div className="text-center mb-6 sm:mb-8" data-aos="fade-up">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-4">
          Generated Color Palette
        </h2>
        <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-300 px-2">
          Professional shades and tints for your design system
        </p>
      </div>

      {/* Color Palette Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8" data-aos="zoom-in">
        {/* Legend */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-pink-300 rounded-full"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Tints (Lighter)</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Base Color</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full"></div>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Shades (Darker)</span>
          </div>
        </div>

        {/* Color Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
          {shadesAndTints.map((item, index) => {
            const colorInfo = formatColorValue(item.color);
            const contrastColor = getContrastColor(item.color);
            const isCopied = copiedColor === item.color;
            
            return (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-700 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105"
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                {/* Color Swatch */}
                <div 
                  className="h-24 sm:h-28 lg:h-32 relative cursor-pointer"
                  style={{ backgroundColor: item.color }}
                  onClick={() => handleShadeClick(item.color)}
                >
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    {isCopied ? (
                      <FaCheck className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    ) : (
                      <FaCopy className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </div>
                  
                  {/* Type indicator */}
                  <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                    <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                      item.type === 'tint' ? 'bg-pink-300' : 
                      item.type === 'base' ? 'bg-blue-500' : 'bg-red-600'
                    }`}></div>
                  </div>
                </div>

                {/* Color Information */}
                <div className="p-3 sm:p-4">
                  {/* Label */}
                  <div className="mb-2 sm:mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm">
                      {item.label}
                    </h3>
                    {item.type === 'base' && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">ORIGINAL</span>
                    )}
                  </div>

                  {/* Color Codes */}
                  <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">HEX</span>
                      <code className="text-xs font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-600 px-1 sm:px-2 py-1 rounded text-xs">
                        {colorInfo.hex}
                      </code>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">RGB</span>
                      <code className="text-xs font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-600 px-1 sm:px-2 py-1 rounded text-xs">
                        {colorInfo.rgb}
                      </code>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-600">
                    <button
                      className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      onClick={() => handleShadeClick(item.color)}
                    >
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                    
                    <button
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLike(item.color);
                      }}
                      title="Add to favorites"
                    >
                      <FaRegHeart className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Usage Instructions */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl sm:rounded-2xl">
          <div className="flex items-start gap-3 sm:gap-4">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm sm:text-base">
                How to use this palette
              </h4>
              <ul className="text-xs sm:text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Click any color swatch to copy the HEX code</li>
                <li>• Use tints for backgrounds and highlights</li>
                <li>• Use shades for text and borders</li>
                <li>• The base color is perfect for primary elements</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorPalette;
