import React, { useState, useEffect } from 'react';
import { FaCopy, FaCheck, FaHeart, FaRegHeart, FaPalette, FaRandom } from 'react-icons/fa';
import tinycolor from 'tinycolor2';

const ColorHarmony = () => {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [harmonyType, setHarmonyType] = useState('analogous');
  const [copiedColor, setCopiedColor] = useState(null);
  const [likedPalettes, setLikedPalettes] = useState([]);

  const harmonyTypes = [
    { id: 'analogous', name: 'Analogous', description: 'Colors next to each other on the color wheel', icon: '🎨' },
    { id: 'triadic', name: 'Triadic', description: 'Three colors equally spaced on the color wheel', icon: '🔺' },
    { id: 'split-complementary', name: 'Split-Complementary', description: 'Base color plus two colors adjacent to its complement', icon: '⚡' },
    { id: 'monochromatic', name: 'Monochromatic', description: 'Different shades and tints of the same color', icon: '🎯' },
    { id: 'complementary', name: 'Complementary', description: 'Two colors opposite each other on the color wheel', icon: '🔄' },
    { id: 'tetradic', name: 'Tetradic', description: 'Two pairs of complementary colors', icon: '⬜' }
  ];

  const generateHarmony = (color, type) => {
    const base = tinycolor(color);
    const hsl = base.toHsl();
    const colors = [];

    switch (type) {
      case 'analogous':
        // Generate 5 analogous colors (30° apart)
        for (let i = -60; i <= 60; i += 30) {
          const newHue = (hsl.h + i + 360) % 360;
          colors.push(tinycolor({ h: newHue, s: hsl.s, l: hsl.l }));
        }
        break;

      case 'triadic':
        // Generate 3 colors 120° apart
        for (let i = 0; i < 3; i++) {
          const newHue = (hsl.h + i * 120) % 360;
          colors.push(tinycolor({ h: newHue, s: hsl.s, l: hsl.l }));
        }
        break;

      case 'split-complementary':
        // Base color plus two colors adjacent to its complement
        const complement = (hsl.h + 180) % 360;
        colors.push(base);
        colors.push(tinycolor({ h: (complement - 30 + 360) % 360, s: hsl.s, l: hsl.l }));
        colors.push(tinycolor({ h: (complement + 30) % 360, s: hsl.s, l: hsl.l }));
        break;

      case 'monochromatic':
        // Different shades and tints of the same color
        colors.push(base);
        colors.push(base.clone().lighten(20));
        colors.push(base.clone().lighten(40));
        colors.push(base.clone().darken(20));
        colors.push(base.clone().darken(40));
        break;

      case 'complementary':
        // Base color and its complement
        colors.push(base);
        colors.push(tinycolor({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }));
        break;

      case 'tetradic':
        // Two pairs of complementary colors
        const hue1 = hsl.h;
        const hue2 = (hue1 + 90) % 360;
        const hue3 = (hue1 + 180) % 360;
        const hue4 = (hue1 + 270) % 360;
        colors.push(tinycolor({ h: hue1, s: hsl.s, l: hsl.l }));
        colors.push(tinycolor({ h: hue2, s: hsl.s, l: hsl.l }));
        colors.push(tinycolor({ h: hue3, s: hsl.s, l: hsl.l }));
        colors.push(tinycolor({ h: hue4, s: hsl.s, l: hsl.l }));
        break;

      default:
        break;
    }

    return colors.map(color => ({
      hex: color.toHexString(),
      rgb: color.toRgbString(),
      hsl: color.toHslString(),
      name: getColorName(color.toHexString())
    }));
  };

  const getColorName = (hex) => {
    const color = tinycolor(hex);
    const hsl = color.toHsl();
    
    // Simple color naming based on hue
    if (hsl.s < 0.1) {
      if (hsl.l > 0.8) return 'White';
      if (hsl.l < 0.2) return 'Black';
      return 'Gray';
    }
    
    if (hsl.h < 15 || hsl.h > 345) return 'Red';
    if (hsl.h < 45) return 'Orange';
    if (hsl.h < 75) return 'Yellow';
    if (hsl.h < 165) return 'Green';
    if (hsl.h < 195) return 'Cyan';
    if (hsl.h < 255) return 'Blue';
    if (hsl.h < 285) return 'Purple';
    if (hsl.h < 315) return 'Magenta';
    return 'Pink';
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

  const toggleLike = (palette) => {
    setLikedPalettes(prev => {
      const paletteId = `${harmonyType}-${baseColor}`;
      if (prev.find(p => p.id === paletteId)) {
        return prev.filter(p => p.id !== paletteId);
      } else {
        return [...prev, { id: paletteId, type: harmonyType, baseColor, colors: palette }];
      }
    });
  };

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    setBaseColor(randomColor);
  };

  const harmonyColors = generateHarmony(baseColor, harmonyType);
  const isLiked = likedPalettes.find(p => p.id === `${harmonyType}-${baseColor}`);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Color Harmony Generator
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create beautiful color schemes using advanced color theory principles
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Base Color Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Base Color</h3>
            
            <div className="flex gap-3 mb-4">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-16 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                placeholder="#3B82F6"
              />
              <button
                onClick={generateRandomColor}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Generate random color"
              >
                <FaRandom />
              </button>
            </div>

            {/* Color Preview */}
            <div 
              className="w-full h-20 rounded-lg mb-4 flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: baseColor }}
            >
              {getColorName(baseColor)}
            </div>

            {/* Color Values */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">HEX:</span>
                <span className="font-mono font-bold">{baseColor.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">RGB:</span>
                <span className="font-mono">{tinycolor(baseColor).toRgbString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">HSL:</span>
                <span className="font-mono">{tinycolor(baseColor).toHslString()}</span>
              </div>
            </div>
          </div>

          {/* Harmony Type Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Harmony Type</h3>
            
            <div className="space-y-3">
              {harmonyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setHarmonyType(type.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    harmonyType === type.id
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
        </div>

        {/* Harmony Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generated Palette */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                {harmonyTypes.find(t => t.id === harmonyType)?.name} Harmony
              </h3>
              <button
                onClick={() => toggleLike(harmonyColors)}
                className={`p-2 rounded-lg transition-colors ${
                  isLiked 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isLiked ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isLiked ? <FaHeart /> : <FaRegHeart />}
              </button>
            </div>

            {/* Color Palette Display */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {harmonyColors.map((color, index) => (
                <div
                  key={index}
                  className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {/* Color Swatch */}
                  <div 
                    className="h-24 relative"
                    style={{ backgroundColor: color.hex }}
                  >
                    {/* Copy Button */}
                    <button
                      onClick={() => copyToClipboard(color.hex, `harmony-${index}`)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 p-2 rounded-lg shadow-lg"
                      title="Copy color"
                    >
                      {copiedColor === `harmony-${index}` ? (
                        <FaCheck className="w-4 h-4 text-green-600" />
                      ) : (
                        <FaCopy className="w-4 h-4 text-gray-700" />
                      )}
                    </button>
                  </div>

                  {/* Color Information */}
                  <div className="p-3">
                    <div className="text-center mb-2">
                      <p className="text-xs font-semibold text-gray-800">{color.name}</p>
                      <p className="font-mono text-sm font-bold text-gray-900">{color.hex}</p>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>RGB:</span>
                        <span className="font-mono">{color.rgb}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HSL:</span>
                        <span className="font-mono">{color.hsl}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Copy All Colors */}
            <button
              onClick={() => copyToClipboard(harmonyColors.map(c => c.hex).join(', '), 'all')}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <FaCopy />
              Copy All Colors
              {copiedColor === 'all' && <FaCheck />}
            </button>
          </div>

          {/* Usage Examples */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Usage Examples</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              {/* UI Example */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-800">UI Components</h4>
                <div className="space-y-2">
                  <div 
                    className="p-3 rounded-lg text-white font-semibold"
                    style={{ backgroundColor: harmonyColors[0]?.hex }}
                  >
                    Primary Button
                  </div>
                  <div 
                    className="p-3 rounded-lg border-2"
                    style={{ 
                      backgroundColor: harmonyColors[1]?.hex,
                      borderColor: harmonyColors[0]?.hex,
                      color: harmonyColors[0]?.hex
                    }}
                  >
                    Secondary Button
                  </div>
                  <div 
                    className="p-3 rounded-lg"
                    style={{ 
                      backgroundColor: harmonyColors[2]?.hex,
                      color: 'white'
                    }}
                  >
                    Accent Element
                  </div>
                </div>
              </div>

              {/* Web Example */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold mb-3 text-gray-800">Web Design</h4>
                <div className="space-y-2">
                  <div 
                    className="p-2 rounded text-sm"
                    style={{ 
                      backgroundColor: harmonyColors[0]?.hex,
                      color: 'white'
                    }}
                  >
                    Header Background
                  </div>
                  <div 
                    className="p-2 rounded text-sm"
                    style={{ 
                      backgroundColor: harmonyColors[1]?.hex,
                      color: 'white'
                    }}
                  >
                    Navigation
                  </div>
                  <div 
                    className="p-2 rounded text-sm border"
                    style={{ 
                      backgroundColor: harmonyColors[2]?.hex,
                      borderColor: harmonyColors[0]?.hex,
                      color: harmonyColors[0]?.hex
                    }}
                  >
                    Content Area
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Color Harmony Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <ul className="space-y-2">
            <li>• <strong>Analogous:</strong> Perfect for creating peaceful, comfortable designs</li>
            <li>• <strong>Triadic:</strong> Offers high contrast while maintaining harmony</li>
            <li>• <strong>Split-Complementary:</strong> High contrast with less tension than complementary</li>
          </ul>
          <ul className="space-y-2">
            <li>• <strong>Monochromatic:</strong> Creates a cohesive, sophisticated look</li>
            <li>• <strong>Complementary:</strong> Maximum contrast and impact</li>
            <li>• <strong>Tetradic:</strong> Rich and varied, best with one dominant color</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ColorHarmony; 