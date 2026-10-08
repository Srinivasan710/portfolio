import { useApi } from '../hooks/useApi';
import { experienceService } from '../services/experienceService';
import { Experience } from '../types';
import ExperienceCard from '../components/ExperienceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const Experiences = () => {
  const { data: experiences, loading, error, refetch } = useApi<Experience[]>(() =>
    experienceService.getAll()
  );

  return (
    <section id="experience" className="py-6 section-alt">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">Experience</span>
          <h2 className="display-5 fw-bold mb-3">Work History</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 540 }}>
            My professional journey building products across startups and established companies.
          </p>
        </div>

        {loading && <LoadingSpinner message="Loading experience..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {!loading && !error && (
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {(experiences ?? []).length === 0 ? (
              <EmptyState
                title="No experience entries yet"
                message="Work history will appear here once added."
                icon="bi-briefcase"
              />
            ) : (
              (experiences ?? []).map((exp, i) => (
                <ExperienceCard key={exp.id} experience={exp} index={i} />
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experiences;
