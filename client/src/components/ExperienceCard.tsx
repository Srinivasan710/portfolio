import { Experience } from '../types';
import { getMediaUrl } from '../services/api';

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

const ExperienceCard = ({ experience, index }: ExperienceCardProps) => (
  <div className="timeline-item d-flex gap-4 mb-5">
    <div className="timeline-connector d-flex flex-column align-items-center">
      <div
        className="timeline-dot bg-primary text-white d-flex align-items-center justify-content-center rounded-circle fw-bold flex-shrink-0 shadow-sm"
        style={{ width: 44, height: 44, fontSize: 16 }}
      >
        {index + 1}
      </div>
      <div className="timeline-line flex-grow-1 bg-primary opacity-25" style={{ width: 2, minHeight: 40, marginTop: 4 }}></div>
    </div>
    <div className="card border-0 shadow-sm flex-grow-1 mb-2 rounded-4">
      <div className="card-body p-4">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <h5 className="fw-bold mb-0">{experience.position}</h5>
              {experience.type && (
                <span className={`badge rounded-pill ${experience.type.toLowerCase().includes('intern') ? 'bg-warning-subtle text-warning-emphasis' : 'bg-info-subtle text-info-emphasis'}`}>
                  {experience.type}
                </span>
              )}
            </div>
            <p className="text-primary fw-semibold mb-0">
              <i className="bi bi-building me-2"></i>{experience.company}
            </p>
          </div>
          <div className="text-md-end">
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-1 d-inline-block">
              <i className="bi bi-calendar3 me-1"></i>
              {experience.startDate} – {experience.endDate}
            </span>
            {experience.location && (
              <div className="small text-muted">
                <i className="bi bi-geo-alt me-1"></i>{experience.location}
              </div>
            )}
          </div>
        </div>
        <p className="text-muted mb-3" style={{ whiteSpace: 'pre-line' }}>{experience.description}</p>
        
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 pt-2 border-top">
          <div className="d-flex flex-wrap gap-2">
            {experience.technologies && experience.technologies.map((tech) => (
              <span key={tech} className="badge bg-dark-subtle text-dark-emphasis rounded-pill">
                {tech}
              </span>
            ))}
          </div>

          {experience.certificateUrl && (
            <a
              href={getMediaUrl(experience.certificateUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-outline-primary rounded-pill px-3"
            >
              <i className="bi bi-file-earmark-check me-1"></i>
              View Certificate / Letter
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ExperienceCard;
