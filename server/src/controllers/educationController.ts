import { Request, Response, NextFunction } from 'express';
import { educationService } from '../services/educationService.js';
import { ApiResponseHandler } from '../utils/apiResponse.js';

export class EducationController {
  static async getAllEducations(_req: Request, res: Response, next: NextFunction) {
    try {
      const educations = await educationService.getAll();
      return ApiResponseHandler.success(res, 'Educations retrieved successfully', educations, 200);
    } catch (error) {
      next(error);
    }
  }

  static async getEducationById(req: Request, res: Response, next: NextFunction) {
    try {
      const education = await educationService.getById(req.params.id);
      return ApiResponseHandler.success(res, 'Education retrieved successfully', education, 200);
    } catch (error) {
      next(error);
    }
  }

  static async createEducation(req: Request, res: Response, next: NextFunction) {
    try {
      const newEdu = await educationService.create(req.body);
      return ApiResponseHandler.created(res, 'Education entry created successfully', newEdu);
    } catch (error) {
      next(error);
    }
  }

  static async updateEducation(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await educationService.update(req.params.id, req.body);
      return ApiResponseHandler.success(res, 'Education entry updated successfully', updated, 200);
    } catch (error) {
      next(error);
    }
  }

  static async deleteEducation(req: Request, res: Response, next: NextFunction) {
    try {
      await educationService.delete(req.params.id);
      return ApiResponseHandler.success(res, 'Education entry deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  }
}
