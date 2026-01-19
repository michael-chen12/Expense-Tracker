'use client';

import { FocusEvent } from 'react';

export default function SkipToMain() {
  const handleFocus = (e: FocusEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.left = '16px';
    e.currentTarget.style.top = '16px';
  };

  const handleBlur = (e: FocusEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.left = '-9999px';
    e.currentTarget.style.top = '0';
  };

  return (
    <a
      href="#main-content"
      className="skip-to-main"
      style={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 999,
        padding: '12px 16px',
        background: '#ff7a00',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: '600'
      }}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      Skip to main content
    </a>
  );
}
