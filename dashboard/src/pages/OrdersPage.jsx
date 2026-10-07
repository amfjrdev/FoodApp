import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ChefHat,
  PackageCheck,
  AlertCircle,
  Check,
  RefreshCw,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Modal } from '../components/common/Modal';
import { StatusBadge } from '../components/common/StatusBadge';
import { api } from '../services/api';

const STATUS_TABS = [
  { id: '', label: 'All Orders' },
  { id: 'PENDING', label: 'Pending' },
  { id: 'CONFIRMED', label: 'Confirmed' },
  { id: 'PREPARING', label: 'Preparing' },
  { id: 'READY', label: 'Ready' },
  { id: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { id: 'DELIVERED', label: 'Delivered' },
  { id: 'CANCELLED', label: 'Cancelled' },
];

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Selected order details drawer
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getOrders({
        status: activeTab || undefined,
        search: search || undefined,
        limit: 100,
      });
      if (res.success) setOrders(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [activeTab, search]);

  const handleStatusTransition = async (orderId, nextStatus) => {
    try {
      setStatusUpdating(true);
      setError('');
      const res = await api.updateOrderStatus(orderId, nextStatus);
      if (res.success) {
        showNotification(`Order ${res.data.orderNumber} status changed to ${nextStatus}`);
        setSelectedOrder(res.data);
        loadOrders();
      }
    } catch (err) {
      setError(err.message || 'Failed to update order status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const showNotification = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val || 0);

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + date.toLocaleDateString();
  };

  return (
    <>
      <Header
        title="Customer Order Management"
        subtitle="Track incoming orders, inspect line items, and advance status lifecycles"
      />

      <div className="page-body">
        {/* Success Alert */}
        {successMessage && (
          <div
            style={{
              backgroundColor: 'var(--status-delivering-bg)',
              color: '#065f46',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              fontWeight: 600,
            }}
          >
            <Check size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            style={{
              backgroundColor: 'var(--status-cancelled-bg)',
              color: '#b91c1c',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.5rem',
            marginBottom: '1.25rem',
          }}
        >
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: activeTab === tab.id ? 'var(--primary-500)' : 'var(--border-light)',
                backgroundColor: activeTab === tab.id ? 'var(--primary-500)' : 'white',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar & Refresh */}
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by Order # (e.g. FD-123456), customer name, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button onClick={loadOrders} className="btn btn-secondary" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spinner' : ''} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Orders Table */}
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Placed Time</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id || order.id}>
                    <td style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--primary-600)' }}>
                      {order.orderNumber}
                    </td>
                    <td style={{ fontWeight: 600 }}>{order.customerName}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {order.customerPhone}
                    </td>
                    <td
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        maxWidth: 220,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={order.deliveryAddress}
                    >
                      {order.deliveryAddress}
                    </td>
                    <td style={{ fontWeight: 600 }}>{order.items?.length || 0} items</td>
                    <td style={{ fontWeight: 800, color: 'var(--text-primary)' }}>
                      {formatCurrency(order.total)}
                    </td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {formatDate(order.createdAt)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailsOpen(true);
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', gap: '0.35rem' }}
                      >
                        <Eye size={14} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Status Transition Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={`Order Details · ${selectedOrder?.orderNumber || ''}`}
        maxWidth="650px"
      >
        {selectedOrder && (
          <div className="modal-body">
            {/* Status & Placed Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                backgroundColor: 'var(--bg-main)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.25rem',
                border: '1px solid var(--border-light)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Current Order Status
                </span>
                <div style={{ marginTop: 4 }}>
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  Placed At
                </span>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, marginTop: 4 }}>
                  {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Delivery Destination
              </h4>
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                }}
              >
                <p style={{ fontWeight: 700, fontSize: '1rem' }}>{selectedOrder.customerName}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: 2 }}>
                  Phone: <strong>{selectedOrder.customerPhone}</strong>
                </p>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.875rem', marginTop: 4 }}>
                  Address: {selectedOrder.deliveryAddress}
                </p>
                {selectedOrder.notes && (
                  <p
                    style={{
                      marginTop: '0.5rem',
                      fontSize: '0.8rem',
                      color: '#b45309',
                      backgroundColor: '#fef3c7',
                      padding: '0.375rem 0.625rem',
                      borderRadius: 'var(--radius-sm)',
                    }}
                  >
                    Note: "{selectedOrder.notes}"
                  </p>
                )}
              </div>
            </div>

            {/* Line Items Snapshot */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                Purchased Items ({selectedOrder.items?.length || 0})
              </h4>
              <div
                style={{
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }}
              >
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={item._id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderBottom:
                        idx < selectedOrder.items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      backgroundColor: idx % 2 === 0 ? 'white' : '#f8fafc',
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, marginRight: '0.5rem' }}>
                        {item.quantity}x
                      </span>
                      <span style={{ fontWeight: 600 }}>{item.foodNameSnapshot}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700 }}>
                        {formatCurrency(item.subtotal)}
                      </span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        @{formatCurrency(item.unitPriceSnapshot)} each
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Totals */}
            <div
              style={{
                backgroundColor: 'var(--bg-main)',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                border: '1px solid var(--border-light)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                <span style={{ fontWeight: 600 }}>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Delivery Fee</span>
                <span style={{ fontWeight: 600 }}>
                  {selectedOrder.deliveryFee === 0 ? 'FREE' : formatCurrency(selectedOrder.deliveryFee)}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: 8,
                  borderTop: '1px solid var(--border-light)',
                  fontSize: '1.1rem',
                }}
              >
                <span style={{ fontWeight: 800 }}>Grand Total</span>
                <span style={{ fontWeight: 800, color: 'var(--primary-600)' }}>
                  {formatCurrency(selectedOrder.total)}
                </span>
              </div>
            </div>

            {/* Interactive Status Transition Lifecycle Actions */}
            <div>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '0.625rem', color: 'var(--text-secondary)' }}>
                Advance Order Lifecycle
              </h4>

              <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
                {selectedOrder.status === 'PENDING' && (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleStatusTransition(selectedOrder._id || selectedOrder.id, 'CONFIRMED')}
                      disabled={statusUpdating}
                    >
                      <CheckCircle2 size={16} />
                      <span>Confirm Order</span>
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleStatusTransition(selectedOrder._id || selectedOrder.id, 'CANCELLED')}
                      disabled={statusUpdating}
                    >
                      <XCircle size={16} />
                      <span>Cancel Order</span>
                    </button>
                  </>
                )}

                {selectedOrder.status === 'CONFIRMED' && (
                  <>
                    <button
                      className="btn btn-primary"
                      style={{ backgroundColor: '#8b5cf6' }}
                      onClick={() => handleStatusTransition(selectedOrder._id || selectedOrder.id, 'PREPARING')}
                      disabled={statusUpdating}
                    >
                      <ChefHat size={16} />
                      <span>Start Kitchen Preparation</span>
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleStatusTransition(selectedOrder._id || selectedOrder.id, 'CANCELLED')}
                      disabled={statusUpdating}
                    >
                      <XCircle size={16} />
                      <span>Cancel</span>
                    </button>
                  </>
                )}

                {selectedOrder.status === 'PREPARING' && (
                  <>
                    <button
                      className="btn btn-primary"
                      style={{ backgroundColor: '#06b6d4' }}
                      onClick={() => handleStatusTransition(selectedOrder._id || selectedOrder.id, 'READY')}
                      disabled={statusUpdating}
                    >
                      <PackageCheck size={16} />
                      <span>Mark Ready for Pickup</span>
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleStatusTransition(selectedOrder._id || selectedOrder.id, 'CANCELLED')}
                      disabled={statusUpdating}
                    >
                      <XCircle size={16} />
                      <span>Cancel</span>
                    </button>
                  </>
                )}

                {selectedOrder.status === 'READY' && (
                  <button
                    className="btn btn-primary"
                    style={{ backgroundColor: '#10b981' }}
                    onClick={() => handleStatusTransition(selectedOrder._id || selectedOrder.id, 'OUT_FOR_DELIVERY')}
                    disabled={statusUpdating}
                  >
                    <Truck size={16} />
                    <span>Dispatch Courier (Out for Delivery)</span>
                  </button>
                )}

                {selectedOrder.status === 'OUT_FOR_DELIVERY' && (
                  <button
                    className="btn btn-primary"
                    style={{ backgroundColor: '#059669' }}
                    onClick={() => handleStatusTransition(selectedOrder._id || selectedOrder.id, 'DELIVERED')}
                    disabled={statusUpdating}
                  >
                    <CheckCircle2 size={16} />
                    <span>Mark as Delivered to Customer</span>
                  </button>
                )}

                {(selectedOrder.status === 'DELIVERED' || selectedOrder.status === 'CANCELLED') && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    This order is in a completed terminal state ({selectedOrder.status}).
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setIsDetailsOpen(false)}
          >
            Close Details
          </button>
        </div>
      </Modal>
    </>
  );
};
