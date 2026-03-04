import {
  AddOrUpdateMilestoneDto,
  MilestoneDto,
  MilestoneStatus,
  UpdateMilestoneDto,
} from "@/types/projectDetail";
import { deleteMilestone, updateMilestone } from "@/services/projectDetailApi";
import { useState } from "react";
import { toast } from "react-toastify";

interface MilestoneItemProps {
  milestone: MilestoneDto;
  projectId: string;
  onMilestoneChanged: () => void;
}

const MilestoneItem: React.FC<MilestoneItemProps> = ({
  milestone,
  projectId,
  onMilestoneChanged,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMilestone, setEditedMilestone] = useState<UpdateMilestoneDto>({
    id: milestone.id,
    name: milestone.name,
    dueDate: milestone.dueDate ? milestone.dueDate.split("T")[0] : "",
    status: milestone.status,
    description: milestone.description || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateMilestone(projectId, milestone.id, editedMilestone);
      toast.success("Milestone updated successfully!");
      setIsEditing(false);
      onMilestoneChanged();
    } catch (err: any) {
      toast.error(`Error updating milestone: ${err.message}`);
      console.error("Error updating milestone:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this milestone?")) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteMilestone(milestone.id);
      toast.success("Milestone deleted successfully!");
      onMilestoneChanged();
    } catch (err: any) {
      toast.error(`Error deleting milestone: ${err.message}`);
      console.error("Error deleting milestone:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const displayDueDate = milestone.dueDate
    ? new Date(milestone.dueDate).toLocaleDateString()
    : "N/A";
  const displayStatus = MilestoneStatus[milestone.status]
    .replace(/([A-Z])/g, " $1")
    .trim();

  if (isEditing) {
    return (
      <li className="p-4 border border-blue-300 rounded-lg bg-blue-50 dark:bg-gray-800 dark:border-gray-600 space-y-2 mb-3">
        <h4 className="text-lg font-semibold text-blue-800 dark:text-white mb-2">
          Edit Milestone
        </h4>
        <form onSubmit={handleEditSave} className="space-y-2">
          <div>
            <label
              htmlFor={`edit-milestone-name-${milestone.id}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name:
            </label>
            <input
              type="text"
              id={`edit-milestone-name-${milestone.id}`}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={editedMilestone.name}
              onChange={(e) =>
                setEditedMilestone({ ...editedMilestone, name: e.target.value })
              }
              required
              disabled={isSaving}
            />
          </div>
          <div>
            <label
              htmlFor={`edit-milestone-dueDate-${milestone.id}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Due Date:
            </label>
            <input
              type="date"
              id={`edit-milestone-dueDate-${milestone.id}`}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={editedMilestone.dueDate}
              onChange={(e) =>
                setEditedMilestone({
                  ...editedMilestone,
                  dueDate: e.target.value,
                })
              }
              required
              disabled={isSaving}
            />
          </div>
          <div>
            <label
              htmlFor={`edit-milestone-status-${milestone.id}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status:
            </label>
            <select
              id={`edit-milestone-status-${milestone.id}`}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={editedMilestone.status}
              onChange={(e) =>
                setEditedMilestone({
                  ...editedMilestone,
                  status: Number(e.target.value) as MilestoneStatus,
                })
              }
              disabled={isSaving}
            >
              {Object.values(MilestoneStatus)
                .filter((value) => typeof value === "number")
                .map((status) => (
                  <option key={status} value={status}>
                    {MilestoneStatus[status].replace(/([A-Z])/g, " $1").trim()}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label
              htmlFor={`edit-milestone-description-${milestone.id}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description (Optional):
            </label>
            <textarea
              id={`edit-milestone-description-${milestone.id}`}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={editedMilestone.description || ""}
              onChange={(e) =>
                setEditedMilestone({
                  ...editedMilestone,
                  description: e.target.value,
                })
              }
              disabled={isSaving}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors duration-200 text-sm"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 text-sm"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-2 last:mb-0">
      <div className="flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-0">
          <strong className="text-gray-800 dark:text-white text-base">
            {milestone.name}
          </strong>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            (Due: {displayDueDate})
          </span>
          <span
            className={`font-medium text-sm px-2 py-0.5 rounded-full
            ${
              milestone.status === MilestoneStatus.Completed
                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                : milestone.status === MilestoneStatus.AtRisk ||
                  milestone.status === MilestoneStatus.Delayed
                ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                : "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
            }`}
          >
            {displayStatus}
          </span>
        </div>
        {milestone.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0 max-w-lg">
            {milestone.description}
          </p>
        )}
      </div>
      <div className="flex space-x-2 mt-2 sm:mt-0 items-center">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 bg-yellow-500 text-white font-medium rounded-md shadow-sm hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 transition-colors duration-200 text-xs"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white font-medium rounded-md shadow-sm hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500 transition-colors duration-200 text-xs"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
};

export default MilestoneItem;


