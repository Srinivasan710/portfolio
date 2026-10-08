import { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profileService.js';
import { ApiResponseHandler } from '../utils/apiResponse.js';

export class ProfileController {
  static async getProfile(_req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await profileService.getProfile();
      return ApiResponseHandler.success(res, 'Profile retrieved successfully', profile, 200);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await profileService.updateProfile(req.body);
      return ApiResponseHandler.success(res, 'Profile updated successfully', updated, 200);
    } catch (error) {
      next(error);
    }
  }
}
