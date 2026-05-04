import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, RefreshCw, Headphones, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { SkeletonCard } from '../components/LoadingSpinner'
import api from '../utils/api'

const bannerSlides = [
  {
    title: 'Latest Trending Electronic Items',
    subtitle: 'Discover the best deals on top electronics',
    // Headphones image is black/silver — use teal-green matching the design thumbnail exactly
    bgFrom: '#7ecac3',
    bgTo: '#a8dcd9',
    textColor: '#1a4a47',
    btnColor: '#1a4a47',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    link: '/products?category=Electronics',
    tag: 'Electronics',
  },
  {
    title: 'Smart Watches & Wearables',
    subtitle: 'Stay connected in style all day',
    // Watch image — warm gold tones
    bgFrom: '#c9a96e',
    bgTo: '#e8cc98',
    textColor: '#3d2a0a',
    btnColor: '#3d2a0a',
    img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    link: '/products?category=Electronics',
    tag: 'Wearables',
  },
  {
    title: 'Fashion Forward Collection',
    subtitle: 'Street style essentials for every look',
    // Sneakers image — clean orange/red tones
    bgFrom: '#e8825a',
    bgTo: '#f5ab8a',
    textColor: '#3a1200',
    btnColor: '#3a1200',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    link: '/products?category=Clothing',
    tag: 'Fashion',
  },
  {
    title: 'Pro Camera & Photography Gear',
    subtitle: 'Capture life in stunning clarity',
    // Camera image — dark moody blacks
    bgFrom: '#3a4a5c',
    bgTo: '#5a6e82',
    textColor: '#e8f0f8',
    btnColor: '#ffffff',
    img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80',
    link: '/products?category=Electronics',
    tag: 'Photography',
  },
]

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
  { icon: Shield, title: 'Secure Payment', desc: '100% safe transactions' },
  { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
  { icon: Headphones, title: '24/7 Support', desc: 'Dedicated team ready' },
]

const categoryCards = [
  { name: 'Electronics', img: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=200', color: 'bg-blue-50' },
  { name: 'Clothing', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=200', color: 'bg-pink-50' },
  { name: 'Sports', img: 'https://images.unsplash.com/photo-1601925228606-4c14cb8e7b74?w=200', color: 'bg-green-50' },
  { name: 'Home & Garden', img: 'https://images.unsplash.com/photo-1602178506688-e07cc0c62e69?w=200', color: 'bg-amber-50' },
]

export default function HomePage() {
  const [slide, setSlide] = useState(0)
  const [featured, setFeatured] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false)
      setTimeout(() => { setSlide(s => (s + 1) % bannerSlides.length); setFade(true) }, 300)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const goSlide = (i) => { setFade(false); setTimeout(() => { setSlide(i); setFade(true) }, 250) }

  useEffect(() => {
    const load = async () => {
      try {
        const [f, d] = await Promise.all([
          api.get('/products', { params: { featured: true, limit: 8 } }),
          api.get('/products', { params: { limit: 8, sort: 'price-asc' } }),
        ])
        setFeatured(f.data.products)
        setDeals(d.data.products)
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const cur = bannerSlides[slide]

  return (
    <div>
      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar categories */}
          <div className="hidden lg:block card py-2">
            <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">All Categories</p>
            {['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Beauty', 'Books', 'Toys', 'Automotive', 'Food'].map(cat => (
              <Link key={cat} to={`/products?category=${cat}`} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-primary transition-colors border-b border-gray-50 last:border-0">
                {cat}
              </Link>
            ))}
          </div>

          {/* Main banner — colors pulled from each image */}
          <div
            className="lg:col-span-2 rounded-xl overflow-hidden relative min-h-[280px] flex items-center transition-all duration-500"
            style={{ background: `linear-gradient(135deg, ${cur.bgFrom} 0%, ${cur.bgTo} 100%)` }}
          >
            {/* Subtle noise overlay for depth */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

            <div className={`p-8 z-10 flex-1 transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
              <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 opacity-80"
                style={{ background: 'rgba(255,255,255,0.25)', color: cur.textColor }}>
                {cur.tag}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight" style={{ color: cur.textColor }}>
                {cur.title}
              </h2>
              <p className="text-sm mb-6 opacity-80" style={{ color: cur.textColor }}>{cur.subtitle}</p>
              <Link
                to={cur.link}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold hover:shadow-xl transition-all duration-200 hover:scale-105"
                style={{ background: cur.btnColor, color: cur.btnColor === '#ffffff' ? '#333' : 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.15)' }}
              >
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>

            {/* Product image — sized & positioned to look natural */}
            <div className={`absolute right-0 bottom-0 h-full w-1/2 flex items-end justify-center transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}>
              <img
                src={cur.img}
                alt={cur.title}
                className="h-[90%] w-full object-contain object-bottom drop-shadow-xl"
                style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.18))' }}
              />
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-4 left-8 flex gap-2 z-20">
              {bannerSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goSlide(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === slide ? '24px' : '8px',
                    height: '8px',
                    background: i === slide ? cur.btnColor : 'rgba(255,255,255,0.5)',
                  }}
                />
              ))}
            </div>

            {/* Arrow controls */}
            <button
              onClick={() => goSlide((slide - 1 + bannerSlides.length) % bannerSlides.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md z-20 transition-all"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => goSlide((slide + 1) % bannerSlides.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md z-20 transition-all"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Side banners */}
          <div className="hidden lg:flex flex-col gap-4">
            <div className="flex-1 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-5 text-white relative overflow-hidden">
              <p className="text-xs font-medium text-white/80">Deals & Offers</p>
              <h3 className="font-bold mt-1 text-lg">Smart Devices</h3>
              <p className="text-xs text-white/80 mt-1">Up to 40% off</p>
              <Link to="/products?category=Electronics" className="inline-block mt-3 text-xs bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30">
                Explore →
              </Link>
              <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120" alt="" className="absolute right-2 bottom-0 h-24 object-contain opacity-80" />
            </div>
            <div className="flex-1 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white relative overflow-hidden">
              <p className="text-xs font-medium text-white/80">Home & Outdoor</p>
              <h3 className="font-bold mt-1 text-lg">Fresh Picks</h3>
              <p className="text-xs text-white/80 mt-1">New arrivals daily</p>
              <Link to="/products?category=Home+%26+Garden" className="inline-block mt-3 text-xs bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30">
                Browse →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Icon size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">{title}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Category cards */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <h2 className="font-bold text-lg mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categoryCards.map(cat => (
            <Link key={cat.name} to={`/products?category=${cat.name}`} className={`card ${cat.color} p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow group`}>
              <img src={cat.img} alt={cat.name} className="w-20 h-20 object-contain group-hover:scale-105 transition-transform" />
              <span className="text-sm font-semibold">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-lg">Latest Trending Electronic Items</h2>
            <p className="text-xs text-gray-400">Handpicked top products</p>
          </div>
          <Link to="/products?featured=true" className="text-sm text-primary hover:underline flex items-center gap-1">
            Browse all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : featured.map(p => <ProductCard key={p._id} product={p} />)
          }
        </div>
      </section>

      {/* Deals & Offers Banner */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-400 p-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
          <div>
            <h3 className="font-bold text-2xl mb-1">Deals & offers</h3>
            <p className="text-white/80">Best deals on all products across all categories</p>
          </div>
          <div className="flex gap-3 text-center">
            {[['02', 'Days'], ['14', 'Hours'], ['37', 'Mins'], ['58', 'Secs']].map(([n, l]) => (
              <div key={l} className="bg-white/20 rounded-lg p-3 min-w-14">
                <p className="text-2xl font-bold">{n}</p>
                <p className="text-xs text-white/80">{l}</p>
              </div>
            ))}
          </div>
          <Link to="/products" className="btn-primary bg-white text-primary hover:bg-gray-100 shrink-0">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Deals Products */}
      <section className="max-w-7xl mx-auto px-4 py-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Deals & Offers</h2>
          <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1">
            Browse all <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : deals.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)
          }
        </div>
      </section>

      {/* Supplier CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        <div className="rounded-xl bg-cover bg-center relative overflow-hidden" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1586880244386-8b3e34c8382c?w=1200)' }}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative p-10 text-white">
            <h3 className="text-2xl font-bold mb-2">An easy way to send requests to all suppliers</h3>
            <p className="text-white/80 mb-6 max-w-md">Join thousands of satisfied customers shopping on Braid marketplace</p>
            <div className="flex gap-3">
              <Link to="/signup" className="btn-primary">Get Started</Link>
              <Link to="/products" className="btn-outline border-white text-white hover:bg-white hover:text-gray-800">Learn More</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
