import {
  FolderKanban,
  Users,
  ChevronLeft,
  Edit,
  AlertTriangle,
} from "lucide-react";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

interface ProjectHeaderProps {
  project: {
    Key: string;
    Name: string;
    Description: string;
    Lead: string;
    Critical: boolean;
  };
  onBack?: () => void;
  onEdit?: () => void;
}

const ProjectHeader = ({ project, onBack, onEdit }: ProjectHeaderProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700 transition-all">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
            <FolderKanban
              className="text-blue-600 dark:text-blue-400"
              size={24}
            />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {project.Name}
              </h1>
              <Badge variant="outline" className="text-sm">
                {project.Key}
              </Badge>
              {project.Critical && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1 text-xs"
                >
                  <AlertTriangle size={14} /> Critical
                </Badge>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {project.Description}
            </p>
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <Users size={14} className="mr-1" />
              <span>
                Lead:{" "}
                <strong className="text-gray-700 dark:text-gray-200">
                  {project.Lead}
                </strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <button
            onClick={onBack}
            className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Projects
          </button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={onEdit}
          >
            <Edit size={14} /> Edit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;


