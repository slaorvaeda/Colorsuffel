import React, { useState, useEffect } from 'react';
import { FaCopy, FaCheck, FaHeart, FaRegHeart, FaPalette, FaEyeDropper } from 'react-icons/fa';

const ColorTable = () => {
  const [copiedColor, setCopiedColor] = useState(null);
  const [likedColors, setLikedColors] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredWheelColor, setHoveredWheelColor] = useState(null);
  const [wheelRotation, setWheelRotation] = useState(0);

  console.log('ColorTable component is rendering');
  console.log('Wheel rotation:', wheelRotation);

  const handleWheelRotation = () => {
    setWheelRotation(prev => {
      const newRotation = prev + 45;
      console.log('Rotating wheel from', prev, 'to', newRotation);
      return newRotation;
    });
  };

  // Color wheel data with segments - 12 colors for better distribution
  const colorWheelData = [
    { name: "Red", hex: "#FF0000", angle: 0, rgb: "255, 0, 0", hsl: "0°, 100%, 50%" },
    { name: "Orange", hex: "#FF8000", angle: 30, rgb: "255, 128, 0", hsl: "30°, 100%, 50%" },
    { name: "Yellow", hex: "#FFFF00", angle: 60, rgb: "255, 255, 0", hsl: "60°, 100%, 50%" },
    { name: "Lime", hex: "#80FF00", angle: 90, rgb: "128, 255, 0", hsl: "90°, 100%, 50%" },
    { name: "Green", hex: "#00FF00", angle: 120, rgb: "0, 255, 0", hsl: "120°, 100%, 50%" },
    { name: "Teal", hex: "#00FF80", angle: 150, rgb: "0, 255, 128", hsl: "150°, 100%, 50%" },
    { name: "Cyan", hex: "#00FFFF", angle: 180, rgb: "0, 255, 255", hsl: "180°, 100%, 50%" },
    { name: "Blue", hex: "#0080FF", angle: 210, rgb: "0, 128, 255", hsl: "210°, 100%, 50%" },
    { name: "Navy", hex: "#0000FF", angle: 240, rgb: "0, 0, 255", hsl: "240°, 100%, 50%" },
    { name: "Purple", hex: "#8000FF", angle: 270, rgb: "128, 0, 255", hsl: "270°, 100%, 50%" },
    { name: "Magenta", hex: "#FF00FF", angle: 300, rgb: "255, 0, 255", hsl: "300°, 100%, 50%" },
    { name: "Pink", hex: "#FF0080", angle: 330, rgb: "255, 0, 128", hsl: "330°, 100%, 50%" }
  ];

  // Color chart data organized by categories
  const colorChartData = {
    primary: [
      { name: "Pure Red", hex: "#FF0000", rgb: "255, 0, 0", hsl: "0°, 100%, 50%", description: "Primary red" },
      { name: "Pure Green", hex: "#00FF00", rgb: "0, 255, 0", hsl: "120°, 100%, 50%", description: "Primary green" },
      { name: "Pure Blue", hex: "#0000FF", rgb: "0, 0, 255", hsl: "240°, 100%, 50%", description: "Primary blue" }
    ],
    secondary: [
      { name: "Cyan", hex: "#00FFFF", rgb: "0, 255, 255", hsl: "180°, 100%, 50%", description: "Secondary cyan" },
      { name: "Magenta", hex: "#FF00FF", rgb: "255, 0, 255", hsl: "300°, 100%, 50%", description: "Secondary magenta" },
      { name: "Yellow", hex: "#FFFF00", rgb: "255, 255, 0", hsl: "60°, 100%, 50%", description: "Secondary yellow" }
    ],
    warm: [
      { name: "Sunset Orange", hex: "#FF6B35", rgb: "255, 107, 53", hsl: "15°, 100%, 60%", description: "Warm orange" },
      { name: "Golden Yellow", hex: "#F59E0B", rgb: "245, 158, 11", hsl: "43°, 92%, 50%", description: "Warm yellow" },
      { name: "Coral Red", hex: "#FF6B6B", rgb: "255, 107, 107", hsl: "0°, 100%, 71%", description: "Warm red" }
    ],
    cool: [
      { name: "Ocean Blue", hex: "#0066CC", rgb: "0, 102, 204", hsl: "210°, 100%, 40%", description: "Cool blue" },
      { name: "Mint Green", hex: "#4ECDC4", rgb: "78, 205, 196", hsl: "175°, 55%, 55%", description: "Cool green" },
      { name: "Lavender", hex: "#E6E6FA", rgb: "230, 230, 250", hsl: "240°, 67%, 94%", description: "Cool purple" }
    ],
    neutral: [
      { name: "Pure White", hex: "#FFFFFF", rgb: "255, 255, 255", hsl: "0°, 0%, 100%", description: "Neutral white" },
      { name: "Pure Black", hex: "#000000", rgb: "0, 0, 0", hsl: "0°, 0%, 0%", description: "Neutral black" },
      { name: "Gray", hex: "#808080", rgb: "128, 128, 128", hsl: "0°, 0%, 50%", description: "Neutral gray" }
    ]
  };

  const categories = [
    { id: 'all', name: 'All Colors', icon: '🎨' },
    { id: 'primary', name: 'Primary', icon: '🔴' },
    { id: 'secondary', name: 'Secondary', icon: '🟡' },
    { id: 'warm', name: 'Warm', icon: '🟠' },
    { id: 'cool', name: 'Cool', icon: '🔵' },
    { id: 'neutral', name: 'Neutral', icon: '⚪' }
  ];

  const copyToClipboard = async (color, type) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(type);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const toggleLike = (colorName) => {
    setLikedColors(prev => 
      prev.includes(colorName) 
        ? prev.filter(name => name !== colorName)
        : [...prev, colorName]
    );
  };

  const getFilteredColors = () => {
    if (selectedCategory === 'all') {
      const allColors = Object.values(colorChartData).flat();
      console.log('All colors:', allColors);
      return allColors;
    }
    const categoryColors = colorChartData[selectedCategory] || [];
    console.log('Category colors:', categoryColors);
    return categoryColors;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12" data-aos="fade-up">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-raleway bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
          Color Chart & Palette System
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore our comprehensive color chart with organized color systems and palettes
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-8" data-aos="fade-up" data-aos-delay="100">
        {categories.map((category) => {
          // Safety check to ensure category is a valid object
          if (!category || typeof category !== 'object' || !category.id || !category.name) {
            console.error('Invalid category object:', category);
            return null;
          }
          return (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md hover:shadow-lg'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.name}</span>
          </button>
        );
        })}
      </div>

      {/* Color Wheel Visualization */}
      <div className="mb-12" data-aos="fade-up" data-aos-delay="200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Interactive Color Wheel</h3>
          <p className="text-gray-600">Click on colors to copy, hover to see details</p>
        </div>
        <div className="flex justify-center">
          <div className="relative w-80 h-80">
            {/* Enhanced Color Wheel */}
            <div 
              className="w-full h-full rounded-full shadow-2xl relative overflow-hidden cursor-pointer transition-transform duration-500 hover:scale-105"
              style={{ 
                transform: `rotate(${wheelRotation}deg)`,
                background: 'conic-gradient(from 0deg, #ff0000 0deg, #ff8000 30deg, #ffff00 60deg, #80ff00 90deg, #00ff00 120deg, #00ff80 150deg, #00ffff 180deg, #0080ff 210deg, #0000ff 240deg, #8000ff 270deg, #ff00ff 300deg, #ff0080 330deg, #ff0000 360deg)'
              }}
              onMouseEnter={() => setHoveredWheelColor(null)}
              onMouseLeave={() => setHoveredWheelColor(null)}
            >
              {/* Color Segment Overlays for Interaction */}
              {colorWheelData.map((color, index) => {
                // Safety check to ensure color is a valid object
                if (!color || typeof color !== 'object' || !color.name || !color.hex) {
                  console.error('Invalid wheel color object:', color);
                  return null;
                }
                return (
                <div
                  key={index}
                  className="absolute inset-0 transition-all duration-300 cursor-pointer"
                  style={{
                    background: `conic-gradient(from ${color.angle}deg, transparent 0deg, transparent 30deg, rgba(255,255,255,0.1) 30deg, rgba(255,255,255,0.1) 31deg, transparent 31deg)`,
                    transform: `rotate(-${wheelRotation}deg)`,
                    clipPath: `polygon(50% 50%, 50% 0%, ${50 + Math.cos((color.angle + 30) * Math.PI / 180) * 50}% ${50 + Math.sin((color.angle + 30) * Math.PI / 180) * 50}%, ${50 + Math.cos(color.angle * Math.PI / 180) * 50}% ${50 + Math.sin(color.angle * Math.PI / 180) * 50}%)`
                  }}
                  onMouseEnter={() => {
                    console.log('Hovering over:', color.name, color.hex);
                    setHoveredWheelColor(color);
                  }}
                  onMouseLeave={() => {
                    console.log('Leaving:', color.name);
                    setHoveredWheelColor(null);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(color.hex, `wheel-${index}`);
                    // Add visual feedback
                    const element = e.currentTarget;
                    element.style.transform = `rotate(-${wheelRotation}deg) scale(1.05)`;
                    setTimeout(() => {
                      element.style.transform = `rotate(-${wheelRotation}deg) scale(1)`;
                    }, 200);
                  }}
                >
                  {/* Segment Label */}
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none drop-shadow-lg bg-black/50 px-2 py-1 rounded"
                    style={{
                      transform: `translate(-50%, -50%) rotate(${color.angle + 15}deg) translateY(-60px) rotate(-${color.angle + 15}deg)`
                    }}
                  >
                    {color.name}
                  </div>
                </div>
              );
              })}
            </div>
            
            {/* Copy Feedback for Wheel */}
            {copiedColor && copiedColor.startsWith('wheel-') && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold shadow-lg animate-pulse">
                  ✓ Color Copied!
                </div>
              </div>
            )}
            
            {/* Center Hub - Clickable for rotation */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full shadow-lg border-4 border-gray-200 flex items-center justify-center cursor-pointer hover:shadow-xl transition-all duration-200 z-10"
              onClick={handleWheelRotation}
              title="Click to rotate wheel"
            >
              <div className="text-center relative">
                <div className="text-xs font-bold text-gray-600">Click to</div>
                <div className="text-xs font-bold text-gray-600">Rotate</div>
                <div className="text-xs text-gray-500 mt-1">{wheelRotation}°</div>
                {/* Rotation Arrow */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-blue-500 animate-pulse">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Hover Information Panel */}
            {hoveredWheelColor && (
              <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl p-4 border border-gray-200 min-w-[200px] z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: hoveredWheelColor.hex }}
                  ></div>
                  <h4 className="font-bold text-gray-800">{hoveredWheelColor.name}</h4>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-600">HEX:</span>
                    <span className="font-mono font-bold">{hoveredWheelColor.hex}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">RGB:</span>
                    <span className="font-mono">{hoveredWheelColor.rgb}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">HSL:</span>
                    <span className="font-mono">{hoveredWheelColor.hsl}</span>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(hoveredWheelColor.hex, `hover-${hoveredWheelColor.name}`)}
                  className="mt-2 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold py-1 px-2 rounded hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
                >
                  Copy Color
                </button>
              </div>
            )}

            {/* Rotation Controls */}
            <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
              <button
                onClick={() => setWheelRotation(prev => prev + 30)}
                className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200"
                title="Rotate Clockwise"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => setWheelRotation(prev => prev - 30)}
                className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-200"
                title="Rotate Counter-clockwise"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 4v5h-.582m0 0a8.001 8.001 0 00-15.356 2m15.356-2H15M4 20v-5h.581m0 0a8.003 8.003 0 0015.357-2M4.581 15H9" />
                </svg>
              </button>
            </div>

            {/* Color Wheel Legend */}
            <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-lg p-3 border border-gray-200">
              <h5 className="text-xs font-bold text-gray-800 mb-2">Legend</h5>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Primary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Secondary</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Tertiary</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Color Wheel Instructions */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Click wheel to rotate</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Hover for details</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">Click to copy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Color Chart Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-aos="fade-up" data-aos-delay="300">
        {getFilteredColors().map((color, index) => {
          // Safety check to ensure color is a valid object
          if (!color || typeof color !== 'object' || !color.name || !color.hex) {
            console.error('Invalid color object:', color);
            return null;
          }
          return (
          <div
            key={index}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
          >
            {/* Color Swatch */}
            <div className="relative h-32 overflow-hidden">
              <div 
                className="absolute inset-0"
                style={{ backgroundColor: color.hex }}
              />
              
              {/* Color Information Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2">
                    <p className="text-xs font-semibold text-gray-800 truncate">{color.name}</p>
                    <p className="text-xs text-gray-600">{color.description}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => copyToClipboard(color.hex, `hex-${index}`)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                  title="Copy HEX"
                >
                  {copiedColor === `hex-${index}` ? (
                    <FaCheck className="w-4 h-4 text-green-600" />
                  ) : (
                    <FaCopy className="w-4 h-4 text-gray-700" />
                  )}
                </button>
                <button
                  onClick={() => toggleLike(color.name)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200"
                  title="Add to favorites"
                >
                  {likedColors.includes(color.name) ? (
                    <FaHeart className="w-4 h-4 text-red-500" />
                  ) : (
                    <FaRegHeart className="w-4 h-4 text-gray-700" />
                  )}
                </button>
              </div>

              {/* Copy Feedback */}
              {copiedColor === `hex-${index}` && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold shadow-lg">
                    ✓ Copied!
                  </div>
                </div>
              )}
            </div>

            {/* Color Details */}
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-2 text-sm">{color.name}</h3>
              
              {/* Color Values */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">HEX:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-gray-900">{color.hex}</span>
                    <button
                      onClick={() => copyToClipboard(color.hex, `hex-${index}`)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <FaCopy className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">RGB:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-gray-600">{color.rgb}</span>
                    <button
                      onClick={() => copyToClipboard(`rgb(${color.rgb})`, `rgb-${index}`)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <FaCopy className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">HSL:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-gray-600">{color.hsl}</span>
                    <button
                      onClick={() => copyToClipboard(`hsl(${color.hsl})`, `hsl-${index}`)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <FaCopy className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        })}
      </div>

      {/* Color Theory Section */}
      <div className="mt-16 grid md:grid-cols-2 gap-8" data-aos="fade-up" data-aos-delay="400">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <FaPalette className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Color Theory</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <strong>Primary Colors:</strong> Red, Blue, Yellow - cannot be mixed</li>
            <li>• <strong>Secondary Colors:</strong> Green, Orange, Purple - mixed from primaries</li>
            <li>• <strong>Warm Colors:</strong> Red, Orange, Yellow - energetic and passionate</li>
            <li>• <strong>Cool Colors:</strong> Blue, Green, Purple - calm and soothing</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <FaEyeDropper className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">Usage Tips</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>• <strong>Contrast:</strong> Use complementary colors for high contrast</li>
            <li>• <strong>Harmony:</strong> Analogous colors create peaceful designs</li>
            <li>• <strong>Accent:</strong> Use bright colors sparingly for emphasis</li>
            <li>• <strong>Neutral:</strong> Grays and whites provide balance</li>
          </ul>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-12" data-aos="fade-up" data-aos-delay="500">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
          <FaPalette className="w-5 h-5" />
          <span>Create Your Own Palette</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>

      {/* Custom styles */}
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap");
          .font-raleway {
            font-family: 'Raleway', sans-serif;
          }
          .bg-conic-gradient {
            background: conic-gradient(from 0deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080, #ff0000);
          }
        `}
      </style>
    </div>
  );
};

export default ColorTable; 