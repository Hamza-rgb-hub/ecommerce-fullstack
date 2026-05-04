const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, default: 0 },
    image: { type: String, required: true },
    images: [String],
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Automotive', 'Food'],
    },
    brand: { type: String, default: '' },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sold: { type: Number, default: 0 },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    badge: { type: String, default: '' },
  },
  { timestamps: true }
);

// Calculate average rating
productSchema.methods.calcAvgRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    this.rating =
      this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);
