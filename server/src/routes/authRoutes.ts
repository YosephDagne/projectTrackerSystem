import { Router } from 'express';
import { signup, login, changePassword } from '../controllers/authController.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/change-password', changePassword);

export default router;
