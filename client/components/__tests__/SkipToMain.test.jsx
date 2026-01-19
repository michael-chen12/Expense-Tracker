import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SkipToMain from '../SkipToMain';

describe('SkipToMain', () => {
  it('should render skip link', () => {
    render(<SkipToMain />);
    const link = screen.getByText('Skip to main content');
    expect(link).toBeInTheDocument();
  });

  it('should have correct href', () => {
    render(<SkipToMain />);
    const link = screen.getByText('Skip to main content');
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('should be positioned off-screen by default', () => {
    render(<SkipToMain />);
    const link = screen.getByText('Skip to main content');
    expect(link).toHaveStyle({ left: '-9999px' });
  });

  it('should move on-screen when focused', async () => {
    const user = userEvent.setup();
    render(<SkipToMain />);
    const link = screen.getByText('Skip to main content');

    await user.tab(); // Focus the link

    expect(link).toHaveStyle({ left: '16px', top: '16px' });
  });

  it('should move off-screen when blurred', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <SkipToMain />
        <button>Other element</button>
      </div>
    );
    const link = screen.getByText('Skip to main content');

    await user.tab(); // Focus the link
    expect(link).toHaveStyle({ left: '16px' });

    await user.tab(); // Blur by focusing next element
    expect(link).toHaveStyle({ left: '-9999px' });
  });

  it('should have skip-to-main class', () => {
    render(<SkipToMain />);
    const link = screen.getByText('Skip to main content');
    expect(link).toHaveClass('skip-to-main');
  });
});
