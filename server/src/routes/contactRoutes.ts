import { Router } from 'express';
import { ContactController } from '../controllers/contactController.js';
import { validateContact } from '../middleware/validator.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', validateContact, ContactController.submitContact);
router.get('/', requireAuth, ContactController.getMessages);
router.delete('/:id', requireAuth, ContactController.deleteMessage);

export default router;
