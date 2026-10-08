import { Skill } from '../types';

interface SkillCardProps {
  skill: Skill;
}

const categoryColors: Record<string, string> = {
  Frontend: 'primary',
  Backend: 'success',
  Database: 'warning',
  Tools: 'info',
};

const SkillCard = ({ skill }: SkillCardProps) => {
  const color = categoryColors[skill.category] ?? 'secondary';
  return (
    <div className="skill-card p-3 rounded-3 bg-body border border-1 h-100">
      <div className="d-flex align-items-center gap-3 mb-3">
        <div className={`skill-icon bg-${color}-subtle text-${color} rounded-circle d-flex align-items-center justify-content-center`}
          style={{ width: 44, height: 44, fontSize: 20, flexShrink: 0 }}>
          <i className={`bi ${skill.icon}`}></i>
        </div>
        <div className="flex-grow-1 min-w-0">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="fw-semibold">{skill.name}</span>
            <span className={`badge bg-${color}-subtle text-${color} rounded-pill`}>{skill.level}%</span>
          </div>
          <div className="progress" style={{ height: 6 }}>
            <div
              className={`progress-bar bg-${color}`}
              role="progressbar"
              style={{ width: `${skill.level}%` }}
              aria-valuenow={skill.level}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
