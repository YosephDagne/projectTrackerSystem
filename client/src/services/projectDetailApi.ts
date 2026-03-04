import { OverallProjectStatus, ProjectDetailDto, ApiResponse, UpdateProjectStrategicDetailsDto, AddOrUpdateMilestoneDto, MilestoneDto, UpdateMilestoneDto, AddRiskDto, UpdateRiskDto, AddOrUpdateRiskDto } from "@/types/projectDetail";
import axios from "axios";
import api from "@/lib/api";

export const getProjectDetails = async (projectId: string): Promise<ProjectDetailDto | null> => {
  try {
    const response = await api.get<ApiResponse<ProjectDetailDto>>(`/projects/Detail/${projectId}`);
    return response.data.data || null; // Return the project details from data field   
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || error.response.data.title || 'Failed to fetch project details from API.');
    }
    throw new Error('An unexpected error occurred while fetching project details.');
  }
};

/**
 * Updates the strategic details of a project via the backend API.
 * @param projectId The ID of the project to update.
 * @param data The partial data containing the updated details.
 */
export const updateProjectStrategicDetails = async (
  projectId: string,
  data: UpdateProjectStrategicDetailsDto
): Promise<void> => {
  try {
    await api.put(
      `/projects/Detail/${projectId}`,
      data
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message ||
        error.response.data.title ||
        'Failed to update project strategic details via API.'
      );
    }
    throw new Error('An unexpected error occurred while updating project strategic details.');
  }
};

//Milestones API
const MILESTONES_API_PATH = '/api/projects';

export const addMilestone = async (
  projectId: string,
  data: AddOrUpdateMilestoneDto
): Promise<void> => {
  try {
    const url = `/projects/${projectId}/milestones`;

    await api.post(url, data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.message ||
        error.response.data.title ||
        'Failed to add milestone via API.'
      );
    }
    throw new Error('An unexpected error occurred while adding milestone.');
  }
};


export const updateMilestone = async (
  projectId: string, id: string, data: UpdateMilestoneDto): Promise<void> => {
  try {
    const url = `/projects/milestones/${id}`;

    const response = await api.put(url, data);

    if (!response.data?.success) {
      const errors = response.data?.errors?.join(", ") || "Unknown error";
      throw new Error(`Failed to update milestone: ${errors}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.errors?.join(", ") ||
        error.response.data?.title ||
        "Failed to update milestone via API."
      );
    }
    throw new Error("An unexpected error occurred while updating the milestone.");
  }
};

export const deleteMilestone = async (
  milestoneId: string
): Promise<void> => {
  try {
    const url = `/projects/milestones/${milestoneId}`;

    const response = await api.delete(url);

    if (!response.data?.success) {
      const errors = response.data?.errors?.join(", ") || "Unknown error";
      throw new Error(`Failed to delete milestone: ${errors}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.errors?.join(", ") ||
        error.response.data?.title ||
        "Failed to delete milestone via API."
      );
    }
    throw new Error("An unexpected error occurred while deleting the milestone.");
  }
};


export const addRisk = async (projectId: string, data: AddRiskDto): Promise<void> => {
  try {
    const url = `/projects/${data.projectId}/risks`;
    const response = await api.post(url, data);

    if (!response.data?.success) {
      const errors = response.data?.errors?.join(", ") || "Unknown error";
      throw new Error(`Failed to add risk: ${errors}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.errors?.join(", ") ||
        error.response.data?.title ||
        "Failed to add risk via API."
      );
    }
    throw new Error("An unexpected error occurred while adding risk.");
  }
};


export const updateRisk = async (
  projectId: string,
  riskId: string,
  data: UpdateRiskDto
): Promise<void> => {
  try {
    const url = `/projects/risks/${riskId}`;
    const response = await api.put(url, data);

    if (!response.data?.success) {
      const errors = extractErrorMessages(response.data.errors);
      throw new Error(`Failed to update risk: ${errors}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;

      const message =
        extractErrorMessages(errorData.errors) ||
        errorData.title ||
        "Failed to update risk via API.";

      throw new Error(message);
    }

    throw new Error("An unexpected error occurred while updating risk.");
  }
};

function extractErrorMessages(errors: any): string {
  if (Array.isArray(errors)) {
    return errors.join(", ");
  }

  if (typeof errors === "string") {
    return errors;
  }

  if (typeof errors === "object") {
    return Object.entries(errors)
      .map(([key, value]) =>
        Array.isArray(value) ? `${key}: ${value.join(", ")}` : `${key}: ${value}`
      )
      .join(" | ");
  }

  return "Unknown error format.";
}


export const deleteRisk = async (

  riskId: string
): Promise<void> => {
  try {
    const url = `/projects/risks/${riskId}`;
    const response = await api.delete(url);

    if (!response.data?.success) {
      const errors = response.data?.errors?.join(", ") || "Unknown error";
      throw new Error(`Failed to delete risk: ${errors}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data?.errors?.join(", ") ||
        error.response.data?.title ||
        "Failed to delete risk via API."
      );
    }
    throw new Error("An unexpected error occurred while deleting risk.");
  }
};


