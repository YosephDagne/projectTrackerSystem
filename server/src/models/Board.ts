import mongoose, { Schema, Document } from 'mongoose';

export interface IBoard extends Document {
    jiraId: number;
    name: string;
    type: string;
    projectId: string;
}

const boardSchema = new Schema<IBoard>({
    jiraId: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    projectId: { type: String, required: true },
}, { timestamps: true });

export const Board = mongoose.model<IBoard>('Board', boardSchema);

export interface ISprint extends Document {
    jiraId: number;
    boardId: string; // Linking to Board ID
    name: string;
    state: string;
    startDate?: Date;
    endDate?: Date;
    completeDate?: Date;
    goal?: string;
}

const sprintSchema = new Schema<ISprint>({
    jiraId: { type: Number, required: true, unique: true },
    boardId: { type: String, required: true },
    name: { type: String, required: true },
    state: { type: String, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    completeDate: { type: Date },
    goal: { type: String },
}, { timestamps: true });

export const Sprint = mongoose.model<ISprint>('Sprint', sprintSchema);
