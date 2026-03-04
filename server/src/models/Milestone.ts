import { MilestoneStatus } from '../types/enums.js';

export interface Milestone {
    id: string;
    name: string;
    dueDate: Date;
    status: MilestoneStatus;
    description?: string;
    projectId: string;
}
