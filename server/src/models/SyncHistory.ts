import mongoose, { Schema, Document } from 'mongoose';

export interface ISyncHistory extends Document {
    projectKey: string;
    syncTime: Date;
    status: string; // 'Success', 'Failed'
    details?: string;
    source: string; // 'Jira', 'Local'
}

const syncHistorySchema = new Schema<ISyncHistory>({
    projectKey: { type: String, required: true },
    syncTime: { type: Date, default: Date.now },
    status: { type: String, required: true },
    details: { type: String },
    source: { type: String, default: 'Jira' },
}, { timestamps: true });

export const SyncHistory = mongoose.model<ISyncHistory>('SyncHistory', syncHistorySchema);
