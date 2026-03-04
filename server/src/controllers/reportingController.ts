import { Request, Response } from 'express';
import { getProjectSprintOverview, getSprintReport } from '../services/reportingService.js';

export const getProjectSprintOverviewController = async (req: Request, res: Response) => {
    try {
        const { projectKey } = req.params;
        const overview = await getProjectSprintOverview(projectKey);
        if (!overview) return res.status(404).json({ message: 'Project not found' });
        res.json(overview);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};

export const getSprintReportController = async (req: Request, res: Response) => {
    try {
        const { sprintId } = req.params;
        const report = await getSprintReport(sprintId);
        if (!report) return res.status(404).json({ message: 'Sprint not found' });
        res.json(report);
    } catch (err: any) {
        res.status(500).json({ message: err.message });
    }
};
