import Badge from "@/components/ui/Badge";
import { Flag } from "lucide-react";

interface PriorityCardProps {
  priorityCounts: Record<string, number>;
  isLoading?: boolean;
}

const PriorityCard = ({ priorityCounts, isLoading }: PriorityCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-3 text-gray-900 dark:text-gray-100">
        <Flag size={18} />
        <h3 className="font-medium">Priority Breakdown</h3>
      </div>
      <div className="space-y-2">
        {Object.entries(priorityCounts).map(([priority, count]) => (
          <div
            key={priority}
            className="flex items-center justify-between text-gray-900 dark:text-gray-100"
          >
            <span className="text-sm capitalize">{priority}</span>
            <Badge variant="outline">{count}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityCard;


