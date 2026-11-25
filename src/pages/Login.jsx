import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartHandshake, 
  ShieldCheck, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Stethoscope, 
  CheckCircle2, 
  Sparkles, 
  Info,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

export default function Login() {
  const { login, DEMO_USERS } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('anganwadi');
  const [password, setPassword] = useState('poshan123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState('aww');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both username and password.');
      return;
    }
    const success = login(username, password, selectedRole);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleQuickDemoLogin = (roleId) => {
    const user = DEMO_USERS.find(u => u.roleId === roleId);
    if (user) {
      setUsername(user.username);
      setPassword('poshan123');
      setSelectedRole(roleId);
      login(user.username, 'poshan123', roleId);
      navigate('/dashboard');
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (forgotEmail) {
      setForgotSuccess(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotSuccess(false);
        setForgotEmail('');
      }, 2500);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ backgroundColor: '#F7F9F7' }}>
      <div className="container" style={{ maxWidth: '1050px' }}>
        <div className="row g-0 rounded-4 overflow-hidden shadow-lg border" style={{ borderColor: '#E5ECE7', backgroundColor: '#FFFFFF' }}>
          
          {/* Left Column: Branding & Mission Overview */}
          <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-between text-white" 
               style={{ background: 'linear-gradient(145deg, #245B49 0%, #1A4436 100%)' }}>
            <div>
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="d-flex align-items-center justify-content-center rounded-3 bg-white p-2" style={{ width: '48px', height: '48px' }}>
                  <HeartHandshake size={32} color="#245B49" />
                </div>
                <div>
                  <h3 className="fw-bold mb-0 text-white tracking-wide">ChildCare AI</h3>
                  <small style={{ color: '#DDEBB1' }}>Rural Healthcare Mission</small>
                </div>
              </div>

              <div className="mb-4">
                <span className="badge rounded-pill px-3 py-2 mb-3" style={{ backgroundColor: '#DDEBB1', color: '#245B49', fontWeight: 700 }}>
                  <Sparkles size={14} className="me-1 inline" /> AI-Driven Growth Assessment
                </span>
                <h2 className="display-6 fw-bold text-white mb-3" style={{ lineHeight: 1.25 }}>
                  Empowering Rural Healthcare & POSHAN Tracking
                </h2>
                <p style={{ color: '#E5ECE7', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  An intelligent digital clinical assistant enabling Anganwadi workers, ASHA sevikas, and Medical Officers to monitor WHO growth standards, detect Severe Acute Malnutrition (SAM), and deliver personalized rural nutritional interventions.
                </p>
              </div>

              {/* Key Features Pill List */}
              <div className="d-flex flex-column gap-2 mb-4">
                <div className="d-flex align-items-center gap-2" style={{ color: '#E5ECE7', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} color="#DDEBB1" />
                  <span>Automated WHO Z-Score & MUAC Tape Triage</span>
                </div>
                <div className="d-flex align-items-center gap-2" style={{ color: '#E5ECE7', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} color="#DDEBB1" />
                  <span>Early Malnutrition & Growth Faltering Alerts</span>
                </div>
                <div className="d-flex align-items-center gap-2" style={{ color: '#E5ECE7', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} color="#DDEBB1" />
                  <span>Indigenous High-Energy Nutrient Diet Recipes</span>
                </div>
                <div className="d-flex align-items-center gap-2" style={{ color: '#E5ECE7', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={18} color="#DDEBB1" />
                  <span>Anganwadi Monthly Progress & Health Cards</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-top border-white border-opacity-10 d-flex justify-content-between align-items-center">
              <small style={{ color: '#A8D8C5' }}>Ministry of WCD & Rural Health Initiative</small>
              <small style={{ color: '#DDEBB1' }}>v2.4 Live Demo</small>
            </div>
          </div>

          {/* Right Column: Interactive Login Form */}
          <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-center bg-white">
            <div className="mb-4">
              <h3 className="fw-bold mb-1" style={{ color: '#24352E' }}>Welcome Back</h3>
              <p className="text-muted small">Please sign in to access your child health dashboard.</p>
            </div>

            {errorMsg && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 rounded-3">
                <Info size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Select Role Tab */}
              <div className="mb-3">
                <label className="form-label-custom">Select Operational Role</label>
                <div className="btn-group w-100" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedRole === 'aww' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                    style={{ fontSize: '0.8rem', padding: '0.45rem' }}
                    onClick={() => { setSelectedRole('aww'); setUsername('anganwadi'); }}
                  >
                    Anganwadi
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedRole === 'doctor' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                    style={{ fontSize: '0.8rem', padding: '0.45rem' }}
                    onClick={() => { setSelectedRole('doctor'); setUsername('doctor'); }}
                  >
                    Medical Officer
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${selectedRole === 'supervisor' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                    style={{ fontSize: '0.8rem', padding: '0.45rem' }}
                    onClick={() => { setSelectedRole('supervisor'); setUsername('supervisor'); }}
                  >
                    CDPO Officer
                  </button>
                </div>
              </div>

              {/* Username Input */}
              <div className="mb-3">
                <label className="form-label-custom">
                  <User size={15} color="#245B49" /> Username / Sector ID
                </label>
                <input
                  type="text"
                  className="form-control-custom"
                  placeholder="Enter username (e.g. anganwadi)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label-custom mb-0">
                    <Lock size={15} color="#245B49" /> Password
                  </label>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none small"
                    style={{ color: '#245B49', fontSize: '0.8rem', fontWeight: 600 }}
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="position-relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control-custom pe-5"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted pe-3 text-decoration-none"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberCheck"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ borderColor: '#245B49' }}
                  />
                  <label className="form-check-label small" htmlFor="rememberCheck" style={{ color: '#24352E' }}>
                    Remember me on this Anganwadi Tablet
                  </label>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="btn-primary-custom w-100 py-2 mb-3"
                style={{ fontSize: '1rem', letterSpacing: '0.02em' }}
              >
                Sign In to Dashboard <ArrowRight size={18} />
              </button>
            </form>

            {/* Quick Demo Login Preset Buttons */}
            <div className="mt-2 pt-3 border-top" style={{ borderColor: '#E5ECE7' }}>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <small className="fw-bold" style={{ color: '#718078' }}>
                  <HelpCircle size={14} className="me-1 inline" /> 1-Click Demo Profiles:
                </small>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-custom flex-grow-1 text-start d-flex align-items-center gap-2"
                  onClick={() => handleQuickDemoLogin('aww')}
                >
                  <span className="badge rounded-circle p-1 bg-success text-white">AW</span>
                  <div className="overflow-hidden">
                    <div className="fw-bold" style={{ fontSize: '0.78rem' }}>Anganwadi Sevika</div>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>Sunita Devi</small>
                  </div>
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-outline-custom flex-grow-1 text-start d-flex align-items-center gap-2"
                  onClick={() => handleQuickDemoLogin('doctor')}
                >
                  <span className="badge rounded-circle p-1 bg-primary text-white">MO</span>
                  <div className="overflow-hidden">
                    <div className="fw-bold" style={{ fontSize: '0.78rem' }}>Medical Officer</div>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>Dr. A. Mehta</small>
                  </div>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '420px' }}>
            <div className="modal-content border-0 rounded-4 p-3 shadow-lg">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold" style={{ color: '#245B49' }}>Reset Account Password</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => { setShowForgotPassword(false); setForgotSuccess(false); }}
                ></button>
              </div>
              <div className="modal-body">
                {forgotSuccess ? (
                  <div className="text-center py-3">
                    <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ backgroundColor: '#EDF7ED', color: '#2E7D32' }}>
                      <CheckCircle2 size={36} />
                    </div>
                    <h6 className="fw-bold">Password Reset Instructions Sent!</h6>
                    <p className="small text-muted mb-0">
                      If an account exists for {forgotEmail}, an SMS/Email with verification instructions has been dispatched to your PHC registered phone.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleForgotSubmit}>
                    <p className="small text-muted mb-3">
                      Enter your registered Anganwadi Center ID or phone number to receive a temporary recovery PIN.
                    </p>
                    <div className="mb-3">
                      <label className="form-label-custom">Registered Phone / Email / Center ID</label>
                      <input 
                        type="text" 
                        className="form-control-custom"
                        placeholder="e.g. +91 98765 43210 or awc-rampur@gov.in"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="d-flex justify-content-end gap-2 mt-4">
                      <button 
                        type="button" 
                        className="btn btn-sm btn-outline-custom"
                        onClick={() => setShowForgotPassword(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-sm btn-primary-custom">
                        Request OTP PIN
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
