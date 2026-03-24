import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { productsApi } from '../../api';
import ProductCard from '../../components/ProductCard/ProductCard';
import Stars from '../../components/Stars/Stars';
import './ProductDetail.css';

const INR = n =>
  '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function ProductDetail() {
  const { selectedProduct, navigate, addToCart } = useApp();

  const [product,  setProduct]  = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [qty,      setQty]      = useState(1);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    if (!selectedProduct) { navigate('products'); return; }
    setLoading(true);
    setQty(1);
    setImgIndex(0);

    productsApi.getById(selectedProduct._id).then(r => {
      const p = r.data || null;
      setProduct(p);
      if (p?.category_slug) {
        productsApi.getAll({ category: p.category_slug })
          .then(rel => {
            const others = (rel.data || []).filter(rp => rp._id !== p._id).slice(0, 4);
            setRelated(others);
          })
          .catch(() => {});
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedProduct]);

  if (loading) return (
    <div className="product-detail-loading">
      <div className="pd-loading-grid">
        <div className="skeleton" style={{ aspectRatio: '1', width: '100%' }} />
        <div>
          <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 20 }} />
          <div className="skeleton" style={{ height: 40, marginBottom: 14 }} />
          <div className="skeleton" style={{ height: 40, width: '70%', marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 14, marginBottom: 10 }} />
          <div className="skeleton" style={{ height: 14, marginBottom: 10, width: '80%' }} />
          <div className="skeleton" style={{ height: 14, width: '60%' }} />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="empty-state">
      <div className="empty-state-icon">😕</div>
      <h3 className="empty-state-title">Product not found</h3>
      <button className="btn btn-border" onClick={() => navigate('products')}>Back to Shop</button>
    </div>
  );

  // Build image list from image_url + image_gallery (products.php JSON field)
  const images = [
    product.image_url,
    ...(Array.isArray(product.image_gallery) ? product.image_gallery : []),
  ].filter(Boolean);

  const finalPrice = product.discount_percentage > 0
    ? product.price - (product.price * product.discount_percentage / 100)
    : product.price;
  const savings = product.discount_percentage > 0
    ? Math.round(product.price - finalPrice)
    : 0;

  // benefits is a JSON array from products.php
  const benefits = Array.isArray(product.benefits) ? product.benefits : [];

  return (
    <div className="product-detail">

      {/* BREADCRUMB */}
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate('home')}>Home</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-link" onClick={() => navigate('products')}>Shop</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-link" onClick={() => navigate('products')}>
          {product.category_name}
        </span>
        <span className="breadcrumb-sep">›</span>
        <span>{product.name}</span>
      </div>

      <div className="pd-grid">

        {/* ── IMAGES ── */}
        <div className="pd-images">
          <div className="pd-main-img-wrap">
            <img
              className="pd-main-img"
              src={images[imgIndex] || ''}
              alt={product.name}
              onError={e => { e.target.style.background = 'var(--pearl)'; e.target.src = ''; }}
            />
            {product.discount_percentage > 0 && (
              <span className="pd-badge">−{product.discount_percentage}%</span>
            )}
          </div>

          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((img, i) => (
                <img
                  key={i}
                  className={`pd-thumb${imgIndex === i ? ' active' : ''}`}
                  src={img}
                  alt={`View ${i + 1}`}
                  onClick={() => setImgIndex(i)}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── INFO ── */}
        <div className="pd-info">
          <p className="pd-category">
            {product.category_name}
            {product.subcategory_name ? ` › ${product.subcategory_name}` : ''}
          </p>

          <h1 className="pd-name">{product.name}</h1>

          <Stars rating={product.rating} count={product.review_count} />

          {/* Price */}
          <div className="pd-price-block">
            <span className="pd-price-final">{INR(finalPrice)}</span>
            {product.discount_percentage > 0 && (
              <span className="pd-price-orig">{INR(product.price)}</span>
            )}
            {savings > 0 && (
              <span className="pd-price-save">
                Save {INR(savings)} · {product.discount_percentage}% off
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="pd-description">{product.description}</p>
          )}

          {/* Benefits (JSON array from products.php) */}
          {benefits.length > 0 && (
            <div className="pd-benefits">
              <p className="pd-benefits-label">Key Benefits</p>
              <ul className="pd-benefits-list">
                {benefits.map((b, i) => (
                  <li key={i} className="pd-benefit-item">
                    <span className="benefit-dot" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity */}
          <div className="pd-qty-row">
            <span className="pd-qty-label">Quantity</span>
            <div className="pd-qty-ctrl">
              <button
                className="qty-btn"
                onClick={() => setQty(q => Math.max(1, q - 1))}
              >−</button>
              <span className="qty-num">{qty}</span>
              <button
                className="qty-btn"
                onClick={() => setQty(q => Math.min(product.stock_quantity || 99, q + 1))}
              >+</button>
            </div>
          </div>

          {/* Stock status */}
          {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
            <p className="pd-low-stock">Only {product.stock_quantity} left in stock</p>
          )}

          {/* Actions */}
          <div className="pd-actions">
            {product.stock_quantity > 0 ? (
              <button
                className="btn btn-rose pd-atc-btn"
                onClick={() => addToCart(product._id, qty)}
              >
                Add to Bag
              </button>
            ) : (
              <button className="btn btn-border pd-atc-btn" disabled>
                Out of Stock
              </button>
            )}
            <button className="btn btn-border pd-wish-btn" title="Wishlist">♡</button>
          </div>

          {/* Trust badges */}
          <div className="pd-trust">
            {[
              { icon: '🚚', text: 'Free shipping above ₹1,000' },
              { icon: '🔄', text: 'Easy 30-day returns' },
              { icon: '✓',  text: '100% authentic products' },
            ].map(t => (
              <div key={t.text} className="trust-badge">
                <span className="trust-badge-icon">{t.icon}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ── */}
      {related.length > 0 && (
        <section className="section">
          <div className="section-header">
            <p className="eyebrow">Complete Your Ritual</p>
            <h2 className="section-title">You May Also <em>Love</em></h2>
          </div>
          <div className="grid-4">
            {related.map(rp => (
              <ProductCard key={rp._id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
