import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { projectService } from '../services/projectService';
import { Project } from '../types';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const FILTERS = ['All', 'Full-Stack', 'Frontend', 'Backend', 'Database'];

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const { data: projects, loading, error, refetch } = useApi<Project[]>(() => projectService.getAll());

  const filtered =
    activeFilter === 'All'
      ? (projects ?? [])
      : (projects ?? []).filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-6">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">Projects</span>
          <h2 className="display-5 fw-bold mb-3">My Work</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 540 }}>
            A selection of projects I've built — from enterprise platforms to open-source tools.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`btn btn-sm rounded-pill px-4 ${activeFilter === f ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && <LoadingSpinner message="Loading projects..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            title="No projects found"
            message={`No projects match the "${activeFilter}" category.`}
            icon="bi-folder2-open"
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="row g-4">
            {filtered.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
