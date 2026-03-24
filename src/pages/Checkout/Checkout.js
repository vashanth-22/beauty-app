import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { checkoutApi } from '../../api';
import './Checkout.css';

const INR = n =>
  '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

// Payment methods — maps to checkout.php payment_method field
const PAYMENT_METHODS = [
  { value: 'cod',  label: '💵 Cash on Delivery', note: 'No extra charges' },
  { value: 'upi',  label: '📱 UPI / Net Banking',  note: 'Instant transfer' },
  { value: 'card', label: '💳 Credit / Debit Card', note: 'Secure payment' },
];

export default function Checkout() {
  const { cartItems, cartMeta, navigate, toast, refreshCart, user } = useApp();

  // Pre-fill from logged-in user if available
  const [form, setForm] = useState({
    customer_name:    user?.name  || '',
    customer_email:   user?.email || '',
    customer_phone:   '',
    shipping_address: '',
    shipping_city:    '',
    shipping_state:   '',
    shipping_pincode: '',
    payment_method:   'cod',
  });

  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [placed,  setPlaced]  = useState(null); // order data on success

  // Required fields matching checkout.php validateRequired()
  const REQUIRED = [
    'customer_name', 'customer_email', 'customer_phone',
    'shipping_address', 'shipping_city', 'shipping_state', 'shipping_pincode',
  ];

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    REQUIRED.forEach(k => {
      if (!form[k].trim()) {
        errs[k] = `${k.replace(/_/g, ' ')} is required`;
      }
    });
    if (form.customer_email && !/\S+@\S+\.\S+/.test(form.customer_email)) {
      errs.customer_email = 'Enter a valid email';
    }
    if (form.shipping_pincode && !/^\d{6}$/.test(form.shipping_pincode)) {
      errs.shipping_pincode = 'Enter a valid 6-digit pincode';
    }
    return errs;
  };

  const submit = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const res = await checkoutApi.placeOrder(form);
      if (res.success) {
        setPlaced(res.data);   // { order_id, order_number, total_amount }
        await refreshCart();
      } else {
        // checkout.php may return field-level errors
        if (res.errors) setErrors(res.errors);
        toast(res.message || 'Checkout failed', 'error');
      }
    } catch {
      toast('Server unreachable — is PHP running?', 'error');
    }
    setLoading(false);
  };

  // ── Empty cart ──────────────────────────────────────────────────────
  if (cartItems.length === 0 && !placed) {
    return (
      <div className="empty-state" style={{ marginTop: 60 }}>
        <div className="empty-state-icon">🛍</div>
        <h3 className="empty-state-title">Your bag is empty</h3>
        <p className="empty-state-sub">Add some products before checking out</p>
        <button className="btn btn-dark" onClick={() => navigate('products')}>Shop Now</button>
      </div>
    );
  }

  // ── Success screen ───────────────────────────────────────────────────
  if (placed) {
    return (
      <div className="checkout-success">
        <div className="success-icon">🎉</div>
        <h2 className="success-title">Order Placed!</h2>
        <p className="success-order-num">{placed.order_number}</p>
        <p className="success-amount">Total paid: <strong>{INR(placed.total_amount)}</strong></p>
        <p className="success-note">
          A confirmation will be sent to <strong>{form.customer_email}</strong>
        </p>
        <div className="success-actions">
          <button className="btn btn-dark"   onClick={() => navigate('orders')}>View My Orders</button>
          <button className="btn btn-border" onClick={() => navigate('home')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  // ── Main checkout ────────────────────────────────────────────────────
  return (
    <div className="checkout-page">
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate('home')}>Home</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-link" onClick={() => navigate('products')}>Shop</span>
        <span className="breadcrumb-sep">›</span>
        <span>Checkout</span>
      </div>

      <div className="checkout-wrap">
        <h1 className="checkout-title">Checkout</h1>

        <div className="checkout-grid">
          {/* ── LEFT: Form ── */}
          <div className="checkout-form">

            {/* Delivery */}
            <h2 className="co-section-title">Delivery Details</h2>

            <div className="form-row">
              <Field label="Full Name *"    k="customer_name"  form={form} set={set} errors={errors} placeholder="Your full name" />
              <Field label="Email *"        k="customer_email" form={form} set={set} errors={errors} placeholder="email@example.com" type="email" />
            </div>

            <Field label="Phone Number *" k="customer_phone" form={form} set={set} errors={errors} placeholder="10-digit mobile number" type="tel" />

            <Field label="Street Address *" k="shipping_address" form={form} set={set} errors={errors} placeholder="House no., street, locality, area" />

            <div className="form-row">
              <Field label="City *"  k="shipping_city"  form={form} set={set} errors={errors} placeholder="City" />
              <Field label="State *" k="shipping_state" form={form} set={set} errors={errors} placeholder="State" />
            </div>

            <Field label="Pincode *" k="shipping_pincode" form={form} set={set} errors={errors} placeholder="6-digit pincode" maxLength={6} />

            {/* Payment */}
            <h2 className="co-section-title" style={{ marginTop: 36 }}>Payment Method</h2>

            {PAYMENT_METHODS.map(pm => (
              <div
                key={pm.value}
                className={`payment-option${form.payment_method === pm.value ? ' selected' : ''}`}
                onClick={() => set('payment_method', pm.value)}
              >
                <input
                  type="radio"
                  readOnly
                  checked={form.payment_method === pm.value}
                  className="payment-radio"
                />
                <span className="payment-label">{pm.label}</span>
                <span className="payment-note">{pm.note}</span>
              </div>
            ))}

            {form.payment_method !== 'cod' && (
              <p className="payment-info">
                🔒 Online gateway coming soon. Please use Cash on Delivery.
              </p>
            )}

            <button
              className="btn btn-rose btn-full co-submit-btn"
              onClick={submit}
              disabled={loading}
            >
              {loading ? 'Placing Order…' : `Place Order · ${INR(cartMeta.total)}`}
            </button>
          </div>

          {/* ── RIGHT: Summary ── */}
          <div className="checkout-summary">
            <h2 className="co-section-title">Order Summary</h2>

            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <img
                    className="summary-item-img"
                    src={item.image_url || ''}
                    alt={item.product_name}
                    onError={e => { e.target.style.background = 'var(--sand)'; e.target.src = ''; }}
                  />
                  <div className="summary-item-info">
                    <p className="summary-item-name">{item.product_name}</p>
                    <p className="summary-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <p className="summary-item-price">{INR(item.subtotal)}</p>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{INR(cartMeta.subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>
                  {cartMeta.shipping === 0
                    ? <span className="free-tag">Free</span>
                    : INR(cartMeta.shipping)}
                </span>
              </div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>{INR(cartMeta.total)}</span>
              </div>
              <p className="summary-tax-note">* Inclusive of all taxes</p>
            </div>

            <div className="co-trust-box">
              🛡 Secure checkout · Genuine products · Easy 30-day returns
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable field component
function Field({ label, k, form, set, errors, placeholder, type = 'text', maxLength }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className={`form-input${errors[k] ? ' error' : ''}`}
        type={type}
        value={form[k]}
        onChange={e => set(k, e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
      />
      {errors[k] && <p className="field-error">{errors[k]}</p>}
    </div>
  );
}
