import React, { useEffect, useState } from 'react';
import { profileService } from '../services/profileService';
import { Profile } from '../types';
import { getMediaUrl } from '../services/api';

const Hero: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    profileService
      .getProfile()
      .then((data) => setProfile(data))
      .catch((err) => console.error('Failed to load profile:', err));
  }, []);

  const handleScroll = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const hero = profile?.hero;
  const personal = profile?.personal;
  const socials = profile?.socials;
  const resumeUrl = hero?.resumeUrl || profile?.resume?.url || '';

  const name = hero?.name || personal?.name || 'Srinivasan';
  const greeting = hero?.greeting || "Hi, I'm";
  const title = hero?.title || personal?.title || 'Full-Stack Developer';
  const description =
    hero?.description ||
    'Specializing in React, TypeScript & Node.js. I build scalable, modern web applications with clean architecture and exceptional user experiences.';
  const availabilityBadge = hero?.availabilityBadge || personal?.availability || 'Available for work';
  const projectsBtnText = hero?.projectsBtnText || 'View My Work';
  const resumeBtnText = hero?.resumeBtnText || 'Download Resume';
  const profileImage = personal?.profileImage ? getMediaUrl(personal.profileImage) : '';

  return (
    <section
      id="home"
      className="hero-section d-flex align-items-center min-vh-100 position-relative overflow-hidden"
    >
      {/* Background decoration */}
      <div
        className="hero-bg-blob blob-1 position-absolute rounded-circle opacity-10 bg-primary"
        style={{ width: 500, height: 500, top: '-10%', right: '-10%', filter: 'blur(80px)' }}
      ></div>
      <div
        className="hero-bg-blob blob-2 position-absolute rounded-circle opacity-10 bg-info"
        style={{ width: 300, height: 300, bottom: '10%', left: '-5%', filter: 'blur(60px)' }}
      ></div>

      <div className="container position-relative z-1 py-5">
        <div className="row align-items-center g-5">
          {/* Text content */}
          <div className="col-lg-7 text-center text-lg-start">
            <div className="mb-3">
              <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fs-6 shadow-sm">
                <i
                  className="bi bi-circle-fill me-2"
                  style={{ fontSize: 8, verticalAlign: 'middle', color: '#22c55e' }}
                ></i>
                {availabilityBadge}
              </span>
            </div>
            <h1 className="display-3 fw-bold lh-sm mb-3">
              {greeting}{' '}
              <span className="text-gradient">{name}</span>
            </h1>
            <h2 className="h3 text-primary fw-semibold mb-4">{title}</h2>
            <p className="lead text-muted mb-5" style={{ maxWidth: 580 }}>
              {description}
            </p>

            <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start mb-5">
              <button
                className="btn btn-primary btn-lg px-5 rounded-pill shadow"
                onClick={() => handleScroll('#projects')}
              >
                <i className="bi bi-grid me-2"></i>
                {projectsBtnText}
              </button>

              {resumeUrl ? (
                <a
                  href={getMediaUrl(resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="btn btn-outline-primary btn-lg px-5 rounded-pill"
                >
                  <i className="bi bi-file-earmark-arrow-down me-2"></i>
                  {resumeBtnText}
                </a>
              ) : (
                <button
                  className="btn btn-outline-primary btn-lg px-5 rounded-pill"
                  onClick={() => handleScroll('#contact')}
                >
                  <i className="bi bi-envelope me-2"></i>Contact Me
                </button>
              )}
            </div>

            {/* Social icons */}
            <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
              {[
                { icon: 'bi-github', href: socials?.github || 'https://github.com' },
                { icon: 'bi-linkedin', href: socials?.linkedin || 'https://linkedin.com' },
                { icon: 'bi-instagram', href: socials?.instagram },
                { icon: 'bi-twitter-x', href: socials?.twitter || 'https://twitter.com' },
                { icon: 'bi-envelope-fill', href: `mailto:${socials?.email || personal?.email || 'srinivasan@example.com'}` },
              ]
                .filter((s) => Boolean(s.href))
                .map((s) => (
                  <a
                    key={s.icon}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-secondary rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 44, height: 44, fontSize: 18 }}
                  >
                    <i className={`bi ${s.icon}`}></i>
                  </a>
                ))}
            </div>
          </div>

          {/* Avatar */}
          <div className="col-lg-5 text-center">
            <div className="hero-avatar-wrapper position-relative d-inline-block">
              <div
                className="hero-avatar-ring position-absolute rounded-circle"
                style={{
                  inset: -16,
                  border: '2px dashed',
                  borderColor: 'var(--bs-primary)',
                  opacity: 0.3,
                }}
              ></div>
              <div
                className="hero-avatar rounded-circle overflow-hidden shadow-lg mx-auto d-flex align-items-center justify-content-center"
                style={{
                  width: 320,
                  height: 320,
                  background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
                }}
              >
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={name}
                    className="w-100 h-100 object-fit-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <i className="bi bi-person-fill text-white" style={{ fontSize: 160, opacity: 0.85 }}></i>
                )}
              </div>
              {/* Floating badges */}
              <div
                className="position-absolute top-0 start-0 bg-body shadow rounded-3 px-3 py-2 d-flex align-items-center gap-2"
                style={{ transform: 'translate(-15px, 20px)' }}
              >
                <i className="bi bi-code-slash text-primary fs-5"></i>
                <span className="small fw-semibold">{personal?.location || 'San Francisco, CA'}</span>
              </div>
              <div
                className="position-absolute bottom-0 end-0 bg-body shadow rounded-3 px-3 py-2 d-flex align-items-center gap-2"
                style={{ transform: 'translate(15px, -20px)' }}
              >
                <i className="bi bi-check-circle-fill text-success fs-5"></i>
                <span className="small fw-semibold">{hero?.workType || 'Open for Roles'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="position-absolute bottom-0 start-50 translate-middle-x pb-4">
        <button
          className="btn btn-link text-muted p-0 scroll-down-btn"
          onClick={() => handleScroll('#about')}
        >
          <i className="bi bi-chevron-double-down fs-4 d-block" style={{ animation: 'bounce 1.5s infinite' }}></i>
        </button>
      </div>
    </section>
  );
};

export default Hero;
