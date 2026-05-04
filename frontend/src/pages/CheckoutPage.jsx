import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle, ChevronRight, CreditCard, Truck, MapPin, ShoppingBag, Lock } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Spinner } from '../components/LoadingSpinner'

const STEPS = ['Cart', 'Shipping', 'Payment', 'Confirm']

const initialAddress = { firstName: '', lastName: '', email: '', phone: '', street: '', city: '', state: '', zip: '', country: 'Pakistan' }

export default function CheckoutPage() {
  const { cart, totalPrice, totalItems, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1) // 1=Shipping, 2=Payment, 3=Confirm
  const [address, setAddress] = useState({ ...initialAddress, email: user?.email || '', firstName: user?.name?.split(' ')[0] || '', lastName: user?.name?.split(' ')[1] || '' })
  const [payMethod, setPayMethod] = useState('COD')
  const [cardInfo, setCardInfo] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [placing, setPlacing] = useState(false)
  const [placed, setPlaced] = useState(null)

  const shipping = totalPrice > 50 ? 0 : 5.99
  const tax = totalPrice * 0.08
  const grandTotal = totalPrice + shipping + tax

  const af = (k, v) => setAddress(p => ({ ...p, [k]: v }))
  const cf = (k, v) => setCardInfo(p => ({ ...p, [k]: v }))

  const validateShipping = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'zip']
    for (const k of required) {
      if (!address[k].trim()) { toast.error(`Please fill: ${k}`); return false }
    }
    return true
  }

  const placeOrder = async () => {
    if (!user) { toast.error('Please login first'); navigate('/login'); return }
    setPlacing(true)
    try {
      const orderData = {
        items: cart.map(i => ({ product: i._id, name: i.name, image: i.image, price: i.price, quantity: i.quantity })),
        shippingAddress: { street: address.street, city: address.city, state: address.state, zip: address.zip, country: address.country },
        paymentMethod: payMethod,
        itemsPrice: totalPrice,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: grandTotal,
      }
      const { data } = await api.post('/orders', orderData)
      clearCart()
      setPlaced(data.order)
      setStep(4)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Try again.')
    }
    setPlacing(false)
  }

  // Empty cart guard
  if (cart.length === 0 && !placed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <Link to="/products" className="btn-primary inline-flex items-center gap-2 mt-4">Shop Now <ChevronRight size={16} /></Link>
      </div>
    )
  }

  // Order Placed Success Screen
  if (step === 4 && placed) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="card p-10">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-400 mb-1">Thank you, <strong>{address.firstName}</strong>! 🎉</p>
          <p className="text-gray-400 text-sm mb-6">Your order has been confirmed and will be delivered soon.</p>

          <div className="bg-gray-50 rounded-xl p-5 text-left mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Order ID</span>
              <span className="font-mono font-semibold text-xs">#{placed._id?.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Items</span>
              <span className="font-medium">{placed.items?.length || totalItems} items</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Payment</span>
              <span className="font-medium">{payMethod === 'COD' ? 'Cash on Delivery' : 'Card'}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Delivery to</span>
              <span className="font-medium text-right">{address.city}, {address.country}</span>
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold">
              <span>Total Paid</span>
              <span className="text-primary">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to="/products" className="btn-outline flex-1">Continue Shopping</Link>
            <Link to="/" className="btn-primary flex-1">Go Home</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Breadcrumb steps */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 text-sm font-medium ${i < step ? 'text-primary' : i === step ? 'text-gray-900' : 'text-gray-300'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? 'bg-primary text-white' : i === step ? 'bg-primary/10 text-primary border border-primary' : 'bg-gray-100 text-gray-400'}`}>
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className="hidden sm:block">{s}</span>
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-gray-300" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Steps */}
        <div className="lg:col-span-2 space-y-6">

          {/* STEP 1: Shipping */}
          {step === 1 && (
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                <MapPin size={18} className="text-primary" /> Shipping Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <input value={address.firstName} onChange={e => af('firstName', e.target.value)} className="input-field" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name *</label>
                  <input value={address.lastName} onChange={e => af('lastName', e.target.value)} className="input-field" placeholder="Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input type="email" value={address.email} onChange={e => af('email', e.target.value)} className="input-field" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input value={address.phone} onChange={e => af('phone', e.target.value)} className="input-field" placeholder="+92 300 1234567" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Street Address *</label>
                  <input value={address.street} onChange={e => af('street', e.target.value)} className="input-field" placeholder="House #, Street, Area" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input value={address.city} onChange={e => af('city', e.target.value)} className="input-field" placeholder="Karachi" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State / Province *</label>
                  <input value={address.state} onChange={e => af('state', e.target.value)} className="input-field" placeholder="Sindh" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP / Postal Code *</label>
                  <input value={address.zip} onChange={e => af('zip', e.target.value)} className="input-field" placeholder="75600" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <select value={address.country} onChange={e => af('country', e.target.value)} className="input-field">
                    {['Pakistan', 'India', 'UAE', 'USA', 'UK', 'Canada', 'Australia'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <button
                onClick={() => { if (validateShipping()) setStep(2) }}
                className="btn-primary w-full mt-6 py-3 flex items-center justify-center gap-2"
              >
                Continue to Payment <ChevronRight size={16} />
              </button>
              <Link to="/cart" className="block text-center text-sm text-gray-400 mt-3 hover:text-primary">← Back to Cart</Link>
            </div>
          )}

          {/* STEP 2: Payment */}
          {step === 2 && (
            <div className="card p-6">
              <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                <CreditCard size={18} className="text-primary" /> Payment Method
              </h2>

              <div className="space-y-3 mb-6">
                {[
                  { id: 'COD', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                  { id: 'CARD', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex', icon: '💳' },
                  { id: 'JAZZCASH', label: 'JazzCash', desc: 'Mobile wallet payment', icon: '📱' },
                  { id: 'EASYPAISA', label: 'Easypaisa', desc: 'Mobile account payment', icon: '📲' },
                ].map(m => (
                  <label key={m.id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${payMethod === m.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" name="pay" value={m.id} checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} className="accent-primary" />
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{m.label}</p>
                      <p className="text-xs text-gray-400">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {payMethod === 'CARD' && (
                <div className="bg-gray-50 rounded-xl p-5 mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Card Number</label>
                    <input value={cardInfo.number} onChange={e => cf('number', e.target.value.replace(/\D/g, '').slice(0, 16))} className="input-field font-mono tracking-widest" placeholder="1234 5678 9012 3456" maxLength={16} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cardholder Name</label>
                    <input value={cardInfo.name} onChange={e => cf('name', e.target.value)} className="input-field" placeholder="John Doe" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date</label>
                      <input value={cardInfo.expiry} onChange={e => cf('expiry', e.target.value)} className="input-field" placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">CVV</label>
                      <input value={cardInfo.cvv} onChange={e => cf('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))} className="input-field" placeholder="•••" maxLength={4} type="password" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Lock size={11} /> Your payment info is encrypted and secure
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-outline flex-1 py-3">← Back</button>
                <button onClick={() => setStep(3)} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2">
                  Review Order <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirm */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Shipping summary */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2"><MapPin size={15} className="text-primary" /> Shipping Address</h3>
                  <button onClick={() => setStep(1)} className="text-xs text-primary hover:underline">Edit</button>
                </div>
                <p className="text-sm text-gray-700">{address.firstName} {address.lastName}</p>
                <p className="text-sm text-gray-500">{address.street}, {address.city}</p>
                <p className="text-sm text-gray-500">{address.state}, {address.zip}, {address.country}</p>
                <p className="text-sm text-gray-500">{address.phone}</p>
              </div>

              {/* Payment summary */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2"><CreditCard size={15} className="text-primary" /> Payment</h3>
                  <button onClick={() => setStep(2)} className="text-xs text-primary hover:underline">Edit</button>
                </div>
                <p className="text-sm text-gray-700">
                  {payMethod === 'COD' ? '💵 Cash on Delivery' : payMethod === 'CARD' ? `💳 Card ending in ${cardInfo.number.slice(-4) || '****'}` : `📱 ${payMethod}`}
                </p>
              </div>

              {/* Items review */}
              <div className="card p-5">
                <h3 className="font-semibold mb-3">Items ({cart.length})</h3>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item._id} className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {placing ? <><Spinner size="sm" /> Placing Order...</> : <><CheckCircle size={18} /> Place Order — ${grandTotal.toFixed(2)}</>}
              </button>
              <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                <Lock size={11} /> Your order is protected and secure
              </p>
            </div>
          )}
        </div>

        {/* Right: Order Summary (always visible) */}
        <div>
          <div className="card p-5 sticky top-24">
            <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
              <ShoppingBag size={16} className="text-primary" /> Order Summary
            </h3>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-4">
              {cart.map(item => (
                <div key={item._id} className="flex items-center gap-2.5">
                  <div className="relative shrink-0">
                    <img src={item.image} alt={item.name} className="w-11 h-11 rounded-lg object-cover border border-gray-100" />
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white rounded-full text-xs flex items-center justify-center font-bold">{item.quantity}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400">${item.price}</p>
                  </div>
                  <span className="text-xs font-semibold shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? 'Free 🎉' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2">
                <span>Total</span>
                <span className="text-primary">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {totalPrice <= 50 && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-3">
                Add ${(50 - totalPrice).toFixed(2)} more for free shipping!
              </p>
            )}

            <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
              {['VISA', 'MC', 'PayPal', 'JCB'].map(b => (
                <span key={b} className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
