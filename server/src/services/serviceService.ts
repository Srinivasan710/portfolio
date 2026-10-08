import mongoose from 'mongoose';
import { Service, IServiceDocument } from '../models/Service.js';
import { IService } from '../types/index.js';
import { initialServices } from '../data/seedData.js';
import { ApiError } from '../utils/apiError.js';

let inMemoryServices: any[] = initialServices.map((s, idx) => ({
  ...s,
  id: `mock-srv-${idx + 1}`,
  _id: `mock-srv-${idx + 1}`,
  createdAt: new Date(),
  updatedAt: new Date()
}));

const isDbConnected = () => mongoose.connection.readyState === 1;

export class ServiceService {
  static async getAllServices(): Promise<IServiceDocument[] | any[]> {
    if (isDbConnected()) {
      return await Service.find().sort({ createdAt: 1 });
    }
    return inMemoryServices;
  }

  static async getServiceById(id: string): Promise<IServiceDocument | any> {
    if (isDbConnected()) {
      const service = await Service.findById(id);
      if (!service) {
        throw ApiError.notFound(`Service with id ${id} not found`, 'SERVICE_NOT_FOUND');
      }
      return service;
    }

    const service = inMemoryServices.find(s => s.id === id || s._id === id);
    if (!service) {
      throw ApiError.notFound(`Service with id ${id} not found`, 'SERVICE_NOT_FOUND');
    }
    return service;
  }

  static async createService(data: IService): Promise<IServiceDocument | any> {
    if (isDbConnected()) {
      return await Service.create(data);
    }

    const newService = {
      ...data,
      id: `mock-srv-${Date.now()}`,
      _id: `mock-srv-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryServices.push(newService);
    return newService;
  }

  static async updateService(id: string, data: Partial<IService>): Promise<IServiceDocument | any> {
    if (isDbConnected()) {
      const service = await Service.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!service) {
        throw ApiError.notFound(`Service with id ${id} not found`, 'SERVICE_NOT_FOUND');
      }
      return service;
    }

    const index = inMemoryServices.findIndex(s => s.id === id || s._id === id);
    if (index === -1) {
      throw ApiError.notFound(`Service with id ${id} not found`, 'SERVICE_NOT_FOUND');
    }
    inMemoryServices[index] = {
      ...inMemoryServices[index],
      ...data,
      updatedAt: new Date()
    };
    return inMemoryServices[index];
  }

  static async deleteService(id: string): Promise<void> {
    if (isDbConnected()) {
      const result = await Service.findByIdAndDelete(id);
      if (!result) {
        throw ApiError.notFound(`Service with id ${id} not found`, 'SERVICE_NOT_FOUND');
      }
      return;
    }

    const index = inMemoryServices.findIndex(s => s.id === id || s._id === id);
    if (index === -1) {
      throw ApiError.notFound(`Service with id ${id} not found`, 'SERVICE_NOT_FOUND');
    }
    inMemoryServices.splice(index, 1);
  }
}
