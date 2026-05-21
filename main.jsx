import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ReactDOM } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'; //Add Bootsrap
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <App />
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
