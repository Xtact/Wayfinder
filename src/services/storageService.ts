import { ExpeditionPlan } from '../types/expedition';

const STORAGE_KEY = 'wayfinder_expedition_plan_v1';

export const DEFAULT_EXPEDITION: ExpeditionPlan = {
  id: 'exp-sierra-2026',
  name: 'Sierra Nevada Alpine Ridge & Lake Trek',
  type: 'backcountry_hike',
  locationName: 'Desolation Wilderness, Eldorado National Forest, CA',
  region: 'Central Sierra / Lake Tahoe Basin',
  coordinates: {
    lat: 38.8252,
    lng: -120.0895,
  },
  trailheadName: 'Echo Lakes Trailhead (Pacific Crest Trail / TRT)',
  trailheadCoordinates: {
    lat: 38.8315,
    lng: -120.0435,
  },
  parkingCoordinates: {
    lat: 38.8322,
    lng: -120.0441,
  },
  startDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
  endDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
  expectedReturnTime: '17:00 PST',
  vehicle: {
    makeModel: 'Subaru Outback (Wilderness Edition)',
    licensePlate: '7XYZ892',
    color: 'Autumn Green Metallic',
    state: 'CA',
    parkingSpotNotes: 'Parked in overflow dirt lot 80 yards west of Echo Chalet. Parking pass on dash.',
  },
  authorities: {
    rangerStationName: 'Eldorado National Forest Placerville Supervisor Office',
    rangerPhone: '(530) 622-5061',
    sheriffSARPhone: '(530) 621-6600',
    medicalFacilityName: 'Barton Memorial Hospital Emergency Room (South Lake Tahoe)',
    medicalFacilityPhone: '(530) 543-5810',
    permitNumber: 'DES-2026-08492',
    protocolNotes: 'Permitted for Zone 22 (Aloha Basin). If party has not checked in by 20:00 PST on return date, call El Dorado County Sheriff Search & Rescue dispatch.',
  },
  members: [
    {
      id: 'm-1',
      name: 'Christopher Vance',
      role: 'Expedition Leader / Wilderness First Responder',
      phone: '(530) 555-0194',
      email: 'chris.vance@example.com',
      emergencyContactName: 'Sarah Vance',
      emergencyContactPhone: '(530) 555-0188',
      emergencyContactRelation: 'Spouse',
      bloodType: 'O+',
      medicalConditions: 'None',
      allergies: 'Penicillin',
      medications: 'Personal EpiPen (pack hip belt)',
    },
    {
      id: 'm-2',
      name: 'Elena Rostova',
      role: 'Navigator / Provisions Lead',
      phone: '(415) 555-0341',
      email: 'elena.rostova@example.com',
      emergencyContactName: 'Dmitri Rostov',
      emergencyContactPhone: '(415) 555-0377',
      emergencyContactRelation: 'Brother',
      bloodType: 'A+',
      medicalConditions: 'Mild asthma (exercise-induced)',
      allergies: 'Bee stings',
      medications: 'Albuterol inhaler in brain pocket',
    },
    {
      id: 'm-3',
      name: 'Marcus Vance',
      role: 'Team Member',
      phone: '(530) 555-0482',
      email: 'marcus.v@example.com',
      emergencyContactName: 'Sarah Vance',
      emergencyContactPhone: '(530) 555-0188',
      emergencyContactRelation: 'Mother',
      bloodType: 'O+',
      medicalConditions: 'None',
      allergies: 'None',
      medications: 'None',
    },
  ],
  checklists: [
    // Provisions
    { id: 'c-1', category: 'provisions', title: 'Freeze-dried Mountain House meals (6 rations/person)', quantity: '18 packs', packed: true, assignedTo: 'Elena' },
    { id: 'c-2', category: 'provisions', title: 'High-calorie trail mix, jerky, peanut butter packets', quantity: '3 lbs', packed: true, assignedTo: 'Marcus' },
    { id: 'c-3', category: 'provisions', title: 'Electrolyte hydration tablets (Nuun / Liquid IV)', quantity: '3 tubes', packed: true, assignedTo: 'Chris' },
    { id: 'c-4', category: 'provisions', title: 'Sawyer Squeeze + Platypus Gravity Water Filter (0.1 micron)', quantity: '2 kits', packed: true, assignedTo: 'Chris' },
    { id: 'c-5', category: 'provisions', title: 'Aquamira chlorine dioxide water purification drops (backup)', quantity: '1 kit', packed: false, assignedTo: 'Elena' },
    { id: 'c-6', category: 'provisions', title: 'IGBC Bear-Proof Food Canister (BearVault BV500)', quantity: '2 units', packed: true, assignedTo: 'Chris & Elena' },

    // Gear
    { id: 'c-7', category: 'gear', title: '3-Person 4-Season Alpine Tent with footprint and snow/rock stakes', quantity: '1 tent', packed: true, assignedTo: 'Chris' },
    { id: 'c-8', category: 'gear', title: '20°F down sleeping bags & insulated sleeping pads (R-value > 4.0)', quantity: '3 sets', packed: true, assignedTo: 'All' },
    { id: 'c-9', category: 'gear', title: 'Trekking poles with rock tips and snow baskets', quantity: '3 pairs', packed: true, assignedTo: 'All' },
    { id: 'c-10', category: 'gear', title: 'Waterproof Gore-Tex shells & taped storm pants', quantity: '3 sets', packed: true, assignedTo: 'All' },
    { id: 'c-11', category: 'gear', title: 'Ultralight packable camp stove (MSR PocketRocket) & isobutane fuel', quantity: '2 stoves + 3 cans', packed: true, assignedTo: 'Elena' },
    { id: 'c-12', category: 'gear', title: 'Tenkara / Collapsible Fly Fishing Rod & alpine dry flies', quantity: '2 rods', packed: false, assignedTo: 'Marcus' },

    // Chargers & Power
    { id: 'c-13', category: 'chargers', title: 'Anker 20,000mAh rugged USB-C power bank (kept in thermal pouch)', quantity: '2 units', packed: true, assignedTo: 'Chris' },
    { id: 'c-14', category: 'chargers', title: 'USB-C to Lightning & USB-C to USB-C heavy-duty cables', quantity: '3 cables', packed: true, assignedTo: 'Marcus' },
    { id: 'c-15', category: 'chargers', title: 'Headlamps (Rechargeable 450 lumens) + spare AAA batteries', quantity: '3 lights', packed: true, assignedTo: 'All' },
    { id: 'c-16', category: 'chargers', title: 'Solar foldout panel 21W with carabiners', quantity: '1 panel', packed: false, assignedTo: 'Marcus' },

    // Safety & Comms
    { id: 'c-17', category: 'safety', title: 'Wilderness Trauma First Aid Kit (quikclot, splint, tourniquet, shears)', quantity: '1 full kit', packed: true, assignedTo: 'Chris' },
    { id: 'c-18', category: 'safety', title: 'Garmin inReach Mini 2 / Satellite Messenger (Active SOS subscription)', quantity: '1 unit', packed: true, assignedTo: 'Chris' },
    { id: 'c-19', category: 'safety', title: 'Printed topographic USGS 7.5 min quadrangle maps & Silva compass', quantity: '2 sets', packed: true, assignedTo: 'Elena' },
    { id: 'c-20', category: 'safety', title: 'Emergency survival bivvies & high-decibel safety whistles', quantity: '3 bivvies', packed: true, assignedTo: 'All' },
    { id: 'c-21', category: 'safety', title: 'Bear spray canisters with chest holsters', quantity: '2 cans', packed: true, assignedTo: 'Chris & Marcus' },
  ],
  emergencyNotes: 'Contingency Route: If Ralston Peak route is blocked by high snowdrifts or lightning storm, divert west along Triangle Lake to Lake Aloha shelter basin. In case of lost member, stay stationary at nearest marked trail intersection and blow whistle 3 blasts repeatedly.',
  status: 'planning',
  lastUpdated: new Date().toISOString(),
};

export const PRESET_EXPEDITIONS: { label: string; plan: ExpeditionPlan }[] = [
  {
    label: 'Sierra Nevada Desolation Wilderness (Trek & Fishing)',
    plan: DEFAULT_EXPEDITION,
  },
  {
    label: 'Mount Hood Timberline Trail (Alpine Backpacking)',
    plan: {
      ...DEFAULT_EXPEDITION,
      id: 'exp-mthood-timberline',
      name: 'Mount Hood Timberline Circumnavigation',
      type: 'wilderness_backpacking',
      locationName: 'Mount Hood Wilderness, Clackamas County, OR',
      region: 'Cascade Range, Oregon',
      coordinates: { lat: 45.3311, lng: -121.7111 },
      trailheadName: 'Timberline Lodge Trailhead (PCT)',
      trailheadCoordinates: { lat: 45.3311, lng: -121.7111 },
      parkingCoordinates: { lat: 45.3305, lng: -121.7102 },
      vehicle: {
        makeModel: 'Toyota Tacoma 4x4 (Silver)',
        licensePlate: 'ORE-83921',
        color: 'Silver Metallic',
        state: 'OR',
        parkingSpotNotes: 'Timberline Day-use lot, NW corner near climbers registry.',
      },
      authorities: {
        rangerStationName: 'Zigzag Ranger District Office',
        rangerPhone: '(503) 622-3191',
        sheriffSARPhone: '(503) 655-8211',
        medicalFacilityName: 'Legacy Mount Hood Medical Center (Gresham)',
        medicalFacilityPhone: '(503) 674-1122',
        permitNumber: 'HOOD-2026-4412',
        protocolNotes: 'Climbing registration tag left at WyEast Timberline foyer desk. Alert Clackamas County SAR if overdue past 19:00.',
      },
    },
  },
  {
    label: 'Boundary Waters Canoe Area (Canoe & Angling)',
    plan: {
      ...DEFAULT_EXPEDITION,
      id: 'exp-bwca-canoe',
      name: 'Boundary Waters North Arm Paddle & Pike Camp',
      type: 'fishing_trip',
      locationName: 'Boundary Waters Canoe Area Wilderness (BWCAW), MN',
      region: 'Superior National Forest, Minnesota',
      coordinates: { lat: 48.0051, lng: -91.7583 },
      trailheadName: 'Moose Lake Entry Point #25',
      trailheadCoordinates: { lat: 47.9731, lng: -91.5065 },
      parkingCoordinates: { lat: 47.9725, lng: -91.5058 },
      vehicle: {
        makeModel: 'Ford F-150 SuperCrew',
        licensePlate: 'MN-902JLA',
        color: 'Oxford White',
        state: 'MN',
        parkingSpotNotes: 'Moose Lake Public Landing Lot, row 3. Canoe racks mounted.',
      },
      authorities: {
        rangerStationName: 'Kawishiwi Ranger District (Ely, MN)',
        rangerPhone: '(218) 365-7600',
        sheriffSARPhone: '(218) 749-7134',
        medicalFacilityName: 'Ely-Bloomenson Community Hospital',
        medicalFacilityPhone: '(218) 365-3266',
        permitNumber: 'BWCA-EP25-8819',
        protocolNotes: 'St. Louis County Sheriff Search & Rescue handles wilderness water extractions. PFDs worn at all portages.',
      },
    },
  },
];

export function loadExpeditionPlan(): ExpeditionPlan {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name && parsed.members) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read from localStorage, using default:', err);
  }
  return DEFAULT_EXPEDITION;
}

export function saveExpeditionPlan(plan: ExpeditionPlan): void {
  try {
    plan.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function exportPlanToJson(plan: ExpeditionPlan): string {
  return JSON.stringify(plan, null, 2);
}

export function importPlanFromJson(jsonString: string): ExpeditionPlan {
  const parsed = JSON.parse(jsonString);
  if (!parsed.name || !parsed.members || !Array.isArray(parsed.members)) {
    throw new Error('Invalid expedition file format');
  }
  saveExpeditionPlan(parsed);
  return parsed;
}
