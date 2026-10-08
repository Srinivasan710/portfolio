import React from 'react';
import { useApi } from '../hooks/useApi';
import { educationService } from '../services/educationService';
import { Education as IEducation } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const Education: React.FC = () => {
  const { data: educations, loading, error, refetch } = useApi<IEducation[]>(
    () => educationService.getAll()
  );

  return (
    <section id="education" className="py-6 section-alt">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">
            Academics & Qualifications
          </span>
          <h2 className="display-5 fw-bold mb-3">Education</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 580 }}>
            My academic journey, technical foundational training, and degree accomplishments.
          </p>
        </div>

        {loading && <LoadingSpinner message="Loading education history..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {!loading && !error && (!educations || educations.length === 0) && (
          <EmptyState
            title="No education records found"
            message="Education history will appear here once added in the Admin Panel."
          />
        )}

        {!loading && !error && educations && educations.length > 0 && (
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="d-flex flex-column gap-4">
                {educations.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="card border-0 shadow-sm rounded-4 p-4 p-md-5 hover-lift transition-all"
                  >
                    <div className="row align-items-center g-3">
                      <div className="col-md-8">
                        <div className="d-flex align-items-center gap-3 mb-2">
                          <div
                            className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                            style={{ width: 50, height: 50, fontSize: 22 }}
                          >
                            <i className="bi bi-mortarboard-fill"></i>
                          </div>
                          <div>
                            <h4 className="fw-bold mb-0 text-gradient">{edu.degree}</h4>
                            <div className="text-primary fw-semibold">{edu.department}</div>
                          </div>
                        </div>

                        <h5 className="text-body fw-bold mt-3 mb-2">
                          <i className="bi bi-buildings me-2 text-muted"></i>
                          {edu.college}
                        </h5>

                        {edu.description && (
                          <p className="text-muted mb-0 mt-2" style={{ whiteSpace: 'pre-line' }}>
                            {edu.description}
                          </p>
                        )}
                      </div>

                      <div className="col-md-4 text-md-end">
                        <span className="badge bg-body-secondary text-body rounded-pill px-3 py-2 fs-6 mb-2 d-inline-block shadow-sm">
                          <i className="bi bi-calendar3 me-2 text-primary"></i>
                          {edu.year}
                        </span>

                        {edu.cgpa && (
                          <div className="mt-2">
                            <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 fs-6">
                              <i className="bi bi-award-fill me-1"></i>
                              Score / CGPA: <strong>{edu.cgpa}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Education;
