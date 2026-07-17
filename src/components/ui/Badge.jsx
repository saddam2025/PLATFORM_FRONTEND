import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const variantMap = {
  brand: 'bg-brand-200 text-ink-900',
  info: 'bg-info-soft text-info-DEFAULT',
  success: 'bg-success-soft text-success-DEFAULT',
  danger: 'bg-danger-soft text-danger-DEFAULT',
  neutral: 'bg-surface-muted text-ink-700',
};

export default function Badge({ children, variant = 'neutral', className }) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', variantMap[variant], className)}>
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['brand', 'info', 'success', 'danger', 'neutral']),
  className: PropTypes.string,
};
