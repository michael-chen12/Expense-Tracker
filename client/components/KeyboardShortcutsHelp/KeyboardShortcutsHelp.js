'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/Modal';
import './KeyboardShortcutsHelp.css';

/**
 * KeyboardShortcutsHelp Component
 *
 * Displays a modal with all available keyboard shortcuts.
 * Can be triggered by pressing '?' or via the onShowHelp callback.
 */
export default function KeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleShowHelp = () => {
      setIsOpen(true);
    };

    const handleEscape = () => {
      setIsOpen(false);
    };

    window.addEventListener('keyboard-help', handleShowHelp);
    window.addEventListener('keyboard-escape', handleEscape);

    return () => {
      window.removeEventListener('keyboard-help', handleShowHelp);
      window.removeEventListener('keyboard-escape', handleEscape);
    };
  }, []);

  const shortcuts = [
    { category: 'Navigation', items: [
      { key: 'g h', description: 'Go to Dashboard' },
      { key: 'g e', description: 'Go to Expenses' },
      { key: 'g r', description: 'Go to Recurring' },
      { key: 'g s', description: 'Go to Summary' },
    ]},
    { category: 'Actions', items: [
      { key: 'n', description: 'New expense' },
      { key: '/', description: 'Focus search/filter' },
    ]},
    { category: 'General', items: [
      { key: 'Esc', description: 'Close modal / Blur input' },
      { key: '?', description: 'Show this help' },
    ]},
  ];

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title="Keyboard Shortcuts"
      description="Use these shortcuts to navigate faster"
    >
      <div className="shortcuts-container">
        {shortcuts.map((group) => (
          <div key={group.category} className="shortcuts-group">
            <h3 className="shortcuts-category">{group.category}</h3>
            <ul className="shortcuts-list">
              {group.items.map((shortcut) => (
                <li key={shortcut.key} className="shortcut-item">
                  <kbd className="shortcut-key">{shortcut.key}</kbd>
                  <span className="shortcut-description">{shortcut.description}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="shortcuts-footer">
        <button
          type="button"
          className="button primary"
          onClick={() => setIsOpen(false)}
        >
          Got it
        </button>
      </div>
    </Modal>
  );
}
