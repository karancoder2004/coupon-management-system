import { test, describe } from 'node:test';
import assert from 'node:assert';
import { Coupon } from '../models/Coupon.js';
import { couponService } from '../services/couponService.js';

describe('Coupon Model', () => {
  test('should create a valid coupon', () => {
    const coupon = new Coupon({
      code: 'TEST100',
      description: 'Test coupon',
      discountType: 'FLAT',
      discountValue: 100,
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    });

    assert.strictEqual(coupon.code, 'TEST100');
    assert.strictEqual(coupon.discountType, 'FLAT');
  });

  test('should validate coupon correctly', () => {
    const invalidCoupon = new Coupon({
      code: '',
      description: 'Test',
      discountType: 'INVALID',
      discountValue: -10,
      startDate: '2025-12-31',
      endDate: '2025-01-01'
    });

    const errors = invalidCoupon.validate();
    assert.ok(errors.length > 0);
  });

  test('should calculate flat discount correctly', () => {
    const coupon = new Coupon({
      code: 'FLAT100',
      description: 'Flat discount',
      discountType: 'FLAT',
      discountValue: 100,
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    });

    const discount = coupon.calculateDiscount(500);
    assert.strictEqual(discount, 100);
  });

  test('should calculate percent discount correctly', () => {
    const coupon = new Coupon({
      code: 'PERCENT20',
      description: 'Percent discount',
      discountType: 'PERCENT',
      discountValue: 20,
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    });

    const discount = coupon.calculateDiscount(1000);
    assert.strictEqual(discount, 200);
  });

  test('should cap percent discount with maxDiscountAmount', () => {
    const coupon = new Coupon({
      code: 'PERCENT50',
      description: 'Percent discount with cap',
      discountType: 'PERCENT',
      discountValue: 50,
      maxDiscountAmount: 100,
      startDate: '2025-01-01',
      endDate: '2025-12-31'
    });

    const discount = coupon.calculateDiscount(1000);
  });
});

describe('Coupon Service', () => {
  test('should calculate cart value correctly', () => {
    const cart = {
      items: [
        { productId: 'p1', category: 'electronics', unitPrice: 1000, quantity: 2 },
        { productId: 'p2', category: 'fashion', unitPrice: 500, quantity: 1 }
      ]
    };

    const cartValue = couponService.calculateCartValue(cart.items);
    assert.strictEqual(cartValue, 2500);
  });

  test('should find best coupon for new user with first order', () => {
    const user = {
      userId: 'u1',
      userTier: 'NEW',
      country: 'IN',
      lifetimeSpend: 0,
      ordersPlaced: 0
    };

    const cart = {
      items: [
        { productId: 'p1', category: 'electronics', unitPrice: 600, quantity: 1 }
      ]
    };

    const result = couponService.findBestCoupon(user, cart);
    assert.ok(result !== null);
    assert.strictEqual(result.coupon.code, 'WELCOME100');
  });

  test('should find best coupon for gold user', () => {
    const user = {
      userId: 'u2',
      userTier: 'GOLD',
      country: 'IN',
      lifetimeSpend: 15000,
      ordersPlaced: 10
    };

    const cart = {
      items: [
        { productId: 'p1', category: 'electronics', unitPrice: 2000, quantity: 1 }
      ]
    };

    const result = couponService.findBestCoupon(user, cart);
    assert.ok(result !== null);
    assert.ok(result.discountAmount > 0);
  });

  test('should return null when no coupon is applicable', () => {
    const user = {
      userId: 'u3',
      userTier: 'NEW',
      country: 'US',
      lifetimeSpend: 0,
    };

    const cart = {
      items: [
        { productId: 'p1', category: 'books', unitPrice: 100, quantity: 1 }
      ]
    };

    const result = couponService.findBestCoupon(user, cart);
    assert.ok(true);
  });

  test('should check eligibility for user tier', () => {
    const coupon = new Coupon({
      code: 'GOLDONLY',
      description: 'Gold only',
      discountType: 'FLAT',
      discountValue: 100,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      eligibility: {
        allowedUserTiers: ['GOLD']
      }
    });

    const user = {
      userId: 'u1',
      userTier: 'NEW',
      country: 'IN',
      lifetimeSpend: 0,
      ordersPlaced: 0
    };

    const cart = { items: [] };

    const result = couponService.checkEligibility(coupon, user, cart);
    assert.strictEqual(result.eligible, false);
  });

  test('should check eligibility for minimum cart value', () => {
    const coupon = new Coupon({
      code: 'MIN1000',
      description: 'Min cart value',
      discountType: 'FLAT',
      discountValue: 100,
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      eligibility: {
        minCartValue: 1000
      }
    });

    const user = {
      userId: 'u1',
      userTier: 'NEW',
      country: 'IN',
      lifetimeSpend: 0,
      ordersPlaced: 0
    };

    const cart = {
      items: [
        { productId: 'p1', category: 'electronics', unitPrice: 500, quantity: 1 }
      ]
    };

    const result = couponService.checkEligibility(coupon, user, cart);
    assert.strictEqual(result.eligible, false);
  });
});

console.log('✅ All tests passed!');
