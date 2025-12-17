import { User, Mail, Settings } from 'lucide-react';
import './Components.css';

const NewCustomers = () => {
  const customers = [
    { id: '002143', name: 'Henry Rashford' },
    { id: '002144', name: 'Sarah Johnson' },
    { id: '002145', name: 'Michael Chen' },
    { id: '002146', name: 'Emma Wilson' },
    { id: '002147', name: 'David Brown' }
  ];

  return (
    <div className="new-customers-container">
      <h2 className="customers-title">New Customers</h2>
      <div className="customers-list">
        {customers.map((customer) => (
          <div key={customer.id} className="customer-item">
            <div className="customer-avatar">
              <User size={18} />
            </div>
            <div className="customer-info">
              <div className="customer-name">{customer.name}</div>
              <div className="customer-id">Cust. ID #{customer.id}</div>
            </div>
            <div className="customer-actions">
              <button className="action-icon">
                <Mail size={16} />
              </button>
              <button className="action-icon">
                <Settings size={16} />
              </button>
              <button className="action-icon">
                <Settings size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewCustomers;
