import { TrendingUp, BarChart3, Mail, Star } from 'lucide-react';
import './Components.css';

const MetricCards = () => {
  const metrics = [
    {
      title: 'Product Revenue',
      value: '203,200',
      icon: TrendingUp,
      color: 'pink'
    },
    {
      title: 'Average Sales',
      value: '4,563,029',
      icon: BarChart3,
      color: 'purple'
    },
    {
      title: 'New Customers',
      value: '620,242',
      icon: Mail,
      color: 'blue'
    },
    {
      title: 'Product Reviews',
      value: '834,521',
      icon: Star,
      color: 'orange'
    }
  ];

  return (
    <div className="metric-cards">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div key={index} className={`metric-card metric-card-${metric.color}`}>
            <div className="metric-icon">
              <IconComponent size={24} />
            </div>
            <div className="metric-content">
              <div className="metric-title">{metric.title}</div>
              <div className="metric-value">{metric.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricCards;
