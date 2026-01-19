import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkeletonCard, SkeletonText, SkeletonExpenseRow, SkeletonGrid } from '../SkeletonLoader';

describe('SkeletonLoader', () => {
  describe('SkeletonCard', () => {
    it('should render with default height', () => {
      const { container } = render(<SkeletonCard />);
      const skeleton = container.firstChild;
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveStyle({ height: '120px' });
    });

    it('should render with custom height', () => {
      const { container } = render(<SkeletonCard height="200px" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveStyle({ height: '200px' });
    });

    it('should have accessibility attributes', () => {
      const { container } = render(<SkeletonCard />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading...');
    });

    it('should have card class', () => {
      const { container } = render(<SkeletonCard />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass('card', 'skeleton');
    });
  });

  describe('SkeletonText', () => {
    it('should render with default dimensions', () => {
      const { container } = render(<SkeletonText />);
      const skeleton = container.firstChild;
      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveStyle({ width: '100%', height: '16px' });
    });

    it('should render with custom dimensions', () => {
      const { container } = render(<SkeletonText width="50%" height="24px" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveStyle({ width: '50%', height: '24px' });
    });

    it('should have accessibility attributes', () => {
      const { container } = render(<SkeletonText />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
      expect(skeleton).toHaveAttribute('aria-label', 'Loading...');
    });
  });

  describe('SkeletonExpenseRow', () => {
    it('should render expense row structure', () => {
      const { container } = render(<SkeletonExpenseRow />);
      expect(container.querySelector('.card')).toBeInTheDocument();
    });

    it('should contain multiple skeleton text elements', () => {
      render(<SkeletonExpenseRow />);
      const skeletons = screen.getAllByLabelText('Loading...');
      expect(skeletons.length).toBeGreaterThan(1);
    });
  });

  describe('SkeletonGrid', () => {
    it('should render with default count', () => {
      render(<SkeletonGrid />);
      const skeletons = screen.getAllByLabelText('Loading...');
      expect(skeletons).toHaveLength(3);
    });

    it('should render with custom count', () => {
      render(<SkeletonGrid count={5} />);
      const skeletons = screen.getAllByLabelText('Loading...');
      expect(skeletons).toHaveLength(5);
    });

    it('should apply grid layout with custom columns', () => {
      const { container } = render(<SkeletonGrid columns={2} />);
      const grid = container.firstChild;
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(2, 1fr)' });
    });

    it('should apply default grid layout', () => {
      const { container } = render(<SkeletonGrid />);
      const grid = container.firstChild;
      expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(3, 1fr)' });
    });
  });
});
