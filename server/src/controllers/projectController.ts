import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/projectService.js';
import { ApiResponseHandler } from '../utils/apiResponse.js';

export class ProjectController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, featured } = req.query;
      const filters: { category?: string; featured?: boolean } = {};
      if (typeof category === 'string' && category.trim()) {
        filters.category = category.trim();
      }
      if (typeof featured === 'string') {
        filters.featured = featured.toLowerCase() === 'true';
      }
      const projects = await ProjectService.getAllProjects(filters);
      return ApiResponseHandler.success(res, 'Projects retrieved successfully', projects);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const project = await ProjectService.getProjectById(id);
      return ApiResponseHandler.success(res, 'Project retrieved successfully', project);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.createProject(req.body);
      return ApiResponseHandler.created(res, 'Project created successfully', project);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const project = await ProjectService.updateProject(id, req.body);
      return ApiResponseHandler.success(res, 'Project updated successfully', project);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ProjectService.deleteProject(id);
      return ApiResponseHandler.success(res, 'Project deleted successfully', null);
    } catch (err) {
      next(err);
    }
  }
}
