import React, { useEffect, useState } from 'react';
import { profileService } from '../services/profileService';
import { Profile } from '../types';
import { getMediaUrl } from '../services/api';

const About: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    profileService
      .getProfile()
      .then((data) => setProfile(data))
      .catch((err) => console.error('Failed to load profile in About:', err));
  }, []);

  const about = profile?.about;
  const personal = profile?.personal;
  const profileImage = personal?.profileImage ? getMediaUrl(personal.profileImage) : '';

  const heading = about?.heading || 'Who I Am';
  const description =
    about?.description ||
    "I'm a Full-Stack Developer with 5+ years of experience architecting and building high-performance web applications. I specialize in the MERN ecosystem and love bridging the gap between great design and robust engineering.\n\nWhen I'm not coding, I contribute to open-source projects, write technical blog posts, and mentor junior developers. I believe clean code is a form of art.";
  const careerObjective = about?.careerObjective;

  const defaultStats = [
    { icon: 'bi-briefcase-fill', value: '5+', label: 'Years Experience', color: 'primary' },
    { icon: 'bi-folder2-open', value: '50+', label: 'Projects Delivered', color: 'success' },
    { icon: 'bi-people-fill', value: '30+', label: 'Happy Clients', color: 'warning' },
    { icon: 'bi-trophy-fill', value: '10+', label: 'Technologies', color: 'info' },
  ];

  const stats = about?.stats && about.stats.length > 0 ? about.stats : defaultStats;
  const interests = about?.interests && about.interests.length > 0 ? about.interests : ['Open Source', 'Cloud Architecture', 'UI/UX Design', 'DevOps', 'Teaching'];

  const infoFields = about?.infoFields && about.infoFields.length > 0
    ? about.infoFields
    : [
        { label: 'Name', value: personal?.name || 'Srinivasan', icon: 'bi-person' },
        { label: 'Email', value: personal?.email || 'srinivasan@example.com', icon: 'bi-envelope' },
        { label: 'Location', value: personal?.location || 'San Francisco, CA', icon: 'bi-geo-alt' },
        { label: 'Availability', value: personal?.availability || 'Available for work', icon: 'bi-check2-circle' },
      ];

  return (
    <section id="about" className="py-6 section-alt">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">About Me</span>
          <h2 className="display-5 fw-bold mb-3">{heading}</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 580 }}>
            A passionate Full-Stack Developer dedicated to building modern, resilient, and scalable digital solutions.
          </p>
        </div>

        <div className="row g-5 align-items-center">
          {/* Left - image placeholder */}
          <div className="col-lg-5 text-center">
            <div
              className="about-img rounded-4 shadow overflow-hidden mx-auto position-relative d-flex align-items-center justify-content-center"
              style={{
                maxWidth: 420,
                aspectRatio: '4/5',
                background: 'linear-gradient(135deg,#6366f1 0%,#3b82f6 50%,#06b6d4 100%)',
              }}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={personal?.name || 'Profile'}
                  className="w-100 h-100 object-fit-cover"
                />
              ) : (
                <div className="d-flex align-items-center justify-content-center h-100">
                  <i className="bi bi-person-workspace text-white" style={{ fontSize: 120, opacity: 0.75 }}></i>
                </div>
              )}
              {/* Floating card */}
              <div
                className="position-absolute bottom-0 start-0 end-0 p-4 text-start"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}
              >
                <p className="text-white fw-semibold mb-0 fs-5">{personal?.name || 'Srinivasan'}</p>
                <small className="text-white-50">{personal?.title || 'Full-Stack Developer'} · {personal?.location || 'Remote'}</small>
              </div>
            </div>
          </div>

          {/* Right - content */}
          <div className="col-lg-7">
            <h3 className="fw-bold mb-3">Building the Future, One Line at a Time</h3>
            <div className="text-muted mb-4" style={{ whiteSpace: 'pre-line' }}>
              {description}
            </div>

            {careerObjective && (
              <div className="p-3 rounded-3 bg-primary-subtle border-start border-primary border-4 mb-4">
                <h6 className="fw-bold text-primary mb-1">
                  <i className="bi bi-compass me-2"></i>Career Objective
                </h6>
                <p className="mb-0 text-dark small">{careerObjective}</p>
              </div>
            )}

            {/* Info grid */}
            <div className="row g-3 mb-4">
              {infoFields.map((item, idx) => (
                <div key={idx} className="col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <i className={`bi ${item.icon || 'bi-info-circle'} text-primary fs-5`}></i>
                    <span className="text-muted small">{item.label}:</span>
                    <span className="small fw-semibold text-truncate">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Interests */}
            {interests && interests.length > 0 && (
              <div className="mb-4">
                <h6 className="fw-semibold mb-2">Interests & Specializations</h6>
                <div className="d-flex flex-wrap gap-2">
                  {interests.map((i, idx) => (
                    <span key={idx} className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2">
                      {i}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <a
              href="#contact"
              className="btn btn-primary rounded-pill px-4"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <i className="bi bi-chat-dots me-2"></i>Get in Touch
            </a>
          </div>
        </div>

        {/* Stats row */}
        {stats && stats.length > 0 && (
          <div className="row g-4 mt-4">
            {stats.map((s, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <div className="card border-0 shadow-sm text-center p-4 h-100 stat-card">
                  <div className={`mb-3 text-${s.color || 'primary'} fs-2`}>
                    <i className={`bi ${s.icon || 'bi-star'}`}></i>
                  </div>
                  <div className="display-6 fw-bold text-gradient">{s.value}</div>
                  <div className="text-muted small mt-1">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default About;
