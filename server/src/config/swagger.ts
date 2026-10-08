import { Application } from 'express';
import swaggerUi from 'swagger-ui-express';

export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Developer Portfolio REST API',
    version: '1.0.0',
    description: 'Comprehensive RESTful API documentation for Developer Portfolio backend built with Express, TypeScript, and MongoDB.',
    contact: {
      name: 'Developer Portfolio Support',
      email: 'dev@example.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local development server'
    }
  ],
  tags: [
    { name: 'Health', description: 'System health and status endpoints' },
    { name: 'Projects', description: 'Portfolio project showcase management' },
    { name: 'Experiences', description: 'Career work history and experience management' },
    { name: 'Skills', description: 'Technical skills and proficiency levels' },
    { name: 'Services', description: 'Professional consulting and engineering services' },
    { name: 'Contact', description: 'Contact inquiry submissions and messages' }
  ],
  paths: {
    '/api/health': {
      get: {
        tags: ['Health'],
        summary: 'Check API and Database Health Status',
        description: 'Returns server uptime, environment, and MongoDB connection status.',
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                example: {
                  success: true,
                  message: 'Server is healthy and running',
                  data: {
                    status: 'UP',
                    uptime: 120.45,
                    timestamp: '2026-10-08T00:00:00.000Z',
                    database: { status: 'Connected', connected: true },
                    environment: 'development'
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/projects': {
      get: {
        tags: ['Projects'],
        summary: 'Get all projects',
        description: 'Retrieve a list of portfolio projects with optional filtering by category or featured status.',
        parameters: [
          {
            name: 'category',
            in: 'query',
            description: 'Filter projects by category (e.g., Frontend, Backend, Full-Stack)',
            required: false,
            schema: { type: 'string' }
          },
          {
            name: 'featured',
            in: 'query',
            description: 'Filter for featured projects only (true/false)',
            required: false,
            schema: { type: 'boolean' }
          }
        ],
        responses: {
          '200': {
            description: 'Projects retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Project' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Projects'],
        summary: 'Create a new project',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProjectInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Project created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Project' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    },
    '/api/projects/{id}': {
      get: {
        tags: ['Projects'],
        summary: 'Get a project by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Project ID',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Project retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Project' }
                  }
                }
              }
            }
          },
          '404': {
            description: 'Project not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      put: {
        tags: ['Projects'],
        summary: 'Update an existing project',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Project ID',
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProjectInput' }
            }
          }
        },
        responses: {
          '200': {
            description: 'Project updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Project' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '404': {
            description: 'Project not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Projects'],
        summary: 'Delete a project',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Project ID',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Project deleted successfully'
          },
          '404': {
            description: 'Project not found'
          }
        }
      }
    },
    '/api/experiences': {
      get: {
        tags: ['Experiences'],
        summary: 'Get all experiences',
        responses: {
          '200': {
            description: 'Experiences retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Experience' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Experiences'],
        summary: 'Create a new experience entry',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ExperienceInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Experience created successfully'
          },
          '400': {
            description: 'Validation error'
          }
        }
      }
    },
    '/api/experiences/{id}': {
      get: {
        tags: ['Experiences'],
        summary: 'Get an experience by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Experience retrieved' },
          '404': { description: 'Experience not found' }
        }
      },
      put: {
        tags: ['Experiences'],
        summary: 'Update an experience',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ExperienceInput' }
            }
          }
        },
        responses: {
          '200': { description: 'Experience updated' },
          '404': { description: 'Experience not found' }
        }
      },
      delete: {
        tags: ['Experiences'],
        summary: 'Delete an experience',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Experience deleted' },
          '404': { description: 'Experience not found' }
        }
      }
    },
    '/api/skills': {
      get: {
        tags: ['Skills'],
        summary: 'Get all skills',
        parameters: [
          {
            name: 'category',
            in: 'query',
            description: 'Filter skills by category (Frontend, Backend, Database, Tools)',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Skills retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Skill' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Skills'],
        summary: 'Create a new skill',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SkillInput' }
            }
          }
        },
        responses: {
          '201': { description: 'Skill created successfully' },
          '400': { description: 'Validation error' }
        }
      }
    },
    '/api/skills/{id}': {
      get: {
        tags: ['Skills'],
        summary: 'Get a skill by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Skill retrieved' },
          '404': { description: 'Skill not found' }
        }
      },
      put: {
        tags: ['Skills'],
        summary: 'Update a skill',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/SkillInput' } } }
        },
        responses: {
          '200': { description: 'Skill updated' },
          '404': { description: 'Skill not found' }
        }
      },
      delete: {
        tags: ['Skills'],
        summary: 'Delete a skill',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Skill deleted' },
          '404': { description: 'Skill not found' }
        }
      }
    },
    '/api/services': {
      get: {
        tags: ['Services'],
        summary: 'Get all offered services',
        responses: {
          '200': {
            description: 'Services retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Service' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Services'],
        summary: 'Create a new service',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ServiceInput' } } }
        },
        responses: {
          '201': { description: 'Service created successfully' },
          '400': { description: 'Validation error' }
        }
      }
    },
    '/api/services/{id}': {
      get: {
        tags: ['Services'],
        summary: 'Get a service by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Service retrieved' },
          '404': { description: 'Service not found' }
        }
      },
      put: {
        tags: ['Services'],
        summary: 'Update a service',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ServiceInput' } } }
        },
        responses: {
          '200': { description: 'Service updated' },
          '404': { description: 'Service not found' }
        }
      },
      delete: {
        tags: ['Services'],
        summary: 'Delete a service',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Service deleted' },
          '404': { description: 'Service not found' }
        }
      }
    },
    '/api/contact': {
      post: {
        tags: ['Contact'],
        summary: 'Submit a contact message',
        description: 'Accepts inquiry submission from visitor with validation for email and content length.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ContactInput' }
            }
          }
        },
        responses: {
          '201': {
            description: 'Message received and stored',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: { $ref: '#/components/schemas/Contact' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Validation error (invalid email, missing fields)',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      },
      get: {
        tags: ['Contact'],
        summary: 'Get all contact messages',
        responses: {
          '200': {
            description: 'Contact messages retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Contact' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Project: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          image: { type: 'string' },
          technologies: { type: 'array', items: { type: 'string' } },
          githubUrl: { type: 'string' },
          liveUrl: { type: 'string' },
          category: { type: 'string' },
          featured: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      ProjectInput: {
        type: 'object',
        required: ['title', 'description', 'image', 'technologies', 'githubUrl', 'liveUrl', 'category'],
        properties: {
          title: { type: 'string', example: 'CloudFlow - DevOps Platform' },
          description: { type: 'string', example: 'An enterprise task orchestration platform...' },
          image: { type: 'string', example: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71' },
          technologies: { type: 'array', items: { type: 'string' }, example: ['React', 'TypeScript', 'Node.js'] },
          githubUrl: { type: 'string', example: 'https://github.com/developer/cloudflow' },
          liveUrl: { type: 'string', example: 'https://cloudflow-demo.example.com' },
          category: { type: 'string', example: 'Full-Stack' },
          featured: { type: 'boolean', example: true }
        }
      },
      Experience: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          company: { type: 'string' },
          position: { type: 'string' },
          description: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          technologies: { type: 'array', items: { type: 'string' } },
          location: { type: 'string' }
        }
      },
      ExperienceInput: {
        type: 'object',
        required: ['company', 'position', 'description', 'startDate', 'endDate', 'location'],
        properties: {
          company: { type: 'string', example: 'TechCorp Solutions' },
          position: { type: 'string', example: 'Senior Full-Stack Engineer' },
          description: { type: 'string', example: 'Architected modern responsive React web applications...' },
          startDate: { type: 'string', example: '2023' },
          endDate: { type: 'string', example: 'Present' },
          technologies: { type: 'array', items: { type: 'string' }, example: ['React', 'TypeScript', 'Node.js'] },
          location: { type: 'string', example: 'San Francisco, CA' }
        }
      },
      Skill: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          category: { type: 'string', enum: ['Frontend', 'Backend', 'Database', 'Tools'] },
          level: { type: 'number', minimum: 1, maximum: 100 },
          icon: { type: 'string' }
        }
      },
      SkillInput: {
        type: 'object',
        required: ['name', 'category', 'level', 'icon'],
        properties: {
          name: { type: 'string', example: 'React' },
          category: { type: 'string', example: 'Frontend' },
          level: { type: 'number', example: 95 },
          icon: { type: 'string', example: 'bi-code-slash' }
        }
      },
      Service: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          icon: { type: 'string' },
          technologies: { type: 'array', items: { type: 'string' } }
        }
      },
      ServiceInput: {
        type: 'object',
        required: ['title', 'description', 'icon'],
        properties: {
          title: { type: 'string', example: 'Full-Stack Development' },
          description: { type: 'string', example: 'Complete end-to-end web applications...' },
          icon: { type: 'string', example: 'bi-layers' },
          technologies: { type: 'array', items: { type: 'string' }, example: ['React', 'Node.js', 'MongoDB'] }
        }
      },
      Contact: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          subject: { type: 'string' },
          message: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      ContactInput: {
        type: 'object',
        required: ['name', 'email', 'subject', 'message'],
        properties: {
          name: { type: 'string', example: 'Jane Smith' },
          email: { type: 'string', example: 'jane.smith@example.com' },
          subject: { type: 'string', example: 'Project Collaboration Inquiry' },
          message: { type: 'string', example: 'Hi! I reviewed your portfolio and would love to discuss a project.' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed for contact message' },
          error: { type: 'string', example: 'VALIDATION_ERROR' },
          errors: {
            type: 'object',
            additionalProperties: { type: 'string' }
          }
        }
      }
    }
  }
};

export const setupSwagger = (app: Application): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: 'Developer Portfolio API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true
    }
  }));
};
