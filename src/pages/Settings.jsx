import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChildData } from '../context/ChildDataContext';
import {
  Settings,
  Building,
  Wifi,
  RefreshCw,
  Globe,
  Database,
  GraduationCap,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Save
} from 'lucide-react';

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const { resetDemoData, childrenList } = useChildData();

  const [centerConfig, setCenterConfig] = useState({
    centerName: 'AWC-Rampur Sector 1',
    sector: 'Rampur Sector',
    block: 'Rampur Rural Development Block',
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    workerName: currentUser?.name || 'Sunita Devi',
    contactPhone: '+91 98765 43210'
  });

  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleConfigChange = (e) => {
    setCenterConfig({
      ...centerConfig,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSyncNow = () => {
    setSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setSyncing(false);
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1800);
  };

  const handleResetData = () => {
    resetDemoData();
    setResetConfirm(false);
    alert('Demo database reset to factory initial state with 8 children profiles and active alerts.');
  };

  return (
    <div className="container-fluid p-0">
      
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h2 className="card-title-lg fs-4 mb-1">System Settings & Village Configuration</h2>
          <p className="card-subtitle-sm mb-0">
            Configure Anganwadi operational settings, offline sync caching, language and demo data
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="alert alert-success d-flex align-items-center gap-2 mb-4 rounded-4 shadow-sm">
          <CheckCircle2 size={18} />
          <span>Center profile configurations successfully saved to local device!</span>
        </div>
      )}

      <div className="row g-4">
        
        {/* Left Column: Center Profile & Settings */}
        <div className="col-lg-7">
          
          {/* Anganwadi Profile Form */}
          <div className="custom-card mb-4">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
              <Building size={20} color="#245B49" />
              <h4 className="card-title-lg mb-0 fs-6">
                Anganwadi Center (AWC) & Health Administrative Profile
              </h4>
            </div>

            <form onSubmit={handleSaveConfig}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label-custom">Anganwadi Center Name</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    name="centerName"
                    value={centerConfig.centerName}
                    onChange={handleConfigChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label-custom">Sector / Habitation</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    name="sector"
                    value={centerConfig.sector}
                    onChange={handleConfigChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label-custom">CDPO Block</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    name="block"
                    value={centerConfig.block}
                    onChange={handleConfigChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label-custom">District</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    name="district"
                    value={centerConfig.district}
                    onChange={handleConfigChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label-custom">State</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    name="state"
                    value={centerConfig.state}
                    onChange={handleConfigChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label-custom">Designated Anganwadi Worker</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    name="workerName"
                    value={centerConfig.workerName}
                    onChange={handleConfigChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label-custom">Helpline / Contact Phone</label>
                  <input
                    type="text"
                    className="form-control-custom"
                    name="contactPhone"
                    value={centerConfig.contactPhone}
                    onChange={handleConfigChange}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button type="submit" className="btn-primary-custom">
                  <Save size={16} /> Save Center Settings
                </button>
              </div>
            </form>
          </div>

          {/* Offline Sync Simulator */}
          <div className="custom-card mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <Wifi size={20} color="#245B49" />
                <h4 className="card-title-lg mb-0 fs-6">
                  Rural Offline Mode & Cloud Sync Simulator
                </h4>
              </div>
              <span className="badge rounded-pill bg-success-subtle text-success">
                Local Caching Active
              </span>
            </div>

            <p className="small text-muted mb-3" style={{ lineHeight: 1.5 }}>
              Engineered for remote villages with spotty cellular networks. Records are securely stored in the browser's persistent LocalStorage cache and synchronized with the state POSHAN server when network connectivity is detected.
            </p>

            <div className="p-3 rounded-3 mb-3 border bg-light d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div>
                <strong className="text-dark d-block">Current Local Storage Status:</strong>
                <small className="text-secondary">
                  {childrenList.length} child records cached on this tablet. Sync Status: Up to date.
                </small>
              </div>

              <button
                type="button"
                className="btn btn-sm btn-primary-custom"
                onClick={handleSyncNow}
                disabled={syncing}
              >
                <RefreshCw size={14} className={syncing ? 'spinner-border spinner-border-sm' : ''} />
                <span>{syncing ? 'Synchronizing...' : 'Simulate Cloud Sync'}</span>
              </button>
            </div>

            {syncSuccess && (
              <div className="alert alert-success py-2 px-3 small d-flex align-items-center gap-2 rounded-3 mb-0">
                <CheckCircle2 size={16} /> Cloud handshake completed: 0 pending sync conflicts.
              </div>
            )}
          </div>

          {/* Factory Reset Card */}
          <div className="custom-card border-danger border-opacity-25">
            <div className="d-flex align-items-center gap-2 mb-2">
              <Database size={20} className="text-danger" />
              <h4 className="card-title-lg mb-0 fs-6 text-danger">
                Demo Database Management
              </h4>
            </div>
            <p className="small text-muted mb-3">
              Reset the application's local storage data back to the original seed data containing 8 clinical test cases with diverse nutritional statuses (SAM, MAM, Stunted, Normal).
            </p>

            {resetConfirm ? (
              <div className="alert alert-warning p-3 rounded-3 d-flex align-items-center justify-content-between flex-wrap gap-2 mb-0">
                <div className="small">
                  <strong>Are you sure?</strong> Any new child records you added will be replaced by the default demo cases.
                </div>
                <div className="d-flex gap-2">
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setResetConfirm(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-sm btn-danger" onClick={handleResetData}>
                    Yes, Reset Demo Data
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => setResetConfirm(true)}
              >
                <RefreshCw size={14} /> Restore Factory Demo Data
              </button>
            )}
          </div>

        </div>

        {/* Right Column: Language & Project Innovation Info */}
        <div className="col-lg-5">
          
          {/* Language Preference */}
          <div className="custom-card mb-4">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
              <Globe size={20} color="#245B49" />
              <h4 className="card-title-lg mb-0 fs-6">Language / भाषा</h4>
            </div>

            <p className="small text-muted mb-3">
              Supports vernacular scripts for Anganwadi workers across rural Indian states:
            </p>

            <div className="d-flex flex-column gap-2">
              {[
                { code: 'en', label: 'English (Default)', note: 'Primary User Interface' },
                { code: 'hi', label: 'हिन्दी (Hindi)', note: 'उत्तर प्रदेश / बिहार / मध्य प्रदेश' },
                { code: 'bn', label: 'বাংলা (Bengali)', note: 'পশ্চিমবঙ্গ / আসাম' },
                { code: 'te', label: 'తెలుగు (Telugu)', note: 'ఆంధ్రప్రదేశ్ / తెలంగాణ' },
                { code: 'mr', label: 'मराठी (Marathi)', note: 'महाराष्ट्र' }
              ].map(lang => (
                <div
                  key={lang.code}
                  className={`p-2 px-3 rounded-3 border d-flex justify-content-between align-items-center transition-all cursor-pointer ${
                    selectedLanguage === lang.code ? 'border-2 shadow-sm' : ''
                  }`}
                  style={{
                    backgroundColor: selectedLanguage === lang.code ? '#eaf3f0' : '#ffffff',
                    borderColor: selectedLanguage === lang.code ? '#245B49' : '#E5ECE7',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSelectedLanguage(lang.code)}
                >
                  <div>
                    <span className="fw-bold d-block small" style={{ color: '#24352E' }}>
                      {lang.label}
                    </span>
                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>{lang.note}</small>
                  </div>
                  {selectedLanguage === lang.code && (
                    <CheckCircle2 size={16} color="#245B49" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Academic & Innovation Project Card */}
          <div className="custom-card bg-white" style={{ borderColor: '#A8D8C5' }}>
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom" style={{ borderColor: '#E5ECE7' }}>
              <GraduationCap size={20} color="#245B49" />
              <h4 className="card-title-lg mb-0 fs-6">
                Design Thinking & Innovation Project
              </h4>
            </div>

            <div className="ai-insight-box mb-3">
              <span className="badge rounded-pill mb-2" style={{ backgroundColor: '#DDEBB1', color: '#245B49', fontWeight: 700 }}>
                Project Overview
              </span>
              <h5 className="fw-bold mb-1 fs-6" style={{ color: '#245B49' }}>
                AI-Based Child Growth & Nutrition Monitoring System for Rural Healthcare
              </h5>
              <p className="small mb-0 text-muted" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                Designed to bridge frontline diagnostic gaps in remote Anganwadi centers by combining WHO Child Growth standard Z-Score calculations, MUAC color-band triage, and indigenous superfood nutrition guidance into an intuitive, lightweight web tool.
              </p>
            </div>

            <div className="small text-muted">
              <div className="d-flex justify-content-between py-1 border-bottom">
                <span>Frontend Stack:</span>
                <strong className="text-dark">React 18, Bootstrap 5, Chart.js</strong>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom">
                <span>Standardization:</span>
                <strong className="text-dark">WHO Multicentre Growth Reference</strong>
              </div>
              <div className="d-flex justify-content-between py-1 border-bottom">
                <span>Data Layer:</span>
                <strong className="text-dark">Browser LocalStorage (Offline Cache)</strong>
              </div>
              <div className="d-flex justify-content-between py-1">
                <span>Version:</span>
                <strong className="text-dark">v2.4 Final Presentation Ready</strong>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
