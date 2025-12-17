import React from 'react';
import VerticalSidebar from './VerticalSidebar';
import Header from './Header';
import MetricCards from './MetricCards';
import TimelineGraph from './TimelineGraph';
import ProductEarnings from './ProductEarnings';
import ProductList from './ProductList';
import NewCustomers from './NewCustomers';
import PopularProducts from './PopularProducts';
import './Components.css';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#0f0f11]">
      <VerticalSidebar />
      <Header />
      <div className="main-content">
        <MetricCards />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <TimelineGraph />
          <ProductEarnings />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <ProductList />
          <div>
            <NewCustomers />
            <PopularProducts />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

