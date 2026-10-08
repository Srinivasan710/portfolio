import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { profileService } from '../services/profileService';
import { authService } from '../services/authService';
import { Profile } from '../types';
import { getMediaUrl } from '../services/api';

const Navbar = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    profileService
      .getProfile()
      .then((data) => setProfile(data))
      .catch((err) => console.error('Failed to load navbar profile:', err));
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#education', label: 'Education' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#services', label: 'Services' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // collapse mobile menu
      const toggler = document.querySelector('[data-bs-toggle="collapse"]') as HTMLElement;
      const collapseEl = document.getElementById('navbarNav');
      if (collapseEl?.classList.contains('show')) toggler?.click();
    }
  };

  const brandName = profile?.personal?.name || profile?.hero?.name || 'Srinivasan';
  const resumeUrl = profile?.hero?.resumeUrl || profile?.resume?.url;

  return (
    <nav
      className={`navbar navbar-expand-lg fixed-top transition-all ${
        scrolled ? 'navbar-scrolled shadow-sm' : ''
      }`}
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
    >
      <div className="container">
        <Link
          className="navbar-brand fw-bold fs-4 text-primary d-flex align-items-center"
          to="/"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <i className="bi bi-code-slash me-2"></i>
          <span className="text-gradient">{brandName}</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            {navLinks.map((link) => (
              <li key={link.href} className="nav-item">
                <button
                  className="nav-link btn btn-link text-decoration-none px-2"
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.label}
                </button>
              </li>
            ))}

            {resumeUrl && (
              <li className="nav-item ms-lg-2">
                <a
                  href={getMediaUrl(resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="btn btn-sm btn-outline-primary rounded-pill px-3 d-inline-flex align-items-center gap-1"
                >
                  <i className="bi bi-file-earmark-arrow-down"></i>
                  <span>Resume</span>
                </a>
              </li>
            )}

            <li className="nav-item ms-lg-2">
              <button
                className="btn btn-outline-secondary btn-sm rounded-circle"
                style={{ width: 36, height: 36 }}
                onClick={() => setDarkMode((d) => !d)}
                title="Toggle dark/light mode"
              >
                <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'}`}></i>
              </button>
            </li>

            <li className="nav-item ms-lg-2">
              <Link
                to={isAuthenticated ? '/admin' : '/admin/login'}
                className="btn btn-primary btn-sm rounded-pill px-3 d-inline-flex align-items-center gap-1 shadow-sm"
                title="Admin Panel"
              >
                <i className="bi bi-shield-lock-fill"></i>
                <span className="d-none d-xl-inline">{isAuthenticated ? 'Dashboard' : 'Admin'}</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
