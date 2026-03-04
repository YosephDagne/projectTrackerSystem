
export enum OverallProjectStatus {
  NotStarted = 'NotStarted',
  Active = 'Active',
  OnHold = 'OnHold',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Archived = 'Archived',
}

export enum MilestoneStatus {
  Planned = 'Planned',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Delayed = 'Delayed',
}

export interface UpdateMilestoneDto {
  id: string;
  name: string;
  dueDate: string;
  status: MilestoneStatus;
  description: string;
}

export interface AddOrUpdateMilestoneDto {
  name: string;
  dueDate: string;
  status: MilestoneStatus;
  description: string;
  projectId: string;
}

export interface ProjectDetailDto {
  id: string;
  key: string;
  name: string;
  description: string | null;
  lead: string | null;
  health: {
    level: string;
    score: number;
    status: string;
  };
  progress: {
    totalTasks: number;
    completedTasks: number;
    onTrackPercentage: number;
  };
  overallProjectStatus: OverallProjectStatus;
  executiveSummary: string | null;
  owner: {
    name: string | null;
    contactInfo: string | null;
  } | null;
  projectStartDate: string | null;
  targetEndDate: string | null;
  milestones: MilestoneDto[];
  risks: RiskDto[];
}

export interface MilestoneDto {
  id: string;
  name: string;
  dueDate: string;
  status: MilestoneStatus;
  description: string | null;
  projectId: string;
}

export interface RiskDto {
  id: string;
  description: string;
  impact: RiskImpact;
  likelihood: RiskLikelihood;
  mitigationPlan: string | null;
  status: RiskStatus;
  projectId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface UpdateProjectStrategicDetailsDto {
  overallStatus: OverallProjectStatus;
  executiveSummary: string | null;
  ownerName: string | null;
  ownerContact: string | null;
  projectStartDate: string | null;
  targetEndDate: string | null;
}

export enum RiskImpact {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export enum RiskLikelihood {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  AlmostCertain = 'AlmostCertain',
}

export enum RiskStatus {
  Open = 'Open',
  Mitigated = 'Mitigated',
  Closed = 'Closed',
}

export interface AddRiskDto {
  projectId: string;
  description: string;
  impact: RiskImpact;
  likelihood: RiskLikelihood;
  mitigationPlan: string;
  status: RiskStatus;
}

export interface UpdateRiskDto {
  description: string;
  impact: RiskImpact;
  likelihood: RiskLikelihood;
  mitigationPlan: string;
  status: RiskStatus;
}

export interface AddOrUpdateRiskDto {
  description: string;
  impact: RiskImpact;
  likelihood: RiskLikelihood;
  mitigationPlan: string | null;
  status: RiskStatus;
  projectId: string;
}


