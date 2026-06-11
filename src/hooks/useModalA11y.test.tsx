import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useRef } from 'react';
import { useModalA11y } from './useModalA11y';

function ModalHarness({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useModalA11y(isOpen, onClose, ref);

  if (!isOpen) return null;

  return (
    <div ref={ref} role="dialog" aria-modal="true">
      <button type="button">First</button>
      <button type="button">Second</button>
    </div>
  );
}

describe('useModalA11y', () => {
  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(<ModalHarness isOpen onClose={onClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
