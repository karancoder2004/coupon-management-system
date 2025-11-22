import express from 'express';
import { couponService } from '../services/couponService.js';

const router = express.Router();

router.post('/', (req, res) => {
  try {
    const coupon = couponService.createCoupon(req.body);
    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon.toJSON()
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/', (req, res) => {
  try {
    const coupons = couponService.getAllCoupons();
    res.json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/:code', (req, res) => {
  try {
    const coupon = couponService.getCoupon(req.params.code);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        error: 'Coupon not found'
      });
    }
    res.json({
      success: true,
      data: coupon.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.delete('/:code', (req, res) => {
  try {
    const deleted = couponService.deleteCoupon(req.params.code);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Coupon not found'
      });
    }
    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/best-coupon', (req, res) => {
  try {
    const { user, cart } = req.body;

    if (!user || !cart) {
      return res.status(400).json({
        success: false,
        error: 'User and cart data are required'
      });
    }

    if (!cart.items || !Array.isArray(cart.items)) {
      return res.status(400).json({
        success: false,
        error: 'Cart must contain an items array'
      });
    }

    const bestCoupon = couponService.findBestCoupon(user, cart);

    if (!bestCoupon) {
      return res.json({
        success: true,
        message: 'No applicable coupon found',
        data: null
      });
    }

    res.json({
      success: true,
      message: 'Best coupon found',
      data: bestCoupon
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/applicable-coupons', (req, res) => {
  try {
    const { user, cart } = req.body;

    if (!user || !cart) {
      return res.status(400).json({
        success: false,
        error: 'User and cart data are required'
      });
    }

    const applicableCoupons = couponService.getAllApplicableCoupons(user, cart);

    res.json({
      success: true,
      data: applicableCoupons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
