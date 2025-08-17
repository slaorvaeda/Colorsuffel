import React, { useState, useEffect } from 'react';
import { FaPalette, FaEye, FaCopy, FaCheck, FaDownload, FaUndo, FaChevronDown, FaFilter, FaExternalLinkAlt, FaSave, FaShare, FaBook } from 'react-icons/fa';
import tinycolor from 'tinycolor2';
import colorPalettesData from '../data/colorPalettes.json';
import { useNavigate } from 'react-router-dom';

const DemoWebsite = () => {
  const navigate = useNavigate();
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [copiedColor, setCopiedColor] = useState(null);
  const [showColorInfo, setShowColorInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [customColors, setCustomColors] = useState(['#1e3a8a', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe']);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState([]);

  // Use data from JSON file
  const { palettes, categories } = colorPalettesData;
  const colorPalettes = palettes;

  // Filter palettes based on selected category
  const filteredPalettes = selectedCategory === 'All' 
    ? colorPalettes 
    : colorPalettes.filter(palette => palette.category === selectedCategory);

  const currentPalette = isCustomMode 
    ? { name: "Custom Palette", colors: customColors, category: "Custom" }
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

  const downloadPalette = () => {
    if (!currentPalette) return;
    
    const colors = currentPalette.colors;
    const css = `/* ${currentPalette.name} Color Palette */\n\n` +
      `:root {\n` +
      colors.map((color, index) => `  --color-${index + 1}: ${color};`).join('\n') +
      `\n}\n\n` +
      `/* Usage Examples */\n` +
      `.primary-color { color: var(--color-1); }\n` +
      `.secondary-color { color: var(--color-2); }\n` +
      `.accent-color { color: var(--color-3); }\n` +
      `.background-color { background-color: var(--color-4); }\n` +
      `.light-background { background-color: var(--color-5); }`;

    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPalette.name.toLowerCase().replace(/\s+/g, '-')}-palette.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sharePalette = async () => {
    if (!currentPalette) return;
    
    const colors = currentPalette.colors.join(', ');
    const text = `Check out this color palette: ${currentPalette.name}\nColors: ${colors}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: currentPalette.name,
          text: text,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(text);
      alert('Palette information copied to clipboard!');
    }
  };

  // Load saved palettes from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('custom-palettes') || '[]');
    setSavedPalettes(saved);
  }, []);

  // Reset selected palette when category changes
  useEffect(() => {
    setSelectedPalette(0);
  }, [selectedCategory]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Color Palette Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how different color palettes transform a website's look and feel. 
            Experience the power of color psychology in web design with advanced preview features.
          </p>
          
          {/* Circular UI/UX Design Guide Button */}
          <button
            onClick={() => navigate('/ui-design-guide')}
            className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group"
            title="UI/UX Design Guide"
          >
            <FaBook className="text-xl group-hover:rotate-12 transition-transform duration-300" />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Design Guide
            </div>
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaPalette className="text-purple-600" />
                Color Mode
              </h2>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setIsCustomMode(false)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    !isCustomMode
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Preset Palettes
                </button>
                <button
                  onClick={() => setIsCustomMode(true)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
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
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Choose Your Palette</h3>
                  
                  {/* Category Dropdown */}
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                      <FaFilter className="text-gray-600" />
                      <span className="font-medium text-gray-700">
                        {selectedCategory}
                      </span>
                      <FaChevronDown className={`text-gray-600 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showDropdown && (
                      <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-48">
                        {['All', ...categories].map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPalettes.map((palette, index) => (
                    <button
                      key={palette.id}
                      onClick={() => setSelectedPalette(index)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        selectedPalette === index
                          ? 'border-purple-500 bg-purple-50 shadow-lg'
                          : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex rounded-lg overflow-hidden">
                          {palette.colors.map((color, colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-6 h-6"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <div className="flex-1 text-left">
                          <span className="font-semibold text-gray-800 block">{palette.name}</span>
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                            {palette.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 text-left">{palette.description}</p>
                    </button>
                  ))}
                </div>
                
                {filteredPalettes.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No palettes found in this category.</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Custom Colors</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {customColors.map((color, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={saveCustomPalette}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
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
            )}

            {/* Saved Custom Palettes */}
            {savedPalettes.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Palettes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {savedPalettes.map((palette, index) => (
                    <button
                      key={palette.id}
                      onClick={() => {
                        setCustomColors(palette.colors);
                        setIsCustomMode(true);
                      }}
                      className="p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-gray-50 transition-all duration-300 text-left"
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
          </div>
        </div>

        {/* Demo Website Preview */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Website Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                      <FaEye className="text-blue-600" />
                      Website Preview
                    </h3>
                    <p className="text-gray-600">
                      Current palette: {currentPalette?.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={openInNewTab}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <FaExternalLinkAlt />
                      Full Screen
                    </button>
                    <button
                      onClick={downloadPalette}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <FaDownload />
                      CSS
                    </button>
                    <button
                      onClick={sharePalette}
                      className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <FaShare />
                      Share
                    </button>
                  </div>
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

          {/* Color Information Panel */}
          <div className="space-y-6">
            {/* Current Palette Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaEye className="text-blue-600" />
                {currentPalette?.name}
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {currentPalette?.colors.map((color, index) => (
                    <div
                      key={index}
                      className="relative group"
                      onMouseEnter={() => setShowColorInfo(index)}
                      onMouseLeave={() => setShowColorInfo(null)}
                    >
                      <button
                        onClick={() => copyToClipboard(color, `color-${index}`)}
                        className="w-12 h-12 rounded-lg shadow-md hover:scale-110 transition-all duration-300 flex items-center justify-center"
                        style={{ backgroundColor: color }}
                      >
                        {copiedColor === `color-${index}` ? (
                          <FaCheck className="text-white text-sm" />
                        ) : (
                          <FaCopy className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                      
                      {/* Color Info Tooltip */}
                      {showColorInfo === index && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/80 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-10">
                          {color}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-black/80 border-t-4 border-t-transparent border-r-4 border-r-transparent"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {!isCustomMode && currentPalette?.ideology && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Color Ideology</h4>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                      {currentPalette.ideology}
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">Mood</h5>
                        <p className="text-sm text-gray-600">{currentPalette.mood}</p>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-gray-800 mb-1">Best For</h5>
                        <div className="flex flex-wrap gap-1">
                          {currentPalette.bestFor?.map((useCase, index) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                            >
                              {useCase}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Accessibility Checker */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Accessibility Check
              </h3>
              
              <div className="space-y-3">
                {currentPalette?.colors.slice(0, 3).map((bgColor, index) => {
                  const textColor = getContrastColor(bgColor);
                  const accessibility = getAccessibilityScore(bgColor, textColor);
                  
                  return (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: bgColor }}>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: textColor }}>
                          Color {index + 1} on Text
                        </p>
                      </div>
                      <span className={`text-sm font-bold ${accessibility.color}`}>
                        {accessibility.score}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Usage Guidelines */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Usage Guidelines
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full mt-1" style={{ backgroundColor: currentPalette?.colors[0] || '#1f2937' }}></div>
                  <div>
                    <strong>Primary Color:</strong> Main headings, important buttons
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full mt-1" style={{ backgroundColor: currentPalette?.colors[1] || '#3b82f6' }}></div>
                  <div>
                    <strong>Secondary Color:</strong> Navigation, links, secondary buttons
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full mt-1" style={{ backgroundColor: currentPalette?.colors[2] || '#6b7280' }}></div>
                  <div>
                    <strong>Tertiary Color:</strong> Body text, descriptions
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full mt-1" style={{ backgroundColor: currentPalette?.colors[3] || '#9ca3af' }}></div>
                  <div>
                    <strong>Accent Color:</strong> Highlights, call-to-action backgrounds
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full mt-1" style={{ backgroundColor: currentPalette?.colors[4] || '#f3f4f6' }}></div>
                  <div>
                    <strong>Background Color:</strong> Page backgrounds, cards
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoWebsite; 