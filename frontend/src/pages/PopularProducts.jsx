import React from 'react';
import { Package, ArrowUpRight } from 'lucide-react';

const PopularProducts = () => {
  const products = [
    { name: 'EC2 Instances', usage: 'High', trend: '+12%' },
    { name: 'S3 Standard', usage: 'Medium', trend: '+5%' },
    { name: 'RDS Postgres', usage: 'Low', trend: '-2%' },
  ];

  return (
    <div className="glass-card mt-6">
      <h3 className="text-lg font-bold text-white mb-4">Top Resources</h3>
      <div className="flex flex-col gap-3">
        {products.map((product, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#a02ff1]/10 rounded-lg text-[#a02ff1]">
                <Package size={18} />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{product.name}</div>
                <div className="text-xs text-gray-400">{product.usage} Volume</div>
              </div>
            </div>
            <div className={`text-xs font-bold ${product.trend.includes('+') ? 'text-red-400' : 'text-green-400'}`}>
              {product.trend}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;