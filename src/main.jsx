import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from './Router/router';
import { ThemeProvider } from './context/ThemeContext';
import RoundedCursor from './components/RoundedCursor';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <RoundedCursor />
    <RouterProvider router={router} />
  </ThemeProvider>
)

