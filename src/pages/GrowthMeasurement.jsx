import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChildData } from '../context/ChildDataContext';
import { assessChildNutritionStatus } from '../data/whoStandards';
import MUACTape from '../components/common/MUACTape';
import StatusBadge from '../components/common/StatusBadge';
import {
  Scale,
  Ruler,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Activity,
  History,
  ShieldAlert
} from 'lucide-react';

export default function GrowthMeasurement() {
  const { childrenList, activeChildId, setActiveChildId, addGrowthMeasurement } = useChildData();
  const navigate = useNavigate();

  const selectedChild = childrenList.find(c => c.id === activeChildId) || childrenList[0];

  const [measurement, setMeasurement] = useState({
    date: new Date().toISOString().split('T')[0],
    ageMonths: selectedChild ? selectedChild.ageMonths : 12,
    weight: selectedChild ? selectedChild.weight : 8.5,
    height: selectedChild ? selectedChild.height : 75.0,
    muac: selectedChild ? selectedChild.muac : 13.0,
    headCircumference: 46.0,
    hasEdema: false,
    appetiteTest: 'PASSED', // PASSED, FAILED
    activityLevel: 'Active',
    notes: 'Routine monthly Anganwadi growth monitoring visit.'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [assessment, setAssessment] = useState(null);

  // When selected child changes, populate baseline form values
  useEffect(() => {
    if (selectedChild) {
      setMeasurement(prev => ({
        ...prev,
        ageMonths: selectedChild.ageMonths,
        weight: selectedChild.weight,
        height: selectedChild.height,
        muac: selectedChild.muac,
        hasEdema: selectedChild.hasEdema || false
      }));
    }
  }, [selectedChild]);

  // Real-time live AI assessment computation
  useEffect(() => {
    if (selectedChild) {
      const res = assessChildNutritionStatus(
        measurement.ageMonths,
        parseFloat(measurement.weight) || 0,
        parseFloat(measurement.height) || 0,
        parseFloat(measurement.muac) || 0,
        selectedChild.gender,
        measurement.hasEdema
      );
      setAssessment(res);
    }
  }, [measurement, selectedChild]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMeasurement(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleChildSelect = (e) => {
    setActiveChildId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedChild) return;

    addGrowthMeasurement(selectedChild.id, measurement);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  // Compare with previous recorded measurement
  const previousHistory = selectedChild?.growthHistory || [];
  const lastRecorded = previousHistory.length > 0 ? previousHistory[previousHistory.length - 1] : null;
  const weightDiff = lastRecorded ? (parseFloat(measurement.weight) - lastRecorded.weight).toFixed(2) : null;

  return (
    <div className="container-fluid p-0">
      
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h2 className="card-title-lg fs-4 mb-1">Record Growth Measurement</h2>
          <p className="card-subtitle-sm mb-0">
            Log monthly weight, height, MUAC and run automated WHO diagnostic triage
          </p>
        </div>

        {/* Child Selector Dropdown */}
        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold small text-muted text-nowrap">Select Child:</label>
          <select
            className="form-select-custom"
            style={{ width: '220px', fontWeight: 600 }}
            value={selectedChild?.id || ''}
            onChange={handleChildSelect}
          >
            {childrenList.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.currentStatus})
              </option>
            ))}
          </select>
        </div>
      </div>

      {savedSuccess && (
        <div className="alert alert-success d-flex align-items-center justify-content-between mb-4 rounded-4 shadow-sm">
          <div className="d-flex align-items-center gap-2">
            <CheckCircle2 size={20} />
            <span>
              <strong>Growth Measurement Logged!</strong> Updated health profile & growth curves for {selectedChild?.name}.
            </span>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-success"
              onClick={() => navigate('/monitoring')}
            >
              View WHO Growth Curve
            </button>
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={() => navigate('/history')}
            >
              Go to History
            </button>
          </div>
        </div>
      )}

      {selectedChild && (
        <div className="row g-4">
          
          {/* Left 8 Cols: Child Snapshot & Input Form */}
          <div className="col-lg-8">
            
            {/* Child Profile Banner Card */}
            <div className="custom-card mb-4" style={{ backgroundColor: '#F9FBF9' }}>
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0"
                    style={{ width: '50px', height: '50px', backgroundColor: selectedChild.avatarColor || '#245B49' }}
                  >
                    {selectedChild.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="d-flex align-items-center gap-2">
                      <h4 className="fw-bold mb-0" style={{ color: '#24352E', fontSize: '1.2rem' }}>
                        {selectedChild.name}
                      </h4>
                      <StatusBadge status={selectedChild.currentStatus} />
                    </div>
                    <small className="text-muted d-block">
                      POSHAN ID: <code>{selectedChild.poshanId}</code> &bull; Mother: {selectedChild.motherName} &bull; Village: {selectedChild.village}
                    </small>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <div className="text-end pe-3 border-end">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Last Recorded Weight</small>
                    <span className="fw-bold fs-6">{selectedChild.weight} kg</span>
                  </div>
                  <div className="text-end">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Last MUAC</small>
                    <span className="fw-bold fs-6">{selectedChild.muac} cm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Measurement Form */}
            <div className="custom-card">
              <form onSubmit={handleSubmit}>
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom" style={{ borderColor: '#E5ECE7' }}>
                  <Scale size={20} color="#245B49" />
                  <h4 className="fs-6 fw-bold mb-0" style={{ color: '#245B49' }}>
                    New Anthropometric Measurement
                  </h4>
                </div>

                <div className="row g-3">
                  {/* Measurement Date */}
                  <div className="col-md-4">
                    <label className="form-label-custom">
                      <Calendar size={14} color="#245B49" /> Date of Visit *
                    </label>
                    <input
                      type="date"
                      className="form-control-custom"
                      name="date"
                      value={measurement.date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Age at Measurement */}
                  <div className="col-md-4">
                    <label className="form-label-custom">Age at Visit (Months) *</label>
                    <input
                      type="number"
                      min="0"
                      max="60"
                      className="form-control-custom"
                      name="ageMonths"
                      value={measurement.ageMonths}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Weight */}
                  <div className="col-md-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label-custom mb-0">Weight (kg) *</label>
                      {weightDiff !== null && (
                        <span className={`small fw-bold ${parseFloat(weightDiff) >= 0 ? 'text-success' : 'text-danger'}`} style={{ fontSize: '0.75rem' }}>
                          {parseFloat(weightDiff) >= 0 ? `+${weightDiff} kg` : `${weightDiff} kg`}
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      step="0.05"
                      min="1.0"
                      max="35.0"
                      className="form-control-custom"
                      name="weight"
                      value={measurement.weight}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Height */}
                  <div className="col-md-4">
                    <label className="form-label-custom">
                      <Ruler size={14} color="#245B49" /> Height / Length (cm) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="40.0"
                      max="130.0"
                      className="form-control-custom"
                      name="height"
                      value={measurement.height}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* MUAC */}
                  <div className="col-md-4">
                    <label className="form-label-custom">MUAC Tape (cm) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="8.0"
                      max="20.0"
                      className="form-control-custom"
                      name="muac"
                      value={measurement.muac}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Head Circumference */}
                  <div className="col-md-4">
                    <label className="form-label-custom">Head Circumference (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="30.0"
                      max="58.0"
                      className="form-control-custom"
                      name="headCircumference"
                      value={measurement.headCircumference}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Live MUAC Visual Tape */}
                  <div className="col-12">
                    <MUACTape value={measurement.muac} />
                  </div>

                  {/* Clinical signs & Appetite test */}
                  <div className="col-md-6">
                    <label className="form-label-custom">Appetite Test Result</label>
                    <select
                      className="form-select-custom"
                      name="appetiteTest"
                      value={measurement.appetiteTest}
                      onChange={handleChange}
                    >
                      <option value="PASSED">Passed (Eats RUTF / Porridge willingly)</option>
                      <option value="FAILED">Failed (Refuses food, signs of anorexia - NRC Urgent)</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-custom">General Child Activity Level</label>
                    <select
                      className="form-select-custom"
                      name="activityLevel"
                      value={measurement.activityLevel}
                      onChange={handleChange}
                    >
                      <option value="Active">Active, alert and responsive</option>
                      <option value="Mildly Lethargic">Mildly lethargic / irritable</option>
                      <option value="Unresponsive">Unresponsive / High lethargy</option>
                    </select>
                  </div>

                  {/* Edema Checkbox */}
                  <div className="col-12 mt-2">
                    <div className="p-3 rounded-3 border" style={{ backgroundColor: '#fcf8f8', borderColor: '#E5ECE7' }}>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="measEdema"
                          name="hasEdema"
                          checked={measurement.hasEdema}
                          onChange={handleChange}
                        />
                        <label className="form-check-label fw-bold" htmlFor="measEdema" style={{ color: measurement.hasEdema ? '#D9383A' : '#24352E' }}>
                          Bilateral Pedal Pitting Edema Present (Emergency SAM)
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="col-12">
                    <label className="form-label-custom">Clinical Observations</label>
                    <textarea
                      className="form-control-custom"
                      rows="2"
                      name="notes"
                      value={measurement.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
                  <button
                    type="button"
                    className="btn-outline-custom"
                    onClick={() => navigate('/monitoring')}
                  >
                    View Growth Trajectory
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-custom px-4"
                  >
                    <Scale size={18} /> Save Measurement & Update Record
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right 4 Cols: Real-Time Diagnostic Evaluation */}
          <div className="col-lg-4">
            <div className="custom-card position-sticky" style={{ top: '88px' }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <Sparkles size={18} color="#245B49" />
                <h4 className="card-title-lg mb-0 fs-6">Clinical Diagnostic Verdict</h4>
              </div>

              {assessment && (
                <div>
                  <div className="p-3 rounded-3 mb-3 text-center" style={{
                    backgroundColor: assessment.severity === 'danger' ? '#FDEDED' : assessment.severity === 'warning' ? '#FEF5EC' : '#EDF7ED',
                    border: `1.5px solid ${assessment.severity === 'danger' ? '#F8C9CA' : assessment.severity === 'warning' ? '#F9DAB3' : '#C7E6C9'}`
                  }}>
                    <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>
                      Diagnostic Result
                    </small>
                    <h4 className="fw-bold my-1" style={{
                      color: assessment.severity === 'danger' ? '#D9383A' : assessment.severity === 'warning' ? '#E67E22' : '#2E7D32',
                      fontSize: '1.2rem'
                    }}>
                      {assessment.overallStatus}
                    </h4>
                  </div>

                  {/* Z Scores */}
                  <div className="mb-3">
                    <div className="fw-bold small text-muted mb-2">WHO Standard Z-Scores:</div>
                    <div className="d-flex justify-content-between p-2 mb-1 rounded bg-light small">
                      <span>Weight-for-Age (WAZ):</span>
                      <strong className={assessment.waz < -2 ? 'text-danger' : 'text-success'}>
                        {assessment.waz} SD
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between p-2 mb-1 rounded bg-light small">
                      <span>Height-for-Age (HAZ):</span>
                      <strong className={assessment.haz < -2 ? 'text-danger' : 'text-success'}>
                        {assessment.haz} SD
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between p-2 mb-1 rounded bg-light small">
                      <span>Weight-for-Height (WHZ):</span>
                      <strong className={assessment.whz < -2 ? 'text-danger' : 'text-success'}>
                        {assessment.whz} SD
                      </strong>
                    </div>
                  </div>

                  {/* Growth Velocity analysis */}
                  {weightDiff !== null && (
                    <div className="p-3 rounded-3 mb-3 border" style={{ backgroundColor: '#ffffff', borderColor: '#E5ECE7' }}>
                      <div className="fw-bold small text-muted mb-1 d-flex align-items-center gap-1">
                        <Activity size={14} /> Growth Velocity:
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {parseFloat(weightDiff) > 0 ? (
                          <>
                            <TrendingUp size={20} color="#2E7D32" />
                            <span className="small text-success fw-bold">Positive Growth Velocity (+{weightDiff} kg)</span>
                          </>
                        ) : parseFloat(weightDiff) < 0 ? (
                          <>
                            <TrendingDown size={20} color="#D9383A" />
                            <span className="small text-danger fw-bold">Growth Faltering Alert ({weightDiff} kg)</span>
                          </>
                        ) : (
                          <span className="small text-warning fw-bold">Static Weight Trajectory (0 kg change)</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Steps */}
                  <div className="ai-insight-box">
                    <div className="fw-bold small mb-2 d-flex align-items-center gap-1" style={{ color: '#245B49' }}>
                      <ShieldAlert size={14} /> Frontline Health Worker Protocol:
                    </div>
                    <ul className="mb-0 ps-3 small" style={{ fontSize: '0.78rem' }}>
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
      )}

    </div>
  );
}
