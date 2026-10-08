import mongoose, { Document, Schema } from 'mongoose';
import { IProfile } from '../types/index.js';

export interface IProfileDocument extends IProfile, Document {}

const ProfileSchema = new Schema<IProfileDocument>(
  {
    personal: {
      name: { type: String, default: 'Srinivasan' },
      profileImage: { type: String, default: '' },
      title: { type: String, default: 'Full-Stack Developer' },
      location: { type: String, default: 'San Francisco, CA' },
      availability: { type: String, default: 'Available for work' },
      email: { type: String, default: 'srinivasan@example.com' },
      phone: { type: String, default: '+1 (555) 123-4567' }
    },
    hero: {
      greeting: { type: String, default: "Hi, I'm" },
      name: { type: String, default: 'Srinivasan' },
      title: { type: String, default: 'Full-Stack Developer' },
      description: {
        type: String,
        default:
          'Specializing in React, TypeScript & Node.js. I build scalable, modern web applications with clean architecture and exceptional user experiences.'
      },
      location: { type: String, default: 'Remote / Hybrid' },
      workType: { type: String, default: 'Full-time / Contract' },
      availabilityBadge: { type: String, default: 'Available for work' },
      projectsBtnText: { type: String, default: 'View My Work' },
      resumeBtnText: { type: String, default: 'Download Resume' },
      resumeUrl: { type: String, default: '/uploads/resume.pdf' }
    },
    about: {
      heading: { type: String, default: 'Who I Am' },
      description: {
        type: String,
        default:
          "I'm a Full-Stack Developer with 5+ years of experience architecting and building high-performance web applications. I specialize in the MERN ecosystem and love bridging the gap between great design and robust engineering.\n\nWhen I'm not coding, I contribute to open-source projects, write technical blog posts, and mentor junior developers. I believe clean code is a form of art."
      },
      careerObjective: {
        type: String,
        default:
          'To continuously push technical boundaries and design resilient full-stack systems that empower users worldwide.'
      },
      interests: {
        type: [String],
        default: ['Open Source', 'Cloud Architecture', 'UI/UX Design', 'DevOps', 'Teaching']
      },
      stats: [
        {
          icon: { type: String, default: 'bi-briefcase-fill' },
          value: { type: String, default: '5+' },
          label: { type: String, default: 'Years Experience' },
          color: { type: String, default: 'primary' }
        },
        {
          icon: { type: String, default: 'bi-folder2-open' },
          value: { type: String, default: '50+' },
          label: { type: String, default: 'Projects Delivered' },
          color: { type: String, default: 'success' }
        },
        {
          icon: { type: String, default: 'bi-people-fill' },
          value: { type: String, default: '30+' },
          label: { type: String, default: 'Happy Clients' },
          color: { type: String, default: 'warning' }
        },
        {
          icon: { type: String, default: 'bi-trophy-fill' },
          value: { type: String, default: '10+' },
          label: { type: String, default: 'Technologies' },
          color: { type: String, default: 'info' }
        }
      ],
      infoFields: [
        { label: { type: String, default: 'Name' }, value: { type: String, default: 'Srinivasan' }, icon: { type: String, default: 'bi-person' } },
        { label: { type: String, default: 'Email' }, value: { type: String, default: 'srinivasan@example.com' }, icon: { type: String, default: 'bi-envelope' } },
        { label: { type: String, default: 'Location' }, value: { type: String, default: 'San Francisco, CA' }, icon: { type: String, default: 'bi-geo-alt' } },
        { label: { type: String, default: 'Education' }, value: { type: String, default: 'B.Tech / B.E in Computer Science' }, icon: { type: String, default: 'bi-mortarboard' } }
      ]
    },
    socials: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      email: { type: String, default: 'srinivasan@example.com' },
      phone: { type: String, default: '+1 (555) 123-4567' },
      other: [
        {
          label: { type: String },
          url: { type: String },
          icon: { type: String }
        }
      ]
    },
    resume: {
      url: { type: String, default: '' },
      filename: { type: String, default: 'resume.pdf' },
      updatedAt: { type: String, default: '' }
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

export const Profile = mongoose.model<IProfileDocument>('Profile', ProfileSchema);
