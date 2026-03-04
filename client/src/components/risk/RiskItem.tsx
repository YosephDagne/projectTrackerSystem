import {
  RiskDto,
  RiskImpact,
  RiskLikelihood,
  RiskStatus,
  UpdateRiskDto,
} from "@/types/projectDetail";
import { deleteRisk, updateRisk } from "@/services/projectDetailApi";
import { useState } from "react";
import { toast } from "react-toastify";

interface RiskItemProps {
  risk: RiskDto;
  projectId: string;
  onRiskChanged: () => void;
}

const RiskItem: React.FC<RiskItemProps> = ({
  risk,
  projectId,
  onRiskChanged,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRisk, setEditedRisk] = useState<UpdateRiskDto>({
    description: risk.description,
    impact: risk.impact,
    likelihood: risk.likelihood,
    mitigationPlan: risk.mitigationPlan || "",
    status: risk.status,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updateData: UpdateRiskDto = {
        description: editedRisk.description,
        impact: Number(editedRisk.impact),
        likelihood: Number(editedRisk.likelihood),
        mitigationPlan: editedRisk.mitigationPlan,
        status: Number(editedRisk.status),
      };
      await updateRisk(projectId, risk.id, updateData);
      toast.success("Risk updated successfully!");
      setIsEditing(false);
      onRiskChanged();
    } catch (err: any) {
      toast.error(`Error updating risk: ${err.message}`);
      console.error("Error updating risk:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this risk?")) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteRisk(risk.id);
      toast.success("Risk deleted successfully!");
      onRiskChanged();
    } catch (err: any) {
      toast.error(`Error deleting risk: ${err.message}`);
      console.error("Error deleting risk:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const displayImpact = RiskImpact[risk.impact];
  const displayLikelihood = RiskLikelihood[risk.likelihood];
  const displayStatus = RiskStatus[risk.status];

  if (isEditing) {
    return (
      <li className="p-4 border border-red-300 rounded-lg bg-red-50 dark:bg-red-900 dark:border-red-700 space-y-2 mb-3">
        <h4 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Edit Risk
        </h4>
        <form onSubmit={handleEditSave} className="space-y-2">
          <div>
            <label
              htmlFor={`edit-risk-description-${risk.id}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Description:
            </label>
            <textarea
              id={`edit-risk-description-${risk.id}`}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                focus:border-red-500 focus:ring-red-500 text-sm p-2
                dark:bg-red-800 dark:border-red-600 dark:text-red-100
                dark:focus:border-red-400 dark:focus:ring-red-400"
              value={editedRisk.description}
              onChange={(e) =>
                setEditedRisk({ ...editedRisk, description: e.target.value })
              }
              required
              disabled={isSaving}
            ></textarea>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor={`edit-risk-impact-${risk.id}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Impact:
              </label>
              <select
                id={`edit-risk-impact-${risk.id}`}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                  focus:border-red-500 focus:ring-red-500 text-sm p-2
                  dark:bg-red-800 dark:border-red-600 dark:text-red-100
                  dark:focus:border-red-400 dark:focus:ring-red-400"
                value={editedRisk.impact}
                onChange={(e) =>
                  setEditedRisk({
                    ...editedRisk,
                    impact: Number(e.target.value) as RiskImpact,
                  })
                }
                disabled={isSaving}
              >
                {Object.values(RiskImpact)
                  .filter((value) => typeof value === "number")
                  .map((impact) => (
                    <option key={impact} value={impact}>
                      {RiskImpact[impact]}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label
                htmlFor={`edit-risk-likelihood-${risk.id}`}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Likelihood:
              </label>
              <select
                id={`edit-risk-likelihood-${risk.id}`}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                  focus:border-red-500 focus:ring-red-500 text-sm p-2
                  dark:bg-red-800 dark:border-red-600 dark:text-red-100
                  dark:focus:border-red-400 dark:focus:ring-red-400"
                value={editedRisk.likelihood}
                onChange={(e) =>
                  setEditedRisk({
                    ...editedRisk,
                    likelihood: Number(e.target.value) as RiskLikelihood,
                  })
                }
                disabled={isSaving}
              >
                {Object.values(RiskLikelihood)
                  .filter((value) => typeof value === "number")
                  .map((likelihood) => (
                    <option key={likelihood} value={likelihood}>
                      {RiskLikelihood[likelihood]}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor={`edit-risk-mitigationPlan-${risk.id}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Mitigation Plan (Optional):
            </label>
            <textarea
              id={`edit-risk-mitigationPlan-${risk.id}`}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                focus:border-red-500 focus:ring-red-500 text-sm p-2
                dark:bg-red-800 dark:border-red-600 dark:text-red-100
                dark:focus:border-red-400 dark:focus:ring-red-400"
              value={editedRisk.mitigationPlan || ""}
              onChange={(e) =>
                setEditedRisk({ ...editedRisk, mitigationPlan: e.target.value })
              }
              disabled={isSaving}
            ></textarea>
          </div>
          <div>
            <label
              htmlFor={`edit-risk-status-${risk.id}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Status:
            </label>
            <select
              id={`edit-risk-status-${risk.id}`}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                focus:border-red-500 focus:ring-red-500 text-sm p-2
                dark:bg-red-800 dark:border-red-600 dark:text-red-100
                dark:focus:border-red-400 dark:focus:ring-red-400"
              value={editedRisk.status}
              onChange={(e) =>
                setEditedRisk({
                  ...editedRisk,
                  status: Number(e.target.value) as RiskStatus,
                })
              }
              disabled={isSaving}
            >
              {Object.values(RiskStatus)
                .filter((value) => typeof value === "number")
                .map((status) => (
                  <option key={status} value={status}>
                    {RiskStatus[status]}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm
                text-gray-700 hover:bg-gray-100 transition-colors duration-200 text-sm
                dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md
                hover:bg-red-700 transition-colors duration-200 text-sm
                dark:bg-red-700 dark:hover:bg-red-800"
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
    <li
      className="flex flex-col sm:flex-row sm:items-center justify-between p-3
      bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700
      mb-2 last:mb-0"
    >
      <div className="flex-grow">
        <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-0">
          <strong className="text-gray-800 dark:text-gray-200 text-base">
            {risk.description}
          </strong>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            (Impact: {displayImpact}, Likelihood: {displayLikelihood})
          </span>
          <span
            className={`font-medium text-sm px-2 py-0.5 rounded-full
            ${
              risk.status === RiskStatus.Closed
                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-300"
                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-300"
            }`}
          >
            {displayStatus}
          </span>
        </div>
        {risk.mitigationPlan && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-0 max-w-lg">
            Mitigation: {risk.mitigationPlan}
          </p>
        )}
      </div>
      <div className="flex space-x-2 mt-2 sm:mt-0 items-center">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 bg-yellow-500 text-white font-medium rounded-md shadow-sm
            hover:bg-yellow-600 transition-colors duration-200 text-xs
            dark:bg-yellow-600 dark:hover:bg-yellow-700"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white font-medium rounded-md shadow-sm
            hover:bg-red-600 transition-colors duration-200 text-xs
            dark:bg-red-600 dark:hover:bg-red-700"
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </li>
  );
};

export default RiskItem;


