import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// Providers
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/Auth.context.jsx';
import { ThemeProvider } from './context/Theme.context.jsx';
import { NotifierProvider } from './context/Notifier.context.jsx';
import { DataProvider } from './context/Data.context.jsx';
import { CustomerProvider } from './context/Customer.context.jsx';

// Style
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import { OnlineProvider } from './context/Online.context.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <OnlineProvider>
          <AuthProvider>
            <CustomerProvider>
              <DataProvider>
                <NotifierProvider>
                  <App />
                </NotifierProvider>
              </DataProvider>
            </CustomerProvider>
          </AuthProvider>
        </OnlineProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
