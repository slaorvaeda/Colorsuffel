import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navmenu({isOpen}) {
  const location = useLocation();
  return (
    <div className={`items-center justify-between ${isOpen ? 'block' : 'hidden'} w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${isOpen ? 'block' : 'hidden'}`}></div>
      
      {/* Mobile Menu Panel */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('toggleMenu'))}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu Items */}
        <nav className="p-6">
          <ul className="space-y-2">
            <li>
              <Link 
                to="/" 
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === '/' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => window.dispatchEvent(new CustomEvent('toggleMenu'))}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/shade" 
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === '/shade' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => window.dispatchEvent(new CustomEvent('toggleMenu'))}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                Shade And Tint
              </Link>
            </li>
            <li>
              <Link 
                to="/gradient" 
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === '/gradient' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => window.dispatchEvent(new CustomEvent('toggleMenu'))}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Gradient
              </Link>
            </li>
            <li>
              <Link 
                to="/pallet" 
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === '/pallet' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => window.dispatchEvent(new CustomEvent('toggleMenu'))}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                Pallet
              </Link>
            </li>
            <li>
              <Link 
                to="/image-picker" 
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === '/image-picker' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => window.dispatchEvent(new CustomEvent('toggleMenu'))}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Image Picker
              </Link>
            </li>
            <li>
              <Link 
                to="/color-names" 
                className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === '/color-names' 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => window.dispatchEvent(new CustomEvent('toggleMenu'))}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                </svg>
                Color Names
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center space-x-1">
        <li>
          <Link 
            to="/" 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
              location.pathname === '/' 
                ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20'
            }`}
          >
            Home
            {location.pathname === '/' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
            )}
          </Link>
        </li>
        <li>
          <Link 
            to="/shade" 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
              location.pathname === '/shade' 
                ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20'
            }`}
          >
            Shade And Tint
            {location.pathname === '/shade' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
            )}
          </Link>
        </li>
        <li>
          <Link 
            to="/gradient" 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
              location.pathname === '/gradient' 
                ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20'
            }`}
          >
            Gradient
            {location.pathname === '/gradient' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
            )}
          </Link>
        </li>
        <li>
          <Link 
            to="/pallet" 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
              location.pathname === '/pallet' 
                ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20'
            }`}
          >
            Pallet
            {location.pathname === '/pallet' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
            )}
          </Link>
        </li>
        <li>
          <Link 
            to="/image-picker" 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
              location.pathname === '/image-picker' 
                ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20'
            }`}
          >
            Image Picker
            {location.pathname === '/image-picker' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
            )}
          </Link>
        </li>
        <li>
          <Link 
            to="/color-names" 
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 relative ${
              location.pathname === '/color-names' 
                ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' 
                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-900/20'
            }`}
          >
            Color Names
            {location.pathname === '/color-names' && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
            )}
          </Link>
        </li>
      </ul>
    </div>
  )
}

export default Navmenu