import { Router } from 'express';
import projectRoutes from './projectRoutes.js';
import experienceRoutes from './experienceRoutes.js';
import skillRoutes from './skillRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import contactRoutes from './contactRoutes.js';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';
import educationRoutes from './educationRoutes.js';
import uploadRoutes from './uploadRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/educations', educationRoutes);
apiRouter.use('/upload', uploadRoutes);
apiRouter.use('/projects', projectRoutes);
apiRouter.use('/experiences', experienceRoutes);
apiRouter.use('/skills', skillRoutes);
apiRouter.use('/services', serviceRoutes);
apiRouter.use('/contact', contactRoutes);
apiRouter.use('/health', healthRoutes);

export default apiRouter;
