import React from 'react'
import logo from '../assets/logo.png'
import { Link } from 'react-router-dom'

function Contactstaze() {
  return (
    <div className="fixed bottom-2 right-4 z-50 border-2 bg-neutral-50 md:bg-transparent rounded-full border-gray-200">
        <Link to='/contact'>
        <img src={logo} alt="" className='h-10 w-10 rounded-full '/>
        </Link>
    </div>
  )
}

export default Contactstaze