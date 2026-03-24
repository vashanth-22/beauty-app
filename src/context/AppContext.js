import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi, authApi } from '../api';

const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  // ── routing ──────────────────────────────────────────────────────────
  const [page, setPage]           = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // ── auth ─────────────────────────────────────────────────────────────
  const [user, setUser]           = useState(null);

  // ── cart ─────────────────────────────────────────────────────────────
  const [cartOpen, setCartOpen]   = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartMeta, setCartMeta]   = useState({ subtotal: 0, shipping: 0, total: 0, item_count: 0 });

  // ── product filters ───────────────────────────────────────────────────
  const [filters, setFilters]     = useState({ sort: 'newest' });

  // ── toasts ────────────────────────────────────────────────────────────
  const [toasts, setToasts]       = useState([]);

  // ─────────────────────────────────────────────────────────────────────
  const navigate = useCallback((target, opts = {}) => {
    if (opts.product) setSelectedProduct(opts.product);
    if (opts.filters) setFilters(opts.filters);
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  // ── cart helpers ──────────────────────────────────────────────────────
  const refreshCart = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      setCartItems([]);
      setCartMeta({ subtotal: 0, shipping: 0, total: 0, item_count: 0 });
      return;
    }
    try {
      const res = await cartApi.getCart();
      if (res.success) {
        const items = res.data || [];
        const subtotal = items.reduce((sum, item) => {
          const price = item.product_id?.price || 0;
          const disc  = item.product_id?.discount_percentage || 0;
          const final = price - (price * disc / 100);
          return sum + final * item.quantity;
        }, 0);
        const shipping = subtotal > 999 ? 0 : 99;
        setCartItems(items);
        setCartMeta({
          subtotal,
          shipping,
          total: subtotal + shipping,
          item_count: items.reduce((s, i) => s + i.quantity, 0),
        });
      }
    } catch { /* server offline */ }
  }, []);

  const addToCart = useCallback(async (product_id, quantity = 1) => {
    try {
      const res = await cartApi.addItem(product_id, quantity);
      if (res.success) {
        toast('Added to bag ✓');
        await refreshCart();
        setCartOpen(true);
      } else {
        toast(res.message || 'Could not add item', 'error');
      }
    } catch {
      toast('Server unreachable', 'error');
    }
  }, [refreshCart, toast]);

  const updateCartQty = useCallback(async (cart_id, quantity) => {
    if (quantity < 1) {
      await removeCartItem(cart_id);
      return;
    }
    try {
      await cartApi.updateItem(cart_id, quantity);
      await refreshCart();
    } catch {
      toast('Update failed', 'error');
    }
  }, [refreshCart]);

  const removeCartItem = useCallback(async (cart_id) => {
    try {
      const res = await cartApi.removeItem(cart_id);
      if (res.success) {
        toast('Item removed');
        await refreshCart();
      }
    } catch {
      toast('Remove failed', 'error');
    }
  }, [refreshCart, toast]);

  // ── auth helpers ──────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setCartItems([]);
    setCartMeta({ subtotal: 0, shipping: 0, total: 0, item_count: 0 });
    toast('Logged out');
    navigate('home');
  }, [navigate, toast]);

  // ── init ──────────────────────────────────────────────────────────────
  useEffect(() => {
    // Warm up Render backend on app load (free tier cold start)
    fetch('https://beauty-backend-1-59ws.onrender.com/').catch(() => {});

    const token = localStorage.getItem('token');
    if (token) {
      authApi.getUser()
        .then(r => { if (r.success) setUser(r.data); })
        .catch(() => localStorage.removeItem('token'));
      refreshCart();
    }
  }, []);

  return (
    <AppContext.Provider value={{
      // routing
      page, navigate,
      selectedProduct, setSelectedProduct,
      // auth
      user, setUser, logout,
      // cart
      cartOpen, setCartOpen,
      cartItems, cartMeta,
      addToCart, updateCartQty, removeCartItem, refreshCart,
      // filters
      filters, setFilters,
      // toasts
      toast, toasts,
    }}>
      {children}
    </AppContext.Provider>
  );
}
