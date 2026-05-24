import React, { useState } from 'react';

const GradientCopySection = ({ ...props }) => {
    const { colors, degree, gradientType } = props;

    const [copiedFormat, setCopiedFormat] = useState(null);
    const [selectedFormat, setSelectedFormat] = useState('css-background');

    const copyToClipboard = async (text, format) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedFormat(format);
            setTimeout(() => setCopiedFormat(null), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const getGradientCSS = () => {
        return gradientType === 'linear'
            ? `linear-gradient(${degree}deg, ${colors.join(', ')})`
            : `radial-gradient(circle, ${colors.join(', ')})`;
    };

    const getGradientBackground = () => {
        return `background: ${getGradientCSS()};`;
    };

    const getGradientBackgroundImage = () => {
        return `background-image: ${getGradientCSS()};`;
    };

    const getGradientTailwind = () => {
        // Map degree to Tailwind gradient directions
        const getTailwindDirection = (deg) => {
            if (deg >= 0 && deg <= 22.5) return 'to-t';
            if (deg > 22.5 && deg <= 67.5) return 'to-tr';
            if (deg > 67.5 && deg <= 112.5) return 'to-r';
            if (deg > 112.5 && deg <= 157.5) return 'to-br';
            if (deg > 157.5 && deg <= 202.5) return 'to-b';
            if (deg > 202.5 && deg <= 247.5) return 'to-bl';
            if (deg > 247.5 && deg <= 292.5) return 'to-l';
            if (deg > 292.5 && deg <= 337.5) return 'to-tl';
            if (deg > 337.5 && deg <= 360) return 'to-t';
            return 'to-r'; // default
        };

        const direction = gradientType === 'linear' ? getTailwindDirection(degree) : 'from-center';
        
        if (colors.length === 2) {
            // Simple 2-color gradient
            return `bg-gradient-${direction} from-[${colors[0]}] to-[${colors[1]}]`;
        } else if (colors.length === 3) {
            // 3-color gradient with via
            return `bg-gradient-${direction} from-[${colors[0]}] via-[${colors[1]}] to-[${colors[2]}]`;
        } else if (colors.length === 4) {
            // 4-color gradient with multiple via stops
            return `bg-gradient-${direction} from-[${colors[0]}] via-[${colors[1]}] via-[${colors[2]}] to-[${colors[3]}]`;
        } else if (colors.length === 5) {
            // 5-color gradient with multiple via stops
            return `bg-gradient-${direction} from-[${colors[0]}] via-[${colors[1]}] via-[${colors[2]}] via-[${colors[3]}] to-[${colors[4]}]`;
        } else if (colors.length === 6) {
            // 6-color gradient with multiple via stops
            return `bg-gradient-${direction} from-[${colors[0]}] via-[${colors[1]}] via-[${colors[2]}] via-[${colors[3]}] via-[${colors[4]}] to-[${colors[5]}]`;
        } else {
            // More than 6 colors - provide both Tailwind class and custom CSS
            const gradientFunction = gradientType === 'linear' 
                ? `linear-gradient(${degree}deg, ${colors.join(', ')})`
                : `radial-gradient(circle, ${colors.join(', ')})`;
            
            return `bg-gradient-${direction} from-[${colors[0]}] to-[${colors[colors.length - 1]}]`;
        }
    };

    const getTailwindCustomCSS = () => {
        if (colors.length <= 6) return null;
        
        const gradientFunction = gradientType === 'linear' 
            ? `linear-gradient(${degree}deg, ${colors.join(', ')})`
            : `radial-gradient(circle, ${colors.join(', ')})`;
        
        return `/* Custom CSS for ${colors.length} colors */
.custom-gradient {
    background: ${gradientFunction};
}

/* Or use with Tailwind class */
.bg-gradient-${gradientType === 'linear' ? getGradientTailwind().split(' ')[1] : 'from-center'} {
    background: ${gradientFunction} !important;
}`;
    };

    const formatOptions = [
        { value: 'css-background', label: 'CSS Background', color: 'blue', colorIntensity: '500', customColor: '#3B82F6', getCode: getGradientBackground },
        { value: 'css-background-image', label: 'CSS Background Image', color: 'green', colorIntensity: '500', customColor: '#10B981', getCode: getGradientBackgroundImage },
        { value: 'gradient-function', label: 'Gradient Function', color: 'red', colorIntensity: '500', customColor: '#EF4444', getCode: getGradientCSS },
        { 
            value: 'tailwind', 
            label: 'Tailwind CSS', 
            color: 'purple', 
            colorIntensity: '600',
            customColor: '#8B5CF6',
            getCode: () => {
                const tailwindClass = getGradientTailwind();
                const customCSS = getTailwindCustomCSS();
                
                if (customCSS) {
                    return `${tailwindClass}\n\n${customCSS}\n\n/* Usage: */\n<div class="custom-gradient">Content</div>\n<!-- or -->\n<div class="${tailwindClass.split(' ')[0]} ${tailwindClass.split(' ')[1]}">Content</div>`;
                }
                return tailwindClass;
            }
        }
    ];

    const getCurrentCode = () => {
        const option = formatOptions.find(opt => opt.value === selectedFormat);
        const code = option ? option.getCode() : getGradientBackground();
        console.log(`Format: ${selectedFormat}, Code:`, code); // Debug log
        return code;
    };

    const getCurrentColor = () => {
        const option = formatOptions.find(opt => opt.value === selectedFormat);
        return option ? option.color : 'blue';
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Copy Gradient Code</h2>
                <p className="text-gray-600">Select a format and copy the code</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                {/* 4 Selector Buttons */}
                <div className="grid grid-cols-4 border-b border-gray-200">
                    {formatOptions.map((option) => (
                        <button
                            key={option.value}
                            className={`px-4 py-4 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                                selectedFormat === option.value
                                    ? `bg-${option.color}-${option.colorIntensity} text-white`
                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                            onClick={() => setSelectedFormat(option.value)}
                        >
                            <div 
                                className={`w-3 h-3 rounded-full ${
                                    selectedFormat === option.value ? 'bg-gray-200' : ''
                                }`}
                                style={{
                                    backgroundColor: selectedFormat === option.value ? '#E5E7EB' : option.customColor
                                }}
                            ></div>
                            {option.label}
                        </button>
                    ))}
                </div>
                
                {/* Code Display with Copy Icon */}
                <div className="p-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700">
                                {formatOptions.find(opt => opt.value === selectedFormat)?.label}
                            </span>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span className="text-xs text-gray-500">Ready to copy</span>
                            </div>
                        </div>
                        <div className="relative bg-white rounded-lg p-4 border border-gray-200 min-h-[80px]">
                            <code className="text-sm font-mono text-gray-800 break-all pr-12 whitespace-pre-wrap leading-relaxed">
                                {getCurrentCode()}
                            </code>
                            {/* Copy Button Inside Code Box */}
                            <button
                                className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 ${
                                    copiedFormat === selectedFormat
                                        ? 'bg-green-500 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                }`}
                                onClick={() => copyToClipboard(getCurrentCode(), selectedFormat)}
                                title="Copy code"
                            >
                                {copiedFormat === selectedFormat ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradientCopySection; 