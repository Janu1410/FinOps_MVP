import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
import VerifyEmailPage from './components/Auth/VerifyEmailPage';
import DataExplore from './components/Dashboard/DataExplorer';
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
                <Dashboard />
            </>
          } 
        />
        <Route 
          path="/dashboard/data-explorer" 
          element={
            <>
                <DataExplore />
            </>
          } 
        />
         <Route path="/upload" element={<CSVUpload />} />
          <Route path="/verify-email/:email" element={<VerifyEmailPage />} />

      </Routes>
    </Router>
  );
}

export default App;