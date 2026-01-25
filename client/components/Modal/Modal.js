'use client';

import { useEffect, useId, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

/**
 * Modal Component
 * Dialog box with compound components for flexible layouts
 *
 * Props:
 * - open: boolean - whether modal is visible (required)
 * - onClose: function - callback when modal should close (required)
 * - children: ReactNode - modal content
 * - size: string - modal width ('sm' | 'md' | 'lg' | 'xl' | 'fullscreen')
 *         default: 'md'
 * - variant: string - visual style ('default' | 'danger' | 'success')
 *            default: 'default'
 * - dismissOnOverlay: boolean - close on overlay click
 *                     default: true
 * - hideClose: boolean - hide close button
 *              default: false
 * - showScrollLock: boolean - lock body scroll
 *                   default: true
 */
export function Modal({
  open,
  onClose,
  children,
  size = 'md',
  variant = 'default',
  dismissOnOverlay = true,
  hideClose = false,
  showScrollLock = true
}) {
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // Handle scroll lock
  useEffect(() => {
    if (!open || !showScrollLock) return;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [open, showScrollLock]);

  // Handle keyboard (Escape key)
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Focus management
  useEffect(() => {
    if (open && modalRef.current) {
      // Store the previously focused element
      const previousActiveElement = document.activeElement;
      modalRef.current.focus();

      // Return focus on close
      return () => {
        if (previousActiveElement instanceof HTMLElement) {
          previousActiveElement.focus();
        }
      };
    }
  }, [open]);

  // Handle overlay click
  const handleOverlayClick = useCallback((event) => {
    if (dismissOnOverlay && event.target === overlayRef.current) {
      onClose?.();
    }
  }, [dismissOnOverlay, onClose]);

  if (!open) {
    return null;
  }

  const sizeClass = ` modal--${size}`;
  const variantClass = ` modal--${variant}`;
  const modalClass = `modal${sizeClass}${variantClass}`.trim();

  const modalContent = (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      ref={overlayRef}
      role="presentation"
    >
      <div
        className={modalClass}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
      >
        {!hideClose && (
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close dialog"
            title="Close (Esc)"
          >
            ✕
          </button>
        )}
        {children}
      </div>
    </div>
  );

  // Use portal to render modal at document body level
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return modalContent;
}

/**
 * Modal.Header - Header section with title and optional description
 */
function ModalHeader({ children, className = '' }) {
  return (
    <div className={`modal-header${className ? ' ' + className : ''}`}>
      {children}
    </div>
  );
}

/**
 * Modal.Title - Main title text with ARIA label support
 */
function ModalTitle({ children, id = null, className = '' }) {
  return (
    <h2
      className={`modal-title${className ? ' ' + className : ''}`}
      id={id}
    >
      {children}
    </h2>
  );
}

/**
 * Modal.Description - Secondary descriptive text
 */
function ModalDescription({ children, id = null, className = '' }) {
  return (
    <p
      className={`modal-description${className ? ' ' + className : ''}`}
      id={id}
    >
      {children}
    </p>
  );
}

/**
 * Modal.Body - Main content area
 */
function ModalBody({ children, className = '' }) {
  return (
    <div className={`modal-body${className ? ' ' + className : ''}`}>
      {children}
    </div>
  );
}

/**
 * Modal.Footer - Footer section for actions
 */
function ModalFooter({ children, className = '', align = 'end' }) {
  return (
    <div className={`modal-footer modal-footer--${align}${className ? ' ' + className : ''}`}>
      {children}
    </div>
  );
}

/**
 * Modal.Actions - Action buttons container (deprecated, use Modal.Footer)
 */
function ModalActions({ children, align = 'end', className = '' }) {
  return (
    <div className={`modal-actions modal-actions--${align}${className ? ' ' + className : ''}`}>
      {children}
    </div>
  );
}

// Attach sub-components
Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Actions = ModalActions;

export { ModalActions };
