import { Router } from 'express';
import {
    createLocalUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Middleware can be added here if needed, like authenticate
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/local', createLocalUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
