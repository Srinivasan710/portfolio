import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileService } from '../services/profileService';
import { Profile } from '../types';

const Footer = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    profileService
      .getProfile()
      .then((data) => setProfile(data))
      .catch(() => {});
  }, []);

  const name = profile?.personal?.name || profile?.hero?.name || 'Srinivasan';
  const title = profile?.personal?.title || profile?.hero?.title || 'Full-Stack Developer';
  const socials = profile?.socials;
  const email = socials?.email || profile?.personal?.email || 'srinivasan@example.com';

  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row g-4 align-items-center">
          <div className="col-md-4 text-center text-md-start">
            <h5 className="fw-bold text-primary mb-2">
              <i className="bi bi-code-slash me-2"></i>{name}
            </h5>
            <p className="text-muted small mb-0">
              {title}
            </p>
          </div>
          <div className="col-md-4 text-center">
            <div className="d-flex justify-content-center gap-3 fs-5">
              {socials?.github && (
                <a href={socials.github} target="_blank" rel="noopener noreferrer" className="text-muted hover-primary text-decoration-none">
                  <i className="bi bi-github"></i>
                </a>
              )}
              {socials?.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted hover-primary text-decoration-none">
                  <i className="bi bi-linkedin"></i>
                </a>
              )}
              {socials?.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-muted hover-primary text-decoration-none">
                  <i className="bi bi-instagram"></i>
                </a>
              )}
              {socials?.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-muted hover-primary text-decoration-none">
                  <i className="bi bi-twitter-x"></i>
                </a>
              )}
              <a href={`mailto:${email}`} className="text-muted hover-primary text-decoration-none">
                <i className="bi bi-envelope"></i>
              </a>
            </div>
          </div>
          <div className="col-md-4 text-center text-md-end">
            <p className="text-muted small mb-1">
              © {new Date().getFullYear()} {name}. All rights reserved.
            </p>
            <div className="small">
              <Link to="/admin" className="text-muted-50 text-decoration-none hover-primary">
                <i className="bi bi-gear-fill me-1"></i>Admin CMS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
