import mongoose from 'mongoose';
import { Skill, ISkillDocument } from '../models/Skill.js';
import { ISkill } from '../types/index.js';
import { initialSkills } from '../data/seedData.js';
import { ApiError } from '../utils/apiError.js';

let inMemorySkills: any[] = initialSkills.map((s, idx) => ({
  ...s,
  id: `mock-skill-${idx + 1}`,
  _id: `mock-skill-${idx + 1}`,
  createdAt: new Date(),
  updatedAt: new Date()
}));

const isDbConnected = () => mongoose.connection.readyState === 1;

export class SkillService {
  static async getAllSkills(category?: string): Promise<ISkillDocument[] | any[]> {
    if (isDbConnected()) {
      const query: Record<string, any> = {};
      if (category) {
        query.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }
      return await Skill.find(query).sort({ category: 1, level: -1 });
    }

    let results = [...inMemorySkills];
    if (category) {
      results = results.filter(
        s => s.category.toLowerCase() === category.toLowerCase()
      );
    }
    return results;
  }

  static async getSkillById(id: string): Promise<ISkillDocument | any> {
    if (isDbConnected()) {
      const skill = await Skill.findById(id);
      if (!skill) {
        throw ApiError.notFound(`Skill with id ${id} not found`, 'SKILL_NOT_FOUND');
      }
      return skill;
    }

    const skill = inMemorySkills.find(s => s.id === id || s._id === id);
    if (!skill) {
      throw ApiError.notFound(`Skill with id ${id} not found`, 'SKILL_NOT_FOUND');
    }
    return skill;
  }

  static async createSkill(data: ISkill): Promise<ISkillDocument | any> {
    if (isDbConnected()) {
      return await Skill.create(data);
    }

    const newSkill = {
      ...data,
      id: `mock-skill-${Date.now()}`,
      _id: `mock-skill-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemorySkills.push(newSkill);
    return newSkill;
  }

  static async updateSkill(id: string, data: Partial<ISkill>): Promise<ISkillDocument | any> {
    if (isDbConnected()) {
      const skill = await Skill.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!skill) {
        throw ApiError.notFound(`Skill with id ${id} not found`, 'SKILL_NOT_FOUND');
      }
      return skill;
    }

    const index = inMemorySkills.findIndex(s => s.id === id || s._id === id);
    if (index === -1) {
      throw ApiError.notFound(`Skill with id ${id} not found`, 'SKILL_NOT_FOUND');
    }
    inMemorySkills[index] = {
      ...inMemorySkills[index],
      ...data,
      updatedAt: new Date()
    };
    return inMemorySkills[index];
  }

  static async deleteSkill(id: string): Promise<void> {
    if (isDbConnected()) {
      const result = await Skill.findByIdAndDelete(id);
      if (!result) {
        throw ApiError.notFound(`Skill with id ${id} not found`, 'SKILL_NOT_FOUND');
      }
      return;
    }

    const index = inMemorySkills.findIndex(s => s.id === id || s._id === id);
    if (index === -1) {
      throw ApiError.notFound(`Skill with id ${id} not found`, 'SKILL_NOT_FOUND');
    }
    inMemorySkills.splice(index, 1);
  }
}
