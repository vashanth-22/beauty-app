import React from 'react';
import { useApp } from '../../context/AppContext';
import './Footer.css';

export default function Footer() {
  const { navigate } = useApp();
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

        {[
          {
            title: 'Shop',
            links: ['Skincare', 'Haircare', 'Makeup', 'Fragrance', 'Wellness'],
          },
          {
            title: 'Help',
            links: ['Track Order', 'Returns & Exchange', 'FAQ', 'Contact Us', 'Shipping Info'],
          },
          {
            title: 'Connect',
            links: ['Instagram', 'Pinterest', 'YouTube', 'Newsletter'],
          },
        ].map(col => (
          <div key={col.title} className="footer-col">
            <p className="footer-col-title">{col.title}</p>
            {col.links.map(l => (
              <span key={l} className="footer-link" onClick={() => navigate('products')}>
                {l}
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Lumière Beauty. All rights reserved.</span>
        <span>Crafted with ♡ for beauty lovers</span>
      </div>
    </footer>
  );
}
