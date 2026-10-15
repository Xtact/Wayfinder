import React from 'react';
import { DailyWeatherForecast } from '../types/expedition';
import { Cloud, CloudRain, Sun, Wind, AlertTriangle, RefreshCw, Thermometer } from 'lucide-react';

interface WeatherWidgetProps {
  forecasts: DailyWeatherForecast[];
  isLoading: boolean;
  onRefresh: () => void;
  locationName: string;
  theme?: 'dark' | 'light';
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  forecasts,
  isLoading,
  onRefresh,
  locationName,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const hasSevereAlert = forecasts.some((f) => f.isWarning);

  const getWeatherIcon = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('rain') || lower.includes('drizzle') || lower.includes('shower')) {
      return <CloudRain className="w-7 h-7 text-sky-500" />;
    }
    if (lower.includes('thunder') || lower.includes('lightning') || lower.includes('freezing')) {
      return <AlertTriangle className="w-7 h-7 text-amber-500" />;
    }
    if (lower.includes('clear') || lower.includes('sunny')) {
      return <Sun className="w-7 h-7 text-amber-500" />;
    }
    return <Cloud className="w-7 h-7 text-slate-400" />;
  };

  return (
    <div className={`rounded-2xl p-6 shadow-lg border transition-colors flex flex-col gap-5 ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-md'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between gap-4 flex-wrap pb-4 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center gap-2.5">
            <Thermometer className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
            <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
              3-Day Expedition Weather Forecast & Emergency Warnings
            </h3>
          </div>
          <div className={`text-xs sm:text-sm font-medium mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            <span>Powered by Open-Meteo High-Resolution Model ($0 API)</span>
            <span className="mx-2">·</span>
            <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>{locationName.split(',')[0]}</span>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl transition-colors disabled:opacity-50 cursor-pointer border ${
            isDark
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-500' : ''}`} />
          <span>{isLoading ? 'Updating...' : 'Sync Weather'}</span>
        </button>
      </div>

      {/* Severe Weather Alert Banner if adverse conditions exist */}
      {hasSevereAlert && (
        <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
          isDark
            ? 'bg-amber-950/50 border-amber-600/70 text-amber-200'
            : 'bg-amber-50 border-amber-400 text-amber-950 shadow-sm'
        }`}>
          <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <span className="font-extrabold text-sm sm:text-base block mb-0.5">
              Wilderness Weather Advisory Active
            </span>
            <span>
              Adverse meteorological conditions detected over the 3-day expedition window. Inspect gear, adjust camp elevations, and maintain satellite communication check-ins.
            </span>
          </div>
        </div>
      )}

      {/* 3-Day Forecast Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {forecasts.map((f, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-5 border transition-all flex flex-col justify-between ${
              f.isWarning
                ? isDark
                  ? 'bg-amber-950/25 border-amber-600/60'
                  : 'bg-amber-50/70 border-amber-400 shadow-sm'
                : isDark
                  ? 'bg-slate-950/80 border-slate-800'
                  : 'bg-slate-50 border-slate-300 shadow-sm'
            }`}
          >
            <div>
              {/* Day Title and Condition */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-950'}`}>
                    {f.dayLabel}
                  </h4>
                  <p className={`text-xs sm:text-sm font-semibold mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {f.weatherText}
                  </p>
                </div>
                <div className={`shrink-0 p-2.5 rounded-xl border ${
                  isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300 shadow-sm'
                }`}>
                  {getWeatherIcon(f.weatherText)}
                </div>
              </div>

              {/* Temperatures & High-Level Metrics */}
              <div className={`my-4 py-3 border-y grid grid-cols-2 gap-3 text-center ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div>
                  <span className={`text-xs uppercase font-extrabold tracking-wider block ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>High / Low</span>
                  <span className={`text-lg sm:text-xl font-black font-mono tabular-nums block mt-0.5 ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}>
                    {f.tempMaxF}° / {f.tempMinF}°F
                  </span>
                  <span className={`text-xs font-semibold block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    ({f.tempMaxC}° / {f.tempMinC}°C)
                  </span>
                </div>
                <div>
                  <span className={`text-xs uppercase font-extrabold tracking-wider block ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>Rain / Wind</span>
                  <span className={`text-lg sm:text-xl font-black font-mono tabular-nums block mt-0.5 ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}>
                    {f.precipitationProbability}%
                  </span>
                  <span className={`text-xs font-semibold block font-mono ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {f.windSpeedMaxMph} mph gusts
                  </span>
                </div>
              </div>

              {/* Specific Warning if flagged */}
              {f.warningReason && (
                <div className={`mb-3 text-xs sm:text-sm font-bold p-3 rounded-lg border leading-snug ${
                  isDark
                    ? 'text-amber-200 bg-amber-950/60 border-amber-700'
                    : 'text-amber-950 bg-amber-100 border-amber-400'
                }`}>
                  ⚠️ {f.warningReason}
                </div>
              )}
            </div>

            {/* Tactical Preparedness Advice */}
            <div className={`mt-3 pt-3 border-t text-xs sm:text-sm leading-relaxed ${
              isDark ? 'border-slate-800 text-slate-200' : 'border-slate-200 text-slate-800'
            }`}>
              <span className={`font-black block text-xs uppercase tracking-wider mb-1 ${
                isDark ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                Tactical Protocol
              </span>
              <span>{f.preparednessAdvice}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
