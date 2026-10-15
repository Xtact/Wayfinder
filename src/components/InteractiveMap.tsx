import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Coordinates, EmergencyResource } from '../types/expedition';
import { getAppleMapsUrl, getGoogleMapsUrl } from '../services/geoService';
import { MapPin, Navigation, Compass, ExternalLink } from 'lucide-react';

interface InteractiveMapProps {
  trailheadCoords: Coordinates;
  trailheadName: string;
  parkingCoords?: Coordinates;
  parkingNotes?: string;
  locationName: string;
  resources: EmergencyResource[];
  userLocation?: Coordinates | null;
  theme?: 'dark' | 'light';
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  trailheadCoords,
  trailheadName,
  parkingCoords,
  parkingNotes,
  locationName,
  resources,
  userLocation,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeLayer, setActiveLayer] = useState<'topo' | 'dark' | 'osm'>('topo');

  const tileLayers = {
    topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  };

  const tileAttributions = {
    topo: 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap',
    dark: '&copy; OpenStreetMap contributors &copy; CARTO',
    osm: '&copy; OpenStreetMap contributors',
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [trailheadCoords.lat, trailheadCoords.lng],
        zoom: 12,
        zoomControl: true,
      });

      const baseTile = L.tileLayer(tileLayers[activeLayer], {
        attribution: tileAttributions[activeLayer],
        maxZoom: 18,
      }).addTo(map);

      (map as any)._currentTileLayer = baseTile;
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else {
      const map = mapInstanceRef.current;
      if ((map as any)._currentTileLayer) {
        map.removeLayer((map as any)._currentTileLayer);
      }
      const newTile = L.tileLayer(tileLayers[activeLayer], {
        attribution: tileAttributions[activeLayer],
        maxZoom: 18,
      }).addTo(map);
      (map as any)._currentTileLayer = newTile;
    }

    // Refresh markers
    const markers = markersLayerRef.current;
    if (markers && mapInstanceRef.current) {
      markers.clearLayers();

      // 1. Trailhead Start Marker (Green Beacon)
      const trailheadIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background-color: #10b981; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid #064e3b; box-shadow: 0 4px 6px rgba(0,0,0,0.4);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });

      L.marker([trailheadCoords.lat, trailheadCoords.lng], { icon: trailheadIcon })
        .bindPopup(`
          <div style="font-family: var(--font-sans); padding: 6px;">
            <div style="font-weight: 800; color: #10b981; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Trailhead Start</div>
            <div style="font-weight: 700; color: #0f172a; font-size: 15px; margin-top: 3px;">${trailheadName}</div>
            <div style="font-size: 13px; color: #475569; font-family: monospace; font-weight: 600; margin-top: 4px;">${trailheadCoords.lat.toFixed(5)}, ${trailheadCoords.lng.toFixed(5)}</div>
          </div>
        `)
        .addTo(markers);

      // 2. Parking Lot Marker (Blue)
      if (parkingCoords) {
        const parkingIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color: #2563eb; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; border: 3px solid #1e3a8a; box-shadow: 0 4px 6px rgba(0,0,0,0.4);">P</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        });

        L.marker([parkingCoords.lat, parkingCoords.lng], { icon: parkingIcon })
          .bindPopup(`
            <div style="font-family: var(--font-sans); padding: 6px;">
              <div style="font-weight: 800; color: #2563eb; font-size: 13px; text-transform: uppercase;">Vehicle Parking</div>
              <div style="font-size: 14px; color: #0f172a; font-weight: 600; margin-top: 3px;">${parkingNotes || 'Vehicle Staging Area'}</div>
              <div style="font-size: 13px; color: #475569; font-family: monospace; margin-top: 4px;">${parkingCoords.lat.toFixed(5)}, ${parkingCoords.lng.toFixed(5)}</div>
            </div>
          `)
          .addTo(markers);
      }

      // 3. User Live Geolocation Pin (Purple)
      if (userLocation) {
        const userIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color: #9333ea; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid #581c87; box-shadow: 0 0 14px #9333ea;">•</div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
          popupAnchor: [0, -34],
        });

        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .bindPopup(`
            <div style="font-family: var(--font-sans); padding: 6px;">
              <div style="font-weight: 800; color: #9333ea; font-size: 13px; text-transform: uppercase;">Your Device GPS</div>
              <div style="font-size: 13px; color: #475569; font-family: monospace; font-weight: 600; margin-top: 4px;">${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}</div>
            </div>
          `)
          .addTo(markers);
      }

      // 4. Emergency Resources
      resources.forEach((res) => {
        let bgColor = '#d97706';
        let label = 'SAR';
        if (res.type === 'hospital') {
          bgColor = '#dc2626';
          label = 'MED';
        } else if (res.type === 'ranger') {
          bgColor = '#059669';
          label = 'RGR';
        } else if (res.type === 'shelter') {
          bgColor = '#0891b2';
          label = 'HUT';
        }

        const icon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background-color: ${bgColor}; color: white; width: 30px; height: 30px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; border: 2px solid rgba(0,0,0,0.5); box-shadow: 0 3px 5px rgba(0,0,0,0.3);">${label}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });

        L.marker([res.coordinates.lat, res.coordinates.lng], { icon })
          .bindPopup(`
            <div style="font-family: var(--font-sans); padding: 6px;">
              <div style="font-weight: 800; color: ${bgColor}; font-size: 12px; text-transform: uppercase;">${res.type} · ${res.distanceMiles ? `${res.distanceMiles} mi` : ''}</div>
              <div style="font-weight: 700; color: #0f172a; font-size: 14px; margin-top: 2px;">${res.name}</div>
              ${res.phone ? `<div style="font-size: 13px; font-weight: 600; color: #0284c7; margin-top: 2px;">Phone: ${res.phone}</div>` : ''}
              <div style="font-size: 12px; color: #475569; margin-top: 4px;">${res.notes}</div>
            </div>
          `)
          .addTo(markers);
      });
    }
  }, [trailheadCoords, parkingCoords, userLocation, resources, activeLayer]);

  const handleCenterOnTrailhead = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([trailheadCoords.lat, trailheadCoords.lng], 13);
    }
  };

  const appleMapsUrl = getAppleMapsUrl(trailheadCoords, trailheadName);

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-lg flex flex-col transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-md'
    }`}>
      {/* Map Control Header */}
      <div className={`p-5 border-b flex flex-wrap items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2.5">
            <Compass className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
              Wilderness Tactical Map
            </h3>
          </div>
          <div className={`text-xs sm:text-sm font-semibold mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <span>{locationName}</span>
            <span className="mx-2">·</span>
            <span className={`font-mono font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-800'}`}>
              {trailheadCoords.lat.toFixed(4)}°N, {Math.abs(trailheadCoords.lng).toFixed(4)}°W
            </span>
          </div>
        </div>

        {/* Map Actions and Layer Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className={`flex items-center p-1 rounded-xl border text-xs sm:text-sm font-bold ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-300 shadow-sm'
          }`}>
            <button
              onClick={() => setActiveLayer('topo')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeLayer === 'topo'
                  ? isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Topographic
            </button>
            <button
              onClick={() => setActiveLayer('dark')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeLayer === 'dark'
                  ? isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Voyager
            </button>
            <button
              onClick={() => setActiveLayer('osm')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeLayer === 'osm'
                  ? isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Standard
            </button>
          </div>

          <button
            onClick={handleCenterOnTrailhead}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-sm'
            }`}
            title="Recenter Map on Trailhead"
          >
            <Navigation className="w-4.5 h-4.5 text-emerald-600" />
          </button>

          <a
            href={appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl border transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-100 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300 shadow-sm'
            }`}
          >
            <span>Apple Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Map Viewport */}
      <div className="relative w-full h-84 sm:h-100 bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Legend Overlay */}
        <div className={`absolute bottom-4 left-4 z-[400] backdrop-blur-sm border rounded-xl p-3 text-xs sm:text-sm shadow-xl pointer-events-auto ${
          isDark ? 'bg-slate-950/95 border-slate-800 text-slate-200' : 'bg-white/95 border-slate-300 text-slate-900'
        }`}>
          <div className={`text-xs font-black uppercase tracking-wider mb-2 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>Map Legend</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-bold">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
              <span>Trailhead</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0"></span>
              <span>Vehicle Lot</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-700 shrink-0"></span>
              <span>Ranger HQ</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-600 shrink-0"></span>
              <span>Sheriff SAR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
