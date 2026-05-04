import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-white font-bold text-lg">Braid</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            Your one-stop destination for the latest electronics, fashion, and home essentials at unbeatable prices.
          </p>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-primary transition-colors">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[['Home', '/'], ['Products', '/products'], ['Deals', '/products?featured=true'], ['Cart', '/cart']].map(([label, path]) => (
              <li key={path}><Link to={path} className="hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Categories</h4>
          <ul className="space-y-2 text-sm">
            {['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Beauty', 'Books'].map(cat => (
              <li key={cat}><Link to={`/products?category=${cat}`} className="hover:text-white transition-colors">{cat}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin size={14} className="shrink-0 mt-0.5 text-primary" /><span>123 Commerce St, San Francisco, CA 94102</span></li>
            <li className="flex items-center gap-2"><Phone size={14} className="text-primary" /><a href="tel:+14155550100" className="hover:text-white">+1 (415) 555-0100</a></li>
            <li className="flex items-center gap-2"><Mail size={14} className="text-primary" /><a href="mailto:support@braid.com" className="hover:text-white">support@braid.com</a></li>
          </ul>
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Newsletter</p>
            <div className="flex">
              <input placeholder="Your email" className="flex-1 bg-gray-800 border border-gray-700 px-3 py-2 text-sm rounded-l-md focus:outline-none focus:border-primary" />
              <button className="bg-primary text-white px-3 py-2 text-sm rounded-r-md hover:bg-primary-dark transition-colors">Go</button>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 px-4 py-4 text-center text-xs text-gray-500">
        © 2024 Braid Shop. All rights reserved. | Privacy Policy | Terms of Service
      </div>
    </footer>
  )
}
