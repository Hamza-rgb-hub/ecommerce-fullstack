import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Heart, Share2, Truck, Shield, RefreshCw, Star, ChevronRight, Minus, Plus } from 'lucide-react'
import { useProduct } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { PageLoader } from '../components/LoadingSpinner'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { product, loading, error } = useProduct(id)
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  if (loading) return <PageLoader />
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>
  if (!product) return null

  const images = [product.image, ...(product.images || [])].filter(Boolean)
  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight size={12} />
        <Link to="/products" className="hover:text-primary">Products</Link>
        <ChevronRight size={12} />
        <Link to={`/products?category=${product.category}`} className="hover:text-primary">{product.category}</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 line-clamp-1 max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="card overflow-hidden mb-3 aspect-square">
            <img src={images[activeImg]} alt={product.name} className="w-full h-full object-contain p-4" />
          </div>
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`w-16 h-16 rounded-lg border-2 overflow-hidden ${i === activeImg ? 'border-primary' : 'border-gray-200'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-1">{product.brand || product.category}</p>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h1>
            </div>
            <button className="p-2 rounded-full border border-gray-200 hover:border-primary hover:text-primary transition-colors">
              <Heart size={18} />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex stars text-lg">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={16} fill={s <= Math.round(product.rating) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-sm text-gray-400">({product.numReviews} reviews)</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6 py-4 border-y border-gray-100">
            <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-lg text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                <span className="badge bg-red-100 text-red-600 text-sm">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>

          {/* Quantity + Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Minus size={14} />
              </button>
              <span className="px-4 text-sm font-medium w-12 text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors">
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={() => addToCart(product, qty)}
              disabled={product.stock === 0}
              className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 disabled:opacity-50"
            >
              <ShoppingCart size={16} /> Add to Cart
            </button>
            <button className="p-2.5 border border-gray-200 rounded-md hover:border-gray-400 transition-colors">
              <Share2 size={16} />
            </button>
          </div>

          {/* Features */}
          <div className="space-y-2 mb-6">
            {[
              [Truck, 'Free Delivery', 'On orders over $50'],
              [Shield, 'Warranty', '1-year manufacturer warranty'],
              [RefreshCw, 'Easy Return', '30-day return policy'],
            ].map(([Icon, title, desc]) => (
              <div key={title} className="flex items-center gap-3 text-sm">
                <Icon size={15} className="text-primary" />
                <span className="font-medium">{title}</span>
                <span className="text-gray-400">— {desc}</span>
              </div>
            ))}
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-sm mb-3">Product Details</h3>
            <table className="w-full text-sm">
              <tbody>
                {[['Category', product.category], ['Brand', product.brand || 'N/A'], ['Stock', product.stock], ['SKU', `PRD-${product._id?.slice(-6)?.toUpperCase()}`]].map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-200 last:border-0">
                    <td className="py-1.5 text-gray-400 w-24">{k}</td>
                    <td className="py-1.5 font-medium">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {product.reviews?.length > 0 && (
        <div className="mt-12">
          <h2 className="font-bold text-xl mb-6">Customer Reviews</h2>
          <div className="grid gap-4">
            {product.reviews.map((r, i) => (
              <div key={i} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {r.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-sm">{r.name}</span>
                  </div>
                  <div className="flex stars text-sm">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
