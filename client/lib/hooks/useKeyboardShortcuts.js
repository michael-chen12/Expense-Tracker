'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * useKeyboardShortcuts Hook
 *
 * Provides global keyboard shortcuts for the application.
 *
 * Shortcuts:
 * - `n` - Navigate to new expense page
 * - `/` - Focus the search/filter input (if exists)
 * - `Escape` - Close modals, blur focused inputs
 * - `g` then `h` - Go to home/dashboard
 * - `g` then `e` - Go to expenses
 * - `g` then `r` - Go to recurring expenses
 * - `g` then `s` - Go to summary
 * - `?` - Show keyboard shortcuts help (dispatches custom event)
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.enabled - Whether shortcuts are enabled (default: true)
 * @param {Function} options.onShowHelp - Callback when help shortcut is triggered
 */
export default function useKeyboardShortcuts(options = {}) {
  const { enabled = true, onShowHelp } = options;
  const router = useRouter();

  // Track if we're in a "go to" sequence (g was pressed)
  let goSequenceActive = false;
  let goSequenceTimeout = null;

  const handleKeyDown = useCallback((event) => {
    // Don't trigger shortcuts when typing in inputs, textareas, or contenteditable
    const target = event.target;
    const isInputField =
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable;

    // Allow Escape to work even in input fields
    if (event.key === 'Escape') {
      // Blur any focused input
      if (document.activeElement && document.activeElement !== document.body) {
        document.activeElement.blur();
      }
      // Dispatch custom event for modals to listen to
      window.dispatchEvent(new CustomEvent('keyboard-escape'));
      return;
    }

    // Don't process other shortcuts if in input field
    if (isInputField) {
      return;
    }

    // Don't trigger if modifier keys are pressed (except shift for ?)
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    const key = event.key.toLowerCase();

    // Handle "go to" sequence
    if (goSequenceActive) {
      clearTimeout(goSequenceTimeout);
      goSequenceActive = false;

      switch (key) {
        case 'h':
          event.preventDefault();
          router.push('/');
          return;
        case 'e':
          event.preventDefault();
          router.push('/expenses');
          return;
        case 'r':
          event.preventDefault();
          router.push('/recurring');
          return;
        case 's':
          event.preventDefault();
          router.push('/summary');
          return;
        default:
          // Invalid sequence, ignore
          return;
      }
    }

    // Start "go to" sequence
    if (key === 'g') {
      goSequenceActive = true;
      // Reset after 1 second if no follow-up key
      goSequenceTimeout = setTimeout(() => {
        goSequenceActive = false;
      }, 1000);
      return;
    }

    // Single key shortcuts
    switch (key) {
      case 'n':
        event.preventDefault();
        router.push('/expenses/new');
        break;

      case '/':
        event.preventDefault();
        // Try to focus search input or filter input
        const searchInput = document.querySelector('[data-search-input]') ||
                           document.querySelector('input[type="search"]') ||
                           document.querySelector('#search') ||
                           document.querySelector('input[name="search"]');
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
        break;

      case '?':
        if (event.shiftKey) {
          event.preventDefault();
          if (onShowHelp) {
            onShowHelp();
          }
          // Dispatch custom event for help modal
          window.dispatchEvent(new CustomEvent('keyboard-help'));
        }
        break;

      default:
        break;
    }
  }, [router, onShowHelp]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (goSequenceTimeout) {
        clearTimeout(goSequenceTimeout);
      }
    };
  }, [enabled, handleKeyDown]);

  return {
    shortcuts: [
      { key: 'n', description: 'New expense' },
      { key: '/', description: 'Focus search' },
      { key: 'Esc', description: 'Close modal / Blur input' },
      { key: 'g h', description: 'Go to Dashboard' },
      { key: 'g e', description: 'Go to Expenses' },
      { key: 'g r', description: 'Go to Recurring' },
      { key: 'g s', description: 'Go to Summary' },
      { key: '?', description: 'Show keyboard shortcuts' },
    ]
  };
}
