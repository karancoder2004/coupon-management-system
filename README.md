# Coupon Management System

A full-stack coupon management system for e-commerce platforms. Built with Node.js, Express, and React.

## Demo Credentials

```
Email: hire-me@anshumat.org
Password: HireMe@2025!
```

## Tech Stack

- **Backend**: Node.js 18+, Express.js
- **Frontend**: React 18, Vite, Tailwind CSS v4
- **Storage**: In-memory (Map)

## Quick Start

### Installation

```bash
# Backend
cd backend
npm install

# Frontend (new terminal)
cd frontend
npm install
```

### Run

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Open http://localhost:3000

### Tests

```bash
cd backend
npm test
```

## Features

### Core APIs

- `POST /api/coupons` - Create coupon
- `GET /api/coupons` - List all coupons
- `GET /api/coupons/:code` - Get specific coupon
- `DELETE /api/coupons/:code` - Delete coupon
- `POST /api/coupons/best-coupon` - Find best matching coupon

### Discount Types

- **FLAT**: Fixed amount (e.g., ₹100 off)
- **PERCENT**: Percentage with optional cap (e.g., 20% max ₹500)

### Eligibility Rules

**User Attributes:**
- User tiers (NEW, REGULAR, GOLD)
- Minimum lifetime spend
- Minimum orders placed
- First order only
- Allowed countries

**Cart Attributes:**
- Minimum cart value
- Applicable product categories
- Excluded categories
- Minimum items count

### Best Coupon Algorithm

1. Filter by date validity
2. Check usage limits
3. Validate eligibility
4. Calculate discounts
5. Select best by:
   - Highest discount
   - Earliest end date
   - Alphabetically smaller code

## API Examples

### Create Coupon

```bash
POST http://localhost:5000/api/coupons

{
  "code": "SUMMER50",
  "description": "Summer sale - 50% off",
  "discountType": "PERCENT",
  "discountValue": 50,
  "maxDiscountAmount": 1000,
  "startDate": "2025-06-01",
  "endDate": "2025-08-31",
  "eligibility": {
    "minCartValue": 2000
  }
}
```

### Find Best Coupon

```bash
POST http://localhost:5000/api/coupons/best-coupon

{
  "user": {
    "userId": "u123",
    "userTier": "NEW",
    "country": "IN",
    "lifetimeSpend": 0,
    "ordersPlaced": 0
  },
  "cart": {
    "items": [
      {
        "productId": "laptop-001",
        "category": "electronics",
        "unitPrice": 600,
        "quantity": 1
      }
    ]
  }
}
```

## Pre-seeded Coupons

| Code | Type | Value | Eligibility |
|------|------|-------|-------------|
| WELCOME100 | FLAT | ₹100 | NEW users, first order, min ₹500 |
| GOLD50 | PERCENT | 50% | GOLD tier, ₹10k+ spend, max ₹500 |
| ELECTRONICS20 | PERCENT | 20% | Electronics category, max ₹1k |
| FASHION15 | PERCENT | 15% | Fashion category, max ₹300 |
| REGULAR200 | FLAT | ₹200 | 3+ orders, min ₹1,500 |
| INDIA25 | PERCENT | 25% | India only, max ₹400 |
| BULK10 | PERCENT | 10% | 5+ items, max ₹500 |

## Project Structure

```
coupon-management/
├── backend/
│   ├── src/
│   │   ├── models/Coupon.js
│   │   ├── services/couponService.js
│   │   ├── routes/couponRoutes.js
│   │   ├── tests/coupon.test.js
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CouponList.jsx
│   │   │   ├── CreateCoupon.jsx
│   │   │   └── FindBestCoupon.jsx
│   │   ├── services/api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Implementation Details

### Coupon Model
- Validates all required fields
- Checks date ranges
- Tracks usage per user
- Calculates discounts (flat or percentage with cap)

### Eligibility Checking
- All criteria are optional (AND logic)
- Missing criteria means no restriction
- Clear error messages for failed checks

### Best Coupon Selection
- Deterministic algorithm (no randomness)
- Multiple tie-breakers ensure consistency
- Returns null if no coupon matches

### Edge Cases
- Empty cart → No coupon
- Discount > cart → Capped
- Expired coupons → Filtered
- Usage exceeded → Not eligible
- Invalid input → Validation errors

## AI Usage

Developed with assistance from Claude AI for code structure, business logic, and UI design.

**Main prompts:**
1. Build coupon system with Node.js and React
2. Implement eligibility checking logic
3. Create best coupon selection algorithm
4. Design responsive UI
5. Write test cases

All code was reviewed and tested manually.

## Deployment

### Backend → Render
1. Push to GitHub
2. Create Web Service on Render
3. Set root directory: `backend`
4. Deploy

### Frontend → Vercel
1. Connect GitHub repo
2. Set root directory: `frontend`
3. Add env var: `VITE_API_URL=<backend-url>/api`
4. Deploy

## License

MIT
