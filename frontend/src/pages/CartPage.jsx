import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, ArrowRight, Tag } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import CartItem from '../components/CartItem'
import { useCart } from '../context/CartContext'

export default function CartPage() {
  const { cart, totalPrice, totalItems, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!user) { navigate('/login', { state: { from: '/checkout' } }); return }
    navigate('/checkout')
  }

  const shipping = totalPrice > 50 ? 0 : 5.99
  const tax = totalPrice * 0.08
  const grandTotal = totalPrice + shipping + tax

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag size={32} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-400 mb-6">Add some products to get started</p>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Shopping Cart <span className="text-gray-400 font-normal text-base">({totalItems} items)</span></h1>
        <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear Cart</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 card p-6">
          {cart.map(item => <CartItem key={item._id} item={item} />)}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Coupon */}
          <div className="card p-4">
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"><Tag size={14} className="text-primary" /> Have a coupon?</h3>
            <div className="flex gap-2">
              <input placeholder="Enter code" className="input-field" />
              <button className="btn-outline shrink-0 text-sm px-3">Apply</button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card p-6">
            <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                <span className="font-medium">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : 'font-medium'}>
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tax (8%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              {totalPrice > 50 && (
                <div className="flex justify-between text-green-600">
                  <span>Free Shipping Discount</span>
                  <span>-$5.99</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={handleCheckout} className="btn-primary w-full mt-5 py-3 flex items-center justify-center gap-2">
              Proceed to Checkout <ArrowRight size={16} />
            </button>

            <div className="mt-4 text-center">
              <Link to="/products" className="text-sm text-primary hover:underline">
                ← Continue Shopping
              </Link>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-gray-300">
              {['visa', 'mastercard', 'paypal', 'stripe'].map(p => (
                <span key={p} className="text-xs font-medium bg-gray-100 px-2 py-1 rounded text-gray-500">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
