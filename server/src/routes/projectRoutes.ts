import { Router } from 'express';
import { ProjectController } from '../controllers/projectController.js';
import { validateProject } from '../middleware/validator.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', ProjectController.getAll);
router.get('/:id', ProjectController.getById);
router.post('/', requireAuth, validateProject, ProjectController.create);
router.put('/:id', requireAuth, validateProject, ProjectController.update);
router.delete('/:id', requireAuth, ProjectController.delete);

export default router;
