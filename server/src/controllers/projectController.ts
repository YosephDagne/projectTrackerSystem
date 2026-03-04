import { Request, Response } from 'express';
import { Project, IProject } from '../models/Project.js';
import { Milestone } from '../models/Risk.js';
import { Risk } from '../models/Risk.js';
import Task from '../models/Task.js';

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.json({ success: true, data: project });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.find();
        res.json({ success: true, data: projects });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateProjectStrategicDetails = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findByIdAndUpdate(projectId, req.body, { new: true });

        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }

        res.json({ success: true, data: project });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Milestone Endpoints
export const addMilestone = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const milestone = new Milestone({ ...req.body, projectId });
        await milestone.save();
        res.status(201).json({ success: true, data: milestone });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateMilestone = async (req: Request, res: Response) => {
    try {
        const { milestoneId } = req.params;
        const milestone = await Milestone.findByIdAndUpdate(milestoneId, req.body, { new: true });
        if (!milestone) return res.status(404).json({ success: false, message: 'Milestone not found' });
        res.json({ success: true, data: milestone });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const removeMilestone = async (req: Request, res: Response) => {
    try {
        const { milestoneId } = req.params;
        await Milestone.findByIdAndDelete(milestoneId);
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Risk Endpoints
export const addRisk = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const risk = new Risk({ ...req.body, projectId });
        await risk.save();
        res.status(201).json({ success: true, data: risk });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateRisk = async (req: Request, res: Response) => {
    try {
        const { riskId } = req.params;
        const risk = await Risk.findByIdAndUpdate(riskId, req.body, { new: true });
        if (!risk) return res.status(404).json({ success: false, message: 'Risk not found' });
        res.json({ success: true, data: risk });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const removeRisk = async (req: Request, res: Response) => {
    try {
        const { riskId } = req.params;
        await Risk.findByIdAndDelete(riskId);
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
