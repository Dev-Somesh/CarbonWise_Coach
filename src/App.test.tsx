import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App accessibility', () => {
  it('renders skip link to main content', () => {
    render(<App />);
    const skipLink = screen.getByRole('link', { name: /skip to main content/i });
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders main landmark with id main-content', () => {
    render(<App />);
    expect(document.getElementById('main-content')).toBeInTheDocument();
  });
});
