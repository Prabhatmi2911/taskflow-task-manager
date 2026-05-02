import React from 'react';

/**
 * Spinner — reusable loading indicator.
 * Accepts size ('sm' | 'md' | 'lg') and color props.
 */
export default function Spinner({ size = 'md', color = 'primary', className = '' }) {
  const sizeMap = {
    sm: '14px',
    md: '20px',
    lg: '36px',
  };

  const colorMap = {
    primary: 'var(--color-primary)',
    white: '#ffffff',
    muted: 'var(--color-text-muted)',
  };

  const dim = sizeMap[size] || sizeMap.md;
  const clr = colorMap[color] || colorMap.primary;

  return (
    <span
      role="status"
      aria-label="Loading"
      className={className}
      style={{
        display: 'inline-block',
        width: dim,
        height: dim,
        borderRadius: '50%',
        border: `2px solid transparent`,
        borderTopColor: clr,
        borderRightColor: clr,
        animation: 'spin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  );
}