'use client';

import { useState } from 'react';
import Button from './Button';

/**
 * LoadingButton Component
 * Thin wrapper around Button with built-in async operation handling
 *
 * Props:
 * - All Button props (variant, size, leftIcon, rightIcon, etc.)
 * - onClick: async function - will show loading state while executing
 * - loadingText: string - text to show while loading (optional)
 * - isLoading: boolean - externally controlled loading state (optional)
 *
 * Usage:
 * <LoadingButton
 *   variant="primary"
 *   onClick={async () => {
 *     await saveData();
 *   }}
 *   loadingText="Saving..."
 * >
 *   Save Changes
 * </LoadingButton>
 */
export default function LoadingButton({
  onClick,
  isLoading: externalIsLoading = null,
  loadingText = null,
  disabled = false,
  children,
  ...props
}) {
  const [internalIsLoading, setInternalIsLoading] = useState(false);

  // Use external loading state if provided, otherwise use internal
  const isLoading = externalIsLoading !== null ? externalIsLoading : internalIsLoading;

  const handleClick = async (event) => {
    if (!onClick || isLoading || disabled) return;

    // Only manage internal loading state if no external control
    if (externalIsLoading === null) {
      setInternalIsLoading(true);
    }

    try {
      await onClick(event);
    } catch (error) {
      console.error('LoadingButton onClick error:', error);
      throw error;
    } finally {
      // Only reset internal loading state if no external control
      if (externalIsLoading === null) {
        setInternalIsLoading(false);
      }
    }
  };

  return (
    <Button
      onClick={handleClick}
      loading={isLoading}
      loadingText={loadingText}
      disabled={disabled || isLoading}
      {...props}
    >
      {children}
    </Button>
  );
}
