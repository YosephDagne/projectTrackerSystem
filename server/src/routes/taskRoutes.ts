import { Router } from 'express';
import {
    getTasks,
    updateTask,
    transitionTask
} from '../controllers/taskController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, getTasks);
router.put('/:id', authenticate, updateTask);
router.post('/:id/transition', authenticate, transitionTask);

export default router;
