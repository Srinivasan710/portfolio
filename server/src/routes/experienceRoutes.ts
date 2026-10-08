import { Router } from 'express';
import { ExperienceController } from '../controllers/experienceController.js';
import { validateExperience } from '../middleware/validator.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', ExperienceController.getAll);
router.get('/:id', ExperienceController.getById);
router.post('/', requireAuth, validateExperience, ExperienceController.create);
router.put('/:id', requireAuth, validateExperience, ExperienceController.update);
router.delete('/:id', requireAuth, ExperienceController.delete);

export default router;
