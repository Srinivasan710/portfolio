import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { skillService } from '../services/skillService';
import { Skill } from '../types';
import SkillCard from '../components/SkillCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Database', 'Tools'];

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { data: skills, loading, error, refetch } = useApi<Skill[]>(() => skillService.getAll());

  const filtered =
    activeCategory === 'All'
      ? (skills ?? [])
      : (skills ?? []).filter((s) => s.category === activeCategory);

  const categoryCount = (cat: string) =>
    cat === 'All' ? (skills?.length ?? 0) : (skills?.filter((s) => s.category === cat).length ?? 0);

  return (
    <section id="skills" className="py-6">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">Skills</span>
          <h2 className="display-5 fw-bold mb-3">Technical Expertise</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 540 }}>
            A comprehensive set of technologies I work with to build modern, scalable applications.
          </p>
        </div>

        {/* Category tabs */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm rounded-pill px-4 ${activeCategory === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
              <span className={`badge ms-2 rounded-pill ${activeCategory === cat ? 'bg-white text-primary' : 'bg-secondary'}`}>
                {categoryCount(cat)}
              </span>
            </button>
          ))}
        </div>

        {loading && <LoadingSpinner message="Loading skills..." />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {!loading && !error && (
          <div className="row g-3">
            {filtered.map((skill) => (
              <div key={skill.id} className="col-sm-6 col-lg-4 col-xl-3">
                <SkillCard skill={skill} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
