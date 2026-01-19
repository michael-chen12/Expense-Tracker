'use client';

import { useEffect, useId, useRef } from 'react';
import './Modal.css';

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  dismissOnOverlay = true,
  hideClose = false
}) {
  const modalRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open && modalRef.current) {
      modalRef.current.focus();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const sizeClass = size ? `modal--${size}` : '';

  return (
    <div
      className="modal-overlay"
      onClick={dismissOnOverlay ? onClose : undefined}
    >
      <div
        className={`modal ${sizeClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? `${titleId}-title` : undefined}
        aria-describedby={description ? `${descriptionId}-description` : undefined}
        onClick={(event) => event.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
      >
        {!hideClose && (
          <button
            type="button"
            className="button ghost button--icon modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        )}

        {title ? (
          <h2 className="modal-title" id={`${titleId}-title`}>
            {title}
          </h2>
        ) : null}

        {description ? (
          <p className="modal-description" id={`${descriptionId}-description`}>
            {description}
          </p>
        ) : null}

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export function ModalActions({ children, align = 'end', className = '' }) {
  const alignClass = align ? `modal-actions--${align}` : '';
  return <div className={`modal-actions ${alignClass} ${className}`}>{children}</div>;
}
