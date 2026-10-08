import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import apiRouter from './routes/index.js';
import { setupSwagger } from './config/swagger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app: Application = express();

// Ensure upload directory exists
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Serve uploaded static files
app.use('/uploads', express.static(uploadDir));

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin like mobile apps, curl, or swagger-ui
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for local dev & evaluation
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsing
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Swagger UI documentation
setupSwagger(app);

// Root redirect / greeting
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Developer Portfolio REST API is active',
    documentation: '/api-docs',
    healthCheck: '/api/health'
  });
});

// API Routes
app.use('/api', apiRouter);

// Centralized error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
