# Braid eCommerce - Full-Stack Application

A complete, production-ready eCommerce web application built with React + Node.js + MongoDB.

---

## 📁 Project Structure

```
ecommerce/
├── frontend/                      # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Top navigation with search, cart, user menu
│   │   │   ├── Footer.jsx         # Footer with links and newsletter
│   │   │   ├── ProductCard.jsx    # Reusable product card component
│   │   │   ├── CartItem.jsx       # Cart line item component
│   │   │   ├── Sidebar.jsx        # Filters sidebar
│   │   │   ├── ProtectedRoute.jsx # Auth guard component
│   │   │   └── LoadingSpinner.jsx # Spinner, PageLoader, SkeletonCard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    # JWT auth state (login/logout/signup)
│   │   │   └── CartContext.jsx    # Cart state with localStorage persistence
│   │   ├── hooks/
│   │   │   └── useProducts.js     # Custom hooks for product fetching
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Landing page with hero, categories, products
│   │   │   ├── ProductsPage.jsx   # Product listing with filters, sort, pagination
│   │   │   ├── ProductDetailPage.jsx # Product detail with images, reviews
│   │   │   ├── CartPage.jsx       # Cart with summary and checkout
│   │   │   ├── LoginPage.jsx      # Login form with JWT
│   │   │   ├── SignupPage.jsx     # Registration form
│   │   │   └── AdminDashboard.jsx # Admin panel (CRUD products)
│   │   ├── utils/
│   │   │   └── api.js             # Axios instance with interceptors
│   │   ├── App.jsx                # Routes
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # TailwindCSS + custom styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   └── package.json
│
└── backend/                       # Node.js + Express backend
    ├── config/
    │   └── seed.js                # Sample data seeder
    ├── controllers/
    │   ├── authController.js      # Signup, Login, GetMe
    │   ├── productController.js   # CRUD + reviews
    │   └── cartController.js      # Cart CRUD
    ├── middleware/
    │   └── auth.js                # JWT protect + admin guard
    ├── models/
    │   ├── User.js                # User schema + bcrypt
    │   ├── Product.js             # Product schema + reviews
    │   └── Order.js               # Order schema
    ├── routes/
    │   ├── authRoutes.js
    │   ├── productRoutes.js
    │   ├── cartRoutes.js
    │   └── orderRoutes.js
    ├── server.js                  # Express app entry
    ├── .env.example
    └── package.json
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
npm run dev        # Start dev server on port 5000
```

### 2. Frontend Setup

```bash
cd frontend
npm install
# VITE_API_URL=http://localhost:5000/api (default via vite proxy)
npm run dev        # Start dev server on port 5173
```


## 🌐 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | — | Register new user |
| POST | /api/auth/login | — | Login, returns JWT |
| GET | /api/auth/me | User | Get current user |
| GET | /api/products | — | List products (search, filter, paginate) |
| GET | /api/products/:id | — | Get single product |
| POST | /api/products | Admin | Create product |
| PUT | /api/products/:id | Admin | Update product |
| DELETE | /api/products/:id | Admin | Delete product |
| POST | /api/products/:id/reviews | User | Add review |
| GET | /api/cart | User | Get user cart |
| POST | /api/cart | User | Add to cart |
| PUT | /api/cart/:productId | User | Update quantity |
| DELETE | /api/cart/:productId | User | Remove from cart |
| DELETE | /api/cart | User | Clear cart |
| POST | /api/orders | User | Create order |
| GET | /api/orders/mine | User | Get my orders |
| GET | /api/orders | Admin | Get all orders |

### Query Params for GET /api/products
```
?category=Electronics
?search=headphones
?sort=price-asc|price-desc|rating|newest
?minPrice=10&maxPrice=100
?featured=true
?page=1&limit=12
```

## ✅ Production Checklist

- [ ] Set strong JWT_SECRET (32+ random chars)
- [ ] Use MongoDB Atlas for production DB
- [ ] Add rate limiting (`express-rate-limit`)
- [ ] Configure CORS for your frontend domain only
- [ ] Enable Helmet.js for security headers
- [ ] Add input validation (express-validator or zod)
- [ ] Set up image upload (Cloudinary or S3)
- [ ] Configure payment gateway (Stripe)
- [ ] Add error monitoring (Sentry)
- [ ] Run `npm run build` and test the production build
- [ ] Set NODE_ENV=production on server

---

## 🔧 Optional Enhancements

- **Image Upload:** Integrate Cloudinary for product images
- **Payments:** Add Stripe checkout
- **Email:** Nodemailer for order confirmations
- **Search:** Elasticsearch or Atlas Search for full-text search
- **Cache:** Redis for product caching
- **Tests:** Jest + React Testing Library

---

## 🎨 Design System

- **Primary Color:** `#2563eb` (Blue 600)
- **Accent:** `#f97316` (Orange 500)
- **Font:** DM Sans (Google Fonts)
- **Border Radius:** 8px cards, 6px inputs
- **Shadow:** Soft, consistent shadow-sm
