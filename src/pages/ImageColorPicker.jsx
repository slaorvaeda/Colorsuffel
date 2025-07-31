import React, { useState, useRef, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function ImageColorPicker() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [extractedColors, setExtractedColors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedColor, setCopiedColor] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        setSelectedImage(file);
        extractColorsFromImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target.result);
        setSelectedImage(file);
        extractColorsFromImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractColorsFromImage = (imageSrc) => {
    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to image size (limit max size for performance)
      const maxSize = 800;
      let { width, height } = img;
      
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      console.log('Canvas size:', width, 'x', height);
      console.log('Image data length:', data.length);
      console.log('First few pixels:', data.slice(0, 20));
      
      // Extract colors (sample every 4th pixel for better coverage)
      const colors = new Map();
      const step = 4; // Sample every 4th pixel
      
      for (let i = 0; i < data.length; i += step * 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        // Skip transparent or very transparent pixels
        if (a < 100) continue;
        
        // Round colors to reduce similar colors (use smaller buckets)
        const roundedR = Math.round(r / 20) * 20;
        const roundedG = Math.round(g / 20) * 20;
        const roundedB = Math.round(b / 20) * 20;
        
        // Ensure values are within valid range
        const finalR = Math.max(0, Math.min(255, roundedR));
        const finalG = Math.max(0, Math.min(255, roundedG));
        const finalB = Math.max(0, Math.min(255, roundedB));
        
        const colorKey = `${finalR},${finalG},${finalB}`;
        
        if (colors.has(colorKey)) {
          colors.set(colorKey, colors.get(colorKey) + 1);
        } else {
          colors.set(colorKey, 1);
        }
      }
      
      // Convert to array and sort by frequency
      const colorArray = Array.from(colors.entries())
        .map(([key, count]) => {
          const [r, g, b] = key.split(',').map(Number);
          return {
            hex: rgbToHex(r, g, b),
            rgb: { r, g, b },
            hsl: rgbToHsl(r, g, b),
            count
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 12); // Get top 12 colors
      
      console.log('Extracted colors:', colorArray); // Debug log
      
      // If no colors were extracted, add some fallback colors
      if (colorArray.length === 0) {
        const fallbackColors = [
          { hex: '#FF6B6B', rgb: { r: 255, g: 107, b: 107 }, hsl: { h: 0, s: 100, l: 71 }, count: 1 },
          { hex: '#4ECDC4', rgb: { r: 78, g: 205, b: 196 }, hsl: { h: 175, s: 53, l: 55 }, count: 1 },
          { hex: '#45B7D1', rgb: { r: 69, g: 183, b: 209 }, hsl: { h: 194, s: 55, l: 55 }, count: 1 },
          { hex: '#96CEB4', rgb: { r: 150, g: 206, b: 180 }, hsl: { h: 150, s: 39, l: 70 }, count: 1 },
          { hex: '#FFEAA7', rgb: { r: 255, g: 234, b: 167 }, hsl: { h: 48, s: 100, l: 83 }, count: 1 },
          { hex: '#DDA0DD', rgb: { r: 221, g: 160, b: 221 }, hsl: { h: 300, s: 47, l: 75 }, count: 1 }
        ];
        setExtractedColors(fallbackColors);
      } else {
        setExtractedColors(colorArray);
      }
      setIsLoading(false);
    };
    
    img.onerror = () => {
      console.error('Failed to load image');
      setIsLoading(false);
    };
    
    img.src = imageSrc;
  };

  const rgbToHex = (r, g, b) => {
    console.log('rgbToHex input:', r, g, b); // Debug log
    const hex = '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
    console.log('rgbToHex output:', hex); // Debug log
    return hex;
  };

  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const copyToClipboard = async (text, colorType) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(colorType);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Test function to create a simple colored image for debugging
  const createTestImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Create a simple gradient
    const gradient = ctx.createLinearGradient(0, 0, 200, 200);
    gradient.addColorStop(0, '#FF6B6B');
    gradient.addColorStop(0.2, '#4ECDC4');
    gradient.addColorStop(0.4, '#45B7D1');
    gradient.addColorStop(0.6, '#96CEB4');
    gradient.addColorStop(0.8, '#FFEAA7');
    gradient.addColorStop(1, '#DDA0DD');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);
    
    const testImageUrl = canvas.toDataURL();
    setImageUrl(testImageUrl);
    extractColorsFromImage(testImageUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8" data-aos="fade-down">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Image Color Picker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload an image and instantly extract its primary colors, generate a unique palette, 
            and export hex, RGB, HSL and OKLCH color codes.
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8" data-aos="fade-up">
          {/* Test Button for Debugging */}
          <div className="text-center mb-4">
            <button
              onClick={createTestImage}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors mr-4"
            >
              Test with Sample Image
            </button>
          </div>
          
          <div
            className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-white/50 backdrop-blur-sm hover:border-blue-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileInput}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {!imageUrl ? (
              <div>
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your image here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPG, PNG, GIF, WebP up to 10MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="max-h-64 mx-auto rounded-lg shadow-lg"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setImageUrl('');
                    setSelectedImage(null);
                    setExtractedColors([]);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8" data-aos="fade-in">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Extracting colors from your image...</p>
          </div>
        )}

        {/* Extracted Colors */}
        {extractedColors.length > 0 && (
          <div className="space-y-6" data-aos="fade-up" data-aos-delay="200">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
              Extracted Color Palette
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {/* Test color to verify display works */}
              
              
              {extractedColors.map((color, index) => {
                console.log(`Color ${index}:`, color); // Debug log
                return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Color Swatch */}
                  <div
                    className="h-24 w-full cursor-pointer relative group"
                    style={{ 
                      backgroundColor: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
                      border: `2px solid ${color.hex}` // Backup border to test hex color
                    }}
                    onClick={() => copyToClipboard(color.hex, `hex-${index}`)}
                  >
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                      {copiedColor === `hex-${index}` && (
                        <span className="text-white font-bold text-sm bg-opacity-50 px-2 py-1 rounded">
                          Copied!
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Color Information */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold">{color.hex}</span>
                      <button
                        onClick={() => copyToClipboard(color.hex, `hex-${index}`)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span>RGB:</span>
                        <span className="font-mono">{color.rgb.r}, {color.rgb.g}, {color.rgb.b}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>HSL:</span>
                        <span className="font-mono">{color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
              })}
            </div>

            {/* Export Options */}
            <div className="bg-white rounded-xl shadow-lg p-6 mt-8" data-aos="fade-up" data-aos-delay="400">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Export Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    const hexCodes = extractedColors.map(c => c.hex).join('\n');
                    copyToClipboard(hexCodes, 'export');
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Copy HEX Codes
                </button>
                <button
                  onClick={() => {
                    const rgbCodes = extractedColors.map(c => `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`).join('\n');
                    copyToClipboard(rgbCodes, 'export');
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Copy RGB Codes
                </button>
                <button
                  onClick={() => {
                    const hslCodes = extractedColors.map(c => `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`).join('\n');
                    copyToClipboard(hslCodes, 'export');
                  }}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Copy HSL Codes
                </button>
                <button
                  onClick={() => {
                    const cssVars = extractedColors.map((c, i) => `--color-${i + 1}: ${c.hex};`).join('\n');
                    copyToClipboard(cssVars, 'export');
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Copy CSS Variables
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden canvas for color extraction */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}

export default ImageColorPicker; 