import mongoose, { Document, Schema } from 'mongoose';
import { IEducation } from '../types/index.js';

export interface IEducationDocument extends IEducation, Document {}

const EducationSchema = new Schema<IEducationDocument>(
  {
    college: {
      type: String,
      required: [true, 'College / University name is required'],
      trim: true
    },
    degree: {
      type: String,
      required: [true, 'Degree name is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department / Major is required'],
      trim: true
    },
    year: {
      type: String,
      required: [true, 'Year / Duration is required'],
      trim: true
    },
    cgpa: {
      type: String,
      default: '',
      trim: true
    },
    description: {
      type: String,
      default: '',
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

export const Education = mongoose.model<IEducationDocument>('Education', EducationSchema);
