import React from 'react';
import logo from '../assets/logo.png';

function Footer() {
  return (<>
    <footer className='bg-gray-100 dark:bg-gray-900 md:w-[90%] mt-4 rounded-t-2xl m-auto'>
      <div className="flex">
        <div className=" flex items-center logo p-4">
          <img src={logo} alt="Logo"  style={{height: '50px',marginRight:'5px'}}/>© Colorsuffel by Durga Nayak
        </div>
        <div className="item"></div>
      </div>
    </footer>
  </>
  );
}

export default Footer;
