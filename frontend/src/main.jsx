// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'

// Import your key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'your_clerk_publishable_key_here') {
  // Show a helpful error message instead of throwing
  ReactDOM.createRoot(document.getElementById('root')).render(
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0f0f11',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#8B2FC9' }}>
        ⚠️ Missing Environment Variable
      </h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '1rem', maxWidth: '600px' }}>
        The application requires a Clerk Publishable Key to run.
      </p>
      <div style={{
        backgroundColor: '#121214',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        padding: '1.5rem',
        maxWidth: '600px',
        marginTop: '1rem'
      }}>
        <p style={{ marginBottom: '0.5rem' }}><strong>To fix this:</strong></p>
        <ol style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <li>Get the <code style={{ backgroundColor: '#0a0a0c', padding: '2px 6px', borderRadius: '4px' }}>VITE_CLERK_PUBLISHABLE_KEY</code> from your teammate</li>
          <li>Open the <code style={{ backgroundColor: '#0a0a0c', padding: '2px 6px', borderRadius: '4px' }}>.env</code> file in the <code style={{ backgroundColor: '#0a0a0c', padding: '2px 6px', borderRadius: '4px' }}>frontend</code> directory</li>
          <li>Replace <code style={{ backgroundColor: '#0a0a0c', padding: '2px 6px', borderRadius: '4px' }}>your_clerk_publishable_key_here</code> with the actual key</li>
          <li>Restart your development server</li>
        </ol>
      </div>
    </div>
  )
} else {
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
}