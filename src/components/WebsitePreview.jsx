import React, { useState, useEffect } from 'react';
import { FaEye, FaCopy, FaCheck, FaPalette, FaExternalLinkAlt, FaUndo, FaSave, FaDownload } from 'react-icons/fa';
import tinycolor from 'tinycolor2';
import colorPalettesData from '../data/colorPalettes.json';

const WebsitePreview = () => {
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [copiedColor, setCopiedColor] = useState(null);
  const [showColorInfo, setShowColorInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [customColors, setCustomColors] = useState(['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe']);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState([]);

  const { palettes, categories } = colorPalettesData;
  const colorPalettes = palettes;

  // Filter palettes based on selected category
  const filteredPalettes = selectedCategory === 'All' 
    ? colorPalettes 
    : colorPalettes.filter(palette => palette.category === selectedCategory);

  const currentPalette = isCustomMode 
    ? { name: "Custom Palette", colors: customColors }
    : (filteredPalettes[selectedPalette] || filteredPalettes[0]);

  const copyToClipboard = async (color, colorType) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(colorType);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getContrastColor = (backgroundColor) => {
    return tinycolor(backgroundColor).isLight() ? '#000000' : '#ffffff';
  };

  const getAccessibilityScore = (backgroundColor, textColor) => {
    const contrast = tinycolor.readability(backgroundColor, textColor);
    if (contrast >= 7) return { score: 'AAA', color: 'text-green-600' };
    if (contrast >= 4.5) return { score: 'AA', color: 'text-yellow-600' };
    return { score: 'Fail', color: 'text-red-600' };
  };

  const handleCustomColorChange = (index, color) => {
    const newColors = [...customColors];
    newColors[index] = color;
    setCustomColors(newColors);
  };

  const saveCustomPalette = () => {
    const newPalette = {
      id: `custom-${Date.now()}`,
      name: `Custom Palette ${savedPalettes.length + 1}`,
      colors: [...customColors],
      category: 'Custom',
      isCustom: true
    };
    setSavedPalettes([...savedPalettes, newPalette]);
    
    // Save to localStorage
    const existing = JSON.parse(localStorage.getItem('custom-palettes') || '[]');
    localStorage.setItem('custom-palettes', JSON.stringify([...existing, newPalette]));
  };

  const openInNewTab = () => {
    const previewData = {
      palette: currentPalette,
      timestamp: Date.now()
    };
    localStorage.setItem('website-preview-data', JSON.stringify(previewData));
    window.open('/website-preview-full', '_blank');
  };

  // Load saved palettes from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('custom-palettes') || '[]');
    setSavedPalettes(saved);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Reset selected palette when category changes
  useEffect(() => {
    setSelectedPalette(0);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Website Preview Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create custom color palettes and see how they transform your website design. 
            Preview in real-time and open in a new tab for full-screen experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Control Panel */}
          <div className="space-y-6">
            {/* Mode Toggle */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaPalette className="text-purple-600" />
                Color Mode
              </h3>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCustomMode(false)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    !isCustomMode
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Preset Palettes
                </button>
                <button
                  onClick={() => setIsCustomMode(true)}
                  className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                    isCustomMode
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Custom Colors
                </button>
              </div>
            </div>

            {/* Palette Selector or Custom Colors */}
            {!isCustomMode ? (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaPalette className="text-purple-600" />
                    Choose Palette
                  </h3>
                  
                  {/* Category Dropdown */}
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 text-sm"
                    >
                      <span className="font-medium text-gray-700">
                        {selectedCategory}
                      </span>
                      <FaCopy className={`text-gray-600 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showDropdown && (
                      <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-40">
                        {['All', ...categories].map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowDropdown(false);
                            }}
                            className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors duration-200 text-sm ${
                              selectedCategory === category ? 'bg-purple-50 text-purple-700 font-medium' : 'text-gray-700'
                            } ${category === 'All' ? 'border-b border-gray-200' : ''}`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredPalettes.map((palette, index) => (
                    <button
                      key={palette.id}
                      onClick={() => setSelectedPalette(index)}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left ${
                        selectedPalette === index
                          ? 'border-purple-500 bg-purple-50 shadow-md'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex rounded overflow-hidden">
                          {palette.colors.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-6 h-6"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{palette.name}</div>
                          <div className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full inline-block mt-1">
                            {palette.category}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaPalette className="text-purple-600" />
                  Custom Colors
                </h3>
                
                <div className="space-y-4">
                  {customColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Color {index + 1}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={color}
                            onChange={(e) => handleCustomColorChange(index, e.target.value)}
                            className="w-12 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => handleCustomColorChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                            placeholder="#000000"
                          />
                          <button
                            onClick={() => copyToClipboard(color, `custom-${index}`)}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            {copiedColor === `custom-${index}` ? (
                              <FaCheck className="text-green-600" />
                            ) : (
                              <FaCopy className="text-gray-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex gap-2 pt-4">
                    <button
                      onClick={saveCustomPalette}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
                    >
                      <FaSave />
                      Save Palette
                    </button>
                    <button
                      onClick={() => setCustomColors(['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'])}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Reset to default"
                    >
                      <FaUndo />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Saved Custom Palettes */}
            {savedPalettes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Palettes</h3>
                <div className="space-y-2">
                  {savedPalettes.map((palette, index) => (
                    <button
                      key={palette.id}
                      onClick={() => {
                        setCustomColors(palette.colors);
                        setIsCustomMode(true);
                      }}
                      className="w-full p-2 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-gray-50 transition-all duration-300 text-left"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex rounded overflow-hidden">
                          {palette.colors.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-4 h-4"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{palette.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Open in New Tab Button */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Preview Options</h3>
              <button
                onClick={openInNewTab}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
              >
                <FaExternalLinkAlt />
                Open Full Preview in New Tab
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Opens a full-screen website preview with your selected colors
              </p>
            </div>
          </div>

          {/* Website Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <FaEye className="text-blue-600" />
                      Live Website Preview
                    </h3>
                    <p className="text-gray-600">
                      Current palette: {currentPalette?.name}
                    </p>
                  </div>
                  <button
                    onClick={openInNewTab}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FaExternalLinkAlt />
                    Full Screen
                  </button>
                </div>
              </div>
              
              {/* Demo Website */}
              <div 
                className="p-8"
                style={{ backgroundColor: currentPalette?.colors[4] || '#f3f4f6' }}
              >
                {/* Header */}
                <header className="mb-8">
                  <nav className="flex items-center justify-between mb-6">
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: currentPalette?.colors[0] || '#1f2937' }}
                    >
                      BrandName
                    </div>
                    <div className="flex gap-6">
                      {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
                        <a
                          key={index}
                          href="#"
                          className="font-medium hover:underline transition-colors"
                          style={{ color: currentPalette?.colors[1] || '#374151' }}
                        >
                          {item}
                        </a>
                      ))}
                    </div>
                  </nav>
                  
                  <div className="text-center py-12">
                    <h1 
                      className="text-5xl font-bold mb-4"
                      style={{ color: currentPalette?.colors[0] || '#1f2937' }}
                    >
                      Welcome to Our Website
                    </h1>
                    <p 
                      className="text-xl mb-8 max-w-2xl mx-auto"
                      style={{ color: currentPalette?.colors[2] || '#6b7280' }}
                    >
                      Experience the perfect blend of design and functionality with our carefully crafted color palette.
                    </p>
                    <button
                      className="px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105"
                      style={{ backgroundColor: currentPalette?.colors[1] || '#3b82f6' }}
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
                      style={{ color: currentPalette?.colors[0] || '#1f2937' }}
                    >
                      Feature One
                    </h3>
                    <p 
                      className="text-gray-700"
                      style={{ color: currentPalette?.colors[2] || '#6b7280' }}
                    >
                      This section demonstrates how text colors work with the selected palette. Notice the contrast and readability.
                    </p>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                    <h3 
                      className="text-xl font-bold mb-3"
                      style={{ color: currentPalette?.colors[0] || '#1f2937' }}
                    >
                      Feature Two
                    </h3>
                    <p 
                      className="text-gray-700"
                      style={{ color: currentPalette?.colors[2] || '#6b7280' }}
                    >
                      Each color in the palette serves a specific purpose - from headings to body text to accents.
                    </p>
                  </div>
                </div>

                {/* Call to Action */}
                <div 
                  className="text-center py-8 rounded-xl"
                  style={{ backgroundColor: currentPalette?.colors[3] || '#9ca3af' }}
                >
                  <h2 
                    className="text-3xl font-bold mb-4"
                    style={{ color: getContrastColor(currentPalette?.colors[3] || '#9ca3af') }}
                  >
                    Ready to Get Started?
                  </h2>
                  <p 
                    className="mb-6 max-w-xl mx-auto"
                    style={{ color: getContrastColor(currentPalette?.colors[3] || '#9ca3af') }}
                  >
                    Join thousands of satisfied customers who trust our platform.
                  </p>
                  <button
                    className="px-6 py-2 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundColor: currentPalette?.colors[0] || '#1f2937',
                      color: getContrastColor(currentPalette?.colors[0] || '#1f2937')
                    }}
                  >
                    Sign Up Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsitePreview; 