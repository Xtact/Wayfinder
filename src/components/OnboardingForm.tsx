import React, { useState } from 'react';
import { ExpeditionPlan, ExpeditionType, IndividualContact } from '../types/expedition';
import { PRESET_EXPEDITIONS } from '../services/storageService';
import { searchLocationCoordinates } from '../services/geoService';
import { Compass, Users, MapPin, ShieldAlert, Plus, Trash2, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingFormProps {
  initialPlan: ExpeditionPlan;
  onSave: (plan: ExpeditionPlan) => void;
  onCancel?: () => void;
  theme?: 'dark' | 'light';
}

export const OnboardingForm: React.FC<OnboardingFormProps> = ({
  initialPlan,
  onSave,
  onCancel,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState<ExpeditionPlan>(initialPlan);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ name: string; coords: { lat: number; lng: number } }[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const expeditionTypes: { value: ExpeditionType; label: string }[] = [
    { value: 'backcountry_hike', label: 'Backcountry Hike / Trek' },
    { value: 'fishing_trip', label: 'Wilderness Fishing Trip' },
    { value: 'alpine_climb', label: 'Alpine Mountaineering & Climb' },
    { value: 'canoe_kayak', label: 'Canoe / Kayak Expedition' },
    { value: 'bikepacking', label: 'Wilderness Bikepacking' },
    { value: 'wilderness_backpacking', label: 'Multi-Day Backpacking' },
    { value: 'other', label: 'Other Outdoor Expedition' },
  ];

  const handlePresetSelect = (presetIndex: number) => {
    const selected = PRESET_EXPEDITIONS[presetIndex]?.plan;
    if (selected) {
      setFormData(JSON.parse(JSON.stringify(selected)));
    }
  };

  const handleLocationSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const results = await searchLocationCoordinates(searchQuery);
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleSelectSearchResult = (res: { name: string; coords: { lat: number; lng: number } }) => {
    setFormData({
      ...formData,
      locationName: res.name,
      coordinates: res.coords,
      trailheadCoordinates: res.coords,
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  // Member management
  const handleAddMember = () => {
    const newMember: IndividualContact = {
      id: `member-${Date.now()}`,
      name: '',
      role: 'Team Member',
      phone: '',
      email: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      bloodType: '',
      medicalConditions: '',
      allergies: '',
    };
    setFormData({
      ...formData,
      members: [...formData.members, newMember],
    });
  };

  const handleUpdateMember = (index: number, field: keyof IndividualContact, value: string) => {
    const updated = [...formData.members];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, members: updated });
  };

  const handleRemoveMember = (index: number) => {
    if (formData.members.length <= 1) {
      alert('You must have at least one expedition member.');
      return;
    }
    const updated = formData.members.filter((_, i) => i !== index);
    setFormData({ ...formData, members: updated });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Please enter an expedition name.');
      return;
    }
    if (formData.members.some((m) => !m.name.trim() || !m.emergencyContactPhone.trim())) {
      alert('Please make sure every member has a name and an emergency contact phone number.');
      return;
    }
    onSave(formData);
  };

  const inputClass = `w-full px-4 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
    isDark
      ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500'
      : 'bg-white border-slate-300 text-slate-950 placeholder-slate-400'
  }`;

  const labelClass = `block mb-1.5 font-bold text-xs uppercase tracking-wider ${
    isDark ? 'text-slate-300' : 'text-slate-700'
  }`;

  const cardClass = `rounded-2xl p-6 sm:p-8 shadow-lg border transition-colors space-y-5 ${
    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-md'
  }`;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Page Header */}
      <div className={`mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <span className={`text-xs uppercase font-mono font-black tracking-widest ${
              isDark ? 'text-emerald-400' : 'text-emerald-700'
            }`}>
              Step 1 of 1 · Briefing Intake
            </span>
          </div>
          <h1 className={`text-2xl sm:text-4xl font-black tracking-tight mt-1 ${
            isDark ? 'text-white' : 'text-slate-950'
          }`}>
            Expedition Safety & Logistics Briefing
          </h1>
          <p className={`text-sm sm:text-base font-medium mt-1.5 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Complete your trip plan to generate the tactical field dashboard, emergency contact dials, and 3-day weather briefings.
          </p>
        </div>

        {/* Rapid Preset Selector */}
        <div className="flex items-center gap-2.5 self-center sm:self-auto shrink-0">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <select
            onChange={(e) => handlePresetSelect(parseInt(e.target.value))}
            className={`text-xs sm:text-sm font-bold rounded-xl border px-3.5 py-2.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-100 border-slate-300 text-slate-900 shadow-sm'
            }`}
            defaultValue="0"
          >
            <option value="0">Load: Sierra Nevada Trek (Preset)</option>
            <option value="1">Load: Mount Hood Timberline (Preset)</option>
            <option value="2">Load: Boundary Waters Canoe (Preset)</option>
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Step 1: Expedition Core Details */}
        <div className={cardClass}>
          <div className={`flex items-center gap-2.5 pb-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <Compass className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
              1. Expedition Identity & Schedule
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div>
              <label className={labelClass}>Expedition Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Sierra Nevada Alpine Lake Trek"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Expedition Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ExpeditionType })}
                className={inputClass}
              >
                {expeditionTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Wilderness Location / Region *</label>
              <input
                type="text"
                required
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                placeholder="e.g. Desolation Wilderness, Eldorado National Forest, CA"
                className={inputClass}
              />

              {/* Quick Nominatim Location Coordinate Search */}
              <div className="mt-3 flex gap-2.5">
                <input
                  type="text"
                  placeholder="Lookup coordinates via OpenStreetMap (e.g. Echo Lake CA)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleLocationSearch(); } }}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={handleLocationSearch}
                  disabled={isSearching}
                  className={`px-4 py-2 text-xs sm:text-sm rounded-xl font-bold border transition-colors shrink-0 cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300 shadow-sm'
                  }`}
                >
                  {isSearching ? 'Searching...' : 'Lookup GPS'}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className={`mt-3 p-3 rounded-xl border space-y-1.5 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                }`}>
                  <span className={`text-xs font-bold uppercase tracking-wider block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Select Location Match:
                  </span>
                  {searchResults.map((res, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectSearchResult(res)}
                      className={`w-full text-left px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg truncate block transition-colors ${
                        isDark ? 'text-slate-200 hover:bg-slate-900 hover:text-white' : 'text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      {res.name} ({res.coords.lat.toFixed(4)}, {res.coords.lng.toFixed(4)})
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Departure Date *</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Expected Return Date *</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Overdue Trigger Cutoff Time *</label>
              <input
                type="text"
                required
                value={formData.expectedReturnTime}
                onChange={(e) => setFormData({ ...formData, expectedReturnTime: e.target.value })}
                placeholder="e.g. 17:00 PST"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Coordinates (Latitude / Longitude)</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  step="any"
                  value={formData.coordinates.lat}
                  onChange={(e) => setFormData({
                    ...formData,
                    coordinates: { ...formData.coordinates, lat: parseFloat(e.target.value) || 0 }
                  })}
                  className={`${inputClass} font-mono`}
                />
                <input
                  type="number"
                  step="any"
                  value={formData.coordinates.lng}
                  onChange={(e) => setFormData({
                    ...formData,
                    coordinates: { ...formData.coordinates, lng: parseFloat(e.target.value) || 0 }
                  })}
                  className={`${inputClass} font-mono`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Trailhead & Staging Vehicle */}
        <div className={cardClass}>
          <div className={`flex items-center gap-2.5 pb-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <MapPin className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
              2. Trailhead & Vehicle Staging Area
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div className="sm:col-span-2">
              <label className={labelClass}>Trailhead / Entry Point Name *</label>
              <input
                type="text"
                required
                value={formData.trailheadName}
                onChange={(e) => setFormData({ ...formData, trailheadName: e.target.value })}
                placeholder="e.g. Echo Lakes Trailhead (Pacific Crest Trail / TRT)"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Vehicle Make, Model & Year</label>
              <input
                type="text"
                value={formData.vehicle.makeModel}
                onChange={(e) => setFormData({
                  ...formData,
                  vehicle: { ...formData.vehicle, makeModel: e.target.value }
                })}
                placeholder="e.g. Subaru Outback (Wilderness)"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>License Plate & State</label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={formData.vehicle.licensePlate}
                  onChange={(e) => setFormData({
                    ...formData,
                    vehicle: { ...formData.vehicle, licensePlate: e.target.value }
                  })}
                  placeholder="Plate (e.g. 7XYZ892)"
                  className={`${inputClass} font-mono uppercase`}
                />
                <input
                  type="text"
                  value={formData.vehicle.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    vehicle: { ...formData.vehicle, state: e.target.value }
                  })}
                  placeholder="State (e.g. CA)"
                  className={`${inputClass} uppercase`}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Vehicle Color</label>
              <input
                type="text"
                value={formData.vehicle.color}
                onChange={(e) => setFormData({
                  ...formData,
                  vehicle: { ...formData.vehicle, color: e.target.value }
                })}
                placeholder="e.g. Autumn Green Metallic"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Parking Spot Notes (for Search & Rescue)</label>
              <input
                type="text"
                value={formData.vehicle.parkingSpotNotes}
                onChange={(e) => setFormData({
                  ...formData,
                  vehicle: { ...formData.vehicle, parkingSpotNotes: e.target.value }
                })}
                placeholder="e.g. Overflow dirt lot 80 yards west of chalet"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Step 3: Members & Emergency Contacts */}
        <div className={cardClass}>
          <div className={`flex items-center justify-between pb-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <div className="flex items-center gap-2.5">
              <Users className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                3. Team Members & Emergency Contacts (ICE)
              </h2>
            </div>
            <button
              type="button"
              onClick={handleAddMember}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
                  : 'bg-emerald-100 text-emerald-950 border-emerald-300 hover:bg-emerald-200'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>

          <div className="space-y-5">
            {formData.members.map((member, idx) => (
              <div key={member.id} className={`p-5 rounded-2xl border space-y-4 ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
              }`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-black ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    Individual #{idx + 1}
                  </span>
                  {formData.members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(idx)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input
                      type="text"
                      required
                      value={member.name}
                      onChange={(e) => handleUpdateMember(idx, 'name', e.target.value)}
                      placeholder="e.g. Christopher Vance"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Role / Function</label>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) => handleUpdateMember(idx, 'role', e.target.value)}
                      placeholder="e.g. Trip Leader / Medic"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Direct Mobile Phone</label>
                    <input
                      type="tel"
                      value={member.phone}
                      onChange={(e) => handleUpdateMember(idx, 'phone', e.target.value)}
                      placeholder="(555) 000-0000"
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Emergency Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={member.emergencyContactName}
                      onChange={(e) => handleUpdateMember(idx, 'emergencyContactName', e.target.value)}
                      placeholder="e.g. Sarah Vance"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Emergency Relationship</label>
                    <input
                      type="text"
                      value={member.emergencyContactRelation}
                      onChange={(e) => handleUpdateMember(idx, 'emergencyContactRelation', e.target.value)}
                      placeholder="e.g. Spouse / Parent"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Emergency Phone (Next of Kin) *</label>
                    <input
                      type="tel"
                      required
                      value={member.emergencyContactPhone}
                      onChange={(e) => handleUpdateMember(idx, 'emergencyContactPhone', e.target.value)}
                      placeholder="(555) 111-2222"
                      className={`${inputClass} font-mono font-bold text-emerald-500`}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Blood Type</label>
                    <input
                      type="text"
                      value={member.bloodType || ''}
                      onChange={(e) => handleUpdateMember(idx, 'bloodType', e.target.value)}
                      placeholder="e.g. O+, A-"
                      className={`${inputClass} font-mono`}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClass}>Medical Conditions, Allergies & Medications</label>
                    <input
                      type="text"
                      value={member.allergies || ''}
                      onChange={(e) => handleUpdateMember(idx, 'allergies', e.target.value)}
                      placeholder="e.g. Penicillin allergy, carry EpiPen, asthma"
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 4: Local Authorities & SAR Dispatch */}
        <div className={cardClass}>
          <div className={`flex items-center gap-2.5 pb-4 border-b ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <ShieldAlert className="w-6 h-6 text-amber-500" />
            <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
              4. Local Authorities & SAR Preparedness
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
            <div>
              <label className={labelClass}>Wilderness Ranger Station Name</label>
              <input
                type="text"
                value={formData.authorities.rangerStationName}
                onChange={(e) => setFormData({
                  ...formData,
                  authorities: { ...formData.authorities, rangerStationName: e.target.value }
                })}
                placeholder="e.g. Eldorado National Forest Supervisor Office"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Ranger Station Dispatch Phone</label>
              <input
                type="tel"
                value={formData.authorities.rangerPhone}
                onChange={(e) => setFormData({
                  ...formData,
                  authorities: { ...formData.authorities, rangerPhone: e.target.value }
                })}
                placeholder="(530) 622-5061"
                className={`${inputClass} font-mono`}
              />
            </div>

            <div>
              <label className={labelClass}>County Sheriff Search & Rescue (SAR) 24/7</label>
              <input
                type="tel"
                value={formData.authorities.sheriffSARPhone}
                onChange={(e) => setFormData({
                  ...formData,
                  authorities: { ...formData.authorities, sheriffSARPhone: e.target.value }
                })}
                placeholder="(530) 621-6600"
                className={`${inputClass} font-mono font-bold text-amber-500`}
              />
            </div>

            <div>
              <label className={labelClass}>Wilderness Permit # (if issued)</label>
              <input
                type="text"
                value={formData.authorities.permitNumber || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  authorities: { ...formData.authorities, permitNumber: e.target.value }
                })}
                placeholder="e.g. DES-2026-08492"
                className={`${inputClass} font-mono font-bold`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelClass}>Overdue Search Protocol Instructions</label>
              <textarea
                rows={3}
                value={formData.authorities.protocolNotes}
                onChange={(e) => setFormData({
                  ...formData,
                  authorities: { ...formData.authorities, protocolNotes: e.target.value }
                })}
                placeholder="Instructions for family: If party not checked in by deadline, call County Sheriff SAR..."
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Save & Launch Button */}
        <div className="flex items-center justify-between gap-4 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className={`px-5 py-3 text-sm font-bold rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
              }`}
            >
              Back to Dashboard
            </button>
          )}

          <button
            type="submit"
            className="ml-auto inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-black rounded-xl text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/25 cursor-pointer"
          >
            <span>Save & Launch Tactical Dashboard</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </form>
    </div>
  );
};
