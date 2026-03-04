import axios from "axios";

export const TASK_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL ??
  "http://localhost:5106/api/Project/task";

export interface ApiTask {
  key: string;
  title: string;
  description: string | null;
  status: string;
  assigneeId: string;
  assigneeName: string;
  createdDate: string;
  updatedDate: string;
  dueDate: string | null;
  storyPoints: number;
  priority?: string;
}

export type TaskDto = {
  Key: string;
  Title: string;
  Description: string | null;
  Status: string;
  AssigneeId: string;
  AssigneeName: string;
  CreatedDate: string;
  UpdatedDate: string;
  DueDate: string | null;
  StoryPoints: number;
  Priority?: string;
};

const mapApiToTaskDto = (api: ApiTask): TaskDto => ({
  Key: api.key,
  Title: api.title,
  Description: api.description,
  Status: api.status,
  AssigneeId: api.assigneeId,
  AssigneeName: api.assigneeName,
  CreatedDate: api.createdDate,
  UpdatedDate: api.updatedDate,
  DueDate: api.dueDate,
  StoryPoints: api.storyPoints,
  Priority: api.priority,
});

export const fetchTasksByProject = async (
  projectId: string
): Promise<TaskDto[]> => {
  try {
    const url = `${TASK_API_URL}/${projectId}`;
    const { data, status } = await axios.get<ApiTask[]>(url, {
      timeout: 5000,
      validateStatus: (status) => status < 500,
    });

    if (status !== 200 || !Array.isArray(data)) {
      throw new Error("Failed to fetch tasks");
    }

    return data.map(mapApiToTaskDto);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw new Error(
      `Failed to fetch tasks: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};


