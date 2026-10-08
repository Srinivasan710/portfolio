import { Profile, IProfileDocument } from '../models/Profile.js';
import { initialProfile } from '../data/seedData.js';
import { IProfile } from '../types/index.js';

let inMemoryProfile: IProfile = JSON.parse(JSON.stringify(initialProfile));

export const profileService = {
  async getProfile(): Promise<IProfile> {
    try {
      let profile = await Profile.findOne();
      if (!profile) {
        profile = await Profile.create(initialProfile);
      }
      return profile.toJSON();
    } catch {
      // Database not available, use in-memory profile
      return inMemoryProfile;
    }
  },

  async updateProfile(updates: Partial<IProfile>): Promise<IProfile> {
    try {
      let profile = await Profile.findOne();
      if (!profile) {
        profile = await Profile.create({ ...initialProfile, ...updates });
      } else {
        // Deep merge top-level objects if provided
        if (updates.personal) profile.personal = { ...profile.personal, ...updates.personal };
        if (updates.hero) profile.hero = { ...profile.hero, ...updates.hero };
        if (updates.about) profile.about = { ...profile.about, ...updates.about };
        if (updates.socials) profile.socials = { ...profile.socials, ...updates.socials };
        if (updates.resume) profile.resume = { ...profile.resume, ...updates.resume };

        await profile.save();
      }
      inMemoryProfile = JSON.parse(JSON.stringify(profile.toJSON()));
      return profile.toJSON();
    } catch {
      // In-memory update
      if (updates.personal) inMemoryProfile.personal = { ...inMemoryProfile.personal, ...updates.personal };
      if (updates.hero) inMemoryProfile.hero = { ...inMemoryProfile.hero, ...updates.hero };
      if (updates.about) inMemoryProfile.about = { ...inMemoryProfile.about, ...updates.about };
      if (updates.socials) inMemoryProfile.socials = { ...inMemoryProfile.socials, ...updates.socials };
      if (updates.resume) inMemoryProfile.resume = { ...inMemoryProfile.resume, ...updates.resume };
      inMemoryProfile.updatedAt = new Date();
      return inMemoryProfile;
    }
  }
};
