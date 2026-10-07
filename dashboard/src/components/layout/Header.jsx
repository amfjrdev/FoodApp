import React from 'react';
import { Bell, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ title, subtitle }) => {
  const { admin } = useAuth();

  return (
    <header className="header">
      <div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItem: 'center', gap: '1.25rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.4rem 0.875rem',
            backgroundColor: 'var(--bg-main)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-light)',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: 'var(--primary-500)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}
          >
            {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            {admin?.name || 'Administrator'}
          </span>
          <ShieldCheck size={16} color="var(--status-delivering)" />
        </div>
      </div>
    </header>
  );
};
