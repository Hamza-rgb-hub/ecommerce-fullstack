const User = require('../models/User');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const user = await User.findById(req.user._id);
    const idx = user.cart.findIndex((i) => i.product.toString() === productId);

    if (idx > -1) {
      user.cart[idx].quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: updated.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user._id);
    const idx = user.cart.findIndex((i) => i.product.toString() === req.params.productId);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Item not in cart' });

    if (quantity <= 0) {
      user.cart.splice(idx, 1);
    } else {
      user.cart[idx].quantity = quantity;
    }
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: updated.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
    await user.save();
    const updated = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, cart: updated.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.json({ success: true, cart: [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
