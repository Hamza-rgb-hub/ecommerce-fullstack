import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../utils/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
  })
  const { user } = useAuth()

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i._id === product._id)
      if (idx > -1) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity }
        return updated
      }
      return [...prev, { ...product, quantity }]
    })
    toast.success(`${product.name} added to cart`)
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(i => i._id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) return removeFromCart(productId)
    setCart(prev => prev.map(i => i._id === productId ? { ...i, quantity } : i))
  }

  const clearCart = () => setCart([])

  const totalItems = cart.reduce((acc, i) => acc + i.quantity, 0)
  const totalPrice = cart.reduce((acc, i) => acc + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
