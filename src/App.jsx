import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Outlet } from 'react-router-dom'
import Contactstaze from './components/Contactstaze'
import SeoHead from './seo/SeoHead'


function App() {
  return (
    <>
      <SeoHead />
      <Navbar />
      <div className="bg-gradient-to-br from-indigo-100 to-pink-100 m-4 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100 rounded-2xl min-h-[80vh] pb-4">
        <main id="main-content">
          <Outlet />
        </main>
      </div>
      <Contactstaze />
      <Footer />
    </>
  )
}

export default App