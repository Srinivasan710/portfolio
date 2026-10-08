import { Request, Response, NextFunction } from 'express';
import { SkillService } from '../services/skillService.js';
import { ApiResponseHandler } from '../utils/apiResponse.js';

export class SkillController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.query;
      const skills = await SkillService.getAllSkills(
        typeof category === 'string' ? category : undefined
      );
      return ApiResponseHandler.success(res, 'Skills retrieved successfully', skills);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const skill = await SkillService.getSkillById(id);
      return ApiResponseHandler.success(res, 'Skill retrieved successfully', skill);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const skill = await SkillService.createSkill(req.body);
      return ApiResponseHandler.created(res, 'Skill created successfully', skill);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const skill = await SkillService.updateSkill(id, req.body);
      return ApiResponseHandler.success(res, 'Skill updated successfully', skill);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await SkillService.deleteSkill(id);
      return ApiResponseHandler.success(res, 'Skill deleted successfully', null);
    } catch (err) {
      next(err);
    }
  }
}
