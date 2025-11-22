import { Coupon } from '../models/Coupon.js';

class CouponService {
  constructor() {
    this.coupons = new Map();
    this.initializeSeedData();
  }

  initializeSeedData() {
    const seedCoupons = [
      {
        code: 'WELCOME100',
        description: 'Welcome offer for new users - Flat ₹100 off',
        discountType: 'FLAT',
        discountValue: 100,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        usageLimitPerUser: 1,
        eligibility: {
          allowedUserTiers: ['NEW'],
          firstOrderOnly: true,
          minCartValue: 500
        }
      },
      {
        code: 'GOLD50',
        description: '50% off for Gold members',
        discountType: 'PERCENT',
        discountValue: 50,
        maxDiscountAmount: 500,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        eligibility: {
          allowedUserTiers: ['GOLD'],
          minLifetimeSpend: 10000,
          minCartValue: 1000
        }
      },
      {
        code: 'ELECTRONICS20',
        description: '20% off on electronics',
        discountType: 'PERCENT',
        discountValue: 20,
        maxDiscountAmount: 1000,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        eligibility: {
          applicableCategories: ['electronics'],
          minCartValue: 2000
        }
      },
      {
        code: 'FASHION15',
        description: '15% off on fashion items',
        discountType: 'PERCENT',
        discountValue: 15,
        maxDiscountAmount: 300,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        eligibility: {
          applicableCategories: ['fashion'],
          minCartValue: 1000
        }
      },
      {
        code: 'REGULAR200',
        description: 'Flat ₹200 off for regular customers',
        discountType: 'FLAT',
        discountValue: 200,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        eligibility: {
          allowedUserTiers: ['REGULAR', 'GOLD'],
          minOrdersPlaced: 3,
          minCartValue: 1500
        }
      },
      {
        code: 'INDIA25',
        description: '25% off for Indian customers',
        discountType: 'PERCENT',
        discountValue: 25,
        maxDiscountAmount: 400,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        eligibility: {
          allowedCountries: ['IN'],
          minCartValue: 1000
        }
      },
      {
        code: 'BULK10',
        description: '10% off on bulk orders',
        discountType: 'PERCENT',
        discountValue: 10,
        maxDiscountAmount: 500,
        startDate: '2025-01-01',
        endDate: '2025-12-31',
        eligibility: {
          minItemsCount: 5,
          minCartValue: 2000
        }
      }
    ];

    seedCoupons.forEach(data => {
      const coupon = new Coupon(data);
      this.coupons.set(coupon.code, coupon);
    });
  }

  createCoupon(couponData) {
    const coupon = new Coupon(couponData);
    const errors = coupon.validate();

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }

    if (this.coupons.has(coupon.code)) {
      throw new Error(`Coupon with code '${coupon.code}' already exists`);
    }

    this.coupons.set(coupon.code, coupon);
    return coupon;
  }

  getAllCoupons() {
    return Array.from(this.coupons.values()).map(c => c.toJSON());
  }

  getCoupon(code) {
    return this.coupons.get(code);
  }

  deleteCoupon(code) {
    return this.coupons.delete(code);
  }

  calculateCartValue(items) {
    return items.reduce((total, item) => {
      return total + (item.unitPrice * item.quantity);
    }, 0);
  }

  calculateItemsCount(items) {
    return items.reduce((total, item) => total + item.quantity, 0);
  }

  getCartCategories(items) {
    return [...new Set(items.map(item => item.category))];
  }

  checkEligibility(coupon, user, cart) {
    const eligibility = coupon.eligibility;
    const cartValue = this.calculateCartValue(cart.items);
    const itemsCount = this.calculateItemsCount(cart.items);
    const cartCategories = this.getCartCategories(cart.items);

    if (eligibility.allowedUserTiers && eligibility.allowedUserTiers.length > 0) {
      if (!eligibility.allowedUserTiers.includes(user.userTier)) {
        return { eligible: false, reason: 'User tier not allowed' };
      }
    }

    if (eligibility.minLifetimeSpend !== undefined) {
      if (user.lifetimeSpend < eligibility.minLifetimeSpend) {
        return {
          eligible: false,
          reason: `Minimum lifetime spend of ₹${eligibility.minLifetimeSpend} required`
        };
      }
    }

    if (eligibility.minOrdersPlaced !== undefined) {
      if (user.ordersPlaced < eligibility.minOrdersPlaced) {
        return {
          eligible: false,
          reason: `Minimum ${eligibility.minOrdersPlaced} orders required`
        };
      }
    }

    if (eligibility.firstOrderOnly === true) {
      if (user.ordersPlaced > 0) {
        return { eligible: false, reason: 'Valid only for first order' };
      }
    }

    if (eligibility.allowedCountries && eligibility.allowedCountries.length > 0) {
      if (!eligibility.allowedCountries.includes(user.country)) {
        return { eligible: false, reason: 'Country not allowed' };
      }
    }

    if (eligibility.minCartValue !== undefined) {
      if (cartValue < eligibility.minCartValue) {
        return {
          eligible: false,
          reason: `Minimum cart value of ₹${eligibility.minCartValue} required`
        };
      }
    }

    if (eligibility.applicableCategories && eligibility.applicableCategories.length > 0) {
      const hasApplicableCategory = cartCategories.some(cat =>
        eligibility.applicableCategories.includes(cat)
      );
      if (!hasApplicableCategory) {
        return {
          eligible: false,
          reason: `No items from applicable categories: ${eligibility.applicableCategories.join(', ')}`
        };
      }
    }

    if (eligibility.excludedCategories && eligibility.excludedCategories.length > 0) {
      const hasExcludedCategory = cartCategories.some(cat =>
        eligibility.excludedCategories.includes(cat)
      );
      if (hasExcludedCategory) {
        return {
          eligible: false,
          reason: `Cart contains excluded categories: ${eligibility.excludedCategories.join(', ')}`
        };
      }
    }

    if (eligibility.minItemsCount !== undefined) {
      if (itemsCount < eligibility.minItemsCount) {
        return {
          eligible: false,
          reason: `Minimum ${eligibility.minItemsCount} items required in cart`
        };
      }
    }

    return { eligible: true };
  }

  findBestCoupon(user, cart) {
    const currentDate = new Date();
    const cartValue = this.calculateCartValue(cart.items);
    const eligibleCoupons = [];

    for (const coupon of this.coupons.values()) {
      if (!coupon.isDateValid(currentDate)) continue;
      if (coupon.hasExceededUsageLimit(user.userId)) continue;

      const eligibilityResult = this.checkEligibility(coupon, user, cart);
      if (!eligibilityResult.eligible) continue;

      const discountAmount = coupon.calculateDiscount(cartValue);
      eligibleCoupons.push({
        coupon,
        discountAmount,
        finalPrice: cartValue - discountAmount
      });
    }

    if (eligibleCoupons.length === 0) {
      return null;
    }

    eligibleCoupons.sort((a, b) => {
      if (b.discountAmount !== a.discountAmount) {
        return b.discountAmount - a.discountAmount;
      }
      if (a.coupon.endDate.getTime() !== b.coupon.endDate.getTime()) {
        return a.coupon.endDate.getTime() - b.coupon.endDate.getTime();
      }
      return a.coupon.code.localeCompare(b.coupon.code);
    });

    const best = eligibleCoupons[0];
    return {
      coupon: best.coupon.toJSON(),
      discountAmount: best.discountAmount,
      originalPrice: cartValue,
      finalPrice: best.finalPrice
    };
  }

  getAllApplicableCoupons(user, cart) {
    const currentDate = new Date();
    const cartValue = this.calculateCartValue(cart.items);
    const applicableCoupons = [];

    for (const coupon of this.coupons.values()) {
      const result = {
        code: coupon.code,
        description: coupon.description,
        applicable: false,
        reason: null,
        discountAmount: null
      };

      if (!coupon.isDateValid(currentDate)) {
        result.reason = 'Coupon not valid at this time';
        applicableCoupons.push(result);
        continue;
      }

      if (coupon.hasExceededUsageLimit(user.userId)) {
        result.reason = 'Usage limit exceeded';
        applicableCoupons.push(result);
        continue;
      }

      const eligibilityResult = this.checkEligibility(coupon, user, cart);
      if (!eligibilityResult.eligible) {
        result.reason = eligibilityResult.reason;
        applicableCoupons.push(result);
        continue;
      }

      result.applicable = true;
      result.discountAmount = coupon.calculateDiscount(cartValue);
      applicableCoupons.push(result);
    }

    return applicableCoupons;
  }
}

export const couponService = new CouponService();
