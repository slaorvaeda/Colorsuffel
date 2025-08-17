import React, { useState } from 'react';
import tinycolor from 'tinycolor2';
import { FaRegHeart, FaHeart, FaCopy, FaCheck } from "react-icons/fa";
import 'aos/dist/aos.css';
import CardListSlider from '../CardListSlider';

function ColorPalette({ color, onLike }) {
  const [copiedColor, setCopiedColor] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'

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
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 pb-8 sm:pb-12   ">
      {/* Palette Header */}
      <div className="text-center mb-6 sm:mb-8 -z-10" data-aos="fade-up">
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

        {/* View Mode Toggle */}
        <div className="flex justify-center">
        <CardListSlider viewMode={viewMode} setViewMode={setViewMode} />
        </div>

        {/* Color Display */}
        {viewMode === 'cards' ? (
          /* Card View */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {shadesAndTints.map((item, index) => {
              const colorFormats = formatColorValue(item.color);
              const contrastColor = getContrastColor(item.color);
              const isLiked = false; // You can implement liked state logic here
              
              return (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  onClick={() => handleShadeClick(item.color)}
                >
                  {/* Color Swatch */}
                  <div
                    className="h-24 sm:h-28 w-full relative"
                    style={{ backgroundColor: item.color }}
                  >
                    {/* Percentage Label */}
                    <div className="absolute top-2 left-2">
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: contrastColor === '#000000' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                          color: contrastColor
                        }}
                      >
                        {item.percentage}%
                      </span>
                    </div>
                    
                    {/* Type Indicator */}
                    <div className="absolute top-2 right-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          item.type === 'tint' ? 'bg-pink-300' :
                          item.type === 'base' ? 'bg-blue-500' : 'bg-red-600'
                        }`}
                      ></div>
                    </div>
                    
                    {/* Copy Feedback */}
                    {copiedColor === item.color && (
                      <div className="absolute inset-0 bg-opacity-20 flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-2 rounded-lg font-semibold text-sm">
                          ✓ Copied!
                        </div>
                      </div>
                    )}
                    
                    {/* Copy Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShadeClick(item.color);
                      }}
                      className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                      title="Copy color"
                    >
                      <FaCopy className="w-4 h-4" />
                    </button>
                    
                    {/* Like Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onLike(item);
                      }}
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                      title="Add to favorites"
                    >
                      <FaRegHeart className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Color Information */}
                  <div className="p-3 space-y-2">
                    <div className="text-center">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {item.label}
                      </p>
                      <p className="font-mono text-sm font-bold text-gray-800 dark:text-white">
                        {colorFormats.hex}
                      </p>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>RGB:</span>
                        <span className="font-mono">{colorFormats.rgb}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HSL:</span>
                        <span className="font-mono">{colorFormats.hsl}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-600">
              {shadesAndTints.map((item, index) => {
                const colorFormats = formatColorValue(item.color);
                const contrastColor = getContrastColor(item.color);
                
                return (
                  <div
                    key={index}
                    className="px-6 py-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer group"
                    onClick={() => handleShadeClick(item.color)}
                  >
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Color Swatch */}
                      <div className="col-span-1">
                        <div
                          className="w-12 h-12 rounded-xl shadow-md border border-gray-200 dark:border-gray-600 group-hover:shadow-lg transition-shadow"
                          style={{ backgroundColor: item.color }}
                        ></div>
                      </div>
                      
                      {/* Type Indicator */}
                      <div className="col-span-1">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            item.type === 'tint' ? 'bg-pink-300' :
                            item.type === 'base' ? 'bg-blue-500' : 'bg-red-600'
                          }`}
                        ></div>
                      </div>
                      
                      {/* Label and Percentage */}
                      <div className="col-span-2">
                        <div className="text-sm font-semibold text-gray-800 dark:text-white">{item.label}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.percentage}%</div>
                      </div>
                      
                      {/* HEX Code */}
                      <div className="col-span-2">
                        <span className="font-mono text-sm font-bold text-gray-800 dark:text-white">{colorFormats.hex}</span>
                      </div>
                      
                      {/* RGB Values */}
                      <div className="col-span-3">
                        <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{colorFormats.rgb}</span>
                      </div>
                      
                      {/* HSL Values */}
                      <div className="col-span-2">
                        <span className="font-mono text-sm text-gray-700 dark:text-gray-300">{colorFormats.hsl}</span>
                      </div>
                      
                      {/* Actions */}
                      <div className="col-span-1 flex gap-2 justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShadeClick(item.color);
                          }}
                          className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                          title="Copy color"
                        >
                          <FaCopy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onLike(item);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          title="Add to favorites"
                        >
                          <FaRegHeart className="w-4 h-4" />
                        </button>
                        {copiedColor === item.color && (
                          <span className="text-green-600 text-sm font-semibold flex items-center">
                            ✓ Copied
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
                <li>• Click the copy button or color swatch to copy the HEX code</li>
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
