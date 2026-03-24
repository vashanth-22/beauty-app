import React from 'react';
import { useApp } from '../../context/AppContext';
import Stars from '../Stars/Stars';
import './ProductCard.css';

const INR = n =>
  '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function ProductCard({ product }) {
  const { addToCart, navigate, setSelectedProduct } = useApp();

  const handleClick = () => {
    setSelectedProduct(product);
    navigate('product');
  };

  // compute final price from discount_percentage (Node.js doesn't pre-compute this)
  const finalPrice =
    product.discount_percentage > 0
      ? product.price - (product.price * product.discount_percentage / 100)
      : product.price;
  const savings =
    product.discount_percentage > 0
      ? Math.round(product.price - finalPrice)
      : 0;

  return (
    <article className="product-card">
      {/* Image */}
      <div className="product-card-img-wrap" onClick={handleClick}>
        {/* Badges */}
        <div className="product-badges">
          {product.discount_percentage > 0 && (
            <span className="badge badge-sale">−{product.discount_percentage}%</span>
          )}
          {product.is_new_launch && (
            <span className="badge badge-new">New</span>
          )}
          {product.is_trending && !product.is_new_launch && (
            <span className="badge badge-trend">Trending</span>
          )}
        </div>

        <img
          className="product-card-img"
          src={product.image_url || ''}
          alt={product.name}
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>

      {/* Info */}
      <div className="product-card-info">
        <p className="product-card-cat">{product.category_name}</p>
        <p className="product-card-name" onClick={handleClick}>{product.name}</p>
        <Stars rating={product.rating} count={product.review_count} />
        <div className="product-card-price">
          <span className="price-final">{INR(finalPrice)}</span>
          {product.discount_percentage > 0 && (
            <span className="price-original">{INR(product.price)}</span>
          )}
          {savings > 0 && (
            <span className="price-save">Save {INR(savings)}</span>
          )}
        </div>

        <button
          className="product-card-atc"
          onClick={() => addToCart(product._id, 1)}
        >
          Add to Bag
        </button>
      </div>
    </article>
  );
}
