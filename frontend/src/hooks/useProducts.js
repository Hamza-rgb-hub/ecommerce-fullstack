import { useState, useEffect, useCallback } from 'react'
import api from '../utils/api'

export function useProducts(params = {}) {
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/products', { params })
      setProducts(data.products)
      setTotal(data.total)
      setPages(data.pages)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(params)])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return { products, total, pages, loading, error, refetch: fetchProducts }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get(`/products/${id}`)
      .then(({ data }) => setProduct(data.product))
      .catch(err => setError(err.response?.data?.message || 'Not found'))
      .finally(() => setLoading(false))
  }, [id])

  return { product, loading, error }
}
