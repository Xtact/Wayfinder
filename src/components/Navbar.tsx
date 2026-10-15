import React from 'react';
import { Compass, Printer, Edit3, ShieldAlert, LayoutDashboard, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  currentView: 'dashboard' | 'onboarding';
  onNavigate: (view: 'dashboard' | 'onboarding') => void;
  onOpenPrint: () => void;
  expeditionName: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenPrint,
  expeditionName,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
      isDark
        ? 'bg-slate-950/95 border-slate-800 text-white'
        : 'bg-white/95 border-slate-300 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark (Single element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isDark
              ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400'
              : 'bg-emerald-100 border border-emerald-400 text-emerald-800'
          }`}>
            <Compass className="w-6 h-6" />
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-left group cursor-pointer"
          >
            <span className={`text-xl font-black tracking-tight transition-colors ${
              isDark ? 'text-white group-hover:text-emerald-400' : 'text-slate-950 group-hover:text-emerald-700'
            }`}>
              WAYFINDER
            </span>
            <span className={`hidden sm:inline-block ml-2 text-xs font-semibold ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              · Expedition Safety
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line unboxed text with hover underline) */}
        <nav className="hidden md:flex items-center gap-8 text-base font-semibold">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              currentView === 'dashboard'
                ? isDark ? 'text-emerald-400 font-bold' : 'text-emerald-700 font-bold border-b-2 border-emerald-600 pb-0.5'
                : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <LayoutDashboard className="w-4.5 h-4.5" />
            Field Dashboard
          </button>

          <button
            onClick={() => onNavigate('onboarding')}
            className={`whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              currentView === 'onboarding'
                ? isDark ? 'text-emerald-400 font-bold' : 'text-emerald-700 font-bold border-b-2 border-emerald-600 pb-0.5'
                : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
            }`}
          >
            <Edit3 className="w-4.5 h-4.5" />
            Edit Briefing
          </button>

          <a
            href="#emergency-section"
            className={`transition-colors whitespace-nowrap flex items-center gap-2 ${
              isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-950'
            }`}
            onClick={(e) => {
              if (currentView !== 'dashboard') {
                e.preventDefault();
                onNavigate('dashboard');
                setTimeout(() => {
                  document.getElementById('emergency-section')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
          >
            <ShieldAlert className="w-4.5 h-4.5 text-amber-500" />
            SAR & ICE Contacts
          </a>
        </nav>

        {/* Zone 3: Light/Dark Mode Toggle & Primary Action (Near Top Right) */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
              isDark
                ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800 hover:border-amber-400/50 shadow-sm'
                : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200 hover:text-slate-950 shadow-sm'
            }`}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-300 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-5 h-5 text-slate-800 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Primary Action: Emergency Manifest */}
          <button
            onClick={onOpenPrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl text-slate-950 bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 transition-all whitespace-nowrap shadow-md shadow-emerald-500/20 cursor-pointer"
            title="Generate Emergency Plan Sheet for Search & Rescue and Vehicle Dashboard"
          >
            <Printer className="w-4.5 h-4.5" />
            <span>Emergency Manifest</span>
          </button>

        </div>

      </div>
    </header>
  );
};
