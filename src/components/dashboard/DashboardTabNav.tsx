import { DASHBOARD_TABS } from './constants';
import type { DashboardTab } from '../../domain/dashboardTypes';

interface DashboardTabNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

export default function DashboardTabNav({ activeTab, onTabChange }: DashboardTabNavProps) {
  return (
    <nav
      className="sticky top-0 z-20 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-white/95 backdrop-blur-md border-y border-slate-200/60 sm:rounded-2xl sm:border"
      aria-label="Dashboard sections"
    >
      <div role="tablist" className="flex gap-1 overflow-x-auto max-w-full">
        {DASHBOARD_TABS.map(({ id, label, icon: Icon, hint }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              role="tab"
              type="button"
              id={`dashboard-tab-${id}`}
              aria-selected={isActive}
              aria-controls={`dashboard-panel-${id}`}
              title={hint}
              onClick={() => onTabChange(id)}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
