import React, { useState, useEffect, useRef } from 'react';
import { FaEyeDropper, FaCopy, FaCheck, FaHeart, FaRegHeart, FaDownload, FaCamera, FaTimes, FaPalette } from 'react-icons/fa';
import tinycolor from 'tinycolor2';

const EyeDropper = () => {
  const [pickedColors, setPickedColors] = useState([]);
  const [isSupported, setIsSupported] = useState(true);
  const [isPicking, setIsPicking] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [copiedColor, setCopiedColor] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showColorInfo, setShowColorInfo] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Check if EyeDropper API is supported
    if (!window.EyeDropper) {
      setIsSupported(false);
    }
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('eyedropper-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

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
        rgb: tinycolor(color).toRgbString(),
        hsl: tinycolor(color).toHslString(),
        name: getColorName(color),
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      
      setPickedColors(prev => [colorInfo, ...prev.slice(0, 19)]); // Keep last 20 colors
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

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedColor(type);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const toggleFavorite = (color) => {
    const newFavorites = favorites.find(f => f.hex === color.hex)
      ? favorites.filter(f => f.hex !== color.hex)
      : [...favorites, color];
    
    setFavorites(newFavorites);
    localStorage.setItem('eyedropper-favorites', JSON.stringify(newFavorites));
  };

  const removeColor = (colorId) => {
    setPickedColors(prev => prev.filter(color => color.id !== colorId));
  };

  const clearHistory = () => {
    setPickedColors([]);
  };

  const clearUploadedImage = () => {
    setUploadedImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        setUploadedImageUrl(imageUrl);
        
        // Create a canvas to analyze the image
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          
          // Sample colors from the image
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const colors = extractDominantColors(imageData);
          
          // Add sampled colors to history
          colors.forEach(color => {
            const colorInfo = {
              hex: color,
              rgb: tinycolor(color).toRgbString(),
              hsl: tinycolor(color).toHslString(),
              name: getColorName(color),
              timestamp: new Date().toISOString(),
              id: Date.now() + Math.random()
            };
            setPickedColors(prev => [colorInfo, ...prev.slice(0, 19)]);
          });
        };
        img.src = imageUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const extractDominantColors = (imageData) => {
    const colors = [];
    const data = imageData.data;
    const step = Math.max(1, Math.floor(data.length / 4 / 1000)); // Sample every 1000th pixel
    
    for (let i = 0; i < data.length; i += step * 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const hex = tinycolor({ r, g, b }).toHexString();
      colors.push(hex);
    }
    
    // Count color frequencies and return top 5
    const colorCounts = {};
    colors.forEach(color => {
      colorCounts[color] = (colorCounts[color] || 0) + 1;
    });
    
    return Object.entries(colorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([color]) => color);
  };

  const downloadPalette = () => {
    const colors = pickedColors.map(c => c.hex).join('\n');
    const blob = new Blob([colors], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'eyedropper-colors.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const getContrastColor = (backgroundColor) => {
    return tinycolor(backgroundColor).isDark() ? '#FFFFFF' : '#000000';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 font-inter">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap");
        
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .float-animation {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold font-playfair mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
            Eye Dropper Tool
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Professional color extraction tool. Pick colors from anywhere on your screen or upload images to extract dominant colors with precision.
          </p>
        </div>

        {/* Main Controls */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pick Color Button */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 font-playfair">Pick Colors</h3>
              
              {!isSupported ? (
                <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-sm">
                    EyeDropper API is not supported in your browser. 
                    Try Chrome, Edge, or Firefox for the best experience.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <button
                    onClick={startColorPicking}
                    disabled={isPicking}
                    className={`w-full py-6 px-8 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg ${
                      isPicking
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 hover:shadow-xl'
                    }`}
                  >
                    <FaEyeDropper className="text-2xl" />
                    {isPicking ? 'Picking Color...' : 'Start Color Picker'}
                  </button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-4">or</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-white border-2 border-gray-200 hover:border-indigo-300 text-gray-700 rounded-xl transition-all duration-300 flex items-center gap-3 mx-auto hover:shadow-lg transform hover:scale-105"
                    >
                      <FaCamera />
                      Upload Image
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Uploaded Image Preview */}
            {uploadedImageUrl && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Uploaded Image</h3>
                  <button
                    onClick={clearUploadedImage}
                    className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                    title="Remove image"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <div className="relative">
                  <img 
                    src={uploadedImageUrl} 
                    alt="Uploaded for color extraction" 
                    className="w-full h-full object-cover rounded-xl shadow-lg"
                  />
                  <div className="absolute inset-0  bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 rounded-xl flex items-center justify-center">
                    <span className="text-white opacity-0 hover:opacity-100 transition-opacity duration-200 text-sm font-medium">
                      Image uploaded for color extraction
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={downloadPalette}
                  disabled={pickedColors.length === 0}
                  className="w-full px-4 py-3 bg-green-100 hover:bg-green-200 text-green-700 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                >
                  <FaDownload />
                  Download Palette
                </button>
                
                <button
                  onClick={clearHistory}
                  disabled={pickedColors.length === 0}
                  className="w-full px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                >
                  Clear History
                </button>
              </div>
            </div>

            {/* Favorites */}
            {favorites.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Favorites</h3>
                  <button
                    onClick={() => {
                      setFavorites([]);
                      localStorage.setItem('eyedropper-favorites', JSON.stringify([]));
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors text-sm"
                    title="Clear all favorites"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {favorites.map((color, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer"
                      onClick={() => copyToClipboard(color.hex, `fav-${index}`)}
                    >
                      <div 
                        className="aspect-square rounded-xl shadow-lg border-2 border-white hover:shadow-xl transition-all duration-300"
                        style={{ backgroundColor: color.hex }}
                      ></div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-xl flex items-center justify-center">
                        <FaCopy className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      </div>
                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(color);
                        }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 shadow-lg"
                        title="Remove from favorites"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Color History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Colors */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-8 text-gray-800 font-playfair">Recent Colors</h3>
              
              {pickedColors.length === 0 ? (
                <div className="text-center py-16">
                  <FaEyeDropper className="mx-auto text-6xl text-gray-300 mb-6" />
                  <p className="text-gray-500 text-lg">No colors picked yet. Start picking colors to see them here!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {pickedColors.map((color, index) => (
                    <div
                      key={color.id}
                      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
                    >
                      {/* Color Swatch */}
                      <div 
                        className="h-32 relative cursor-pointer"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setShowColorInfo(showColorInfo?.id === color.id ? null : color)}
                      >
                        {/* Action Buttons */}
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(color.hex, `color-${index}`);
                            }}
                            className="p-2 bg-white/90 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            title="Copy color"
                          >
                            {copiedColor === `color-${index}` ? (
                              <FaCheck className="w-4 h-4 text-green-600" />
                            ) : (
                              <FaCopy className="w-4 h-4 text-gray-700" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(color);
                            }}
                            className="p-2 bg-white/90 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            title={favorites.find(f => f.hex === color.hex) ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            {favorites.find(f => f.hex === color.hex) ? (
                              <FaHeart className="w-4 h-4 text-red-500" />
                            ) : (
                              <FaRegHeart className="w-4 h-4 text-gray-700" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Color Info */}
                      <div className="p-4">
                        <div className="text-center mb-3">
                          <p className="text-sm font-semibold text-gray-800 truncate">{color.name}</p>
                          <p className="font-mono text-lg font-bold text-gray-900">{color.hex}</p>
                        </div>
                        
                        {/* Expanded Info */}
                        {showColorInfo?.id === color.id && (
                          <div className="space-y-2 text-xs text-gray-500 border-t pt-3">
                            <div className="flex justify-between">
                              <span>RGB:</span>
                              <span className="font-mono">{color.rgb}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>HSL:</span>
                              <span className="font-mono">{color.hsl}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Time:</span>
                              <span className="font-mono">{new Date(color.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Color Details Panel */}
            {showColorInfo && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 font-playfair">Color Details</h3>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Color Preview */}
                  <div>
                    <div 
                      className="w-full h-40 rounded-2xl mb-6 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                      style={{ backgroundColor: showColorInfo.hex }}
                    >
                      {showColorInfo.name}
                    </div>
                    
                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="font-medium text-gray-700">HEX:</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold">{showColorInfo.hex}</span>
                          <button
                            onClick={() => copyToClipboard(showColorInfo.hex, 'details-hex')}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            {copiedColor === 'details-hex' ? <FaCheck className="text-green-600" /> : <FaCopy />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="font-medium text-gray-700">RGB:</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono">{showColorInfo.rgb}</span>
                          <button
                            onClick={() => copyToClipboard(showColorInfo.rgb, 'details-rgb')}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            {copiedColor === 'details-rgb' ? <FaCheck className="text-green-600" /> : <FaCopy />}
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="font-medium text-gray-700">HSL:</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono">{showColorInfo.hsl}</span>
                          <button
                            onClick={() => copyToClipboard(showColorInfo.hsl, 'details-hsl')}
                            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                          >
                            {copiedColor === 'details-hsl' ? <FaCheck className="text-green-600" /> : <FaCopy />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Color Variations */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4 text-lg">Color Variations</h4>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                      {[10, 20, 30, 40, 50].map(percent => {
                        const lighter = tinycolor(showColorInfo.hex).lighten(percent);
                        return (
                          <div
                            key={percent}
                            className="aspect-square rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300"
                            style={{ backgroundColor: lighter.toHexString() }}
                            onClick={() => copyToClipboard(lighter.toHexString(), `variation-${percent}`)}
                            title={`${percent}% lighter`}
                          ></div>
                        );
                      })}
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      {[10, 20, 30, 40, 50].map(percent => {
                        const darker = tinycolor(showColorInfo.hex).darken(percent);
                        return (
                          <div
                            key={percent}
                            className="aspect-square rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-300"
                            style={{ backgroundColor: darker.toHexString() }}
                            onClick={() => copyToClipboard(darker.toHexString(), `variation-${percent}`)}
                            title={`${percent}% darker`}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
          <h3 className="text-2xl font-bold mb-6 text-gray-800 font-playfair">Professional Tips</h3>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Browser Support:</strong> Works best in Chrome, Edge, and Firefox</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Image Analysis:</strong> Upload images to extract dominant colors</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Quick Copy:</strong> Click any color to copy its HEX value</span>
              </li>
            </ul>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Favorites:</strong> Save your favorite colors for later use</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Color Variations:</strong> Generate lighter and darker shades</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <span><strong>Export:</strong> Download your color palette as a text file</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EyeDropper; 