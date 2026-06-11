import { jsPDF } from 'jspdf';
import { UserProfile, CarbonFootprint, WeeklyChallenge, EmissionHistoryItem } from '../types';
import { GLOBAL_BENCHMARKS } from './presets';

export interface ReportData {
  profile: UserProfile;
  footprint: CarbonFootprint;
  challenges: WeeklyChallenge[];
  history: EmissionHistoryItem[];
}

// ── Shared helpers ────────────────────────────────────────────────────────────

function renderHeaderBanner(doc: jsPDF, pageWidth: number, marginX: number): void {
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 40, pageWidth, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('CARBONWISE COACH', marginX, 18);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129);
  doc.text('PERSONALIZED EMISSION REDUCTION STRATEGY & JOURNEY SUMMARY', marginX, 26);
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  doc.text(`Report Compiled: ${dateStr} (UTC)  |  Standard Frame Integrity`, marginX, 33);
}

function renderFooter(doc: jsPDF, pageNum: number, totalPages: number, pageWidth: number, pageHeight: number, marginX: number): void {
  doc.setFillColor(248, 250, 252);
  doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('This is a simulated audit generated client-side by CarbonWise Coach.', marginX, pageHeight - 5);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - marginX - 15, pageHeight - 5);
}

// ── Page 1 sections ───────────────────────────────────────────────────────────

function renderExecutiveSummary(doc: jsPDF, profile: UserProfile, footprint: CarbonFootprint, history: EmissionHistoryItem[], pageWidth: number, marginX: number, y: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(`Executive Summary: ${profile.name}`, marginX, y);
  y += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const intro = `This custom carbon profile provides an audit-grade breakdown of individual annual greenhouse outputs. By tracking transportation choices, nutritional behaviors, dwelling energy layouts, and consumer retail purchases, CarbonWise Coach measures high-impact areas and offers peer averages comparison.`;
  const splitIntro = doc.splitTextToSize(intro, pageWidth - marginX * 2);
  doc.text(splitIntro, marginX, y);
  y += splitIntro.length * 5 + 4;

  return renderKpiBadges(doc, footprint, history, pageWidth, marginX, y);
}

function renderKpiBadges(doc: jsPDF, footprint: CarbonFootprint, history: EmissionHistoryItem[], pageWidth: number, marginX: number, y: number): number {
  const boxW = (pageWidth - marginX * 2 - 10) / 3;
  const boxH = 22;

  // Box 1 — Total footprint
  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(167, 243, 208);
  doc.rect(marginX, y, boxW, boxH, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(5, 150, 105);
  doc.text('CURRENT NET FOOTPRINT', marginX + 4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(4, 120, 87);
  doc.text(`${footprint.total.toLocaleString()} kg CO2e`, marginX + 4, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Equivalent annual offset liability', marginX + 4, y + 18);

  // Box 2 — Savings
  const baseline = history[0] ? history[0].emissions.total : footprint.total;
  const saved = Math.max(0, baseline - footprint.total);
  const savedPct = baseline > 0 ? Math.round((saved / baseline) * 100) : 0;
  doc.setFillColor(244, 242, 255);
  doc.setDrawColor(224, 231, 255);
  doc.rect(marginX + boxW + 5, y, boxW, boxH, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(79, 70, 229);
  doc.text('SAVINGS EFFICIENCY', marginX + boxW + 9, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(67, 56, 202);
  doc.text(`-${saved.toLocaleString()} kg (${savedPct}%)`, marginX + boxW + 9, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Saved relative to first log entry', marginX + boxW + 9, y + 18);

  // Box 3 — Target multiplier
  const mult = (footprint.total / GLOBAL_BENCHMARKS.target).toFixed(1);
  const isHealthy = footprint.total <= GLOBAL_BENCHMARKS.target;
  doc.setFillColor(isHealthy ? 240 : 255, isHealthy ? 253 : 241, isHealthy ? 250 : 242);
  doc.setDrawColor(isHealthy ? 167 : 254, isHealthy ? 243 : 205, isHealthy ? 208 : 211);
  doc.rect(marginX + boxW * 2 + 10, y, boxW, boxH, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(isHealthy ? 5 : 225, isHealthy ? 150 : 29, isHealthy ? 105 : 72);
  doc.text('MULTIPLIER TO 1.5C TARGET', marginX + boxW * 2 + 14, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(isHealthy ? 4 : 190, isHealthy ? 120 : 24, isHealthy ? 87 : 74);
  doc.text(`${mult}x Limit`, marginX + boxW * 2 + 14, y + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Sustainable bounds: ${GLOBAL_BENCHMARKS.target.toLocaleString()} kg`, marginX + boxW * 2 + 14, y + 18);

  return y + boxH + 10;
}

function renderSectorBreakdown(doc: jsPDF, footprint: CarbonFootprint, pageWidth: number, marginX: number, y: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Detailed Sector Carbon Footprint Breakdown', marginX, y);
  y += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 5;

  doc.setFillColor(241, 245, 249);
  doc.rect(marginX, y, pageWidth - marginX * 2, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Emission Category Sector', marginX + 3, y + 5);
  doc.text('Annual Footprint (kg CO2e / yr)', marginX + 75, y + 5);
  doc.text('% of Gross', marginX + 130, y + 5);
  doc.text('Classification Status', marginX + 160, y + 5);
  y += 7;

  const categories = [
    { name: 'Transportation & Commute', val: footprint.transport },
    { name: 'Diet & Agriculture', val: footprint.diet },
    { name: 'Household Utility Grids', val: footprint.energy },
    { name: 'Shopping & Consumer Waste', val: footprint.shopping },
  ];

  categories.forEach((cat) => {
    doc.setDrawColor(241, 245, 249);
    doc.rect(marginX, y, pageWidth - marginX * 2, 8);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(cat.name, marginX + 3, y + 5.5);
    const pct = footprint.total > 0 ? Math.round((cat.val / footprint.total) * 100) : 0;
    doc.setFont('helvetica', 'normal');
    doc.text(`${cat.val.toLocaleString()} kg`, marginX + 75, y + 5.5);
    doc.text(`${pct}%`, marginX + 130, y + 5.5);
    const [status, r, g, b] = cat.val > 3000 ? ['Severe Critical', 190, 24, 74]
      : cat.val > 1500 ? ['Significant', 217, 119, 6]
      : cat.val < 800 ? ['Highly Efficient', 5, 150, 105]
      : ['Moderate', 51, 65, 85];
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(r, g, b);
    doc.text(status, marginX + 160, y + 5.5);
    y += 8;
  });

  doc.setFillColor(248, 250, 252);
  doc.rect(marginX, y, pageWidth - marginX * 2, 8, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(marginX, y + 8, pageWidth - marginX, y + 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Gross Comprehensive Annual Footprint', marginX + 3, y + 5.5);
  doc.text(`${footprint.total.toLocaleString()} kg CO2e`, marginX + 75, y + 5.5);
  doc.text('100%', marginX + 130, y + 5.5);
  doc.text(footprint.total < 5000 ? 'Outstanding Eco' : footprint.total < 10000 ? 'Satisfactory' : 'Unmitigated Heavy', marginX + 160, y + 5.5);

  return y + 15;
}

function renderBenchmarkComparison(doc: jsPDF, footprint: CarbonFootprint, pageWidth: number, marginX: number, y: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Macro Comparison & Benchmarking Standards', marginX, y);
  y += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  doc.text(`World Average: 4,700 kg  | Use your footprint of ${footprint.total.toLocaleString()} kg as comparison.`, marginX, y);
  y += 5;

  const benchmarks = [
    { label: 'Your Profile', val: footprint.total, isUser: true },
    { label: '1.5°C Global Target', val: GLOBAL_BENCHMARKS.target, isUser: false },
    { label: 'World Individual Avg', val: GLOBAL_BENCHMARKS.worldAverage, isUser: false },
    { label: 'European Union Avg', val: GLOBAL_BENCHMARKS.euAverage, isUser: false },
    { label: 'United States Avg', val: GLOBAL_BENCHMARKS.usAverage, isUser: false },
  ];

  const maxVal = Math.max(footprint.total, GLOBAL_BENCHMARKS.usAverage);
  benchmarks.forEach((b) => {
    doc.setFont('helvetica', b.isUser ? 'bold' : 'normal');
    doc.setFontSize(8);
    doc.setTextColor(b.isUser ? 5 : 71, b.isUser ? 150 : 85, b.isUser ? 105 : 105);
    doc.text(b.label, marginX, y + 3.5);
    doc.setFillColor(b.isUser ? 16 : 226, b.isUser ? 185 : 232, b.isUser ? 129 : 240);
    doc.rect(marginX + 45, y + 1, (b.val / maxVal) * 110, 3, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`${b.val.toLocaleString()} kg`, marginX + 160, y + 3.5);
    y += 6;
  });

  return y + 6;
}

// ── Page 2 sections ───────────────────────────────────────────────────────────

function buildSuggestions(profile: UserProfile): { title: string; text: string; impact: string }[] {
  const list: { title: string; text: string; impact: string }[] = [];

  if (profile.transport.method === 'petrol' || profile.transport.method === 'diesel') {
    list.push({ title: 'Decarbonize Commuting Journeys', text: `Your transport utilizes highly synthetic fuels. Shifting to standard public rail, electric EV commutes, or telecommuting reduces baseline transport footprint by over 45%.`, impact: 'Est. Saving: 900 - 2,400 kg CO2e / Year' });
  }
  if (profile.diet.type === 'heavy-meat' || profile.diet.type === 'medium-meat') {
    list.push({ title: 'Engage in Plant-Forward Dietary Cycles', text: `Heavy meat or beef/lamb farming commands extreme soil conversion and methane loops. Ingesting beans or tofu during custom "Veggie Trials" significantly trims diet output.`, impact: 'Est. Saving: 600 - 1,200 kg CO2e / Year' });
  }
  if (profile.energy.cleanEnergy === 'standard') {
    list.push({ title: 'Request Hybrid Clean-Grid Energy Contracts', text: `Your power reliance matches common municipal thermal/gas grids. Procuring a mixed or 100% solar contract shifts home emissions coordinates downwards instantly.`, impact: 'Est. Saving: 800 - 1,600 kg CO2e / Year' });
  }
  if (list.length < 3) {
    list.push({ title: 'Extend Smart-Device Acquisition Life Cycles', text: `Electronics fabrication represents robust chemical and smelting outlays. Repairing display screens and retaining laptops for 4+ years yields substantial mitigation.`, impact: 'Est. Saving: 150 - 350 kg CO2e / Year' });
    list.push({ title: 'Enforce Local Supply Sourcing Audits', text: `Global aerial commerce burns massive bunker reserves. Selecting food sourced within 200 km reduces carbon-intensive supply chain footprints.`, impact: 'Est. Saving: 300 - 500 kg CO2e / Year' });
  }
  return list;
}

function renderRecommendations(doc: jsPDF, profile: UserProfile, pageWidth: number, marginX: number, y: number): number {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Formulated Actions & Carbon Mitigation Tactics', marginX, y);
  y += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Based on your simulated lifestyle inputs, our coaching algorithms recommend these focused reduction tactics:', marginX, y);
  y += 7;

  buildSuggestions(profile).forEach((sug, idx) => {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(marginX, y, pageWidth - marginX * 2, 22, 'FD');
    doc.setFillColor(16, 185, 129);
    doc.rect(marginX, y, 2.5, 22, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`${idx + 1}. ${sug.title}`, marginX + 6, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(sug.text, pageWidth - marginX * 2 - 15), marginX + 6, y + 10);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(5, 150, 105);
    doc.text(sug.impact, pageWidth - marginX - 55, y + 5);
    y += 26;
  });

  return y;
}

function renderChallenges(doc: jsPDF, challenges: WeeklyChallenge[], marginX: number, y: number, pageWidth: number): number {
  const active = challenges.filter(c => c.completed);
  if (active.length === 0) return y;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Diligently Completed Challenges List', marginX, y);
  y += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 6;

  active.slice(0, 3).forEach((c) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(`[CLEARED] ${c.title}`, marginX + 3, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`- Annual Equivalents Saved: ~${c.impactKg} kg CO2e. Reward unlocked successfully.`, marginX + 6, y + 4);
    y += 8;
  });

  return y;
}

// ── Main orchestrator ─────────────────────────────────────────────────────────

export function generateCarbonReport({ profile, footprint, challenges, history }: ReportData): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 15;

  // Page 1
  renderHeaderBanner(doc, pageWidth, marginX);
  let y = renderExecutiveSummary(doc, profile, footprint, history, pageWidth, marginX, 52);
  y = renderSectorBreakdown(doc, footprint, pageWidth, marginX, y);
  renderBenchmarkComparison(doc, footprint, pageWidth, marginX, y);

  // Page 2
  doc.addPage();
  renderHeaderBanner(doc, pageWidth, marginX);
  y = renderRecommendations(doc, profile, pageWidth, marginX, 52);
  renderChallenges(doc, challenges, marginX, y, pageWidth);

  // Footers
  doc.setPage(1);
  renderFooter(doc, 1, 2, pageWidth, pageHeight, marginX);
  doc.setPage(2);
  renderFooter(doc, 2, 2, pageWidth, pageHeight, marginX);

  doc.save(`carbon_wise_coach_journey_${profile.name.toLowerCase().replace(/\s+/g, '_')}.pdf`);
}
