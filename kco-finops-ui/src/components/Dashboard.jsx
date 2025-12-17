// src/components/Dashboard.jsx
import React from 'react';
import { UserButton, useUser } from "@clerk/clerk-react";
import { BarChart2, DollarSign, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user } = useUser(); // Get user data (name, email, image)

  return (
    <div className="min-h-screen bg-[#0f0f11] p-8 font-sans">
      
      {/* Header */}
      <header className="flex justify-between items-center mb-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
            {/* Reuse your logo here if you want */}
            <h1 className="text-2xl font-bold text-white">K&Co. Console</h1>
        </div>
        
        <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Welcome, {user?.firstName}</span>
            {/* This is Clerk's Magic User Button (Profile & Logout) */}
            <UserButton afterSignOutUrl="/" /> 
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white mb-8">Financial Overview</h2>
        
        {/* Simple Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121214] border border-white/10 p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><DollarSign size={24} /></div>
                    <span className="text-green-400 text-sm font-bold">+12%</span>
                </div>
                <h3 className="text-gray-400 text-sm mb-1">Total Savings</h3>
                <p className="text-3xl font-bold text-white">$124,500</p>
            </div>

            <div className="bg-[#121214] border border-white/10 p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#8B2FC9]/10 rounded-lg text-[#8B2FC9]"><TrendingUp size={24} /></div>
                    <span className="text-gray-500 text-sm font-bold">AVG</span>
                </div>
                <h3 className="text-gray-400 text-sm mb-1">Efficiency Score</h3>
                <p className="text-3xl font-bold text-white">94/100</p>
            </div>

            <div className="bg-[#121214] border border-white/10 p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-500/10 rounded-lg text-green-400"><BarChart2 size={24} /></div>
                </div>
                <h3 className="text-gray-400 text-sm mb-1">Active Clusters</h3>
                <p className="text-3xl font-bold text-white">14</p>
            </div>
        </div>

        <div className="mt-8 bg-[#121214] border border-white/10 rounded-2xl p-8 text-center h-64 flex flex-col items-center justify-center text-gray-500">
            <p>Real-time AWS/Azure data connection required.</p>
            <button className="mt-4 px-6 py-2 bg-[#8B2FC9] text-white rounded-lg hover:bg-[#7a25b3] transition-colors">Connect Cloud Provider</button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;