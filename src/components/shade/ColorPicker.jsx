import React, { useState } from 'react';

function ColorPicker({ onColorSelect }) {
  const [color, setColor] = useState('#00FF00'); // Default color set to green
  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    onColorSelect(newColor);
    setHistory([...history, newColor]);
  };

  return (
    <>
    <h1 className='text-4xl font-bold text-center py-4 '>Choose your color</h1>
      <div className='flex justify-center items-center flex-col'>
        <input type="color" value={color} onChange={handleChange} className='w-[100px] h-[100px] rounded-2xl border-0' />
        <div>
        </div>
      </div>
    </>
  );
}

export default ColorPicker;
