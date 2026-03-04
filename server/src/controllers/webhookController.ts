import { Request, Response } from 'express';
import Task from '../models/Task.js';
import { TaskStatus } from '../types/enums.js';

export const handleJiraWebhook = async (req: Request, res: Response) => {
    try {
        const { webhookEvent, issue } = req.body;

        if (!issue) return res.status(200).send('No issue provided, ignoring.');

        // Handling issue updates instantly (bi-directional sync incoming flow)
        if (webhookEvent === 'jira:issue_updated' || webhookEvent === 'jira:issue_created') {
            const f = issue.fields;

            // Map status
            let status = TaskStatus.ToDo;
            if (f.status?.name === 'Done') status = TaskStatus.Done;
            else if (f.status?.name === 'In Progress') status = TaskStatus.InProgress;
            else if (f.status?.name === 'Blocked') status = TaskStatus.Blocked;

            await Task.findOneAndUpdate(
                { key: issue.key },
                {
                    summary: f.summary,
                    description: f.description,
                    status,
                    assigneeId: f.assignee?.accountId,
                    assigneeName: f.assignee?.displayName,
                    updatedDate: new Date(f.updated),
                    storyPoints: f.customfield_10016 // Commonly SP field
                },
                { upsert: true } // Creates task if it doesn't exist
            );

            console.log(`[Webhook] Successfully processed real-time update for ${issue.key}`);
            return res.status(200).json({ message: 'Update handled successfully' });
        }

        if (webhookEvent === 'jira:issue_deleted') {
            await Task.findOneAndDelete({ key: issue.key });
            console.log(`[Webhook] Successfully processed deletion for ${issue.key}`);
            return res.status(200).json({ message: 'Deletion handled successfully' });
        }

        res.status(200).send('Webhook received but event not mapped.');
    } catch (err: any) {
        console.error(`[Webhook Error] Failed to process Jira webhook: ${err.message}`);
        res.status(500).json({ message: 'Webhook processing failed.' });
    }
};
