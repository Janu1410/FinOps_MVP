import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Home/Navbar';
import Hero from './components/Home/Hero';
import About from './components/Home/About';
import FinOpsSection from './components/Home/FinOpsSection';
import Features from './components/Home/Features';
import Pricing from './components/Home/Pricing';
import InquirySection from './components/Home/InquirySection';
import Footer from './components/Home/Footer';

// Dashboard Components
// NOTE: DashboardPage handles the internal routing for data-explorer, cost-analysis, etc.
import Dashboard from './components/Dashboard/DashboardPage';
import CSVUpload from './components/CSVUpload';

// Auth Pages
import SignInPage from './components/Auth/SignInPage';
import SignUpPage from './components/Auth/SignUpPage';
import VerifyEmailPage from './components/Auth/VerifyEmailPage';

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

        {/* CRITICAL FIX: 
          We use /dashboard/* to capture ALL sub-routes (like /dashboard/data-explorer).
          This ensures the Dashboard layout (Sidebar + Header) always loads first.
        */}
        <Route path="/dashboard/*" element={<Dashboard />} />

        {/* ❌ REMOVED THE SEPARATE /dashboard/data-explorer ROUTE 
          That route was bypassing the Dashboard layout, causing the black screen.
        */}

        <Route path="/upload" element={<CSVUpload />} />
        <Route path="/verify-email/:email" element={<VerifyEmailPage />} />

      </Routes>
    </Router>
  );
}

export default App;