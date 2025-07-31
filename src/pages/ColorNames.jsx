import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function ColorNames() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState(null);
  const [copiedColor, setCopiedColor] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  // Complete HTML Color Names Database
  const colorDatabase = {
    reds: [
      { name: 'IndianRed', hex: '#CD5C5C', rgb: { r: 205, g: 92, b: 92 }, description: 'HTML Color Name - Indian Red' },
      { name: 'LightCoral', hex: '#F08080', rgb: { r: 240, g: 128, b: 128 }, description: 'HTML Color Name - Light Coral' },
      { name: 'Salmon', hex: '#FA8072', rgb: { r: 250, g: 128, b: 114 }, description: 'HTML Color Name - Salmon' },
      { name: 'DarkSalmon', hex: '#E9967A', rgb: { r: 233, g: 150, b: 122 }, description: 'HTML Color Name - Dark Salmon' },
      { name: 'LightSalmon', hex: '#FFA07A', rgb: { r: 255, g: 160, b: 122 }, description: 'HTML Color Name - Light Salmon' },
      { name: 'Crimson', hex: '#DC143C', rgb: { r: 220, g: 20, b: 60 }, description: 'HTML Color Name - Crimson' },
      { name: 'Red', hex: '#FF0000', rgb: { r: 255, g: 0, b: 0 }, description: 'HTML Color Name - Red' },
      { name: 'FireBrick', hex: '#B22222', rgb: { r: 178, g: 34, b: 34 }, description: 'HTML Color Name - Fire Brick' },
      { name: 'DarkRed', hex: '#8B0000', rgb: { r: 139, g: 0, b: 0 }, description: 'HTML Color Name - Dark Red' }
    ],
    blues: [
      { name: 'Aqua', hex: '#00FFFF', rgb: { r: 0, g: 255, b: 255 }, description: 'HTML Color Name - Aqua' },
      { name: 'Cyan', hex: '#00FFFF', rgb: { r: 0, g: 255, b: 255 }, description: 'HTML Color Name - Cyan' },
      { name: 'LightCyan', hex: '#E0FFFF', rgb: { r: 224, g: 255, b: 255 }, description: 'HTML Color Name - Light Cyan' },
      { name: 'PaleTurquoise', hex: '#AFEEEE', rgb: { r: 175, g: 238, b: 238 }, description: 'HTML Color Name - Pale Turquoise' },
      { name: 'Aquamarine', hex: '#7FFFD4', rgb: { r: 127, g: 255, b: 212 }, description: 'HTML Color Name - Aquamarine' },
      { name: 'Turquoise', hex: '#40E0D0', rgb: { r: 64, g: 224, b: 208 }, description: 'HTML Color Name - Turquoise' },
      { name: 'MediumTurquoise', hex: '#48D1CC', rgb: { r: 72, g: 209, b: 204 }, description: 'HTML Color Name - Medium Turquoise' },
      { name: 'DarkTurquoise', hex: '#00CED1', rgb: { r: 0, g: 206, b: 209 }, description: 'HTML Color Name - Dark Turquoise' },
      { name: 'CadetBlue', hex: '#5F9EA0', rgb: { r: 95, g: 158, b: 160 }, description: 'HTML Color Name - Cadet Blue' },
      { name: 'SteelBlue', hex: '#4682B4', rgb: { r: 70, g: 130, b: 180 }, description: 'HTML Color Name - Steel Blue' },
      { name: 'LightSteelBlue', hex: '#B0C4DE', rgb: { r: 176, g: 196, b: 222 }, description: 'HTML Color Name - Light Steel Blue' },
      { name: 'PowderBlue', hex: '#B0E0E6', rgb: { r: 176, g: 224, b: 230 }, description: 'HTML Color Name - Powder Blue' },
      { name: 'LightBlue', hex: '#ADD8E6', rgb: { r: 173, g: 216, b: 230 }, description: 'HTML Color Name - Light Blue' },
      { name: 'SkyBlue', hex: '#87CEEB', rgb: { r: 135, g: 206, b: 235 }, description: 'HTML Color Name - Sky Blue' },
      { name: 'LightSkyBlue', hex: '#87CEFA', rgb: { r: 135, g: 206, b: 250 }, description: 'HTML Color Name - Light Sky Blue' },
      { name: 'DeepSkyBlue', hex: '#00BFFF', rgb: { r: 0, g: 191, b: 255 }, description: 'HTML Color Name - Deep Sky Blue' },
      { name: 'DodgerBlue', hex: '#1E90FF', rgb: { r: 30, g: 144, b: 255 }, description: 'HTML Color Name - Dodger Blue' },
      { name: 'CornflowerBlue', hex: '#6495ED', rgb: { r: 100, g: 149, b: 237 }, description: 'HTML Color Name - Cornflower Blue' },
      { name: 'MediumSlateBlue', hex: '#7B68EE', rgb: { r: 123, g: 104, b: 238 }, description: 'HTML Color Name - Medium Slate Blue' },
      { name: 'RoyalBlue', hex: '#4169E1', rgb: { r: 65, g: 105, b: 225 }, description: 'HTML Color Name - Royal Blue' },
      { name: 'Blue', hex: '#0000FF', rgb: { r: 0, g: 0, b: 255 }, description: 'HTML Color Name - Blue' },
      { name: 'MediumBlue', hex: '#0000CD', rgb: { r: 0, g: 0, b: 205 }, description: 'HTML Color Name - Medium Blue' },
      { name: 'DarkBlue', hex: '#00008B', rgb: { r: 0, g: 0, b: 139 }, description: 'HTML Color Name - Dark Blue' },
      { name: 'Navy', hex: '#000080', rgb: { r: 0, g: 0, b: 128 }, description: 'HTML Color Name - Navy' },
      { name: 'MidnightBlue', hex: '#191970', rgb: { r: 25, g: 25, b: 112 }, description: 'HTML Color Name - Midnight Blue' }
    ],
    greens: [
      { name: 'GreenYellow', hex: '#ADFF2F', rgb: { r: 173, g: 255, b: 47 }, description: 'HTML Color Name - Green Yellow' },
      { name: 'Chartreuse', hex: '#7FFF00', rgb: { r: 127, g: 255, b: 0 }, description: 'HTML Color Name - Chartreuse' },
      { name: 'LawnGreen', hex: '#7CFC00', rgb: { r: 124, g: 252, b: 0 }, description: 'HTML Color Name - Lawn Green' },
      { name: 'Lime', hex: '#00FF00', rgb: { r: 0, g: 255, b: 0 }, description: 'HTML Color Name - Lime' },
      { name: 'LimeGreen', hex: '#32CD32', rgb: { r: 50, g: 205, b: 50 }, description: 'HTML Color Name - Lime Green' },
      { name: 'PaleGreen', hex: '#98FB98', rgb: { r: 152, g: 251, b: 152 }, description: 'HTML Color Name - Pale Green' },
      { name: 'LightGreen', hex: '#90EE90', rgb: { r: 144, g: 238, b: 144 }, description: 'HTML Color Name - Light Green' },
      { name: 'MediumSpringGreen', hex: '#00FA9A', rgb: { r: 0, g: 250, b: 154 }, description: 'HTML Color Name - Medium Spring Green' },
      { name: 'SpringGreen', hex: '#00FF7F', rgb: { r: 0, g: 255, b: 127 }, description: 'HTML Color Name - Spring Green' },
      { name: 'MediumSeaGreen', hex: '#3CB371', rgb: { r: 60, g: 179, b: 113 }, description: 'HTML Color Name - Medium Sea Green' },
      { name: 'SeaGreen', hex: '#2E8B57', rgb: { r: 46, g: 139, b: 87 }, description: 'HTML Color Name - Sea Green' },
      { name: 'ForestGreen', hex: '#228B22', rgb: { r: 34, g: 139, b: 34 }, description: 'HTML Color Name - Forest Green' },
      { name: 'Green', hex: '#008000', rgb: { r: 0, g: 128, b: 0 }, description: 'HTML Color Name - Green' },
      { name: 'DarkGreen', hex: '#006400', rgb: { r: 0, g: 100, b: 0 }, description: 'HTML Color Name - Dark Green' },
      { name: 'YellowGreen', hex: '#9ACD32', rgb: { r: 154, g: 205, b: 50 }, description: 'HTML Color Name - Yellow Green' },
      { name: 'OliveDrab', hex: '#6B8E23', rgb: { r: 107, g: 142, b: 35 }, description: 'HTML Color Name - Olive Drab' },
      { name: 'Olive', hex: '#808000', rgb: { r: 128, g: 128, b: 0 }, description: 'HTML Color Name - Olive' },
      { name: 'DarkOliveGreen', hex: '#556B2F', rgb: { r: 85, g: 107, b: 47 }, description: 'HTML Color Name - Dark Olive Green' },
      { name: 'MediumAquamarine', hex: '#66CDAA', rgb: { r: 102, g: 205, b: 170 }, description: 'HTML Color Name - Medium Aquamarine' },
      { name: 'DarkSeaGreen', hex: '#8FBC8B', rgb: { r: 143, g: 188, b: 139 }, description: 'HTML Color Name - Dark Sea Green' },
      { name: 'LightSeaGreen', hex: '#20B2AA', rgb: { r: 32, g: 178, b: 170 }, description: 'HTML Color Name - Light Sea Green' },
      { name: 'DarkCyan', hex: '#008B8B', rgb: { r: 0, g: 139, b: 139 }, description: 'HTML Color Name - Dark Cyan' },
      { name: 'Teal', hex: '#008080', rgb: { r: 0, g: 128, b: 128 }, description: 'HTML Color Name - Teal' }
    ],
    yellows: [
      { name: 'Gold', hex: '#FFD700', rgb: { r: 255, g: 215, b: 0 }, description: 'HTML Color Name - Gold' },
      { name: 'Yellow', hex: '#FFFF00', rgb: { r: 255, g: 255, b: 0 }, description: 'HTML Color Name - Yellow' },
      { name: 'LightYellow', hex: '#FFFFE0', rgb: { r: 255, g: 255, b: 224 }, description: 'HTML Color Name - Light Yellow' },
      { name: 'LemonChiffon', hex: '#FFFACD', rgb: { r: 255, g: 250, b: 205 }, description: 'HTML Color Name - Lemon Chiffon' },
      { name: 'LightGoldenrodYellow', hex: '#FAFAD2', rgb: { r: 250, g: 250, b: 210 }, description: 'HTML Color Name - Light Goldenrod Yellow' },
      { name: 'PapayaWhip', hex: '#FFEFD5', rgb: { r: 255, g: 239, b: 213 }, description: 'HTML Color Name - Papaya Whip' },
      { name: 'Moccasin', hex: '#FFE4B5', rgb: { r: 255, g: 228, b: 181 }, description: 'HTML Color Name - Moccasin' },
      { name: 'PeachPuff', hex: '#FFDAB9', rgb: { r: 255, g: 218, b: 185 }, description: 'HTML Color Name - Peach Puff' },
      { name: 'PaleGoldenrod', hex: '#EEE8AA', rgb: { r: 238, g: 232, b: 170 }, description: 'HTML Color Name - Pale Goldenrod' },
      { name: 'Khaki', hex: '#F0E68C', rgb: { r: 240, g: 230, b: 140 }, description: 'HTML Color Name - Khaki' },
      { name: 'DarkKhaki', hex: '#BDB76B', rgb: { r: 189, g: 183, b: 107 }, description: 'HTML Color Name - Dark Khaki' }
    ],
    purples: [
      { name: 'Lavender', hex: '#E6E6FA', rgb: { r: 230, g: 230, b: 250 }, description: 'HTML Color Name - Lavender' },
      { name: 'Thistle', hex: '#D8BFD8', rgb: { r: 216, g: 191, b: 216 }, description: 'HTML Color Name - Thistle' },
      { name: 'Plum', hex: '#DDA0DD', rgb: { r: 221, g: 160, b: 221 }, description: 'HTML Color Name - Plum' },
      { name: 'Violet', hex: '#EE82EE', rgb: { r: 238, g: 130, b: 238 }, description: 'HTML Color Name - Violet' },
      { name: 'Orchid', hex: '#DA70D6', rgb: { r: 218, g: 112, b: 214 }, description: 'HTML Color Name - Orchid' },
      { name: 'Fuchsia', hex: '#FF00FF', rgb: { r: 255, g: 0, b: 255 }, description: 'HTML Color Name - Fuchsia' },
      { name: 'Magenta', hex: '#FF00FF', rgb: { r: 255, g: 0, b: 255 }, description: 'HTML Color Name - Magenta' },
      { name: 'MediumOrchid', hex: '#BA55D3', rgb: { r: 186, g: 85, b: 211 }, description: 'HTML Color Name - Medium Orchid' },
      { name: 'MediumPurple', hex: '#9370DB', rgb: { r: 147, g: 112, b: 219 }, description: 'HTML Color Name - Medium Purple' },
      { name: 'RebeccaPurple', hex: '#663399', rgb: { r: 102, g: 51, b: 153 }, description: 'HTML Color Name - Rebecca Purple' },
      { name: 'BlueViolet', hex: '#8A2BE2', rgb: { r: 138, g: 43, b: 226 }, description: 'HTML Color Name - Blue Violet' },
      { name: 'DarkViolet', hex: '#9400D3', rgb: { r: 148, g: 0, b: 211 }, description: 'HTML Color Name - Dark Violet' },
      { name: 'DarkOrchid', hex: '#9932CC', rgb: { r: 153, g: 50, b: 204 }, description: 'HTML Color Name - Dark Orchid' },
      { name: 'DarkMagenta', hex: '#8B008B', rgb: { r: 139, g: 0, b: 139 }, description: 'HTML Color Name - Dark Magenta' },
      { name: 'Purple', hex: '#800080', rgb: { r: 128, g: 0, b: 128 }, description: 'HTML Color Name - Purple' },
      { name: 'Indigo', hex: '#4B0082', rgb: { r: 75, g: 0, b: 130 }, description: 'HTML Color Name - Indigo' },
      { name: 'SlateBlue', hex: '#6A5ACD', rgb: { r: 106, g: 90, b: 205 }, description: 'HTML Color Name - Slate Blue' },
      { name: 'DarkSlateBlue', hex: '#483D8B', rgb: { r: 72, g: 61, b: 139 }, description: 'HTML Color Name - Dark Slate Blue' },
      { name: 'MediumSlateBlue', hex: '#7B68EE', rgb: { r: 123, g: 104, b: 238 }, description: 'HTML Color Name - Medium Slate Blue' }
    ],
    oranges: [
      { name: 'LightSalmon', hex: '#FFA07A', rgb: { r: 255, g: 160, b: 122 }, description: 'HTML Color Name - Light Salmon' },
      { name: 'Coral', hex: '#FF7F50', rgb: { r: 255, g: 127, b: 80 }, description: 'HTML Color Name - Coral' },
      { name: 'Tomato', hex: '#FF6347', rgb: { r: 255, g: 99, b: 71 }, description: 'HTML Color Name - Tomato' },
      { name: 'OrangeRed', hex: '#FF4500', rgb: { r: 255, g: 69, b: 0 }, description: 'HTML Color Name - Orange Red' },
      { name: 'DarkOrange', hex: '#FF8C00', rgb: { r: 255, g: 140, b: 0 }, description: 'HTML Color Name - Dark Orange' },
      { name: 'Orange', hex: '#FFA500', rgb: { r: 255, g: 165, b: 0 }, description: 'HTML Color Name - Orange' }
    ],
    pinks: [
      { name: 'Pink', hex: '#FFC0CB', rgb: { r: 255, g: 192, b: 203 }, description: 'HTML Color Name - Pink' },
      { name: 'LightPink', hex: '#FFB6C1', rgb: { r: 255, g: 182, b: 193 }, description: 'HTML Color Name - Light Pink' },
      { name: 'HotPink', hex: '#FF69B4', rgb: { r: 255, g: 105, b: 180 }, description: 'HTML Color Name - Hot Pink' },
      { name: 'DeepPink', hex: '#FF1493', rgb: { r: 255, g: 20, b: 147 }, description: 'HTML Color Name - Deep Pink' },
      { name: 'MediumVioletRed', hex: '#C71585', rgb: { r: 199, g: 21, b: 133 }, description: 'HTML Color Name - Medium Violet Red' },
      { name: 'PaleVioletRed', hex: '#DB7093', rgb: { r: 219, g: 112, b: 147 }, description: 'HTML Color Name - Pale Violet Red' }
    ],
    browns: [
      { name: 'Cornsilk', hex: '#FFF8DC', rgb: { r: 255, g: 248, b: 220 }, description: 'HTML Color Name - Cornsilk' },
      { name: 'BlanchedAlmond', hex: '#FFEBCD', rgb: { r: 255, g: 235, b: 205 }, description: 'HTML Color Name - Blanched Almond' },
      { name: 'Bisque', hex: '#FFE4C4', rgb: { r: 255, g: 228, b: 196 }, description: 'HTML Color Name - Bisque' },
      { name: 'NavajoWhite', hex: '#FFDEAD', rgb: { r: 255, g: 222, b: 173 }, description: 'HTML Color Name - Navajo White' },
      { name: 'Wheat', hex: '#F5DEB3', rgb: { r: 245, g: 222, b: 179 }, description: 'HTML Color Name - Wheat' },
      { name: 'BurlyWood', hex: '#DEB887', rgb: { r: 222, g: 184, b: 135 }, description: 'HTML Color Name - Burly Wood' },
      { name: 'Tan', hex: '#D2B48C', rgb: { r: 210, g: 180, b: 140 }, description: 'HTML Color Name - Tan' },
      { name: 'RosyBrown', hex: '#BC8F8F', rgb: { r: 188, g: 143, b: 143 }, description: 'HTML Color Name - Rosy Brown' },
      { name: 'SandyBrown', hex: '#F4A460', rgb: { r: 244, g: 164, b: 96 }, description: 'HTML Color Name - Sandy Brown' },
      { name: 'Goldenrod', hex: '#DAA520', rgb: { r: 218, g: 165, b: 32 }, description: 'HTML Color Name - Goldenrod' },
      { name: 'DarkGoldenrod', hex: '#B8860B', rgb: { r: 184, g: 134, b: 11 }, description: 'HTML Color Name - Dark Goldenrod' },
      { name: 'Peru', hex: '#CD853F', rgb: { r: 205, g: 133, b: 63 }, description: 'HTML Color Name - Peru' },
      { name: 'Chocolate', hex: '#D2691E', rgb: { r: 210, g: 105, b: 30 }, description: 'HTML Color Name - Chocolate' },
      { name: 'SaddleBrown', hex: '#8B4513', rgb: { r: 139, g: 69, b: 19 }, description: 'HTML Color Name - Saddle Brown' },
      { name: 'Sienna', hex: '#A0522D', rgb: { r: 160, g: 82, b: 45 }, description: 'HTML Color Name - Sienna' },
      { name: 'Brown', hex: '#A52A2A', rgb: { r: 165, g: 42, b: 42 }, description: 'HTML Color Name - Brown' },
      { name: 'Maroon', hex: '#800000', rgb: { r: 128, g: 0, b: 0 }, description: 'HTML Color Name - Maroon' }
    ],
    grays: [
      { name: 'Gainsboro', hex: '#DCDCDC', rgb: { r: 220, g: 220, b: 220 }, description: 'HTML Color Name - Gainsboro' },
      { name: 'LightGray', hex: '#D3D3D3', rgb: { r: 211, g: 211, b: 211 }, description: 'HTML Color Name - Light Gray' },
      { name: 'Silver', hex: '#C0C0C0', rgb: { r: 192, g: 192, b: 192 }, description: 'HTML Color Name - Silver' },
      { name: 'DarkGray', hex: '#A9A9A9', rgb: { r: 169, g: 169, b: 169 }, description: 'HTML Color Name - Dark Gray' },
      { name: 'Gray', hex: '#808080', rgb: { r: 128, g: 128, b: 128 }, description: 'HTML Color Name - Gray' },
      { name: 'DimGray', hex: '#696969', rgb: { r: 105, g: 105, b: 105 }, description: 'HTML Color Name - Dim Gray' },
      { name: 'LightSlateGray', hex: '#778899', rgb: { r: 119, g: 136, b: 153 }, description: 'HTML Color Name - Light Slate Gray' },
      { name: 'SlateGray', hex: '#708090', rgb: { r: 112, g: 128, b: 144 }, description: 'HTML Color Name - Slate Gray' },
      { name: 'DarkSlateGray', hex: '#2F4F4F', rgb: { r: 47, g: 79, b: 79 }, description: 'HTML Color Name - Dark Slate Gray' },
      { name: 'Black', hex: '#000000', rgb: { r: 0, g: 0, b: 0 }, description: 'HTML Color Name - Black' }
    ],
    whites: [
      { name: 'White', hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 }, description: 'HTML Color Name - White' },
      { name: 'Snow', hex: '#FFFAFA', rgb: { r: 255, g: 250, b: 250 }, description: 'HTML Color Name - Snow' },
      { name: 'HoneyDew', hex: '#F0FFF0', rgb: { r: 240, g: 255, b: 240 }, description: 'HTML Color Name - Honey Dew' },
      { name: 'MintCream', hex: '#F5FFFA', rgb: { r: 245, g: 255, b: 250 }, description: 'HTML Color Name - Mint Cream' },
      { name: 'Azure', hex: '#F0FFFF', rgb: { r: 240, g: 255, b: 255 }, description: 'HTML Color Name - Azure' },
      { name: 'AliceBlue', hex: '#F0F8FF', rgb: { r: 240, g: 248, b: 255 }, description: 'HTML Color Name - Alice Blue' },
      { name: 'GhostWhite', hex: '#F8F8FF', rgb: { r: 248, g: 248, b: 255 }, description: 'HTML Color Name - Ghost White' },
      { name: 'WhiteSmoke', hex: '#F5F5F5', rgb: { r: 245, g: 245, b: 245 }, description: 'HTML Color Name - White Smoke' },
      { name: 'SeaShell', hex: '#FFF5EE', rgb: { r: 255, g: 245, b: 238 }, description: 'HTML Color Name - Sea Shell' },
      { name: 'Beige', hex: '#F5F5DC', rgb: { r: 245, g: 245, b: 220 }, description: 'HTML Color Name - Beige' },
      { name: 'OldLace', hex: '#FDF5E6', rgb: { r: 253, g: 245, b: 230 }, description: 'HTML Color Name - Old Lace' },
      { name: 'FloralWhite', hex: '#FFFAF0', rgb: { r: 255, g: 250, b: 240 }, description: 'HTML Color Name - Floral White' },
      { name: 'Ivory', hex: '#FFFFF0', rgb: { r: 255, g: 255, b: 240 }, description: 'HTML Color Name - Ivory' },
      { name: 'AntiqueWhite', hex: '#FAEBD7', rgb: { r: 250, g: 235, b: 215 }, description: 'HTML Color Name - Antique White' },
      { name: 'Linen', hex: '#FAF0E6', rgb: { r: 250, g: 240, b: 230 }, description: 'HTML Color Name - Linen' },
      { name: 'LavenderBlush', hex: '#FFF0F5', rgb: { r: 255, g: 240, b: 245 }, description: 'HTML Color Name - Lavender Blush' },
      { name: 'MistyRose', hex: '#FFE4E1', rgb: { r: 255, g: 228, b: 225 }, description: 'HTML Color Name - Misty Rose' }
    ],

  };

  const categories = [
    { id: 'all', name: 'All Colors', icon: '🎨' },
    { id: 'reds', name: 'Reds', icon: '🔴' },
    { id: 'blues', name: 'Blues', icon: '🔵' },
    { id: 'greens', name: 'Greens', icon: '🟢' },
    { id: 'yellows', name: 'Yellows', icon: '🟡' },
    { id: 'purples', name: 'Purples', icon: '🟣' },
    { id: 'oranges', name: 'Oranges', icon: '🟠' },
    { id: 'pinks', name: 'Pinks', icon: '💗' },
    { id: 'browns', name: 'Browns', icon: '🟤' },
    { id: 'grays', name: 'Grays', icon: '⚫' },
    { id: 'whites', name: 'Whites', icon: '⚪' }
  ];

  // Filter colors based on search term and category
  const filteredColors = () => {
    let allColors = [];
    
    if (selectedCategory === 'all') {
      Object.values(colorDatabase).forEach(category => {
        allColors = [...allColors, ...category];
      });
    } else {
      allColors = colorDatabase[selectedCategory] || [];
    }

    if (searchTerm.trim() === '') {
      return allColors;
    }

    return allColors.filter(color =>
      color.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.hex.toLowerCase().includes(searchTerm.toLowerCase()) ||
      color.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8" data-aos="fade-down">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Color Names Database
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore thousands of color names with their hex codes, RGB values, and descriptions. 
            Find the perfect color for your next project.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-6" data-aos="fade-up">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search colors by name, hex code, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none shadow-lg"
              />
              <svg className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-center">
            <div className="bg-white rounded-full p-1 shadow-lg">
              <button
                onClick={() => setViewMode('cards')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'cards'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Cards
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                List
              </button>
            </div>
          </div>
        </div>

        {/* Color Display */}
        {viewMode === 'cards' ? (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-aos="fade-up" data-aos-delay="200">
            {filteredColors().map((color, index) => {
              const hsl = rgbToHsl(color.rgb.r, color.rgb.g, color.rgb.b);
              return (
                <div
                  key={`${color.name}-${index}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  onClick={() => setSelectedColor(color)}
                >
                  {/* Color Swatch */}
                  <div
                    className="h-32 w-full relative group"
                    style={{ backgroundColor: color.hex }}
                  >
                    <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(color.hex, `hex-${index}`);
                        }}
                        className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg transition-all"
                      >
                        {copiedColor === `hex-${index}` ? 'Copied!' : 'Copy HEX'}
                      </button>
                    </div>
                  </div>

                  {/* Color Information */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{color.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{color.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">HEX:</span>
                        <span className="font-mono text-gray-900">{color.hex}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">RGB:</span>
                        <span className="font-mono text-gray-900">
                          {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">HSL:</span>
                        <span className="font-mono text-gray-900">
                          {hsl.h}°, {hsl.s}%, {hsl.l}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            {/* List Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-700">
                <div className="col-span-1">Color</div>
                <div className="col-span-4">Name</div>
                <div className="col-span-2">HEX</div>
                <div className="col-span-3">RGB</div>
                <div className="col-span-2">Actions</div>
              </div>
            </div>
            
            {/* List Items */}
            <div className="divide-y divide-gray-200">
              {filteredColors().map((color, index) => {
                const hsl = rgbToHsl(color.rgb.r, color.rgb.g, color.rgb.b);
                return (
                  <div
                    key={`${color.name}-${index}`}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedColor(color)}
                  >
                    <div className="grid grid-cols-12 gap-3 items-center">
                      {/* Color Swatch */}
                      <div className="col-span-1">
                        <div
                          className="w-8 h-8 rounded-md shadow-sm border border-gray-200"
                          style={{ backgroundColor: color.hex }}
                        ></div>
                      </div>
                      
                      {/* Color Name */}
                      <div className="col-span-4">
                        <h3 className="font-semibold text-gray-900">{color.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{color.description}</p>
                      </div>
                      
                      {/* HEX Code */}
                      <div className="col-span-2">
                        <span className="font-mono text-sm text-gray-700">{color.hex}</span>
                      </div>
                      
                      {/* RGB Values */}
                      <div className="col-span-3">
                        <span className="font-mono text-sm text-gray-700">
                          {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                        </span>
                      </div>
                      
                      {/* Actions */}
                      <div className="col-span-2 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(color.hex, `list-hex-${index}`);
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {copiedColor === `list-hex-${index}` ? 'Copied!' : 'Copy HEX'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(`rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`, `list-rgb-${index}`);
                          }}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition-colors"
                        >
                          {copiedColor === `list-rgb-${index}` ? 'Copied!' : 'Copy RGB'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredColors().length === 0 && (
          <div className="text-center py-12" data-aos="fade-in">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No colors found</h3>
            <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
          </div>
        )}

        {/* Color Details Modal */}
        {selectedColor && (
          <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedColor(null)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedColor.name}</h2>
                <button
                  onClick={() => setSelectedColor(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div
                className="h-32 w-full rounded-xl mb-6"
                style={{ backgroundColor: selectedColor.hex }}
              ></div>
              
              <p className="text-gray-600 mb-6">{selectedColor.description}</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">HEX:</span>
                  <span className="font-mono text-gray-900">{selectedColor.hex}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">RGB:</span>
                  <span className="font-mono text-gray-900">
                    {selectedColor.rgb.r}, {selectedColor.rgb.g}, {selectedColor.rgb.b}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-700">HSL:</span>
                  <span className="font-mono text-gray-900">
                    {rgbToHsl(selectedColor.rgb.r, selectedColor.rgb.g, selectedColor.rgb.b).h}°, 
                    {rgbToHsl(selectedColor.rgb.r, selectedColor.rgb.g, selectedColor.rgb.b).s}%, 
                    {rgbToHsl(selectedColor.rgb.r, selectedColor.rgb.g, selectedColor.rgb.b).l}%
                  </span>
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => copyToClipboard(selectedColor.hex, 'modal')}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {copiedColor === 'modal' ? 'Copied!' : 'Copy HEX'}
                </button>
                <button
                  onClick={() => copyToClipboard(`rgb(${selectedColor.rgb.r}, ${selectedColor.rgb.g}, ${selectedColor.rgb.b})`, 'modal-rgb')}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {copiedColor === 'modal-rgb' ? 'Copied!' : 'Copy RGB'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ColorNames; 