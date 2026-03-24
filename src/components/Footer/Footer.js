import React from 'react';
import { useApp } from '../../context/AppContext';
import './Footer.css';

export default function Footer() {
  const { navigate, setFilters } = useApp();

  const goCategory = (slug) => {
    setFilters({ sort: 'newest', category: slug });
    navigate('products');
  };

  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <p className="footer-logo">Lumière<em>·</em>Beauty</p>
          <p className="footer-desc">
            Curating the finest beauty rituals for the modern woman.
            Clean, luxurious, and thoughtfully made.
          </p>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">Shop</p>
          {[
            { label: 'Skincare',  slug: 'skincare'  },
            { label: 'Haircare',  slug: 'haircare'  },
            { label: 'Makeup',    slug: 'makeup'    },
            { label: 'Fragrance', slug: 'fragrance' },
            { label: 'Wellness',  slug: 'wellness'  },
          ].map(c => (
            <span key={c.slug} className="footer-link" onClick={() => goCategory(c.slug)}>
              {c.label}
            </span>
          ))}
        </div>

        <div className="footer-col">
          <p className="footer-col-title">Help</p>
          <span className="footer-link" onClick={() => navigate('orders')}>Track Order</span>
          <span className="footer-link" onClick={() => navigate('returns')}>Returns & Exchange</span>
          <span className="footer-link" onClick={() => navigate('contact')}>Contact Us</span>
          <span className="footer-link" onClick={() => navigate('contact')}>Shipping Info</span>
        </div>

        <div className="footer-col">
          <p className="footer-col-title">Connect</p>
          <a className="footer-link" href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
          <a className="footer-link" href="https://pinterest.com" target="_blank" rel="noreferrer">Pinterest</a>
          <a className="footer-link" href="https://youtube.com" target="_blank" rel="noreferrer">YouTube</a>
          <span className="footer-link" onClick={() => navigate('contact')}>Newsletter</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Lumière Beauty. All rights reserved.</span>
        <span>Crafted with ♡ for beauty lovers</span>
      </div>
    </footer>
  );
}
