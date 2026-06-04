interface Props {
  total: number;
  newToday: number;
  interviewing: number;
}

export default function ApplicationStatsCards({ total, newToday, interviewing }: Props) {
  return (
    <div className="md:col-span-5 grid grid-cols-3 gap-3">
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center text-center">
        <span className="text-xs text-on-surface-variant font-medium uppercase mb-1">Total</span>
        <span className="text-3xl font-bold text-primary">{total}</span>
        <span className="text-green-600 text-xs font-medium flex items-center gap-0.5 mt-1">
          Applicants
        </span>
      </div>
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center text-center">
        <span className="text-xs text-on-surface-variant font-medium uppercase mb-1">New Today</span>
        <span className="text-3xl font-bold text-secondary">{newToday}</span>
        <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-1.5 py-0.5 rounded text-[10px] font-semibold mt-1 uppercase">
          Action
        </span>
      </div>
      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col items-center justify-center text-center">
        <span className="text-xs text-on-surface-variant font-medium uppercase mb-1">Interview</span>
        <span className="text-3xl font-bold text-primary">{interviewing}</span>
        <span className="text-xs text-on-surface-variant italic mt-1">Stage 2 & 3</span>
      </div>
    </div>
  );
}
