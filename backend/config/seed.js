const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const products = [
  { name: 'Wireless Noise-Cancelling Headphones', price: 89.99, originalPrice: 129.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category: 'Electronics', brand: 'SoundMax', stock: 45, rating: 4.5, numReviews: 128, featured: true, badge: 'Best Seller', description: 'Premium wireless headphones with active noise cancellation, 30-hour battery life, and superior sound quality.' },
  { name: 'Smart Watch Series 5', price: 199.99, originalPrice: 249.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'Electronics', brand: 'TechWear', stock: 30, rating: 4.7, numReviews: 89, featured: true, badge: 'New', description: 'Advanced smartwatch with health monitoring, GPS, and 5-day battery life.' },
  { name: 'DSLR Camera 24MP', price: 549.99, originalPrice: 699.99, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', category: 'Electronics', brand: 'PhotoPro', stock: 12, rating: 4.8, numReviews: 54, featured: true, description: 'Professional DSLR with 24MP sensor, 4K video, and dual card slots.' },
  { name: 'iPhone 13 Pro Max', price: 999.99, originalPrice: 1099.99, image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400', category: 'Electronics', brand: 'Apple', stock: 25, rating: 4.9, numReviews: 342, featured: true, badge: 'Hot', description: 'Latest iPhone with A15 Bionic chip, Pro camera system, and Super Retina display.' },
  { name: 'Mechanical Gaming Keyboard', price: 79.99, originalPrice: 99.99, image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400', category: 'Electronics', brand: 'GameForce', stock: 60, rating: 4.3, numReviews: 210, description: 'RGB mechanical keyboard with Cherry MX switches, anti-ghosting, and programmable keys.' },
  { name: 'Wireless Gaming Mouse', price: 59.99, originalPrice: 79.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', category: 'Electronics', brand: 'GameForce', stock: 80, rating: 4.4, numReviews: 178, description: 'High-precision wireless gaming mouse with 16000 DPI and 70-hour battery.' },
  { name: 'Men\'s Running Sneakers', price: 69.99, originalPrice: 89.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category: 'Sports', brand: 'RunFast', stock: 100, rating: 4.2, numReviews: 95, featured: false, badge: 'Sale', description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper.' },
  { name: 'Yoga Mat Premium', price: 34.99, originalPrice: 49.99, image: 'https://images.unsplash.com/photo-1601925228606-4c14cb8e7b74?w=400', category: 'Sports', brand: 'ZenFit', stock: 150, rating: 4.6, numReviews: 230, description: 'Non-slip premium yoga mat, 6mm thick, eco-friendly material.' },
  { name: 'Classic White T-Shirt', price: 19.99, originalPrice: 29.99, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', category: 'Clothing', brand: 'BasicWear', stock: 200, rating: 4.1, numReviews: 445, description: '100% cotton classic fit white t-shirt, available in all sizes.' },
  { name: 'Slim Fit Jeans', price: 49.99, originalPrice: 69.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', category: 'Clothing', brand: 'DenimCo', stock: 85, rating: 4.3, numReviews: 167, description: 'Slim fit stretch denim jeans with 5-pocket design.' },
  { name: 'Coffee Maker Deluxe', price: 89.99, originalPrice: 119.99, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', category: 'Home & Garden', brand: 'BrewMaster', stock: 40, rating: 4.5, numReviews: 122, description: '12-cup programmable coffee maker with built-in grinder and thermal carafe.' },
  { name: 'Scented Candle Set', price: 24.99, originalPrice: 34.99, image: 'https://images.unsplash.com/photo-1602178506688-e07cc0c62e69?w=400', category: 'Home & Garden', brand: 'AromaLife', stock: 200, rating: 4.7, numReviews: 88, description: 'Set of 6 premium soy wax candles in various relaxing scents.' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('Connected to MongoDB');

    await Product.deleteMany();
    await User.deleteMany();

    await Product.insertMany(products);
    console.log(`${products.length} products seeded`);

    await User.create({ name: 'hamza', email: 'hamza@gmail.com', password: '112233', role: 'admin' });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
