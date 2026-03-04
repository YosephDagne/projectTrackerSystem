import { Gauge } from "lucide-react";
import Progress from "../ui/Progress";
import Badge from "../ui/Badge";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../ui/Collapsible";

interface HealthCardProps {
  health: {
    Level: number;
    Reason: string;
    Score: number;
    Confidence: string;
  };
  isLoading?: boolean;
}

const getHealthVariant = (level: number) => {
  switch (level) {
    case 1:
      return "success";
    case 2:
      return "warning";
    case 3:
      return "destructive";
    default:
      return "default";
  }
};

const getHealthStatusText = (level: number) => {
  switch (level) {
    case 1:
      return "On Track";
    case 2:
      return "Needs Attention";
    case 3:
      return "Critical";
    default:
      return "Unknown";
  }
};

const HealthCard = ({ health, isLoading }: HealthCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 animate-pulse space-y-4">
        <div className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800 dark:text-white">
          <Gauge size={20} /> Project Condition
        </h3>
        <Badge variant={getHealthVariant(health.Level)}>
          {getHealthStatusText(health.Level)}
        </Badge>
      </div>

      <Progress value={health.Score * 100} className="h-2 rounded-full mb-3" />

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
        Confidence: <span className="font-semibold">{health.Confidence}</span>
      </p>

      <Collapsible>
        <CollapsibleTrigger className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View Reason
        </CollapsibleTrigger>
        <CollapsibleContent className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
          {health.Reason}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default HealthCard;


