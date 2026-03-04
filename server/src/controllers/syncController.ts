import { Request, Response } from 'express';
import { syncAll, syncUsers, syncProjects, syncTasks, syncBoardsAndSprints } from '../services/syncService.js';

export const triggerFullSync = async (req: Request, res: Response) => {
    try {
        await syncAll();
        res.json({ message: 'Full sync completed successfully.' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const syncUsersController = async (req: Request, res: Response) => {
    try {
        await syncUsers();
        res.json({ message: 'User sync completed.' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const syncProjectsController = async (req: Request, res: Response) => {
    try {
        await syncProjects();
        res.json({ message: 'Project sync completed.' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const syncTasksController = async (req: Request, res: Response) => {
    try {
        await syncTasks();
        res.json({ message: 'Task sync completed.' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const syncBoardsController = async (req: Request, res: Response) => {
    try {
        await syncBoardsAndSprints();
        res.json({ message: 'Board and Sprint sync completed.' });
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
