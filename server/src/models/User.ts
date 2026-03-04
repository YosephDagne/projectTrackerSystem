import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserSource } from '../types/enums.js';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    userName: string;
    isActive: boolean;
    accountId?: string;
    displayName?: string;
    avatarUrl?: string;
    timeZone?: string;
    currentWorkload?: number;
    location?: string;
    source: UserSource;
    mustChangePassword: boolean;
    roles: string[]; // Role names or IDs
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    userName: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    accountId: { type: String },
    displayName: { type: String },
    avatarUrl: { type: String },
    timeZone: { type: String },
    currentWorkload: { type: Number },
    location: { type: String },
    source: { type: String, enum: Object.values(UserSource), default: UserSource.Local },
    mustChangePassword: { type: Boolean, default: false },
    roles: [{ type: String }],
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (password: string) {
    if (!this.password) return false;
    return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
