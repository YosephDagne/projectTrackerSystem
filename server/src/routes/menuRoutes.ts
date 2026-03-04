import { Router } from 'express';
import {
    getMenu,
    getAllMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    getById
} from '../controllers/menuController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Menu for specific user (role-based)
router.get('/', authenticate, getMenu);
router.get('/all', authenticate, getAllMenus); // Admin view
router.post('/', authenticate, createMenu);
router.put('/:id', authenticate, updateMenu);
router.delete('/:id', authenticate, deleteMenu);
router.get('/:id', authenticate, getById);

export default router;
