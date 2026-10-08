import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { ApiResponseHandler } from '../utils/apiResponse.js';
import { AuthRequest } from '../middleware/auth.js';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, identifier, email, password } = req.body;
      const userIdent = username || identifier || email;
      const result = await authService.login(userIdent, password);
      return ApiResponseHandler.success(res, 'Logged in successfully', result, 200);
    } catch (error) {
      next(error);
    }
  }

  static async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getCurrentUser(req.user?.id || 'admin-1');
      return ApiResponseHandler.success(res, 'User profile retrieved', user, 200);
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await authService.changePassword(
        req.user?.id || 'admin-1',
        currentPassword,
        newPassword
      );
      return ApiResponseHandler.success(res, 'Password changed successfully', result, 200);
    } catch (error) {
      next(error);
    }
  }
}
