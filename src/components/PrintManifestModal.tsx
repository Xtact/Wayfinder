import React from 'react';
import { ExpeditionPlan } from '../types/expedition';
import { Printer, X, ShieldAlert, Car, MapPin, Users, Phone, Calendar } from 'lucide-react';

interface PrintManifestModalProps {
  plan: ExpeditionPlan;
  onClose: () => void;
}

export const PrintManifestModal: React.FC<PrintManifestModalProps> = ({ plan, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Modal Action Header (Excluded in print via no-print class) */}
        <div className="no-print p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Printable Wilderness Emergency Plan & SAR Manifest
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-10 bg-white text-slate-900 print-manifest-container">
          
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
                  WILDERNESS SEARCH & RESCUE TRIP MANIFEST
                </span>
                <h1 className="text-2xl font-black text-slate-950 tracking-tight mt-1">
                  {plan.name}
                </h1>
                <p className="text-xs text-slate-600 mt-1">
                  Expedition Type: <strong className="capitalize">{plan.type.replace('_', ' ')}</strong> · Region: {plan.region}
                </p>
              </div>

              <div className="text-right border-l-2 border-slate-200 pl-4">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Filing Status</span>
                <span className="text-xs font-mono font-bold text-emerald-800 block">ACTIVE TRIP PLAN</span>
                <span className="text-[10px] text-slate-500">Permit: {plan.authorities.permitNumber || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Time & Overdue Trigger Box */}
          <div className="p-3.5 mb-6 bg-red-50 border border-red-300 rounded-lg text-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <span className="font-bold text-red-900 block">Departure Date & Time:</span>
              <span className="font-mono text-slate-800">{plan.startDate} (Morning)</span>
            </div>
            <div>
              <span className="font-bold text-red-900 block">Expected Return Date:</span>
              <span className="font-mono text-slate-800">{plan.endDate}</span>
            </div>
            <div>
              <span className="font-bold text-red-900 block">OVERDUE CUTOFF DEADLINE:</span>
              <span className="font-mono font-bold text-red-700">{plan.expectedReturnTime}</span>
            </div>
          </div>

          {/* Section 1: Trailhead, Location & Staging Vehicle */}
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-slate-200 p-4 rounded-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-700" />
                Trailhead & GPS Starting Point
              </h3>
              <p className="text-xs font-bold text-slate-900">{plan.trailheadName}</p>
              <p className="text-xs text-slate-600 mt-0.5">{plan.locationName}</p>
              <p className="text-xs font-mono font-bold text-slate-800 mt-2">
                Coordinates: {plan.coordinates.lat.toFixed(5)}°N, {Math.abs(plan.coordinates.lng).toFixed(5)}°W
              </p>
            </div>

            <div className="border border-slate-200 p-4 rounded-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-slate-700" />
                Vehicle Left at Trailhead
              </h3>
              <p className="text-xs font-bold text-slate-900">
                {plan.vehicle.makeModel} ({plan.vehicle.color})
              </p>
              <p className="text-xs font-mono font-bold text-slate-800 mt-1">
                License Plate: {plan.vehicle.licensePlate} ({plan.vehicle.state})
              </p>
              <p className="text-xs text-slate-600 mt-1 italic">
                Parking Location: {plan.vehicle.parkingSpotNotes}
              </p>
            </div>
          </div>

          {/* Section 2: Team Members & Emergency Medical Contacts */}
          <div className="mb-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-700" />
              Expedition Roster & Next-of-Kin Emergency Contacts
            </h3>

            <table className="w-full text-left text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300">
                  <th className="p-2 font-bold text-slate-900">Name & Role</th>
                  <th className="p-2 font-bold text-slate-900">Direct Phone</th>
                  <th className="p-2 font-bold text-slate-900">Emergency Contact (Next of Kin)</th>
                  <th className="p-2 font-bold text-slate-900">Medical / Allergies</th>
                  <th className="p-2 font-bold text-slate-900 text-center">Blood</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {plan.members.map((m) => (
                  <tr key={m.id}>
                    <td className="p-2">
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-slate-500">{m.role}</div>
                    </td>
                    <td className="p-2 font-mono">{m.phone}</td>
                    <td className="p-2">
                      <div className="font-semibold text-slate-900">{m.emergencyContactName} ({m.emergencyContactRelation})</div>
                      <div className="font-mono text-slate-700">{m.emergencyContactPhone}</div>
                    </td>
                    <td className="p-2">
                      <div>{m.allergies ? `Allergies: ${m.allergies}` : 'No known allergies'}</div>
                      {m.medications && <div className="text-slate-600">Med: {m.medications}</div>}
                    </td>
                    <td className="p-2 text-center font-mono font-bold">{m.bloodType || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 3: Emergency Dispatch & SAR Lines */}
          <div className="mb-6 border border-slate-200 p-4 rounded-lg bg-slate-50">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-700" />
              Search & Rescue (SAR) and Emergency Dispatch Lines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="font-semibold text-slate-700 block">Wilderness Ranger Dispatch:</span>
                <span className="text-slate-900">{plan.authorities.rangerStationName}</span>
                <span className="font-mono font-bold text-slate-950 block">{plan.authorities.rangerPhone}</span>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block">County Sheriff SAR Emergency:</span>
                <span className="text-slate-900">24/7 Mountain Rescue Unit</span>
                <span className="font-mono font-bold text-red-700 block">{plan.authorities.sheriffSARPhone}</span>
              </div>

              <div>
                <span className="font-semibold text-slate-700 block">Nearest Trauma Emergency Room:</span>
                <span className="text-slate-900">{plan.authorities.medicalFacilityName}</span>
                <span className="font-mono font-bold text-slate-950 block">{plan.authorities.medicalFacilityPhone}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Emergency Protocols & Route Contingencies */}
          <div className="border-t border-slate-300 pt-3 text-xs text-slate-700">
            <span className="font-bold text-slate-900">Search Protocol Instructions: </span>
            <span>{plan.authorities.protocolNotes} </span>
            <span className="block mt-1 italic text-slate-600">
              Contingency Notes: {plan.emergencyNotes}
            </span>
          </div>

          {/* Footer Notice */}
          <div className="mt-8 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Generated by Wayfinder · Private / Family Wilderness Safety Plan</span>
            <span>Document Timestamp: {new Date().toLocaleString()}</span>
          </div>

        </div>

      </div>
    </div>
  );
};
