import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

export default function Input({ className, error, icon, ...rest }) {
  return (
    <div className={clsx('relative', className)}>
      {icon && <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none">{icon}</div>}
      <input
        {...rest}
        className={clsx(
          'input w-full',
          icon ? 'pr-10' : '',
          error ? 'border-danger-DEFAULT' : ''
        )}
        aria-invalid={Boolean(error)}
      />
      {error && <p className="text-xs text-danger-DEFAULT mt-1">{error}</p>}
    </div>
  );
}

Input.propTypes = {
  className: PropTypes.string,
  error: PropTypes.string,
  icon: PropTypes.node,
};
