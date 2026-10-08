// Shared TypeScript types for API responses and models

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Profile {
  personal: {
    name: string;
    profileImage: string;
    title: string;
    location: string;
    availability: string;
    email: string;
    phone: string;
  };
  hero: {
    greeting: string;
    name: string;
    title: string;
    description: string;
    location: string;
    workType: string;
    availabilityBadge: string;
    projectsBtnText: string;
    resumeBtnText: string;
    resumeUrl: string;
  };
  about: {
    heading: string;
    description: string;
    careerObjective: string;
    interests: string[];
    stats: {
      icon: string;
      value: string;
      label: string;
      color: string;
    }[];
    infoFields: {
      label: string;
      value: string;
      icon: string;
    }[];
  };
  socials: {
    github: string;
    linkedin: string;
    instagram: string;
    twitter: string;
    email: string;
    phone: string;
    other: {
      label: string;
      url: string;
      icon: string;
    }[];
  };
  resume: {
    url: string;
    filename: string;
    updatedAt?: string;
  };
  updatedAt?: string;
}

export interface Education {
  id: string;
  college: string;
  degree: string;
  department: string;
  year: string;
  cgpa: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  category: string;
  featured: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  technologies: string[];
  location: string;
  certificateUrl?: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools' | string;
  level: number;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  technologies: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactMessage extends ContactFormData {
  id: string;
  createdAt?: string;
}

export interface HealthStatus {
  status: string;
  uptime: number;
  timestamp: string;
  database: {
    status: string;
    connected: boolean;
  };
  environment: string;
}
