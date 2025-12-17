import React, { useState } from 'react';
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
import AuthModal from './components/Auth/AuthModal';
import Dashboard from './components/Dashboard'; // Import Dashboard

import './index.css';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const openAuth = () => setIsAuthOpen(true);

  return (
    <>
      {/* 1. IF USER IS SIGNED OUT -> SHOW LANDING PAGE */}
      <SignedOut>
        <div className="min-h-screen bg-[#0f0f11] font-sans overflow-x-hidden">
          <Navbar onOpenAuth={openAuth}/>
          <main>
            <Hero onOpenAuth={openAuth}/>
            <About />
            <FinOpsSection />
            <Features />
            <Pricing />
            <InquirySection />
          </main>
          <Footer />
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
      </SignedOut>

      {/* 2. IF USER IS SIGNED IN -> SHOW DASHBOARD */}
      <SignedIn>
        <Dashboard />
      </SignedIn>
    </>
  );
}

export default App;