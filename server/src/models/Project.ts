import mongoose, { Document, Schema } from 'mongoose';
import { IProject } from '../types/index.js';

export interface IProjectDocument extends IProject, Document {}

const ProjectSchema = new Schema<IProjectDocument>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true
    },
    image: {
      type: String,
      required: [true, 'Project image URL is required'],
      trim: true
    },
    technologies: {
      type: [String],
      required: [true, 'At least one technology is required'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Technologies array cannot be empty'
      }
    },
    githubUrl: {
      type: String,
      required: [true, 'GitHub URL is required'],
      trim: true
    },
    liveUrl: {
      type: String,
      required: [true, 'Live demo URL is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      trim: true
    },
    featured: {
      type: Boolean,
      default: false
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

export const Project = mongoose.model<IProjectDocument>('Project', ProjectSchema);
