// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'

// Import your key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      // This sets the global theme to dark to match your site
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: '#8B2FC9', // Your purple color
          colorBackground: '#121214',
          colorText: 'white'
        }
      }}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)