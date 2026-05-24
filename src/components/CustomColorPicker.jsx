import React, { useState, useRef, useEffect, useCallback } from 'react';

const CustomColorPicker = ({ color, onChange, onClose }) => {
    const [hue, setHue] = useState(0);
    const [saturation, setSaturation] = useState(100);
    const [lightness, setLightness] = useState(50);
    const [isOpen, setIsOpen] = useState(false);
    const [internalColor, setInternalColor] = useState(color);
    const pickerRef = useRef(null);
    const isUpdatingRef = useRef(false);

    // Convert hex to HSL
    const hexToHsl = useCallback((hex) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
                default: h = 0;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }, []);

    // Convert HSL to hex
    const hslToHex = useCallback((h, s, l) => {
        h /= 360;
        s /= 100;
        l /= 100;

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        const toHex = (c) => {
            const hex = Math.round(c * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }, []);

    // Initialize HSL values from hex color when prop changes
    useEffect(() => {
        if (color && color !== internalColor) {
            const hsl = hexToHsl(color);
            setHue(hsl.h);
            setSaturation(hsl.s);
            setLightness(hsl.l);
            setInternalColor(color);
        }
    }, [color, internalColor, hexToHsl]);

    // Update hex color when HSL changes (only when user interacts)
    useEffect(() => {
        if (!isUpdatingRef.current) {
            const hex = hslToHex(hue, saturation, lightness);
            if (hex !== internalColor) {
                setInternalColor(hex);
                onChange(hex);
            }
        }
    }, [hue, saturation, lightness, internalColor, onChange, hslToHex]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
                onClose && onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const handleSaturationClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const s = Math.round((x / rect.width) * 100);
        const l = Math.round(((rect.height - y) / rect.height) * 100);
        setSaturation(Math.max(0, Math.min(100, s)));
        setLightness(Math.max(0, Math.min(100, l)));
    };

    const handleHueChange = (e) => {
        const value = parseInt(e.target.value);
        setHue(value);
    };

    const handleHexChange = (e) => {
        const hex = e.target.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            isUpdatingRef.current = true;
            setInternalColor(hex);
            onChange(hex);
            const hsl = hexToHsl(hex);
            setHue(hsl.h);
            setSaturation(hsl.s);
            setLightness(hsl.l);
            isUpdatingRef.current = false;
        }
    };

    const presetColors = [
        '#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', '#00ff80',
        '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff0080',
        '#ffffff', '#cccccc', '#999999', '#666666', '#333333', '#000000'
    ];

    return (
        <div className="relative" ref={pickerRef}>
            {/* Color Preview Button */}
            <div
                className="w-12 h-12 rounded-xl border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors shadow-md"
                style={{ backgroundColor: internalColor }}
                onClick={() => setIsOpen(!isOpen)}
            />

            {/* Color Picker Popup */}
            {isOpen && (
                <div className="absolute top-14 left-0 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 min-w-64">
                    {/* Saturation/Lightness Picker */}
                    <div className="mb-4">
                        <div
                            className="w-full h-32 rounded-lg cursor-crosshair relative"
                            style={{
                                background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`
                            }}
                            onClick={handleSaturationClick}
                        >
                            {/* Saturation/Lightness Cursor */}
                            <div
                                className="absolute w-3 h-3 border-2 border-white rounded-full shadow-lg transform -translate-x-1.5 -translate-y-1.5"
                                style={{
                                    left: `${saturation}%`,
                                    top: `${100 - lightness}%`
                                }}
                            />
                        </div>
                    </div>

                    {/* Hue Slider */}
                    <div className="mb-4">
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={hue}
                            onChange={handleHueChange}
                            className="w-full h-8 rounded-lg cursor-pointer"
                            style={{
                                background: `linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)`
                            }}
                        />
                    </div>

                    {/* Color Values */}
                    <div className="mb-4 grid grid-cols-3 gap-2 text-sm">
                        <div>
                            <label className="block text-gray-600 mb-1">H</label>
                            <input
                                type="number"
                                min="0"
                                max="360"
                                value={hue}
                                onChange={(e) => setHue(parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">S</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={saturation}
                                onChange={(e) => setSaturation(parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-1">L</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={lightness}
                                onChange={(e) => setLightness(parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                            />
                        </div>
                    </div>

                    {/* Hex Input */}
                    <div className="mb-4">
                        <label className="block text-gray-600 mb-1">HEX</label>
                        <input
                            type="text"
                            value={internalColor}
                            onChange={handleHexChange}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-center font-mono"
                            placeholder="#000000"
                        />
                    </div>

                    {/* Preset Colors */}
                    <div>
                        <label className="block text-gray-600 mb-2">Presets</label>
                        <div className="grid grid-cols-6 gap-1">
                            {presetColors.map((presetColor) => (
                                <button
                                    key={presetColor}
                                    className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: presetColor }}
                                    onClick={() => {
                                        onChange(presetColor);
                                        setIsOpen(false);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomColorPicker; 