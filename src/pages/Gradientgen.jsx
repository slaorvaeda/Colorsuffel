import React, { useState } from 'react';
import RoundDiler from '../components/RoundDiler';

function Gradientgen() {
    const [colors, setColors] = useState(['#ff0000', '#0000ff']);
    const [degree, setDegree] = useState(90);
    const [gradientType, setGradientType] = useState('linear'); // 'linear' or 'radial'

    const handleColorChange = (idx, value) => {
        const newColors = [...colors];
        newColors[idx] = value;
        setColors(newColors);
    };

    const addColor = () => {
        setColors([...colors, '#ffffff']);
    };

    const removeColor = (idx) => {
        if (colors.length > 2) {
            setColors(colors.filter((_, i) => i !== idx));
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold py-5 text-center">Gradient Generator</h1>
            <div className="flex justify-center gap-4 mb-4">
                <div className="inline-flex rounded-lg bg-gray-100 p-1  gap-2 shadow-inner">
                    <button
                        className={`px-4 py-1 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${gradientType === 'linear' ? 'bg-amber-400 text-gray-900 shadow' : 'bg-transparent text-gray-600 hover:bg-amber-100'}`}
                        onClick={() => setGradientType('linear')}
                        aria-pressed={gradientType === 'linear'}
                    >
                        Linear Gradient
                    </button>
                    <button
                        className={`px-4 py-1 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 ${gradientType === 'radial' ? 'bg-amber-400 text-gray-900 shadow' : 'bg-transparent text-gray-600 hover:bg-amber-100'}`}
                        onClick={() => setGradientType('radial')}
                        aria-pressed={gradientType === 'radial'}
                    >
                        Radial Gradient
                    </button>
                </div>
            </div>
            <div className='p-2 m-auto rounded-2xl'
                style={{
                    width: '94%',
                    height: '70vh',
                    background:
                        gradientType === 'linear'
                            ? `linear-gradient(${degree}deg, ${colors.join(', ')})`
                            : `radial-gradient(circle, ${colors.join(', ')})`,
                }}
            ></div>
            <div className='m-auto flex justify-center items-center gap-4 mt-4'>
                {/* Use RoundDiler for degree control, only show for linear */}
                {gradientType === 'linear' && <RoundDiler degree={degree} setDegree={setDegree} />}
                <div className='flex flex-wrap justify-center gap-2'>
                    {colors.map((color, idx) => (
                        <div key={idx} className="flex flex-col items-center ">
                            <input type="color" value={color} onChange={e => handleColorChange(idx, e.target.value)} className='border-none w-10 h-10 rounded-2xl'/>
                            {colors.length > 2 && (
                                <button className="text-xs text-red-500 hover:underline mt-1" onClick={() => removeColor(idx)}>Remove</button>
                            )}
                        </div>
                    ))}
                    <button className="px-3 py-1 bg-amber-300 rounded-lg shadow hover:bg-amber-400 font-semibold text-gray-800 transition-colors" onClick={addColor}>+ Add Color</button>
                </div>
            </div>
            {/* Show CSS code at the bottom */}
            <div className="w-full mt-8 flex flex-col items-center p-2">
                <span className="font-semibold text-gray-700 mb-2">CSS Code:</span>
                <div className="flex items-center gap-2">
                    <div className=" bg-gray-100 rounded-lg px-4 py-2 text-sm font-mono text-gray-800  shadow-inner border border-gray-200 mb-0">
                        {`background: ${gradientType === 'linear'
                                ? `linear-gradient(${degree}deg, ${colors.join(', ')})`
                                : `radial-gradient(circle, ${colors.join(', ')})`
                            };`}
                    </div>
                    <button
                        className=" px-3 py-1 bg-amber-300 rounded-lg shadow hover:bg-amber-400 font-semibold text-gray-800 transition-colors"
                        onClick={() => {
                            const code = `background: ${gradientType === 'linear'
                                    ? `linear-gradient(${degree}deg, ${colors.join(', ')})`
                                    : `radial-gradient(circle, ${colors.join(', ')})`
                                };`;
                            navigator.clipboard.writeText(code);
                            alert('CSS code copied to clipboard!');
                        }}
                    >
                        Copy
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Gradientgen;