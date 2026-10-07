import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  DollarSign,
  UtensilsCrossed,
  Layers,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { StatusBadge } from '../components/common/StatusBadge';
import { api } from '../services/api';

export const OverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.getStatistics();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
        title="Executive Overview"
        subtitle="Real-time performance metrics, incoming orders & inventory status"
      />

      <div className="page-body">
        {/* Controls & Quick Refresh */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
          <button
            onClick={fetchStats}
            className="btn btn-secondary btn-sm"
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'spinner' : ''} />
            <span>Refresh Data</span>
          </button>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'var(--status-cancelled-bg)',
              color: '#b91c1c',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Stat Cards Grid */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Orders</span>
              <h3 className="stat-value">{stats?.overview?.totalOrders ?? '—'}</h3>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <ShoppingBag size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Pending Approval</span>
              <h3 className="stat-value" style={{ color: '#b45309' }}>
                {stats?.overview?.pendingOrders ?? '—'}
              </h3>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
              <Clock size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Revenue</span>
              <h3 className="stat-value" style={{ color: '#059669' }}>
                {stats ? formatCurrency(stats.overview.totalRevenue) : '—'}
              </h3>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>
              <DollarSign size={24} />
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Active Foods</span>
              <h3 className="stat-value">{stats?.overview?.activeFoods ?? '—'}</h3>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#fdf2f8', color: '#db2777' }}>
              <UtensilsCrossed size={24} />
            </div>
          </div>
        </div>

        {/* 2. Order Status Pipeline Visualizer */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Order Status Distribution</h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '1rem',
            }}
          >
            {[
              { status: 'PENDING', label: 'Pending', count: stats?.ordersByStatus?.PENDING || 0 },
              { status: 'CONFIRMED', label: 'Confirmed', count: stats?.ordersByStatus?.CONFIRMED || 0 },
              { status: 'PREPARING', label: 'Preparing', count: stats?.ordersByStatus?.PREPARING || 0 },
              { status: 'READY', label: 'Ready', count: stats?.ordersByStatus?.READY || 0 },
              { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', count: stats?.ordersByStatus?.OUT_FOR_DELIVERY || 0 },
              { status: 'DELIVERED', label: 'Delivered', count: stats?.ordersByStatus?.DELIVERED || 0 },
              { status: 'CANCELLED', label: 'Cancelled', count: stats?.ordersByStatus?.CANCELLED || 0 },
            ].map((item) => (
              <div
                key={item.status}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-main)',
                  border: '1px solid var(--border-light)',
                  textAlign: 'center',
                }}
              >
                <StatusBadge status={item.status} />
                <p
                  style={{
                    fontSize: '1.4rem',
                    fontWeight: 800,
                    marginTop: '0.5rem',
                    fontFamily: 'var(--font-heading)',
                  }}
                >
                  {item.count}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Recent Incoming Orders */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Customer Orders</h2>
            <Link
              to="/orders"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--primary-500)',
                textDecoration: 'none',
              }}
            >
              <span>View All Orders</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Placed At</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                      <div className="spinner" />
                    </td>
                  </tr>
                ) : stats?.recentOrders?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}
                    >
                      No customer orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  stats?.recentOrders?.map((order) => (
                    <tr key={order._id || order.id}>
                      <td style={{ fontWeight: 700, fontFamily: 'monospace' }}>
                        {order.orderNumber}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {order.deliveryAddress}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {order.customerPhone}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {order.items?.length || 0} item(s)
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                        {formatCurrency(order.total)}
                      </td>
                      <td>
                        <StatusBadge status={order.status} />
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {formatDate(order.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
