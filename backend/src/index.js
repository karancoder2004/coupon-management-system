import express from 'express';
import cors from 'cors';
import couponRoutes from './routes/couponRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use('/api/coupons', couponRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Coupon Management API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Coupon Management API',
    endpoints: {
      health: 'GET /api/health',
      createCoupon: 'POST /api/coupons',
      getAllCoupons: 'GET /api/coupons',
      getCoupon: 'GET /api/coupons/:code',
      deleteCoupon: 'DELETE /api/coupons/:code',
      findBestCoupon: 'POST /api/coupons/best-coupon',
      getApplicableCoupons: 'POST /api/coupons/applicable-coupons'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Coupon Management API Server Started`);
  console.log(`\n✨ Demo User Credentials:`);
  console.log(`   Email: hire-me@anshumat.org`);
  console.log(`   Password: HireMe@2025!`);
  console.log(`\n⏰ ${new Date().toISOString()}\n`);
});

export default app;
