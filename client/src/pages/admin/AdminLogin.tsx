import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError('Please enter both username/email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.login(identifier.trim(), password.trim());
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDefaultCredentials = () => {
    setIdentifier('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-body-tertiary px-3 py-5">
      <div className="card border-0 shadow-lg rounded-4 p-4 p-md-5" style={{ maxWidth: 460, width: '100%' }}>
        <div className="text-center mb-4">
          <div
            className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow"
            style={{ width: 64, height: 64, fontSize: 28 }}
          >
            <i className="bi bi-shield-lock-fill"></i>
          </div>
          <h2 className="fw-bold mb-1">Admin Portal</h2>
          <p className="text-muted small">Sign in to manage your portfolio content</p>
        </div>

        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2 py-2 px-3 rounded-3 mb-4" role="alert">
            <i className="bi bi-exclamation-triangle-fill flex-shrink-0 fs-5"></i>
            <div className="small">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold small">Username or Email</label>
            <div className="input-group">
              <span className="input-group-text bg-body-secondary border-end-0">
                <i className="bi bi-person text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="admin or admin@portfolio.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold small">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-body-secondary border-end-0">
                <i className="bi bi-lock text-muted"></i>
              </span>
              <input
                type="password"
                className="form-control border-start-0"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-3 rounded-pill fw-semibold shadow mb-3"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Signing In...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
              </>
            )}
          </button>
        </form>

        <div className="alert alert-info py-2 px-3 rounded-3 d-flex align-items-center justify-content-between mb-3">
          <div className="small">
            <span className="fw-semibold">Default:</span> <code>admin</code> / <code>admin123</code>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-info rounded-pill py-0 px-2 small"
            onClick={fillDefaultCredentials}
          >
            Auto Fill
          </button>
        </div>

        <div className="text-center mt-3">
          <Link to="/" className="text-decoration-none text-muted small">
            <i className="bi bi-arrow-left me-1"></i>Back to Portfolio Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
