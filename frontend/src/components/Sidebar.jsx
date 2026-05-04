import { useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'

const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty', 'Automotive', 'Food', 'Toys']
const priceRanges = [
  { label: 'Under $25', min: 0, max: 25 },
  { label: '$25 – $50', min: 25, max: 50 },
  { label: '$50 – $100', min: 50, max: 100 },
  { label: '$100 – $200', min: 100, max: 200 },
  { label: 'Over $200', min: 200, max: 999999 },
]
const ratings = [5, 4, 3, 2]

export default function Sidebar({ filters, onChange, onReset }) {
  const [openSections, setOpenSections] = useState({ category: true, price: true, rating: true })

  const toggle = (key) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  const Section = ({ id, title, children }) => (
    <div className="border-b border-gray-100 py-4">
      <button onClick={() => toggle(id)} className="flex items-center justify-between w-full font-medium text-sm text-gray-800 mb-3">
        {title}
        {openSections[id] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {openSections[id] && children}
    </div>
  )

  return (
    <aside className="w-full">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          <button onClick={onReset} className="text-xs text-primary hover:underline flex items-center gap-1">
            <X size={11} /> Clear all
          </button>
        </div>

        <Section id="category" title="Category">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="radio" name="category" value="" checked={!filters.category} onChange={() => onChange({ category: '' })} className="accent-primary" />
              <span>All Categories</span>
            </label>
            {categories.map(cat => (
              <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="category" value={cat} checked={filters.category === cat} onChange={() => onChange({ category: cat })} className="accent-primary" />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section id="price" title="Price Range">
          <div className="space-y-1.5">
            {priceRanges.map(r => (
              <label key={r.label} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={filters.minPrice === r.min && filters.maxPrice === r.max}
                  onChange={() => onChange({ minPrice: r.min, maxPrice: r.max })}
                  className="accent-primary"
                />
                <span>{r.label}</span>
              </label>
            ))}
          </div>
        </Section>

        <Section id="rating" title="Min Rating">
          <div className="space-y-1.5">
            {ratings.map(r => (
              <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="radio" name="rating" checked={filters.rating === r} onChange={() => onChange({ rating: r })} className="accent-primary" />
                <span className="flex items-center gap-1 text-yellow-400">
                  {'★'.repeat(r)}{'☆'.repeat(5 - r)}
                  <span className="text-gray-500 text-xs ml-1">& up</span>
                </span>
              </label>
            ))}
          </div>
        </Section>
      </div>
    </aside>
  )
}
