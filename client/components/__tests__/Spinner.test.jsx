import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spinner from '../Spinner';

describe('Spinner', () => {
  it('should render spinner', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('should apply size prop', () => {
    const { container } = render(<Spinner size="large" />);
    const spinner = container.firstChild;
    expect(spinner).toHaveClass('spinner-large');
  });

  it('should apply color prop', () => {
    const { container } = render(<Spinner color="primary" />);
    const spinner = container.firstChild;
    expect(spinner).toHaveClass('spinner-primary');
  });

  it('should have default props', () => {
    const { container } = render(<Spinner />);
    const spinner = container.firstChild;
    // Should have some default class
    expect(spinner).toHaveClass('spinner');
  });
});
