import React, { useState } from 'react';
import { FaArrowLeft, FaPalette, FaFont, FaRuler, FaLightbulb, FaEye, FaCopy, FaCheck, FaDownload } from 'react-icons/fa';

const UIDesignGuide = () => {
  const [copiedColor, setCopiedColor] = useState(null);
  const [activeSection, setActiveSection] = useState('typography');

  const copyToClipboard = async (color) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedColor(color);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadDesignTokens = () => {
    const css = `/* UI Design System Tokens */

/* Typography Scale */
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 3.75rem;   /* 60px */
  
  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Spacing Scale */
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  
  /* Border Radius */
  --radius-sm: 0.125rem; /* 2px */
  --radius-md: 0.375rem; /* 6px */
  --radius-lg: 0.5rem;   /* 8px */
  --radius-xl: 0.75rem;  /* 12px */
  --radius-2xl: 1rem;    /* 16px */
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  
  /* Colors - Primary Palette */
  --primary-50: #eff6ff;
  --primary-100: #dbeafe;
  --primary-200: #bfdbfe;
  --primary-300: #93c5fd;
  --primary-400: #60a5fa;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  --primary-700: #1d4ed8;
  --primary-800: #1e40af;
  --primary-900: #1e3a8a;
  
  /* Colors - Neutral Palette */
  --neutral-50: #f9fafb;
  --neutral-100: #f3f4f6;
  --neutral-200: #e5e7eb;
  --neutral-300: #d1d5db;
  --neutral-400: #9ca3af;
  --neutral-500: #6b7280;
  --neutral-600: #4b5563;
  --neutral-700: #374151;
  --neutral-800: #1f2937;
  --neutral-900: #111827;
  
  /* Colors - Semantic */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  --success-600: #16a34a;
  
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  
  --error-50: #fef2f2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  
  /* Z-Index Scale */
  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}

/* Typography Classes */
.text-xs { font-size: var(--text-xs); }
.text-sm { font-size: var(--text-sm); }
.text-base { font-size: var(--text-base); }
.text-lg { font-size: var(--text-lg); }
.text-xl { font-size: var(--text-xl); }
.text-2xl { font-size: var(--text-2xl); }
.text-3xl { font-size: var(--text-3xl); }
.text-4xl { font-size: var(--text-4xl); }
.text-5xl { font-size: var(--text-5xl); }
.text-6xl { font-size: var(--text-6xl); }

.font-light { font-weight: var(--font-light); }
.font-normal { font-weight: var(--font-normal); }
.font-medium { font-weight: var(--font-medium); }
.font-semibold { font-weight: var(--font-semibold); }
.font-bold { font-weight: var(--font-bold); }
.font-extrabold { font-weight: var(--font-extrabold); }

.leading-tight { line-height: var(--leading-tight); }
.leading-normal { line-height: var(--leading-normal); }
.leading-relaxed { line-height: var(--leading-relaxed); }

/* Spacing Classes */
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); }
.p-4 { padding: var(--space-4); }
.p-5 { padding: var(--space-5); }
.p-6 { padding: var(--space-6); }
.p-8 { padding: var(--space-8); }
.p-10 { padding: var(--space-10); }
.p-12 { padding: var(--space-12); }
.p-16 { padding: var(--space-16); }
.p-20 { padding: var(--space-20); }

.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-3 { margin: var(--space-3); }
.m-4 { margin: var(--space-4); }
.m-5 { margin: var(--space-5); }
.m-6 { margin: var(--space-6); }
.m-8 { margin: var(--space-8); }
.m-10 { margin: var(--space-10); }
.m-12 { margin: var(--space-12); }
.m-16 { margin: var(--space-16); }
.m-20 { margin: var(--space-20); }

/* Border Radius Classes */
.rounded-sm { border-radius: var(--radius-sm); }
.rounded-md { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }
.rounded-xl { border-radius: var(--radius-xl); }
.rounded-2xl { border-radius: var(--radius-2xl); }
.rounded-full { border-radius: var(--radius-full); }

/* Shadow Classes */
.shadow-sm { box-shadow: var(--shadow-sm); }
.shadow-md { box-shadow: var(--shadow-md); }
.shadow-lg { box-shadow: var(--shadow-lg); }
.shadow-xl { box-shadow: var(--shadow-xl); }

/* Color Classes */
.text-primary-500 { color: var(--primary-500); }
.text-neutral-500 { color: var(--neutral-500); }
.text-success-500 { color: var(--success-500); }
.text-warning-500 { color: var(--warning-500); }
.text-error-500 { color: var(--error-500); }

.bg-primary-500 { background-color: var(--primary-500); }
.bg-neutral-500 { background-color: var(--neutral-500); }
.bg-success-500 { background-color: var(--success-500); }
.bg-warning-500 { background-color: var(--warning-500); }
.bg-error-500 { background-color: var(--error-500); }`;

    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ui-design-tokens.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sections = [
    { id: 'hero-section', name: 'Hero Section', icon: FaFont },
    { id: 'typography', name: 'Typography', icon: FaFont },
    { id: 'colors', name: 'Colors', icon: FaPalette },
    { id: 'spacing', name: 'Spacing', icon: FaRuler },
    { id: 'components', name: 'Components', icon: FaLightbulb },
    { id: 'principles', name: 'Design Thinking', icon: FaLightbulb }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <FaArrowLeft className="text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">UI/UX Design Guide</h1>
            </div>
            <button
              onClick={downloadDesignTokens}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaDownload />
              Download CSS
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon />
                {section.name}
              </button>
            );
          })}
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Hero Section Guide */}
          {activeSection === 'hero-section' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaFont className="text-blue-600" />
                Hero Section Design Guide
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Decision Framework */}
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🎯 Design Decision Framework</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">1. Purpose & Message</h4>
                      <p className="text-sm text-blue-800">What's the main message? What action do you want users to take?</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">2. Visual Hierarchy</h4>
                      <p className="text-sm text-green-800">What's most important? Headline → Subtitle → CTA → Supporting text</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">3. User Journey</h4>
                      <p className="text-sm text-purple-800">Where does this lead? What's the next step?</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">4. Brand Consistency</h4>
                      <p className="text-sm text-orange-800">Does this match your brand voice and visual identity?</p>
                    </div>
                  </div>
                </div>

                {/* Typography Decisions */}
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">📝 Typography Decisions</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-800 mb-1">Main Headline</h4>
                      <p className="text-sm text-gray-600 mb-2">Use <code className="bg-gray-100 px-1 rounded">text-5xl</code> or <code className="bg-gray-100 px-1 rounded">text-6xl</code></p>
                      <p className="text-xs text-gray-500">Why? Creates immediate impact and establishes hierarchy</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-gray-800 mb-1">Subtitle/Description</h4>
                      <p className="text-sm text-gray-600 mb-2">Use <code className="bg-gray-100 px-1 rounded">text-xl</code> or <code className="bg-gray-100 px-1 rounded">text-2xl</code></p>
                      <p className="text-xs text-gray-500">Why? Provides context without competing with headline</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-gray-800 mb-1">Call-to-Action</h4>
                      <p className="text-sm text-gray-600 mb-2">Use <code className="bg-gray-100 px-1 rounded">text-lg</code> or <code className="bg-gray-100 px-1 rounded">text-xl</code></p>
                      <p className="text-xs text-gray-500">Why? Large enough to be clickable, not overwhelming</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Hero Examples */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">🎨 Hero Section Examples</h3>
                
                {/* Example 1: Bold & Impactful */}
                <div className="mb-8 p-8 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl text-white">
                  <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-6xl font-bold mb-6 leading-tight">
                      Transform Your Design
                    </h1>
                    <p className="text-2xl mb-8 opacity-90 leading-relaxed">
                      Create stunning color palettes that bring your vision to life with our advanced design tools
                    </p>
                    <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-xl hover:bg-gray-100 transition-colors">
                      Get Started Today
                    </button>
                  </div>
                  <div className="mt-6 p-4 bg-white/10 rounded-lg">
                    <p className="text-sm opacity-80">
                      <strong>Design Decisions:</strong> Large headline (text-6xl) for impact, contrasting CTA button, gradient background for visual interest
                    </p>
                  </div>
                </div>

                {/* Example 2: Clean & Minimal */}
                <div className="mb-8 p-8 bg-gray-50 rounded-2xl">
                  <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-6 text-gray-900 leading-tight">
                      Simple. Powerful. Effective.
                    </h1>
                    <p className="text-xl mb-8 text-gray-600 leading-relaxed">
                      Streamlined tools for modern designers who value clarity and precision
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Start Free Trial
                      </button>
                      <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        Learn More
                      </button>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Design Decisions:</strong> Medium headline (text-5xl) for approachability, dual CTAs for different user intents, clean background for focus
                    </p>
                  </div>
                </div>
              </div>

              {/* Color & Contrast Guidelines */}
              <div className="p-6 bg-blue-50 rounded-xl">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">🎨 Color & Contrast Guidelines</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-blue-800 mb-2">High Impact Hero</h5>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Use <strong>text-6xl</strong> for maximum impact</li>
                      <li>• High contrast colors (dark text on light or vice versa)</li>
                      <li>• Bold, attention-grabbing CTA button</li>
                      <li>• Consider gradient backgrounds for visual interest</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-800 mb-2">Clean & Professional</h5>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Use <strong>text-5xl</strong> for balanced approach</li>
                      <li>• Subtle color palette with good contrast</li>
                      <li>• Multiple CTA options for different user paths</li>
                      <li>• White/light backgrounds for clarity</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typography Section */}
          {activeSection === 'typography' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaFont className="text-blue-600" />
                Typography System
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Font Sizes */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Font Sizes</h3>
                  <div className="space-y-4">
                    {[
                      { size: 'text-6xl', label: '6xl (60px)', class: 'text-6xl' },
                      { size: 'text-5xl', label: '5xl (48px)', class: 'text-5xl' },
                      { size: 'text-4xl', label: '4xl (36px)', class: 'text-4xl' },
                      { size: 'text-3xl', label: '3xl (30px)', class: 'text-3xl' },
                      { size: 'text-2xl', label: '2xl (24px)', class: 'text-2xl' },
                      { size: 'text-xl', label: 'xl (20px)', class: 'text-xl' },
                      { size: 'text-lg', label: 'lg (18px)', class: 'text-lg' },
                      { size: 'text-base', label: 'base (16px)', class: 'text-base' },
                      { size: 'text-sm', label: 'sm (14px)', class: 'text-sm' },
                      { size: 'text-xs', label: 'xs (12px)', class: 'text-xs' }
                    ].map((item) => (
                      <div key={item.size} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className={`font-medium ${item.class}`}>{item.label}</span>
                        <code className="text-sm text-gray-500 bg-white px-2 py-1 rounded">{item.size}</code>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Font Weights */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Font Weights</h3>
                  <div className="space-y-4">
                    {[
                      { weight: 'font-light', label: 'Light (300)', class: 'font-light' },
                      { weight: 'font-normal', label: 'Normal (400)', class: 'font-normal' },
                      { weight: 'font-medium', label: 'Medium (500)', class: 'font-medium' },
                      { weight: 'font-semibold', label: 'Semibold (600)', class: 'font-semibold' },
                      { weight: 'font-bold', label: 'Bold (700)', class: 'font-bold' },
                      { weight: 'font-extrabold', label: 'Extrabold (800)', class: 'font-extrabold' }
                    ].map((item) => (
                      <div key={item.weight} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className={`text-lg ${item.class}`}>{item.label}</span>
                        <code className="text-sm text-gray-500 bg-white px-2 py-1 rounded">{item.weight}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Usage Guidelines */}
              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Typography Guidelines</h4>
                <ul className="space-y-2 text-blue-800">
                  <li>• Use <strong>text-6xl</strong> for hero headlines and main page titles</li>
                  <li>• Use <strong>text-4xl</strong> for section headings and important titles</li>
                  <li>• Use <strong>text-2xl</strong> for subsection headings</li>
                  <li>• Use <strong>text-lg</strong> for emphasized body text</li>
                  <li>• Use <strong>text-base</strong> for regular body text</li>
                  <li>• Use <strong>text-sm</strong> for captions and secondary information</li>
                  <li>• Use <strong>text-xs</strong> for labels and fine print</li>
                </ul>
              </div>
            </div>
          )}

          {/* Colors Section */}
          {activeSection === 'colors' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaPalette className="text-blue-600" />
                Color System
              </h2>

              {/* Primary Colors */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Primary Color Palette</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  {[
                    { name: '50', color: '#eff6ff', text: 'text-gray-900' },
                    { name: '100', color: '#dbeafe', text: 'text-gray-900' },
                    { name: '200', color: '#bfdbfe', text: 'text-gray-900' },
                    { name: '300', color: '#93c5fd', text: 'text-gray-900' },
                    { name: '400', color: '#60a5fa', text: 'text-white' },
                    { name: '500', color: '#3b82f6', text: 'text-white' },
                    { name: '600', color: '#2563eb', text: 'text-white' },
                    { name: '700', color: '#1d4ed8', text: 'text-white' },
                    { name: '800', color: '#1e40af', text: 'text-white' },
                    { name: '900', color: '#1e3a8a', text: 'text-white' }
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="relative group cursor-pointer"
                      onClick={() => copyToClipboard(item.color)}
                    >
                      <div
                        className="h-20 rounded-lg shadow-md flex items-center justify-center transition-transform hover:scale-105"
                        style={{ backgroundColor: item.color }}
                      >
                        <span className={`font-semibold ${item.text}`}>{item.name}</span>
                      </div>
                      <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-10 rounded-lg transition-all duration-200 flex items-center justify-center">
                        {copiedColor === item.color ? (
                          <FaCheck className="text-white text-lg opacity-0 group-hover:opacity-100" />
                        ) : (
                          <FaCopy className="text-white text-lg opacity-0 group-hover:opacity-100" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 text-center">{item.color}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semantic Colors */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Semantic Colors</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { name: 'Success', color: '#22c55e', bg: '#f0fdf4', description: 'Use for positive actions, confirmations, and success states' },
                    { name: 'Warning', color: '#f59e0b', bg: '#fffbeb', description: 'Use for warnings, alerts, and attention-grabbing elements' },
                    { name: 'Error', color: '#ef4444', bg: '#fef2f2', description: 'Use for errors, destructive actions, and critical alerts' }
                  ].map((item) => (
                    <div key={item.name} className="p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-8 h-8 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="mt-3 flex gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">{item.color}</code>
                        <button
                          onClick={() => copyToClipboard(item.color)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Usage Guidelines */}
              <div className="p-6 bg-blue-50 rounded-xl">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Color Usage Guidelines</h4>
                <ul className="space-y-2 text-blue-800">
                  <li>• <strong>Primary 500-600:</strong> Main buttons, links, and interactive elements</li>
                  <li>• <strong>Primary 700-900:</strong> Hover states and pressed states</li>
                  <li>• <strong>Primary 50-200:</strong> Backgrounds, borders, and subtle accents</li>
                  <li>• <strong>Neutral 500-700:</strong> Body text and secondary information</li>
                  <li>• <strong>Neutral 800-900:</strong> Headings and important text</li>
                  <li>• <strong>Success:</strong> Confirmation messages, completed actions</li>
                  <li>• <strong>Warning:</strong> Caution messages, pending states</li>
                  <li>• <strong>Error:</strong> Error messages, destructive actions</li>
                </ul>
              </div>
            </div>
          )}

          {/* Spacing Section */}
          {activeSection === 'spacing' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaRuler className="text-blue-600" />
                Spacing System
              </h2>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Spacing Scale */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Spacing Scale</h3>
                  <div className="space-y-4">
                    {[
                      { size: '1', px: '4px', class: 'space-1' },
                      { size: '2', px: '8px', class: 'space-2' },
                      { size: '3', px: '12px', class: 'space-3' },
                      { size: '4', px: '16px', class: 'space-4' },
                      { size: '5', px: '20px', class: 'space-5' },
                      { size: '6', px: '24px', class: 'space-6' },
                      { size: '8', px: '32px', class: 'space-8' },
                      { size: '10', px: '40px', class: 'space-10' },
                      { size: '12', px: '48px', class: 'space-12' },
                      { size: '16', px: '64px', class: 'space-16' },
                      { size: '20', px: '80px', class: 'space-20' }
                    ].map((item) => (
                      <div key={item.size} className="flex items-center gap-4">
                        <div className="flex-1">
                          <div
                            className="bg-blue-500 rounded"
                            style={{ height: '8px', width: `${item.px}` }}
                          />
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-800">space-{item.size}</div>
                          <div className="text-sm text-gray-500">{item.px}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Usage Examples */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Usage Examples</h3>
                  <div className="space-y-6">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Component Spacing</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• <code>p-4</code> - Standard component padding</p>
                        <p>• <code>m-6</code> - Section margins</p>
                        <p>• <code>gap-4</code> - Grid and flex gaps</p>
                        <p>• <code>space-y-4</code> - Vertical spacing between elements</p>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-2">Layout Spacing</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• <code>p-8</code> - Page container padding</p>
                        <p>• <code>m-12</code> - Large section spacing</p>
                        <p>• <code>p-16</code> - Hero section padding</p>
                        <p>• <code>m-20</code> - Maximum spacing for emphasis</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spacing Guidelines */}
              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Spacing Guidelines</h4>
                <ul className="space-y-2 text-blue-800">
                  <li>• Use <strong>4px (space-1)</strong> for tight spacing between related elements</li>
                  <li>• Use <strong>8px (space-2)</strong> for small gaps and icon spacing</li>
                  <li>• Use <strong>16px (space-4)</strong> for standard component padding</li>
                  <li>• Use <strong>24px (space-6)</strong> for section spacing</li>
                  <li>• Use <strong>32px (space-8)</strong> for page-level spacing</li>
                  <li>• Use <strong>48px (space-12)</strong> for major section breaks</li>
                  <li>• Use <strong>64px+ (space-16+)</strong> for hero sections and emphasis</li>
                </ul>
              </div>
            </div>
          )}

          {/* Components Section */}
          {activeSection === 'components' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaLightbulb className="text-blue-600" />
                Component Design Guide
              </h2>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Button Design */}
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🔘 Button Design Thinking</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Primary Button</h4>
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Get Started
                      </button>
                      <p className="text-xs text-blue-700 mt-2">
                        <strong>When to use:</strong> Main action, conversion points<br/>
                        <strong>Size:</strong> text-lg, padding: px-6 py-3<br/>
                        <strong>Color:</strong> Brand primary color
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Secondary Button</h4>
                      <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        Learn More
                      </button>
                      <p className="text-xs text-gray-700 mt-2">
                        <strong>When to use:</strong> Alternative actions, less important<br/>
                        <strong>Size:</strong> Same as primary for consistency<br/>
                        <strong>Color:</strong> Neutral, doesn't compete with primary
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-900 mb-2">Destructive Button</h4>
                      <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                        Delete Account
                      </button>
                      <p className="text-xs text-red-700 mt-2">
                        <strong>When to use:</strong> Dangerous actions, deletions<br/>
                        <strong>Size:</strong> Same as other buttons<br/>
                        <strong>Color:</strong> Red to indicate danger
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Design */}
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🃏 Card Design Thinking</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h4 className="text-xl font-semibold text-gray-800 mb-2">Feature Card</h4>
                      <p className="text-gray-600 mb-4">Showcase key features with clear hierarchy</p>
                      <button className="text-blue-600 font-medium hover:text-blue-800">
                        Learn More →
                      </button>
                      <p className="text-xs text-gray-500 mt-3">
                        <strong>Padding:</strong> p-6 for breathing room<br/>
                        <strong>Shadow:</strong> shadow-sm for subtle depth<br/>
                        <strong>Border:</strong> border-gray-200 for definition
                      </p>
                    </div>
                    <div className="border border-gray-200 rounded-xl p-4 shadow-sm">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">Compact Card</h4>
                      <p className="text-sm text-gray-600">For lists and grids</p>
                      <p className="text-xs text-gray-500 mt-2">
                        <strong>Padding:</strong> p-4 for compact layout<br/>
                        <strong>Typography:</strong> Smaller text for density
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Design */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">📝 Form Design Thinking</h3>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="p-6 border border-gray-200 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Input Field Decisions</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input 
                          type="email" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter your email"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          <strong>Height:</strong> py-3 for comfortable touch target<br/>
                          <strong>Focus:</strong> Blue ring for accessibility<br/>
                          <strong>Border:</strong> Subtle gray, blue on focus
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input 
                          type="password" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter your password"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          <strong>Consistency:</strong> Same styling as email field<br/>
                          <strong>Security:</strong> Password type for masking
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-xl">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Form Layout Decisions</h4>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h5 className="font-semibold text-blue-900 mb-2">Single Column Layout</h5>
                        <p className="text-sm text-blue-800 mb-3">Best for mobile and complex forms</p>
                        <div className="space-y-3">
                          <div className="h-8 bg-blue-200 rounded"></div>
                          <div className="h-8 bg-blue-200 rounded"></div>
                          <div className="h-8 bg-blue-200 rounded"></div>
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h5 className="font-semibold text-green-900 mb-2">Two Column Layout</h5>
                        <p className="text-sm text-green-800 mb-3">Good for desktop, simple forms</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="h-8 bg-green-200 rounded"></div>
                          <div className="h-8 bg-green-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Design */}
              <div className="p-6 bg-blue-50 rounded-xl">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">🧭 Navigation Design Thinking</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-white rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2">Primary Navigation</h5>
                    <nav className="flex gap-6">
                      <a href="#" className="text-blue-600 font-medium hover:text-blue-800">Home</a>
                      <a href="#" className="text-gray-600 hover:text-gray-800">About</a>
                      <a href="#" className="text-gray-600 hover:text-gray-800">Services</a>
                    </nav>
                    <p className="text-xs text-gray-600 mt-2">
                      <strong>Active state:</strong> Blue color to show current page<br/>
                      <strong>Hover:</strong> Darker color for feedback
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2">Breadcrumbs</h5>
                    <nav className="flex items-center gap-2 text-sm">
                      <a href="#" className="text-gray-500 hover:text-gray-700">Home</a>
                      <span className="text-gray-400">/</span>
                      <a href="#" className="text-gray-500 hover:text-gray-700">Products</a>
                      <span className="text-gray-400">/</span>
                      <span className="text-gray-900">Current Page</span>
                    </nav>
                    <p className="text-xs text-gray-600 mt-2">
                      <strong>Separator:</strong> "/" or "&gt;" for clarity<br/>
                      <strong>Current:</strong> Bold/dark to show position
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg">
                    <h5 className="font-semibold text-gray-800 mb-2">Pagination</h5>
                    <nav className="flex gap-2">
                      <button className="px-3 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">1</button>
                      <button className="px-3 py-2 bg-blue-600 text-white rounded">2</button>
                      <button className="px-3 py-2 border border-gray-300 rounded text-gray-600 hover:bg-gray-50">3</button>
                    </nav>
                    <p className="text-xs text-gray-600 mt-2">
                      <strong>Active:</strong> Blue background for current page<br/>
                      <strong>Size:</strong> Comfortable click target
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Design Principles Section */}
          {activeSection === 'principles' && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <FaLightbulb className="text-blue-600" />
                Design Thinking Framework
              </h2>

              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* Design Process */}
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🎯 Design Process Steps</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">1. Understand the Goal</h4>
                      <p className="text-sm text-blue-800">What are you trying to achieve? Who is the user? What action should they take?</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">2. Plan the Information Architecture</h4>
                      <p className="text-sm text-green-800">What information is most important? How should it be organized?</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">3. Choose Visual Hierarchy</h4>
                      <p className="text-sm text-purple-800">What should users see first? Second? Third?</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">4. Apply Design Patterns</h4>
                      <p className="text-sm text-orange-800">Use consistent patterns users already understand</p>
                    </div>
                  </div>
                </div>

                {/* Decision Making Framework */}
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🤔 Decision Making Questions</h3>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Typography Decisions</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Is this the most important information? → Use larger text</li>
                        <li>• Is this supporting information? → Use smaller text</li>
                        <li>• Is this interactive? → Use medium weight</li>
                        <li>• Is this a heading? → Use bold weight</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Color Decisions</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Is this the main action? → Use primary color</li>
                        <li>• Is this dangerous? → Use red color</li>
                        <li>• Is this successful? → Use green color</li>
                        <li>• Is this neutral? → Use gray color</li>
                      </ul>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Spacing Decisions</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Are these related? → Use small spacing</li>
                        <li>• Are these separate sections? → Use large spacing</li>
                        <li>• Is this a page break? → Use maximum spacing</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Design Principles */}
              <div className="grid md:grid-cols-3 gap-8 mb-8">
                {/* Consistency */}
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Consistency</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Use consistent spacing throughout the interface</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Maintain consistent color usage for similar elements</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Apply consistent typography scale across all components</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Use consistent border radius and shadow styles</span>
                    </li>
                  </ul>
                </div>

                {/* Accessibility */}
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Accessibility</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-1">✓ Good Contrast</h4>
                      <p className="text-sm text-green-700">Text on light backgrounds meets WCAG AA standards</p>
                    </div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 mb-1">⚠ Check Contrast</h4>
                      <p className="text-sm text-yellow-700">Ensure sufficient contrast for all text combinations</p>
                    </div>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-1">✗ Poor Contrast</h4>
                      <p className="text-sm text-red-700">Avoid low contrast combinations</p>
                    </div>
                  </div>
                </div>

                {/* Responsive Design */}
                <div className="p-6 border border-gray-200 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Responsive Design</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Mobile</span>
                      <span className="text-xs text-gray-500">320px - 768px</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Tablet</span>
                      <span className="text-xs text-gray-500">768px - 1024px</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">Desktop</span>
                      <span className="text-xs text-gray-500">1024px+</span>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Tip:</strong> Use responsive spacing and typography that scales appropriately across devices
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Best Practices */}
              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Best Practices</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-blue-800 mb-2">Do's</h5>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Use consistent spacing throughout</li>
                      <li>• Maintain clear visual hierarchy</li>
                      <li>• Ensure sufficient color contrast</li>
                      <li>• Test designs across different screen sizes</li>
                      <li>• Use semantic colors appropriately</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-blue-800 mb-2">Don'ts</h5>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Don't use too many different font sizes</li>
                      <li>• Don't ignore accessibility guidelines</li>
                      <li>• Don't use colors inconsistently</li>
                      <li>• Don't forget about mobile users</li>
                      <li>• Don't overcrowd interfaces</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UIDesignGuide; 