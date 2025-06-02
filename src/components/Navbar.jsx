import React, { useState } from 'react';
import { IoHeartSharp } from "react-icons/io5";
import Navmenu from './Navbar/Navmenu';
import Logoful from '../assets/colorsuffel.png';
import DarkLogoful from '../assets/colorsuffeldark.png';
import { Link } from 'react-router-dom';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="bg-gray-100 dark:bg-gray-900 sticky md:w-[90%] m-auto md:rounded-3xl z-20 md:top-2 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
          <Link to='/' className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={isOpen ? DarkLogoful : Logoful} className="h-12" alt="Logo" />
          </Link>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <Link to='/likeshades'>
            <button type="button" className="cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" aria-label="Favorite"><IoHeartSharp /></button>
            </Link>
            <button onClick={toggleMenu} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded={isOpen}>

              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
          <Navmenu isOpen={isOpen} />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
