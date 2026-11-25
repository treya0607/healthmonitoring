import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChildData } from '../context/ChildDataContext';
import { assessChildNutritionStatus } from '../data/whoStandards';
import MUACTape from '../components/common/MUACTape';
import StatusBadge from '../components/common/StatusBadge';
import confetti from 'canvas-confetti';
import {
  UserPlus,
  Baby,
  User,
  MapPin,
  Scale,
  Ruler,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function ChildRegistration() {
  const { registerChild } = useChildData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    gender: 'male',
    dob: '',
    ageMonths: 6,
    birthWeight: '3.0',
    bloodGroup: 'B+',
    poshanId: '',
    motherName: '',
    fatherName: '',
    phone: '',
    village: 'Rampur',
    anganwadiCenter: 'AWC-Rampur Sector 1',
    category: 'OBC',
    weight: '7.5',
    height: '67.0',
    muac: '13.0',
    hasEdema: false,
    notes: 'Child enrolled during routine village health and nutrition screening.'
  });

  const [successChild, setSuccessChild] = useState(null);
  const [assessment, setAssessment] = useState(null);

  // Auto-calculate age in months when DOB changes
  const handleDobChange = (dobStr) => {
    if (!dobStr) return;
    const birth = new Date(dobStr);
    const today = new Date();
    const months = (today.getFullYear() - birth.getFullYear()) * 12 + (today.getMonth() - birth.getMonth());
    const validMonths = Math.max(0, Math.min(60, months));
    setFormData(prev => ({
      ...prev,
      dob: dobStr,
      ageMonths: validMonths
    }));
  };

  // Re-calculate live WHO assessment on input change
  useEffect(() => {
    const res = assessChildNutritionStatus(
      formData.ageMonths,
      parseFloat(formData.weight) || 0,
      parseFloat(formData.height) || 0,
      parseFloat(formData.muac) || 0,
      formData.gender,
      formData.hasEdema
    );
    setAssessment(res);
  }, [formData.ageMonths, formData.weight, formData.height, formData.muac, formData.gender, formData.hasEdema]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.motherName.trim()) {
      alert('Please fill out child name and mother name.');
      return;
    }

    const created = registerChild(formData);
    setSuccessChild(created);

    // Fire celebratory confetti for registration
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="container-fluid p-0">
      
      {/* Page Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h2 className="card-title-lg fs-4 mb-1">New Child Registration</h2>
          <p className="card-subtitle-sm mb-0">
            Register infant or toddler under the Anganwadi ChildCare AI & POSHAN scheme
          </p>
        </div>
        <span className="badge p-2 px-3 rounded-pill" style={{ backgroundColor: '#eaf3f0', color: '#245B49', fontWeight: 600 }}>
          <Sparkles size={14} className="me-1 inline" /> WHO Child Standards V2.0
        </span>
      </div>

      {successChild ? (
        /* Success Screen */
        <div className="custom-card text-center py-5">
          <div 
            className="d-inline-flex p-3 rounded-circle mb-3"
            style={{ backgroundColor: '#EDF7ED', color: '#2E7D32' }}
          >
            <CheckCircle2 size={48} />
          </div>
          <h3 className="fw-bold mb-2" style={{ color: '#245B49' }}>
            Child Successfully Registered!
          </h3>
          <p className="text-muted mb-4" style={{ maxWidth: '480px', margin: '0 auto' }}>
            <strong>{successChild.name}</strong> (POSHAN ID: <code>{successChild.poshanId}</code>) has been added to the local Anganwadi register with initial status: <strong>{successChild.currentStatus}</strong>.
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <button
              type="button"
              className="btn-outline-custom"
              onClick={() => {
                setSuccessChild(null);
                setFormData({
                  name: '',
                  gender: 'male',
                  dob: '',
                  ageMonths: 6,
                  birthWeight: '3.0',
                  bloodGroup: 'B+',
                  poshanId: '',
                  motherName: '',
                  fatherName: '',
                  phone: '',
                  village: 'Rampur',
                  anganwadiCenter: 'AWC-Rampur Sector 1',
                  category: 'OBC',
                  weight: '7.5',
                  height: '67.0',
                  muac: '13.0',
                  hasEdema: false,
                  notes: ''
                });
              }}
            >
              <UserPlus size={16} /> Register Another Child
            </button>

            <button
              type="button"
              className="btn-primary-custom"
              onClick={() => navigate('/history')}
            >
              View Child Profile & Health Card <ArrowRight size={16} />
            </button>

            <button
              type="button"
              className="btn-secondary-custom"
              onClick={() => navigate('/monitoring')}
            >
              Open WHO Growth Curves
            </button>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            
            {/* Left 8 Cols: Form Inputs */}
            <div className="col-lg-8">
              
              {/* Section 1: Child Demographics */}
              <div className="custom-card mb-4">
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom" style={{ borderColor: '#E5ECE7' }}>
                  <Baby size={20} color="#245B49" />
                  <h4 className="fs-6 fw-bold mb-0" style={{ color: '#245B49' }}>
                    1. Child Demographic Information
                  </h4>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Child Full Name *</label>
                    <input
                      type="text"
                      className="form-control-custom"
                      name="name"
                      placeholder="e.g. Aarav Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label-custom">Gender *</label>
                    <select
                      className="form-select-custom"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                    >
                      <option value="male">Male (Boy)</option>
                      <option value="female">Female (Girl)</option>
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label-custom">Blood Group</label>
                    <select
                      className="form-select-custom"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label-custom">Date of Birth *</label>
                    <input
                      type="date"
                      className="form-control-custom"
                      name="dob"
                      value={formData.dob}
                      onChange={(e) => handleDobChange(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label-custom">Age (in Months) *</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      className="form-control-custom"
                      name="ageMonths"
                      value={formData.ageMonths}
                      onChange={handleChange}
                      required
                    />
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                      (0 - 60 Months under POSHAN)
                    </small>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label-custom">Birth Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="6.0"
                      className="form-control-custom"
                      name="birthWeight"
                      placeholder="e.g. 2.9"
                      value={formData.birthWeight}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-12">
                    <label className="form-label-custom">POSHAN / MCTS / Aadhar ID (Optional)</label>
                    <input
                      type="text"
                      className="form-control-custom"
                      name="poshanId"
                      placeholder="Leave blank to auto-generate government tracking ID"
                      value={formData.poshanId}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Mother & Family Information */}
              <div className="custom-card mb-4">
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom" style={{ borderColor: '#E5ECE7' }}>
                  <User size={20} color="#245B49" />
                  <h4 className="fs-6 fw-bold mb-0" style={{ color: '#245B49' }}>
                    2. Maternal, Guardian & Village Profile
                  </h4>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Mother's Full Name *</label>
                    <input
                      type="text"
                      className="form-control-custom"
                      name="motherName"
                      placeholder="e.g. Sunita Devi"
                      value={formData.motherName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-custom">Father's / Guardian's Name</label>
                    <input
                      type="text"
                      className="form-control-custom"
                      name="fatherName"
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.fatherName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label-custom">Contact Phone Number</label>
                    <input
                      type="tel"
                      className="form-control-custom"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label-custom">Village / Habitation</label>
                    <select
                      className="form-select-custom"
                      name="village"
                      value={formData.village}
                      onChange={handleChange}
                    >
                      <option value="Rampur">Rampur</option>
                      <option value="Shivpuri">Shivpuri</option>
                      <option value="Sundarpur">Sundarpur</option>
                      <option value="Tribal Hamlet B">Tribal Hamlet B</option>
                      <option value="Kalyanpur">Kalyanpur</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label-custom">Anganwadi Center (AWC)</label>
                    <select
                      className="form-select-custom"
                      name="anganwadiCenter"
                      value={formData.anganwadiCenter}
                      onChange={handleChange}
                    >
                      <option value="AWC-Rampur Sector 1">AWC-Rampur Sector 1</option>
                      <option value="AWC-Rampur Sector 2">AWC-Rampur Sector 2</option>
                      <option value="AWC-Shivpuri Main">AWC-Shivpuri Main</option>
                      <option value="AWC-Sundarpur East">AWC-Sundarpur East</option>
                      <option value="AWC-Sundarpur West">AWC-Sundarpur West</option>
                      <option value="AWC-Vananchal Tribal Unit">AWC-Vananchal Tribal Unit</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label-custom">Social Category</label>
                    <select
                      className="form-select-custom"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC (Other Backward Classes)</option>
                      <option value="SC">SC (Scheduled Caste)</option>
                      <option value="ST">ST (Scheduled Tribe)</option>
                      <option value="Minority">Minority</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Baseline Anthropometric Measurements */}
              <div className="custom-card mb-4">
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom" style={{ borderColor: '#E5ECE7' }}>
                  <Scale size={20} color="#245B49" />
                  <h4 className="fs-6 fw-bold mb-0" style={{ color: '#245B49' }}>
                    3. Baseline Growth Measurements & Clinical Signs
                  </h4>
                </div>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label-custom">
                      <Scale size={14} color="#245B49" /> Current Weight (kg) *
                    </label>
                    <input
                      type="number"
                      step="0.05"
                      min="1.0"
                      max="35.0"
                      className="form-control-custom"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      required
                    />
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>Using calibrated digital infant scale</small>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label-custom">
                      <Ruler size={14} color="#245B49" /> Current Height/Length (cm) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="40.0"
                      max="130.0"
                      className="form-control-custom"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      required
                    />
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>Infantometer (&lt;2y) / Stadiometer (&gt;2y)</small>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label-custom">
                      MUAC Tape (cm) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="8.0"
                      max="20.0"
                      className="form-control-custom"
                      name="muac"
                      value={formData.muac}
                      onChange={handleChange}
                      required
                    />
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>Mid-Upper Arm Circumference</small>
                  </div>

                  <div className="col-12">
                    <MUACTape value={formData.muac} />
                  </div>

                  <div className="col-12 mt-2">
                    <div className="p-3 rounded-3 border" style={{ backgroundColor: '#fbfcfb', borderColor: '#E5ECE7' }}>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="edemaSwitch"
                          name="hasEdema"
                          checked={formData.hasEdema}
                          onChange={handleChange}
                          style={{ cursor: 'pointer' }}
                        />
                        <label className="form-check-label fw-bold" htmlFor="edemaSwitch" style={{ color: formData.hasEdema ? '#D9383A' : '#24352E', fontSize: '0.88rem' }}>
                          Presence of Bilateral Pitting Edema (Kwashiorkor Clinical Sign)
                        </label>
                      </div>
                      <small className="text-muted d-block mt-1" style={{ fontSize: '0.75rem' }}>
                        Press thumbs firmly on tops of both feet for 3 seconds. If pit persists, this confirms severe nutritional edema.
                      </small>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label-custom">Field Notes & Observations</label>
                    <textarea
                      className="form-control-custom"
                      rows="2"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Add any maternal feeding practices, appetite test results, or health notes..."
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="d-flex justify-content-end gap-3 mb-5">
                <button
                  type="button"
                  className="btn-outline-custom"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-custom px-4 py-2"
                >
                  <UserPlus size={18} /> Register Child & Save Profile
                </button>
              </div>

            </div>

            {/* Right 4 Cols: Live AI Nutritional Assessment Preview */}
            <div className="col-lg-4">
              <div className="custom-card position-sticky" style={{ top: '88px' }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Sparkles size={18} color="#245B49" />
                  <h4 className="card-title-lg mb-0 fs-6">Real-Time Clinical AI Preview</h4>
                </div>

                {assessment && (
                  <div>
                    {/* Status Pill */}
                    <div className="p-3 rounded-3 mb-3 text-center" style={{
                      backgroundColor: assessment.severity === 'danger' ? '#FDEDED' : assessment.severity === 'warning' ? '#FEF5EC' : '#EDF7ED',
                      border: `1.5px solid ${assessment.severity === 'danger' ? '#F8C9CA' : assessment.severity === 'warning' ? '#F9DAB3' : '#C7E6C9'}`
                    }}>
                      <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>
                        Automated Classification
                      </small>
                      <h4 className="fw-bold my-1" style={{
                        color: assessment.severity === 'danger' ? '#D9383A' : assessment.severity === 'warning' ? '#E67E22' : '#2E7D32',
                        fontSize: '1.25rem'
                      }}>
                        {assessment.overallStatus}
                      </h4>
                    </div>

                    {/* Z-Scores Grid */}
                    <div className="mb-3">
                      <div className="fw-bold small text-muted mb-2">WHO Standard Z-Scores:</div>
                      
                      <div className="d-flex justify-content-between align-items-center p-2 mb-1 rounded bg-light">
                        <span className="small">Weight-for-Age (WAZ):</span>
                        <span className={`fw-bold ${assessment.waz < -2 ? 'text-danger' : 'text-success'}`}>
                          {assessment.waz} SD
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center p-2 mb-1 rounded bg-light">
                        <span className="small">Height-for-Age (HAZ):</span>
                        <span className={`fw-bold ${assessment.haz < -2 ? 'text-danger' : 'text-success'}`}>
                          {assessment.haz} SD
                        </span>
                      </div>

                      <div className="d-flex justify-content-between align-items-center p-2 mb-1 rounded bg-light">
                        <span className="small">Weight-for-Height (WHZ):</span>
                        <span className={`fw-bold ${assessment.whz < -2 ? 'text-danger' : 'text-success'}`}>
                          {assessment.whz} SD
                        </span>
                      </div>
                    </div>

                    {/* Clinical Reasons */}
                    {assessment.reasons.length > 0 && (
                      <div className="mb-3">
                        <div className="fw-bold small text-muted mb-1">Diagnostic Indicators:</div>
                        <ul className="list-unstyled mb-0 small">
                          {assessment.reasons.map((r, i) => (
                            <li key={i} className="mb-1 text-danger d-flex align-items-start gap-1">
                              &bull; <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    <div className="ai-insight-box">
                      <div className="fw-bold small mb-2 d-flex align-items-center gap-1" style={{ color: '#245B49' }}>
                        <Sparkles size={14} /> Immediate Action Protocol:
                      </div>
                      <ul className="mb-0 ps-3 small" style={{ fontSize: '0.78rem', color: '#24352E' }}>
                        {assessment.recommendations.map((rec, i) => (
                          <li key={i} className="mb-1">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </form>
      )}

    </div>
  );
}
