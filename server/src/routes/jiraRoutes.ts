import { Router } from 'express';
import {
    getProjectsController,
    getProjectMetricsController,
    getProjectTasksController,
    getUsersController,
    getBoardsController,
    getSprintsForBoardController,
    getIssuesInSprintController,
    getIssueChangelogController
} from '../controllers/jiraController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/projects', authenticate, getProjectsController);
router.get('/projects/:projectKey/metrics', authenticate, getProjectMetricsController);
router.get('/projects/:projectKey/tasks', authenticate, getProjectTasksController);
router.get('/users', authenticate, getUsersController);
router.get('/boards', authenticate, getBoardsController);
router.get('/boards/:boardId/sprints', authenticate, getSprintsForBoardController);
router.get('/sprints/:sprintId/issues', authenticate, getIssuesInSprintController);
router.get('/issues/:issueKeyOrId/changelog', authenticate, getIssueChangelogController);

export default router;
