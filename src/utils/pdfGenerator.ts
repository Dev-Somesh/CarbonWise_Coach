import { jsPDF } from 'jspdf';
import { UserProfile, CarbonFootprint, WeeklyChallenge, EmissionHistoryItem } from '../types';
import { GLOBAL_BENCHMARKS } from './presets';

interface ReportData {
  profile: UserProfile;
  footprint: CarbonFootprint;
  challenges: WeeklyChallenge[];
  history: EmissionHistoryItem[];
}

export function generateCarbonReport({ profile, footprint, challenges, history }: ReportData): void {
  // Create a clean PDF document, portrait format, metrics in mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Base configurations
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 15;
  let currentY = 15;

  const addHeaderBanner = () => {
    // Elegant Emerald-Slate top banner
    doc.setFillColor(15, 23, 42); // slate dark background
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Accent line
    doc.setFillColor(16, 185, 129); // emerald accent
    doc.rect(0, 40, pageWidth, 3, 'F');

    // Title text inside banner
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text('CARBONWISE COACH', marginX, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(16, 185, 129); // emerald text
    doc.text('PERSONALIZED EMISSION REDUCTION STRATEGY & JOURNEY SUMMARY', marginX, 26);

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate light text
    const dateStr = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Report Compiled: ${dateStr} (UTC)  |  Standard Frame Integrity`, marginX, 33);
  };

  const drawFooter = (pageNum: number, totalPages: number) => {
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('This is a simulated audit generated client-side by CarbonWise Coach.', marginX, pageHeight - 5);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - marginX - 15, pageHeight - 5);
  };

  // Build page 
  addHeaderBanner();
  currentY = 52;

  // --- Executive Summary Section ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // slate deep
  doc.text(`Executive Summary: ${profile.name}`, marginX, currentY);
  currentY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  const introText = `This custom carbon profile provides an audit-grade breakdown of individual annual greenhouse outputs. By tracking transportation choices, nutritional behaviors, dwelling energy layouts, and consumer retail purchases, CarbonWise Coach measures high-impact areas and offers peer averages comparison.`;
  const splitIntro = doc.splitTextToSize(introText, pageWidth - (marginX * 2));
  doc.text(splitIntro, marginX, currentY);
  currentY += splitIntro.length * 5 + 4;

  // Key KPI Badges / stats boxes (Side-by-side layout)
  const boxWidth = (pageWidth - (marginX * 2) - 10) / 3;
  const boxHeight = 22;

  // Box 1: Total Footprint
  doc.setFillColor(240, 253, 250); // soft teal/emerald
  doc.setDrawColor(167, 243, 208);
  doc.rect(marginX, currentY, boxWidth, boxHeight, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(5, 150, 105);
  doc.text('CURRENT NET FOOTPRINT', marginX + 4, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(4, 120, 87);
  doc.text(`${footprint.total.toLocaleString()} kg CO2e`, marginX + 4, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Equivalent annual offset liability', marginX + 4, currentY + 18);

  // Box 2: Baseline vs First log (Reduction calculation)
  const startingLogs = history[0];
  const baselineVal = startingLogs ? startingLogs.emissions.total : footprint.total;
  const reductionVal = Math.max(0, baselineVal - footprint.total);
  const reductionPct = baselineVal > 0 ? Math.round((reductionVal / baselineVal) * 100) : 0;

  doc.setFillColor(244, 242, 255); // soft indigo
  doc.setDrawColor(224, 231, 255);
  doc.rect(marginX + boxWidth + 5, currentY, boxWidth, boxHeight, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(79, 70, 229);
  doc.text('SAVINGS EFFICIENCY', marginX + boxWidth + 9, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(67, 56, 202);
  doc.text(`-${reductionVal.toLocaleString()} kg (${reductionPct}%)`, marginX + boxWidth + 9, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Saved relative to first log entry', marginX + boxWidth + 9, currentY + 18);

  // Box 3: Target multiplier
  const mult = (footprint.total / GLOBAL_BENCHMARKS.target).toFixed(1);
  const isHealthy = footprint.total <= GLOBAL_BENCHMARKS.target;

  if (isHealthy) {
    doc.setFillColor(240, 253, 250);
    doc.setDrawColor(167, 243, 208);
  } else {
    doc.setFillColor(255, 241, 242);
    doc.setDrawColor(254, 205, 211);
  }
  doc.rect(marginX + (boxWidth * 2) + 10, currentY, boxWidth, boxHeight, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  if (isHealthy) {
    doc.setTextColor(5, 150, 105);
  } else {
    doc.setTextColor(225, 29, 72);
  }
  doc.text('MULTIPLIER TO 1.5C TARGET', marginX + (boxWidth * 2) + 14, currentY + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  if (isHealthy) {
    doc.setTextColor(4, 120, 87);
  } else {
    doc.setTextColor(190, 24, 74);
  }
  doc.text(`${mult}x Limit`, marginX + (boxWidth * 2) + 14, currentY + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Sustainable bounds: ${GLOBAL_BENCHMARKS.target.toLocaleString()} kg`, marginX + (boxWidth * 2) + 14, currentY + 18);

  currentY += boxHeight + 10;

  // --- Footprint Detailed Sector Audit Breakdown ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); 
  doc.text('Detailed Sector Carbon Footprint Breakdown', marginX, currentY);
  currentY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);
  currentY += 5;

  // Let's draw a nice table of categories
  const categories = [
    { name: 'Transportation & Commute', key: 'transport', val: footprint.transport, color: 'sky' },
    { name: 'Diet & Agriculture', key: 'diet', val: footprint.diet, color: 'amber' },
    { name: 'Household Utility Grids', key: 'energy', val: footprint.energy, color: 'emerald' },
    { name: 'Shopping & Consumer Waste', key: 'shopping', val: footprint.shopping, color: 'indigo' },
  ];

  // Table Headers
  doc.setFillColor(241, 245, 249);
  doc.rect(marginX, currentY, pageWidth - (marginX * 2), 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Emission Category Sector', marginX + 3, currentY + 5);
  doc.text('Annual Footprint (kg CO2e / yr)', marginX + 75, currentY + 5);
  doc.text('% of Gross', marginX + 130, currentY + 5);
  doc.text('Classification Status', marginX + 160, currentY + 5);

  currentY += 7;

  categories.forEach((cat) => {
    // Row background border
    doc.setDrawColor(241, 245, 249);
    doc.rect(marginX, currentY, pageWidth - (marginX * 2), 8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(cat.name, marginX + 3, currentY + 5.5);

    doc.setFont('helvetica', 'normal');
    const pct = footprint.total > 0 ? Math.round((cat.val / footprint.total) * 100) : 0;
    doc.text(`${cat.val.toLocaleString()} kg`, marginX + 75, currentY + 5.5);
    doc.text(`${pct}%`, marginX + 130, currentY + 5.5);

    // Qualitative assessment
    let status = 'Moderate';
    let statusColor = [51, 65, 85];
    if (cat.val > 3000) { status = 'Severe Critical'; statusColor = [190, 24, 74]; }
    else if (cat.val > 1500) { status = 'Significant'; statusColor = [217, 119, 6]; }
    else if (cat.val < 800) { status = 'Highly Efficient'; statusColor = [5, 150, 105]; }

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(status, marginX + 160, currentY + 5.5);

    currentY += 8;
  });

  // Gross Row
  doc.setFillColor(248, 250, 252);
  doc.rect(marginX, currentY, pageWidth - (marginX * 2), 8, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(marginX, currentY + 8, pageWidth - marginX, currentY + 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Gross Comprehensive Annual Footprint', marginX + 3, currentY + 5.5);
  doc.text(`${footprint.total.toLocaleString()} kg CO2e`, marginX + 75, currentY + 5.5);
  doc.text('100%', marginX + 130, currentY + 5.5);
  doc.text(footprint.total < 5000 ? 'Outstanding Eco' : footprint.total < 10000 ? 'Satisfactory' : 'Unmitigated Heavy', marginX + 160, currentY + 5.5);

  currentY += 15;

  // --- Regional Benchmarking Comparison ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('Macro Comparison & Benchmarking Standards', marginX, currentY);
  currentY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const worldAvgStr = `World Average: 4,700 kg  | Use your footprint of ${footprint.total.toLocaleString()} kg as comparison.`;
  doc.text(worldAvgStr, marginX, currentY);
  currentY += 5;

  // Let's render a clean text-based progress bar/chart of the averages inside the PDF!
  const benchmarksList = [
    { label: 'Your Profile', val: footprint.total, isUser: true },
    { label: '1.5°C Global Target', val: GLOBAL_BENCHMARKS.target, isUser: false },
    { label: 'World Individual Avg', val: GLOBAL_BENCHMARKS.worldAverage, isUser: false },
    { label: 'European Union Avg', val: GLOBAL_BENCHMARKS.euAverage, isUser: false },
    { label: 'United States Avg', val: GLOBAL_BENCHMARKS.usAverage, isUser: false },
  ];

  const maxVal = Math.max(footprint.total, GLOBAL_BENCHMARKS.usAverage);
  const barMaxLen = 110; // mm

  benchmarksList.forEach((bench) => {
    // Label
    doc.setFont('helvetica', bench.isUser ? 'bold' : 'normal');
    doc.setFontSize(8);
    if (bench.isUser) {
      doc.setTextColor(5, 150, 105);
    } else {
      doc.setTextColor(71, 85, 105);
    }
    doc.text(bench.label, marginX, currentY + 3.5);

    // Draw horizontal timeline bar
    const barW = (bench.val / maxVal) * barMaxLen;
    if (bench.isUser) {
      doc.setFillColor(16, 185, 129);
    } else {
      doc.setFillColor(226, 232, 240);
    }
    doc.rect(marginX + 45, currentY + 1, barW, 3, 'F');

    // Print values
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`${bench.val.toLocaleString()} kg`, marginX + 160, currentY + 3.5);

    currentY += 6;
  });

  currentY += 6;

  // Add a nice Page Break to section recommendations on Page 2
  doc.addPage();
  addHeaderBanner();
  currentY = 52;

  // --- Section: Personalized Coaching Recommendations ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); 
  doc.text('Formulated Actions & Carbon Mitigation Tactics', marginX, currentY);
  currentY += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(marginX, currentY, pageWidth - marginX, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Based on your simulated lifestyle inputs, our coaching algorithms recommend these focused reduction tactics:', marginX, currentY);
  currentY += 7;

  // Formulate dynamic recommendations based on their habits
  let suggestionsList: { title: string; text: string; impact: string }[] = [];

  if (profile.transport.method === 'petrol' || profile.transport.method === 'diesel') {
    suggestionsList.push({
      title: 'Decarbonize Commuting Journeys',
      text: `Your transport utilizes highly synthetic fuels. Shifting to standard public rail, electric EV commutes, or telecommuting reduces baseline transport footprint by over 45%.`,
      impact: 'Est. Saving: 900 - 2,400 kg CO2e / Year'
    });
  }

  if (profile.diet.type === 'heavy-meat' || profile.diet.type === 'medium-meat') {
    suggestionsList.push({
      title: 'Engage in Plant-Forward Dietary Cycles',
      text: `Heavy meat or beef/lamb farming commands extreme soil conversion and methane loops. Ingesting beans or tofu during custom "Veggie Trials" significantly trims diet output.`,
      impact: 'Est. Saving: 600 - 1,200 kg CO2e / Year'
    });
  }

  if (profile.energy.cleanEnergy === 'standard') {
    suggestionsList.push({
      title: 'Request Hybrid Clean-Grid Energy Contracts',
      text: `Your power reliance matches common municipal thermal/gas grids. Procuring a mixed or 100% solar contract shifts home emissions coordinates downwards instantly.`,
      impact: 'Est. Saving: 800 - 1,600 kg CO2e / Year'
    });
  }

  // Fallback defaults
  if (suggestionsList.length < 3) {
    suggestionsList.push({
      title: 'Extend Smart-Device Acquisition Life Cycles',
      text: `Electronics fabrication represents robust chemical and smelting outlays. Repairing display screens and retaining laptops for 4+ years yields substantial mitigation.`,
      impact: 'Est. Saving: 150 - 350 kg CO2e / Year'
    });
    suggestionsList.push({
      title: 'Enforce Local Supply Sourcing Audits',
      text: `Global aerial commerce burns massive bunker reserves. Selecting food sourced within 200 km reduces carbon-intensive supply chain footprints.`,
      impact: 'Est. Saving: 300 - 500 kg CO2e / Year'
    });
  }

  // Draw suggestion cards inside PDF list
  suggestionsList.forEach((sug, index) => {
    // Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(marginX, currentY, pageWidth - (marginX * 2), 22, 'FD');

    // Left Border Stripe (Emerald block)
    doc.setFillColor(16, 185, 129);
    doc.rect(marginX, currentY, 2.5, 22, 'F');

    // Text details
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`${index + 1}. ${sug.title}`, marginX + 6, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    const splitText = doc.splitTextToSize(sug.text, pageWidth - (marginX * 2) - 15);
    doc.text(splitText, marginX + 6, currentY + 10);

    // Save badge indicator right-aligned
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(5, 150, 105);
    doc.text(sug.impact, pageWidth - marginX - 55, currentY + 5);

    currentY += 26;
  });

  // --- Challenges list if active ---
  const activeChallenges = challenges.filter(c => c.completed);
  if (activeChallenges.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('Diligently Completed Challenges List', marginX, currentY);
    currentY += 4;
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, currentY, pageWidth - marginX, currentY);
    currentY += 6;

    activeChallenges.slice(0, 3).forEach((chal) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 23, 42);
      doc.text(`[CLEARED] ${chal.title}`, marginX + 3, currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`- Annual Equivalents Saved: ~${chal.impactKg} kg CO2e. Reward unlocked successfully.`, marginX + 6, currentY + 4);
      currentY += 8;
    });
  }

  // Draw Page numbering
  drawFooter(1, 2);
  doc.setPage(1);
  drawFooter(1, 2);
  doc.setPage(2);
  drawFooter(2, 2);

  // Trigger Save/Download
  doc.save(`carbon_wise_coach_journey_${profile.name.toLowerCase().replace(/\s+/g, '_')}.pdf`);
}
