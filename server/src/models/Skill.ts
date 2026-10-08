import mongoose, { Document, Schema } from 'mongoose';
import { ISkill } from '../types/index.js';

export interface ISkillDocument extends ISkill, Document {}

const SkillSchema = new Schema<ISkillDocument>(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: {
        values: ['Frontend', 'Backend', 'Database', 'Tools'],
        message: '{VALUE} is not a supported category'
      }
    },
    level: {
      type: Number,
      required: [true, 'Proficiency level is required'],
      min: [1, 'Level must be at least 1'],
      max: [100, 'Level cannot exceed 100']
    },
    icon: {
      type: String,
      required: [true, 'Icon class or name is required'],
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

export const Skill = mongoose.model<ISkillDocument>('Skill', SkillSchema);
