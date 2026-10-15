import React, { useState } from 'react';
import { ExpeditionPlan, DailyWeatherForecast, EmergencyResource, RegionalNewsItem } from '../types/expedition';
import { WeatherWidget } from './WeatherWidget';
import { EmergencyCenter } from './EmergencyCenter';
import { InteractiveMap } from './InteractiveMap';
import { ChecklistManager } from './ChecklistManager';
import { RegionalNewsFeed } from './RegionalNewsFeed';
import { Calendar, Clock, MapPin, Users, Printer, Edit3 } from 'lucide-react';

interface DashboardProps {
  plan: ExpeditionPlan;
  forecasts: DailyWeatherForecast[];
  isWeatherLoading: boolean;
  onRefreshWeather: () => void;
  resources: EmergencyResource[];
  newsItems: RegionalNewsItem[];
  onOpenPrint: () => void;
  onEditBriefing: () => void;
  onUpdatePlan: (plan: ExpeditionPlan) => void;
  theme?: 'dark' | 'light';
}

export const Dashboard: React.FC<DashboardProps> = ({
  plan,
  forecasts,
  isWeatherLoading,
  onRefreshWeather,
  resources,
  newsItems,
  onOpenPrint,
  onEditBriefing,
  onUpdatePlan,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [liveGpsCoords, setLiveGpsCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Compute countdown or trip progress
  const now = new Date();
  const startDate = new Date(plan.startDate + 'T00:00:00');
  const endDate = new Date(plan.endDate + 'T23:59:59');
  
  let statusBadge = 'Upcoming Expedition';
  let badgeColor = isDark
    ? 'text-emerald-300 border-emerald-500/50 bg-emerald-950/60'
    : 'text-emerald-900 border-emerald-400 bg-emerald-100';

  if (now >= startDate && now <= endDate) {
    statusBadge = 'In the Field (Active)';
    badgeColor = isDark
      ? 'text-amber-300 border-amber-500/50 bg-amber-950/60'
      : 'text-amber-900 border-amber-400 bg-amber-100';
  } else if (now > endDate) {
    statusBadge = 'Expedition Concluded';
    badgeColor = isDark
      ? 'text-slate-300 border-slate-700 bg-slate-900'
      : 'text-slate-800 border-slate-300 bg-slate-200';
  }

  const totalItems = plan.checklists.length;
  const packedCount = plan.checklists.filter((i) => i.packed).length;
  const percentPacked = totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Quick Briefing Strip */}
      <div className={`relative rounded-3xl overflow-hidden border shadow-2xl transition-colors ${
        isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-300 bg-slate-900 text-white'
      }`}>
        
        {/* Scenic Wilderness Backdrop with Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/hero_expedition_mountain_1792100064188.jpg"
            alt="Wilderness Backdrop"
            className="w-full h-full object-cover opacity-45"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/40" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-between gap-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <span className={`text-xs font-mono uppercase font-black tracking-wider px-3 py-1 rounded-full border ${badgeColor}`}>
                  {statusBadge}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-300 capitalize">
                  · {plan.type.replace('_', ' ')}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-300 font-mono">
                  · {plan.region}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {plan.name}
              </h1>

              <div className="mt-3 flex items-center gap-2.5 text-sm sm:text-base text-slate-200 flex-wrap font-medium">
                <span className="flex items-center gap-1.5 font-bold">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  {plan.trailheadName}
                </span>
                <span>·</span>
                <span className="font-mono font-bold text-emerald-300">
                  {plan.coordinates.lat.toFixed(4)}°N, {Math.abs(plan.coordinates.lng).toFixed(4)}°W
                </span>
              </div>
            </div>

            {/* Top Quick Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onEditBriefing}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 transition-colors cursor-pointer shadow-sm"
              >
                <Edit3 className="w-4 h-4 text-slate-300" />
                <span>Edit Briefing</span>
              </button>

              <button
                onClick={onOpenPrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-black rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-colors shadow-lg shadow-emerald-500/25 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Emergency Manifest</span>
              </button>
            </div>
          </div>

          {/* KPI Briefing Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-sm">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-md">
              <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider block">Duration Window</span>
              <div className="font-black text-white mt-1.5 flex items-center gap-2 text-sm sm:text-base font-mono">
                <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{plan.startDate} → {plan.endDate}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-md">
              <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider block">Overdue Check-In</span>
              <div className="font-black text-amber-300 mt-1.5 flex items-center gap-2 text-sm sm:text-base font-mono">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{plan.expectedReturnTime}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-md">
              <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider block">Team Roster</span>
              <div className="font-black text-white mt-1.5 flex items-center gap-2 text-sm sm:text-base font-mono">
                <Users className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{plan.members.length} Members Accounted</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 shadow-md">
              <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider block">Gear Packed</span>
              <div className="font-black text-emerald-400 mt-1.5 flex items-center gap-2 text-sm sm:text-base font-mono">
                <span>{percentPacked}% Ready ({packedCount}/{totalItems})</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Row 1: 3-Day Open-Meteo Weather Brief & Emergency Protocols */}
      <WeatherWidget
        forecasts={forecasts}
        isLoading={isWeatherLoading}
        onRefresh={onRefreshWeather}
        locationName={plan.locationName}
        theme={theme}
      />

      {/* Row 2: Emergency Center (Roster ICE, SAR Dial, iOS Share Beacon) */}
      <EmergencyCenter
        members={plan.members}
        authorities={plan.authorities}
        expeditionName={plan.name}
        trailheadCoords={plan.coordinates}
        theme={theme}
        onLocationAcquired={(coords) => setLiveGpsCoords(coords)}
      />

      {/* Row 3: Interactive Tactical Leaflet Map */}
      <InteractiveMap
        trailheadCoords={plan.coordinates}
        trailheadName={plan.trailheadName}
        parkingCoords={plan.parkingCoordinates}
        parkingNotes={`${plan.vehicle.makeModel} (${plan.vehicle.licensePlate}) · ${plan.vehicle.parkingSpotNotes}`}
        locationName={plan.locationName}
        resources={resources}
        userLocation={liveGpsCoords}
        theme={theme}
      />

      {/* Row 4: Split Grid: Checklist Manager (Left) & Regional News Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <ChecklistManager
            checklists={plan.checklists}
            members={plan.members}
            theme={theme}
            onUpdateChecklists={(updatedChecklists) => {
              onUpdatePlan({ ...plan, checklists: updatedChecklists });
            }}
          />
        </div>

        <div className="lg:col-span-5">
          <RegionalNewsFeed
            newsItems={newsItems}
            locationName={plan.locationName}
            expeditionType={plan.type}
            theme={theme}
          />
        </div>
      </div>

    </div>
  );
};
