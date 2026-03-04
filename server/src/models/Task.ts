import mongoose, { Schema, Document } from 'mongoose';
import { TaskStatus } from '../types/enums.js';

export interface ITask extends Document {
    key: string; // Jira Key
    summary: string;
    description?: string;
    status: TaskStatus;
    statusChangedDate: Date;
    dueDate?: Date;
    createdDate: Date;
    updatedDate: Date; // Jira's timestamp
    updated: Date;      // Local timestamp
    priority?: string;
    projectId: string; // Linking to Project.key or ID
    assigneeId?: string;
    assigneeName?: string;
    issueType: string;
    epicKey?: string;
    parentKey?: string;
    sprintId?: string;
    jiraSprintId?: number;
    currentSprintName?: string;
    currentSprintState?: string;
    storyPoints?: number;
    timeEstimateMinutes?: number;
}

const taskSchema = new Schema<ITask>({
    key: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.ToDo },
    statusChangedDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    priority: { type: String },
    projectId: { type: String, required: true },
    assigneeId: { type: String },
    assigneeName: { type: String },
    issueType: { type: String, default: 'Task' },
    epicKey: { type: String },
    parentKey: { type: String },
    sprintId: { type: String },
    jiraSprintId: { type: Number },
    currentSprintName: { type: String },
    currentSprintState: { type: String },
    storyPoints: { type: Number },
    timeEstimateMinutes: { type: Number },
}, { timestamps: true });

export default mongoose.model<ITask>('Task', taskSchema);
