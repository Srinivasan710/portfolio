import { Education } from '../models/Education.js';
import { initialEducations } from '../data/seedData.js';
import { IEducation } from '../types/index.js';
import { ApiError } from '../utils/apiError.js';

let inMemoryEducations: any[] = initialEducations.map((e, idx) => ({
  ...e,
  id: `mock-edu-${idx + 1}`,
  _id: `mock-edu-${idx + 1}`,
  createdAt: new Date(),
  updatedAt: new Date()
}));

export const educationService = {
  async getAll(): Promise<IEducation[]> {
    try {
      const educations = await Education.find().sort({ createdAt: -1 });
      if (educations.length > 0) return educations.map((e) => e.toJSON());
      // If collection empty but DB connected, seed initial
      const seeded = await Education.insertMany(initialEducations);
      return seeded.map((e) => e.toJSON());
    } catch {
      return inMemoryEducations;
    }
  },

  async getById(id: string): Promise<IEducation> {
    try {
      const education = await Education.findById(id);
      if (education) return education.toJSON();
    } catch {
      // fallback
    }

    const found = inMemoryEducations.find((e) => e.id === id || e._id === id);
    if (!found) throw ApiError.notFound(`Education entry with ID '${id}' not found`);
    return found;
  },

  async create(data: IEducation): Promise<IEducation> {
    try {
      const newEdu = await Education.create(data);
      const json = newEdu.toJSON();
      inMemoryEducations.unshift(json);
      return json;
    } catch {
      const newEdu = {
        ...data,
        id: `mock-edu-${Date.now()}`,
        _id: `mock-edu-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      inMemoryEducations.unshift(newEdu);
      return newEdu;
    }
  },

  async update(id: string, updates: Partial<IEducation>): Promise<IEducation> {
    try {
      const updated = await Education.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
      });
      if (updated) {
        const json = updated.toJSON();
        const idx = inMemoryEducations.findIndex((e) => e.id === id || e._id === id);
        if (idx !== -1) inMemoryEducations[idx] = json;
        return json;
      }
    } catch {
      // fallback
    }

    const idx = inMemoryEducations.findIndex((e) => e.id === id || e._id === id);
    if (idx === -1) throw ApiError.notFound(`Education entry with ID '${id}' not found`);
    inMemoryEducations[idx] = {
      ...inMemoryEducations[idx],
      ...updates,
      updatedAt: new Date()
    };
    return inMemoryEducations[idx];
  },

  async delete(id: string): Promise<boolean> {
    try {
      const res = await Education.findByIdAndDelete(id);
      if (res) {
        inMemoryEducations = inMemoryEducations.filter((e) => e.id !== id && e._id !== id);
        return true;
      }
    } catch {
      // fallback
    }

    const idx = inMemoryEducations.findIndex((e) => e.id === id || e._id === id);
    if (idx === -1) throw ApiError.notFound(`Education entry with ID '${id}' not found`);
    inMemoryEducations.splice(idx, 1);
    return true;
  }
};
