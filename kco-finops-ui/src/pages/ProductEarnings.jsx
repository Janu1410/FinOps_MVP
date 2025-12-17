import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './Components.css';

const ProductEarnings = () => {
  const data = [
    { month: 'Jan', 'Business Pro': 8, 'Basic Product': 5 },
    { month: 'Feb', 'Business Pro': 10, 'Basic Product': 7 },
    { month: 'Mar', 'Business Pro': 12, 'Basic Product': 8 },
    { month: 'Apr', 'Business Pro': 15, 'Basic Product': 9 },
    { month: 'May', 'Business Pro': 13, 'Basic Product': 10 },
    { month: 'Jun', 'Business Pro': 11, 'Basic Product': 8 },
    { month: 'Jul', 'Business Pro': 14, 'Basic Product': 9 },
  ];

  return (
    <div className="product-earnings-container">
      <div className="earnings-header">
        <h2 className="earnings-title">Product Earnings</h2>
        <select className="earnings-dropdown">
          <option>Yearly</option>
          <option>Monthly</option>
          <option>Weekly</option>
        </select>
      </div>
      <div className="earnings-content">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis 
              stroke="#9ca3af"
              tick={{ fill: '#e5e7eb', fontSize: 12 }}
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
              wrapperStyle={{ paddingTop: '20px', color: '#e5e7eb' }}
              iconType="square"
            />
            <Bar dataKey="Business Pro" fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Basic Product" fill="#16a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProductEarnings;
