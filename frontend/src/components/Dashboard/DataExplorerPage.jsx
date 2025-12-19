// src/components/Dashboard/DataExplorerPage.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Loader2, Search, Filter } from 'lucide-react';
import VerticalSidebar from './VerticalSidebar';
import Header from './Header';

const DataExplorerPage = () => {
  const navigate = useNavigate();
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columnFilters, setColumnFilters] = useState({});

  useEffect(() => {
    const storedRaw = localStorage.getItem('rawRecords');
    if (storedRaw) {
      try {
        const data = JSON.parse(storedRaw);
        setRawData(data);
        // Initialize with all columns from first row
        if (data.length > 0) {
          setSelectedColumns(Object.keys(data[0]));
        }
        setLoading(false);
      } catch (e) {
        navigate('/upload');
      }
    } else {
      navigate('/upload');
    }
  }, [navigate]);

  // Get all unique column names
  const allColumns = useMemo(() => {
    if (rawData.length === 0) return [];
    return Object.keys(rawData[0]);
  }, [rawData]);

  // Filter data based on search and column filters
  const filteredData = useMemo(() => {
    if (!rawData.length) return [];

    return rawData.filter((row) => {
      // Search filter - search across all column values
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = Object.values(row).some((val) =>
          String(val || '').toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }

      // Column-specific filters
      for (const [column, filterValue] of Object.entries(columnFilters)) {
        if (filterValue && filterValue !== '') {
          const cellValue = String(row[column] || '').toLowerCase();
          if (!cellValue.includes(filterValue.toLowerCase())) {
            return false;
          }
        }
      }

      return true;
    });
  }, [rawData, searchTerm, columnFilters]);

  const COLUMN_WIDTH = 180;
  const ROW_HEIGHT = 40;

  // Cell renderer for virtual grid - react-window v2 API
  const Cell = ({ columnIndex, rowIndex, style, ariaAttributes }) => {
    const isHeader = rowIndex === 0;
    const columnName = selectedColumns[columnIndex];
    
    if (!columnName) {
      return <div style={style} {...ariaAttributes} />;
    }

    if (isHeader) {
      return (
        <div
          style={style}
          {...ariaAttributes}
          className="px-3 py-2 bg-[#1a1b20] border-r border-b border-white/5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center"
        >
          {columnName.replace(/([A-Z])/g, ' $1').trim()}
        </div>
      );
    }

    const dataRowIndex = rowIndex - 1; // Adjust for header row
    const row = filteredData[dataRowIndex];
    const value = row?.[columnName] || '-';
    const isCost = columnName.includes('Cost') || columnName.includes('Price');

    return (
      <div
        style={style}
        {...ariaAttributes}
        className={`px-3 py-2 border-r border-b border-white/5 text-xs ${
          isCost
            ? 'text-right font-mono text-white'
            : 'text-gray-300'
        } hover:bg-white/5 transition-colors`}
      >
        {isCost && typeof value === 'number'
          ? new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(value)
          : String(value)}
      </div>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#a02ff1]" />
      </div>
    );

  if (!rawData.length) {
    return (
      <div className="min-h-screen bg-[#0f0f11] text-white font-sans">
        <VerticalSidebar />
        <Header title="Data Explorer" />
        <main className="ml-[240px] pt-[64px] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 mb-4">No data available</p>
            <button
              onClick={() => navigate('/upload')}
              className="px-4 py-2 bg-[#a02ff1] hover:bg-[#8e25d9] rounded-lg transition-colors"
            >
              Upload CSV
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f11] text-white font-sans">
      <VerticalSidebar />
      <Header title="Data Explorer" />

      <main className="ml-[240px] pt-[64px] min-h-screen relative">
        <div className="p-6 space-y-4 max-w-[1920px] mx-auto">
          <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10 ml-[240px] mt-[64px]" />

          {/* Filters and Search Bar */}
          <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 space-y-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder="Search across all columns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#0f0f11]/50 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#a02ff1] transition-all"
              />
            </div>

            {/* Column Selector */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400 font-semibold">Select Columns ({selectedColumns.length} of {allColumns.length}):</span>
                <button
                  onClick={() => setSelectedColumns(allColumns)}
                  className="text-xs text-[#a02ff1] hover:text-[#8e25d9] transition-colors"
                >
                  Select All
                </button>
                <button
                  onClick={() => setSelectedColumns([])}
                  className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-32 overflow-y-auto bg-[#0f0f11]/50 rounded-lg p-2 border border-white/5 flex flex-wrap gap-2">
                {allColumns.map((col) => (
                  <label
                    key={col}
                    className="flex items-center gap-1.5 text-xs cursor-pointer hover:bg-white/5 px-2 py-1 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(col)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedColumns([...selectedColumns, col]);
                        } else {
                          setSelectedColumns(
                            selectedColumns.filter((c) => c !== col)
                          );
                        }
                      }}
                      className="rounded border-white/10 accent-[#a02ff1]"
                    />
                    <span className="text-gray-300 text-[10px]">
                      {col.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="text-xs text-gray-400">
              Showing {filteredData.length} of {rawData.length} rows
            </div>
          </div>

          {/* Virtual Grid */}
          <div className="bg-[#1a1b20]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            {filteredData.length > 0 && selectedColumns.length > 0 ? (
              <div style={{ height: 'calc(100vh - 420px)', minHeight: '400px', width: '100%', position: 'relative' }}>
                <AutoSizer>
                  {({ height, width }) => {
                    if (!height || height <= 0 || !width || width <= 0) {
                      return (
                        <div className="flex items-center justify-center" style={{ height: '400px' }}>
                          <div className="text-gray-500">Initializing grid...</div>
                        </div>
                      );
                    }
                    return (
                      <Grid
                        columnCount={selectedColumns.length}
                        columnWidth={COLUMN_WIDTH}
                        height={Math.max(height, 400)}
                        rowCount={filteredData.length + 1} // +1 for header
                        rowHeight={ROW_HEIGHT}
                        width={Math.max(width, 800)}
                        cellComponent={Cell}
                      />
                    );
                  }}
                </AutoSizer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-gray-500">
                {selectedColumns.length === 0 ? 'Please select at least one column' : 'No data to display'}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataExplorerPage;
