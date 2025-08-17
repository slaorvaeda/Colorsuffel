import React, { useState } from "react";
import CardListSlider from "../components/CardListSlider";
import { FaEye, FaExternalLinkAlt } from "react-icons/fa";
import tinycolor from "tinycolor2";

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const hexToRgb = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

// Generate harmonious colors for a palette group
const generateHarmoniousGroup = () => {
  // Pick a random base HSL color
  const baseHue = Math.floor(Math.random() * 360);
  const baseSaturation = Math.floor(Math.random() * 21) + 70; 
  const baseLightness = Math.floor(Math.random() * 16) + 50; 
  // Helper to convert HSL to RGB string
  const hslToRgbString = (h, s, l) => {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  };

  // Generate 5 harmonious colors by varying hue/sat/lightness slightly
  return Array(5).fill().map((_, i) => {
    const hue = (baseHue + (i * 10) + Math.floor(Math.random() * 8 - 4)) % 360;
    const sat = Math.min(100, Math.max(60, baseSaturation + Math.floor(Math.random() * 11 - 5)));
    const light = Math.min(80, Math.max(45, baseLightness + Math.floor(Math.random() * 9 - 4)));
    return hslToRgbString(hue, sat, light);
  });
};

const PaletteGenerator = () => {
  // Generate 42 groups of 5 harmonious colors (total 210)
  const [colors, setColors] = useState(Array(42).fill().flatMap(generateHarmoniousGroup));
  const [openGroupIdx, setOpenGroupIdx] = useState(null);
  const [showInfo, setShowInfo] = useState(true); // Info box state
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'
  const [showPreview, setShowPreview] = useState(false);
  const [selectedPaletteForPreview, setSelectedPaletteForPreview] = useState(0);

  const generateNewPalette = () => {
    setColors(Array(42).fill().flatMap(generateHarmoniousGroup));
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    alert(`Copied ${color} to clipboard!`);
  };

  const openPreviewInNewTab = (paletteIndex) => {
    const palette = groupedColors[paletteIndex];
    const previewData = {
      palette: {
        name: `Generated Palette ${paletteIndex + 1}`,
        colors: palette
      },
      timestamp: Date.now()
    };
    localStorage.setItem('website-preview-data', JSON.stringify(previewData));
    window.open('/website-preview-full', '_blank');
  };

  const showPalettePreview = (paletteIndex) => {
    setSelectedPaletteForPreview(paletteIndex);
    setShowPreview(true);
  };

  const groupedColors = [];
  for (let i = 0; i < colors.length; i += 5) {
    groupedColors.push(colors.slice(i, i + 5));
  }

  return (
    <div className="flex flex-col items-center p-5">
      
      
      <h1 className="text-5xl md:text-6xl font-bold mb-6 font-raleway bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
          Color Palette Generator
        </h1>
      
      {/* Generate New Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={generateNewPalette}
          className="bg-white border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-full hover:bg-blue-50 hover:border-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Generate New Palettes</span>
        </button>
      </div>
      
      {/* View Mode Toggle */}
      <CardListSlider viewMode={viewMode} setViewMode={setViewMode} />

      {/* Custom styles for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out;
          }
          @import url("https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap");
          .font-raleway {
            font-family: 'Raleway', sans-serif;
          }
        `}
      </style>

      {viewMode === 'cards' ? (
        /* Card View */
        <div className="flex flex-wrap justify-center gap-8">
          {groupedColors.map((group, index) => (
            <div key={index} className="flex flex-col items-center border p-1 rounded-lg shadow-md border-gray-200 relative">
              <div
                className="flex bg-amber-200 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setOpenGroupIdx(index)}
              >
                <div className="flex rounded">
                  {group.map((color, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:w-20"
                      style={{ backgroundColor: color }}
                      onClick={e => { e.stopPropagation(); setOpenGroupIdx(index); }}
                    >
                      {/* <span className="text-white font-bold text-xs ">{color}</span>
                      <span className="text-white text-xs">{hexToRgb(color)}</span> */}
                    </div>
                  ))}
                </div>
              </div>
              {/* Modal for showing all colors in the group */}
              {openGroupIdx === index && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10 min-w-[300px]">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">Palette #{index + 1}</h3>
                    <button
                      onClick={() => setOpenGroupIdx(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                  <div className="space-y-2">
                    {group.map((color, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-8 h-8 rounded border border-gray-200"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="font-mono text-sm">{color}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(color)}
                          className="bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 hover:border-blue-600 transition-all duration-300 px-2 py-1 rounded text-sm font-medium shadow-sm"
                        >
                          Copy
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const allColors = group.join('\n');
                      navigator.clipboard.writeText(allColors);
                      alert('All colors copied to clipboard!');
                    }}
                    className="w-full mt-3 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Copy All Colors
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {groupedColors.map((group, index) => (
                <div
                  key={index}
                  className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 cursor-pointer group"
                  onClick={() => setOpenGroupIdx(openGroupIdx === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      {/* Circular Color Palette */}
                      <div className="flex -space-x-3">
                        {group.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 rounded-full border-3 border-white shadow-lg transform hover:scale-110 transition-all duration-300 group-hover:shadow-xl"
                            style={{ backgroundColor: color }}
                            title={color}
                          ></div>
                        ))}
                      </div>
                      
                      {/* Color Count */}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-600">{group.length} colors</span>
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          showPalettePreview(index);
                        }}
                        className="bg-white border-2 border-green-500 text-green-600 px-4 py-2 rounded-full hover:bg-green-50 hover:border-green-600 transition-all duration-300 transform hover:scale-105 shadow-md font-medium text-sm flex items-center space-x-2"
                      >
                        <FaEye className="w-4 h-4" />
                        {/* <span>Preview</span> */}
                      </button>
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreviewInNewTab(index);
                        }}
                        className="bg-white border-2 border-purple-500 text-purple-600 px-4 py-2 rounded-full hover:bg-purple-50 hover:border-purple-600 transition-all duration-300 transform hover:scale-105 shadow-md font-medium text-sm flex items-center space-x-2"
                      >
                        <FaExternalLinkAlt className="w-4 h-4" />
                        <span>Full Screen</span>
                      </button> */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const allColors = group.join('\n');
                          navigator.clipboard.writeText(allColors);
                          alert('All colors copied to clipboard!');
                        }}
                        className="bg-white border-2 border-blue-500 text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 hover:border-blue-600 transition-all duration-300 transform hover:scale-105 shadow-md font-medium text-sm flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {/* <span>Copy All</span> */}
                      </button>
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center transform group-hover:rotate-180 transition-all duration-300 shadow-md">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded view */}
                  {openGroupIdx === index && (
                    <div className="mt-6 space-y-3 animate-fadeIn">
                      {group.map((color, idx) => (
                        <div 
                          key={idx} 
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl hover:from-blue-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(color);
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-12 h-12 rounded-full shadow-lg border-3 border-white transform hover:scale-110 transition-all duration-300"
                              style={{ backgroundColor: color }}
                            ></div>
                            <div>
                              <span className="font-mono text-sm font-bold text-gray-800">{color}</span>
                              <div className="text-xs text-gray-500 mt-1">{hexToRgb(color)}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(color);
                              }}
                              className="bg-white border-2 border-green-500 text-green-600 px-3 py-1 rounded-full hover:bg-green-50 hover:border-green-600 transition-all duration-300 transform hover:scale-105 text-sm font-medium shadow-md flex items-center space-x-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <span>Copy</span>
                            </button>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">
                Website Preview - Generated Palette {selectedPaletteForPreview + 1}
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div 
                className="p-8 rounded-xl border-2 border-gray-200"
                style={{ backgroundColor: groupedColors[selectedPaletteForPreview][4] || '#f3f4f6' }}
              >
                {/* Header */}
                <header className="mb-8">
                  <nav className="flex items-center justify-between mb-6">
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: groupedColors[selectedPaletteForPreview][0] || '#1f2937' }}
                    >
                      BrandName
                    </div>
                    <div className="flex gap-6">
                      {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
                        <a
                          key={index}
                          href="#"
                          className="font-medium hover:underline transition-colors"
                          style={{ color: groupedColors[selectedPaletteForPreview][1] || '#374151' }}
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  </nav>
                  
                  <div className="text-center py-12">
                    <h1 
                      className="text-5xl font-bold mb-4"
                      style={{ color: groupedColors[selectedPaletteForPreview][0] || '#1f2937' }}
                    >
                      Welcome to Our Website
                    </h1>
                    <p 
                      className="text-xl mb-8 max-w-2xl mx-auto"
                      style={{ color: groupedColors[selectedPaletteForPreview][2] || '#6b7280' }}
                    >
                      Experience the perfect blend of design and functionality with our carefully crafted color palette.
                    </p>
                    <button
                      className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: groupedColors[selectedPaletteForPreview][1] || '#3b82f6' }}
                    >
                      Get Started
                    </button>
                  </div>
                </header>

                {/* Content Sections */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                    <h3 
                      className="text-xl font-bold mb-3"
                      style={{ color: groupedColors[selectedPaletteForPreview][0] || '#1f2937' }}
                    >
                      Feature One
                    </h3>
                    <p 
                      className="text-gray-700"
                      style={{ color: groupedColors[selectedPaletteForPreview][2] || '#6b7280' }}
                    >
                      This section demonstrates how text colors work with the selected palette. Notice the contrast and readability.
                    </p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                    <h3 
                      className="text-xl font-bold mb-3"
                      style={{ color: groupedColors[selectedPaletteForPreview][0] || '#1f2937' }}
                    >
                      Feature Two
                    </h3>
                    <p 
                      className="text-gray-700"
                      style={{ color: groupedColors[selectedPaletteForPreview][2] || '#6b7280' }}
                    >
                      Each color in the palette serves a specific purpose - from headings to body text to accents.
                    </p>
                  </div>
                </div>

                {/* Call to Action */}
                <div 
                  className="text-center py-8 rounded-xl"
                  style={{ backgroundColor: groupedColors[selectedPaletteForPreview][3] || '#9ca3af' }}
                >
                  <h2 
                    className="text-3xl font-bold mb-4"
                    style={{ 
                      color: tinycolor(groupedColors[selectedPaletteForPreview][3] || '#9ca3af').isLight() ? '#000000' : '#ffffff' 
                    }}
                  >
                    Ready to Get Started?
                  </h2>
                  <p 
                    className="mb-6 max-w-xl mx-auto"
                    style={{ 
                      color: tinycolor(groupedColors[selectedPaletteForPreview][3] || '#9ca3af').isLight() ? '#000000' : '#ffffff' 
                    }}
                  >
                    Join thousands of satisfied customers who trust our platform.
                  </p>
                  <button
                    className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundColor: groupedColors[selectedPaletteForPreview][0] || '#1f2937',
                      color: tinycolor(groupedColors[selectedPaletteForPreview][0] || '#1f2937').isLight() ? '#000000' : '#ffffff'
                    }}
                  >
                    Sign Up Now
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close Preview
              </button>
              {/* <button
                onClick={() => openPreviewInNewTab(selectedPaletteForPreview)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaExternalLinkAlt />
                Open Full Screen
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaletteGenerator;

