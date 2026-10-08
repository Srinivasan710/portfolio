import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Project } from '../models/Project.js';
import { Experience } from '../models/Experience.js';
import { Skill } from '../models/Skill.js';
import { Service } from '../models/Service.js';
import {
  initialProjects,
  initialExperiences,
  initialSkills,
  initialServices
} from '../data/seedData.js';

dotenv.config();

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

  console.log(`Connecting to MongoDB at ${uri}...`);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB successfully.');

    console.log('Purging existing data...');
    await Promise.all([
      Project.deleteMany({}),
      Experience.deleteMany({}),
      Skill.deleteMany({}),
      Service.deleteMany({})
    ]);

    console.log('Seeding projects...');
    await Project.insertMany(initialProjects);

    console.log('Seeding experiences...');
    await Experience.insertMany(initialExperiences);

    console.log('Seeding skills...');
    await Skill.insertMany(initialSkills);

    console.log('Seeding services...');
    await Service.insertMany(initialServices);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Database seeding failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seedDatabase();
