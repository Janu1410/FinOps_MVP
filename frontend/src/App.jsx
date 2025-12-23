import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Home/Navbar';
import Hero from './components/Home/Hero';
import About from './components/Home/About';
import FinOpsSection from './components/Home/FinOpsSection';
import Features from './components/Home/Features';
import Pricing from './components/Home/Pricing';
import InquirySection from './components/Home/InquirySection';
import Footer from './components/Home/Footer';

// --- NEW IMPORT HERE ---
import HowItWorks from './components/Home/HowItWorks';

// Dashboard Components
import Dashboard from './components/Dashboard/DashboardPage';
import CSVUpload from './components/CSVUpload';

// Auth Pages
import SignInPage from './components/Auth/SignInPage';
import SignUpPage from './components/Auth/SignUpPage';
import VerifyEmailPage from './components/Auth/VerifyEmailPage';

import './index.css';
import SlotBookingPage from './components/Home/SlotBookingPage';

const Home = () => {
  const [showJourneySection, setShowJourneySection] = useState(false);
  const [isCTAActivated, setIsCTAActivated] = useState(false);
  const [showAttentionGrabber, setShowAttentionGrabber] = useState(false);

  const showJourney = () => {
    setShowJourneySection(true);
  };

  const activateCTA = () => {
    setIsCTAActivated(true);
    setShowAttentionGrabber(true);
    setTimeout(() => setShowAttentionGrabber(false), 4500); // Show for 4.5 seconds (3 cycles)
  };

  const deactivateCTA = () => {
    setIsCTAActivated(false);
    setShowAttentionGrabber(false);
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] font-sans overflow-x-hidden">
      <Navbar showJourney={showJourney} /> 
      <main>
        <Hero 
          isCTAActivated={isCTAActivated} 
          deactivateCTA={deactivateCTA} 
          showAttentionGrabber={showAttentionGrabber}
          showJourney={showJourney}
        />    
        <About />
        <FinOpsSection />
        <Features />
        <Pricing />
        <AnimatePresence>
          {showJourneySection && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <HowItWorks activateCTA={activateCTA} />
            </motion.div>
          )}
        </AnimatePresence>
        <InquirySection />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Home Route */}
        <Route path="/" element={<Home />} />

        {/* --- ADD THIS ROUTE TO FIX THE BLANK PAGE --- */}
        <Route path="/how-it-works" element={<HowItWorks />} />

        {/* Auth Routes */}
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        {/* Dashboard Route */}
        <Route path="/dashboard/*" element={<Dashboard />} />

        <Route path="/upload" element={<CSVUpload />} />
        <Route path="/verify-email/:email" element={<VerifyEmailPage />} />
        
        <Route path='/book-slot' element={<SlotBookingPage />} />

        {/* Catch-all Route (Optional but recommended) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;