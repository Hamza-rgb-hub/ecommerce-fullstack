import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Search, User, ChevronDown, Menu, X, Package, LogOut, Settings, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const categories = ['All', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty']

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)
  const [catDropdown, setCatDropdown] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/products?search=${search}`)
    setSearch('')
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary text-white text-xs py-1.5 text-center">
        Free shipping on orders over $50 | Use code <strong>SAVE10</strong> for 10% off
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="font-bold text-lg text-gray-900">Braid</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
          <div className="flex w-full border border-gray-200 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
            <select className="border-r border-gray-200 px-2 py-2 text-sm text-gray-600 bg-gray-50 focus:outline-none">
              <option>All</option>
              {categories.slice(1).map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 px-3 py-2 text-sm focus:outline-none"
            />
            <button type="submit" className="bg-primary text-white px-4 hover:bg-primary-dark transition-colors">
              <Search size={16} />
            </button>
          </div>
        </form>

        {/* Right icons */}
        <div className="flex items-center gap-3 ml-auto">
          <button className="hidden md:flex items-center gap-1 text-gray-600 hover:text-primary transition-colors text-sm">
            <Heart size={18} />
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setUserDropdown(!userDropdown)}
              className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-primary transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={14} className="text-primary" />
              </div>
              <span className="hidden md:block">{user ? user.name.split(' ')[0] : 'Sign In'}</span>
              <ChevronDown size={14} className="hidden md:block" />
            </button>
            {userDropdown && (
              <div className="absolute right-0 top-10 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                        <Settings size={14} /> Admin Panel
                      </Link>
                    )}
                    <Link to="/orders" onClick={() => setUserDropdown(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50">
                      <Package size={14} /> My Orders
                    </Link>
                    <button onClick={() => { logout(); setUserDropdown(false) }} className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-500">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setUserDropdown(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Sign In</Link>
                    <Link to="/signup" onClick={() => setUserDropdown(false)} className="block px-4 py-2 text-sm hover:bg-gray-50">Create Account</Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative flex items-center gap-1 text-gray-700 hover:text-primary transition-colors">
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
            <span className="hidden md:block text-sm">{totalItems > 0 ? `$${useCartTotal()}` : 'Cart'}</span>
          </Link>

          {/* Mobile menu */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Category nav */}
      <nav className="hidden md:flex border-t border-gray-100 max-w-7xl mx-auto px-4">
        {[
          { label: 'Home', path: '/' },
          { label: 'All Products', path: '/products' },
        ].map(item => (
          <Link key={item.path} to={item.path} className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            {item.label}
          </Link>
        ))}
        <div className="relative" onMouseEnter={() => setCatDropdown(true)} onMouseLeave={() => setCatDropdown(false)}>
          <button className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            Categories <ChevronDown size={14} />
          </button>
          {catDropdown && (
            <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 rounded-b-lg shadow-lg py-1 z-50">
              {categories.slice(1).map(cat => (
                <Link key={cat} to={`/products?category=${cat}`} className="block px-4 py-2 text-sm hover:bg-blue-50 hover:text-primary">
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link to="/products?featured=true" className="px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-primary transition-colors">
          Deals & Offers
        </Link>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
          <form onSubmit={handleSearch} className="flex border border-gray-200 rounded-md overflow-hidden mb-3">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="flex-1 px-3 py-2 text-sm focus:outline-none" />
            <button type="submit" className="bg-primary text-white px-3"><Search size={16} /></button>
          </form>
          <Link to="/" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium">Home</Link>
          <Link to="/products" onClick={() => setMenuOpen(false)} className="block py-2 text-sm font-medium">All Products</Link>
          {categories.slice(1).map(cat => (
            <Link key={cat} to={`/products?category=${cat}`} onClick={() => setMenuOpen(false)} className="block py-1 text-sm text-gray-600 pl-4">
              {cat}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

// Mini helper
function useCartTotal() {
  const { totalPrice } = useCart()
  return totalPrice.toFixed(2)
}
