import { Request, Response, NextFunction } from 'express';
import { ExperienceService } from '../services/experienceService.js';
import { ApiResponseHandler } from '../utils/apiResponse.js';

export class ExperienceController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const experiences = await ExperienceService.getAllExperiences();
      return ApiResponseHandler.success(res, 'Experiences retrieved successfully', experiences);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const experience = await ExperienceService.getExperienceById(id);
      return ApiResponseHandler.success(res, 'Experience retrieved successfully', experience);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const experience = await ExperienceService.createExperience(req.body);
      return ApiResponseHandler.created(res, 'Experience created successfully', experience);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const experience = await ExperienceService.updateExperience(id, req.body);
      return ApiResponseHandler.success(res, 'Experience updated successfully', experience);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ExperienceService.deleteExperience(id);
      return ApiResponseHandler.success(res, 'Experience deleted successfully', null);
    } catch (err) {
      next(err);
    }
  }
}
