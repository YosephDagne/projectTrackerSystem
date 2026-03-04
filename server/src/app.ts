import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import * as dotenv from 'dotenv';

dotenv.config();

import projectRoutes from './routes/projectRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

import roleRoutes from './routes/roleRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import reportingRoutes from './routes/reportingRoutes.js';
import jiraRoutes from './routes/jiraRoutes.js';
import syncRoutes from './routes/syncRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';

const app: Express = express();

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rbac', roleRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reports', reportingRoutes);
app.use('/api/jira', jiraRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/webhooks', webhookRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
    res.json({
        message: 'Welcome to the Project Tracker API (Node.js/TypeScript)',
        status: 'Running'
    });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP' });
});

export default app;
