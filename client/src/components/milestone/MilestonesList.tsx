import {
  AddOrUpdateMilestoneDto,
  MilestoneDto,
  MilestoneStatus,
} from "@/types/projectDetail";
import { addMilestone } from "@/services/projectDetailApi";
import { useState } from "react";
import { toast } from "react-toastify";
import MilestoneItem from "@/components/milestone/MilestoneItem";

const MilestonesList: React.FC<{
  projectId: string;
  milestones: MilestoneDto[] | undefined | null;
  onMilestoneChanged: () => void;
}> = ({ projectId, milestones, onMilestoneChanged }) => {
  const safeMilestones = milestones || [];
  const [showAddMilestoneForm, setShowAddMilestoneForm] = useState(false);
  const [newMilestone, setNewMilestone] = useState<AddOrUpdateMilestoneDto>({
    name: "",
    dueDate: "",
    status: MilestoneStatus.Planned,
    description: "",
    projectId,
  });
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingMilestone(true);
    try {
      const addedMilestone = await addMilestone(projectId, newMilestone);
      toast.success("Milestone added successfully!");
      setNewMilestone({
        name: "",
        dueDate: "",
        status: MilestoneStatus.Planned,
        description: "",
        projectId,
      });
      setShowAddMilestoneForm(false);
      onMilestoneChanged();
    } catch (err: any) {
      toast.error(`Error adding milestone: ${err.message}`);
      console.error("Error adding milestone:", err);
    } finally {
      setIsAddingMilestone(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-4 border border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
        Milestones ({safeMilestones.length})
      </h3>
      <ul className="list-none p-0 space-y-3 mb-4">
        {safeMilestones.length > 0 ? (
          safeMilestones.map((m) => (
            <MilestoneItem
              key={m.id}
              milestone={m}
              projectId={projectId}
              onMilestoneChanged={onMilestoneChanged}
            />
          ))
        ) : (
          <li className="text-gray-600 dark:text-gray-400 italic p-3 text-center">
            No milestones defined. Click "Add New Milestone" to get started.
          </li>
        )}
      </ul>

      {!showAddMilestoneForm ? (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAddMilestoneForm(true)}
            className="px-6 py-2 bg-blue-400 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 text-base"
          >
            Add New Milestone
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleAddMilestone}
          className="mt-4 p-4 border border-blue-200 dark:border-blue-700 rounded-lg bg-blue-50 dark:bg-gray-800 space-y-3"
        >
          <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-400 mb-2">
            Add New Milestone
          </h4>
          <div>
            <label
              htmlFor="new-milestone-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name:
            </label>
            <input
              type="text"
              id="new-milestone-name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={newMilestone.name}
              onChange={(e) =>
                setNewMilestone({ ...newMilestone, name: e.target.value })
              }
              required
              disabled={isAddingMilestone}
            />
          </div>
          <div>
            <label
              htmlFor="new-milestone-dueDate"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Due Date:
            </label>
            <input
              type="date"
              id="new-milestone-dueDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={newMilestone.dueDate}
              onChange={(e) =>
                setNewMilestone({ ...newMilestone, dueDate: e.target.value })
              }
              required
              disabled={isAddingMilestone}
            />
          </div>
          <div>
            <label
              htmlFor="new-milestone-status"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status:
            </label>
            <select
              id="new-milestone-status"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={newMilestone.status}
              onChange={(e) =>
                setNewMilestone({
                  ...newMilestone,
                  status: Number(e.target.value) as MilestoneStatus,
                })
              }
              disabled={isAddingMilestone}
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
              htmlFor="new-milestone-description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description (Optional):
            </label>
            <textarea
              id="new-milestone-description"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm p-2 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={newMilestone.description || ""}
              onChange={(e) =>
                setNewMilestone({
                  ...newMilestone,
                  description: e.target.value,
                })
              }
              disabled={isAddingMilestone}
            ></textarea>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setShowAddMilestoneForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors duration-200 text-sm"
              disabled={isAddingMilestone}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-400 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200 text-sm"
              disabled={isAddingMilestone}
            >
              {isAddingMilestone ? "Adding..." : "Save Milestone"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default MilestonesList;


