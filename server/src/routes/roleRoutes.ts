import { Router } from 'express';
import {
    getRoles,
    createRole,
    updateRole,
    deleteRole,
    assignPermissionToRole,
    assignRoleToPrivileges,
    getPermissions,
    createPermission
} from '../controllers/roleController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/roles', authenticate, getRoles);
router.post('/roles', authenticate, createRole);
router.put('/roles/:id', authenticate, updateRole);
router.delete('/roles/:id', authenticate, deleteRole);
router.post('/role-permissions', authenticate, assignPermissionToRole);
router.post('/role-permissions/assign-role-to-privileges', authenticate, assignRoleToPrivileges);

router.get('/permissions', authenticate, getPermissions);
router.post('/permissions', authenticate, createPermission);

export default router;
