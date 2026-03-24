import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ordersApi } from '../../api';
import './Orders.css';

const INR = n =>
  '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

const dateStr = s =>
  new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

// Status values from orders table — status enum: pending,processing,shipped,delivered,cancelled
const STATUS_CLASSES = {
  pending:    'status-pending',
  processing: 'status-processing',
  shipped:    'status-shipped',
  delivered:  'status-delivered',
  cancelled:  'status-cancelled',
};

export default function Orders() {
  const { navigate } = useApp();

  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [expandedId,    setExpandedId]    = useState(null);
  const [orderDetails,  setOrderDetails]  = useState({}); // { [id]: order_with_items }
  const [detailLoading, setDetailLoading] = useState(null);

  useEffect(() => {
    ordersApi.getAll()
      .then(r => { setOrders(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const toggleExpand = async (orderId) => {
    if (expandedId === orderId) { setExpandedId(null); return; }
    setExpandedId(orderId);

    if (!orderDetails[orderId]) {
      setDetailLoading(orderId);
      try {
        const r = await ordersApi.getById(orderId);
        if (r.success) {
          setOrderDetails(prev => ({ ...prev, [orderId]: r.data }));
        }
      } catch { /* ignore */ }
      setDetailLoading(null);
    }
  };

  const getStatus = (order) =>
    // orders.php returns order_status (from checkout.php insert) or status
    order.order_status || order.status || 'pending';

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
            const status   = getStatus(order);
            const expanded = expandedId === order.id;
            const detail   = orderDetails[order.id];

            return (
              <div key={order.id} className="order-card">
                {/* Header row */}
                <div className="order-card-header">
                  <div className="order-meta">
                    {/* order_number from checkout.php generateOrderNumber() */}
                    <p className="order-number">{order.order_number}</p>
                    <p className="order-date">{dateStr(order.created_at)}</p>
                  </div>

                  <span className={`order-status ${STATUS_CLASSES[status] || 'status-pending'}`}>
                    {status.toUpperCase()}
                  </span>
                </div>

                {/* Summary row */}
                <div className="order-summary-row">
                  <div className="order-summary-info">
                    {/* item_count from COUNT(oi.id) in orders.php */}
                    <span className="order-items-count">
                      {order.item_count} item{order.item_count !== 1 ? 's' : ''}
                    </span>
                    <span className="order-meta-sep">·</span>
                    {/* payment_method from orders table */}
                    <span className="order-payment">
                      {(order.payment_method || 'COD').toUpperCase()}
                    </span>
                    {order.shipping_city && (
                      <>
                        <span className="order-meta-sep">·</span>
                        <span className="order-city">{order.shipping_city}</span>
                      </>
                    )}
                  </div>

                  {/* total_amount from orders table */}
                  <p className="order-total">{INR(order.total_amount)}</p>
                </div>

                {/* Expand toggle */}
                <button
                  className="order-expand-btn"
                  onClick={() => toggleExpand(order.id)}
                >
                  {expanded ? 'Hide Details ↑' : 'View Details ↓'}
                </button>

                {/* Expanded: items from order_items table */}
                {expanded && (
                  <div className="order-detail-panel">
                    {detailLoading === order.id ? (
                      <p className="detail-loading">Loading…</p>
                    ) : detail ? (
                      <>
                        <div className="order-items-list">
                          {detail.items?.map(item => (
                            <div key={item.id} className="order-item-row">
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
                            <span>{INR(detail.subtotal)}</span>
                          </div>
                          <div className="order-totals-row">
                            <span>Shipping</span>
                            <span>{INR(detail.shipping_charge)}</span>
                          </div>
                          {detail.tax_amount > 0 && (
                            <div className="order-totals-row">
                              <span>Tax</span>
                              <span>{INR(detail.tax_amount)}</span>
                            </div>
                          )}
                          <div className="order-totals-row order-grand-total">
                            <span>Total</span>
                            <span>{INR(detail.total_amount)}</span>
                          </div>
                        </div>

                        <div className="order-shipping-addr">
                          <p className="order-shipping-label">Delivery Address</p>
                          <p>
                            {detail.customer_name} · {detail.customer_phone}
                          </p>
                          <p>
                            {detail.shipping_address}, {detail.shipping_city},&nbsp;
                            {detail.shipping_state} – {detail.shipping_pincode}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="detail-loading">Could not load details.</p>
                    )}
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
