import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ordersApi } from '../../api';
import './Orders.css';

const INR = n =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const dateStr = s => {
  const d = new Date(s);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const STATUS_CLASSES = {
  pending:    'status-pending',
  processing: 'status-processing',
  shipped:    'status-shipped',
  delivered:  'status-delivered',
  cancelled:  'status-cancelled',
};

export default function Orders() {
  const { navigate } = useApp();

  const [orders,       setOrders]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [expandedId,   setExpandedId]   = useState(null);

  useEffect(() => {
    ordersApi.getAll()
      .then(r => { setOrders(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedId(prev => prev === orderId ? null : orderId);
  };

  if (loading) return (
    <div className="orders-page">
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate('home')}>Home</span>
        <span className="breadcrumb-sep">›</span>
        <span>My Orders</span>
      </div>
      <div className="orders-wrap">
        <h1 className="orders-title">My <em>Orders</em></h1>
        {[1,2,3].map(i => (
          <div key={i} className="order-card-skeleton">
            <div className="skeleton" style={{ height: 16, width: '30%', marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 12, width: '20%' }} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="orders-page">
      <div className="breadcrumb">
        <span className="breadcrumb-link" onClick={() => navigate('home')}>Home</span>
        <span className="breadcrumb-sep">›</span>
        <span>My Orders</span>
      </div>

      <div className="orders-wrap">
        <h1 className="orders-title">My <em>Orders</em></h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3 className="empty-state-title">No orders yet</h3>
            <p className="empty-state-sub">Your orders will appear here once you checkout</p>
            <button className="btn btn-dark" onClick={() => navigate('products')}>
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map(order => {
            const status   = order.status || 'pending';
            const expanded = expandedId === order._id;
            const itemCount = order.items?.length || 0;

            return (
              <div key={order._id} className="order-card">
                {/* Header */}
                <div className="order-card-header">
                  <div className="order-meta">
                    <p className="order-number">{order.order_number}</p>
                    <p className="order-date">{dateStr(order.createdAt)}</p>
                  </div>
                  <span className={`order-status ${STATUS_CLASSES[status] || 'status-pending'}`}>
                    {status.toUpperCase()}
                  </span>
                </div>

                {/* Summary */}
                <div className="order-summary-row">
                  <div className="order-summary-info">
                    <span className="order-items-count">
                      {itemCount} item{itemCount !== 1 ? 's' : ''}
                    </span>
                    <span className="order-meta-sep">·</span>
                    <span className="order-payment">
                      {(order.payment_method || 'COD').toUpperCase()}
                    </span>
                  </div>
                  <p className="order-total">{INR(order.total_amount)}</p>
                </div>

                {/* Expand toggle */}
                <button
                  className="order-expand-btn"
                  onClick={() => toggleExpand(order._id)}
                >
                  {expanded ? 'Hide Details ↑' : 'View Details ↓'}
                </button>

                {/* Expanded details — data is already in the order object */}
                {expanded && (
                  <div className="order-detail-panel">
                    <div className="order-items-list">
                      {order.items?.map((item, i) => (
                        <div key={i} className="order-item-row">
                          <img
                            className="order-item-img"
                            src={item.product_image || ''}
                            alt={item.product_name}
                            onError={e => { e.target.style.background = 'var(--sand)'; e.target.src = ''; }}
                          />
                          <div className="order-item-info">
                            <p className="order-item-name">{item.product_name}</p>
                            <p className="order-item-qty">Qty: {item.quantity}</p>
                          </div>
                          <p className="order-item-price">{INR(item.subtotal)}</p>
                        </div>
                      ))}
                    </div>

                    <div className="order-totals-block">
                      <div className="order-totals-row">
                        <span>Subtotal</span>
                        <span>{INR(order.subtotal)}</span>
                      </div>
                      <div className="order-totals-row">
                        <span>Shipping</span>
                        <span>{INR(order.shipping_charge)}</span>
                      </div>
                      <div className="order-totals-row order-grand-total">
                        <span>Total</span>
                        <span>{INR(order.total_amount)}</span>
                      </div>
                    </div>

                    <div className="order-shipping-addr">
                      <p className="order-shipping-label">Delivery Address</p>
                      <p>{order.customer_name} · {order.customer_phone}</p>
                      <p>{order.shipping_address}, {order.shipping_city}, {order.shipping_state} – {order.shipping_pincode}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
