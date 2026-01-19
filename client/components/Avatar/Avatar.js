'use client';

import Image from 'next/image';
import './Avatar.css';

/**
 * Avatar Component
 * Display user profile pictures or initials
 *
 * Props:
 * - src: string - image source URL
 * - alt: string - image alt text (required for accessibility)
 * - size: string - avatar size ('xs' | 'sm' | 'md' | 'lg' | 'xl')
 *         default: 'md'
 * - fallback: string - initials to show if no image (e.g., 'JD')
 * - variant: string - shape ('circle' | 'square')
 *            default: 'circle'
 * - className: string - additional CSS classes
 */
export default function Avatar({
  src = null,
  alt = '',
  size = 'md',
  fallback = '',
  variant = 'circle',
  className = ''
}) {
  const baseClass = 'avatar';
  const sizeClass = ` avatar--${size}`;
  const variantClass = ` avatar--${variant}`;

  const combinedClass = `${baseClass}${sizeClass}${variantClass}${className ? ' ' + className : ''}`.trim();

  if (src) {
    return (
      <div className={combinedClass}>
        <Image
          src={src}
          alt={alt}
          fill
          className="avatar-image"
          sizes="(max-width: 768px) 40px, 48px"
        />
      </div>
    );
  }

  if (fallback) {
    return (
      <div className={`${combinedClass} avatar--fallback`}>
        <span className="avatar-fallback-text">{fallback}</span>
      </div>
    );
  }

  // Empty avatar placeholder
  return <div className={`${combinedClass} avatar--placeholder`} />;
}
