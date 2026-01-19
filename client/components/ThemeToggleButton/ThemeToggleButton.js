'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import './ThemeToggleButton.css';

const THEME_STORAGE_KEY = 'ledgerline-theme';

function applyTheme(theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme === 'light' ? 'light' : 'dark';
}

export default function ThemeToggleButton() {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    const initial = storedTheme || (prefersLight ? 'light' : 'dark');
    setTheme(initial);
    applyTheme(initial);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme, mounted]);

  const currentTheme = mounted ? theme : 'dark';
  const isLight = currentTheme === 'light';
  const label = isLight ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <Button
      className="theme-toggle"
      aria-label={label}
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
    >
      {isLight ? (
        <svg className="theme-icon" width="24" height="24" viewBox="0 0 24 24" fill="#A855F7" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg className="theme-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="12" r="5" />
          <rect x="11" y="1" width="2" height="3" />
          <rect x="11" y="20" width="2" height="3" />
          <rect x="3.22" y="3.22" width="2.12" height="2.12" transform="rotate(-45 4.28 4.28)" />
          <rect x="18.66" y="18.66" width="2.12" height="2.12" transform="rotate(-45 19.72 19.72)" />
          <rect x="1" y="11" width="3" height="2" />
          <rect x="20" y="11" width="3" height="2" />
          <rect x="3.22" y="18.66" width="2.12" height="2.12" transform="rotate(45 4.28 19.72)" />
          <rect x="18.66" y="3.22" width="2.12" height="2.12" transform="rotate(45 19.72 4.28)" />
        </svg>
      )}
    </Button>
  );
}
