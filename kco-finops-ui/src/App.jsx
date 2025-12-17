import React from 'react';
// 1. Import Routes and Route
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from "@clerk/clerk-react";

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FinOpsSection from './components/FinOpsSection';
import Features from './components/Features';
import Pricing from './components/Pricing';
import InquirySection from './components/InquirySection';
import Footer from './components/Footer';
import Dashboard from './pages/DashboardPage';
import CSVUpload from './components/CSVUpload';

// Auth Pages
import SignInPage from './components/Auth/SignInPage';
import SignUpPage from './components/Auth/SignUpPage';

import './index.css';

// Separate Home Component to keep App.jsx clean
const Home = () => (
  <div className="min-h-screen bg-[#0f0f11] font-sans overflow-x-hidden">
    <Navbar /> 
    <main>
      <Hero />
      <About />
      <FinOpsSection />
      <Features />
      <Pricing />
      <InquirySection />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Public Home Route */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route 
          path="/sign-in/*" 
          element={<SignInPage />} 
        />
        <Route 
          path="/sign-up/*" 
          element={<SignUpPage />} 
        />

        {/* Protected Dashboard Route */}
        <Route 
          path="/dashboard" 
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                 {/* Redirect to sign-in if they try to access dashboard without logging in */}
                <Navigate to="/sign-in" />
              </SignedOut>
            </>
          } 
        />
         <Route path="/upload" element={<CSVUpload />} />

      </Routes>
    </Router>
  );
}

export default App;