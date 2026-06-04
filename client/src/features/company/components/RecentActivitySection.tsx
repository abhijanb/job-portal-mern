import type { Application } from "../../../shared/types";
import { timeAgo } from "../../../shared/utils/format";

interface Props {
  recentApps: Application[];
}

export default function RecentActivitySection({ recentApps }: Props) {
  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30">
      <h3 className="text-xl font-bold text-primary mb-6">Recent Activity</h3>
      <div className="space-y-6">
        {recentApps.length > 0 ? (
          recentApps.map((app, i) => (
            <div key={app.id} className="flex gap-4">
              <div className="relative">
                <div className="w-2 h-2 bg-secondary rounded-full absolute top-1.5" />
                {i < recentApps.length - 1 && (
                  <div className="h-full w-px bg-outline-variant ml-px" />
                )}
              </div>
              <div>
                <p className="text-base text-on-background">
                  <strong>{app.user?.name ?? "Someone"}</strong> applied for{" "}
                  <strong>{app.job?.title ?? "a position"}</strong>
                </p>
                <span className="text-xs text-on-surface-variant">
                  {timeAgo(app.createdAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-on-surface-variant">No recent activity.</p>
        )}
      </div>
    </div>
  );
}
