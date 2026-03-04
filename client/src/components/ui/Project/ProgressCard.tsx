import Progress from "@/components/ui/Progress";
import { CheckCircle } from "lucide-react";

interface ProgressCardProps {
  progress: {
    totalTasks: number;
    completedTasks: number;
    storyPointsCompleted: number;
    storyPointsTotal: number;
    activeBlockers?: number; // Optional
    recentUpdates?: number; // Optional
  };

  isLoading?: boolean;
}

const ProgressCard = ({ progress, isLoading }: ProgressCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="font-medium mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <CheckCircle size={18} /> Progress
      </h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1 text-gray-900 dark:text-gray-100">
            <span>Tasks</span>
            <span>
              {progress.completedTasks} / {progress.totalTasks}
            </span>
          </div>
          <Progress
            value={(progress.completedTasks / progress.totalTasks) * 100}
            className="h-2"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1 text-gray-900 dark:text-gray-100">
            <span>Story Points</span>
            <span>
              {progress.storyPointsCompleted} / {progress.storyPointsTotal}
            </span>
          </div>
          <Progress
            value={
              (progress.storyPointsCompleted / progress.storyPointsTotal) * 100
            }
            className="h-2"
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;


