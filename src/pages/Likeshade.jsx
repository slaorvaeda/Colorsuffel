import React, { useEffect, useState } from 'react';
import { MdDeleteOutline } from "react-icons/md";
import tinycolor from 'tinycolor2';

function Likeshade({ onLike }) {
    const [likedShades, setLikedShades] = useState([]);

    useEffect(() => {
        const storedShades = JSON.parse(localStorage.getItem('likedShades')) || [];
        const uniqueShades = [...new Set(storedShades)];
        setLikedShades(uniqueShades);
        localStorage.setItem('likedShades', JSON.stringify(uniqueShades));
    }, []);

    const handleDelete = (shadeToDelete) => {
        const updatedShades = likedShades.filter(shade => shade !== shadeToDelete);
        setLikedShades(updatedShades);
        localStorage.setItem('likedShades', JSON.stringify(updatedShades));
    };

    const copyToClipboard = (color) => {
        navigator.clipboard.writeText(color).then(() => {
            console.log(`${color} copied to clipboard`);
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                Your Favorite Colors
            </h2>
            
            {likedShades.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        No favorite colors yet. Click the heart icon on any color to add it here!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {likedShades.map((shade, index) => {
                        const isDark = tinycolor(shade).isDark();
                        return (
                            <div 
                                key={index} 
                                className="group relative bg-white dark:bg-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                                onClick={() => copyToClipboard(shade)}
                                title={`Click to copy ${shade}`}
                            >
                                {/* Color Swatch */}
                                <div 
                                    className="h-24 relative"
                                    style={{ backgroundColor: shade }}
                                >
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Color Information */}
                                <div className="p-3">
                                    <p className={`text-xs font-mono font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {shade}
                                    </p>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between mt-2">
                                        <button
                                            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                copyToClipboard(shade);
                                            }}
                                        >
                                            Copy
                                        </button>
                                        
                                        <button
                                            className="text-red-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(shade);
                                            }}
                                            title="Remove from favorites"
                                        >
                                            <MdDeleteOutline className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Likeshade;
