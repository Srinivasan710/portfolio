import { Router } from 'express';
import { EducationController } from '../controllers/educationController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', EducationController.getAllEducations);
router.get('/:id', EducationController.getEducationById);
router.post('/', requireAuth, EducationController.createEducation);
router.put('/:id', requireAuth, EducationController.updateEducation);
router.delete('/:id', requireAuth, EducationController.deleteEducation);

export default router;
