import { IProject, IExperience, ISkill, IService, IEducation, IProfile } from '../types/index.js';

export const initialProfile: IProfile = {
  personal: {
    name: 'Srinivasan',
    profileImage: '/uploads/profile.jpg',
    title: 'Full-Stack Developer',
    location: 'San Francisco, CA',
    availability: 'Available for work',
    email: 'srinivasan@example.com',
    phone: '+1 (555) 123-4567'
  },
  hero: {
    greeting: "Hi, I'm",
    name: 'Srinivasan',
    title: 'Full-Stack Developer',
    description: 'Specializing in React, TypeScript & Node.js. I build scalable, modern web applications with clean architecture and exceptional user experiences.',
    location: 'San Francisco, CA',
    workType: 'Remote / Hybrid',
    availabilityBadge: 'Available for work',
    projectsBtnText: 'View My Work',
    resumeBtnText: 'Download Resume',
    resumeUrl: ''
  },
  about: {
    heading: 'Who I Am',
    description: "I'm a Full-Stack Developer with 5+ years of experience architecting and building high-performance web applications. I specialize in the MERN ecosystem and love bridging the gap between great design and robust engineering.\n\nWhen I'm not coding, I contribute to open-source projects, write technical blog posts, and mentor junior developers. I believe clean code is a form of art.",
    careerObjective: 'To continuously push technical boundaries and design resilient full-stack systems that empower users worldwide.',
    interests: ['Open Source', 'Cloud Architecture', 'UI/UX Design', 'DevOps', 'Teaching'],
    stats: [
      { icon: 'bi-briefcase-fill', value: '5+', label: 'Years Experience', color: 'primary' },
      { icon: 'bi-folder2-open', value: '50+', label: 'Projects Delivered', color: 'success' },
      { icon: 'bi-people-fill', value: '30+', label: 'Happy Clients', color: 'warning' },
      { icon: 'bi-trophy-fill', value: '10+', label: 'Technologies', color: 'info' }
    ],
    infoFields: [
      { label: 'Name', value: 'Srinivasan', icon: 'bi-person' },
      { label: 'Email', value: 'srinivasan@example.com', icon: 'bi-envelope' },
      { label: 'Location', value: 'San Francisco, CA', icon: 'bi-geo-alt' },
      { label: 'Education', value: 'B.Tech / B.E in Computer Science', icon: 'bi-mortarboard' }
    ]
  },
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    email: 'srinivasan@example.com',
    phone: '+1 (555) 123-4567',
    other: []
  },
  resume: {
    url: '',
    filename: 'resume.pdf',
    updatedAt: new Date().toISOString()
  }
};

export const initialEducations: IEducation[] = [
  {
    college: 'National Institute of Technology / University',
    degree: 'Bachelor of Technology (B.Tech)',
    department: 'Computer Science & Engineering',
    year: '2017 - 2021',
    cgpa: '8.8 / 10.0',
    description: 'Specialized in Algorithms, Distributed Systems, Software Engineering, and Database Management Systems. Led the Web Development Club and participated in national hackathons.'
  },
  {
    college: 'Higher Secondary School',
    degree: 'Higher Secondary Certificate (HSC / 12th)',
    department: 'Computer Science & Mathematics',
    year: '2015 - 2017',
    cgpa: '92.5%',
    description: 'Graduated with Distinction in Mathematics, Physics, and Computer Science fundamentals.'
  }
];

export const initialProjects: IProject[] = [
  {
    title: 'CloudFlow - DevOps & Task Orchestration',
    description: 'An enterprise task orchestration and DevOps management platform featuring real-time build telemetry, task assignment, automated workflow pipelines, and audit logging.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Docker'],
    githubUrl: 'https://github.com/developer/cloudflow',
    liveUrl: 'https://cloudflow-demo.example.com',
    category: 'Full-Stack',
    featured: true
  },
  {
    title: 'DevConnect - Developer Community & Code Hub',
    description: 'A social network and code sharing platform for software engineers. Includes interactive snippet previews, syntax highlighting, thread discussions, and profile portfolios.',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'TypeScript', 'Bootstrap 5', 'Express', 'MongoDB'],
    githubUrl: 'https://github.com/developer/devconnect',
    liveUrl: 'https://devconnect-demo.example.com',
    category: 'Full-Stack',
    featured: true
  },
  {
    title: 'API Fortress - OpenAPI Gateway & Health Monitor',
    description: 'Comprehensive API gateway and microservice monitor with automatic Swagger generation, latency metrics tracking, request throttling, and payload schema validation.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    technologies: ['Node.js', 'Express', 'TypeScript', 'Swagger', 'Mongoose'],
    githubUrl: 'https://github.com/developer/api-fortress',
    liveUrl: 'https://apifortress-demo.example.com',
    category: 'Backend',
    featured: true
  },
  {
    title: 'ShopSphere - E-Commerce Analytics Dashboard',
    description: 'A responsive administrative dashboard for e-commerce vendors providing real-time sales charts, inventory reorder alarms, revenue projections, and order fulfillment states.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'TypeScript', 'Bootstrap 5', 'Chart.js', 'Axios'],
    githubUrl: 'https://github.com/developer/shopsphere',
    liveUrl: 'https://shopsphere-demo.example.com',
    category: 'Frontend',
    featured: false
  },
  {
    title: 'MongoScale - Sharding & Index Optimizer',
    description: 'CLI and web utility to inspect MongoDB collections, profile slow queries, recommend compound indexes, and simulate cluster throughput benchmarks.',
    image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    technologies: ['MongoDB', 'Mongoose', 'Node.js', 'TypeScript'],
    githubUrl: 'https://github.com/developer/mongoscale',
    liveUrl: 'https://mongoscale-demo.example.com',
    category: 'Database',
    featured: false
  },
  {
    title: 'PulseChat - Real-Time Collaborative Workspace',
    description: 'High-speed instant messaging and document co-editing workspace with encrypted channel rooms, markdown previews, message reactions, and user presence indicators.',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80',
    technologies: ['React', 'Bootstrap 5', 'Node.js', 'Express', 'WebSocket'],
    githubUrl: 'https://github.com/developer/pulsechat',
    liveUrl: 'https://pulsechat-demo.example.com',
    category: 'Full-Stack',
    featured: false
  }
];

export const initialExperiences: IExperience[] = [
  {
    company: 'TechCorp Solutions',
    position: 'Senior Full-Stack Engineer',
    description: 'Architected modern responsive React web applications and high-throughput Express microservices. Mentored junior developers, improved test coverage to 92%, and managed MongoDB database optimization.',
    startDate: '2023',
    endDate: 'Present',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Swagger'],
    location: 'San Francisco, CA (Remote)',
    certificateUrl: 'https://example.com/certificates/techcorp',
    type: 'Job'
  },
  {
    company: 'NextGen Innovations',
    position: 'Full-Stack Developer',
    description: 'Developed customer-facing dashboard features using React, Bootstrap, and Node.js REST APIs. Integrated Swagger OpenAPI documentation and streamlined client-server data flow with Axios.',
    startDate: '2021',
    endDate: '2023',
    technologies: ['React', 'Bootstrap 5', 'Express.js', 'REST APIs', 'Mongoose'],
    location: 'Austin, TX',
    certificateUrl: 'https://example.com/certificates/nextgen',
    type: 'Job'
  },
  {
    company: 'Digital Wave Agency',
    position: 'Frontend Developer Intern',
    description: 'Built responsive, accessible mobile-friendly web portals and client websites using modern HTML5, CSS3, JavaScript, and React. Collaborated closely with UI/UX designers and product managers.',
    startDate: '2020',
    endDate: '2021',
    technologies: ['JavaScript', 'HTML5', 'CSS3', 'Bootstrap', 'Git'],
    location: 'New York, NY',
    certificateUrl: 'https://example.com/certificates/digitalwave',
    type: 'Internship'
  }
];

export const initialSkills: ISkill[] = [
  // Frontend
  { name: 'React', category: 'Frontend', level: 95, icon: 'bi-code-slash' },
  { name: 'TypeScript', category: 'Frontend', level: 90, icon: 'bi-filetype-tsx' },
  { name: 'JavaScript', category: 'Frontend', level: 95, icon: 'bi-filetype-js' },
  { name: 'HTML5', category: 'Frontend', level: 95, icon: 'bi-filetype-html' },
  { name: 'CSS3', category: 'Frontend', level: 90, icon: 'bi-filetype-css' },
  { name: 'Bootstrap', category: 'Frontend', level: 92, icon: 'bi-bootstrap-fill' },

  // Backend
  { name: 'Node.js', category: 'Backend', level: 90, icon: 'bi-hdd-network' },
  { name: 'Express.js', category: 'Backend', level: 90, icon: 'bi-server' },
  { name: 'REST APIs', category: 'Backend', level: 95, icon: 'bi-arrow-left-right' },

  // Database
  { name: 'MongoDB', category: 'Database', level: 88, icon: 'bi-database' },
  { name: 'Mongoose', category: 'Database', level: 88, icon: 'bi-diagram-3' },

  // Tools
  { name: 'Git', category: 'Tools', level: 92, icon: 'bi-git' },
  { name: 'GitHub', category: 'Tools', level: 90, icon: 'bi-github' },
  { name: 'Swagger', category: 'Tools', level: 88, icon: 'bi-journal-code' },
  { name: 'Postman', category: 'Tools', level: 85, icon: 'bi-send-check' },
  { name: 'VS Code', category: 'Tools', level: 95, icon: 'bi-terminal' }
];

export const initialServices: IService[] = [
  {
    title: 'Frontend Development',
    description: 'Modern, performant, and responsive single page applications engineered with React, TypeScript, and Bootstrap 5.',
    icon: 'bi-window-desktop',
    technologies: ['React', 'TypeScript', 'Bootstrap 5', 'HTML5', 'CSS3']
  },
  {
    title: 'Backend Development',
    description: 'Robust server-side architecture and microservices using Node.js, Express, and TypeScript with secure authentication and logging.',
    icon: 'bi-server',
    technologies: ['Node.js', 'Express.js', 'TypeScript', 'REST APIs']
  },
  {
    title: 'Full-Stack Development',
    description: 'Complete end-to-end web applications combining slick client-side interactivity with scalable server systems and databases.',
    icon: 'bi-layers',
    technologies: ['React', 'Express.js', 'MongoDB', 'TypeScript']
  },
  {
    title: 'REST API Development',
    description: 'Secure, clean, self-documenting RESTful APIs engineered with interactive Swagger / OpenAPI 3.0 specifications.',
    icon: 'bi-arrow-left-right',
    technologies: ['REST APIs', 'Swagger', 'OpenAPI', 'Express.js']
  },
  {
    title: 'Database Design',
    description: 'High-performance schema modeling, aggregation pipelines, indexing, and transactional integrity with MongoDB and Mongoose.',
    icon: 'bi-database',
    technologies: ['MongoDB', 'Mongoose', 'Schema Modeling', 'Query Optimization']
  },
  {
    title: 'Responsive Web Development',
    description: 'Pixel-perfect, mobile-first design ensuring flawless usability and adaptive layout across phones, tablets, and desktops.',
    icon: 'bi-phone',
    technologies: ['Responsive Design', 'Bootstrap 5', 'Flexbox & Grid', 'Mobile First']
  }
];
