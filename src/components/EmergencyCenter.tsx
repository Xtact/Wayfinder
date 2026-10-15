import React, { useState } from 'react';
import { IndividualContact, LocalAuthorities, Coordinates } from '../types/expedition';
import { getCurrentDeviceLocation, shareExpeditionLocation, buildSmsLink, getAppleMapsUrl, LiveLocationData } from '../services/geoService';
import { ShieldAlert, Phone, MessageSquare, ChevronDown, ChevronUp, MapPin, Share2, Compass, HeartPulse, User } from 'lucide-react';

interface EmergencyCenterProps {
  members: IndividualContact[];
  authorities: LocalAuthorities;
  expeditionName: string;
  trailheadCoords: Coordinates;
  theme?: 'dark' | 'light';
  onLocationAcquired?: (coords: Coordinates) => void;
}

export const EmergencyCenter: React.FC<EmergencyCenterProps> = ({
  members,
  authorities,
  expeditionName,
  trailheadCoords,
  theme = 'dark',
  onLocationAcquired,
}) => {
  const isDark = theme === 'dark';
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(members[0]?.id || null);
  const [gpsData, setGpsData] = useState<LiveLocationData | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [shareSuccessMessage, setShareSuccessMessage] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedMemberId(expandedMemberId === id ? null : id);
  };

  const handleAcquireLocation = async () => {
    setIsLocating(true);
    try {
      const data = await getCurrentDeviceLocation();
      setGpsData(data);
      if (onLocationAcquired) {
        onLocationAcquired(data.coords);
      }
    } catch (err: any) {
      console.warn('Geolocation error:', err);
      setGpsData({
        coords: trailheadCoords,
        accuracyMeters: 25,
        altitudeMeters: 2150,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      alert('Could not access live device GPS (check browser permissions). Using expedition trailhead coordinates as reference.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleShareLocation = async () => {
    const coordsToShare = gpsData ? gpsData.coords : trailheadCoords;
    const accuracy = gpsData ? gpsData.accuracyMeters : undefined;
    const success = await shareExpeditionLocation(
      expeditionName,
      coordsToShare,
      accuracy,
      `Active check-in for ${expeditionName}. All members accounted for.`
    );

    if (success) {
      setShareSuccessMessage('Location shared successfully or copied to clipboard!');
      setTimeout(() => setShareSuccessMessage(null), 4000);
    }
  };

  const activeCoords = gpsData ? gpsData.coords : trailheadCoords;

  return (
    <div id="emergency-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Team & Expandable Emergency Contacts (7 cols) */}
      <div className={`lg:col-span-7 rounded-2xl p-6 shadow-lg border transition-colors flex flex-col gap-4 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-md'
      }`}>
        <div className={`flex items-center justify-between pb-4 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <User className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
              Expedition Roster & Emergency Contacts
            </h3>
          </div>
          <span className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            {members.length} {members.length === 1 ? 'Individual' : 'Individuals'} · Click to expand
          </span>
        </div>

        {/* Member Cards */}
        <div className="space-y-3">
          {members.map((member) => {
            const isExpanded = expandedMemberId === member.id;
            const sosMessage = `[EMERGENCY SOS - ${expeditionName}] ${member.name} requires assistance at GPS: ${activeCoords.lat.toFixed(5)}, ${activeCoords.lng.toFixed(5)}. Map: ${getAppleMapsUrl(activeCoords)}`;
            const smsUrl = buildSmsLink(member.emergencyContactPhone, sosMessage);

            return (
              <div
                key={member.id}
                className={`border rounded-xl overflow-hidden transition-all ${
                  isDark
                    ? 'border-slate-800 bg-slate-950/70'
                    : 'border-slate-300 bg-slate-50'
                }`}
              >
                {/* Collapsed Header / Click to Expand */}
                <button
                  type="button"
                  onClick={() => toggleExpand(member.id)}
                  className={`w-full p-4 flex items-center justify-between gap-4 text-left transition-colors cursor-pointer ${
                    isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${
                      isDark
                        ? 'bg-slate-800 border-slate-700 text-emerald-400'
                        : 'bg-emerald-100 border-emerald-300 text-emerald-900'
                    }`}>
                      {member.name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-base truncate ${isDark ? 'text-white' : 'text-slate-950'}`}>
                          {member.name}
                        </span>
                        <span className={`text-xs font-semibold shrink-0 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          · {member.role}
                        </span>
                      </div>
                      <div className={`text-xs sm:text-sm font-medium truncate mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        ICE: <strong className={isDark ? 'text-slate-100' : 'text-slate-900'}>{member.emergencyContactName}</strong> ({member.emergencyContactRelation}) · <span className="font-mono">{member.emergencyContactPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {member.bloodType && (
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
                        isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-900'
                      }`}>
                        {member.bloodType}
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
                    ) : (
                      <ChevronDown className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`} />
                    )}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className={`p-5 pt-2 border-t text-sm space-y-4 ${
                    isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white'
                  }`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div>
                        <span className={`text-xs uppercase font-extrabold tracking-wider block ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>Direct Contact</span>
                        <div className={`mt-1 font-bold text-base font-mono ${isDark ? 'text-white' : 'text-slate-950'}`}>
                          {member.phone}
                        </div>
                        <div className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {member.email}
                        </div>
                      </div>

                      <div>
                        <span className={`text-xs uppercase font-extrabold tracking-wider block ${
                          isDark ? 'text-slate-400' : 'text-slate-600'
                        }`}>Emergency Contact (Next-of-Kin)</span>
                        <div className={`mt-1 font-bold text-base ${isDark ? 'text-white' : 'text-slate-950'}`}>
                          {member.emergencyContactName} ({member.emergencyContactRelation})
                        </div>
                        <div className={`mt-0.5 font-mono font-bold text-base ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                          {member.emergencyContactPhone}
                        </div>
                      </div>
                    </div>

                    {/* Medical and Allergy Notes */}
                    <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
                    }`}>
                      <HeartPulse className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <div className="text-xs sm:text-sm leading-relaxed">
                        <span className={`font-bold block text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>
                          Medical Notes & Allergies:
                        </span>
                        <span>{member.medicalConditions || 'No chronic conditions'}. </span>
                        {member.allergies && (
                          <span className={`font-bold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                            Allergies: {member.allergies}.{' '}
                          </span>
                        )}
                        {member.medications && (
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                            Carrying: {member.medications}.
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons for this Member */}
                    <div className="flex items-center gap-3 pt-2 flex-wrap">
                      <a
                        href={`tel:${member.emergencyContactPhone}`}
                        className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-colors ${
                          isDark
                            ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-950 border-slate-300'
                        }`}
                      >
                        <Phone className="w-4 h-4 text-emerald-500" />
                        Call Emergency Contact
                      </a>

                      <a
                        href={smsUrl}
                        className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl bg-red-600 hover:bg-red-500 text-white transition-colors shadow-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Send SOS SMS (With GPS Link)
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Local SAR Authorities & Apple iOS GPS Beacon (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">

        {/* Local Authorities Dispatch Card */}
        <div className={`rounded-2xl p-6 shadow-lg border transition-colors flex flex-col gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-md'
        }`}>
          <div className={`flex items-center gap-2.5 pb-3 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <ShieldAlert className="w-6 h-6 text-amber-500" />
            <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
              Local Authorities & SAR
            </h3>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className={`text-xs uppercase font-extrabold tracking-wider block ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>Wilderness Ranger Dispatch</span>
              <div className="flex items-center justify-between gap-3 mt-1">
                <span className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {authorities.rangerStationName}
                </span>
                <a
                  href={`tel:${authorities.rangerPhone}`}
                  className={`inline-flex items-center gap-1.5 font-mono font-bold text-base shrink-0 ${
                    isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-900'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  {authorities.rangerPhone}
                </a>
              </div>
            </div>

            <div className={`pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`text-xs uppercase font-extrabold tracking-wider block ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>County Sheriff Search & Rescue (SAR)</span>
              <div className="flex items-center justify-between gap-3 mt-1">
                <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  24/7 SAR Emergency Line
                </span>
                <a
                  href={`tel:${authorities.sheriffSARPhone}`}
                  className="inline-flex items-center gap-1.5 font-mono font-black text-base text-red-500 hover:text-red-400 shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {authorities.sheriffSARPhone}
                </a>
              </div>
            </div>

            <div className={`pt-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <span className={`text-xs uppercase font-extrabold tracking-wider block ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>Nearest Medical / Trauma Center</span>
              <div className="flex items-center justify-between gap-3 mt-1">
                <span className={`font-bold truncate ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {authorities.medicalFacilityName}
                </span>
                <a
                  href={`tel:${authorities.medicalFacilityPhone}`}
                  className={`inline-flex items-center gap-1.5 font-mono font-bold text-base shrink-0 ${
                    isDark ? 'text-slate-200 hover:text-white' : 'text-slate-800 hover:text-slate-950'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5" />
                  {authorities.medicalFacilityPhone}
                </a>
              </div>
            </div>

            {authorities.permitNumber && (
              <div className={`pt-3 border-t text-xs sm:text-sm ${isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'}`}>
                <span>Wilderness Permit #: </span>
                <span className={`font-mono font-black ${isDark ? 'text-white' : 'text-slate-950'}`}>
                  {authorities.permitNumber}
                </span>
              </div>
            )}

            <div className={`mt-2 p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed ${
              isDark ? 'bg-slate-950/80 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}>
              <span className={`font-extrabold block mb-0.5 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                Overdue Protocol:
              </span>
              {authorities.protocolNotes}
            </div>
          </div>
        </div>

        {/* Apple iOS Location Sharing & Real-Time GPS Beacon */}
        <div className={`rounded-2xl p-6 shadow-lg border transition-colors flex flex-col gap-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-md'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <Compass className={`w-6 h-6 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                iOS Location Share Beacon
              </h3>
            </div>
            <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Apple Maps Link
            </span>
          </div>

          <div className={`p-4 rounded-xl border space-y-2.5 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs uppercase font-extrabold tracking-wider ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>Current Position:</span>
              <button
                type="button"
                onClick={handleAcquireLocation}
                disabled={isLocating}
                className={`text-xs sm:text-sm font-bold underline flex items-center gap-1.5 cursor-pointer ${
                  isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-700 hover:text-emerald-900'
                }`}
              >
                <MapPin className="w-4 h-4" />
                {isLocating ? 'Acquiring GPS...' : 'Ping Live GPS'}
              </button>
            </div>

            <div className={`font-mono text-base sm:text-lg font-black tabular-nums ${
              isDark ? 'text-white' : 'text-slate-950'
            }`}>
              {activeCoords.lat.toFixed(5)}°N, {Math.abs(activeCoords.lng).toFixed(5)}°W
            </div>

            <div className={`text-xs font-semibold flex items-center justify-between ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              <span>{gpsData ? `Accuracy: ±${gpsData.accuracyMeters}m` : 'Base: Trailhead Point'}</span>
              <span>{gpsData?.altitudeMeters ? `Alt: ${gpsData.altitudeMeters}m` : ''}</span>
              <span>{gpsData?.timestamp || 'Ready'}</span>
            </div>
          </div>

          {shareSuccessMessage && (
            <div className={`text-xs sm:text-sm font-bold p-3 rounded-xl border ${
              isDark ? 'text-emerald-300 bg-emerald-950/60 border-emerald-700' : 'text-emerald-900 bg-emerald-100 border-emerald-400'
            }`}>
              ✓ {shareSuccessMessage}
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleShareLocation}
              className="flex-1 inline-flex items-center justify-center gap-2.5 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl text-white bg-purple-600 hover:bg-purple-500 active:bg-purple-700 transition-colors shadow-md shadow-purple-600/30 cursor-pointer"
            >
              <Share2 className="w-4.5 h-4.5" />
              <span>Share via Apple iOS / Share Sheet</span>
            </button>
            
            <a
              href={getAppleMapsUrl(activeCoords, `${expeditionName} GPS`)}
              target="_blank"
              rel="noopener noreferrer"
              className={`px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl border transition-colors shrink-0 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
              }`}
              title="Open Apple Maps"
            >
              Open in Maps
            </a>
          </div>

          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Broadcasts a universal Apple Maps link directly to family iMessage or SMS. Recipient iPhone devices will render an interactive pinpoint without needing third-party apps or paid tracking subscriptions.
          </p>
        </div>

      </div>

    </div>
  );
};
