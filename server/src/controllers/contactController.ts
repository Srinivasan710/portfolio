import { Request, Response, NextFunction } from 'express';
import { ContactService } from '../services/contactService.js';
import { ApiResponseHandler } from '../utils/apiResponse.js';

export class ContactController {
  static async submitContact(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const contactData = req.body;
      const contact = await ContactService.createContactMessage(contactData);
      ApiResponseHandler.created(
        res,
        'Thank you! Your message has been sent successfully. I will get back to you soon.',
        contact
      );
    } catch (error) {
      next(error);
    }
  }

  static async getMessages(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const messages = await ContactService.getAllContactMessages();
      ApiResponseHandler.success(
        res,
        'Contact messages retrieved successfully',
        messages,
        200
      );
    } catch (error) {
      next(error);
    }
  }

  static async deleteMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await ContactService.deleteContactMessage(req.params.id);
      ApiResponseHandler.success(
        res,
        'Contact message deleted successfully',
        null,
        200
      );
    } catch (error) {
      next(error);
    }
  }
}
