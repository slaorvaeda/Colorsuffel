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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
