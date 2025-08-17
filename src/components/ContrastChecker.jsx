import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaCopy } from 'react-icons/fa';
import tinycolor from 'tinycolor2';

const ContrastChecker = () => {
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [copiedColor, setCopiedColor] = useState(null);

  const calculateContrast = (color1, color2) => {
    const c1 = tinycolor(color1);
    const c2 = tinycolor(color2);
    return tinycolor.readability(c1, c2);
  };

  const getWCAGLevel = (contrast) => {
    if (contrast >= 7) return { level: 'AAA', status: 'Excellent', color: 'text-green-600' };
    if (contrast >= 4.5) return { level: 'AA', status: 'Good', color: 'text-blue-600' };
    if (contrast >= 3) return { level: 'A', status: 'Fair', color: 'text-yellow-600' };
    return { level: 'Fail', status: 'Poor', color: 'text-red-600' };
  };

  const contrast = calculateContrast(foregroundColor, backgroundColor);
  const wcagLevel = getWCAGLevel(contrast);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(type);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const generateAccessibleColors = (baseColor) => {
    const base = tinycolor(baseColor);
    const colors = [];
    
    // Generate accessible foreground colors
    for (let i = 0; i <= 100; i += 10) {
      const light = tinycolor.mix('#FFFFFF', baseColor, i);
      const dark = tinycolor.mix('#000000', baseColor, i);
      
      if (calculateContrast(light, baseColor) >= 4.5) {
        colors.push({ color: light.toHexString(), type: 'light', contrast: calculateContrast(light, baseColor) });
      }
      if (calculateContrast(dark, baseColor) >= 4.5) {
        colors.push({ color: dark.toHexString(), type: 'dark', contrast: calculateContrast(dark, baseColor) });
      }
    }
    
    return colors.slice(0, 10); // Return top 10
  };

  const accessibleColors = generateAccessibleColors(backgroundColor);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          WCAG Contrast Checker
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Ensure your color combinations meet accessibility standards for better user experience
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Color Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Color Selection</h3>
          
          {/* Foreground Color */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Foreground Color (Text)
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className="w-16 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                placeholder="#000000"
              />
              <button
                onClick={() => copyToClipboard(foregroundColor, 'foreground')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Copy color"
              >
                {copiedColor === 'foreground' ? <FaCheck className="text-green-600" /> : <FaCopy />}
              </button>
            </div>
          </div>

          {/* Background Color */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Background Color
            </label>
            <div className="flex gap-3">
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-16 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                placeholder="#FFFFFF"
              />
              <button
                onClick={() => copyToClipboard(backgroundColor, 'background')}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Copy color"
              >
                {copiedColor === 'background' ? <FaCheck className="text-green-600" /> : <FaCopy />}
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Quick Presets
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setForegroundColor('#000000'); setBackgroundColor('#FFFFFF'); }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Black on White
              </button>
              <button
                onClick={() => { setForegroundColor('#FFFFFF'); setBackgroundColor('#000000'); }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                White on Black
              </button>
              <button
                onClick={() => { setForegroundColor('#000000'); setBackgroundColor('#F3F4F6'); }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Black on Gray
              </button>
              <button
                onClick={() => { setForegroundColor('#FFFFFF'); setBackgroundColor('#1F2937'); }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                White on Dark
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Contrast Results */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Contrast Results</h3>
            
            {/* Preview */}
            <div 
              className="mb-6 p-6 rounded-xl text-center"
              style={{ 
                backgroundColor: backgroundColor,
                color: foregroundColor
              }}
            >
              <p className="text-lg font-semibold mb-2">Sample Text</p>
              <p className="text-sm">This is how your text will appear with the selected colors.</p>
            </div>

            {/* Contrast Ratio */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-800">{contrast.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Contrast Ratio</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${wcagLevel.color}`}>{wcagLevel.level}</div>
                <div className="text-sm text-gray-600">{wcagLevel.status}</div>
              </div>
            </div>

            {/* WCAG Compliance */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Normal Text (AA)</span>
                  <span className="text-xs text-gray-500">≥ 4.5:1</span>
                </div>
                {contrast >= 4.5 ? (
                  <FaCheck className="text-green-600" />
                ) : (
                  <FaTimes className="text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Large Text (AA)</span>
                  <span className="text-xs text-gray-500">≥ 3:1</span>
                </div>
                {contrast >= 3 ? (
                  <FaCheck className="text-green-600" />
                ) : (
                  <FaTimes className="text-red-600" />
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Normal Text (AAA)</span>
                  <span className="text-xs text-gray-500">≥ 7:1</span>
                </div>
                {contrast >= 7 ? (
                  <FaCheck className="text-green-600" />
                ) : (
                  <FaTimes className="text-red-600" />
                )}
              </div>
            </div>
          </div>

          {/* Accessible Alternatives */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Accessible Alternatives</h3>
            <div className="grid grid-cols-2 gap-3">
              {accessibleColors.map((color, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setForegroundColor(color.color)}
                >
                  <div 
                    className="w-full h-8 rounded mb-2"
                    style={{ backgroundColor: color.color }}
                  ></div>
                  <div className="text-xs font-mono text-gray-600">{color.color}</div>
                  <div className="text-xs text-gray-500">Contrast: {color.contrast.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Accessibility Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <ul className="space-y-2">
            <li>• <strong>AA Standard:</strong> Minimum 4.5:1 for normal text</li>
            <li>• <strong>AAA Standard:</strong> Minimum 7:1 for normal text</li>
            <li>• <strong>Large Text:</strong> 3:1 ratio for text 18pt+ or 14pt+ bold</li>
          </ul>
          <ul className="space-y-2">
            <li>• <strong>Test Regularly:</strong> Check contrast during design</li>
            <li>• <strong>Consider Context:</strong> Background patterns affect contrast</li>
            <li>• <strong>User Testing:</strong> Test with actual users when possible</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContrastChecker; 