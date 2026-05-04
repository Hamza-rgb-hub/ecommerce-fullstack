// import { useState, useEffect } from 'react'
// import { Package, Users, ShoppingBag, DollarSign, Plus, Edit, Trash2, X, Save } from 'lucide-react'
// import api from '../utils/api'
// import toast from 'react-hot-toast'
// import { Spinner } from '../components/LoadingSpinner'

// const EMPTY_PRODUCT = {
//   name: '', price: '', originalPrice: '', image: '', category: 'Electronics',
//   brand: '', stock: '', description: '', featured: false, badge: '',
// }
// const CATEGORIES = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Automotive', 'Food', 'Toys']

// export default function AdminDashboard() {
//   const [tab, setTab] = useState('products')
//   const [products, setProducts] = useState([])
//   const [stats, setStats] = useState({ products: 0, revenue: 0, orders: 0, users: 0 })
//   const [loading, setLoading] = useState(true)
//   const [saving, setSaving] = useState(false)
//   const [modal, setModal] = useState(false)
//   const [editing, setEditing] = useState(null)
//   const [form, setForm] = useState(EMPTY_PRODUCT)

//   useEffect(() => { fetchProducts() }, [])

//   const fetchProducts = async () => {
//     setLoading(true)
//     try {
//       const { data } = await api.get('/products', { params: { limit: 100 } })
//       setProducts(data.products)
//       setStats(prev => ({ ...prev, products: data.total }))
//     } catch {}
//     setLoading(false)
//   }

//   const openCreate = () => { setEditing(null); setForm(EMPTY_PRODUCT); setModal(true) }
//   const openEdit = (p) => {
//     setEditing(p._id)
//     setForm({ name: p.name, price: p.price, originalPrice: p.originalPrice || '', image: p.image, category: p.category, brand: p.brand || '', stock: p.stock, description: p.description, featured: p.featured, badge: p.badge || '' })
//     setModal(true)
//   }

//   const handleSave = async () => {
//     if (!form.name || !form.price || !form.image || !form.description || !form.stock) return toast.error('Fill required fields')
//     setSaving(true)
//     try {
//       if (editing) {
//         await api.put(`/products/${editing}`, form)
//         toast.success('Product updated')
//       } else {
//         await api.post('/products', form)
//         toast.success('Product created')
//       }
//       fetchProducts()
//       setModal(false)
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error saving product')
//     }
//     setSaving(false)
//   }

//   const handleDelete = async (id, name) => {
//     if (!confirm(`Delete "${name}"?`)) return
//     try {
//       await api.delete(`/products/${id}`)
//       toast.success('Product deleted')
//       fetchProducts()
//     } catch {
//       toast.error('Delete failed')
//     }
//   }

//   const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//           <p className="text-sm text-gray-400">Manage your store</p>
//         </div>
//         <button onClick={openCreate} className="btn-primary flex items-center gap-2">
//           <Plus size={16} /> Add Product
//         </button>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
//         {[
//           { icon: Package, label: 'Products', value: stats.products, color: 'bg-blue-50 text-blue-600' },
//           { icon: ShoppingBag, label: 'Orders', value: '—', color: 'bg-purple-50 text-purple-600' },
//           { icon: DollarSign, label: 'Revenue', value: '—', color: 'bg-green-50 text-green-600' },
//           { icon: Users, label: 'Customers', value: '—', color: 'bg-orange-50 text-orange-600' },
//         ].map(({ icon: Icon, label, value, color }) => (
//           <div key={label} className="card p-5 flex items-center gap-4">
//             <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
//               <Icon size={22} />
//             </div>
//             <div>
//               <p className="text-gray-400 text-xs">{label}</p>
//               <p className="text-xl font-bold">{value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 border-b border-gray-200 mb-6">
//         {['products', 'orders'].map(t => (
//           <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${tab === t ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
//             {t}
//           </button>
//         ))}
//       </div>

//       {/* Products Table */}
//       {tab === 'products' && (
//         <div className="card overflow-hidden">
//           {loading ? (
//             <div className="flex justify-center py-12"><Spinner size="lg" /></div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50 text-left">
//                   <tr>
//                     {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
//                       <th key={h} className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {products.map(p => (
//                     <tr key={p._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-3">
//                           <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
//                           <div>
//                             <p className="font-medium line-clamp-1 max-w-xs">{p.name}</p>
//                             {p.featured && <span className="text-xs text-primary">Featured</span>}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3 text-gray-500">{p.category}</td>
//                       <td className="px-4 py-3">
//                         <span className="font-semibold">${p.price}</span>
//                         {p.originalPrice > p.price && <span className="text-xs text-gray-400 line-through ml-1">${p.originalPrice}</span>}
//                       </td>
//                       <td className="px-4 py-3">
//                         <span className={`badge ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
//                           {p.stock} left
//                         </span>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-1">
//                           <span className="text-yellow-400">★</span>
//                           <span>{p.rating.toFixed(1)}</span>
//                           <span className="text-gray-400">({p.numReviews})</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           <button onClick={() => openEdit(p)} className="p-1.5 rounded-md hover:bg-blue-50 hover:text-primary transition-colors">
//                             <Edit size={14} />
//                           </button>
//                           <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-500 transition-colors">
//                             <Trash2 size={14} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       )}

//       {tab === 'orders' && (
//         <div className="text-center py-16 text-gray-400">
//           <ShoppingBag size={40} className="mx-auto mb-3 opacity-40" />
//           <p>Orders management coming soon</p>
//         </div>
//       )}

//       {/* Product Modal */}
//       {modal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div className="absolute inset-0 bg-black/50" onClick={() => setModal(false)} />
//           <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
//             <div className="flex items-center justify-between p-6 border-b border-gray-100">
//               <h2 className="font-bold text-lg">{editing ? 'Edit Product' : 'Add New Product'}</h2>
//               <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
//             </div>
//             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium mb-1">Product Name *</label>
//                 <input value={form.name} onChange={e => f('name', e.target.value)} className="input-field" placeholder="Enter product name" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Price *</label>
//                 <input type="number" value={form.price} onChange={e => f('price', e.target.value)} className="input-field" placeholder="0.00" min="0" step="0.01" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Original Price</label>
//                 <input type="number" value={form.originalPrice} onChange={e => f('originalPrice', e.target.value)} className="input-field" placeholder="0.00" min="0" step="0.01" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Category *</label>
//                 <select value={form.category} onChange={e => f('category', e.target.value)} className="input-field">
//                   {CATEGORIES.map(c => <option key={c}>{c}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Brand</label>
//                 <input value={form.brand} onChange={e => f('brand', e.target.value)} className="input-field" placeholder="Brand name" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Stock *</label>
//                 <input type="number" value={form.stock} onChange={e => f('stock', e.target.value)} className="input-field" placeholder="0" min="0" />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium mb-1">Badge</label>
//                 <select value={form.badge} onChange={e => f('badge', e.target.value)} className="input-field">
//                   <option value="">None</option>
//                   {['New', 'Sale', 'Hot', 'Best Seller'].map(b => <option key={b}>{b}</option>)}
//                 </select>
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium mb-1">Image URL *</label>
//                 <input value={form.image} onChange={e => f('image', e.target.value)} className="input-field" placeholder="https://..." />
//                 {form.image && <img src={form.image} alt="" className="mt-2 h-20 rounded-lg object-cover" />}
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium mb-1">Description *</label>
//                 <textarea value={form.description} onChange={e => f('description', e.target.value)} className="input-field h-24 resize-none" placeholder="Product description..." />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input type="checkbox" checked={form.featured} onChange={e => f('featured', e.target.checked)} className="accent-primary" />
//                   <span className="text-sm font-medium">Featured product</span>
//                 </label>
//               </div>
//             </div>
//             <div className="flex gap-3 p-6 border-t border-gray-100">
//               <button onClick={() => setModal(false)} className="btn-outline flex-1">Cancel</button>
//               <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
//                 {saving ? <Spinner size="sm" /> : <><Save size={14} /> {editing ? 'Update' : 'Create'}</>}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }




import { useState, useEffect } from 'react'
import {
  Package, Users, ShoppingBag, DollarSign, Plus, Edit, Trash2, X, Save,
  ChevronDown, Eye, TrendingUp, Clock, CheckCircle, XCircle, Truck, RefreshCw,
} from 'lucide-react'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Spinner } from '../components/LoadingSpinner'

const EMPTY_PRODUCT = {
  name: '', price: '', originalPrice: '', image: '', category: 'Electronics',
  brand: '', stock: '', description: '', featured: false, badge: '',
}
const CATEGORIES = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Automotive', 'Food', 'Toys']

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-100 text-blue-700',    icon: RefreshCw },
  shipped:    { label: 'Shipped',    color: 'bg-purple-100 text-purple-700', icon: Truck },
  delivered:  { label: 'Delivered',  color: 'bg-green-100 text-green-700',   icon: CheckCircle },
  cancelled:  { label: 'Cancelled',  color: 'bg-red-100 text-red-600',       icon: XCircle },
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('products')

  // Products state
  const [products, setProducts] = useState([])
  const [prodLoading, setProdLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)

  // Orders state
  const [orders, setOrders] = useState([])
  const [ordLoading, setOrdLoading] = useState(false)
  const [orderFilter, setOrderFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  // Stats (derived)
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 })

  useEffect(() => { fetchProducts() }, [])
  useEffect(() => { if (tab === 'orders') fetchOrders() }, [tab])

  // ─── Products ────────────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    setProdLoading(true)
    try {
      const { data } = await api.get('/products', { params: { limit: 100 } })
      setProducts(data.products)
      setStats(prev => ({ ...prev, products: data.total }))
    } catch {}
    setProdLoading(false)
  }

  const openCreate = () => { setEditing(null); setForm(EMPTY_PRODUCT); setModal(true) }
  const openEdit = (p) => {
    setEditing(p._id)
    setForm({ name: p.name, price: p.price, originalPrice: p.originalPrice || '', image: p.image, category: p.category, brand: p.brand || '', stock: p.stock, description: p.description, featured: p.featured, badge: p.badge || '' })
    setModal(true)
  }
  const handleSave = async () => {
    if (!form.name || !form.price || !form.image || !form.description || !form.stock) return toast.error('Fill required fields')
    setSaving(true)
    try {
      editing ? await api.put(`/products/${editing}`, form) : await api.post('/products', form)
      toast.success(editing ? 'Product updated' : 'Product created')
      fetchProducts(); setModal(false)
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving') }
    setSaving(false)
  }
  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await api.delete(`/products/${id}`)
      toast.success('Product deleted'); fetchProducts()
    } catch { toast.error('Delete failed') }
  }
  const fld = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  // ─── Orders ──────────────────────────────────────────────────────────────────
  const fetchOrders = async () => {
    setOrdLoading(true)
    try {
      const { data } = await api.get('/orders')
      setOrders(data.orders)
      const totalRevenue = data.orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0)
      setStats(prev => ({ ...prev, orders: data.orders.length, revenue: totalRevenue }))
    } catch (err) {
      toast.error('Could not load orders')
    }
    setOrdLoading(false)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId)
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus })
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o))
      toast.success(`Order marked as ${newStatus}`)
    } catch { toast.error('Status update failed') }
    setUpdatingStatus(null)
  }

  const filteredOrders = orderFilter === 'all'
    ? orders
    : orders.filter(o => o.status === orderFilter)

  // Revenue only from non-cancelled
  const liveRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.totalPrice || 0), 0)

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-400">Manage your store</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Package,  label: 'Products', value: stats.products,                     color: 'bg-blue-50 text-blue-600',   sub: 'total listed' },
          { icon: ShoppingBag, label: 'Orders', value: stats.orders || orders.length,     color: 'bg-purple-50 text-purple-600', sub: 'all time' },
          { icon: DollarSign, label: 'Revenue', value: `$${liveRevenue.toFixed(0)}`,       color: 'bg-green-50 text-green-600', sub: 'excl. cancelled' },
          { icon: TrendingUp,  label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: 'bg-orange-50 text-orange-600', sub: 'completed' },
        ].map(({ icon: Icon, label, value, color, sub }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-gray-400 text-xs">{label}</p>
              <p className="text-xl font-bold">{value}</p>
              <p className="text-gray-300 text-xs">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 mb-6">
        {[
          { id: 'products', label: 'Products', count: stats.products },
          { id: 'orders',   label: 'Orders',   count: orders.length },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors flex items-center gap-2 ${tab === t.id ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t.label}
            {t.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${tab === t.id ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── PRODUCTS TAB ──────────────────────────────────────── */}
      {tab === 'products' && (
        <div className="card overflow-hidden">
          {prodLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Package size={40} className="mx-auto mb-3 opacity-30" />
              <p>No products yet. Add your first one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => (
                    <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover border border-gray-100" onError={e => { e.target.src = 'https://via.placeholder.com/40' }} />
                          <div>
                            <p className="font-medium line-clamp-1 max-w-[200px]">{p.name}</p>
                            {p.featured && <span className="text-xs text-primary">★ Featured</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{p.category}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold">${p.price}</span>
                        {p.originalPrice > p.price && <span className="text-xs text-gray-400 line-through ml-1">${p.originalPrice}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`badge ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
                          {p.stock} left
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span>{p.rating.toFixed(1)}</span>
                          <span className="text-gray-400 text-xs">({p.numReviews})</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-md hover:bg-blue-50 hover:text-primary transition-colors" title="Edit">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 rounded-md hover:bg-red-50 hover:text-red-500 transition-colors" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── ORDERS TAB ────────────────────────────────────────── */}
      {tab === 'orders' && (
        <div>
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {['all', ...Object.keys(STATUS_CONFIG)].map(s => {
              const count = s === 'all' ? orders.length : orders.filter(o => o.status === s).length
              const cfg = STATUS_CONFIG[s]
              return (
                <button
                  key={s}
                  onClick={() => setOrderFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${orderFilter === s
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                >
                  {s === 'all' ? 'All Orders' : STATUS_CONFIG[s].label} ({count})
                </button>
              )
            })}
          </div>

          {ordLoading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : filteredOrders.length === 0 ? (
            <div className="card text-center py-16 text-gray-400">
              <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">No {orderFilter !== 'all' ? orderFilter : ''} orders found</p>
              <p className="text-sm mt-1">Orders placed by customers will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
                const StatusIcon = cfg.icon
                const isExpanded = expandedOrder === order._id

                return (
                  <div key={order._id} className="card overflow-hidden">
                    {/* Order header row */}
                    <div className="flex flex-wrap items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedOrder(isExpanded ? null : order._id)}>
                      {/* Order ID + Date */}
                      <div className="min-w-[140px]">
                        <p className="font-mono text-xs text-gray-400">#{order._id?.slice(-8).toUpperCase()}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>

                      {/* Customer */}
                      <div className="flex-1 min-w-[140px]">
                        <p className="text-sm font-medium">{order.user?.name || 'Guest'}</p>
                        <p className="text-xs text-gray-400">{order.user?.email || '—'}</p>
                      </div>

                      {/* Items preview */}
                      <div className="flex items-center gap-1 shrink-0">
                        {order.items?.slice(0, 3).map((item, i) => (
                          <img key={i} src={item.image} alt="" className="w-8 h-8 rounded-md object-cover border border-gray-100" onError={e => { e.target.src = 'https://via.placeholder.com/32' }} />
                        ))}
                        {order.items?.length > 3 && (
                          <span className="w-8 h-8 rounded-md bg-gray-100 text-gray-500 text-xs flex items-center justify-center font-medium">+{order.items.length - 3}</span>
                        )}
                      </div>

                      {/* Payment method */}
                      <div className="text-xs text-gray-500 min-w-[70px] text-center hidden sm:block">
                        {order.paymentMethod === 'COD' ? '💵 COD' : order.paymentMethod === 'CARD' ? '💳 Card' : `📱 ${order.paymentMethod}`}
                      </div>

                      {/* Total */}
                      <div className="text-right min-w-[80px]">
                        <p className="font-bold text-gray-900">${order.totalPrice?.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                      </div>

                      {/* Status badge */}
                      <span className={`badge flex items-center gap-1 px-3 py-1 text-xs font-semibold ${cfg.color}`}>
                        <StatusIcon size={11} />
                        {cfg.label}
                      </span>

                      {/* Status dropdown */}
                      <div className="relative" onClick={e => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order._id, e.target.value)}
                          disabled={updatingStatus === order._id}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 pr-6 focus:outline-none focus:border-primary bg-white appearance-none cursor-pointer disabled:opacity-50"
                        >
                          {Object.entries(STATUS_CONFIG).map(([val, conf]) => (
                            <option key={val} value={val}>{conf.label}</option>
                          ))}
                        </select>
                        {updatingStatus === order._id
                          ? <Spinner size="sm" />
                          : <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        }
                      </div>

                      {/* Expand toggle */}
                      <Eye size={15} className={`text-gray-400 transition-transform shrink-0 ${isExpanded ? 'text-primary' : ''}`} />
                    </div>

                    {/* Expanded detail */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 bg-gray-50 p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Items list */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Items</h4>
                          <div className="space-y-2.5">
                            {order.items?.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-2.5 border border-gray-100">
                                <img src={item.image} alt="" className="w-10 h-10 rounded-md object-cover" onError={e => { e.target.src = 'https://via.placeholder.com/40' }} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                  <p className="text-xs text-gray-400">Qty: {item.quantity} × ${item.price?.toFixed(2)}</p>
                                </div>
                                <span className="text-sm font-semibold shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipping + Summary */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Shipping Address</h4>
                            <div className="bg-white rounded-lg p-3 border border-gray-100 text-sm text-gray-600 space-y-0.5">
                              <p className="font-medium text-gray-800">{order.user?.name}</p>
                              <p>{order.shippingAddress?.street}</p>
                              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                              <p>{order.shippingAddress?.country}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Price Breakdown</h4>
                            <div className="bg-white rounded-lg p-3 border border-gray-100 text-sm space-y-1.5">
                              <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span><span>${order.itemsPrice?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-gray-500">
                                <span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice?.toFixed(2)}`}</span>
                              </div>
                              <div className="flex justify-between text-gray-500">
                                <span>Tax</span><span>${order.taxPrice?.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between font-bold border-t border-gray-100 pt-1.5">
                                <span>Total</span><span className="text-primary">${order.totalPrice?.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick status buttons */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Quick Update</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {Object.entries(STATUS_CONFIG)
                                .filter(([val]) => val !== order.status)
                                .map(([val, conf]) => {
                                  const Ic = conf.icon
                                  return (
                                    <button
                                      key={val}
                                      onClick={() => updateOrderStatus(order._id, val)}
                                      disabled={updatingStatus === order._id}
                                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:opacity-90 disabled:opacity-40 ${conf.color} border-current/20`}
                                    >
                                      <Ic size={10} /> {conf.label}
                                    </button>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── PRODUCT MODAL ─────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-bold text-lg">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <input value={form.name} onChange={e => fld('name', e.target.value)} className="input-field" placeholder="Enter product name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price *</label>
                <input type="number" value={form.price} onChange={e => fld('price', e.target.value)} className="input-field" placeholder="0.00" min="0" step="0.01" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Original Price</label>
                <input type="number" value={form.originalPrice} onChange={e => fld('originalPrice', e.target.value)} className="input-field" placeholder="0.00" min="0" step="0.01" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category *</label>
                <select value={form.category} onChange={e => fld('category', e.target.value)} className="input-field">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Brand</label>
                <input value={form.brand} onChange={e => fld('brand', e.target.value)} className="input-field" placeholder="Brand name" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock *</label>
                <input type="number" value={form.stock} onChange={e => fld('stock', e.target.value)} className="input-field" placeholder="0" min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Badge</label>
                <select value={form.badge} onChange={e => fld('badge', e.target.value)} className="input-field">
                  <option value="">None</option>
                  {['New', 'Sale', 'Hot', 'Best Seller'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Image URL *</label>
                <input value={form.image} onChange={e => fld('image', e.target.value)} className="input-field" placeholder="https://..." />
                {form.image && <img src={form.image} alt="" className="mt-2 h-20 rounded-lg object-cover" />}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description *</label>
                <textarea value={form.description} onChange={e => fld('description', e.target.value)} className="input-field h-24 resize-none" placeholder="Product description..." />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => fld('featured', e.target.checked)} className="accent-primary" />
                  <span className="text-sm font-medium">Featured product</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-gray-100">
              <button onClick={() => setModal(false)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                {saving ? <Spinner size="sm" /> : <><Save size={14} /> {editing ? 'Update' : 'Create'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
