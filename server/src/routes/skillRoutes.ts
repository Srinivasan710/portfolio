import { Router } from 'express';
import { SkillController } from '../controllers/skillController.js';
import { validateSkill } from '../middleware/validator.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', SkillController.getAll);
router.get('/:id', SkillController.getById);
router.post('/', requireAuth, validateSkill, SkillController.create);
router.put('/:id', requireAuth, validateSkill, SkillController.update);
router.delete('/:id', requireAuth, SkillController.delete);

export default router;
