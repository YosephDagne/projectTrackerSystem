import { Request, Response } from 'express';
import { MenuItem } from '../models/Menu.js';

export const getMenu = async (req: Request, res: Response) => {
    try {
        const roles = (req as any).user?.roles || [];
        const menu = await MenuItem.find({
            isActive: true,
            $or: [
                { roles: { $in: roles } },
                { roles: { $size: 0 } }
            ]
        }).sort('order');
        res.json({ success: true, data: menu });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getAllMenus = async (req: Request, res: Response) => {
    try {
        const menus = await MenuItem.find().sort('order');
        res.json({ success: true, data: menus });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createMenu = async (req: Request, res: Response) => {
    try {
        const menu = new MenuItem(req.body);
        await menu.save();
        res.status(201).json({ success: true, data: menu });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateMenu = async (req: Request, res: Response) => {
    try {
        const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'Menu not found' });
        res.json({ success: true, data: updated });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteMenu = async (req: Request, res: Response) => {
    try {
        const result = await MenuItem.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ success: false, message: 'Menu not found' });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getById = async (req: Request, res: Response) => {
    try {
        const menu = await MenuItem.findById(req.params.id);
        if (!menu) return res.status(404).json({ success: false, message: 'Menu not found' });
        res.json({ success: true, data: menu });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
