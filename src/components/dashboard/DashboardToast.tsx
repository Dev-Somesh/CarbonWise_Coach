import { CheckCircle2 } from 'lucide-react';

export interface DashboardToastProps {
  message: string;
}

export default function DashboardToast({ message }: DashboardToastProps) {
  return (
    <div aria-live="polite" aria-atomic="true" className="fixed bottom-6 right-6 z-50 pointer-events-none">
      {message && (
        <div
          className="bg-slate-900 border border-slate-800 text-white px-5 py-4 rounded-2xl flex items-center gap-3 shadow-2xl animate-slide-up max-w-sm pointer-events-auto"
          role="status"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" aria-hidden="true" />
          <span className="text-sm font-medium">{message}</span>
        </div>
      )}
    </div>
  );
}
