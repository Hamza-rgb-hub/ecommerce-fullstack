import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100">
      <Link to={`/products/${item._id}`}>
        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover border border-gray-100 shrink-0" />
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item._id}`} className="font-medium text-sm hover:text-primary transition-colors line-clamp-2">{item.name}</Link>
        <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
            <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Minus size={12} />
            </button>
            <span className="px-3 text-sm font-medium">{item.quantity}</span>
            <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Plus size={12} />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
            <button onClick={() => removeFromCart(item._id)} className="text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
