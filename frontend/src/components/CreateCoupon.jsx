import React, { useState } from 'react';
import { api } from '../services/api';

function CreateCoupon({ onSuccess, showNotification }) {
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'FLAT',
    discountValue: '',
    maxDiscountAmount: '',
    startDate: '',
    endDate: '',
    usageLimitPerUser: '',
    minCartValue: '',
    allowedUserTiers: '',
    minLifetimeSpend: '',
    minOrdersPlaced: '',
    firstOrderOnly: false,
    allowedCountries: '',
    applicableCategories: '',
    excludedCategories: '',
    minItemsCount: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const couponData = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        startDate: formData.startDate,
        endDate: formData.endDate,
        eligibility: {}
      };

      if (formData.maxDiscountAmount) {
        couponData.maxDiscountAmount = parseFloat(formData.maxDiscountAmount);
      }

      if (formData.usageLimitPerUser) {
        couponData.usageLimitPerUser = parseInt(formData.usageLimitPerUser);
      }

      if (formData.minCartValue) {
        couponData.eligibility.minCartValue = parseFloat(formData.minCartValue);
      }

      if (formData.allowedUserTiers) {
        couponData.eligibility.allowedUserTiers = formData.allowedUserTiers
          .split(',')
          .map(t => t.trim())
          .filter(t => t);
      }

      if (formData.minLifetimeSpend) {
        couponData.eligibility.minLifetimeSpend = parseFloat(formData.minLifetimeSpend);
      }

      if (formData.minOrdersPlaced) {
        couponData.eligibility.minOrdersPlaced = parseInt(formData.minOrdersPlaced);
      }

      if (formData.firstOrderOnly) {
        couponData.eligibility.firstOrderOnly = true;
      }

      if (formData.allowedCountries) {
        couponData.eligibility.allowedCountries = formData.allowedCountries
          .split(',')
          .map(c => c.trim())
          .filter(c => c);
      }

      if (formData.applicableCategories) {
        couponData.eligibility.applicableCategories = formData.applicableCategories
          .split(',')
          .map(c => c.trim())
          .filter(c => c);
      }

      if (formData.excludedCategories) {
        couponData.eligibility.excludedCategories = formData.excludedCategories
          .split(',')
          .map(c => c.trim())
          .filter(c => c);
      }

      if (formData.minItemsCount) {
        couponData.eligibility.minItemsCount = parseInt(formData.minItemsCount);
      }

      await api.createCoupon(couponData);
      onSuccess();

      setFormData({
        code: '',
        description: '',
        discountType: 'FLAT',
        discountValue: '',
        maxDiscountAmount: '',
        startDate: '',
        endDate: '',
        usageLimitPerUser: '',
        minCartValue: '',
        allowedUserTiers: '',
        minLifetimeSpend: '',
        minOrdersPlaced: '',
        firstOrderOnly: false,
        allowedCountries: '',
        applicableCategories: '',
        excludedCategories: '',
        minItemsCount: ''
      });
    } catch (error) {
      showNotification('Failed to create coupon: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">Create New Coupon</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Code *</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              placeholder="e.g., WELCOME100"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Type *</label>
            <select className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              required
            >
              <option value="FLAT">Flat Amount</option>
              <option value="PERCENT">Percentage</option>
            </select>
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description *</label>
          <textarea className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Brief description of the coupon"
            rows="2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Discount Value *</label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              placeholder={formData.discountType === 'FLAT' ? 'Amount in ₹' : 'Percentage (0-100)'}
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Max Discount Amount</label>
            <input
              type="number"
              name="maxDiscountAmount"
              value={formData.maxDiscountAmount}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="For percentage discounts"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date *</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Usage Limit Per User</label>
            <input
              type="number"
              name="usageLimitPerUser"
              value={formData.usageLimitPerUser}
              onChange={handleChange}
              min="1"
              placeholder="Leave empty for unlimited"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Cart Value</label>
            <input
              type="number"
              name="minCartValue"
              value={formData.minCartValue}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="Minimum cart amount"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <h3 className="text-xl font-bold text-purple-600 mt-8 mb-4" style={{ marginTop: '30px', marginBottom: '15px', color: '#667eea' }}>
          User Eligibility
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Allowed User Tiers</label>
            <input
              type="text"
              name="allowedUserTiers"
              value={formData.allowedUserTiers}
              onChange={handleChange}
              placeholder="e.g., NEW, REGULAR, GOLD (comma-separated)"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Allowed Countries</label>
            <input
              type="text"
              name="allowedCountries"
              value={formData.allowedCountries}
              onChange={handleChange}
              placeholder="e.g., IN, US (comma-separated)"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Lifetime Spend</label>
            <input
              type="number"
              name="minLifetimeSpend"
              value={formData.minLifetimeSpend}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="Total historical spend"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Orders Placed</label>
            <input
              type="number"
              name="minOrdersPlaced"
              value={formData.minOrdersPlaced}
              onChange={handleChange}
              min="0"
              placeholder="Number of past orders"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="mb-5">
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="firstOrderOnly"
              checked={formData.firstOrderOnly}
              onChange={handleChange}
              style={{ width: 'auto' }}
            />
            First Order Only
          </label>
        </div>

        <h3 className="text-xl font-bold text-purple-600 mt-8 mb-4" style={{ marginTop: '30px', marginBottom: '15px', color: '#667eea' }}>
          Cart Eligibility
        </h3>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Applicable Categories</label>
          <input
            type="text"
            name="applicableCategories"
            value={formData.applicableCategories}
            onChange={handleChange}
            placeholder="e.g., electronics, fashion (comma-separated)"
            className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Excluded Categories</label>
          <input
            type="text"
            name="excludedCategories"
            value={formData.excludedCategories}
            onChange={handleChange}
            placeholder="Categories that cannot be in cart"
            className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Minimum Items Count</label>
          <input
            type="number"
            name="minItemsCount"
            value={formData.minItemsCount}
            onChange={handleChange}
            min="1"
            placeholder="Minimum number of items in cart"
            className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          disabled={loading}
          style={{ width: '100%', marginTop: '20px' }}
        >
          {loading ? 'Creating...' : 'Create Coupon'}
        </button>
      </form>
    </div>
  );
}

export default CreateCoupon;
