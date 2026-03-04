import api from "@/lib/api";

export const PROJECT_API_URL =
  process.env.NEXT_PUBLIC_BASE_API_URL ?? "http://127.0.0.1:5000";


export interface PagedList<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ProjectFilterDto {
  pageNumber?: number;
  pageSize?: number;
  SortBy?: string;
  SortDescending?: boolean
  SearchTerm?: string;
  HealthLevel?: string;
  IsCritical?: boolean;
  Status?: string;

}

export interface ApiProject {
  id: string;
  key: string;
  name: string;
  description: string;
  lead: string;
  health: {
    level: string;
    reason: string;
    score: number;
  };
  progress: {
    totalTasks: number;
    completedTasks: number;
    onTrackPercentage: number;
  };
  owner?: {
    name: string;
    contactInfo?: string;
  };
  targetEndDate?: string;
  status?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type ProjectDto = {
  Id: string;
  Key: string;
  Name: string;
  Description: string;
  Lead: string;
  Status?: string;
  TargetEndDate?: string;
  ProjectOwner?: {
    Name?: string;
    ContactInfo?: string;
  };
  Health: {
    Level: string;
    Reason: string;
    Score: number;
  };
  Progress: {
    TotalTasks: number;
    CompletedTasks: number;
    OnTrackPercentage: number;
  };
};


const mapApiToProjectDto = (api: ApiProject): ProjectDto => ({
  Id: api.id,
  Key: api.key,
  Name: api.name,
  Description: api.description,
  Lead: api.lead,
  Health: {
    Level: api.health.level,
    Reason: api.health.reason,
    Score: api.health.score,
  },
  Progress: {
    TotalTasks: api.progress.totalTasks,
    CompletedTasks: api.progress.completedTasks,
    OnTrackPercentage: api.progress.onTrackPercentage,
  },
  ProjectOwner: {
    Name: api.owner?.name,
    ContactInfo: api.owner?.contactInfo,
  },
  TargetEndDate: api.targetEndDate ? new Date(api.targetEndDate).toISOString() : undefined,
  Status: api.status,
});


export const fetchProjects = async (
  filter: ProjectFilterDto
): Promise<PagedList<ProjectDto>> => {
  try {
    const response = await api.get<ApiResponse<ApiProject[]>>("/projects", {
      params: filter,
    });

    const data = response.data.data;

    // Determine if data is a paged object or a plain array
    let itemsArray: ApiProject[] = [];
    let pagedInfo = {
      totalCount: 0,
      pageNumber: 1,
      pageSize: 0,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    };

    if (Array.isArray(data)) {
      // Plain array response
      itemsArray = data;
      pagedInfo.totalCount = data.length;
      pagedInfo.pageSize = data.length;
    } else if (data && Array.isArray((data as any).items)) {
      // Paged response
      const paged = data as any;
      itemsArray = paged.items;
      pagedInfo = {
        totalCount: paged.totalCount,
        pageNumber: paged.pageNumber,
        pageSize: paged.pageSize,
        totalPages: paged.totalPages,
        hasPreviousPage: paged.hasPreviousPage,
        hasNextPage: paged.hasNextPage,
      };
    } else {
      itemsArray = [];
    }

    return {
      items: itemsArray.map(mapApiToProjectDto),
      ...pagedInfo,
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      items: [],
      totalCount: 0,
      pageNumber: filter.pageNumber ?? 1,
      pageSize: filter.pageSize ?? 10,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    };
  }
};



export const fetchProjectById = async (
  projectId: string
): Promise<ProjectDto> => {
  try {
    const url = `/projects/${projectId}`;
    const response = await api.get<ApiResponse<ApiProject>>(url);

    if (!response.data.success) {
      throw new Error("API request was not successful");
    }

    const projectApi = response.data.data;

    if (!projectApi) {
      throw new Error("No project data received");
    }

    return mapApiToProjectDto(projectApi);
  } catch (error) {
    console.error(`Error fetching project ${projectId}:`, error);
    throw new Error(
      `Failed to fetch project: ${error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};


