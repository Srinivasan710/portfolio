import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ApiResponseHandler } from '../utils/apiResponse.js';

export class HealthController {
  static getHealth(_req: Request, res: Response) {
    const mongoStatusMap: Record<number, string> = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting'
    };

    const status = {
      status: 'UP',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: {
        status: mongoStatusMap[mongoose.connection.readyState] || 'Unknown',
        connected: mongoose.connection.readyState === 1
      },
      environment: process.env.NODE_ENV || 'development'
    };

    return ApiResponseHandler.success(res, 'Server is healthy and running', status);
  }
}
