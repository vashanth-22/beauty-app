import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { heroApi, categoriesApi, productsApi } from '../../api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton" style={{ height: 240 }} />
      <div style={{ padding: 18 }}>
        <div className="skeleton" style={{ height: 11, marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 11, width: '60%' }} />
      </div>
    </div>
  );
}

export default function Home() {
  const { navigate, setFilters } = useApp();

  const [slides,    setSlides]    = useState([]);
  const [slideIdx,  setSlideIdx]  = useState(0);
  const [categories,setCategories]= useState([]);
  const [featured,  setFeatured]  = useState([]);
  const [trending,  setTrending]  = useState([]);
  const [newLaunch, setNewLaunch] = useState([]);
  const [loading,   setLoading]   = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      heroApi.getSlides(),
      categoriesApi.getAll(),
      productsApi.getAll({ featured: 1, limit: 4 }),
      productsApi.getAll({ trending: 1, limit: 4 }),
      productsApi.getAll({ new_launch: 1, limit: 4 }),
    ]).then(([heroRes, catRes, featRes, trendRes, newRes]) => {
      setSlides(heroRes.data    || []);
      setCategories(catRes.data || []);
      setFeatured(featRes.data  || []);
      setTrending(trendRes.data || []);
      setNewLaunch(newRes.data  || []);
      setLoading(false);
    }).catch(() => {
      // Retry once after 4 seconds if server was sleeping
      setTimeout(() => {
        Promise.all([
          heroApi.getSlides(),
          categoriesApi.getAll(),
          productsApi.getAll({ featured: 1, limit: 4 }),
          productsApi.getAll({ trending: 1, limit: 4 }),
          productsApi.getAll({ new_launch: 1, limit: 4 }),
        ]).then(([heroRes, catRes, featRes, trendRes, newRes]) => {
          setSlides(heroRes.data    || []);
          setCategories(catRes.data || []);
          setFeatured(featRes.data  || []);
          setTrending(trendRes.data || []);
          setNewLaunch(newRes.data  || []);
          setLoading(false);
        }).catch(() => setLoading(false));
      }, 4000);
    });
  };

  useEffect(() => { loadData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-advance hero slides
  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setSlideIdx(i => (i + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides]);

  const goCategory = (slug) => {
    setFilters({ sort: 'newest', category: slug });
    navigate('products');
  };

  const currentSlide = slides[slideIdx];

  return (
    <div className="home">

      {/* ── HERO ──────────────────────────────────────────── */}
      {slides.length > 0 ? (
        <section className="hero" style={{ backgroundImage: `url(${currentSlide.image_url})` }}>
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="hero-eyebrow">New Collection</p>
            <h1 className="hero-title">{currentSlide.title}</h1>
            {currentSlide.description && (
              <p className="hero-desc">{currentSlide.description}</p>
            )}
            {currentSlide.button_text && (
              <button
                className="btn btn-rose hero-btn"
                onClick={() => navigate(currentSlide.button_link || 'products')}
              >
                {currentSlide.button_text}
              </button>
            )}
          </div>

          {/* Slide dots */}
          {slides.length > 1 && (
            <div className="hero-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`hero-dot${i === slideIdx ? ' active' : ''}`}
                  onClick={() => setSlideIdx(i)}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* Fallback hero when no slides in DB */
        <section className="hero hero-fallback">
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="hero-eyebrow">New Collection · 2024</p>
            <h1 className="hero-title">The Art of<br /><em>Refined Beauty</em></h1>
            <p className="hero-desc">
              Curated skincare and beauty rituals, crafted with the finest
              natural ingredients for the discerning woman.
            </p>
            <div className="hero-btns">
              <button className="btn btn-rose hero-btn" onClick={() => navigate('products')}>
                Explore Collection
              </button>
              <button
                className="btn btn-border-light hero-btn"
                onClick={() => { setFilters({ sort: 'newest', new_launch: '1' }); navigate('products'); }}
              >
                New Arrivals
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── CATEGORIES ──────────────────────────────────── */}
      <section className="section section-alt">
        <div className="section-header">
          <p className="eyebrow">Shop by Category</p>
          <h2 className="section-title">Find Your <em>Ritual</em></h2>
        </div>

        {loading ? (
          <div className="grid-5">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="cat-card-skeleton">
                <div className="skeleton" style={{ height: 48, width: 48, borderRadius: '50%', margin: '0 auto 14px' }} />
                <div className="skeleton" style={{ height: 10, width: '70%', margin: '0 auto' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid-5">
            {categories.map(cat => (
              <div key={cat._id} className="category-card" onClick={() => goCategory(cat.slug)}>
                <span className="category-icon">{cat.icon || '✨'}</span>
                <p className="category-name">{cat.name}</p>
                <p className="category-count">
                  {cat.subcategories?.length || 0} collections
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── FEATURED ─────────────────────────────────────── */}
      <section className="section">
        <div className="section-header">
          <p className="eyebrow">Editor's Selection</p>
          <h2 className="section-title">Featured <em>Products</em></h2>
          <p className="section-subtitle">Hand-picked by our beauty experts for exceptional results</p>
        </div>

        {loading ? (
          <div className="grid-4">{[1,2,3,4].map(i => <SkeletonCard key={i} />)}</div>
        ) : featured.length > 0 ? (
          <>
            <div className="grid-4">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
            <div className="section-cta">
              <button className="btn btn-border" onClick={() => navigate('products')}>
                View All Products
              </button>
            </div>
          </>
        ) : (
          <p className="no-products">No featured products yet.</p>
        )}
      </section>

      {/* ── TRENDING ──────────────────────────────────────── */}
      {trending.length > 0 && (
        <section className="section section-alt">
          <div className="section-header">
            <p className="eyebrow">Most Loved</p>
            <h2 className="section-title">Trending <em>Now</em></h2>
          </div>
          <div className="grid-4">
            {loading
              ? [1,2,3,4].map(i => <SkeletonCard key={i} />)
              : trending.map(p => <ProductCard key={p._id} product={p} />)
            }
          </div>
        </section>
      )}

      {/* ── NEW LAUNCHES ──────────────────────────────────── */}
      {newLaunch.length > 0 && (
        <section className="section">
          <div className="section-header">
            <p className="eyebrow">Just Arrived</p>
            <h2 className="section-title">New <em>Launches</em></h2>
          </div>
          <div className="grid-4">
            {newLaunch.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
          <div className="section-cta">
            <button
              className="btn btn-border"
              onClick={() => { setFilters({ sort: 'newest', new_launch: '1' }); navigate('products'); }}
            >
              See All New Arrivals
            </button>
          </div>
        </section>
      )}

      {/* ── VALUE PROPS ───────────────────────────────────── */}
      <section className="section section-dark">
        <div className="value-grid">
          {[
            { icon: '🚚', title: 'Free Delivery',      desc: 'On all orders above ₹1,000' },
            { icon: '🌿', title: 'Clean Beauty',       desc: 'Natural & cruelty-free always' },
            { icon: '🔄', title: 'Easy Returns',       desc: '30-day hassle-free returns' },
            { icon: '💎', title: '100% Authentic',     desc: 'Genuine products guaranteed' },
          ].map(v => (
            <div key={v.title} className="value-item">
              <span className="value-icon">{v.icon}</span>
              <h4 className="value-title">{v.title}</h4>
              <p className="value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
