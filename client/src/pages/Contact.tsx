import { useState, useEffect, FormEvent } from 'react';
import { contactService } from '../services/contactService';
import { profileService } from '../services/profileService';
import { ContactFormData, Profile } from '../types';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const initialForm: ContactFormData = { name: '', email: '', subject: '', message: '' };

const Contact = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<ContactFormData>(initialForm);
  const [status, setStatus] = useState<FormStatus>('idle');
  const [statusMsg, setStatusMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<ContactFormData>>({});

  useEffect(() => {
    profileService
      .getProfile()
      .then((data) => setProfile(data))
      .catch((err) => console.error('Failed to load profile in Contact:', err));
  }, []);

  const validate = (): boolean => {
    const errs: Partial<ContactFormData> = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'A valid email is required.';
    if (!form.subject.trim() || form.subject.trim().length < 3) errs.subject = 'Subject must be at least 3 characters.';
    if (!form.message.trim() || form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof ContactFormData]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    setStatusMsg('');
    try {
      const msg = await contactService.submit(form);
      setStatus('success');
      setStatusMsg(msg);
      setForm(initialForm);
    } catch (err: unknown) {
      setStatus('error');
      setStatusMsg(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    }
  };

  const personal = profile?.personal;
  const socials = profile?.socials;

  const contactInfo = [
    { icon: 'bi-geo-alt-fill', label: 'Location', value: personal?.location || 'San Francisco, CA' },
    { icon: 'bi-envelope-fill', label: 'Email', value: socials?.email || personal?.email || 'srinivasan@example.com' },
    { icon: 'bi-telephone-fill', label: 'Phone', value: socials?.phone || personal?.phone || '+1 (555) 123-4567' },
    { icon: 'bi-clock-fill', label: 'Availability', value: personal?.availability || 'Mon–Fri, 9am–6pm' },
  ];

  return (
    <section id="contact" className="py-6">
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 mb-3">Contact</span>
          <h2 className="display-5 fw-bold mb-3">Get In Touch</h2>
          <p className="text-muted mx-auto" style={{ maxWidth: 540 }}>
            Have a project in mind? Let's build something great together. I'd love to hear from you.
          </p>
        </div>

        <div className="row g-5">
          {/* Contact info */}
          <div className="col-lg-5">
            <h4 className="fw-bold mb-4">Let's Talk</h4>
            <p className="text-muted mb-4">
              I'm currently available for freelance work and full-time positions. Whether you have a 
              quick question or a big project, feel free to reach out.
            </p>
            <div className="d-flex flex-column gap-3 mb-5">
              {contactInfo.map((item) => (
                <div key={item.label} className="d-flex align-items-center gap-3 p-3 rounded-3 bg-body border shadow-sm">
                  <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: 44, height: 44, fontSize: 18 }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div>
                    <div className="text-muted small">{item.label}</div>
                    <div className="fw-semibold">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
            {/* Social links */}
            <div>
              <h6 className="fw-semibold mb-3">Follow & Connect</h6>
              <div className="d-flex flex-wrap gap-2">
                {[
                  { icon: 'bi-github', href: socials?.github || 'https://github.com', color: 'dark' },
                  { icon: 'bi-linkedin', href: socials?.linkedin || 'https://linkedin.com', color: 'primary' },
                  { icon: 'bi-instagram', href: socials?.instagram, color: 'danger' },
                  { icon: 'bi-twitter-x', href: socials?.twitter || 'https://twitter.com', color: 'dark' },
                ]
                  .filter((s) => Boolean(s.href))
                  .map((s) => (
                    <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer"
                      className={`btn btn-outline-${s.color} rounded-circle d-flex align-items-center justify-content-center shadow-sm`}
                      style={{ width: 42, height: 42, fontSize: 18 }}>
                      <i className={`bi ${s.icon}`}></i>
                    </a>
                  ))}
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="col-lg-7">
            <div className="card border-0 shadow p-4 p-md-5 rounded-4">
              {status === 'success' ? (
                <div className="text-center py-4">
                  <div className="mb-3 text-success" style={{ fontSize: 64 }}>
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <h4 className="fw-bold text-success mb-2">Message Sent!</h4>
                  <p className="text-muted mb-4">{statusMsg}</p>
                  <button className="btn btn-primary rounded-pill px-4" onClick={() => setStatus('idle')}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h5 className="fw-bold mb-4">Send a Message</h5>

                  {status === 'error' && (
                    <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
                      <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                      <div>{statusMsg}</div>
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-sm-6">
                      <label htmlFor="name" className="form-label fw-semibold">Full Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={`form-control ${fieldErrors.name ? 'is-invalid' : ''}`}
                        placeholder="Your Full Name"
                        value={form.name}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                      />
                      {fieldErrors.name && <div className="invalid-feedback">{fieldErrors.name}</div>}
                    </div>

                    <div className="col-sm-6">
                      <label htmlFor="email" className="form-label fw-semibold">Email Address <span className="text-danger">*</span></label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className={`form-control ${fieldErrors.email ? 'is-invalid' : ''}`}
                        placeholder="name@example.com"
                        value={form.email}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                      />
                      {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
                    </div>

                    <div className="col-12">
                      <label htmlFor="subject" className="form-label fw-semibold">Subject <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        className={`form-control ${fieldErrors.subject ? 'is-invalid' : ''}`}
                        placeholder="Project Collaboration / Inquiries"
                        value={form.subject}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                      />
                      {fieldErrors.subject && <div className="invalid-feedback">{fieldErrors.subject}</div>}
                    </div>

                    <div className="col-12">
                      <label htmlFor="message" className="form-label fw-semibold">Message <span className="text-danger">*</span></label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        className={`form-control ${fieldErrors.message ? 'is-invalid' : ''}`}
                        placeholder="Tell me about your project or inquiry..."
                        value={form.message}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                      ></textarea>
                      {fieldErrors.message && <div className="invalid-feedback">{fieldErrors.message}</div>}
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 rounded-pill py-3 fw-semibold shadow"
                        disabled={status === 'submitting'}
                      >
                        {status === 'submitting' ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Sending...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send-fill me-2"></i>Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
