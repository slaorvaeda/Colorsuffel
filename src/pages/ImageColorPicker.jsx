import React, { useState, useRef, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import CardListSlider from '../components/CardListSlider';
import { FaEyeDropper, FaCopy, FaCheck, FaHeart, FaRegHeart, FaDownload, FaCamera, FaDesktop, FaArrowRight } from 'react-icons/fa';
import tinycolor from 'tinycolor2';
import { Link } from 'react-router-dom';

function ImageColorPicker() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [extractedColors, setExtractedColors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedColor, setCopiedColor] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'
  const [isSupported, setIsSupported] = useState(true);
  const [isPicking, setIsPicking] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showColorInfo, setShowColorInfo] = useState(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
    
    // Check if EyeDropper API is supported
    if (!window.EyeDropper) {
      setIsSupported(false);
    }
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('image-picker-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
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
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
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
            count,
            source: 'image',
            name: getColorName(rgbToHex(r, g, b)),
            timestamp: new Date().toISOString(),
            id: Date.now() + Math.random()
          };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 12); // Get top 12 colors
      
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
    const hex = '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
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
      h: parseFloat((h * 360).toFixed(3)),
      s: parseFloat((s * 100).toFixed(3)),
      l: parseFloat((l * 100).toFixed(3))
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

  // Eye Dropper functionality
  const startColorPicking = async () => {
    if (!window.EyeDropper) {
      alert('EyeDropper API is not supported in your browser. Try Chrome, Edge, or Firefox.');
      return;
    }

    try {
      setIsPicking(true);
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      
      const color = result.sRGBHex;
      const colorInfo = {
        hex: color,
        rgb: tinycolor(color).toRgb(),
        hsl: tinycolor(color).toHsl(),
        name: getColorName(color),
        timestamp: new Date().toISOString(),
        id: Date.now(),
        source: 'eyedropper'
      };
      
      // Add to extracted colors
      setExtractedColors(prev => [colorInfo, ...prev.slice(0, 19)]);
      setShowColorInfo(colorInfo);
      
      // Auto-copy to clipboard
      await copyToClipboard(color, 'auto');
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error picking color:', error);
        alert('Failed to pick color. Please try again.');
      }
    } finally {
      setIsPicking(false);
    }
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

  const toggleFavorite = (color) => {
    const newFavorites = favorites.find(f => f.hex === color.hex)
      ? favorites.filter(f => f.hex !== color.hex)
      : [...favorites, color];
    
    setFavorites(newFavorites);
    localStorage.setItem('image-picker-favorites', JSON.stringify(newFavorites));
  };

  const downloadPalette = () => {
    const colors = extractedColors.map(c => c.hex).join('\n');
    const blob = new Blob([colors], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image-colors.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAllColors = () => {
    setExtractedColors([]);
    setImageUrl('');
    setSelectedImage(null);
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
    <div className="min-h-screen py-4 sm:py-6 md:py-8 px-4 font-poppins">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12" data-aos="fade-down">
         
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 font-raleway bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight px-4">
            Image & Screen Color Picker
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-inter leading-relaxed px-4">
            Extract colors from images or pick colors directly from your screen. Create beautiful palettes with our advanced color tools.
          </p>
        </div>

        {/* Floating Eye Dropper Button */}
        <div className="absolute top-6 right-6 z-50" data-aos="fade-left">
          <Link
            to="/eye-dropper"
            className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 shadow-xl hover:shadow-2xl flex items-center justify-center group"
            title="Eye Dropper Tool"
          >
            <FaEyeDropper className="text-xl sm:text-2xl" />
            
            {/* Tooltip */}
            <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-black/80 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
              Eye Dropper Tool
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-black/80 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
            </div>
          </Link>
        </div>

        {/* Upload Section */}
        <div className="mb-12" data-aos="fade-up">
          {/* Action Buttons */}
          <div className="text-center mb-6 space-y-4 px-4">
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <button
                onClick={createTestImage}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center gap-2 text-sm sm:text-base"
              >
                🎨 Try Sample Image
              </button>
              
              {isSupported && (
                <button
                  onClick={startColorPicking}
                  disabled={isPicking}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 text-sm sm:text-base ${
                    isPicking
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                  }`}
                >
                  <FaEyeDropper className="text-lg" />
                  {isPicking ? 'Picking Color...' : 'Pick from Screen'}
                </button>
              )}
              
              {extractedColors.length > 0 && (
                <>
                  <button
                    onClick={downloadPalette}
                    className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center gap-2 text-sm sm:text-base"
                  >
                    <FaDownload />
                    Download Palette
                  </button>
                  
                  <button
                    onClick={clearAllColors}
                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold flex items-center gap-2 text-sm sm:text-base"
                  >
                    Clear All
                  </button>
                </>
              )}
            </div>
            
            {!isSupported && (
              <p className="text-sm text-gray-500">
                Screen color picking is not supported in your browser. Try Chrome, Edge, or Firefox.
              </p>
            )}
          </div>
          
          <div
            className={`relative border-3 border-dashed rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center bg-white/70 backdrop-blur-xl hover:bg-white/80 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] shadow-xl lg:w-[70%] lg:h-[50vh] lg:mx-auto mx-4 ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-50/50 scale-105' 
                : 'border-gray-300 hover:border-indigo-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
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
              <div className="space-y-4 sm:space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">+</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 font-raleway">
                    Drop your image here
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 mb-1 sm:mb-2 font-inter">
                    or click to browse files
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 font-inter">
                    Supports JPG, PNG, GIF, WebP up to 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="w-full max-w-[400px] h-[300px] sm:h-[350px] md:h-[400px] mx-auto bg-gray-100 rounded-2xl shadow-2xl overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Uploaded"
                    className="w-full h-full object-contain rounded-2xl transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageUrl('');
                        setSelectedImage(null);
                        setExtractedColors([]);
                      }}
                      className="bg-red-500 text-white rounded-full p-3 hover:bg-red-600 transition-colors transform hover:scale-110"
                      title="Remove image"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        extractColorsFromImage(imageUrl);
                      }}
                      className="bg-green-500 text-white rounded-full p-3 hover:bg-green-600 transition-colors transform hover:scale-110"
                      title="Re-extract colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Image Info Overlay */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-[calc(400px-2rem)]">
                  <div className="bg-black/50 backdrop-blur-sm text-white p-3 rounded-xl text-center">
                    <p className="text-sm font-medium">Image uploaded successfully</p>
                    <p className="text-xs opacity-80">Click to upload a different image or hover for options</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12" data-aos="fade-in">
            <div className="inline-flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold text-gray-800">Extracting Colors</p>
                <p className="text-sm text-gray-600">Analyzing your image...</p>
              </div>
            </div>
          </div>
        )}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mb-8" data-aos="fade-up" data-aos-delay="100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-raleway">
                Your Favorites
              </h3>
              <p className="text-gray-600 font-inter">
                {favorites.length} saved colors
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {favorites.map((color, index) => (
                <div
                  key={`fav-${index}`}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <div
                    className="h-20 w-full cursor-pointer relative"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyToClipboard(color.hex, `fav-${index}`)}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                      {copiedColor === `fav-${index}` && (
                        <div className="bg-white/90 text-gray-800 px-2 py-1 rounded text-xs font-semibold">
                          ✓ Copied!
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 text-center">
                    <p className="font-mono text-xs font-bold text-gray-800 truncate">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Extracted Colors */}
        {extractedColors.length > 0 && (
          <div className="space-y-8" data-aos="fade-up" data-aos-delay="200">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-raleway">
                Your Color Palette
              </h2>
              <p className="text-lg text-gray-600 font-inter">
                {extractedColors.length} beautiful colors extracted from your image
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex justify-center">

            <CardListSlider viewMode={viewMode} setViewMode={setViewMode} />
            </div>
            
            {/* Color Display */}
            {viewMode === 'cards' ? (
              /* Card View */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {extractedColors.map((color, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    data-aos="zoom-in"
                    data-aos-delay={index * 100}
                  >
                    {/* Color Swatch */}
                    <div
                      className="h-32 w-full cursor-pointer relative overflow-hidden"
                      style={{ 
                        backgroundColor: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`
                      }}
                      onClick={() => copyToClipboard(color.hex, `hex-${index}`)}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                        {copiedColor === `hex-${index}` && (
                          <div className="bg-white/90 text-gray-800 px-3 py-2 rounded-lg font-semibold text-sm transform scale-100 animate-pulse">
                            ✓ Copied!
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(color.hex, `hex-${index}`);
                          }}
                          className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                          title="Copy color"
                        >
                          <FaCopy className="w-4 h-4 text-white" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(color);
                          }}
                          className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                          title={favorites.find(f => f.hex === color.hex) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {favorites.find(f => f.hex === color.hex) ? (
                            <FaHeart className="w-4 h-4 text-red-500" />
                          ) : (
                            <FaRegHeart className="w-4 h-4 text-white" />
                          )}
                        </button>
                      </div>
                      
                      {/* Source Badge */}
                      {color.source && (
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                            {color.source === 'eyedropper' ? 'Screen' : 'Image'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Color Information */}
                    <div className="p-4 space-y-3">
                      <div className="text-center mb-2">
                        {color.name && (
                          <p className="text-xs font-semibold text-gray-600 mb-1">{color.name}</p>
                        )}
                        <span className="font-mono text-sm font-bold text-gray-800">{color.hex}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => copyToClipboard(color.hex, `hex-${index}`)}
                          className="text-gray-400 hover:text-indigo-600 transition-colors p-1 hover:bg-indigo-50 rounded"
                        >
                          <FaCopy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleFavorite(color)}
                          className={`p-1 rounded transition-colors ${
                            favorites.find(f => f.hex === color.hex)
                              ? 'text-red-500 hover:text-red-600'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {favorites.find(f => f.hex === color.hex) ? (
                            <FaHeart className="w-4 h-4" />
                          ) : (
                            <FaRegHeart className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      
                      <div className="space-y-2 text-xs text-gray-600 font-inter">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">RGB:</span>
                          <span className="font-mono">{color.rgb.r}, {color.rgb.g}, {color.rgb.b}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">HSL:</span>
                          <span className="font-mono">{color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {extractedColors.map((color, index) => (
                    <div
                      key={index}
                      className="px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer group"
                      onClick={() => copyToClipboard(color.hex, `hex-${index}`)}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Color Swatch */}
                        <div className="col-span-1">
                          <div
                            className="w-12 h-12 rounded-xl shadow-md border border-gray-200 group-hover:shadow-lg transition-shadow"
                            style={{ backgroundColor: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})` }}
                          ></div>
                        </div>
                        
                        {/* Color Index */}
                        <div className="col-span-1">
                          <span className="text-sm font-semibold text-gray-500">#{index + 1}</span>
                        </div>
                        
                        {/* HEX Code */}
                        <div className="col-span-2">
                          <span className="font-mono text-sm font-bold text-gray-800">{color.hex}</span>
                        </div>
                        
                        {/* RGB Values */}
                        <div className="col-span-3">
                          <span className="font-mono text-sm text-gray-700">
                            RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                          </span>
                        </div>
                        
                        {/* HSL Values */}
                        <div className="col-span-3">
                          <span className="font-mono text-sm text-gray-700">
                            HSL({color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%)
                          </span>
                        </div>
                        
                        {/* Actions */}
                        <div className="col-span-2 flex gap-2 justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(color.hex, `hex-${index}`);
                            }}
                            className="text-gray-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          {copiedColor === `hex-${index}` && (
                            <span className="text-green-600 text-sm font-semibold flex items-center">
                              ✓ Copied
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

           
           
          </div>
        )}

        {/* Hidden canvas for color extraction */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Custom styles for fonts */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

        .font-poppins {
          font-family: "Poppins", sans-serif;
        }

        .font-raleway {
          font-family: "Raleway", sans-serif;
        }

        .font-inter {
          font-family: "Inter", sans-serif;
        }
      `}</style>
    </div>
  );
}

export default ImageColorPicker; 