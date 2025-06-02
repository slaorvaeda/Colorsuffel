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

// const savePaletteAsJSON = (colors) => {
//   const palette = colors.map((color) => ({ hex: color, rgb: hexToRgb(color) }));
//   const blob = new Blob([JSON.stringify(palette, null, 2)], { type: "application/json" });
//   const link = document.createElement("a");
//   link.href = URL.createObjectURL(blob);
//   link.download = "color_palette.json";
//   link.click();
// };

const PaletteGenerator = () => {
  const [colors, setColors] = useState(Array(210).fill().map(generateRandomColor));

  const generateNewPalette = () => {
    setColors(Array(210).fill().map(generateRandomColor));
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
          <div key={index} className="flex flex-col items-center border p-1 rounded-lg shadow-md border-gray-200">
            {/* <h3 className="flex mb-2 text-lg font-semibold">Palette {index + 1}</h3> */}
            <div className="flex bg-amber-200 rounded-lg overflow-hidden">
            <div className="flex rounded">
              {group.map((color, idx) => (
                <div key={idx} className="w-16 h-16 flex flex-col items-center justify-center shadow-lg cursor-pointer transition-all duration-300 hover:w-20 " style={{ backgroundColor: color }} 
                  onClick={() => copyToClipboard(color)}
                >
                  {/* <span className="text-white font-bold text-xs ">{color}</span>
                  <span className="text-white text-xs">{hexToRgb(color)}</span> */}
                </div>
                
              ))}
            </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaletteGenerator;
