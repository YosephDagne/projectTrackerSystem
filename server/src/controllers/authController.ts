import { Request, Response } from 'express';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';

const generateToken = (user: any) => {
    return jwt.sign(
        { id: user._id, roles: user.roles, email: user.email },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '1d' }
    );
};

export const signup = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            firstName,
            lastName,
            email,
            password,
            userName: email,
        });

        await user.save();

        const token = generateToken(user);
        res.status(201).json({ token });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.mustChangePassword) {
            return res.json({
                success: true,
                requiresPasswordChange: true,
                userId: user._id,
                email: user.email
            });
        }

        const token = generateToken(user);
        res.json({
            success: true,
            userId: user._id,
            email: user.email,
            token
        });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password incorrect' });
        }

        user.password = newPassword;
        user.mustChangePassword = false;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
