import React from 'react'

function PagenotFound() {
  return (
   <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-pink-100">
      <img src="/logo.png" alt="Logo" className="w-24 h-24 mb-6 animate-bounce" />
      <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6 text-center max-w-md">Sorry, the page you are looking for does not exist or has been moved.</p>
      <a href="/" className="px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow hover:bg-indigo-700 transition">Go Home</a>
   </div>
  )
}

export default PagenotFound