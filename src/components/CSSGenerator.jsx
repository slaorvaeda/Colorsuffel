import React, { useState, useEffect } from 'react';
import { FaCopy, FaCheck, FaCode, FaDownload, FaEye } from 'react-icons/fa';
import tinycolor from 'tinycolor2';

const CSSGenerator = () => {
  const [colors, setColors] = useState([
    { name: 'primary', hex: '#3B82F6', description: 'Primary brand color' },
    { name: 'secondary', hex: '#8B5CF6', description: 'Secondary brand color' },
    { name: 'accent', hex: '#10B981', description: 'Accent color' },
    { name: 'warning', hex: '#F59E0B', description: 'Warning color' },
    { name: 'error', hex: '#EF4444', description: 'Error color' }
  ]);
  const [selectedFramework, setSelectedFramework] = useState('css');
  const [copiedCode, setCopiedCode] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const frameworks = [
    { id: 'css', name: 'CSS Variables', icon: '🎨', description: 'CSS Custom Properties' },
    { id: 'scss', name: 'SCSS Variables', icon: '💎', description: 'Sass/SCSS Variables' },
    { id: 'tailwind', name: 'Tailwind CSS', icon: '🌊', description: 'Tailwind CSS Config' },
    { id: 'styled-components', name: 'Styled Components', icon: '⚛️', description: 'React Styled Components' },
    { id: 'css-in-js', name: 'CSS-in-JS', icon: '📦', description: 'JavaScript Object Style' },
    { id: 'bootstrap', name: 'Bootstrap', icon: '🎯', description: 'Bootstrap CSS Variables' }
  ];

  const generateCode = () => {
    switch (selectedFramework) {
      case 'css':
        return generateCSSVariables();
      case 'scss':
        return generateSCSSVariables();
      case 'tailwind':
        return generateTailwindConfig();
      case 'styled-components':
        return generateStyledComponents();
      case 'css-in-js':
        return generateCSSInJS();
      case 'bootstrap':
        return generateBootstrapVariables();
      default:
        return '';
    }
  };

  const generateCSSVariables = () => {
    let code = ':root {\n';
    colors.forEach(color => {
      const rgb = tinycolor(color.hex).toRgb();
      code += `  --color-${color.name}: ${color.hex};\n`;
      code += `  --color-${color.name}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};\n`;
    });
    code += '}\n\n';
    code += '/* Usage Examples */\n';
    colors.forEach(color => {
      code += `.btn-${color.name} {\n`;
      code += `  background-color: var(--color-${color.name});\n`;
      code += `  color: white;\n`;
      code += `  padding: 0.5rem 1rem;\n`;
      code += `  border-radius: 0.375rem;\n`;
      code += `}\n\n`;
    });
    return code;
  };

  const generateSCSSVariables = () => {
    let code = '// Color Variables\n';
    colors.forEach(color => {
      const rgb = tinycolor(color.hex).toRgb();
      code += `$${color.name}: ${color.hex};\n`;
      code += `$${color.name}-rgb: ${rgb.r}, ${rgb.g}, ${rgb.b};\n`;
    });
    code += '\n// Mixins\n';
    code += '@mixin button-variant($color) {\n';
    code += '  background-color: $color;\n';
    code += '  color: white;\n';
    code += '  padding: 0.5rem 1rem;\n';
    code += '  border-radius: 0.375rem;\n';
    code += '  &:hover {\n';
    code += '    background-color: darken($color, 10%);\n';
    code += '  }\n';
    code += '}\n\n';
    code += '// Usage Examples\n';
    colors.forEach(color => {
      code += `.btn-${color.name} {\n`;
      code += `  @include button-variant($${color.name});\n`;
      code += `}\n\n`;
    });
    return code;
  };

  const generateTailwindConfig = () => {
    let code = 'module.exports = {\n';
    code += '  theme: {\n';
    code += '    extend: {\n';
    code += '      colors: {\n';
    colors.forEach(color => {
      const rgb = tinycolor(color.hex).toRgb();
      code += `        '${color.name}': {\n`;
      code += `          DEFAULT: '${color.hex}',\n`;
      code += `          50: '${tinycolor(color.hex).lighten(50).toHexString()}',\n`;
      code += `          100: '${tinycolor(color.hex).lighten(40).toHexString()}',\n`;
      code += `          200: '${tinycolor(color.hex).lighten(30).toHexString()}',\n`;
      code += `          300: '${tinycolor(color.hex).lighten(20).toHexString()}',\n`;
      code += `          400: '${tinycolor(color.hex).lighten(10).toHexString()}',\n`;
      code += `          500: '${color.hex}',\n`;
      code += `          600: '${tinycolor(color.hex).darken(10).toHexString()}',\n`;
      code += `          700: '${tinycolor(color.hex).darken(20).toHexString()}',\n`;
      code += `          800: '${tinycolor(color.hex).darken(30).toHexString()}',\n`;
      code += `          900: '${tinycolor(color.hex).darken(40).toHexString()}',\n`;
      code += `        },\n`;
    });
    code += '      }\n';
    code += '    }\n';
    code += '  }\n';
    code += '}\n';
    return code;
  };

  const generateStyledComponents = () => {
    let code = 'import styled from \'styled-components\';\n\n';
    code += '// Color Constants\n';
    code += 'export const colors = {\n';
    colors.forEach(color => {
      code += `  ${color.name}: '${color.hex}',\n`;
    });
    code += '};\n\n';
    code += '// Styled Components\n';
    colors.forEach(color => {
      code += `export const ${color.name.charAt(0).toUpperCase() + color.name.slice(1)}Button = styled.button\`\n`;
      code += `  background-color: \${colors.${color.name}};\n`;
      code += `  color: white;\n`;
      code += `  padding: 0.5rem 1rem;\n`;
      code += `  border-radius: 0.375rem;\n`;
      code += `  border: none;\n`;
      code += `  cursor: pointer;\n`;
      code += `  transition: background-color 0.2s;\n`;
      code += `  &:hover {\n`;
      code += `    background-color: \${props => tinycolor(colors.${color.name}).darken(10).toHexString()};\n`;
      code += `  }\n`;
      code += `\`;\n\n`;
    });
    return code;
  };

  const generateCSSInJS = () => {
    let code = '// Color Constants\n';
    code += 'export const colors = {\n';
    colors.forEach(color => {
      code += `  ${color.name}: '${color.hex}',\n`;
    });
    code += '};\n\n';
    code += '// Component Styles\n';
    code += 'export const buttonStyles = {\n';
    colors.forEach(color => {
      code += `  ${color.name}: {\n`;
      code += `    backgroundColor: colors.${color.name},\n`;
      code += `    color: 'white',\n`;
      code += `    padding: '0.5rem 1rem',\n`;
      code += `    borderRadius: '0.375rem',\n`;
      code += `    border: 'none',\n`;
      code += `    cursor: 'pointer',\n`;
      code += `    transition: 'background-color 0.2s',\n`;
      code += `    '&:hover': {\n`;
      code += `      backgroundColor: '${tinycolor(color.hex).darken(10).toHexString()}',\n`;
      code += `    },\n`;
      code += `  },\n`;
    });
    code += '};\n';
    return code;
  };

  const generateBootstrapVariables = () => {
    let code = ':root {\n';
    colors.forEach(color => {
      code += `  --bs-${color.name}: ${color.hex};\n`;
    });
    code += '}\n\n';
    code += '/* Custom Bootstrap Classes */\n';
    colors.forEach(color => {
      code += `.btn-${color.name} {\n`;
      code += `  --bs-btn-bg: var(--bs-${color.name});\n`;
      code += `  --bs-btn-border-color: var(--bs-${color.name});\n`;
      code += `  --bs-btn-hover-bg: ${tinycolor(color.hex).darken(10).toHexString()};\n`;
      code += `  --bs-btn-hover-border-color: ${tinycolor(color.hex).darken(10).toHexString()};\n`;
      code += `}\n\n`;
    });
    return code;
  };

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadCode = () => {
    const code = generateCode();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `colors.${selectedFramework === 'scss' ? 'scss' : 'css'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addColor = () => {
    const newColor = {
      name: `color${colors.length + 1}`,
      hex: '#' + Math.floor(Math.random()*16777215).toString(16),
      description: 'New color'
    };
    setColors(prev => [...prev, newColor]);
  };

  const removeColor = (index) => {
    setColors(prev => prev.filter((_, i) => i !== index));
  };

  const updateColor = (index, field, value) => {
    setColors(prev => prev.map((color, i) => 
      i === index ? { ...color, [field]: value } : color
    ));
  };

  const generatedCode = generateCode();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          CSS/SCSS Generator
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Generate color variables and code snippets for your favorite CSS frameworks
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Framework Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Framework</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {frameworks.map((framework) => (
                <button
                  key={framework.id}
                  onClick={() => setSelectedFramework(framework.id)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedFramework === framework.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{framework.icon}</span>
                    <div>
                      <div className="font-semibold text-sm">{framework.name}</div>
                      <div className="text-xs text-gray-500">{framework.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color Management */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Colors</h3>
              <button
                onClick={addColor}
                className="px-3 py-1 bg-indigo-500 text-white rounded-lg text-sm hover:bg-indigo-600 transition-colors"
              >
                Add Color
              </button>
            </div>
            
            <div className="space-y-4">
              {colors.map((color, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => updateColor(index, 'hex', e.target.value)}
                      className="w-12 h-10 rounded-lg border-2 border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => updateColor(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Color name"
                    />
                    <button
                      onClick={() => removeColor(index)}
                      className="px-2 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                      title="Remove color"
                    >
                      ×
                    </button>
                  </div>
                  <input
                    type="text"
                    value={color.description}
                    onChange={(e) => updateColor(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="Color description"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Code Output */}
        <div className="space-y-6">
          {/* Code Display */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Generated Code</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors flex items-center gap-1"
                >
                  <FaEye />
                  Preview
                </button>
                <button
                  onClick={() => copyToClipboard(generatedCode, 'code')}
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm transition-colors flex items-center gap-1"
                >
                  {copiedCode === 'code' ? <FaCheck /> : <FaCopy />}
                  Copy
                </button>
                <button
                  onClick={downloadCode}
                  className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm transition-colors flex items-center gap-1"
                >
                  <FaDownload />
                  Download
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
                <code>{generatedCode}</code>
              </pre>
            </div>
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Live Preview</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg text-center"
                      style={{ backgroundColor: color.hex }}
                    >
                      <div className="text-white font-semibold mb-1">{color.name}</div>
                      <div className="text-white/80 text-sm">{color.hex}</div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-800">Button Examples</h4>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color, index) => (
                      <button
                        key={index}
                        className="px-4 py-2 rounded-lg text-white font-medium transition-colors"
                        style={{ backgroundColor: color.hex }}
                      >
                        {color.name} Button
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Code Generation Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
          <ul className="space-y-2">
            <li>• <strong>CSS Variables:</strong> Perfect for modern web applications</li>
            <li>• <strong>SCSS Variables:</strong> Great for complex styling systems</li>
            <li>• <strong>Tailwind Config:</strong> Extends your Tailwind color palette</li>
          </ul>
          <ul className="space-y-2">
            <li>• <strong>Styled Components:</strong> Ideal for React applications</li>
            <li>• <strong>CSS-in-JS:</strong> Works with emotion, styled-jsx, and more</li>
            <li>• <strong>Bootstrap:</strong> Customize Bootstrap's color system</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CSSGenerator; 