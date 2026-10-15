export type ExpeditionType =
  | 'backcountry_hike'
  | 'fishing_trip'
  | 'alpine_climb'
  | 'canoe_kayak'
  | 'bikepacking'
  | 'hunting_camp'
  | 'wilderness_backpacking'
  | 'other';

export interface IndividualContact {
  id: string;
  name: string;
  role: string; // e.g. "Trip Leader", "Navigator", "Medic", "Member"
  phone: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  bloodType?: string;
  medicalConditions?: string;
  allergies?: string;
  medications?: string;
}

export type ChecklistCategory = 'provisions' | 'gear' | 'chargers' | 'safety' | 'comms';

export interface ChecklistItem {
  id: string;
  category: ChecklistCategory;
  title: string;
  quantity?: string;
  packed: boolean;
  assignedTo?: string;
}

export interface VehicleInfo {
  makeModel: string;
  licensePlate: string;
  color: string;
  state: string;
  parkingSpotNotes: string;
}

export interface LocalAuthorities {
  rangerStationName: string;
  rangerPhone: string;
  sheriffSARPhone: string;
  medicalFacilityName: string;
  medicalFacilityPhone: string;
  permitNumber?: string;
  protocolNotes: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ExpeditionPlan {
  id: string;
  name: string;
  type: ExpeditionType;
  locationName: string;
  region: string;
  coordinates: Coordinates;
  trailheadName: string;
  trailheadCoordinates?: Coordinates;
  parkingCoordinates?: Coordinates;
  startDate: string;
  endDate: string;
  expectedReturnTime: string;
  vehicle: VehicleInfo;
  authorities: LocalAuthorities;
  members: IndividualContact[];
  checklists: ChecklistItem[];
  emergencyNotes: string;
  status: 'planning' | 'active' | 'completed';
  lastUpdated: string;
}

export interface DailyWeatherForecast {
  date: string;
  dayLabel: string;
  weatherCode: number;
  weatherText: string;
  tempMaxC: number;
  tempMinC: number;
  tempMaxF: number;
  tempMinF: number;
  precipitationProbability: number;
  windSpeedMaxMph: number;
  windGustsMaxMph?: number;
  uvIndexMax: number;
  isWarning: boolean;
  warningReason?: string;
  preparednessAdvice: string;
}

export interface RegionalNewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  category: 'warning' | 'advisory' | 'wildlife' | 'trail_condition' | 'general';
  summary: string;
  link?: string;
}

export interface EmergencyResource {
  id: string;
  name: string;
  type: 'ranger' | 'sar' | 'hospital' | 'shelter' | 'water';
  coordinates: Coordinates;
  distanceMiles?: number;
  phone?: string;
  notes: string;
}
