import React, { useState } from 'react';
import RoundDiler from '../components/RoundDiler';
import GradientCopySection from '../components/GradientCopySection';
import CustomColorPicker from '../components/CustomColorPicker';

function Gradientgen() {
    const [colors, setColors] = useState(['#6366f1', '#ec4899']);
    const [degree, setDegree] = useState(90);
    const [gradientType, setGradientType] = useState('linear'); // 'linear' or 'radial'
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

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

    const getGradientCSS = () => {
        return gradientType === 'linear'
            ? `linear-gradient(${degree}deg, ${colors.join(', ')})`
            : `radial-gradient(circle, ${colors.join(', ')})`;
    };

    // Improved Drag and Drop Functions
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('application/json', JSON.stringify({ index }));
        
        // Add visual feedback
        e.target.style.opacity = '0.5';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        setDragOverIndex(index);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOverIndex(null);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        setDragOverIndex(null);
        
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'));
            const dragIndex = data.index;
            
            if (dragIndex !== dropIndex && dragIndex !== null) {
                const newColors = [...colors];
                const draggedColor = newColors[dragIndex];
                newColors.splice(dragIndex, 1);
                newColors.splice(dropIndex, 0, draggedColor);
                setColors(newColors);
            }
        } catch (error) {
            console.error('Error parsing drag data:', error);
        }
        
        setDraggedIndex(null);
    };

    const handleDragEnd = (e) => {
        e.target.style.opacity = '1';
        setDraggedIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div className="min-h-screen  py-8 px-4">
            {/* Custom styles for animations */}
            <style>
                {`
                    @import url("https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap");
                    .font-raleway {
                        font-family: 'Raleway', sans-serif;
                    }
                `}
            </style>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 font-raleway bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
                        Gradient Generator
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Create beautiful gradients with multiple color stops and copy the CSS code instantly
                    </p>
                </div>

                {/* Gradient Type Selector */}
                <div className="flex justify-center gap-4 mb-8">
                    <div className="inline-flex rounded-xl bg-white p-1 gap-2 shadow-lg border border-gray-200">
                    <button
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                gradientType === 'linear' 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                                    : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                        onClick={() => setGradientType('linear')}
                        aria-pressed={gradientType === 'linear'}
                    >
                        Linear Gradient
                    </button>
                    <button
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                gradientType === 'radial' 
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105' 
                                    : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                        onClick={() => setGradientType('radial')}
                        aria-pressed={gradientType === 'radial'}
                    >
                        Radial Gradient
                    </button>
                </div>
            </div>

                {/* Gradient Preview */}
                <div className="mb-8">
                    <div 
                        className="w-full h-80 rounded-2xl shadow-2xl border-4 border-white transform hover:scale-[1.02] transition-transform duration-300"
                style={{
                            background: getGradientCSS(),
                }}
            ></div>
                </div>

                {/* Controls Section */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
                    <div className="flex flex-col lg:flex-row justify-center items-center gap-6">
                        {/* Degree Control */}
                        {gradientType === 'linear' && (
                            <div className="flex flex-col items-center">
                                <label className="text-sm font-semibold text-gray-700 mb-2">Gradient Angle</label>
                                <RoundDiler degree={degree} setDegree={setDegree} />
                            </div>
                        )}
                        
                        {/* Color Controls */}
                        <div className="flex flex-col items-center">
                            <label className="text-sm font-semibold text-gray-700 mb-3">Color Stops (Drag to reorder)</label>
                            <div className="flex flex-wrap justify-center gap-3">
                    {colors.map((color, idx) => (
                                    <div 
                                        key={idx} 
                                        className={`flex flex-col items-center group transition-all duration-200 ${
                                            draggedIndex === idx ? 'transform scale-110 opacity-50' : ''
                                        } ${
                                            dragOverIndex === idx && draggedIndex !== idx ? 'transform scale-105 ring-2 ring-blue-400' : ''
                                        }`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, idx)}
                                        onDragOver={(e) => handleDragOver(e, idx)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, idx)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <div className="relative">
                                            <CustomColorPicker
                                                color={color}
                                                onChange={(newColor) => handleColorChange(idx, newColor)}
                                            />
                                            {/* Close Button */}
                            {colors.length > 2 && (
                                                <button 
                                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                                                    onClick={() => removeColor(idx)}
                                                    title="Remove color"
                                                >
                                                    ×
                                                </button>
                                            )}
                                            {/* Color Counter - Moved to top center */}
                                            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full border border-gray-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-xs text-gray-600 font-bold">{idx + 1}</span>
                                            </div>
                                            {/* Drag Handle */}
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
                                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M8 6a2 2 0 11-4 0 2 2 0 014 0zM8 12a2 2 0 11-4 0 2 2 0 014 0zM8 18a2 2 0 11-4 0 2 2 0 014 0zM20 6a2 2 0 11-4 0 2 2 0 014 0zM20 12a2 2 0 11-4 0 2 2 0 014 0zM20 18a2 2 0 11-4 0 2 2 0 014 0z"/>
                                                </svg>
                                            </div>
                                        </div>
                        </div>
                    ))}
                                <button 
                                    className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center text-white font-bold text-xl" 
                                    onClick={addColor}
                                    title="Add Color"
                                >
                                    +
                                </button>
                </div>
            </div>
                    </div>
                </div>
                
                {/* Gradient Copy Section Component */}
                <GradientCopySection 
                    colors={colors}
                    degree={degree}
                    gradientType={gradientType}
                />
            </div>
        </div>
    );
}

export default Gradientgen;