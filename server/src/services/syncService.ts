import * as jiraService from './jiraService.js';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import Task from '../models/Task.js';
import { Board, Sprint } from '../models/Board.js';
import { UserSource, HealthLevel, TaskStatus } from '../types/enums.js';
import { calculateHealth } from './riskCalculatorService.js';

export const syncUsers = async () => {
    const jiraUsers = await jiraService.getAppUsers();
    for (const ju of jiraUsers) {
        if (!ju.emailAddress) continue;
        await User.findOneAndUpdate(
            { email: ju.emailAddress },
            {
                firstName: ju.displayName.split(' ')[0] || '',
                lastName: ju.displayName.split(' ')[1] || '',
                displayName: ju.displayName,
                accountId: ju.accountId,
                avatarUrl: ju.avatarUrls?.['48x48'],
                isActive: ju.active,
                source: UserSource.Jira,
                userName: ju.emailAddress,
                $addToSet: { roles: 'Team Member' }
            },
            { upsert: true, new: true }
        );
    }
};

export const syncProjects = async () => {
    const jiraProjects = await jiraService.getProjects();
    for (const jp of jiraProjects) {
        const metricsData = await jiraService.getProjectMetrics(jp.key);

        // Simplified metrics calculation
        const totalTasks = metricsData.total || 0;
        const completedTasks = metricsData.issues?.filter((i: any) => i.fields.status.name === 'Done').length || 0;
        const activeBlockers = metricsData.issues?.filter((i: any) => i.fields.status.name === 'Blocked').length || 0;

        const health = calculateHealth({
            totalTasks,
            completedTasks,
            activeBlockers,
            storyPointsTotal: 0, // Placeholder
            storyPointsCompleted: 0,
            recentUpdates: 0
        });

        await Project.findOneAndUpdate(
            { key: jp.key },
            {
                name: jp.name,
                description: jp.description,
                lead: jp.lead?.displayName,
                health: {
                    level: health.level,
                    score: health.score,
                    status: health.status
                },
                progress: {
                    totalTasks,
                    completedTasks,
                    onTrackPercentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
                }
            },
            { upsert: true, new: true }
        );
    }
};

export const syncBoardsAndSprints = async () => {
    const boards = await jiraService.getBoards();
    for (const b of boards) {
        const projectKey = b.location?.projectKey;
        if (!projectKey) continue;

        const board = await Board.findOneAndUpdate(
            { jiraId: b.id },
            { name: b.name, type: b.type, projectId: projectKey },
            { upsert: true, new: true }
        );

        if (b.type === 'scrum') {
            const sprints = await jiraService.getSprintsForBoard(b.id);
            for (const s of sprints) {
                await Sprint.findOneAndUpdate(
                    { jiraId: s.id },
                    {
                        name: s.name,
                        state: s.state,
                        startDate: s.startDate,
                        endDate: s.endDate,
                        boardId: board._id as string
                    },
                    { upsert: true }
                );
            }
        }
    }
};

export const syncTasks = async () => {
    const projects = await Project.find();
    for (const p of projects) {
        const issues = await jiraService.getProjectTasks(p.key);
        for (const issue of issues) {
            const f = issue.fields;

            // Resolve status mapping
            let status = TaskStatus.ToDo;
            if (f.status.name === 'Done') status = TaskStatus.Done;
            else if (f.status.name === 'In Progress') status = TaskStatus.InProgress;
            else if (f.status.name === 'Blocked') status = TaskStatus.Blocked;

            await Task.findOneAndUpdate(
                { key: issue.key },
                {
                    summary: f.summary,
                    description: f.description,
                    status,
                    projectId: p.key,
                    assigneeId: f.assignee?.accountId,
                    assigneeName: f.assignee?.displayName,
                    issueType: f.issuetype?.name,
                    priority: f.priority?.name,
                    updatedDate: new Date(f.updated),
                    createdDate: new Date(f.created),
                    storyPoints: f.customfield_10016, // Common story point field key
                    jiraSprintId: f.sprint?.id
                },
                { upsert: true }
            );
        }
    }
};

export const syncAll = async () => {
    console.log('Starting sync all...');
    await syncUsers();
    await syncProjects();
    await syncBoardsAndSprints();
    await syncTasks();
    console.log('Sync all completed.');
};
