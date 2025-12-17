import { Package } from 'lucide-react';
import './Components.css';

const PopularProducts = () => {
  const products = [
    { id: '124436', name: 'UI elements' },
    { id: '124437', name: 'Creative eBook' },
    { id: '124438', name: 'Design Templates' },
    { id: '124439', name: 'Icon Pack' },
    { id: '124440', name: 'UI Kit Pro' }
  ];

  return (
    <div className="popular-products-container">
      <h2 className="products-title">Popular Products</h2>
      <div className="products-list">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <div className="product-image">
              <Package size={20} />
            </div>
            <div className="product-info">
              <div className="product-name">{product.name}</div>
              <div className="product-id">#{product.id}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
