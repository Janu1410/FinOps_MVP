// src/components/dashboard/CostTable.jsx
import React, { useState } from 'react';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';

const CostTable = ({ data, columns }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Pagination Logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = data.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl mt-4 flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText size={16} className="text-gray-400" /> Detailed Records
        </h3>
        <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/5">
          {data.length} Total Rows
        </span>
      </div>

      {/* Scrollable Table Area */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]"> {/* Min-width forces scroll on small screens */}
          <thead>
            <tr className="text-[10px] uppercase text-gray-500 border-b border-white/5 bg-white/[0.01]">
              {columns.map((col) => (
                <th key={col} className="px-5 py-3 font-semibold whitespace-nowrap">
                  {col.replace(/([A-Z])/g, ' $1').trim()} {/* Adds space before caps */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs text-gray-300">
            {currentData.map((row, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                {columns.map((col) => {
                  const val = row[col];
                  const isCost = col.includes('Cost') || col.includes('Price');
                  
                  return (
                    <td key={col} className={`px-5 py-3 whitespace-nowrap ${isCost ? 'text-right font-mono text-white' : 'text-gray-400'}`}>
                      {isCost ? formatCurrency(val || 0) : (val || '-')}
                    </td>
                  );
                })}
              </tr>
            ))}
            {currentData.length === 0 && (
                <tr><td colSpan={columns.length} className="p-8 text-center text-gray-500">No records found matching filters</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {data.length > itemsPerPage && (
          <div className="px-5 py-3 border-t border-white/5 flex justify-end items-center gap-4 bg-white/[0.01]">
              <span className="text-xs text-gray-500">
                  Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                      <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  >
                      <ChevronRight size={16} />
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default CostTable;