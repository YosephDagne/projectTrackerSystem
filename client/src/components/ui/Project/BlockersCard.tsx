import Badge from "@/components/ui/Badge";
import { AlertCircle } from "lucide-react";

interface BlockersCardProps {
  activeBlockers: number;
  recentUpdates: number;
  overdueTasks: number;
  isLoading?: boolean;
}

const BlockersCard = ({
  activeBlockers,
  recentUpdates,
  overdueTasks,
  isLoading,
}: BlockersCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="font-medium mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <AlertCircle size={18} /> Blockers & Updates
      </h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center text-gray-900 dark:text-gray-100">
            <span className="text-sm">Active Blockers</span>
            <Badge variant={activeBlockers > 0 ? "destructive" : "default"}>
              {activeBlockers}
            </Badge>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center text-gray-900 dark:text-gray-100">
            <span className="text-sm">Recent Updates</span>
            <Badge variant="outline">{recentUpdates}</Badge>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center text-gray-900 dark:text-gray-100">
            <span className="text-sm">Overdue Tasks</span>
            <Badge variant={overdueTasks > 0 ? "destructive" : "default"}>
              {overdueTasks}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockersCard;


