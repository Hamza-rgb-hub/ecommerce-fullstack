import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className="card group hover:shadow-md transition-all duration-300">
      <div className="relative overflow-hidden bg-gray-50 h-48">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://via.placeholder.com/300x200?text=Product' }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.badge && (
            <span className={`badge text-white ${
              product.badge === 'Sale' ? 'bg-red-500' :
              product.badge === 'New' ? 'bg-green-500' :
              product.badge === 'Hot' ? 'bg-orange-500' : 'bg-primary'
            }`}>
              {product.badge}
            </span>
          )}
          {discount > 0 && <span className="badge bg-red-500 text-white">-{discount}%</span>}
        </div>

        {/* Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
            <Heart size={13} />
          </button>
          <Link to={`/products/${product._id}`} className="w-7 h-7 rounded-full bg-white shadow flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
            <Eye size={13} />
          </Link>
        </div>

        {/* Out of stock */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="badge bg-gray-800 text-white text-sm">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-xs text-gray-400 mb-1">{product.brand || product.category}</p>
        <Link to={`/products/${product._id}`} className="font-medium text-sm text-gray-800 hover:text-primary transition-colors line-clamp-2 block mb-2">
          {product.name}
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex stars">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={11} fill={s <= Math.round(product.rating) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.numReviews})</span>
        </div>

        {/* Price + Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through ml-1">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            className="btn-primary py-1.5 px-2.5 text-xs flex items-center gap-1 disabled:opacity-50"
          >
            <ShoppingCart size={12} /> Add
          </button>
        </div>
      </div>
    </div>
  )
}
