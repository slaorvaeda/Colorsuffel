import React, { useState, useEffect } from 'react';
import { FaEye, FaCopy, FaCheck, FaUpload, FaDownload } from 'react-icons/fa';
import tinycolor from 'tinycolor2';

const ColorBlindnessSimulator = () => {
  const [selectedColors, setSelectedColors] = useState(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']);
  const [selectedType, setSelectedType] = useState('protanopia');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [copiedColor, setCopiedColor] = useState(null);

  const colorBlindnessTypes = [
    {
      id: 'normal',
      name: 'Normal Vision',
      description: 'How colors appear to people with normal color vision',
      icon: '👁️',
      filter: 'none'
    },
    {
      id: 'protanopia',
      name: 'Protanopia (Red-Blind)',
      description: 'Difficulty distinguishing between red and green colors',
      icon: '🔴',
      filter: 'url(#protanopia)'
    },
    {
      id: 'deuteranopia',
      name: 'Deuteranopia (Green-Blind)',
      description: 'Most common type of color blindness, affects red-green perception',
      icon: '🟢',
      filter: 'url(#deuteranopia)'
    },
    {
      id: 'tritanopia',
      name: 'Tritanopia (Blue-Blind)',
      description: 'Difficulty distinguishing between blue and yellow colors',
      icon: '🔵',
      filter: 'url(#tritanopia)'
    },
    {
      id: 'achromatopsia',
      name: 'Achromatopsia (Monochromacy)',
      description: 'Complete color blindness, sees only in grayscale',
      icon: '⚫',
      filter: 'url(#achromatopsia)'
    }
  ];

  const addColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    setSelectedColors(prev => [...prev, randomColor]);
  };

  const removeColor = (index) => {
    setSelectedColors(prev => prev.filter((_, i) => i !== index));
  };

  const updateColor = (index, newColor) => {
    setSelectedColors(prev => prev.map((color, i) => i === index ? newColor : color));
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(type);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = () => {
    if (uploadedImage) {
      const link = document.createElement('a');
      link.href = uploadedImage;
      link.download = 'colorblind-simulation.png';
      link.click();
    }
  };

  const getContrastRatio = (color1, color2) => {
    return tinycolor.readability(color1, color2);
  };

  const isAccessible = (color1, color2) => {
    return getContrastRatio(color1, color2) >= 4.5;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Color Blindness Simulator
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          See how your colors appear to people with different types of color vision deficiencies
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Color Blindness Type Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Vision Type</h3>
            
            <div className="space-y-3">
              {colorBlindnessTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedType === type.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{type.icon}</span>
                    <div>
                      <div className="font-semibold">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Management */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Test Colors</h3>
              <button
                onClick={addColor}
                className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors"
              >
                Add Color
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedColors.map((color, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="w-12 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(color, `color-${index}`)}
                    className="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Copy color"
                  >
                    {copiedColor === `color-${index}` ? <FaCheck className="text-green-600" /> : <FaCopy />}
                  </button>
                  <button
                    onClick={() => removeColor(index)}
                    className="px-2 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                    title="Remove color"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Test Your Images</h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <FaUpload className="mx-auto text-2xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload an image</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </label>
              </div>
              
              {uploadedImage && (
                <button
                  onClick={downloadImage}
                  className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaDownload />
                  Download Simulated Image
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Simulation Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Color Palette Comparison */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Color Palette Comparison</h3>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Normal Vision */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Normal Vision</h4>
                <div className="grid grid-cols-5 gap-2">
                  {selectedColors.map((color, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg shadow-md"
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Simulated Vision */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">
                  {colorBlindnessTypes.find(t => t.id === selectedType)?.name}
                </h4>
                <div 
                  className="grid grid-cols-5 gap-2"
                  style={{ filter: colorBlindnessTypes.find(t => t.id === selectedType)?.filter }}
                >
                  {selectedColors.map((color, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg shadow-md"
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Accessibility Analysis */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Accessibility Analysis</h3>
            
            <div className="space-y-4">
              {selectedColors.map((color1, index1) => 
                selectedColors.slice(index1 + 1).map((color2, index2) => {
                  const contrast = getContrastRatio(color1, color2);
                  const accessible = isAccessible(color1, color2);
                  return (
                    <div key={`${index1}-${index2}`} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex gap-2">
                        <div 
                          className="w-8 h-8 rounded border-2 border-white shadow-sm"
                          style={{ backgroundColor: color1 }}
                        ></div>
                        <div 
                          className="w-8 h-8 rounded border-2 border-white shadow-sm"
                          style={{ backgroundColor: color2 }}
                        ></div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {color1} vs {color2}
                        </div>
                        <div className="text-xs text-gray-500">
                          Contrast ratio: {contrast.toFixed(2)}:1
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        accessible 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {accessible ? 'Accessible' : 'Poor Contrast'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Image Simulation */}
          {uploadedImage && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Image Simulation</h3>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Original Image */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">Original Image</h4>
                  <img 
                    src={uploadedImage} 
                    alt="Original" 
                    className="w-full rounded-lg shadow-md"
                  />
                </div>

                {/* Simulated Image */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-700">
                    {colorBlindnessTypes.find(t => t.id === selectedType)?.name}
                  </h4>
                  <div 
                    className="rounded-lg shadow-md overflow-hidden"
                    style={{ filter: colorBlindnessTypes.find(t => t.id === selectedType)?.filter }}
                  >
                    <img 
                      src={uploadedImage} 
                      alt="Simulated" 
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SVG Filters for Color Blindness Simulation */}
      <svg style={{ position: 'absolute', left: '-9999px' }}>
        <defs>
          {/* Protanopia Filter */}
          <filter id="protanopia">
            <feColorMatrix type="matrix" values="
              0.567 0.433 0 0 0
              0.558 0.442 0 0 0
              0 0.242 0.758 0 0
              0 0 0 1 0
            "/>
          </filter>
          
          {/* Deuteranopia Filter */}
          <filter id="deuteranopia">
            <feColorMatrix type="matrix" values="
              0.625 0.375 0 0 0
              0.7 0.3 0 0 0
              0 0.3 0.7 0 0
              0 0 0 1 0
            "/>
          </filter>
          
          {/* Tritanopia Filter */}
          <filter id="tritanopia">
            <feColorMatrix type="matrix" values="
              0.95 0.05 0 0 0
              0 0.433 0.567 0 0
              0 0.475 0.525 0 0
              0 0 0 1 0
            "/>
          </filter>
          
          {/* Achromatopsia Filter */}
          <filter id="achromatopsia">
            <feColorMatrix type="matrix" values="
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0.299 0.587 0.114 0 0
              0 0 0 1 0
            "/>
          </filter>
        </defs>
      </svg>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Color Blindness Design Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <ul className="space-y-2">
            <li>• <strong>Use High Contrast:</strong> Ensure text has sufficient contrast with backgrounds</li>
            <li>• <strong>Avoid Red-Green Combinations:</strong> These are difficult for most color blind users</li>
            <li>• <strong>Add Text Labels:</strong> Don't rely solely on color to convey information</li>
          </ul>
          <ul className="space-y-2">
            <li>• <strong>Test Your Designs:</strong> Use tools like this to verify accessibility</li>
            <li>• <strong>Use Patterns:</strong> Combine colors with patterns or textures</li>
            <li>• <strong>Consider Monochrome:</strong> Ensure designs work in grayscale</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ColorBlindnessSimulator; 