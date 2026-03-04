import { Request, Response } from 'express';
import { User } from '../models/User.js';
import crypto from 'crypto';
import { UserSource } from '../types/enums.js';

const generateRandomPassword = (length: number) => {
    return crypto.randomBytes(length).toString('base64').slice(0, length);
};

export const createLocalUser = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, roles } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: `User with email '${email}' already exists.` });
        }

        const generatedPassword = generateRandomPassword(12);

        const user = new User({
            firstName,
            lastName,
            email,
            userName: email,
            displayName: `${firstName} ${lastName}`.trim(),
            source: UserSource.Local,
            mustChangePassword: true,
            password: generatedPassword,
            roles: roles || ['Team Member']
        });

        await user.save();

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                email: user.email,
                displayName: user.displayName,
                firstName: user.firstName,
                lastName: user.lastName,
                source: user.source,
                isActive: user.isActive,
                roles: user.roles,
                generatedPassword
            }
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, data: users });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, data: user });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, displayName, email, roles, isActive, timeZone, location } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.source === UserSource.Local) {
            if (firstName) user.firstName = firstName;
            if (lastName) user.lastName = lastName;
            if (displayName) user.displayName = displayName;

            if (email && email !== user.email) {
                const emailTaken = await User.findOne({ email, _id: { $ne: id as any } });
                if (emailTaken) return res.status(400).json({ success: false, message: 'Email already in use' });
                user.email = email;
                user.userName = email;
            }
        }

        if (roles) user.roles = roles;
        if (isActive !== undefined) user.isActive = isActive;
        if (timeZone) user.timeZone = timeZone;
        if (location) user.location = location;

        await user.save();
        res.json({ success: true, data: user });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        if (user.source === UserSource.Jira) {
            user.isActive = false;
            await user.save();
        } else {
            await User.findByIdAndDelete(req.params.id);
        }

        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
