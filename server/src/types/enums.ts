export enum UserSource {
  Local = 'LOCAL',
  Jira = 'JIRA',
}

export enum TaskStatus {
  ToDo = 'ToDo',
  InProgress = 'InProgress',
  Done = 'Done',
  Blocked = 'Blocked',
}

export enum HealthLevel {
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor',
  Critical = 'Critical',
}

export enum MilestoneStatus {
  Planned = 'Planned',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Delayed = 'Delayed',
}

export enum OverallProjectStatus {
  Active = 'Active',
  OnHold = 'OnHold',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
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
  Closed = 'Closed',
  Mitigated = 'Mitigated',
}

