import mongoose from 'mongoose';
import { Project, IProjectDocument } from '../models/Project.js';
import { IProject } from '../types/index.js';
import { initialProjects } from '../data/seedData.js';
import { ApiError } from '../utils/apiError.js';

let inMemoryProjects: any[] = initialProjects.map((p, idx) => ({
  ...p,
  id: `mock-proj-${idx + 1}`,
  _id: `mock-proj-${idx + 1}`,
  createdAt: new Date(),
  updatedAt: new Date()
}));

const isDbConnected = () => mongoose.connection.readyState === 1;

export class ProjectService {
  static async getAllProjects(filters?: { category?: string; featured?: boolean }): Promise<IProjectDocument[] | any[]> {
    if (isDbConnected()) {
      const query: Record<string, any> = {};
      if (filters?.category) {
        query.category = { $regex: new RegExp(`^${filters.category}$`, 'i') };
      }
      if (typeof filters?.featured === 'boolean') {
        query.featured = filters.featured;
      }
      return await Project.find(query).sort({ createdAt: -1 });
    }

    let results = [...inMemoryProjects];
    if (filters?.category) {
      results = results.filter(
        p => p.category.toLowerCase() === filters.category?.toLowerCase()
      );
    }
    if (typeof filters?.featured === 'boolean') {
      results = results.filter(p => p.featured === filters.featured);
    }
    return results;
  }

  static async getProjectById(id: string): Promise<IProjectDocument | any> {
    if (isDbConnected()) {
      const project = await Project.findById(id);
      if (!project) {
        throw ApiError.notFound(`Project with id ${id} not found`, 'PROJECT_NOT_FOUND');
      }
      return project;
    }

    const project = inMemoryProjects.find(p => p.id === id || p._id === id);
    if (!project) {
      throw ApiError.notFound(`Project with id ${id} not found`, 'PROJECT_NOT_FOUND');
    }
    return project;
  }

  static async createProject(data: IProject): Promise<IProjectDocument | any> {
    if (isDbConnected()) {
      return await Project.create(data);
    }

    const newProject = {
      ...data,
      id: `mock-proj-${Date.now()}`,
      _id: `mock-proj-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryProjects.unshift(newProject);
    return newProject;
  }

  static async updateProject(id: string, data: Partial<IProject>): Promise<IProjectDocument | any> {
    if (isDbConnected()) {
      const project = await Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!project) {
        throw ApiError.notFound(`Project with id ${id} not found`, 'PROJECT_NOT_FOUND');
      }
      return project;
    }

    const index = inMemoryProjects.findIndex(p => p.id === id || p._id === id);
    if (index === -1) {
      throw ApiError.notFound(`Project with id ${id} not found`, 'PROJECT_NOT_FOUND');
    }
    inMemoryProjects[index] = {
      ...inMemoryProjects[index],
      ...data,
      updatedAt: new Date()
    };
    return inMemoryProjects[index];
  }

  static async deleteProject(id: string): Promise<void> {
    if (isDbConnected()) {
      const result = await Project.findByIdAndDelete(id);
      if (!result) {
        throw ApiError.notFound(`Project with id ${id} not found`, 'PROJECT_NOT_FOUND');
      }
      return;
    }

    const index = inMemoryProjects.findIndex(p => p.id === id || p._id === id);
    if (index === -1) {
      throw ApiError.notFound(`Project with id ${id} not found`, 'PROJECT_NOT_FOUND');
    }
    inMemoryProjects.splice(index, 1);
  }
}
