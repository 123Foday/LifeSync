import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppContextProvider from './context/AppContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={clientId}>
        <AppContextProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </AppContextProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)