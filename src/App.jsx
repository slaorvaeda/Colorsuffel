import React from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'
import Contactstaze from './components/Contactstaze'


function App() {
  return (
    <>
      <Navbar />
      <div className="bg-gray-50  m-4 dark:text-black rounded-2xl min-h-[80vh] pb-4 ">
        <Outlet />
      </div>
      <Contactstaze />
      <Footer />
    </>
  )
}

export default App