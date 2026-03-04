import { Request, Response } from 'express';
import Task from '../models/Task.js';
import * as jiraService from '../services/jiraService.js';
import { TaskStatus } from '../types/enums.js';

export const getTasks = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.query;
        const filter = projectId ? { projectId } : {};
        const tasks = await Task.find(filter);
        res.json(tasks);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { summary, description, assigneeId } = req.body;

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Push update to Jira first
        await jiraService.updateIssue(task.key, {
            fields: {
                summary: summary || task.summary,
                description: description || task.description,
                assignee: assigneeId ? { accountId: assigneeId } : undefined
            }
        });

        // Update local DB
        const updatedTask = await Task.findByIdAndUpdate(id, {
            summary,
            description,
            assigneeId,
            updated: new Date()
        }, { new: true });

        res.json(updatedTask);
    } catch (err: any) {
        res.status(500).json({ message: `Failed to update task: ${err.message}` });
    }
};

export const transitionTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, transitionId } = req.body; // Client must provide Jira transitionId

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Transition issue in Jira
        await jiraService.transitionIssue(task.key, transitionId);

        // Update local DB status
        task.status = status as TaskStatus;
        task.statusChangedDate = new Date();
        await task.save();

        res.json(task);
    } catch (err: any) {
        res.status(500).json({ message: `Failed to transition task: ${err.message}` });
    }
};
