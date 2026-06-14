import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Providers
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/Auth.context.jsx';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Custom Style
import './styles/Layout.style.css';
import './styles/Fonts.style.css';
import './styles/Dark.style.css';
import './styles/App.style.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
