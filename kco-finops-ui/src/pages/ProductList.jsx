import { ChevronDown } from 'lucide-react';
import './Components.css';

const ProductList = () => {
  const products = [
    {
      id: '01',
      name: 'UI Elements and Widgets',
      views: '12,345',
      conversion: '+16.24%',
      conversionType: 'positive',
      total: '$49.95',
      rate: '4.8',
      status: 'ACTIVE'
    },
    {
      id: '02',
      name: 'Creative Designer Assets',
      views: '8,921',
      conversion: '-2.07%',
      conversionType: 'negative',
      total: '$39.99',
      rate: '4.5',
      status: 'PENDING'
    },
    {
      id: '03',
      name: 'Premium Templates',
      views: '15,678',
      conversion: '+8.45%',
      conversionType: 'positive',
      total: '$59.99',
      rate: '4.9',
      status: 'ACTIVE'
    },
    {
      id: '04',
      name: 'Design System Kit',
      views: '9,432',
      conversion: '+12.33%',
      conversionType: 'positive',
      total: '$79.95',
      rate: '4.7',
      status: 'ACTIVE'
    },
    {
      id: '05',
      name: 'Icon Collection',
      views: '6,789',
      conversion: '-5.12%',
      conversionType: 'negative',
      total: '$29.99',
      rate: '4.6',
      status: 'PENDING'
    }
  ];

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Product List</h2>
      <div className="product-table">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Views</th>
              <th>Conversion</th>
              <th>Total</th>
              <th>Rate</th>
              <th>Status</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="product-name-cell">
                    <div className="product-number">{product.id}</div>
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>{product.views}</td>
                <td>
                  <span className={`conversion ${product.conversionType}`}>
                    {product.conversion}
                  </span>
                </td>
                <td className="money-value">{product.total}</td>
                <td>{product.rate}</td>
                <td>
                  <span className={`status-badge ${product.status.toLowerCase()}`}>
                    {product.status}
                  </span>
                </td>
                <td>
                  <button className="details-btn">
                    Details <ChevronDown size={12} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
