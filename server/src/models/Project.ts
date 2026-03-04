import mongoose, { Schema, Document } from 'mongoose';
import { HealthLevel, OverallProjectStatus } from '../types/enums.js';

export interface IProject extends Document {
    key: string;
    name: string;
    description?: string;
    lead?: string;
    health: {
        level: HealthLevel;
        score: number;
        status: string;
    };
    progress: {
        onTrackPercentage: number;
        completedTasks: number;
        totalTasks: number;
    };
    overallProjectStatus: OverallProjectStatus;
    executiveSummary?: string;
    owner?: {
        name: string;
        contactInfo?: string;
    };
    projectStartDate?: Date;
    targetEndDate?: Date;
    milestones: string[];
    risks: string[];
    tasks: string[];
    syncHistory: string[];
}

const projectSchema = new Schema<IProject>({
    key: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    lead: { type: String },
    health: {
        level: { type: String, enum: Object.values(HealthLevel), default: HealthLevel.Good },
        score: { type: Number, default: 0 },
        status: { type: String, default: 'Unknown' },
    },
    progress: {
        onTrackPercentage: { type: Number, default: 0 },
        completedTasks: { type: Number, default: 0 },
        totalTasks: { type: Number, default: 0 },
    },
    overallProjectStatus: { type: String, enum: Object.values(OverallProjectStatus), default: OverallProjectStatus.Active },
    executiveSummary: { type: String },
    owner: {
        name: { type: String },
        contactInfo: { type: String },
    },
    projectStartDate: { type: Date },
    targetEndDate: { type: Date },
    milestones: [{ type: String }],
    risks: [{ type: String }],
    tasks: [{ type: String }],
    syncHistory: [{ type: String }],
}, { timestamps: true });

export const Project = mongoose.model<IProject>('Project', projectSchema);
