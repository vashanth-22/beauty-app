import React from 'react';
import { useApp } from '../../context/AppContext';
import './Navbar.css';

export default function Navbar() {
  const { page, navigate, user, logout, cartMeta, setCartOpen, cartOpen } = useApp();

  return (
    <header className="navbar">
      <span className="navbar-logo" onClick={() => navigate('home')}>
        Lumière<em>·</em>Beauty
      </span>

      <nav className="navbar-links">
        {[
          { key: 'home',     label: 'Home' },
          { key: 'products', label: 'Shop' },
          { key: 'orders',   label: 'Orders' },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={`navbar-link${page === key ? ' active' : ''}`}
            onClick={() => navigate(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="navbar-actions">
        <button
          className="navbar-icon-btn"
          title="Search"
          onClick={() => navigate('products')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/></svg>
        </button>

        {user ? (
          <>
            <button className="navbar-icon-btn" title={`Hi, ${user.name}`} onClick={() => navigate('orders')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </button>
            <button className="navbar-icon-btn" title="Logout" onClick={logout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </>
        ) : (
          <button className="navbar-icon-btn" title="Login" onClick={() => navigate('auth')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </button>
        )}

        <button
          className="navbar-icon-btn cart-btn"
          title="Bag"
          onClick={() => user ? setCartOpen(o => !o) : navigate('auth')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          {cartMeta.item_count > 0 && (
            <span className="cart-badge">{cartMeta.item_count}</span>
          )}
        </button>
      </div>
    </header>
  );
}
