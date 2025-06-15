import React, { useState, useEffect } from 'react';
import ColorPalette from '../components/shade/ColorPalette';
import ColorPicker from '../components/shade/ColorPicker';
import Likeshade from './Likeshade';

function ShadeandTint() {
    const [selectedColor, setSelectedColor] = useState('#00FF00');
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
        <>
            <ColorPicker onColorSelect={handleColorSelect} />
            <ColorPalette color={selectedColor} onLike={handleLike} />
            
        </>
    );
}

export default ShadeandTint;
