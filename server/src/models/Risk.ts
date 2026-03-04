import mongoose, { Schema, Document } from 'mongoose';
import { MilestoneStatus, RiskImpact, RiskLikelihood, RiskStatus } from '../types/enums.js';

export interface IMilestone extends Document {
    name: string;
    dueDate: Date;
    status: MilestoneStatus;
    description?: string;
    projectId: string;
}

const milestoneSchema = new Schema<IMilestone>({
    name: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: Object.values(MilestoneStatus), default: MilestoneStatus.Planned },
    description: { type: String },
    projectId: { type: String, required: true },
}, { timestamps: true });

export const Milestone = mongoose.model<IMilestone>('Milestone', milestoneSchema);

export interface IRisk extends Document {
    description: string;
    impact: RiskImpact;
    likelihood: RiskLikelihood;
    mitigationPlan?: string;
    status: RiskStatus;
    projectId: string;
}

const riskSchema = new Schema<IRisk>({
    description: { type: String, required: true },
    impact: { type: String, enum: Object.values(RiskImpact), default: RiskImpact.Medium },
    likelihood: { type: String, enum: Object.values(RiskLikelihood), default: RiskLikelihood.Medium },
    mitigationPlan: { type: String },
    status: { type: String, enum: Object.values(RiskStatus), default: RiskStatus.Open },
    projectId: { type: String, required: true },
}, { timestamps: true });

export const Risk = mongoose.model<IRisk>('Risk', riskSchema);
