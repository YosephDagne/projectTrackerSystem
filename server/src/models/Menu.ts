import mongoose, { Schema, Document } from 'mongoose';

export interface IMenuItem extends Document {
    title: string;
    url?: string;
    icon?: string;
    parentId?: string;
    order: number;
    roles: string[]; // Role names that can see this menu
    isActive: boolean;
}

const menuItemSchema = new Schema<IMenuItem>({
    title: { type: String, required: true },
    url: { type: String },
    icon: { type: String },
    parentId: { type: String },
    order: { type: Number, default: 0 },
    roles: [{ type: String }],
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const MenuItem = mongoose.model<IMenuItem>('MenuItem', menuItemSchema);
