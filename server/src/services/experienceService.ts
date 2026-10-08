import mongoose from 'mongoose';
import { Experience, IExperienceDocument } from '../models/Experience.js';
import { IExperience } from '../types/index.js';
import { initialExperiences } from '../data/seedData.js';
import { ApiError } from '../utils/apiError.js';

let inMemoryExperiences: any[] = initialExperiences.map((e, idx) => ({
  ...e,
  id: `mock-exp-${idx + 1}`,
  _id: `mock-exp-${idx + 1}`,
  createdAt: new Date(),
  updatedAt: new Date()
}));

const isDbConnected = () => mongoose.connection.readyState === 1;

export class ExperienceService {
  static async getAllExperiences(): Promise<IExperienceDocument[] | any[]> {
    if (isDbConnected()) {
      return await Experience.find().sort({ createdAt: -1 });
    }
    return inMemoryExperiences;
  }

  static async getExperienceById(id: string): Promise<IExperienceDocument | any> {
    if (isDbConnected()) {
      const experience = await Experience.findById(id);
      if (!experience) {
        throw ApiError.notFound(`Experience with id ${id} not found`, 'EXPERIENCE_NOT_FOUND');
      }
      return experience;
    }

    const exp = inMemoryExperiences.find(e => e.id === id || e._id === id);
    if (!exp) {
      throw ApiError.notFound(`Experience with id ${id} not found`, 'EXPERIENCE_NOT_FOUND');
    }
    return exp;
  }

  static async createExperience(data: IExperience): Promise<IExperienceDocument | any> {
    if (isDbConnected()) {
      return await Experience.create(data);
    }

    const newExp = {
      ...data,
      id: `mock-exp-${Date.now()}`,
      _id: `mock-exp-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryExperiences.unshift(newExp);
    return newExp;
  }

  static async updateExperience(id: string, data: Partial<IExperience>): Promise<IExperienceDocument | any> {
    if (isDbConnected()) {
      const exp = await Experience.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!exp) {
        throw ApiError.notFound(`Experience with id ${id} not found`, 'EXPERIENCE_NOT_FOUND');
      }
      return exp;
    }

    const index = inMemoryExperiences.findIndex(e => e.id === id || e._id === id);
    if (index === -1) {
      throw ApiError.notFound(`Experience with id ${id} not found`, 'EXPERIENCE_NOT_FOUND');
    }
    inMemoryExperiences[index] = {
      ...inMemoryExperiences[index],
      ...data,
      updatedAt: new Date()
    };
    return inMemoryExperiences[index];
  }

  static async deleteExperience(id: string): Promise<void> {
    if (isDbConnected()) {
      const result = await Experience.findByIdAndDelete(id);
      if (!result) {
        throw ApiError.notFound(`Experience with id ${id} not found`, 'EXPERIENCE_NOT_FOUND');
      }
      return;
    }

    const index = inMemoryExperiences.findIndex(e => e.id === id || e._id === id);
    if (index === -1) {
      throw ApiError.notFound(`Experience with id ${id} not found`, 'EXPERIENCE_NOT_FOUND');
    }
    inMemoryExperiences.splice(index, 1);
  }
}
