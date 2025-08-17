import React, { useState, useEffect } from 'react';
import ColorPalette from '../components/shade/ColorPalette';
import ColorPicker from '../components/shade/ColorPicker';
import Likeshade from './Likeshade';

function ShadeandTint() {
    const [selectedColor, setSelectedColor] = useState('#3B82F6');
    const [likedShades, setLikedShades] = useState([]); 

    useEffect(() => {
        const storedShades = JSON.parse(localStorage.getItem('likedShades')) || [];
        setLikedShades(Array.isArray(storedShades) ? storedShades : []);
    }, []);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleLike = (shade) => {
        setLikedShades((prevLikedShades) => {
            const updatedShades = [...prevLikedShades, shade];
            localStorage.setItem('likedShades', JSON.stringify(updatedShades));
            return updatedShades;
        });
    };

    return (
        <div className="min-h-screen dark:from-gray-900 dark:to-gray-800">
            {/* Custom styles for fonts */}
            <style>
                {`
                    @import url("https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700;800;900&display=swap");
                    .font-raleway {
                        font-family: 'Raleway', sans-serif;
                    }
                `}
            </style>
            
            {/* Header */}
            <div className="text-center mb-8 pt-8">
                <h1 className="text-5xl md:text-6xl font-bold mb-6 font-raleway bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
                    Shade & Tint Generator
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Generate beautiful shades and tints from any color. Perfect for creating harmonious color palettes.
                </p>
            </div>
            
            <ColorPicker onColorSelect={handleColorSelect} />
            <ColorPalette color={selectedColor} onLike={handleLike} />
            
            {/* Liked Shades Section */}
            {likedShades.length > 0 && (
                <div className="max-w-6xl mx-auto px-4 pb-12">
                    <Likeshade onLike={handleLike} />
                </div>
            )}
        </div>
    );
}

export default ShadeandTint;
