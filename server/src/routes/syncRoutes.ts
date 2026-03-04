import { Router } from 'express';
import {
    triggerFullSync,
    syncUsersController,
    syncProjectsController,
    syncTasksController,
    syncBoardsController
} from '../controllers/syncController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/full', authenticate, triggerFullSync);
router.post('/users', authenticate, syncUsersController);
router.post('/projects', authenticate, syncProjectsController);
router.post('/tasks', authenticate, syncTasksController);
router.post('/boards', authenticate, syncBoardsController);

export default router;
