import axios from "axios";
import { SprintReportDetail } from "@/types/sprint";


const SPRINT_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://localhost:5000";

export const fetchSprintsForBoard = async (boardId: number): Promise<any[]> => {
  try {
    const response = await axios.get<any>(`${SPRINT_API_URL}/api/jira/boards/${boardId}/sprints`);

    if (!response.data.success) throw new Error(response.data.message || "Failed to fetch sprints");
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching sprints for board ${boardId}:`, error);
    throw error;
  }
};

export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
  } catch (err) {
    return "Invalid Date";
  }
};

export const formatDateTime = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
  } catch (err) {
    return "Invalid Date";
  }
};


