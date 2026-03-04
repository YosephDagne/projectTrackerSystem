import { Project } from '../models/Project.js';
import Task from '../models/Task.js';
import { Sprint } from '../models/Board.js';
import { TaskStatus } from '../types/enums.js';

export const getProjectSprintOverview = async (projectKey: string) => {
    const project = await Project.findOne({ key: projectKey });
    if (!project) return null;

    const sprints = await Sprint.find({ boardId: { $in: project.syncHistory } }).sort({ startDate: -1 });

    return {
        projectKey: project.key,
        projectName: project.name,
        sprints: sprints.map(s => ({
            id: s._id,
            name: s.name,
            state: s.state
        }))
    };
};

export const getSprintReport = async (sprintId: string) => {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) return null;

    const tasks = await Task.find({ sprintId: sprintId });

    const totalStoryPoints = tasks
        .filter(t => t.issueType === 'Story' && t.storyPoints)
        .reduce((sum, t) => sum + (t.storyPoints || 0), 0);

    const completedStoryPoints = tasks
        .filter(t => t.issueType === 'Story' && t.status === TaskStatus.Done && t.storyPoints)
        .reduce((sum, t) => sum + (t.storyPoints || 0), 0);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === TaskStatus.Done).length;

    const taskStatusCounts = tasks.reduce((acc: any, t) => {
        acc[t.status] = (acc[t.status] || 0) + 1;
        return acc;
    }, {});

    const issueTypeCounts = tasks.reduce((acc: any, t) => {
        acc[t.issueType] = (acc[t.issueType] || 0) + 1;
        return acc;
    }, {});

    const developerWorkloads = Array.from(new Set(tasks.map(t => t.assigneeId).filter(id => id))).map(id => {
        const userTasks = tasks.filter(t => t.assigneeId === id);
        return {
            assigneeId: id,
            assigneeName: userTasks[0].assigneeName,
            estimatedWork: userTasks.reduce((sum, t) => sum + (t.storyPoints || (t.timeEstimateMinutes || 0) / 60), 0),
            completedWork: userTasks.filter(t => t.status === TaskStatus.Done).reduce((sum, t) => sum + (t.storyPoints || (t.timeEstimateMinutes || 0) / 60), 0),
            taskStatusBreakdown: userTasks.reduce((acc: any, t) => {
                acc[t.status] = (acc[t.status] || 0) + 1;
                return acc;
            }, {})
        };
    });

    return {
        id: sprint._id,
        jiraId: sprint.jiraId,
        name: sprint.name,
        state: sprint.state,
        startDate: sprint.startDate,
        endDate: sprint.endDate,
        totalStoryPoints,
        completedStoryPoints,
        storyPointCompletionPercentage: totalStoryPoints > 0 ? (completedStoryPoints / totalStoryPoints) * 100 : 0,
        totalTasks,
        completedTasks,
        taskCompletionPercentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
        taskStatusCounts,
        issueTypeCounts,
        developerWorkloads,
        tasksInSprint: tasks
    };
};
