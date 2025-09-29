// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
// --- 1. ADD THIS IMPORT ---
// (Make sure the path to his context file is correct)
import { AuthProvider } from './contexts/AuthContext.jsx'; 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* --- 2. ADD THE WRAPPER AROUND THE APP --- */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);