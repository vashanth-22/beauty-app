import React from 'react';
import { useApp } from '../../context/AppContext';
import './CartSidebar.css';

const INR = n =>
  '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function CartSidebar() {
  const {
    cartOpen, setCartOpen,
    cartItems, cartMeta,
    updateCartQty, removeCartItem,
    navigate,
  } = useApp();

  // Free shipping threshold from config.php: FREE_SHIPPING_THRESHOLD = 1000
  const FREE_SHIPPING = 1000;
  const progress = cartMeta.subtotal
    ? Math.min(100, (cartMeta.subtotal / FREE_SHIPPING) * 100)
    : 0;
  const remaining = Math.max(0, FREE_SHIPPING - cartMeta.subtotal);

  return (
    <>
      <div
        className={`cart-overlay${cartOpen ? ' open' : ''}`}
        onClick={() => setCartOpen(false)}
      />

      <aside className={`cart-sidebar${cartOpen ? ' open' : ''}`}>
        {/* Header */}
        <div className="cart-header">
          <h2 className="cart-title">
            Your Bag
            {cartMeta.item_count > 0 && (
              <span className="cart-count">({cartMeta.item_count})</span>
            )}
          </h2>
          <button className="cart-close" onClick={() => setCartOpen(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <p className="cart-empty-title">Your bag is empty</p>
              <p className="cart-empty-sub">Discover something beautiful</p>
              <button
                className="btn btn-dark"
                style={{ marginTop: 24 }}
                onClick={() => { setCartOpen(false); navigate('products'); }}
              >
                Shop Now
              </button>
            </div>
          ) : (
            cartItems.map(item => {
              const product = item.product_id || {};
              const price = product.price || 0;
              const disc  = product.discount_percentage || 0;
              const finalPrice = disc > 0 ? price - (price * disc / 100) : price;
              return (
                <div key={item._id} className="cart-item">
                  <img
                    className="cart-item-img"
                    src={product.image_url || ''}
                    alt={product.name || 'Product'}
                    onError={e => { e.target.style.background = 'var(--sand)'; e.target.src = ''; }}
                  />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{product.name}</p>
                    <p className="cart-item-price">{INR(finalPrice)}</p>
                    <div className="cart-qty">
                      <button
                        className="qty-btn"
                        onClick={() => updateCartQty(item._id, item.quantity - 1)}
                      >−</button>
                      <span className="qty-num">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateCartQty(item._id, item.quantity + 1)}
                      >+</button>
                    </div>
                  </div>
                  <button className="cart-item-remove" onClick={() => removeCartItem(item._id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            {/* Shipping progress */}
            {remaining > 0 ? (
              <div className="shipping-nudge">
                <p>Add <strong>{INR(remaining)}</strong> more for free shipping</p>
                <div className="shipping-bar">
                  <div className="shipping-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <p className="free-shipping-msg">✓ You've unlocked free shipping!</p>
            )}

            <div className="cart-totals">
              <div className="cart-row">
                <span>Subtotal</span>
                <span>{INR(cartMeta.subtotal)}</span>
              </div>
              <div className="cart-row">
                <span>Shipping</span>
                <span>
                  {cartMeta.shipping === 0
                    ? <span className="free-tag">Free</span>
                    : INR(cartMeta.shipping)}
                </span>
              </div>
              <div className="cart-row cart-total">
                <span>Total</span>
                <span>{INR(cartMeta.total)}</span>
              </div>
            </div>

            <button
              className="btn btn-rose btn-full"
              onClick={() => { setCartOpen(false); navigate('checkout'); }}
            >
              Checkout
            </button>
            <button
              className="btn btn-border btn-full"
              style={{ marginTop: 8 }}
              onClick={() => setCartOpen(false)}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
