import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

describe('ErrorBoundary', () => {
  it('renders fallback UI when a child throws', () => {
    const Thrower = () => {
      throw new Error('test error');
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <Thrower />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
    consoleSpy.mockRestore();
  });
});
