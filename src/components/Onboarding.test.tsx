import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Onboarding from './Onboarding';
import { DEFAULT_PROFILE } from '../utils/presets';

describe('Onboarding', () => {
  it('shows validation error when name is empty on step 1', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();

    render(<Onboarding onComplete={onComplete} initialProfile={DEFAULT_PROFILE} />);

    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('advances to step 2 when name and transport data are valid', async () => {
    const user = userEvent.setup();

    render(<Onboarding onComplete={vi.fn()} initialProfile={DEFAULT_PROFILE} />);

    await user.type(screen.getByLabelText(/what should the coach call you/i), 'Alex');
    await user.click(document.getElementById('onboarding-continue-button')!);

    expect(screen.getByText(/2\. Dietary Footprints/i)).toBeInTheDocument();
  });
});
