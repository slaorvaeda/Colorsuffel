import React, { useState } from "react";

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const hexToRgb = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
};

// Generate harmonious colors for a palette group
const generateHarmoniousGroup = () => {
  // Pick a random base HSL color
  const baseHue = Math.floor(Math.random() * 360);
  const baseSaturation = Math.floor(Math.random() * 21) + 70; // 75-95% (more vibrant)
  const baseLightness = Math.floor(Math.random() * 16) + 50; // 50-65% (less faded)

  // Helper to convert HSL to RGB string
  const hslToRgbString = (h, s, l) => {
    h = h / 360;
    s = s / 100;
    l = l / 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
  };

  // Generate 5 harmonious colors by varying hue/sat/lightness slightly
  return Array(5).fill().map((_, i) => {
    const hue = (baseHue + (i * 10) + Math.floor(Math.random() * 8 - 4)) % 360;
    const sat = Math.min(100, Math.max(60, baseSaturation + Math.floor(Math.random() * 11 - 5)));
    const light = Math.min(80, Math.max(45, baseLightness + Math.floor(Math.random() * 9 - 4)));
    return hslToRgbString(hue, sat, light);
  });
};

const PaletteGenerator = () => {
  // Generate 42 groups of 5 harmonious colors (total 210)
  const [colors, setColors] = useState(Array(42).fill().flatMap(generateHarmoniousGroup));
  const [openGroupIdx, setOpenGroupIdx] = useState(null);

  const generateNewPalette = () => {
    setColors(Array(42).fill().flatMap(generateHarmoniousGroup));
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    alert(`Copied ${color} to clipboard!`);
  };

  const groupedColors = [];
  for (let i = 0; i < colors.length; i += 5) {
    groupedColors.push(colors.slice(i, i + 5));
  }

  return (
    <div className="flex flex-col items-center p-5">
      <h1 className="text-3xl font-bold mb-5">Color Palette Generator</h1>
      <div className="flex flex-wrap justify-center gap-8">
        {groupedColors.map((group, index) => (
          <div key={index} className="flex flex-col items-center border p-1 rounded-lg shadow-md border-gray-200 relative">
            <div
              className="flex bg-amber-200 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => setOpenGroupIdx(index)}
            >
              <div className="flex rounded">
                {group.map((color, idx) => (
                  <div
                    key={idx}
                    className="w-16 h-16 flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:w-20"
                    style={{ backgroundColor: color }}
                    onClick={e => { e.stopPropagation(); setOpenGroupIdx(index); }}
                  >
                    {/* <span className="text-white font-bold text-xs ">{color}</span>
                    <span className="text-white text-xs">{hexToRgb(color)}</span> */}
                  </div>
                ))}
              </div>
            </div>
            {/* Modal for showing all colors in the group */}
            {openGroupIdx === index && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setOpenGroupIdx(null)}>
                <div className="bg-white border-0 rounded-2xl shadow-2xl p-6 flex flex-col items-center min-w-[340px] max-w-[90vw] relative animate-fadeIn" onClick={e => e.stopPropagation()}>
                  <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-900 text-3xl font-bold transition-colors" onClick={() => setOpenGroupIdx(null)} aria-label="Close">&times;</button>
                  <h2 className="text-lg font-semibold mb-4 tracking-wide text-gray-700">Palette Colors</h2>
                  <div className="flex gap-3 mb-4">
                    {group.map((color, idx) => (
                      <div key={idx} className="w-14 h-14 rounded-xl shadow-lg border border-gray-200 transition-transform hover:scale-110" style={{ backgroundColor: color }}></div>
                    ))}
                  </div>
                  <button
                    className="mb-4 px-4 py-1 bg-gradient-to-r from-amber-400 to-yellow-200 text-gray-900 rounded-lg font-semibold shadow hover:from-yellow-200 hover:to-amber-400 transition-colors ease-[cubic-bezier(.22,.84,1,.12)]"
                    onClick={() => {
                      const colorObj = {};
                      group.forEach((color, idx) => { colorObj[`color${idx+1}`] = color; });
                      navigator.clipboard.writeText(JSON.stringify(colorObj, null, 2));
                      alert('Copied The palette');
                    }}
                  >
                    Copy the Palette
                  </button>
                  <div className="flex flex-col gap-2 w-full">
                    {group.map((color, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono bg-gray-50 rounded px-3 py-1">
                        <span className="truncate" title={color}>{color}</span>
                        <button className="ml-2 px-2 py-0.5 bg-gradient-to-r from-amber-300 to-yellow-200 text-gray-800 rounded hover:from-yellow-200 hover:to-amber-300 shadow transition-colors" onClick={() => copyToClipboard(color)}>Copy</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaletteGenerator;

