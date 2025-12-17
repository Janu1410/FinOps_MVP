import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FinOpsSection from './components/FinOpsSection';
import Features from './components/Features';
import Footer from './components/Footer';
import "./index.css"
import InquirySection from './components/InquirySection';
import About from './components/About';
import Pricing from './components/Pricing';
import Login from './components/Login';
import CSVUpload from './components/CSVUpload';
import DashboardPage from './pages/DashboardPage';

// Home Page Component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f11] font-sans selection:bg-[#8B2FC9]/30">
      <Navbar />
      <Hero />
      <About/>
      <FinOpsSection /> 
      <Features />
      <Pricing/>
      <InquirySection/>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/upload" element={<CSVUpload />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default App;