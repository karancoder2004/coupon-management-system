import React, { useState } from 'react';
import { api } from '../services/api';

function FindBestCoupon({ coupons, showNotification }) {
  const [user, setUser] = useState({
    userId: 'demo-user-001',
    userTier: 'NEW',
    country: 'IN',
    lifetimeSpend: 0,
    ordersPlaced: 0
  });

  const [cartItems, setCartItems] = useState([]);
  const [newItem, setNewItem] = useState({
    productId: '',
    category: '',
    unitPrice: '',
    quantity: 1
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: name === 'lifetimeSpend' || name === 'ordersPlaced'
        ? parseFloat(value) || 0
        : value
    }));
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addCartItem = () => {
    if (!newItem.productId || !newItem.category || !newItem.unitPrice) {
      showNotification('Please fill all item fields', 'error');
      return;
    }

    const item = {
      productId: newItem.productId,
      category: newItem.category,
      unitPrice: parseFloat(newItem.unitPrice),
      quantity: parseInt(newItem.quantity) || 1
    };

    setCartItems(prev => [...prev, item]);
    setNewItem({
      productId: '',
      category: '',
      unitPrice: '',
      quantity: 1
    });
  };

  const removeCartItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const calculateCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  };

  const findBestCoupon = async () => {
    if (cartItems.length === 0) {
      showNotification('Please add items to cart', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.findBestCoupon(user, { items: cartItems });
      setResult(response.data);

      if (!response.data) {
        showNotification('No applicable coupon found for this cart', 'info');
      }
    } catch (error) {
      showNotification('Failed to find coupon: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadDemoData = () => {
    setUser({
      userId: 'demo-user-001',
      userTier: 'NEW',
      country: 'IN',
      lifetimeSpend: 0,
      ordersPlaced: 0
    });

    setCartItems([
      {
        productId: 'laptop-001',
        category: 'electronics',
        unitPrice: 45000,
        quantity: 1
      },
      {
        productId: 'mouse-001',
        category: 'electronics',
        unitPrice: 500,
        quantity: 2
      }
    ]);

    showNotification('Demo data loaded!', 'success');
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-5">Find Best Coupon</h2>
          <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors" onClick={loadDemoData}>
            Load Demo Data
          </button>
        </div>

        <h3 className="text-xl font-bold text-purple-600 mb-4" style={{ marginBottom: '15px', color: '#667eea' }}>User Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
            <input
              type="text"
              name="userId"
              value={user.userId}
              onChange={handleUserChange}
              placeholder="Enter user ID"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">User Tier</label>
            <select className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all" name="userTier" value={user.userTier} onChange={handleUserChange}>
              <option value="NEW">NEW</option>
              <option value="REGULAR">REGULAR</option>
              <option value="GOLD">GOLD</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
            <select className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all" name="country" value={user.country} onChange={handleUserChange}>
              <option value="IN">India (IN)</option>
              <option value="US">United States (US)</option>
              <option value="UK">United Kingdom (UK)</option>
              <option value="CA">Canada (CA)</option>
            </select>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Lifetime Spend (₹)</label>
            <input
              type="number"
              name="lifetimeSpend"
              value={user.lifetimeSpend}
              onChange={handleUserChange}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Orders Placed</label>
          <input
            type="number"
            name="ordersPlaced"
            value={user.ordersPlaced}
            onChange={handleUserChange}
            min="0"
            className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-purple-600 mb-4" style={{ marginBottom: '15px', color: '#667eea' }}>Shopping Cart</h3>

        {cartItems.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            {cartItems.map((item, index) => (
              <div key={index} className="bg-gray-50 border-2 border-gray-200 p-4 rounded-lg flex justify-between items-center">
                <div className="cart-item-info">
                  <div style={{ fontWeight: '600', marginBottom: '5px' }}>
                    {item.productId}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    Category: {item.category} | Price: ₹{item.unitPrice} × {item.quantity} = ₹
                    {(item.unitPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
                <div className="cart-item-actions">
                  <button
                    className="button button-danger"
                    onClick={() => removeCartItem(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div
              style={{
                background: '#667eea',
                color: 'white',
                padding: '15px',
                borderRadius: '8px',
                marginTop: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <strong style={{ fontSize: '1.2rem' }}>Cart Total:</strong>
              <strong style={{ fontSize: '1.5rem' }}>₹{calculateCartTotal().toFixed(2)}</strong>
            </div>
          </div>
        )}

        <h4 className="text-lg font-semibold text-gray-800 mb-4">Add Item to Cart</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Product ID</label>
            <input
              type="text"
              name="productId"
              value={newItem.productId}
              onChange={handleNewItemChange}
              placeholder="e.g., laptop-001"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <input
              type="text"
              name="category"
              value={newItem.category}
              onChange={handleNewItemChange}
              placeholder="e.g., electronics"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Price (₹)</label>
            <input
              type="number"
              name="unitPrice"
              value={newItem.unitPrice}
              onChange={handleNewItemChange}
              min="0"
              step="0.01"
              placeholder="Price per unit"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={newItem.quantity}
              onChange={handleNewItemChange}
              min="1"
              className="w-full px-4 py-3 border border-gray-400 rounded-lg shadow-sm bg-gray-50 hover:bg-white focus:bg-white focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <button
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          onClick={addCartItem}
          style={{ width: '100%', marginBottom: '20px' }}
        >
          Add to Cart
        </button>

        <button
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          onClick={findBestCoupon}
          disabled={loading || cartItems.length === 0}
          style={{ width: '100%' }}
        >
          {loading ? 'Finding Best Coupon...' : 'Find Best Coupon'}
        </button>
      </div>

      {result && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-xl shadow-lg mt-6">
          <h3>Best Coupon Found!</h3>

          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '20px 0' }}>
            {result.coupon.code}
          </div>

          <div style={{ fontSize: '1.1rem', marginBottom: '20px', opacity: 0.9 }}>
            {result.coupon.description}
          </div>

          <div className="price-info">
            <span>Original Price:</span>
            <strong>₹{result.originalPrice.toFixed(2)}</strong>
          </div>

          <div className="price-info">
            <span>Discount:</span>
            <strong style={{ color: '#fbbf24' }}>- ₹{result.discountAmount.toFixed(2)}</strong>
          </div>

          <div className="price-info">
            <span>Final Price:</span>
            <strong style={{ fontSize: '1.3rem' }}>₹{result.finalPrice.toFixed(2)}</strong>
          </div>

          <div className="savings">
            You save ₹{result.discountAmount.toFixed(2)}!
          </div>

          <div style={{ marginTop: '20px', fontSize: '0.9rem', opacity: 0.8 }}>
            Discount Type: {result.coupon.discountType === 'FLAT' ? 'Flat Amount' : 'Percentage'} |
            Value: {result.coupon.discountType === 'FLAT'
              ? `₹${result.coupon.discountValue}`
              : `${result.coupon.discountValue}%`}
          </div>
        </div>
      )}
    </div>
  );
}

export default FindBestCoupon;
