import React, { useEffect, useState, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { productsApi, categoriesApi } from '../../api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Products.css';

function SkeletonCard() {
  return (
    <div className="products-skeleton-card">
      <div className="skeleton" style={{ height: 240 }} />
      <div style={{ padding: 18 }}>
        <div className="skeleton" style={{ height: 10, marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 10, width: '60%' }} />
      </div>
    </div>
  );
}

export default function Products() {
  const { filters, setFilters, navigate } = useApp();

  const [products,   setProducts]   = useState([]);
  const [pagination, setPagination] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);

  // Local search input (only applied on Enter / button click)
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Load categories once
  useEffect(() => {
    categoriesApi.getAll().then(r => setCategories(r.data || []));
  }, []);

  // Re-fetch whenever filters change
  useEffect(() => {
    setLoading(true);
    productsApi.getAll({ ...filters, limit: 8 })
      .then(r => {
        setProducts(r.data || []);
        setPagination(r.meta?.pagination || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filters]);

  // ── filter helpers ──────────────────────────────────────────────────
  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  }, [setFilters]);

  const toggleFilter = useCallback((key, value) => {
    setFilters(prev => {
      const same = prev[key] === value;
      const next = { ...prev, page: 1 };
      if (same) delete next[key];
      else next[key] = value;
      return next;
    });
  }, [setFilters]);

  const clearAll = useCallback(() => {
    setFilters({ sort: 'newest' });
    setSearchInput('');
  }, [setFilters]);

  const applySearch = () => setFilter('search', searchInput);

  const goPage = (p) => setFilters(prev => ({ ...prev, page: p }));

  // ── sort options matching products.php switch ───────────────────────
  const sortOptions = [
    { value: 'newest',     label: 'Newest First' },
    { value: 'price_low',  label: 'Price: Low → High' },
    { value: 'price_high', label: 'Price: High → Low' },
    { value: 'rating',     label: 'Top Rated' },
    { value: 'popular',    label: 'Most Popular' },
    { value: 'name',       label: 'Name A–Z' },
  ];

  const isActive = (key, val) => filters[key] === val;

  return (
    <div className="products-page">

      {/* ── BREADCRUMB ── */}
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate('home')}>Home</span>
        <span className="breadcrumb-sep">›</span>
        <span>Shop</span>
        {filters.category && (
          <>
            <span className="breadcrumb-sep">›</span>
            <span className="products-cat-crumb">{filters.category}</span>
          </>
        )}
      </div>

      <div className="products-layout">

        {/* ── SIDEBAR ── */}
        <aside className="products-sidebar">
          <div className="sidebar-section">
            <p className="sidebar-title">Categories</p>
            <button
              className={`sidebar-item${!filters.category ? ' active' : ''}`}
              onClick={() => toggleFilter('category', undefined)}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <div key={cat.id}>
                <button
                  className={`sidebar-item${filters.category === cat.slug ? ' active' : ''}`}
                  onClick={() => toggleFilter('category', cat.slug)}
                >
                  {cat.icon && <span>{cat.icon} </span>}
                  {cat.name}
                </button>
                {/* Subcategories */}
                {filters.category === cat.slug && cat.subcategories?.map(sub => (
                  <button
                    key={sub.id}
                    className={`sidebar-item sidebar-sub${filters.subcategory === sub.slug ? ' active' : ''}`}
                    onClick={() => toggleFilter('subcategory', sub.slug)}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            ))}
          </div>

          <div className="sidebar-section">
            <p className="sidebar-title">Filter By</p>
            {[
              { key: 'featured',   val: '1', label: 'Featured' },
              { key: 'trending',   val: '1', label: 'Trending' },
              { key: 'new_launch', val: '1', label: 'New Arrivals' },
            ].map(f => (
              <button
                key={f.key}
                className={`sidebar-item${isActive(f.key, f.val) ? ' active' : ''}`}
                onClick={() => toggleFilter(f.key, f.val)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="sidebar-section">
            <p className="sidebar-title">Price Range</p>
            <div className="price-inputs">
              <input
                className="form-input price-input"
                type="number"
                placeholder="Min ₹"
                value={filters.min_price || ''}
                onChange={e => setFilter('min_price', e.target.value)}
              />
              <span className="price-sep">–</span>
              <input
                className="form-input price-input"
                type="number"
                placeholder="Max ₹"
                value={filters.max_price || ''}
                onChange={e => setFilter('max_price', e.target.value)}
              />
            </div>
          </div>

          <button className="btn btn-border btn-full sidebar-clear" onClick={clearAll}>
            Clear All
          </button>
        </aside>

        {/* ── MAIN ── */}
        <main className="products-main">
          {/* Search + Sort bar */}
          <div className="products-topbar">
            <div className="products-search">
              <input
                className="form-input search-input"
                type="text"
                placeholder="Search products…"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applySearch()}
              />
              <button className="search-btn" onClick={applySearch}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
                </svg>
              </button>
            </div>

            <div className="products-sort">
              <label className="sort-label">Sort by</label>
              <select
                className="form-input sort-select"
                value={filters.sort || 'newest'}
                onChange={e => setFilter('sort', e.target.value)}
              >
                {sortOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results info */}
          {!loading && (
            <p className="results-info">
              {pagination.total_items || 0} products found
              {filters.search && ` for "${filters.search}"`}
            </p>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid-4">
              {[1,2,3,4,5,6,7,8].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">No products found</h3>
              <p className="empty-state-sub">Try adjusting your filters or search terms</p>
              <button className="btn btn-border" onClick={clearAll}>Clear All Filters</button>
            </div>
          )}

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="pagination">
              {pagination.has_prev && (
                <button className="pg-btn" onClick={() => goPage((filters.page || 1) - 1)}>←</button>
              )}
              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`pg-btn${(filters.page == p || (!filters.page && p === 1)) ? ' on' : ''}`}
                  onClick={() => goPage(p)}
                >
                  {p}
                </button>
              ))}
              {pagination.has_next && (
                <button className="pg-btn" onClick={() => goPage((filters.page || 1) + 1)}>→</button>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
