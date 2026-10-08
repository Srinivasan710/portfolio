import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { profileService } from '../../services/profileService';
import { skillService } from '../../services/skillService';
import { projectService } from '../../services/projectService';
import { educationService } from '../../services/educationService';
import { experienceService } from '../../services/experienceService';
import { contactService } from '../../services/contactService';
import { uploadService } from '../../services/uploadService';
import { getMediaUrl } from '../../services/api';
import {
  Profile,
  Skill,
  Project,
  Education,
  Experience,
  ContactMessage,
} from '../../types';

type ActiveTab =
  | 'overview'
  | 'personal'
  | 'hero'
  | 'about'
  | 'skills'
  | 'projects'
  | 'education'
  | 'experience'
  | 'socials'
  | 'resume'
  | 'inbox'
  | 'security';

interface AlertState {
  type: 'success' | 'danger' | 'info';
  message: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [alert, setAlert] = useState<AlertState | null>(null);

  // Core Data States
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Password change state
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  // Modals / Item Editing states
  const [skillModal, setSkillModal] = useState<{ isOpen: boolean; isEdit: boolean; data: Partial<Skill> }>({
    isOpen: false,
    isEdit: false,
    data: { name: '', category: 'Frontend', level: 85, icon: 'bi-code-slash' },
  });

  const [projectModal, setProjectModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    data: Partial<Project> & { techString?: string };
  }>({
    isOpen: false,
    isEdit: false,
    data: {
      title: '',
      description: '',
      image: '',
      technologies: [],
      techString: '',
      githubUrl: '',
      liveUrl: '',
      category: 'Full-Stack',
      featured: false,
    },
  });

  const [educationModal, setEducationModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    data: Partial<Education>;
  }>({
    isOpen: false,
    isEdit: false,
    data: { college: '', degree: '', department: '', year: '', cgpa: '', description: '' },
  });

  const [experienceModal, setExperienceModal] = useState<{
    isOpen: boolean;
    isEdit: boolean;
    data: Partial<Experience> & { techString?: string };
  }>({
    isOpen: false,
    isEdit: false,
    data: {
      company: '',
      position: '',
      description: '',
      startDate: '',
      endDate: '',
      technologies: [],
      techString: '',
      location: '',
      certificateUrl: '',
      type: 'Job',
    },
  });

  const showAlert = (type: 'success' | 'danger' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 5000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [profData, skillsData, projData, eduData, expData, msgData] = await Promise.all([
        profileService.getProfile(),
        skillService.getAll(),
        projectService.getAll(),
        educationService.getAll(),
        experienceService.getAll(),
        contactService.getAll().catch(() => []),
      ]);
      setProfile(profData);
      setSkills(skillsData);
      setProjects(projData);
      setEducations(eduData);
      setExperiences(expData);
      setMessages(msgData);
    } catch (err: any) {
      showAlert('danger', 'Failed to load portfolio data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  // Profile Save
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      const updated = await profileService.updateProfile(profile);
      setProfile(updated);
      showAlert('success', 'Changes saved successfully!');
    } catch (err: any) {
      showAlert('danger', 'Failed to save changes: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Image / PDF Upload Helper
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string, filename: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadService.uploadFile(file);
      onSuccess(result.url, result.filename);
      showAlert('success', `Uploaded "${result.filename}" successfully!`);
    } catch (err: any) {
      showAlert('danger', 'Upload failed: ' + err.message);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Skill Handlers
  const handleOpenSkillModal = (skill?: Skill) => {
    if (skill) {
      setSkillModal({ isOpen: true, isEdit: true, data: { ...skill } });
    } else {
      setSkillModal({
        isOpen: true,
        isEdit: false,
        data: { name: '', category: 'Frontend', level: 85, icon: 'bi-code-slash' },
      });
    }
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isEdit, data } = skillModal;
    if (!data.name?.trim()) return;

    setSaving(true);
    try {
      if (isEdit && data.id) {
        const updated = await skillService.update(data.id, data);
        setSkills((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        showAlert('success', `Skill "${updated.name}" updated successfully!`);
      } else {
        const created = await skillService.create(data as any);
        setSkills((prev) => [...prev, created]);
        showAlert('success', `Skill "${created.name}" created successfully!`);
      }
      setSkillModal({ ...skillModal, isOpen: false });
    } catch (err: any) {
      showAlert('danger', 'Error saving skill: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSkill = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the skill "${name}"?`)) return;
    try {
      await skillService.delete(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      showAlert('success', `Skill "${name}" deleted.`);
    } catch (err: any) {
      showAlert('danger', 'Error deleting skill: ' + err.message);
    }
  };

  // Project Handlers
  const handleOpenProjectModal = (proj?: Project) => {
    if (proj) {
      setProjectModal({
        isOpen: true,
        isEdit: true,
        data: {
          ...proj,
          techString: proj.technologies ? proj.technologies.join(', ') : '',
        },
      });
    } else {
      setProjectModal({
        isOpen: true,
        isEdit: false,
        data: {
          title: '',
          description: '',
          image: '',
          technologies: [],
          techString: 'React, TypeScript, Node.js',
          githubUrl: 'https://github.com',
          liveUrl: 'https://demo.example.com',
          category: 'Full-Stack',
          featured: false,
        },
      });
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isEdit, data } = projectModal;
    if (!data.title?.trim()) return;

    const techArray = data.techString
      ? data.techString
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : data.technologies || [];

    const payload = {
      ...data,
      technologies: techArray,
      image: data.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    };
    delete (payload as any).techString;

    setSaving(true);
    try {
      if (isEdit && data.id) {
        const updated = await projectService.update(data.id, payload);
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        showAlert('success', `Project "${updated.title}" updated successfully!`);
      } else {
        const created = await projectService.create(payload as any);
        setProjects((prev) => [created, ...prev]);
        showAlert('success', `Project "${created.title}" created successfully!`);
      }
      setProjectModal({ ...projectModal, isOpen: false });
    } catch (err: any) {
      showAlert('danger', 'Error saving project: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the project "${title}"?`)) return;
    try {
      await projectService.delete(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showAlert('success', `Project "${title}" deleted.`);
    } catch (err: any) {
      showAlert('danger', 'Error deleting project: ' + err.message);
    }
  };

  // Education Handlers
  const handleOpenEducationModal = (edu?: Education) => {
    if (edu) {
      setEducationModal({ isOpen: true, isEdit: true, data: { ...edu } });
    } else {
      setEducationModal({
        isOpen: true,
        isEdit: false,
        data: {
          college: '',
          degree: '',
          department: '',
          year: '2020 - 2024',
          cgpa: '8.5 / 10',
          description: '',
        },
      });
    }
  };

  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isEdit, data } = educationModal;
    if (!data.college?.trim() || !data.degree?.trim()) return;

    setSaving(true);
    try {
      if (isEdit && data.id) {
        const updated = await educationService.update(data.id, data);
        setEducations((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        showAlert('success', `Education entry updated!`);
      } else {
        const created = await educationService.create(data as any);
        setEducations((prev) => [created, ...prev]);
        showAlert('success', `Education entry created!`);
      }
      setEducationModal({ ...educationModal, isOpen: false });
    } catch (err: any) {
      showAlert('danger', 'Error saving education: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEducation = async (id: string, degree: string) => {
    if (!window.confirm(`Are you sure you want to delete "${degree}"?`)) return;
    try {
      await educationService.delete(id);
      setEducations((prev) => prev.filter((e) => e.id !== id));
      showAlert('success', 'Education entry deleted.');
    } catch (err: any) {
      showAlert('danger', 'Error deleting education: ' + err.message);
    }
  };

  // Experience Handlers
  const handleOpenExperienceModal = (exp?: Experience) => {
    if (exp) {
      setExperienceModal({
        isOpen: true,
        isEdit: true,
        data: {
          ...exp,
          techString: exp.technologies ? exp.technologies.join(', ') : '',
        },
      });
    } else {
      setExperienceModal({
        isOpen: true,
        isEdit: false,
        data: {
          company: '',
          position: '',
          description: '',
          startDate: '2023',
          endDate: 'Present',
          technologies: [],
          techString: 'React, Node.js, TypeScript',
          location: 'Remote',
          certificateUrl: '',
          type: 'Job',
        },
      });
    }
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isEdit, data } = experienceModal;
    if (!data.company?.trim() || !data.position?.trim()) return;

    const techArray = data.techString
      ? data.techString
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : data.technologies || [];

    const payload = {
      ...data,
      technologies: techArray,
    };
    delete (payload as any).techString;

    setSaving(true);
    try {
      if (isEdit && data.id) {
        const updated = await experienceService.update(data.id, payload);
        setExperiences((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        showAlert('success', `Experience at "${updated.company}" updated!`);
      } else {
        const created = await experienceService.create(payload as any);
        setExperiences((prev) => [created, ...prev]);
        showAlert('success', `Experience at "${created.company}" added!`);
      }
      setExperienceModal({ ...experienceModal, isOpen: false });
    } catch (err: any) {
      showAlert('danger', 'Error saving experience: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExperience = async (id: string, company: string) => {
    if (!window.confirm(`Are you sure you want to delete experience at "${company}"?`)) return;
    try {
      await experienceService.delete(id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      showAlert('success', 'Experience entry deleted.');
    } catch (err: any) {
      showAlert('danger', 'Error deleting experience: ' + err.message);
    }
  };

  // Delete message handler
  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this inquiry message?')) return;
    try {
      await contactService.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showAlert('success', 'Message deleted.');
    } catch (err: any) {
      showAlert('danger', 'Error deleting message: ' + err.message);
    }
  };

  // Password change handler
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new) {
      showAlert('danger', 'Please enter all password fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      showAlert('danger', 'New password and confirm password do not match');
      return;
    }
    setSaving(true);
    try {
      const msg = await authService.changePassword(passwords.current, passwords.new);
      showAlert('success', msg || 'Password updated successfully!');
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      showAlert('danger', 'Failed to update password: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-body-tertiary">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: 48, height: 48 }}></div>
          <p className="text-muted fw-semibold">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-body-tertiary d-flex flex-column">
      {/* Top Navbar */}
      <header className="navbar navbar-expand-lg bg-body border-bottom sticky-top py-2 px-3 shadow-sm z-3">
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary text-white rounded-pill px-3 py-2 fs-6">
              <i className="bi bi-sliders me-1"></i>Portfolio CMS
            </span>
            <span className="fw-bold fs-5 d-none d-md-inline text-gradient">
              {profile.personal.name || 'Admin Panel'}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link to="/" target="_blank" className="btn btn-outline-primary btn-sm rounded-pill px-3">
              <i className="bi bi-box-arrow-up-right me-1"></i>View Live Site
            </Link>

            <button
              onClick={loadAllData}
              className="btn btn-outline-secondary btn-sm rounded-circle"
              title="Refresh Data"
              style={{ width: 34, height: 34 }}
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>

            <button
              onClick={handleLogout}
              className="btn btn-danger btn-sm rounded-pill px-3 shadow-sm ms-1"
            >
              <i className="bi bi-box-arrow-right me-1"></i>Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="container-fluid flex-grow-1 py-4">
        {/* Global Toast Alert */}
        {alert && (
          <div
            className={`alert alert-${alert.type} alert-dismissible fade show shadow-sm mb-4 d-flex align-items-center gap-2`}
            role="alert"
          >
            <i
              className={`bi ${
                alert.type === 'success'
                  ? 'bi-check-circle-fill'
                  : alert.type === 'danger'
                  ? 'bi-exclamation-triangle-fill'
                  : 'bi-info-circle-fill'
              } fs-5 flex-shrink-0`}
            ></i>
            <div>{alert.message}</div>
            <button
              type="button"
              className="btn-close"
              onClick={() => setAlert(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        <div className="row g-4">
          {/* Sidebar Tabs Navigation */}
          <div className="col-lg-3 col-xl-2">
            <div className="card border-0 shadow-sm rounded-4 sticky-top" style={{ top: 80 }}>
              <div className="card-body p-3">
                <div className="d-flex flex-column gap-1 nav-pills">
                  {[
                    { id: 'overview', label: 'Dashboard Overview', icon: 'bi-grid-1x2-fill' },
                    { id: 'personal', label: 'Personal Information', icon: 'bi-person-badge-fill' },
                    { id: 'hero', label: 'Hero Section', icon: 'bi-stars' },
                    { id: 'about', label: 'About & Objective', icon: 'bi-file-person-fill' },
                    { id: 'skills', label: 'Skills Manager', icon: 'bi-code-slash', count: skills.length },
                    { id: 'projects', label: 'Projects Manager', icon: 'bi-collection-fill', count: projects.length },
                    { id: 'education', label: 'Education Manager', icon: 'bi-mortarboard-fill', count: educations.length },
                    { id: 'experience', label: 'Experience & Internships', icon: 'bi-briefcase-fill', count: experiences.length },
                    { id: 'socials', label: 'Social & Contact Links', icon: 'bi-share-fill' },
                    { id: 'resume', label: 'Resume Manager', icon: 'bi-file-earmark-pdf-fill' },
                    { id: 'inbox', label: 'Inquiries Inbox', icon: 'bi-envelope-paper-fill', count: messages.length },
                    { id: 'security', label: 'Security & Password', icon: 'bi-shield-lock-fill' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`btn text-start d-flex align-items-center justify-content-between rounded-3 py-2 px-3 fw-semibold ${
                        activeTab === tab.id ? 'btn-primary shadow-sm text-white' : 'btn-light text-body-secondary'
                      }`}
                      onClick={() => setActiveTab(tab.id as ActiveTab)}
                    >
                      <span className="d-flex align-items-center gap-2">
                        <i className={`bi ${tab.icon}`}></i>
                        <span className="small">{tab.label}</span>
                      </span>
                      {tab.count !== undefined && (
                        <span className={`badge rounded-pill ${activeTab === tab.id ? 'bg-light text-primary' : 'bg-body-secondary text-body'}`}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content Panel */}
          <div className="col-lg-9 col-xl-10">
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div>
                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 bg-primary text-white position-relative overflow-hidden">
                  <div className="position-relative z-1">
                    <h2 className="fw-bold mb-2">Welcome back, {profile.personal.name}! 👋</h2>
                    <p className="lead mb-4 opacity-90" style={{ maxWidth: 650 }}>
                      Manage your portfolio content dynamically in real-time. Update your bio, upload projects,
                      replace your resume PDF, add skills, and review contact messages with ease.
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      <button className="btn btn-light rounded-pill px-4 shadow-sm" onClick={() => setActiveTab('hero')}>
                        <i className="bi bi-pencil-square me-2"></i>Edit Hero Section
                      </button>
                      <button className="btn btn-outline-light rounded-pill px-4" onClick={() => setActiveTab('projects')}>
                        <i className="bi bi-plus-circle me-2"></i>Manage Projects
                      </button>
                      <button className="btn btn-outline-light rounded-pill px-4" onClick={() => setActiveTab('resume')}>
                        <i className="bi bi-upload me-2"></i>Update Resume
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center hover-lift cursor-pointer" onClick={() => setActiveTab('skills')}>
                      <i className="bi bi-code-slash fs-1 text-primary mb-2"></i>
                      <h3 className="fw-bold mb-0">{skills.length}</h3>
                      <p className="text-muted small mb-0">Total Skills</p>
                    </div>
                  </div>
                  <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center hover-lift cursor-pointer" onClick={() => setActiveTab('projects')}>
                      <i className="bi bi-collection-fill fs-1 text-success mb-2"></i>
                      <h3 className="fw-bold mb-0">{projects.length}</h3>
                      <p className="text-muted small mb-0">Live Projects</p>
                    </div>
                  </div>
                  <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center hover-lift cursor-pointer" onClick={() => setActiveTab('education')}>
                      <i className="bi bi-mortarboard-fill fs-1 text-info mb-2"></i>
                      <h3 className="fw-bold mb-0">{educations.length}</h3>
                      <p className="text-muted small mb-0">Education Records</p>
                    </div>
                  </div>
                  <div className="col-sm-6 col-xl-3">
                    <div className="card border-0 shadow-sm rounded-4 p-4 text-center hover-lift cursor-pointer" onClick={() => setActiveTab('inbox')}>
                      <i className="bi bi-envelope-paper-fill fs-1 text-warning mb-2"></i>
                      <h3 className="fw-bold mb-0">{messages.length}</h3>
                      <p className="text-muted small mb-0">Client Messages</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. PERSONAL INFORMATION TAB */}
            {activeTab === 'personal' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold mb-1">Personal Information</h4>
                    <p className="text-muted small mb-0">Manage core personal attributes and profile photograph</p>
                  </div>
                  <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => handleSaveProfile()} disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check2-circle me-2"></i>}
                    Save Changes
                  </button>
                </div>

                <div className="row g-4">
                  {/* Photo upload column */}
                  <div className="col-lg-4 text-center border-end-lg">
                    <div className="mb-3">
                      <div
                        className="rounded-circle shadow mx-auto overflow-hidden border border-4 border-primary-subtle position-relative d-flex align-items-center justify-content-center bg-body-secondary"
                        style={{ width: 180, height: 180 }}
                      >
                        {profile.personal.profileImage ? (
                          <img
                            src={getMediaUrl(profile.personal.profileImage)}
                            alt="Profile"
                            className="w-100 h-100 object-fit-cover"
                          />
                        ) : (
                          <i className="bi bi-person-fill text-muted" style={{ fontSize: 90 }}></i>
                        )}
                      </div>
                    </div>

                    <label className="btn btn-outline-primary btn-sm rounded-pill px-3 mb-2 cursor-pointer">
                      <i className="bi bi-camera-fill me-1"></i>
                      {uploading ? 'Uploading...' : 'Upload Profile Photo'}
                      <input
                        type="file"
                        accept="image/*"
                        className="d-none"
                        disabled={uploading}
                        onChange={(e) =>
                          handleFileUpload(e, (url) => {
                            setProfile((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    personal: { ...prev.personal, profileImage: url },
                                  }
                                : prev
                            );
                          })
                        }
                      />
                    </label>

                    {profile.personal.profileImage && (
                      <div>
                        <button
                          type="button"
                          className="btn btn-link text-danger btn-sm text-decoration-none"
                          onClick={() =>
                            setProfile((prev) =>
                              prev ? { ...prev, personal: { ...prev.personal, profileImage: '' } } : prev
                            )
                          }
                        >
                          Remove Photo
                        </button>
                      </div>
                    )}
                    <small className="text-muted d-block mt-2">JPG, PNG, WebP up to 10MB</small>
                  </div>

                  {/* Form fields */}
                  <div className="col-lg-8">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">Full Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profile.personal.name}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              personal: { ...profile.personal, name: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">Short Title / Role</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profile.personal.title}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              personal: { ...profile.personal, title: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">Email Address</label>
                        <input
                          type="email"
                          className="form-control"
                          value={profile.personal.email}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              personal: { ...profile.personal, email: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">Phone Number</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profile.personal.phone}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              personal: { ...profile.personal, phone: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">Location</label>
                        <input
                          type="text"
                          className="form-control"
                          value={profile.personal.location}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              personal: { ...profile.personal, location: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold small">Availability Status</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="e.g. Available for work / Freelancing"
                          value={profile.personal.availability}
                          onChange={(e) =>
                            setProfile({
                              ...profile,
                              personal: { ...profile.personal, availability: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button className="btn btn-outline-secondary rounded-pill px-4" onClick={loadAllData} disabled={saving}>
                    Cancel / Reset
                  </button>
                  <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => handleSaveProfile()} disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check2-circle me-2"></i>}
                    Save Personal Info
                  </button>
                </div>
              </div>
            )}

            {/* 3. HERO SECTION TAB */}
            {activeTab === 'hero' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold mb-1">Hero Section Editor</h4>
                    <p className="text-muted small mb-0">Configure greetings, headings, subtitles, buttons, and call-to-actions</p>
                  </div>
                  <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => handleSaveProfile()} disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check2-circle me-2"></i>}
                    Save Changes
                  </button>
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label fw-semibold small">Greeting Text</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Hi, I'm"
                      value={profile.hero.greeting}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          hero: { ...profile.hero, greeting: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold small">Main Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.hero.name}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          hero: { ...profile.hero, name: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold small">Professional Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.hero.title}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          hero: { ...profile.hero, title: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small">Hero Description / Tagline</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      value={profile.hero.description}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          hero: { ...profile.hero, description: e.target.value },
                        })
                      }
                    ></textarea>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Availability Badge Text</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.hero.availabilityBadge}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          hero: { ...profile.hero, availabilityBadge: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Work Type Badge</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Remote / Hybrid / 50+ Projects"
                      value={profile.hero.workType}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          hero: { ...profile.hero, workType: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Primary Button Text (View Projects)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.hero.projectsBtnText}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          hero: { ...profile.hero, projectsBtnText: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Secondary Button Text (Download Resume)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.hero.resumeBtnText}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          hero: { ...profile.hero, resumeBtnText: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button className="btn btn-outline-secondary rounded-pill px-4" onClick={loadAllData} disabled={saving}>
                    Cancel / Reset
                  </button>
                  <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => handleSaveProfile()} disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check2-circle me-2"></i>}
                    Save Hero Settings
                  </button>
                </div>
              </div>
            )}

            {/* 4. ABOUT & CAREER OBJECTIVE TAB */}
            {activeTab === 'about' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold mb-1">About & Career Objective</h4>
                    <p className="text-muted small mb-0">Manage bio description, objective, statistics, and interests tags</p>
                  </div>
                  <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => handleSaveProfile()} disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check2-circle me-2"></i>}
                    Save Changes
                  </button>
                </div>

                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold small">About Section Heading</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.about.heading}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          about: { ...profile.about, heading: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small">Full About Bio Description</label>
                    <textarea
                      rows={5}
                      className="form-control"
                      value={profile.about.description}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          about: { ...profile.about, description: e.target.value },
                        })
                      }
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small">Career Objective</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      value={profile.about.careerObjective}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          about: { ...profile.about, careerObjective: e.target.value },
                        })
                      }
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold small">Interests & Specializations (Comma Separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.about.interests.join(', ')}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          about: {
                            ...profile.about,
                            interests: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                          },
                        })
                      }
                    />
                  </div>
                </div>

                {/* Key Stats Editor */}
                <h5 className="fw-bold mt-4 mb-3">Highlight Statistics</h5>
                <div className="row g-3">
                  {profile.about.stats.map((stat, idx) => (
                    <div key={idx} className="col-md-3">
                      <div className="p-3 border rounded-3 bg-body">
                        <label className="form-label small fw-semibold">Stat #{idx + 1} Label</label>
                        <input
                          type="text"
                          className="form-control form-control-sm mb-2"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...profile.about.stats];
                            newStats[idx].label = e.target.value;
                            setProfile({ ...profile, about: { ...profile.about, stats: newStats } });
                          }}
                        />
                        <label className="form-label small fw-semibold">Value (e.g. 5+)</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...profile.about.stats];
                            newStats[idx].value = e.target.value;
                            setProfile({ ...profile, about: { ...profile.about, stats: newStats } });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button className="btn btn-outline-secondary rounded-pill px-4" onClick={loadAllData} disabled={saving}>
                    Cancel / Reset
                  </button>
                  <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => handleSaveProfile()} disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check2-circle me-2"></i>}
                    Save About Information
                  </button>
                </div>
              </div>
            )}

            {/* 5. SKILLS MANAGER TAB */}
            {activeTab === 'skills' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold mb-1">Skills Manager</h4>
                    <p className="text-muted small mb-0">Add, edit, reorganize, and remove technical skills</p>
                  </div>
                  <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => handleOpenSkillModal()}>
                    <i className="bi bi-plus-lg me-1"></i>Add New Skill
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Icon</th>
                        <th>Skill Name</th>
                        <th>Category</th>
                        <th>Proficiency</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skills.map((skill) => (
                        <tr key={skill.id}>
                          <td>
                            <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                              <i className={`bi ${skill.icon || 'bi-code-slash'}`}></i>
                            </div>
                          </td>
                          <td className="fw-semibold">{skill.name}</td>
                          <td>
                            <span className="badge bg-secondary-subtle text-secondary-emphasis rounded-pill">
                              {skill.category}
                            </span>
                          </td>
                          <td style={{ width: 220 }}>
                            <div className="d-flex align-items-center gap-2">
                              <div className="progress flex-grow-1" style={{ height: 8 }}>
                                <div
                                  className="progress-bar bg-primary"
                                  role="progressbar"
                                  style={{ width: `${skill.level}%` }}
                                ></div>
                              </div>
                              <span className="small fw-semibold">{skill.level}%</span>
                            </div>
                          </td>
                          <td className="text-end">
                            <button
                              className="btn btn-outline-primary btn-sm rounded-circle me-1"
                              onClick={() => handleOpenSkillModal(skill)}
                              title="Edit Skill"
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm rounded-circle"
                              onClick={() => handleDeleteSkill(skill.id, skill.name)}
                              title="Delete Skill"
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 6. PROJECTS MANAGER TAB */}
            {activeTab === 'projects' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold mb-1">Projects Manager</h4>
                    <p className="text-muted small mb-0">Create and modify portfolio projects, links, and screenshots</p>
                  </div>
                  <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => handleOpenProjectModal()}>
                    <i className="bi bi-plus-lg me-1"></i>Add New Project
                  </button>
                </div>

                <div className="row g-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="col-md-6 col-xl-4 d-flex">
                      <div className="card border shadow-sm rounded-4 w-100 d-flex flex-column overflow-hidden">
                        <div className="position-relative" style={{ height: 160 }}>
                          <img
                            src={getMediaUrl(proj.image)}
                            alt={proj.title}
                            className="w-100 h-100 object-fit-cover"
                          />
                          {proj.featured && (
                            <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2 rounded-pill px-2">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="card-body p-3 d-flex flex-column flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="fw-bold mb-0 text-truncate">{proj.title}</h6>
                            <span className="badge bg-primary-subtle text-primary rounded-pill small">
                              {proj.category}
                            </span>
                          </div>
                          <p className="text-muted small flex-grow-1 line-clamp-2">{proj.description}</p>
                          <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                            <div className="d-flex gap-2">
                              {proj.githubUrl && (
                                <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted small text-decoration-none">
                                  <i className="bi bi-github me-1"></i>GitHub
                                </a>
                              )}
                              {proj.liveUrl && (
                                <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-primary small text-decoration-none">
                                  <i className="bi bi-box-arrow-up-right me-1"></i>Live Demo
                                </a>
                              )}
                            </div>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-outline-primary btn-sm rounded-circle"
                                onClick={() => handleOpenProjectModal(proj)}
                              >
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm rounded-circle"
                                onClick={() => handleDeleteProject(proj.id, proj.title)}
                              >
                                <i className="bi bi-trash-fill"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. EDUCATION MANAGER TAB */}
            {activeTab === 'education' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold mb-1">Education Manager</h4>
                    <p className="text-muted small mb-0">Manage college degrees, departments, graduation years, and CGPA</p>
                  </div>
                  <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => handleOpenEducationModal()}>
                    <i className="bi bi-plus-lg me-1"></i>Add Education Record
                  </button>
                </div>

                <div className="d-flex flex-column gap-3">
                  {educations.map((edu) => (
                    <div key={edu.id} className="p-3 border rounded-3 bg-body shadow-sm d-flex flex-wrap justify-content-between align-items-center gap-3">
                      <div>
                        <h5 className="fw-bold mb-1 text-primary">{edu.degree}</h5>
                        <div className="fw-semibold text-body mb-1">
                          <i className="bi bi-buildings me-1 text-muted"></i>{edu.college}
                        </div>
                        <div className="text-muted small">
                          Department: <strong>{edu.department}</strong> | Year: <strong>{edu.year}</strong> {edu.cgpa ? `| CGPA: ${edu.cgpa}` : ''}
                        </div>
                        {edu.description && <p className="text-muted small mt-2 mb-0">{edu.description}</p>}
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-pill px-3"
                          onClick={() => handleOpenEducationModal(edu)}
                        >
                          <i className="bi bi-pencil me-1"></i>Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          onClick={() => handleDeleteEducation(edu.id, edu.degree)}
                        >
                          <i className="bi bi-trash me-1"></i>Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. EXPERIENCE / INTERNSHIP MANAGER TAB */}
            {activeTab === 'experience' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold mb-1">Experience & Internship Manager</h4>
                    <p className="text-muted small mb-0">Record work experience, job positions, internship certificates, and technologies</p>
                  </div>
                  <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => handleOpenExperienceModal()}>
                    <i className="bi bi-plus-lg me-1"></i>Add Experience
                  </button>
                </div>

                <div className="d-flex flex-column gap-3">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="p-3 border rounded-3 bg-body shadow-sm d-flex flex-wrap justify-content-between align-items-center gap-3">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h5 className="fw-bold mb-0 text-primary">{exp.position}</h5>
                          {exp.type && <span className="badge bg-info-subtle text-info-emphasis rounded-pill">{exp.type}</span>}
                        </div>
                        <div className="fw-semibold text-body mb-1">
                          <i className="bi bi-building me-1 text-muted"></i>{exp.company} ({exp.startDate} - {exp.endDate})
                        </div>
                        <div className="text-muted small mb-2">Location: {exp.location}</div>
                        <p className="text-muted small mb-2">{exp.description}</p>
                        {exp.certificateUrl && (
                          <div className="small text-success">
                            <i className="bi bi-patch-check-fill me-1"></i>Certificate attached: <a href={getMediaUrl(exp.certificateUrl)} target="_blank" rel="noopener noreferrer">View Certificate</a>
                          </div>
                        )}
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-primary btn-sm rounded-pill px-3"
                          onClick={() => handleOpenExperienceModal(exp)}
                        >
                          <i className="bi bi-pencil me-1"></i>Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill px-3"
                          onClick={() => handleDeleteExperience(exp.id, exp.company)}
                        >
                          <i className="bi bi-trash me-1"></i>Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 9. SOCIAL MEDIA & CONTACT LINKS TAB */}
            {activeTab === 'socials' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold mb-1">Social Media & Contact Links</h4>
                    <p className="text-muted small mb-0">Update all social URLs and contact channel addresses</p>
                  </div>
                  <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => handleSaveProfile()} disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check2-circle me-2"></i>}
                    Save Changes
                  </button>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small"><i className="bi bi-github me-2"></i>GitHub Profile URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={profile.socials.github}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socials: { ...profile.socials, github: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small"><i className="bi bi-linkedin me-2 text-primary"></i>LinkedIn Profile URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={profile.socials.linkedin}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socials: { ...profile.socials, linkedin: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small"><i className="bi bi-instagram me-2 text-danger"></i>Instagram Profile URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={profile.socials.instagram}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socials: { ...profile.socials, instagram: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small"><i className="bi bi-twitter-x me-2"></i>Twitter / X Profile URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={profile.socials.twitter}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socials: { ...profile.socials, twitter: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small"><i className="bi bi-envelope me-2 text-warning"></i>Contact Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={profile.socials.email}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socials: { ...profile.socials, email: e.target.value },
                        })
                      }
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold small"><i className="bi bi-telephone me-2 text-success"></i>Contact Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.socials.phone}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          socials: { ...profile.socials, phone: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button className="btn btn-outline-secondary rounded-pill px-4" onClick={loadAllData} disabled={saving}>
                    Cancel / Reset
                  </button>
                  <button className="btn btn-primary rounded-pill px-4 shadow-sm" onClick={() => handleSaveProfile()} disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check2-circle me-2"></i>}
                    Save Social Links
                  </button>
                </div>
              </div>
            )}

            {/* 10. RESUME MANAGER TAB */}
            {activeTab === 'resume' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold mb-1">Resume Manager</h4>
                    <p className="text-muted small mb-0">Upload or replace your resume PDF. The Download button on your portfolio will automatically use the latest file.</p>
                  </div>
                </div>

                <div className="row g-4 align-items-center">
                  <div className="col-lg-7">
                    <div className="p-4 border-2 border-dashed rounded-4 text-center bg-body">
                      <div className="bg-primary-subtle text-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 64, height: 64, fontSize: 28 }}>
                        <i className="bi bi-file-earmark-pdf-fill"></i>
                      </div>
                      <h5 className="fw-bold mb-2">Upload New Resume PDF</h5>
                      <p className="text-muted small mb-4">Select a PDF or DOCX file to replace your active resume</p>

                      <label className="btn btn-primary rounded-pill px-4 shadow-sm cursor-pointer mb-2">
                        <i className="bi bi-cloud-arrow-up-fill me-2"></i>
                        {uploading ? 'Uploading PDF...' : 'Choose Resume File'}
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="d-none"
                          disabled={uploading}
                          onChange={(e) =>
                            handleFileUpload(e, async (url, filename) => {
                              const updated = await profileService.updateProfile({
                                resume: {
                                  url,
                                  filename,
                                  updatedAt: new Date().toISOString(),
                                },
                                hero: {
                                  ...profile.hero,
                                  resumeUrl: url,
                                },
                              });
                              setProfile(updated);
                            })
                          }
                        />
                      </label>
                      <small className="text-muted d-block">PDF format recommended (up to 15MB)</small>
                    </div>
                  </div>

                  <div className="col-lg-5">
                    <div className="card border shadow-sm rounded-4 p-4 bg-body">
                      <h6 className="fw-bold mb-3">Active Resume Status</h6>
                      {profile.resume?.url || profile.hero?.resumeUrl ? (
                        <div>
                          <div className="d-flex align-items-center gap-3 p-3 rounded-3 bg-success-subtle border border-success-subtle mb-3">
                            <i className="bi bi-check-circle-fill text-success fs-3"></i>
                            <div>
                              <div className="fw-semibold text-success-emphasis">{profile.resume.filename || 'resume.pdf'}</div>
                              <small className="text-muted">Active and linked to download buttons</small>
                            </div>
                          </div>

                          <div className="d-flex flex-column gap-2">
                            <a
                              href={getMediaUrl(profile.resume.url || profile.hero.resumeUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-primary rounded-pill"
                            >
                              <i className="bi bi-eye me-2"></i>Preview / Download Active PDF
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="alert alert-warning mb-0">
                          <i className="bi bi-exclamation-circle me-2"></i>No resume uploaded yet. Click upload to attach your resume PDF.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 11. INBOX TAB */}
            {activeTab === 'inbox' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold mb-1">Inquiries & Client Messages</h4>
                    <p className="text-muted small mb-0">View all messages submitted through the contact form</p>
                  </div>
                  <span className="badge bg-primary rounded-pill px-3 py-2">
                    {messages.length} Message{messages.length === 1 ? '' : 's'}
                  </span>
                </div>

                {messages.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary opacity-50"></i>
                    <p className="mb-0">No contact messages received yet.</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-3">
                    {messages.map((msg) => (
                      <div key={msg.id} className="card border shadow-sm rounded-4 p-4 bg-body">
                        <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                          <div>
                            <h5 className="fw-bold mb-0 text-body">{msg.subject}</h5>
                            <div className="small text-muted">
                              From: <strong className="text-body">{msg.name}</strong> (<code>{msg.email}</code>)
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            {msg.createdAt && (
                              <span className="badge bg-body-secondary text-body-secondary rounded-pill small">
                                {new Date(msg.createdAt).toLocaleDateString()}
                              </span>
                            )}
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                              className="btn btn-sm btn-outline-primary rounded-pill px-3"
                            >
                              <i className="bi bi-reply-fill me-1"></i>Reply
                            </a>
                            <button
                              className="btn btn-sm btn-outline-danger rounded-circle"
                              onClick={() => handleDeleteMessage(msg.id)}
                              title="Delete Message"
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </div>
                        </div>
                        <p className="mb-0 text-body-secondary p-3 rounded-3 bg-body-tertiary mt-2" style={{ whiteSpace: 'pre-line' }}>
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 12. SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5" style={{ maxWidth: 600 }}>
                <div className="mb-4 border-bottom pb-3">
                  <h4 className="fw-bold mb-1">Security & Password</h4>
                  <p className="text-muted small mb-0">Change your administrator login password</p>
                </div>

                <form onSubmit={handlePasswordChange}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                      required
                      minLength={6}
                    />
                    <small className="text-muted">Minimum 6 characters</small>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold small">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-shield-check me-2"></i>}
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SKILL MODAL */}
      {skillModal.isOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">{skillModal.isEdit ? 'Edit Skill' : 'Add New Skill'}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSkillModal({ ...skillModal, isOpen: false })}
                ></button>
              </div>
              <form onSubmit={handleSaveSkill}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Skill Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. React, Docker, GraphQL"
                      value={skillModal.data.name || ''}
                      onChange={(e) => setSkillModal({ ...skillModal, data: { ...skillModal.data, name: e.target.value } })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Category</label>
                    <select
                      className="form-select"
                      value={skillModal.data.category || 'Frontend'}
                      onChange={(e) => setSkillModal({ ...skillModal, data: { ...skillModal.data, category: e.target.value } })}
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small d-flex justify-content-between">
                      <span>Proficiency Level:</span>
                      <strong className="text-primary">{skillModal.data.level || 85}%</strong>
                    </label>
                    <input
                      type="range"
                      className="form-range"
                      min={10}
                      max={100}
                      step={5}
                      value={skillModal.data.level || 85}
                      onChange={(e) => setSkillModal({ ...skillModal, data: { ...skillModal.data, level: Number(e.target.value) } })}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Bootstrap Icon Class</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. bi-code-slash, bi-database, bi-server"
                      value={skillModal.data.icon || 'bi-code-slash'}
                      onChange={(e) => setSkillModal({ ...skillModal, data: { ...skillModal.data, icon: e.target.value } })}
                    />
                    <small className="text-muted">Uses Bootstrap Icons (e.g. bi-code-slash)</small>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setSkillModal({ ...skillModal, isOpen: false })}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                    Save Skill
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT MODAL */}
      {projectModal.isOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">{projectModal.isEdit ? 'Edit Project' : 'Add New Project'}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setProjectModal({ ...projectModal, isOpen: false })}
                ></button>
              </div>
              <form onSubmit={handleSaveProject}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label fw-semibold small">Project Title <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. CloudFlow SaaS"
                        value={projectModal.data.title || ''}
                        onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, title: e.target.value } })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Category</label>
                      <select
                        className="form-select"
                        value={projectModal.data.category || 'Full-Stack'}
                        onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, category: e.target.value } })}
                      >
                        <option value="Full-Stack">Full-Stack</option>
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="Database">Database</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">Description <span className="text-danger">*</span></label>
                      <textarea
                        rows={3}
                        className="form-control"
                        placeholder="Comprehensive summary of what the project does..."
                        value={projectModal.data.description || ''}
                        onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, description: e.target.value } })}
                        required
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Project Image (Upload or URL)</label>
                      <div className="input-group mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://... or /uploads/..."
                          value={projectModal.data.image || ''}
                          onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, image: e.target.value } })}
                        />
                      </div>
                      <label className="btn btn-outline-primary btn-sm rounded-pill cursor-pointer">
                        <i className="bi bi-upload me-1"></i>
                        {uploading ? 'Uploading...' : 'Upload Image File'}
                        <input
                          type="file"
                          accept="image/*"
                          className="d-none"
                          disabled={uploading}
                          onChange={(e) =>
                            handleFileUpload(e, (url) => {
                              setProjectModal({ ...projectModal, data: { ...projectModal.data, image: url } });
                            })
                          }
                        />
                      </label>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Technologies (Comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="React, Node.js, Express, MongoDB"
                        value={projectModal.data.techString || ''}
                        onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, techString: e.target.value } })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">GitHub Repository URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://github.com/..."
                        value={projectModal.data.githubUrl || ''}
                        onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, githubUrl: e.target.value } })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Live Demo URL</label>
                      <input
                        type="url"
                        className="form-control"
                        placeholder="https://..."
                        value={projectModal.data.liveUrl || ''}
                        onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, liveUrl: e.target.value } })}
                      />
                    </div>

                    <div className="col-12">
                      <div className="form-check form-switch mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="featuredProj"
                          checked={projectModal.data.featured || false}
                          onChange={(e) => setProjectModal({ ...projectModal, data: { ...projectModal.data, featured: e.target.checked } })}
                        />
                        <label className="form-check-label fw-semibold" htmlFor="featuredProj">
                          Feature this project on homepage
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setProjectModal({ ...projectModal, isOpen: false })}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                    Save Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDUCATION MODAL */}
      {educationModal.isOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">{educationModal.isEdit ? 'Edit Education' : 'Add Education Record'}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEducationModal({ ...educationModal, isOpen: false })}
                ></button>
              </div>
              <form onSubmit={handleSaveEducation}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">College / University Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. National Institute of Technology"
                      value={educationModal.data.college || ''}
                      onChange={(e) => setEducationModal({ ...educationModal, data: { ...educationModal.data, college: e.target.value } })}
                      required
                    />
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Degree <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. B.Tech / B.E / M.S"
                        value={educationModal.data.degree || ''}
                        onChange={(e) => setEducationModal({ ...educationModal, data: { ...educationModal.data, degree: e.target.value } })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Department / Major <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Computer Science"
                        value={educationModal.data.department || ''}
                        onChange={(e) => setEducationModal({ ...educationModal, data: { ...educationModal.data, department: e.target.value } })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Year / Duration <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 2017 - 2021"
                        value={educationModal.data.year || ''}
                        onChange={(e) => setEducationModal({ ...educationModal, data: { ...educationModal.data, year: e.target.value } })}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">CGPA / Percentage</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. 8.8 / 10.0"
                        value={educationModal.data.cgpa || ''}
                        onChange={(e) => setEducationModal({ ...educationModal, data: { ...educationModal.data, cgpa: e.target.value } })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Description / Honors / Specialization</label>
                    <textarea
                      rows={3}
                      className="form-control"
                      placeholder="Specialized in Distributed Systems, led coding club..."
                      value={educationModal.data.description || ''}
                      onChange={(e) => setEducationModal({ ...educationModal, data: { ...educationModal.data, description: e.target.value } })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setEducationModal({ ...educationModal, isOpen: false })}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                    Save Education
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EXPERIENCE / INTERNSHIP MODAL */}
      {experienceModal.isOpen && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">{experienceModal.isEdit ? 'Edit Experience' : 'Add Experience / Internship'}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setExperienceModal({ ...experienceModal, isOpen: false })}
                ></button>
              </div>
              <form onSubmit={handleSaveExperience}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Company Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Google, TechCorp"
                        value={experienceModal.data.company || ''}
                        onChange={(e) => setExperienceModal({ ...experienceModal, data: { ...experienceModal.data, company: e.target.value } })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Role / Position <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Senior Full-Stack Engineer"
                        value={experienceModal.data.position || ''}
                        onChange={(e) => setExperienceModal({ ...experienceModal, data: { ...experienceModal.data, position: e.target.value } })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Type</label>
                      <select
                        className="form-select"
                        value={experienceModal.data.type || 'Job'}
                        onChange={(e) => setExperienceModal({ ...experienceModal, data: { ...experienceModal.data, type: e.target.value } })}
                      >
                        <option value="Job">Full-time / Job</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">Start Date / Year <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Jan 2022"
                        value={experienceModal.data.startDate || ''}
                        onChange={(e) => setExperienceModal({ ...experienceModal, data: { ...experienceModal.data, startDate: e.target.value } })}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-semibold small">End Date / Year <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Present"
                        value={experienceModal.data.endDate || ''}
                        onChange={(e) => setExperienceModal({ ...experienceModal, data: { ...experienceModal.data, endDate: e.target.value } })}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Location</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. San Francisco, CA (Remote)"
                        value={experienceModal.data.location || ''}
                        onChange={(e) => setExperienceModal({ ...experienceModal, data: { ...experienceModal.data, location: e.target.value } })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Technologies (Comma separated)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="React, TypeScript, Node.js"
                        value={experienceModal.data.techString || ''}
                        onChange={(e) => setExperienceModal({ ...experienceModal, data: { ...experienceModal.data, techString: e.target.value } })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">Description & Responsibilities <span className="text-danger">*</span></label>
                      <textarea
                        rows={4}
                        className="form-control"
                        placeholder="Key achievements and engineering impact..."
                        value={experienceModal.data.description || ''}
                        onChange={(e) => setExperienceModal({ ...experienceModal, data: { ...experienceModal.data, description: e.target.value } })}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold small">Certificate / Offer Letter Link or Upload</label>
                      <div className="input-group mb-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="https://... or /uploads/..."
                          value={experienceModal.data.certificateUrl || ''}
                          onChange={(e) => setExperienceModal({ ...experienceModal, data: { ...experienceModal.data, certificateUrl: e.target.value } })}
                        />
                      </div>
                      <label className="btn btn-outline-primary btn-sm rounded-pill cursor-pointer">
                        <i className="bi bi-file-earmark-arrow-up me-1"></i>
                        {uploading ? 'Uploading...' : 'Upload Certificate PDF / Image'}
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="d-none"
                          disabled={uploading}
                          onChange={(e) =>
                            handleFileUpload(e, (url) => {
                              setExperienceModal({ ...experienceModal, data: { ...experienceModal.data, certificateUrl: url } });
                            })
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setExperienceModal({ ...experienceModal, isOpen: false })}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary rounded-pill px-4 shadow-sm" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : null}
                    Save Experience
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
