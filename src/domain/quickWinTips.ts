import type { QuickWinTip } from './dashboardTypes';

export const QUICK_WIN_TIPS: Record<string, QuickWinTip[]> = {
  transport: [
    { title: 'Drive 5 km Less Weekly', description: 'Swap one vehicle journey under 5 km with walking or a bike ride per week. Short commutes are prime for carbon offsets.', actionText: 'Swapped transit' },
    { title: 'Optimize Tire Inflation', description: 'Properly inflated tires decrease rolling friction with tarmac, boosting standard fuel mileage by up to 3.3%.', actionText: 'Inflated tires correctly' },
    { title: 'Combine Errands Multi-Trips', description: 'Run all your weekend errands in a single round-trip instead of multiple individual drives to save fuel.', actionText: 'Processed single route' },
  ],
  diet: [
    { title: 'Practice "Meatless Monday"', description: 'Skipping beef or lamb for 24 hours eliminates up to 8 kg of individual carbon emissions equivalents.', actionText: 'Subbed vegan plate' },
    { title: 'Repurpose Leftover Scraps', description: 'Create a scrap broth or freeze raw ingredients before they rot in central landfills generating methane.', actionText: 'Prepped leftover scrap' },
    { title: 'Prioritize Regional Sourcing', description: 'Acquire your seasonal greens from regional co-ops to sidestep global cargo aviation footprints.', actionText: 'Supported local co-op' },
  ],
  energy: [
    { title: 'Adjust Home Thermostat by 1°C', description: 'Lowering winter heating or raising summer air cooling bounds by 1°C reduces utility grid load by nearly 10%.', actionText: 'Adjusted dial' },
    { title: 'Unplug "Vampire" Electronics', description: 'Shut down major gaming rigs, chargers, and television accessories from their physical sockets overnight.', actionText: 'Killed phantom draws' },
    { title: 'Dial Laundry Temperature to 30°C', description: 'Warming water occupies 90% of a laundry machine load resource consumption. Washing cold saves ample grid juice.', actionText: 'Set laundry run cold' },
  ],
  shopping: [
    { title: 'Enforce a 48-Hour Cart Hold', description: 'Hold spec apparel retail shopping in draft for 48 hours to avoid low-utilization fast fashion waste.', actionText: 'Held cart items' },
    { title: 'Extend Device Maintenance Cycle', description: 'Clean computer vents, clear junk files, and purchase screen protectors to prolong current electronics life.', actionText: 'Extended laptop life' },
    { title: 'Bring a Durable Canvas Tote', description: 'Conceal folded cotton canvas carriers inside your commute backpack pocket to safely decline synthetic store plastic.', actionText: 'Supplied own carrier' },
  ],
};
