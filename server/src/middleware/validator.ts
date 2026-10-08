import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';

export const validateContact = (req: Request, _res: Response, next: NextFunction) => {
  const { name, email, subject, message } = req.body;
  const errors: Record<string, string> = {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Name is required and must be at least 2 characters';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.email = 'A valid email address is required';
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
    errors.subject = 'Subject is required and must be at least 3 characters';
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.message = 'Message is required and must be at least 10 characters';
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiError(400, 'Validation failed for contact message', 'VALIDATION_ERROR', errors));
  }

  next();
};

export const validateProject = (req: Request, _res: Response, next: NextFunction) => {
  const { title, description, image, technologies, githubUrl, liveUrl, category } = req.body;
  const errors: Record<string, string> = {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.title = 'Project title is required';
  }
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.description = 'Project description is required';
  }
  if (!image || typeof image !== 'string' || image.trim().length === 0) {
    errors.image = 'Project image URL is required';
  }
  if (!Array.isArray(technologies) || technologies.length === 0) {
    errors.technologies = 'At least one technology is required in technologies array';
  }
  if (!githubUrl || typeof githubUrl !== 'string' || githubUrl.trim().length === 0) {
    errors.githubUrl = 'GitHub URL is required';
  }
  if (!liveUrl || typeof liveUrl !== 'string' || liveUrl.trim().length === 0) {
    errors.liveUrl = 'Live URL is required';
  }
  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.category = 'Category is required';
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiError(400, 'Validation failed for project', 'VALIDATION_ERROR', errors));
  }

  next();
};

export const validateExperience = (req: Request, _res: Response, next: NextFunction) => {
  const { company, position, description, startDate, endDate, location } = req.body;
  const errors: Record<string, string> = {};

  if (!company || typeof company !== 'string' || company.trim().length === 0) {
    errors.company = 'Company is required';
  }
  if (!position || typeof position !== 'string' || position.trim().length === 0) {
    errors.position = 'Position is required';
  }
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.description = 'Description is required';
  }
  if (!startDate || typeof startDate !== 'string' || startDate.trim().length === 0) {
    errors.startDate = 'Start date is required';
  }
  if (!endDate || typeof endDate !== 'string' || endDate.trim().length === 0) {
    errors.endDate = 'End date is required';
  }
  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    errors.location = 'Location is required';
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiError(400, 'Validation failed for experience', 'VALIDATION_ERROR', errors));
  }

  next();
};

export const validateSkill = (req: Request, _res: Response, next: NextFunction) => {
  const { name, category, level, icon } = req.body;
  const errors: Record<string, string> = {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.name = 'Skill name is required';
  }
  const validCategories = ['Frontend', 'Backend', 'Database', 'Tools'];
  if (!category || !validCategories.includes(category)) {
    errors.category = `Category must be one of: ${validCategories.join(', ')}`;
  }
  if (typeof level !== 'number' || level < 1 || level > 100) {
    errors.level = 'Level must be a number between 1 and 100';
  }
  if (!icon || typeof icon !== 'string' || icon.trim().length === 0) {
    errors.icon = 'Icon class is required';
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiError(400, 'Validation failed for skill', 'VALIDATION_ERROR', errors));
  }

  next();
};

export const validateService = (req: Request, _res: Response, next: NextFunction) => {
  const { title, description, icon } = req.body;
  const errors: Record<string, string> = {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.title = 'Service title is required';
  }
  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.description = 'Service description is required';
  }
  if (!icon || typeof icon !== 'string' || icon.trim().length === 0) {
    errors.icon = 'Service icon is required';
  }

  if (Object.keys(errors).length > 0) {
    return next(new ApiError(400, 'Validation failed for service', 'VALIDATION_ERROR', errors));
  }

  next();
};
