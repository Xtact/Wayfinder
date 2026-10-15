import React from 'react';
import { RegionalNewsItem, ExpeditionType } from '../types/expedition';
import { Radio, AlertOctagon, Info, Eye } from 'lucide-react';

interface RegionalNewsFeedProps {
  newsItems: RegionalNewsItem[];
  locationName: string;
  expeditionType: ExpeditionType;
  theme?: 'dark' | 'light';
}

export const RegionalNewsFeed: React.FC<RegionalNewsFeedProps> = ({
  newsItems,
  locationName,
  expeditionType,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const getCategoryBadge = (cat: RegionalNewsItem['category']) => {
    switch (cat) {
      case 'warning':
        return (
          <span className="text-amber-500 font-bold flex items-center gap-1.5 text-xs uppercase tracking-wide">
            <AlertOctagon className="w-4 h-4" />
            Warning
          </span>
        );
      case 'wildlife':
        return (
          <span className="text-emerald-500 font-bold flex items-center gap-1.5 text-xs uppercase tracking-wide">
            <Eye className="w-4 h-4" />
            Wildlife
          </span>
        );
      case 'trail_condition':
        return (
          <span className="text-blue-500 font-bold flex items-center gap-1.5 text-xs uppercase tracking-wide">
            <Info className="w-4 h-4" />
            Trail Condition
          </span>
        );
      default:
        return (
          <span className="text-slate-500 font-bold flex items-center gap-1.5 text-xs uppercase tracking-wide">
            <Radio className="w-4 h-4" />
            Advisory
          </span>
        );
    }
  };

  return (
    <div className={`rounded-2xl p-6 shadow-lg border transition-colors flex flex-col gap-5 ${
      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-md'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between pb-4 border-b ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <Radio className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <h3 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
            Regional Advisories & Field Bulletin
          </h3>
        </div>
        <span className={`text-xs sm:text-sm font-semibold capitalize ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {expeditionType.replace('_', ' ')}
        </span>
      </div>

      {/* News Feed Stream */}
      <div className="space-y-3.5">
        {newsItems.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-xl border flex flex-col gap-2 transition-colors ${
              isDark
                ? 'bg-slate-950/80 border-slate-800'
                : 'bg-slate-50 border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {getCategoryBadge(item.category)}
              <div className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                <span>{item.source}</span>
                <span className="mx-1.5">·</span>
                <span>{item.date}</span>
              </div>
            </div>

            <h4 className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>
              {item.title}
            </h4>

            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {item.summary}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
