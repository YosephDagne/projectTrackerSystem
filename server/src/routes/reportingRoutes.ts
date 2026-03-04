import { Router } from 'express';
import {
    getProjectSprintOverviewController,
    getSprintReportController
} from '../controllers/reportingController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/projects/:projectKey/sprint-overview', authenticate, getProjectSprintOverviewController);
router.get('/sprints/:sprintId', authenticate, getSprintReportController);

export default router;
