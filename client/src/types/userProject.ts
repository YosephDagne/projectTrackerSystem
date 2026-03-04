export interface UserProject
{
    projectId: string,
    projectKey: string,
    projectName: string,
    totalTasksAssigned: number,
    completedTasks: number,
    totalStoryPointsAssigned: number,
    completedStoryPoints:number,
    taskCompletionPercentage:number,
    storyPointCompletionPercentage: number
  }


  export interface ProjectCompletionReport {
  projectId: string;
  projectKey: string;
  projectName: string;
  totalTasksAssigned: number;
  completedTasks: number;
  totalStoryPointsAssigned: number;
  completedStoryPoints: number;
  taskCompletionPercentage: number;
  storyPointCompletionPercentage: number;
}

/* Represents an array of project completion reports. */
export type ProjectCompletionReports = ProjectCompletionReport[];


