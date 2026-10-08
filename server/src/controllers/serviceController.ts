import { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/serviceService.js';
import { ApiResponseHandler } from '../utils/apiResponse.js';

export class ServiceController {
  static async getAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const services = await ServiceService.getAllServices();
      return ApiResponseHandler.success(res, 'Services retrieved successfully', services);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const service = await ServiceService.getServiceById(id);
      return ApiResponseHandler.success(res, 'Service retrieved successfully', service);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await ServiceService.createService(req.body);
      return ApiResponseHandler.created(res, 'Service created successfully', service);
    } catch (err) {
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const service = await ServiceService.updateService(id, req.body);
      return ApiResponseHandler.success(res, 'Service updated successfully', service);
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await ServiceService.deleteService(id);
      return ApiResponseHandler.success(res, 'Service deleted successfully', null);
    } catch (err) {
      next(err);
    }
  }
}
