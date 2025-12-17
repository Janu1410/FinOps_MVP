import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import FinOpsSection from './components/FinOpsSection';
import Features from './components/Features';
import Pricing from './components/Pricing';
import InquirySection from './components/InquirySection';
import Footer from './components/Footer';
import './index.css'
function App() {
  return (
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
}

export default App;