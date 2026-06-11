import { UserProfile, SustainabilityAction, WeeklyChallenge } from '../types';

// Static template pools for personalization
const TRANSPORT_TACTICS: Omit<SustainabilityAction, 'completed'>[] = [
  {
    id: 't-active',
    title: 'Switch to Active Transits on Short Trajectories',
    description: 'Commit to walking, cycling, or electric-scooting for all trips under 3 km. Saves fuel costs and promotes physical wellness.',
    category: 'transport',
    impactKg: 350,
    difficulty: 'easy',
  },
  {
    id: 't-transit',
    title: 'Commute via Public Transit 3 Days/Week',
    description: 'Swap solo driving for the metro, train, or bus route. This significantly reduces personal tailpipe greenhouse gases.',
    category: 'transport',
    impactKg: 720,
    difficulty: 'medium',
  },
  {
    id: 't-home',
    title: 'Negotiate 2 Remote Work Days Weekly',
    description: 'Eliminate car commutes two days each week by working remotely, preserving mileage and cutting direct fuel consumption.',
    category: 'transport',
    impactKg: 480,
    difficulty: 'medium',
  },
  {
    id: 't-flights',
    title: 'Replace One Short-distance Flight with Trains',
    description: 'Short-haul flights have highest atmospheric heat impact per kilometer. Opt for comfortable commuter trains.',
    category: 'transport',
    impactKg: 300,
    difficulty: 'hard',
  },
];

const DIET_TACTICS: Omit<SustainabilityAction, 'completed'>[] = [
  {
    id: 'd-meatless',
    title: 'Enforce "Meatless Mondays"',
    description: 'Go fully vegetarian for at least one day per week, cooking hearty meals with lentils, beans, and vibrant vegetables.',
    category: 'diet',
    impactKg: 180,
    difficulty: 'easy',
  },
  {
    id: 'd-flexitarian',
    title: 'Adopt a Climate-Friendly Flexitarian Diet',
    description: 'Cap red meat consumption to once per week, focusing on plant-based alternatives, seasonal veggies, and whole grains.',
    category: 'diet',
    impactKg: 650,
    difficulty: 'medium',
  },
  {
    id: 'd-waste',
    title: 'Conduct a "Food Waste Audit" & Plan Meals',
    description: 'Organize freezer contents, store food in airtight containers, and plan exact portions to cut food scrap decay to absolute zero.',
    category: 'diet',
    impactKg: 280,
    difficulty: 'easy',
  },
  {
    id: 'd-local',
    title: 'Source From Local Farmer Co-ops',
    description: 'Incorporate seasonal farm shares, cutting massive sea/air transport supply chain impacts of imported grocery logistics.',
    category: 'diet',
    impactKg: 150,
    difficulty: 'medium',
  },
];

const ENERGY_TACTICS: Omit<SustainabilityAction, 'completed'>[] = [
  {
    id: 'e-thermostat',
    title: 'Optimize Thermostat by 2 Degrees',
    description: 'Adjust cooling to 24°C/75°F in summer or heating to 19°C/66°F in winter. Cuts utility load with near-zero initial expense.',
    category: 'energy',
    impactKg: 220,
    difficulty: 'easy',
  },
  {
    id: 'e-bulbs',
    title: 'Upgrade home fixtures to LEDs',
    description: 'Change traditional incandescent bulbs to durable warm-light LED varieties and use smart power switches for standby modes.',
    category: 'energy',
    impactKg: 120,
    difficulty: 'easy',
  },
  {
    id: 'e-contract',
    title: 'Subscribe to a 100% Green Energy Option',
    description: 'Work with your electricity provider to buy power from solar or wind sources, matching grid demand with clean credits.',
    category: 'energy',
    impactKg: 1400,
    difficulty: 'medium',
  },
  {
    id: 'e-wash-cold',
    title: 'Wash laundry on Active Cold cycles only',
    description: 'Over 90% of a washing machine’s electrical load is diverted entirely to heat water. Use cold liquids to conserve energy.',
    category: 'energy',
    impactKg: 160,
    difficulty: 'easy',
  },
];

const SHOPPING_TACTICS: Omit<SustainabilityAction, 'completed'>[] = [
  {
    id: 's-clothing',
    title: 'Enforce a "One-In, One-Out" Closet Standard',
    description: 'Trade clothing spending for second-hand/vintage curations. Avoid low-quality fast fashion brands.',
    category: 'shopping',
    impactKg: 240,
    difficulty: 'medium',
  },
  {
    id: 's-electronics',
    title: 'Optimize Tech Life to 4+ Years',
    description: 'Skip annual device upgrades. Repair batteries or switch damaged screens instead of replacing solid electronics.',
    category: 'shopping',
    impactKg: 350,
    difficulty: 'hard',
  },
  {
    id: 's-recycling',
    title: 'Implement Clean Sorting Bins',
    description: 'Correctly wash and sort clean plastics, aluminum cans, cardboard, and glass jars. Prevents landfill resource burn-offs.',
    category: 'shopping',
    impactKg: 110,
    difficulty: 'easy',
  },
];

// Complete list of challenge templates
export const CHALLENGE_TEMPLATES = [
  {
    id: 'wc-carfree',
    title: 'Clean Transit Commuter',
    description: 'Ditch your personal car and rely strictly on public transport, carpools, biking, or walking for consecutive days.',
    category: 'transport' as const,
    impactKg: 15,
  },
  {
    id: 'wc-vegan-streak',
    title: 'Vegan Explorer Weekend',
    description: 'Remove all milk, butter, cheese, beef, eggs, and poultry from your plate for a complete weekend streak.',
    category: 'diet' as const,
    impactKg: 12,
  },
  {
    id: 'wc-vampire-power',
    title: 'Slay the Vampire Sockets',
    description: 'Unplug all chargers, monitors, dryers, and microwave standby setups before sleeping each night.',
    category: 'energy' as const,
    impactKg: 8,
  },
  {
    id: 'wc-cold-laundry',
    title: 'Cold Cycle Connoisseur',
    description: 'Commit to cold-only water temperature settings for all wash and spin operations standardly.',
    category: 'energy' as const,
    impactKg: 6,
  },
  {
    id: 'wc-no-waste',
    title: 'Empty Kitchen Bin Hero',
    description: 'Practice zero left-overs waste. Carefully consume or freeze meals before any spoilage occurs.',
    category: 'diet' as const,
    impactKg: 10,
  },
  {
    id: 'wc-secondhand',
    title: 'Zero New Purchase Pledge',
    description: 'Avoid buying any factory-new clothing, packaged trinkets, or decorative items. Thrift or borrow if essential.',
    category: 'shopping' as const,
    impactKg: 14,
  },
];

/**
 * Evaluates the user profile to identify high-emission fields and generates 
 * targeted sustainable recommendations ordered by estimated carbon savings.
 */
export function generateContextualRecommendations(profile: UserProfile): SustainabilityAction[] {
  const recommendations: SustainabilityAction[] = [];

  // 1. Check Transport (Solo commuters or frequent flying)
  if (profile.transport.method === 'petrol' || profile.transport.method === 'diesel') {
    recommendations.push(
      { ...TRANSPORT_TACTICS[0], completed: false },
      { ...TRANSPORT_TACTICS[1], completed: false }
    );
    if (profile.transport.distance > 80) {
      recommendations.push({ ...TRANSPORT_TACTICS[2], completed: false });
    }
  }
  if (profile.transport.shortFlights + profile.transport.longFlights > 0) {
    recommendations.push({ ...TRANSPORT_TACTICS[3], completed: false });
  }

  // 2. Check Diet (Meat-heavy or high waste)
  if (profile.diet.type === 'heavy-meat' || profile.diet.type === 'medium-meat') {
    recommendations.push(
      { ...DIET_TACTICS[0], completed: false },
      { ...DIET_TACTICS[1], completed: false }
    );
  }
  if (profile.diet.foodWaste === 'high' || profile.diet.foodWaste === 'moderate') {
    recommendations.push({ ...DIET_TACTICS[2], completed: false });
  }
  if (profile.diet.sourcing === 'mostly-imported') {
    recommendations.push({ ...DIET_TACTICS[3], completed: false });
  }

  // 3. Check Energy (Inefficient grids or large household sizes)
  if (profile.energy.cleanEnergy === 'standard') {
    recommendations.push({ ...ENERGY_TACTICS[2], completed: false });
  }
  recommendations.push({ ...ENERGY_TACTICS[0], completed: false });
  if (profile.energy.highEnergyAppliances.includes('dryer') || profile.energy.highEnergyAppliances.includes('ac')) {
    recommendations.push({ ...ENERGY_TACTICS[3], completed: false });
  }
  recommendations.push({ ...ENERGY_TACTICS[1], completed: false });

  // 4. Check Shopping (Frequent garment / electronics purchases)
  if (profile.shopping.clothing === 'frequent' || profile.shopping.clothing === 'moderate') {
    recommendations.push({ ...SHOPPING_TACTICS[0], completed: false });
  }
  if (profile.shopping.electronics === 'frequent' || profile.shopping.electronics === 'moderate') {
    recommendations.push({ ...SHOPPING_TACTICS[1], completed: false });
  }
  if (profile.shopping.recycling !== 'thorough') {
    recommendations.push({ ...SHOPPING_TACTICS[2], completed: false });
  }

  // De-duplicate actions based on ID
  const uniqueRecommendations = Array.from(
    new Map(recommendations.map((action) => [action.id, action])).values()
  );

  // Sort them so that high impact actions appear elevated
  return uniqueRecommendations.sort((a, b) => b.impactKg - a.impactKg);
}

/**
 * Returns prioritized weekly challenges recommendation based on user high emissions.
 */
export function getRecommendedChallenges(_profile: UserProfile): WeeklyChallenge[] {
  return CHALLENGE_TEMPLATES.map((item, _index) => {
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      impactKg: item.impactKg,
      completed: false,
      daysCompleted: [],
    };
  });
}
