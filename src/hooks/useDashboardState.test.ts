import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDashboardState } from './useDashboardState';
import { DEFAULT_PROFILE } from '../utils/presets';
import type { CarbonFootprint, WeeklyChallenge, EmissionHistoryItem } from '../types';

vi.mock('../utils/pdfGenerator', () => ({
  generateCarbonReport: vi.fn(),
}));

import { generateCarbonReport } from '../utils/pdfGenerator';

const footprint: CarbonFootprint = {
  transport: 3000,
  diet: 1200,
  energy: 900,
  shopping: 400,
  total: 5500,
};

const challenges: WeeklyChallenge[] = [];
const history: EmissionHistoryItem[] = [];

function renderDashboardHook(overrides: Partial<Parameters<typeof useDashboardState>[0]> = {}) {
  const onAddHistoryLog = vi.fn();
  const onUpdateProfile = vi.fn();

  const hook = renderHook(() =>
    useDashboardState({
      profile: DEFAULT_PROFILE,
      footprint,
      challenges,
      history,
      onAddHistoryLog,
      onUpdateProfile,
      ...overrides,
    }),
  );

  return { ...hook, onAddHistoryLog, onUpdateProfile };
}

describe('useDashboardState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(generateCarbonReport).mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with overview tab and footprint view', () => {
    const { result } = renderDashboardHook();
    expect(result.current.activeTab).toBe('overview');
    expect(result.current.scoreViewMode).toBe('footprint');
    expect(result.current.isSimulating).toBe(false);
  });

  it('derives primary category and quick-win tip from footprint', () => {
    const { result } = renderDashboardHook();
    expect(result.current.primaryCategory.key).toBe('transport');
    expect(result.current.activeTip.title).toBeTruthy();
    expect(result.current.categoryPct.transport).toBeGreaterThan(0);
  });

  it('shuffles quick-win tips and resets completion state', () => {
    const { result } = renderDashboardHook();

    act(() => {
      result.current.handleCompleteQuickWin();
    });
    expect(result.current.hasCompletedQuickWin).toBe(true);

    const firstTitle = result.current.activeTip.title;
    act(() => {
      result.current.handleShuffleTip();
    });

    expect(result.current.hasCompletedQuickWin).toBe(false);
    expect(result.current.activeTip.title).not.toBe(firstTitle);
  });

  it('applies sandbox parameters to profile', () => {
    const { result, onUpdateProfile } = renderDashboardHook();

    act(() => {
      result.current.setSimTransportDistance(10);
      result.current.setSimTransportMethod('active');
      result.current.setSimDietType('vegetarian');
      result.current.setSimCleanEnergy('solar');
    });

    act(() => {
      result.current.handleApplySimulatedParameters();
    });

    expect(onUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        transport: expect.objectContaining({ distance: 10, method: 'active' }),
        diet: expect.objectContaining({ type: 'vegetarian' }),
        energy: expect.objectContaining({ cleanEnergy: 'solar' }),
      }),
    );
  });

  it('computes simulated savings from sandbox sliders', () => {
    const { result } = renderDashboardHook();

    act(() => {
      result.current.setSimTransportDistance(5);
      result.current.setSimDietType('vegan');
      result.current.setSimCleanEnergy('solar');
    });

    expect(result.current.simulatedTotal).toBeLessThan(footprint.total);
    expect(result.current.simulatedSavings).toBeGreaterThan(0);
  });

  it('logs simulated weekly history after triggerSimulation', () => {
    const { result, onAddHistoryLog } = renderDashboardHook();

    act(() => {
      result.current.triggerSimulation();
    });
    expect(result.current.isSimulating).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.isSimulating).toBe(false);
    expect(onAddHistoryLog).toHaveBeenCalledWith(
      expect.objectContaining({
        total: expect.any(Number),
        transport: expect.any(Number),
      }),
    );
  });

  it('generates PDF report and shows success toast', () => {
    const { result } = renderDashboardHook();

    act(() => {
      result.current.handleGeneratePDFReport();
    });

    expect(generateCarbonReport).toHaveBeenCalledWith({
      profile: DEFAULT_PROFILE,
      footprint,
      challenges,
      history,
    });
    expect(result.current.successToast).toContain('PDF');
  });

  it('shows error toast when PDF generation fails', () => {
    vi.mocked(generateCarbonReport).mockImplementation(() => {
      throw new Error('pdf failed');
    });

    const { result } = renderDashboardHook();

    act(() => {
      result.current.handleGeneratePDFReport();
    });

    expect(result.current.successToast).toContain('issue compiling PDF');
  });

  it('exports history JSON via download link', () => {
    const { result } = renderDashboardHook({
      history: [{ date: '2026-06-01', emissions: footprint }],
    });

    const click = vi.fn();
    const anchor = { setAttribute: vi.fn(), click, remove: vi.fn() } as unknown as HTMLAnchorElement;
    const createElement = vi.spyOn(document, 'createElement').mockReturnValue(anchor);
    const appendChild = vi.spyOn(document.body, 'appendChild').mockImplementation(() => anchor);

    act(() => {
      result.current.handleDownloadJSON();
    });

    expect(createElement).toHaveBeenCalledWith('a');
    expect(anchor.setAttribute).toHaveBeenCalledWith('download', expect.stringContaining('carbon_wise_coach_history'));
    expect(click).toHaveBeenCalled();
    expect(anchor.remove).toHaveBeenCalled();

    createElement.mockRestore();
    appendChild.mockRestore();
  });

  it('clears toast after timeout', () => {
    const { result } = renderDashboardHook();

    act(() => {
      result.current.triggerToast('Saved!');
    });
    expect(result.current.successToast).toBe('Saved!');

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(result.current.successToast).toBe('');
  });
});
