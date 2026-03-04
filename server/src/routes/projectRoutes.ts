import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
    getProjectById,
    getProjects,
    updateProjectStrategicDetails,
    addMilestone,
    updateMilestone,
    removeMilestone,
    addRisk,
    updateRisk,
    removeRisk
} from '../controllers/projectController.js';

const router = Router();

router.use(authenticate);

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/Detail/:projectId', updateProjectStrategicDetails);

// Milestones
router.post('/:projectId/milestones', addMilestone);
router.put('/milestones/:milestoneId', updateMilestone);
router.delete('/milestones/:milestoneId', removeMilestone);

// Risks
router.post('/:projectId/risks', addRisk);
router.put('/risks/:riskId', updateRisk);
router.delete('/risks/:riskId', removeRisk);

export default router;
