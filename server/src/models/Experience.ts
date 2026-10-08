import mongoose, { Document, Schema } from 'mongoose';
import { IExperience } from '../types/index.js';

export interface IExperienceDocument extends IExperience, Document {}

const ExperienceSchema = new Schema<IExperienceDocument>(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    position: {
      type: String,
      required: [true, 'Position title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true
    },
    startDate: {
      type: String,
      required: [true, 'Start date is required'],
      trim: true
    },
    endDate: {
      type: String,
      required: [true, 'End date is required'],
      trim: true
    },
    technologies: {
      type: [String],
      required: [true, 'Technologies list is required'],
      default: []
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true
    },
    certificateUrl: {
      type: String,
      default: '',
      trim: true
    },
    type: {
      type: String,
      default: 'Job',
      trim: true
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

export const Experience = mongoose.model<IExperienceDocument>('Experience', ExperienceSchema);
