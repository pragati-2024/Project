import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

// Warm up backend ASAP (helps Render cold starts; reduces Google sign-in delay)
try {
  fetch('/api/health', { method: 'GET', cache: 'no-store' }).catch(() => {});
} catch {}





createRoot(document.getElementById('root')).render(
  <StrictMode>
    {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    ) : (
      <App />
    )}
  </StrictMode>
)
