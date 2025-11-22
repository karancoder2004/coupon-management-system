
class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getAllCoupons() {
    return this.request('/coupons');
  }

  async getCoupon(code) {
    return this.request(`/coupons/${code}`);
  }

  async createCoupon(couponData) {
    return this.request('/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    });
  }

  async deleteCoupon(code) {
    return this.request(`/coupons/${code}`, {
      method: 'DELETE',
    });
  }

  async findBestCoupon(user, cart) {
    return this.request('/coupons/best-coupon', {
      method: 'POST',
      body: JSON.stringify({ user, cart }),
    });
  }

  async getApplicableCoupons(user, cart) {
    return this.request('/coupons/applicable-coupons', {
      method: 'POST',
      body: JSON.stringify({ user, cart }),
    });
  }
}

export const api = new ApiService();
