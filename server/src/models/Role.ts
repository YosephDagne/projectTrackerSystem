import mongoose, { Schema, Document } from 'mongoose';

export interface IPermission extends Document {
    permissionName: string;
    description: string;
    action: string;
    updatedUser: string;
}

const permissionSchema = new Schema<IPermission>({
    permissionName: { type: String, required: true, unique: true },
    description: { type: String },
    action: { type: String, required: true },
    updatedUser: { type: String },
}, { timestamps: true });

export const Permission = mongoose.model<IPermission>('Permission', permissionSchema);

export interface IRole extends Document {
    roleName: string;
    description: string;
    permissions: string[]; // Permission IDs or names
}

const roleSchema = new Schema<IRole>({
    roleName: { type: String, required: true, unique: true },
    description: { type: String },
    permissions: [{ type: String }],
}, { timestamps: true });

export const Role = mongoose.model<IRole>('Role', roleSchema);
