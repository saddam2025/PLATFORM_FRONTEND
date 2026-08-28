import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Add the final image at public/assets/brand/logo.png. The fallback keeps one
// shared brand component working until that asset is supplied.
export default function Logo({ to = '/', light = false, className = '' }) {
  const [imageAvailable, setImageAvailable] = useState(true);
  const labelClass = light ? 'text-white' : 'text-navy-900';

  return (
    <Link to={to} className={`inline-flex min-w-0 items-center ${className}`} aria-label="الصفحة الرئيسية">
      {imageAvailable ? (
        <img src="/assets/brand/logo.png" alt="منصة" className="h-10 w-auto max-w-[118px] object-contain" onError={() => setImageAvailable(false)} />
      ) : <span className={`text-xl font-extrabold tracking-tight ${labelClass}`}>منصة</span>}
    </Link>
  );
}
