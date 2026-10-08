import mongoose, { Document, Schema } from 'mongoose';
import { IService } from '../types/index.js';

export interface IServiceDocument extends IService, Document {}

const ServiceSchema = new Schema<IServiceDocument>(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true
    },
    icon: {
      type: String,
      required: [true, 'Service icon is required'],
      trim: true
    },
    technologies: {
      type: [String],
      required: [true, 'Technologies are required'],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

export const Service = mongoose.model<IServiceDocument>('Service', ServiceSchema);
