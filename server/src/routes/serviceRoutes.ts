import { Router } from 'express';
import { ServiceController } from '../controllers/serviceController.js';
import { validateService } from '../middleware/validator.js';

const router = Router();

router.get('/', ServiceController.getAll);
router.get('/:id', ServiceController.getById);
router.post('/', validateService, ServiceController.create);
router.put('/:id', validateService, ServiceController.update);
router.delete('/:id', ServiceController.delete);

export default router;
