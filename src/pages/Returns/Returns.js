import React from 'react';
import { useApp } from '../../context/AppContext';
import './Returns.css';

const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdLEk-G-4adlAKHI9CsM2kUJ8TVxswqanSliX2GKjKjW451hQ/viewform?embedded=true';

export default function Returns() {
  const { navigate } = useApp();

  return (
    <div className="returns-page">
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate('home')}>Home</span>
        <span className="breadcrumb-sep">›</span>
        <span>Returns & Exchange</span>
      </div>

      <div className="returns-wrap">
        <h1 className="returns-title">Returns & <em>Exchange</em></h1>
        <p className="returns-sub">
          Not happy with your order? We offer easy 30-day returns.
          Fill the form below and we'll get back to you within 2 business days.
        </p>

        <div className="returns-grid">
          {/* Google Form Embed */}
          <div className="returns-form-embed">
            <iframe
              src={FORM_URL}
              width="100%"
              height="700"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              title="Return / Exchange Request"
              style={{ borderRadius: '8px', border: '1px solid var(--border)' }}
            >
              Loading form...
            </iframe>
          </div>

          {/* Policy Info */}
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
                <p className="policy-desc">Refunds processed to original payment method within 5–7 business days.</p>
              </div>
            </div>
            <div className="policy-item">
              <span className="policy-icon">📧</span>
              <div>
                <p className="policy-title">Contact Us Directly</p>
                <p className="policy-desc">Email us at vashanth.tup@gmail.com for urgent queries.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
