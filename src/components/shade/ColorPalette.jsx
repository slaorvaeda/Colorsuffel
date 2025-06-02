import React from 'react';
import tinycolor from 'tinycolor2';
import { FaRegHeart } from "react-icons/fa";


function ColorPalette({ color, onLike }) { // Add onLike prop
  const generateShadesAndTints = (baseColor) => {
    const shadesAndTints = [];
    for (let i = 12; i > 6; i--) {
      shadesAndTints.push(tinycolor(baseColor).lighten(i * 3.5).toString());
    }
    for (let i = 1; i <= 12; i++) {
      shadesAndTints.push(tinycolor(baseColor).darken(i * 3.5).toString());
    }
    return shadesAndTints;
  };

  const shadesAndTints = generateShadesAndTints(color);

  const handleShadeClick = (shade) => {
    navigator.clipboard.writeText(shade).then(() => {
      alert(`Copied ${shade} to clipboard`);
    });
  };

  return (
    <div>
      <div className='flex justify-center items-center m-auto' >
        <p>{color}</p>
      </div>
      <div className='h-full'>
        <h3 className='text-center text-4xl p-4 '>Shades and Tints</h3>
        <div className='flex flex-wrap justify-center items-center m-auto max-w-[660px] '>
          {shadesAndTints.map((col, index) => (
            <div
              key={index}
              style={{ backgroundColor: col, height: '100px', width: '100px', margin: '5px', borderRadius: "5px", cursor: 'pointer', position: 'relative' }}
              onClick={() => handleShadeClick(col)}
            >
              <p style={{ color: tinycolor(col).isDark() ? '#FFF' : '#000' }}>{col}</p>
              <button 
                style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                onClick={(e) => { e.stopPropagation(); onLike(col); }}
              >
                <FaRegHeart />
                
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ColorPalette;
