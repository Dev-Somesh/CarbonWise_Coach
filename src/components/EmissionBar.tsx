import React, { type ReactNode } from 'react';

export interface EmissionBarProps {
  label: string;
  trailing: ReactNode;
  widthPercent: number;
  dotClassName: string;
  barClassName: string;
  className?: string;
  description?: ReactNode;
  id?: string;
}

/** Shared horizontal bar used across dashboard category and benchmark comparisons. */
export default function EmissionBar({
  label,
  trailing,
  widthPercent,
  dotClassName,
  barClassName,
  className = '',
  description,
  id,
}: EmissionBarProps) {
  const clampedWidth = Math.min(100, Math.max(0, widthPercent));

  return (
    <div className={className} id={id}>
      <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-1.5 gap-2">
        <span className="flex items-center gap-1.5 min-w-0">
          <span className={`w-2.5 h-2.5 shrink-0 rounded-full ${dotClassName}`} aria-hidden="true" />
          <span className="truncate">{label}</span>
        </span>
        <span className="shrink-0 text-right">{trailing}</span>
      </div>
      <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden border border-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barClassName}`}
          style={{ width: `${clampedWidth}%` }}
          role="progressbar"
          aria-valuenow={Math.round(clampedWidth)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
      {description ? (
        <p className="text-[10px] text-slate-400 leading-normal mt-1.5 font-medium">{description}</p>
      ) : null}
    </div>
  );
}
