import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

export default function Button({ children, variant = 'primary', size = 'md', className, ...rest }) {
  const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-transform active:scale-[0.995]';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base', // FIX: text-md is not a valid Tailwind class
    lg: 'px-5 py-3 text-lg',
  };
  const variants = {
    primary: 'bg-brand-500 text-ink-900 shadow-pop',
    ghost: 'bg-transparent text-ink-700 border border-[rgba(14,13,27,0.06)]',
    subtle: 'bg-surface-muted text-ink-700',
  };

  return (
    <button className={clsx(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'ghost', 'subtle']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};