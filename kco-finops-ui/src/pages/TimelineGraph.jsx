import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './Components.css';

const TimelineGraph = () => {
  // Sample data matching the description - Payments and Expenses over months
  const data = [
    { month: 'Jan', Payments: 8, Expenses: 12 },
    { month: 'Feb', Payments: 12, Expenses: 15 },
    { month: 'Mar', Payments: 15, Expenses: 18 },
    { month: 'Apr', Payments: 22, Expenses: 28 },
    { month: 'May', Payments: 25, Expenses: 32 },
    { month: 'Jun', Payments: 18, Expenses: 24 },
    { month: 'Jul', Payments: 14, Expenses: 20 },
    { month: 'Aug', Payments: 10, Expenses: 16 },
    { month: 'Sep', Payments: 12, Expenses: 18 },
    { month: 'Oct', Payments: 16, Expenses: 22 },
    { month: 'Nov', Payments: 20, Expenses: 26 },
    { month: 'Dec', Payments: 24, Expenses: 30 },
  ];

  return (
    <div className="timeline-graph-container">
      <div className="graph-header">
        <h2 className="graph-title">Data Graph Analysis</h2>
        <div className="graph-legend">
          <div className="legend-item">
            <div className="legend-color green"></div>
            <span>Payments</span>
          </div>
          <div className="legend-item">
            <div className="legend-color green-dark"></div>
            <span>Expenses</span>
          </div>
        </div>
      </div>
      <div className="graph-content">
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPayments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fill: '#e5e7eb', fontSize: 12 }}
              label={{ value: 'Cost', angle: -90, position: 'insideLeft', fill: '#e5e7eb' }}
              tickFormatter={(value) => `${value}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#121214', 
                border: '1px solid rgba(139, 47, 201, 0.3)',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
            />
            <Area 
              type="monotone" 
              dataKey="Payments" 
              stroke="#22c55e" 
              fillOpacity={1} 
              fill="url(#colorPayments)"
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="Expenses" 
              stroke="#F59E0B" 
              fillOpacity={1} 
              fill="url(#colorExpenses)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimelineGraph;
