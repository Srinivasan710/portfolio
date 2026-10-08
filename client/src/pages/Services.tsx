import { useApi } from '../hooks/useApi';
import { serviceService } from '../services/serviceService';
import { Service } from '../types';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const Services = () => {
  const { data: services, loading, error, refetch } = useApi<Service[]>(() => serviceService.getAll());

  return (
    <section id="services" className="py-6 section-alt">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">Services</span>
          <h2 className="display-5 fw-bold mb-3">What I Offer</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 540 }}>
            End-to-end engineering services from UI to database — everything you need to ship.
          </p>
        </div>

        {loading && <LoadingSpinner message="Loading services..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {!loading && !error && (
          <div className="row g-4">
            {(services ?? []).map((service) => (
              <div key={service.id} className="col-sm-6 col-lg-4">
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
