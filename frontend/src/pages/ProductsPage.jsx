import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Grid, List, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Sidebar from '../components/Sidebar'
import { SkeletonCard } from '../components/LoadingSpinner'
import api from '../utils/api'

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rating' },
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: '',
    maxPrice: '',
    rating: '',
    page: 1,
    featured: searchParams.get('featured') || '',
  })

  useEffect(() => {
    setLoading(true)
    setError(null)
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== '' && v !== null))
    api.get('/products', { params: { ...params, limit: 12 } })
      .then(({ data }) => {
        setProducts(data.products)
        setTotal(data.total)
        setPages(data.pages)
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [JSON.stringify(filters)])

  const updateFilter = (changes) => setFilters(prev => ({ ...prev, ...changes, page: 1 }))
  const resetFilters = () => setFilters({ category: '', search: '', sort: 'newest', minPrice: '', maxPrice: '', rating: '', page: 1, featured: '' })

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 mb-4">
        <span>Home</span> / <span className="text-gray-700">Products</span>
        {filters.category && <span> / <span className="text-gray-700">{filters.category}</span></span>}
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">
            {filters.category || filters.search ? `${filters.category || 'Search'} Results` : 'All Products'}
          </h1>
          {!loading && <p className="text-sm text-gray-400">{total} products found</p>}
        </div>

        {/* Search bar */}
        <input
          value={filters.search}
          onChange={e => updateFilter({ search: e.target.value })}
          placeholder="Search products..."
          className="input-field w-48"
        />

        {/* Sort */}
        <select value={filters.sort} onChange={e => updateFilter({ sort: e.target.value })} className="input-field w-44">
          {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* View toggle */}
        <div className="flex border border-gray-200 rounded-md overflow-hidden">
          <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}>
            <Grid size={16} />
          </button>
          <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-primary text-white' : 'hover:bg-gray-50'}`}>
            <List size={16} />
          </button>
        </div>

        {/* Mobile filter btn */}
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 border border-gray-200 px-3 py-2 rounded-md text-sm md:hidden">
          <SlidersHorizontal size={14} /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className={`w-56 shrink-0 ${showFilters ? 'block fixed inset-0 z-50 bg-white p-4 overflow-auto' : 'hidden md:block'}`}>
          {showFilters && (
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold">Filters</span>
              <button onClick={() => setShowFilters(false)}><X size={18} /></button>
            </div>
          )}
          <Sidebar filters={filters} onChange={updateFilter} onReset={resetFilters} />
        </div>
        {showFilters && <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowFilters(false)} />}

        {/* Products */}
        <div className="flex-1 min-w-0">
          {error && <div className="text-center py-12 text-red-500">{error}</div>}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
              <button onClick={resetFilters} className="btn-primary mt-4">Clear Filters</button>
            </div>
          )}

          <div className={view === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'
            : 'space-y-3'
          }>
            {loading
              ? Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : products.map(p => (
                view === 'list'
                  ? <ListProductCard key={p._id} product={p} />
                  : <ProductCard key={p._id} product={p} />
              ))
            }
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pages }, (_, i) => i + 1).map(pg => (
                <button
                  key={pg}
                  onClick={() => setFilters(prev => ({ ...prev, page: pg }))}
                  className={`w-9 h-9 rounded-md text-sm font-medium ${filters.page === pg ? 'bg-primary text-white' : 'border border-gray-200 hover:border-primary hover:text-primary'}`}
                >
                  {pg}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ListProductCard({ product }) {
  const { addToCart } = require('../context/CartContext').useCart ? require('../context/CartContext') : { addToCart: () => {} }
  return (
    <div className="card flex gap-4 p-4 hover:shadow-md transition-shadow">
      <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-lg shrink-0" />
      <div className="flex-1">
        <p className="text-xs text-gray-400">{product.category}</p>
        <a href={`/products/${product._id}`} className="font-medium hover:text-primary transition-colors">{product.name}</a>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <a href={`/products/${product._id}`} className="btn-primary text-sm">View Details</a>
        </div>
      </div>
    </div>
  )
}
