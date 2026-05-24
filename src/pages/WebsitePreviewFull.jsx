import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaPalette, FaCopy, FaCheck, FaDownload, FaShare } from 'react-icons/fa';
import tinycolor from 'tinycolor2';

const WebsitePreviewFull = () => {
  const [previewData, setPreviewData] = useState(null);
  const [copiedColor, setCopiedColor] = useState(null);
  const [showColorInfo, setShowColorInfo] = useState(null);

  useEffect(() => {
    // Load preview data from localStorage
    const data = localStorage.getItem('website-preview-data');
    if (data) {
      setPreviewData(JSON.parse(data));
    }
  }, []);

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

  const downloadPalette = () => {
    if (!previewData?.palette) return;
    
    const colors = previewData.palette.colors;
    const css = `/* ${previewData.palette.name} Color Palette */\n\n` +
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
    a.download = `${previewData.palette.name.toLowerCase().replace(/\s+/g, '-')}-palette.css`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sharePalette = async () => {
    if (!previewData?.palette) return;
    
    const colors = previewData.palette.colors.join(', ');
    const text = `Check out this color palette: ${previewData.palette.name}\nColors: ${colors}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: previewData.palette.name,
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

  if (!previewData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Preview Data</h1>
          <p className="text-gray-600 mb-4">Please go back and select a color palette first.</p>
          <button
            onClick={() => window.close()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    );
  }

  const currentPalette = previewData.palette;

  return (
    <div className="min-h-screen" style={{ backgroundColor: currentPalette.colors[4] || '#f3f4f6' }}>
      {/* Floating Control Panel */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => window.close()}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Close preview"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <h3 className="font-semibold text-gray-800">{currentPalette.name}</h3>
          </div>
          
          {/* Color Palette Display */}
          <div className="flex gap-2 mb-4">
            {currentPalette.colors.map((color, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setShowColorInfo(index)}
                onMouseLeave={() => setShowColorInfo(null)}
              >
                <button
                  onClick={() => copyToClipboard(color, `color-${index}`)}
                  className="w-10 h-10 rounded-lg shadow-md hover:scale-110 transition-all duration-300 flex items-center justify-center"
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
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={downloadPalette}
              className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
            >
              <FaDownload />
              CSS
            </button>
            <button
              onClick={sharePalette}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-1"
            >
              <FaShare />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Full Website Preview */}
      <div className="min-h-screen">
        {/* Header */}
        <header className="py-8">
          <nav className="max-w-7xl mx-auto px-8 flex items-center justify-between">
            <div 
              className="text-3xl font-bold"
              style={{ color: currentPalette.colors[0] || '#1f2937' }}
            >
              BrandName
            </div>
            <div className="flex gap-8">
              {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="font-medium hover:underline transition-colors text-lg"
                  style={{ color: currentPalette.colors[1] || '#374151' }}
                >
                  {item}
                </a>
              ))}
            </div>
          </nav>
          
          <div className="text-center py-20 max-w-6xl mx-auto px-8">
            <h1 
              className="text-7xl font-bold mb-8"
              style={{ color: currentPalette.colors[0] || '#1f2937' }}
            >
              Welcome to Our Website
            </h1>
            <p 
              className="text-2xl mb-12 max-w-4xl mx-auto leading-relaxed"
              style={{ color: currentPalette.colors[2] || '#6b7280' }}
            >
              Experience the perfect blend of design and functionality with our carefully crafted color palette. 
              See how colors transform the user experience and create visual harmony.
            </p>
            <button
              className="px-12 py-4 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 text-xl shadow-xl"
              style={{ backgroundColor: currentPalette.colors[1] || '#3b82f6' }}
            >
              Get Started Today
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-8 py-16">
          {/* Features Section */}
          <section className="mb-20">
            <h2 
              className="text-5xl font-bold text-center mb-16"
              style={{ color: currentPalette.colors[0] || '#1f2937' }}
            >
              Our Features
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-12">
              {[
                {
                  title: "Feature One",
                  description: "This section demonstrates how text colors work with the selected palette. Notice the contrast and readability improvements."
                },
                {
                  title: "Feature Two", 
                  description: "Each color in the palette serves a specific purpose - from headings to body text to accents and backgrounds."
                },
                {
                  title: "Feature Three",
                  description: "The color harmony creates a cohesive visual experience that guides users through your content naturally."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                  <h3 
                    className="text-2xl font-bold mb-4"
                    style={{ color: currentPalette.colors[0] || '#1f2937' }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-lg leading-relaxed"
                    style={{ color: currentPalette.colors[2] || '#6b7280' }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section 
            className="text-center py-16 rounded-3xl shadow-2xl"
            style={{ backgroundColor: currentPalette.colors[3] || '#9ca3af' }}
          >
            <h2 
              className="text-5xl font-bold mb-6"
              style={{ color: getContrastColor(currentPalette.colors[3] || '#9ca3af') }}
            >
              Ready to Get Started?
            </h2>
            <p 
              className="text-xl mb-8 max-w-3xl mx-auto"
              style={{ color: getContrastColor(currentPalette.colors[3] || '#9ca3af') }}
            >
              Join thousands of satisfied customers who trust our platform. 
              Experience the power of thoughtful color design.
            </p>
            <button
              className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-xl shadow-xl"
              style={{ 
                backgroundColor: currentPalette.colors[0] || '#1f2937',
                color: getContrastColor(currentPalette.colors[0] || '#1f2937')
              }}
            >
              Sign Up Now
            </button>
          </section>
        </main>

        {/* Footer */}
        <footer className="py-12 mt-20">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <p 
              className="text-lg"
              style={{ color: currentPalette.colors[2] || '#6b7280' }}
            >
              © 2024 BrandName. All rights reserved. | 
              <span 
                className="ml-2"
                style={{ color: currentPalette.colors[1] || '#374151' }}
              >
                Designed with ColorSuffel
              </span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default WebsitePreviewFull; 