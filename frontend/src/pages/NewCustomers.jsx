import React from 'react';
import { User, Mail, Settings } from 'lucide-react';

const NewCustomers = () => {
  const customers = [
    { id: '002143', name: 'Henry Rashford', role: 'DevOps' },
    { id: '002144', name: 'Sarah Johnson', role: 'Finance' },
    { id: '002145', name: 'Michael Chen', role: 'Admin' },
  ];

  return (
    <div className="glass-card">
      <h3 className="text-lg font-bold text-white mb-4">Team Members</h3>
      <div className="flex flex-col gap-3">
        {customers.map((customer) => (
          <div key={customer.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#a02ff1] flex items-center justify-center text-white font-bold">
              {customer.name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">{customer.name}</div>
              <div className="text-xs text-gray-400">{customer.role}</div>
            </div>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg">
              <Mail size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewCustomers;