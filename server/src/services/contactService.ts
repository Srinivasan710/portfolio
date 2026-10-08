import mongoose from 'mongoose';
import { Contact, IContactDocument } from '../models/Contact.js';
import { IContact } from '../types/index.js';
import { ApiError } from '../utils/apiError.js';

let inMemoryContacts: any[] = [];

const isDbConnected = () => mongoose.connection.readyState === 1;

export class ContactService {
  static async createContactMessage(data: IContact): Promise<IContactDocument | any> {
    if (isDbConnected()) {
      try {
        return await Contact.create(data);
      } catch {
        // fallback
      }
    }

    const newContact = {
      ...data,
      id: `mock-contact-${Date.now()}`,
      _id: `mock-contact-${Date.now()}`,
      createdAt: new Date()
    };
    inMemoryContacts.unshift(newContact);
    return newContact;
  }

  static async getAllContactMessages(): Promise<IContactDocument[] | any[]> {
    if (isDbConnected()) {
      try {
        return await Contact.find().sort({ createdAt: -1 });
      } catch {
        // fallback
      }
    }
    return inMemoryContacts;
  }

  static async deleteContactMessage(id: string): Promise<boolean> {
    if (isDbConnected()) {
      try {
        const res = await Contact.findByIdAndDelete(id);
        if (res) {
          inMemoryContacts = inMemoryContacts.filter((c) => c.id !== id && c._id !== id);
          return true;
        }
      } catch {
        // fallback
      }
    }

    const idx = inMemoryContacts.findIndex((c) => c.id === id || c._id === id);
    if (idx === -1) throw ApiError.notFound(`Contact message with ID '${id}' not found`);
    inMemoryContacts.splice(idx, 1);
    return true;
  }
}
