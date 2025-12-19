import React from 'react';
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

// Dashboard Components
import Dashboard from './components/Dashboard/DashboardPage';
import CSVUpload from './components/CSVUpload';

// Auth Pages
import SignInPage from './components/Auth/SignInPage';
import SignUpPage from './components/Auth/SignUpPage';

import './index.css';

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
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        {/* Protected Dashboard Routes - UPDATED */}
        {/* We use /dashboard/* to capture sub-routes like /data-explorer */}
        <Route 
          path="/dashboard/*" 
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
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