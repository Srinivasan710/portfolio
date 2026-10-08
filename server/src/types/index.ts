export interface IProject {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  category: string;
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IExperience {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string;
  technologies: string[];
  location: string;
  certificateUrl?: string;
  type?: string; // e.g. 'Job', 'Internship'
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEducation {
  college: string;
  degree: string;
  department: string;
  year: string;
  cgpa: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISkill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Tools' | string;
  level: number; // 1-100 percentage
  icon: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IService {
  title: string;
  description: string;
  icon: string;
  technologies: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IContact {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Date;
}

export interface IProfile {
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
  updatedAt?: Date;
}

export interface IUser {
  username: string;
  email: string;
  password?: string;
  role: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
}
