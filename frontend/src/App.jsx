import React, { useState, useEffect } from 'react';
import CouponList from './components/CouponList';
import CreateCoupon from './components/CreateCoupon';
import FindBestCoupon from './components/FindBestCoupon';
import { api } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('find');
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await api.getAllCoupons();
      setCoupons(response.data || []);
    } catch (error) {
      showNotification('Failed to load coupons: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleCouponCreated = () => {
    loadCoupons();
    showNotification('Coupon created successfully!', 'success');
  };

  const handleCouponDeleted = async (code) => {
    if (!window.confirm(`Are you sure you want to delete coupon ${code}?`)) {
      return;
    }

    try {
      await api.deleteCoupon(code);
      loadCoupons();
      showNotification('Coupon deleted successfully!', 'success');
    } catch (error) {
      showNotification('Failed to delete coupon: ' + error.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 p-5">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-purple-600 mb-3">Coupon Management System</h1>
          <p className="text-lg text-gray-600">Manage and apply discount coupons for your e-commerce platform</p>
          <div className="mt-4 text-sm text-gray-500">
            Demo User: hire-me@anshumat.org | Password: HireMe@2025!
          </div>
        </div>

        {notification && (
          <div className={`p-4 rounded-lg mb-5 ${
            notification.type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' :
            notification.type === 'error' ? 'bg-red-100 text-red-800 border border-red-300' :
            'bg-blue-100 text-blue-800 border border-blue-300'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="flex gap-3 mb-8">
          <button
            className={`flex-1 px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
              activeTab === 'find'
                ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-xl'
                : 'bg-white text-purple-600 hover:shadow-lg hover:-translate-y-0.5'
            }`}
            onClick={() => setActiveTab('find')}
          >
            Find Best Coupon
          </button>
          <button
            className={`flex-1 px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
              activeTab === 'list'
                ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-xl'
                : 'bg-white text-purple-600 hover:shadow-lg hover:-translate-y-0.5'
            }`}
            onClick={() => setActiveTab('list')}
          >
            View All Coupons
          </button>
          <button
            className={`flex-1 px-6 py-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
              activeTab === 'create'
                ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-xl'
                : 'bg-white text-purple-600 hover:shadow-lg hover:-translate-y-0.5'
            }`}
            onClick={() => setActiveTab('create')}
          >
            Create Coupon
          </button>
        </div>

        {activeTab === 'find' && (
          <FindBestCoupon coupons={coupons} showNotification={showNotification} />
        )}

        {activeTab === 'list' && (
          <CouponList
            coupons={coupons}
            loading={loading}
            onDelete={handleCouponDeleted}
            onRefresh={loadCoupons}
          />
        )}

        {activeTab === 'create' && (
          <CreateCoupon onSuccess={handleCouponCreated} showNotification={showNotification} />
        )}
      </div>
    </div>
  );
}

export default App;
