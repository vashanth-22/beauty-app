import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Returns.css';

export default function Returns() {
  const { navigate, toast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', order_number: '', reason: '', details: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    if (!form.name || !form.email || !form.order_number || !form.reason) {
      toast('Please fill all required fields', 'error');
      return;
    }
    setLoading(true);
    try {
      // Send via mailto (no backend email service needed)
      const subject = `Return/Exchange Request - ${form.order_number}`;
      const body = `Name: ${form.name}%0AEmail: ${form.email}%0AOrder Number: ${form.order_number}%0AReason: ${form.reason}%0ADetails: ${form.details}`;
      window.location.href = `mailto:vashanth.tup@gmail.com?subject=${subject}&body=${body}`;
      setSubmitted(true);
    } catch {
      toast('Something went wrong', 'error');
    }
    setLoading(false);
  };

  if (submitted) return (
    <div className="returns-page">
      <div className="returns-success">
        <div style={{ fontSize: '3rem' }}>✅</div>
        <h2>Request Submitted!</h2>
        <p>Your email client has opened. Please send the email to complete your request.</p>
        <p>We'll get back to you within <strong>2 business days</strong>.</p>
        <button className="btn btn-dark" onClick={() => navigate('home')}>Back to Home</button>
      </div>
    </div>
  );

  return (
    <div className="returns-page">
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate('home')}>Home</span>
        <span className="breadcrumb-sep">›</span>
        <span>Returns & Exchange</span>
      </div>
      <div className="returns-wrap">
        <h1 className="returns-title">Returns & <em>Exchange</em></h1>
        <p className="returns-sub">Not happy with your order? We offer easy 30-day returns. Fill the form below and we'll take care of it.</p>

        <div className="returns-grid">
          <div className="returns-form">
            <h2 className="returns-form-title">Submit a Request</h2>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Order Number *</label>
              <input className="form-input" placeholder="e.g. ORD-1234567890" value={form.order_number} onChange={e => set('order_number', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Reason *</label>
              <select className="form-input" value={form.reason} onChange={e => set('reason', e.target.value)}>
                <option value="">Select a reason</option>
                <option value="Damaged product">Damaged product</option>
                <option value="Wrong item received">Wrong item received</option>
                <option value="Product not as described">Product not as described</option>
                <option value="Changed my mind">Changed my mind</option>
                <option value="Exchange for different size">Exchange for different size</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Additional Details</label>
              <textarea className="form-input returns-textarea" placeholder="Tell us more..." value={form.details} onChange={e => set('details', e.target.value)} rows={4} />
            </div>

            <button className="btn btn-rose btn-full" onClick={submit} disabled={loading}>
              {loading ? 'Submitting…' : 'Submit Request'}
            </button>
          </div>

          <div className="returns-info">
            <h2 className="returns-form-title">Our Policy</h2>
            <div className="policy-item">
              <span className="policy-icon">📦</span>
              <div>
                <p className="policy-title">30-Day Returns</p>
                <p className="policy-desc">Return any product within 30 days of delivery for a full refund.</p>
              </div>
            </div>
            <div className="policy-item">
              <span className="policy-icon">🔄</span>
              <div>
                <p className="policy-title">Easy Exchange</p>
                <p className="policy-desc">Exchange for a different product of equal or higher value.</p>
              </div>
            </div>
            <div className="policy-item">
              <span className="policy-icon">✅</span>
              <div>
                <p className="policy-title">Genuine Products Only</p>
                <p className="policy-desc">Products must be unused, in original packaging.</p>
              </div>
            </div>
            <div className="policy-item">
              <span className="policy-icon">💳</span>
              <div>
                <p className="policy-title">Refund in 5–7 Days</p>
                <p className="policy-desc">Refunds are processed to original payment method within 5–7 business days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
