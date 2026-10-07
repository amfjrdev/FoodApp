import React from 'react';

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    bg: 'var(--status-pending-bg)',
    color: '#b45309',
    dot: '#f59e0b',
  },
  CONFIRMED: {
    label: 'Confirmed',
    bg: 'var(--status-confirmed-bg)',
    color: '#1d4ed8',
    dot: '#3b82f6',
  },
  PREPARING: {
    label: 'Preparing',
    bg: 'var(--status-preparing-bg)',
    color: '#6d28d9',
    dot: '#8b5cf6',
  },
  READY: {
    label: 'Ready for Pickup',
    bg: 'var(--status-ready-bg)',
    color: '#0e7490',
    dot: '#06b6d4',
  },
  OUT_FOR_DELIVERY: {
    label: 'Out for Delivery',
    bg: 'var(--status-delivering-bg)',
    color: '#047857',
    dot: '#10b981',
  },
  DELIVERED: {
    label: 'Delivered',
    bg: 'var(--status-delivered-bg)',
    color: '#065f46',
    dot: '#059669',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'var(--status-cancelled-bg)',
    color: '#b91c1c',
    dot: '#ef4444',
  },
};

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    bg: '#f1f5f9',
    color: '#475569',
    dot: '#94a3b8',
  };

  return (
    <span
      className="badge"
      style={{
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: config.dot,
        }}
      />
      {config.label}
    </span>
  );
};
