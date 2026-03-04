import { Router } from 'express';
import { handleJiraWebhook } from '../controllers/webhookController.js';

const router = Router();

// Notice: Webhooks don't use the standard `authenticate` JWT middleware
// since Jira sends these directly. You should eventually secure this with a secret token or IP whitelist.
router.post('/jira', handleJiraWebhook);

export default router;
