import { Request, Response } from 'express';
import { Role, Permission } from '../models/Role.js';

export const getRoles = async (req: Request, res: Response) => {
    try {
        const roles = await Role.find();
        res.json({ success: true, data: roles });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createRole = async (req: Request, res: Response) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json({ success: true, data: role });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateRole = async (req: Request, res: Response) => {
    try {
        const updatedRole = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRole) return res.status(404).json({ success: false, message: 'Role not found' });
        res.json({ success: true, data: updatedRole });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const assignPermissionToRole = async (req: Request, res: Response) => {
    try {
        const { roleId, permissionId } = req.body;
        const role = await Role.findById(roleId);
        if (!role) return res.status(404).json({ success: false, message: 'Role does not exist' });

        const permission = await Permission.findById(permissionId);
        if (!permission) return res.status(404).json({ success: false, message: 'Permission does not exist' });

        if (role.permissions.includes(permissionId)) {
            return res.status(409).json({ success: false, message: 'Permission already assigned' });
        }

        role.permissions.push(permissionId);
        await role.save();
        res.json({ success: true, data: role });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const assignRoleToPrivileges = async (req: Request, res: Response) => {
    try {
        const { roleId, permissionIds } = req.body;
        const role = await Role.findById(roleId);
        if (!role) return res.status(404).json({ success: false, message: 'Role does not exist' });

        const newPermissions = permissionIds.filter((id: string) => !role.permissions.includes(id));
        if (newPermissions.length === 0) return res.status(400).json({ success: false, message: 'All permissions already assigned' });

        role.permissions.push(...newPermissions);
        await role.save();
        res.json({ success: true, data: role });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteRole = async (req: Request, res: Response) => {
    try {
        const result = await Role.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ success: false, message: 'Role not found' });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Permissions
export const getPermissions = async (req: Request, res: Response) => {
    try {
        const permissions = await Permission.find();
        res.json({ success: true, data: permissions });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createPermission = async (req: Request, res: Response) => {
    try {
        const permission = new Permission(req.body);
        await permission.save();
        res.status(201).json({ success: true, data: permission });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
