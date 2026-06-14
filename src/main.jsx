import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Providers
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/Auth.context.jsx';

// Style
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import { ThemeProvider } from './context/Theme.context.jsx';
import { NotifierProvider } from './context/Notifier.context.jsx';
import { DataProvider } from './context/Data.context.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <NotifierProvider>
              <App />
            </NotifierProvider>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
