import { Project } from '../types';
import { getMediaUrl } from '../services/api';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => (
  <div className="col-md-6 col-lg-4 d-flex">
    <div className="card h-100 shadow-sm border-0 project-card w-100 rounded-4 overflow-hidden">
      <div className="project-card-img-wrapper position-relative overflow-hidden" style={{ height: 210 }}>
        <img
          src={getMediaUrl(project.image)}
          alt={project.title}
          className="card-img-top project-card-img w-100 h-100 object-fit-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {project.featured && (
          <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 shadow-sm rounded-pill px-3 py-1">
            <i className="bi bi-star-fill me-1"></i>Featured
          </span>
        )}
        <div className="project-card-overlay d-flex align-items-center justify-content-center gap-3">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-light btn-sm rounded-pill px-3 shadow-sm"
            >
              <i className="bi bi-github me-1"></i>Code
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm rounded-pill px-3 shadow-sm"
            >
              <i className="bi bi-box-arrow-up-right me-1"></i>Demo
            </a>
          )}
        </div>
      </div>
      <div className="card-body d-flex flex-column p-4">
        <div className="d-flex align-items-start justify-content-between mb-2">
          <h5 className="card-title mb-0 fw-bold">{project.title}</h5>
          <span className="badge bg-primary-subtle text-primary rounded-pill ms-2 flex-shrink-0">
            {project.category}
          </span>
        </div>
        <p className="card-text text-muted small flex-grow-1 mb-3">{project.description}</p>
        <div className="d-flex flex-wrap gap-1">
          {project.technologies && project.technologies.slice(0, 5).map((tech) => (
            <span key={tech} className="badge bg-dark-subtle text-dark-emphasis rounded-pill">
              {tech}
            </span>
          ))}
          {project.technologies && project.technologies.length > 5 && (
            <span className="badge bg-secondary-subtle text-secondary rounded-pill">
              +{project.technologies.length - 5}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ProjectCard;
