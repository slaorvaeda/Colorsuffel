import React, { useState, useEffect } from 'react';
import { FaCopy, FaCheck, FaDownload, FaHeart, FaRegHeart, FaPalette, FaIndustry, FaLightbulb } from 'react-icons/fa';
import tinycolor from 'tinycolor2';

const BrandGenerator = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('technology');
  const [selectedMood, setSelectedMood] = useState('professional');
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [generatedPalette, setGeneratedPalette] = useState(null);
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [copiedColor, setCopiedColor] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const industries = [
    { id: 'technology', name: 'Technology', icon: '💻', colors: ['#2563EB', '#1E40AF', '#3B82F6', '#60A5FA', '#DBEAFE'] },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', colors: ['#059669', '#047857', '#10B981', '#34D399', '#D1FAE5'] },
    { id: 'finance', name: 'Finance', icon: '💰', colors: ['#1F2937', '#374151', '#6B7280', '#9CA3AF', '#F3F4F6'] },
    { id: 'education', name: 'Education', icon: '🎓', colors: ['#7C3AED', '#6D28D9', '#8B5CF6', '#A78BFA', '#EDE9FE'] },
    { id: 'food', name: 'Food & Beverage', icon: '🍕', colors: ['#DC2626', '#B91C1C', '#EF4444', '#F87171', '#FEE2E2'] },
    { id: 'fashion', name: 'Fashion', icon: '👗', colors: ['#EC4899', '#BE185D', '#F472B6', '#F9A8D4', '#FCE7F3'] },
    { id: 'travel', name: 'Travel', icon: '✈️', colors: ['#0891B2', '#0E7490', '#06B6D4', '#22D3EE', '#CFFAFE'] },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', colors: ['#7C2D12', '#92400E', '#EA580C', '#FB923C', '#FED7AA'] },
    { id: 'environmental', name: 'Environmental', icon: '🌱', colors: ['#16A34A', '#15803D', '#22C55E', '#4ADE80', '#DCFCE7'] },
    { id: 'luxury', name: 'Luxury', icon: '💎', colors: ['#1F2937', '#374151', '#6B7280', '#9CA3AF', '#F9FAFB'] }
  ];

  const moods = [
    { id: 'professional', name: 'Professional', description: 'Trustworthy and reliable', colors: ['#1F2937', '#374151', '#6B7280', '#9CA3AF', '#F3F4F6'] },
    { id: 'energetic', name: 'Energetic', description: 'Dynamic and exciting', colors: ['#DC2626', '#EA580C', '#F59E0B', '#10B981', '#3B82F6'] },
    { id: 'calm', name: 'Calm', description: 'Peaceful and soothing', colors: ['#0891B2', '#06B6D4', '#22D3EE', '#67E8F9', '#CFFAFE'] },
    { id: 'creative', name: 'Creative', description: 'Innovative and artistic', colors: ['#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'] },
    { id: 'minimalist', name: 'Minimalist', description: 'Clean and simple', colors: ['#FFFFFF', '#F9FAFB', '#F3F4F6', '#E5E7EB', '#1F2937'] },
    { id: 'bold', name: 'Bold', description: 'Strong and confident', colors: ['#000000', '#DC2626', '#F59E0B', '#10B981', '#3B82F6'] }
  ];

  const styles = [
    { id: 'modern', name: 'Modern', description: 'Contemporary and sleek' },
    { id: 'classic', name: 'Classic', description: 'Timeless and traditional' },
    { id: 'playful', name: 'Playful', description: 'Fun and approachable' },
    { id: 'elegant', name: 'Elegant', description: 'Sophisticated and refined' },
    { id: 'rustic', name: 'Rustic', description: 'Natural and organic' },
    { id: 'futuristic', name: 'Futuristic', description: 'Advanced and innovative' }
  ];

  const colorPsychology = {
    red: { emotion: 'Energy & Passion', trust: 'High', energy: 'High', use: 'Call-to-action, urgency' },
    blue: { emotion: 'Trust & Stability', trust: 'Very High', energy: 'Low', use: 'Corporate, professional' },
    green: { emotion: 'Growth & Health', trust: 'High', energy: 'Medium', use: 'Nature, finance, health' },
    yellow: { emotion: 'Optimism & Joy', trust: 'Medium', energy: 'High', use: 'Attention, creativity' },
    purple: { emotion: 'Luxury & Creativity', trust: 'High', energy: 'Medium', use: 'Premium, artistic' },
    orange: { emotion: 'Enthusiasm & Adventure', trust: 'Medium', energy: 'High', use: 'Food, entertainment' },
    pink: { emotion: 'Compassion & Playfulness', trust: 'Medium', energy: 'Medium', use: 'Beauty, fashion' },
    black: { emotion: 'Power & Sophistication', trust: 'High', energy: 'Low', use: 'Luxury, authority' },
    white: { emotion: 'Purity & Simplicity', trust: 'High', energy: 'Low', use: 'Clean, minimal' },
    gray: { emotion: 'Balance & Neutrality', trust: 'High', energy: 'Low', use: 'Professional, modern' }
  };

  useEffect(() => {
    loadSavedPalettes();
  }, []);

  const loadSavedPalettes = () => {
    const saved = JSON.parse(localStorage.getItem('brand-palettes') || '[]');
    setSavedPalettes(saved);
  };

  const generateBrandPalette = () => {
    const industry = industries.find(i => i.id === selectedIndustry);
    const mood = moods.find(m => m.id === selectedMood);
    const style = styles.find(s => s.id === selectedStyle);

    // Generate a cohesive palette based on industry, mood, and style
    const baseColors = generateCohesiveColors(industry.colors[0], mood.colors, style.id);
    
    const palette = {
      id: Date.now(),
      name: `${industry.name} ${mood.name} ${style.name}`,
      industry: industry.name,
      mood: mood.name,
      style: style.name,
      colors: baseColors,
      timestamp: new Date().toISOString(),
      description: `A ${mood.name.toLowerCase()} ${style.name.toLowerCase()} palette for ${industry.name.toLowerCase()} brands`
    };

    setGeneratedPalette(palette);
  };

  const generateCohesiveColors = (baseColor, moodColors, style) => {
    const base = tinycolor(baseColor);
    const hsl = base.toHsl();
    const colors = [];

    // Primary color (base)
    colors.push({
      name: 'Primary',
      hex: baseColor,
      rgb: base.toRgbString(),
      hsl: base.toHslString(),
      usage: 'Main brand color, logos, primary buttons'
    });

    // Secondary color (complementary or analogous)
    const secondaryHue = (hsl.h + 180) % 360; // Complementary
    const secondary = tinycolor({ h: secondaryHue, s: hsl.s * 0.8, l: hsl.l });
    colors.push({
      name: 'Secondary',
      hex: secondary.toHexString(),
      rgb: secondary.toRgbString(),
      hsl: secondary.toHslString(),
      usage: 'Accent elements, secondary buttons'
    });

    // Tertiary color (analogous)
    const tertiaryHue = (hsl.h + 30) % 360;
    const tertiary = tinycolor({ h: tertiaryHue, s: hsl.s * 0.9, l: hsl.l * 1.1 });
    colors.push({
      name: 'Tertiary',
      hex: tertiary.toHexString(),
      rgb: tertiary.toRgbString(),
      hsl: tertiary.toHslString(),
      usage: 'Highlights, callouts, tertiary elements'
    });

    // Neutral colors
    const neutral1 = tinycolor({ h: hsl.h, s: hsl.s * 0.1, l: 0.95 });
    const neutral2 = tinycolor({ h: hsl.h, s: hsl.s * 0.2, l: 0.85 });
    const neutral3 = tinycolor({ h: hsl.h, s: hsl.s * 0.3, l: 0.15 });

    colors.push({
      name: 'Neutral Light',
      hex: neutral1.toHexString(),
      rgb: neutral1.toRgbString(),
      hsl: neutral1.toHslString(),
      usage: 'Backgrounds, cards, subtle elements'
    });

    colors.push({
      name: 'Neutral Dark',
      hex: neutral3.toHexString(),
      rgb: neutral3.toRgbString(),
      hsl: neutral3.toHslString(),
      usage: 'Text, borders, strong contrast'
    });

    return colors;
  };

  const savePalette = () => {
    if (!generatedPalette) return;
    
    const newPalettes = [...savedPalettes, generatedPalette];
    setSavedPalettes(newPalettes);
    localStorage.setItem('brand-palettes', JSON.stringify(newPalettes));
  };

  const deletePalette = (paletteId) => {
    const newPalettes = savedPalettes.filter(p => p.id !== paletteId);
    setSavedPalettes(newPalettes);
    localStorage.setItem('brand-palettes', JSON.stringify(newPalettes));
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

  const exportPalette = (palette) => {
    const exportData = {
      name: palette.name,
      description: palette.description,
      industry: palette.industry,
      mood: palette.mood,
      style: palette.style,
      colors: palette.colors,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${palette.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getColorPsychology = (color) => {
    const colorName = getColorName(color);
    return colorPsychology[colorName.toLowerCase()] || colorPsychology.gray;
  };

  const getColorName = (hex) => {
    const color = tinycolor(hex);
    const hsl = color.toHsl();
    
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Brand Color Generator
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create professional brand color palettes based on industry, mood, and color psychology
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Industry Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Industry</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {industries.map((industry) => (
                <button
                  key={industry.id}
                  onClick={() => setSelectedIndustry(industry.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedIndustry === industry.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{industry.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">{industry.name}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mood Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Brand Mood</h3>
            
            <div className="space-y-3">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedMood === mood.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{mood.name}</div>
                    <div className="text-xs text-gray-500">{mood.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Design Style</h3>
            
            <div className="space-y-3">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedStyle === style.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{style.name}</div>
                    <div className="text-xs text-gray-500">{style.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <button
              onClick={generateBrandPalette}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            >
              Generate Brand Palette
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Generated Palette */}
          {generatedPalette && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">{generatedPalette.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors flex items-center gap-1"
                  >
                    <FaLightbulb />
                    Preview
                  </button>
                  <button
                    onClick={savePalette}
                    className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm transition-colors flex items-center gap-1"
                  >
                    <FaHeart />
                    Save
                  </button>
                  <button
                    onClick={() => exportPalette(generatedPalette)}
                    className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors flex items-center gap-1"
                  >
                    <FaDownload />
                    Export
                  </button>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{generatedPalette.description}</p>

              {/* Color Palette */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {generatedPalette.colors.map((color, index) => (
                  <div
                    key={index}
                    className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Color Swatch */}
                    <div 
                      className="h-24 relative"
                      style={{ backgroundColor: color.hex }}
                    >
                      {/* Copy Button */}
                      <button
                        onClick={() => copyToClipboard(color.hex, `palette-${index}`)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 p-2 rounded-lg shadow-lg"
                        title="Copy color"
                      >
                        {copiedColor === `palette-${index}` ? (
                          <FaCheck className="w-4 h-4 text-green-600" />
                        ) : (
                          <FaCopy className="w-4 h-4 text-gray-700" />
                        )}
                      </button>
                    </div>

                    {/* Color Info */}
                    <div className="p-3">
                      <div className="text-center mb-2">
                        <p className="text-sm font-semibold text-gray-800">{color.name}</p>
                        <p className="font-mono text-xs font-bold text-gray-900">{color.hex}</p>
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

                      <div className="mt-2">
                        <p className="text-xs text-gray-600 italic">{color.usage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Color Psychology */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Color Psychology Analysis</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {generatedPalette.colors.slice(0, 3).map((color, index) => {
                    const psychology = getColorPsychology(color.hex);
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg shadow-sm"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{color.name}</p>
                          <p className="text-xs text-gray-600">{psychology.emotion}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Brand Preview */}
          {showPreview && generatedPalette && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Brand Preview</h3>
              
              <div className="space-y-6">
                {/* Logo Preview */}
                <div className="text-center">
                  <div 
                    className="inline-block p-6 rounded-xl mb-4"
                    style={{ backgroundColor: generatedPalette.colors[0].hex }}
                  >
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: generatedPalette.colors[4].hex }}
                    >
                      BRAND
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Logo concept using primary and neutral colors</p>
                </div>

                {/* UI Components */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Primary Elements</h4>
                    <div 
                      className="p-4 rounded-lg text-white font-semibold"
                      style={{ backgroundColor: generatedPalette.colors[0].hex }}
                    >
                      Primary Button
                    </div>
                    <div 
                      className="p-4 rounded-lg border-2"
                      style={{ 
                        backgroundColor: generatedPalette.colors[1].hex,
                        borderColor: generatedPalette.colors[0].hex,
                        color: generatedPalette.colors[0].hex
                      }}
                    >
                      Secondary Button
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">Content Areas</h4>
                    <div 
                      className="p-4 rounded-lg"
                      style={{ 
                        backgroundColor: generatedPalette.colors[3].hex,
                        color: generatedPalette.colors[4].hex
                      }}
                    >
                      Content Card
                    </div>
                    <div 
                      className="p-4 rounded-lg border"
                      style={{ 
                        backgroundColor: generatedPalette.colors[3].hex,
                        borderColor: generatedPalette.colors[2].hex,
                        color: generatedPalette.colors[4].hex
                      }}
                    >
                      Highlight Box
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Saved Palettes */}
          {savedPalettes.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Saved Palettes</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {savedPalettes.map((palette) => (
                  <div key={palette.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">{palette.name}</h4>
                      <button
                        onClick={() => deletePalette(palette.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    
                    <div className="flex gap-1 mb-3">
                      {palette.colors.slice(0, 5).map((color, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded border border-gray-200"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                      ))}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {palette.industry} • {palette.mood} • {palette.style}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Brand Color Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <ul className="space-y-2">
            <li>• <strong>Primary Color:</strong> Use for logos, main buttons, and key brand elements</li>
            <li>• <strong>Secondary Color:</strong> Perfect for accents and supporting elements</li>
            <li>• <strong>Neutral Colors:</strong> Essential for text, backgrounds, and balance</li>
          </ul>
          <ul className="space-y-2">
            <li>• <strong>Color Psychology:</strong> Consider how colors affect emotions and trust</li>
            <li>• <strong>Accessibility:</strong> Ensure sufficient contrast for readability</li>
            <li>• <strong>Consistency:</strong> Use your palette consistently across all touchpoints</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BrandGenerator; 