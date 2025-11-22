import React from 'react';

function CouponList({ coupons, loading, onDelete, onRefresh }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-10">
          <div className="inline-block w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading coupons...</p>
        </div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Coupons Available</h2>
          <p className="text-gray-600">Create your first coupon to get started!</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Coupons ({coupons.length})</h2>
        <button
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          onClick={onRefresh}
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div key={coupon.code} className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow-lg">
            <div className="text-2xl font-bold mb-2">{coupon.code}</div>
            <div className="text-sm opacity-90 mb-4">{coupon.description}</div>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-sm space-y-2">
              <div>
                <strong>Discount:</strong>{' '}
                {coupon.discountType === 'FLAT'
                  ? `₹${coupon.discountValue}`
                  : `${coupon.discountValue}%`}
                {coupon.maxDiscountAmount && ` (Max: ₹${coupon.maxDiscountAmount})`}
              </div>
              <div>
                <strong>Valid:</strong> {formatDate(coupon.startDate)} - {formatDate(coupon.endDate)}
              </div>
              {coupon.usageLimitPerUser && (
                <div>
                  <strong>Usage Limit:</strong> {coupon.usageLimitPerUser} per user
                </div>
              )}
              {coupon.eligibility.minCartValue && (
                <div>
                  <strong>Min Cart:</strong> ₹{coupon.eligibility.minCartValue}
                </div>
              )}
              {coupon.eligibility.allowedUserTiers && (
                <div>
                  <strong>User Tiers:</strong> {coupon.eligibility.allowedUserTiers.join(', ')}
                </div>
              )}
              {coupon.eligibility.applicableCategories && (
                <div>
                  <strong>Categories:</strong> {coupon.eligibility.applicableCategories.join(', ')}
                </div>
              )}
            </div>

            <div className="mt-4">
              <button
                className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                onClick={() => onDelete(coupon.code)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CouponList;
