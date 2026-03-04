export interface SprintReport { 
 id: string;
 name: string;
 state: string;
}


export interface ProjectSprintOverviewResponse {
  projectKey: string;
  projectName: string;
  sprints: SprintReport[]; 
}

export interface SprintReportDetail {
  id: string | null;
  jiraId: number | null;
  name: string | null;
  state: "closed" | "active" | "future"; 
  startDate: string | null; 
  endDate: string | null; 
  completeDate: string | null; 
  goal: string | null;
  boardName: string | null;
  totalStoryPoints: number | null;
  completedStoryPoints: number | null;
  storyPointCompletionPercentage: number | null;
  totalTasks: number | null;
  completedTasks: number | null;
  taskCompletionPercentage: number | null;
  activeBlockers: number | null;
  overdueTasks: number | null;
  bugsCreatedThisSprint: number | null;
  tasksMovedFromPreviousSprint: number | null;
  taskStatusCounts: {
    [key: string]: number ; 
  };
  issueTypeCounts: {
    [key: string]: number ; 
  };
  developerWorkloads: DeveloperWorkload[];
  recentActivities: RecentActivity[];
  tasksInSprint: TaskInSprint[];
}

export interface DeveloperWorkload {
  assigneeId: string | null;
  assigneeName: string;
  estimatedWork: number | null;
  completedWork: number | null;
  taskStatusBreakdown: {
    [key: string]: number | null; 
  };
}

 export interface RecentActivity {
  taskKey: string | null;
  description: string | null;
  changedBy: string | null;
  timestamp: string ; 
}

 export interface TaskInSprint {
  key: string | null;
  title: string | null;
  description: string | null;
  status: string | null;
  statusCategory: string | null;
  assigneeId: string | null; 
  assigneeName: string | null; 
  createdDate: string | null; 
  updatedDate: string | null; 
  dueDate: string | null; 
  storyPoints: number | null; 
  timeEstimateMinutes: number | null; 
  issueType: string | null;
  epicKey: string | null; 
  parentKey: string | null; 
  labels: string[] | null; 
  priority: string | null;
  currentSprintJiraId: number | null; 
  currentSprintName: string | null; 
  currentSprintState: string | null; 
}


