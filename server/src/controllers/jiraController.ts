import { Request, Response } from 'express';
import * as jiraService from '../services/jiraService.js';

export const getProjectsController = async (req: Request, res: Response) => {
    try {
        const projects = await jiraService.getProjects();
        res.json({ success: true, data: projects });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getProjectMetricsController = async (req: Request, res: Response) => {
    try {
        const { projectKey } = req.params;
        const metrics = await jiraService.getProjectMetrics(projectKey as string);
        res.json({ success: true, data: metrics });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getProjectTasksController = async (req: Request, res: Response) => {
    try {
        const { projectKey } = req.params;
        const tasks = await jiraService.getProjectTasks(projectKey as string);
        res.json({ success: true, data: tasks });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getUsersController = async (req: Request, res: Response) => {
    try {
        const users = await jiraService.getAppUsers();
        res.json({ success: true, data: users });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getBoardsController = async (req: Request, res: Response) => {
    try {
        const boards = await jiraService.getBoards();
        res.json({ success: true, data: boards });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getSprintsForBoardController = async (req: Request, res: Response) => {
    try {
        const { boardId } = req.params;
        const sprints = await jiraService.getSprintsForBoard(Number(boardId));
        res.json({ success: true, data: sprints });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getIssuesInSprintController = async (req: Request, res: Response) => {
    try {
        const { sprintId } = req.params;
        const issues = await jiraService.getIssuesInSprint(Number(sprintId));
        res.json({ success: true, data: issues });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getIssueChangelogController = async (req: Request, res: Response) => {
    try {
        const { issueKeyOrId } = req.params;
        const changelog = await jiraService.getIssueChangelog(issueKeyOrId as string);
        res.json({ success: true, data: changelog });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
