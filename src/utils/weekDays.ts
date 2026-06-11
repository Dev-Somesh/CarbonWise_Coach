export interface WeekDay {
  name: string;
  dateStr: string;
  display: string;
}

/** Monday–Sunday dates for the current calendar week. */
export function getCurrentWeekDays(): WeekDay[] {
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) + i;
    const itemDate = new Date(d.setDate(diff));
    return {
      name: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][i],
      dateStr: itemDate.toISOString().split('T')[0],
      display: itemDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    };
  });
}
