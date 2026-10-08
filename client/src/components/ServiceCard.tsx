import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

const iconColorMap: Record<string, string> = {
  'bi-window-desktop': 'primary',
  'bi-server': 'success',
  'bi-layers': 'purple',
  'bi-arrow-left-right': 'warning',
  'bi-database': 'danger',
  'bi-phone': 'info',
};

const ServiceCard = ({ service }: ServiceCardProps) => {
  const color = iconColorMap[service.icon] ?? 'primary';
  const isPurple = color === 'purple';

  return (
    <div className="card h-100 border-0 shadow-sm service-card">
      <div className="card-body p-4 d-flex flex-column">
        <div
          className="service-icon mb-4 d-flex align-items-center justify-content-center rounded-3"
          style={{
            width: 60,
            height: 60,
            fontSize: 28,
            backgroundColor: isPurple ? 'rgba(111,66,193,0.12)' : undefined,
            color: isPurple ? '#6f42c1' : undefined,
          }}
        >
          <i
            className={`bi ${service.icon} ${!isPurple ? `text-${color}` : ''}`}
            style={!isPurple ? { backgroundColor: `var(--bs-${color}-bg-subtle, #f0f0f0)`, padding: '14px', borderRadius: '12px' } : {}}
          ></i>
        </div>
        <h5 className="fw-bold mb-2">{service.title}</h5>
        <p className="text-muted flex-grow-1 mb-3">{service.description}</p>
        <div className="d-flex flex-wrap gap-1 mt-auto">
          {service.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="badge bg-light text-dark border rounded-pill small">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
