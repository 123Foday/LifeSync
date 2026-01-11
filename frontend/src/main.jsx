import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from "@react-oauth/google";
import AppContextProvider from './context/AppContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || "",
    authority: "https://login.microsoftonline.com/common",
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL before rendering
msalInstance.initialize().then(() => {
  createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={clientId}>
          <MsalProvider instance={msalInstance}>
            <AppContextProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </AppContextProvider>
          </MsalProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
});