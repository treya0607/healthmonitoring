import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChildData } from '../context/ChildDataContext';
import StatusBadge from '../components/common/StatusBadge';
import {
  History,
  Scale,
  Ruler,
  Calendar,
  User,
  MapPin,
  Phone,
  ShieldAlert,
  Trash2,
  LineChart,
  Syringe,
  Printer,
  Search,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export default function ChildHistory() {
  const { filteredChildren, activeChildId, setActiveChildId, deleteChild, searchFilter, setSearchFilter } = useChildData();
  const navigate = useNavigate();

  const selectedChild = filteredChildren.find(c => c.id === activeChildId) || filteredChildren[0];
  const [deleteModalChildId, setDeleteModalChildId] = useState(null);

  // Standard Universal Immunization Programme (UIP) Checklist
  const STANDARD_VACCINES = [
    { name: 'BCG (Bacillus Calmette-Guérin)', ageTarget: 'At Birth', status: 'Completed' },
    { name: 'OPV-0 & Hepatitis B Birth Dose', ageTarget: 'At Birth', status: 'Completed' },
    { name: 'Pentavalent 1 & Rotavirus 1', ageTarget: '6 Weeks', status: 'Completed' },
    { name: 'Pentavalent 2 & Rotavirus 2', ageTarget: '10 Weeks', status: 'Completed' },
    { name: 'Pentavalent 3 & IPV', ageTarget: '14 Weeks', status: 'Completed' },
    { name: 'Measles-Rubella 1st Dose', ageTarget: '9-12 Months', status: 'Completed' },
    { name: 'Vitamin A 1st Oral Megadose', ageTarget: '9 Months', status: 'Completed' },
    { name: 'DPT Booster 1 & MR 2nd Dose', ageTarget: '16-24 Months', status: 'Due / Scheduled' }
  ];

  const handleDeleteConfirm = () => {
    if (deleteModalChildId) {
      deleteChild(deleteModalChildId);
      setDeleteModalChildId(null);
    }
  };

  return (
    <div className="container-fluid p-0">
      
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h2 className="card-title-lg fs-4 mb-1">Child Health History & Longitudinal Log</h2>
          <p className="card-subtitle-sm mb-0">
            Comprehensive profile, past growth measurements, clinical observations & immunizations
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-custom"
            onClick={() => window.print()}
          >
            <Printer size={15} /> Print Child Record
          </button>
        </div>
      </div>

      <div className="row g-4">
        
        {/* Left Column: Children Selection Master List */}
        <div className="col-lg-4">
          <div className="custom-card mb-4">
            <div className="mb-3">
              <label className="form-label-custom mb-1">Search & Filter Children</label>
              <div className="position-relative">
                <input
                  type="text"
                  className="form-control-custom ps-4"
                  placeholder="Filter name, POSHAN ID, village..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
                <Search size={14} className="position-absolute start-0 top-50 translate-middle-y ms-2 text-muted" />
              </div>
            </div>

            <div className="d-flex flex-column gap-2" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {filteredChildren.length === 0 ? (
                <div className="text-center py-4 text-muted small">
                  No children match search "{searchFilter}".
                </div>
              ) : (
                filteredChildren.map(child => (
                  <div
                    key={child.id}
                    className={`p-2 rounded-3 border transition-all cursor-pointer ${
                      selectedChild?.id === child.id ? 'border-2 shadow-sm' : ''
                    }`}
                    style={{
                      backgroundColor: selectedChild?.id === child.id ? '#eaf3f0' : '#ffffff',
                      borderColor: selectedChild?.id === child.id ? '#245B49' : '#E5ECE7',
                      cursor: 'pointer'
                    }}
                    onClick={() => setActiveChildId(child.id)}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-1">
                      <span className="fw-bold text-truncate" style={{ fontSize: '0.88rem', color: '#24352E' }}>
                        {child.name}
                      </span>
                      <StatusBadge status={child.currentStatus} />
                    </div>

                    <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.74rem' }}>
                      <span>{child.gender === 'male' ? 'Boy' : 'Girl'}, {child.ageMonths}m</span>
                      <span>{child.village}</span>
                      <span className="fw-semibold text-dark">{child.weight} kg</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Child Detailed History */}
        <div className="col-lg-8">
          {selectedChild ? (
            <div>
              
              {/* Profile Card Header */}
              <div className="custom-card mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 pb-3 border-bottom">
                  
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold fs-4 flex-shrink-0"
                      style={{ width: '56px', height: '56px', backgroundColor: selectedChild.avatarColor || '#245B49' }}
                    >
                      {selectedChild.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <h3 className="fw-bold mb-0 fs-5" style={{ color: '#24352E' }}>
                          {selectedChild.name}
                        </h3>
                        <StatusBadge status={selectedChild.currentStatus} />
                      </div>
                      <small className="text-muted d-block mt-1">
                        POSHAN ID: <code>{selectedChild.poshanId}</code> &bull; Social Category: {selectedChild.category}
                      </small>
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-custom"
                      onClick={() => navigate('/measurement')}
                      title="Add Growth Entry"
                    >
                      <Scale size={14} /> New Visit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-custom"
                      onClick={() => navigate('/monitoring')}
                      title="View WHO Trajectory"
                    >
                      <LineChart size={14} /> WHO Curve
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => setDeleteModalChildId(selectedChild.id)}
                      title="Delete Record"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                </div>

                {/* Key Metrics Quick Ribbon */}
                <div className="row g-2 pt-3 text-center">
                  <div className="col-4 col-md-2 border-end">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Current Age</small>
                    <span className="fw-bold fs-6">{selectedChild.ageMonths} mo</span>
                  </div>
                  <div className="col-4 col-md-2 border-end">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Current Weight</small>
                    <span className="fw-bold fs-6 text-success">{selectedChild.weight} kg</span>
                  </div>
                  <div className="col-4 col-md-2 border-end">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Height</small>
                    <span className="fw-bold fs-6">{selectedChild.height} cm</span>
                  </div>
                  <div className="col-4 col-md-2 border-end">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>MUAC Tape</small>
                    <span className={`fw-bold fs-6 ${selectedChild.muac < 11.5 ? 'text-danger' : selectedChild.muac < 12.5 ? 'text-warning' : 'text-success'}`}>
                      {selectedChild.muac} cm
                    </span>
                  </div>
                  <div className="col-4 col-md-2 border-end">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>WAZ Score</small>
                    <span className="fw-bold fs-6">{selectedChild.waz} SD</span>
                  </div>
                  <div className="col-4 col-md-2">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Blood Group</small>
                    <span className="fw-bold fs-6">{selectedChild.bloodGroup || 'B+'}</span>
                  </div>
                </div>

                {/* Maternal & Village Details */}
                <div className="mt-3 pt-3 border-top row g-2 small text-secondary">
                  <div className="col-md-4">
                    <span className="text-dark fw-semibold">Mother:</span> {selectedChild.motherName}
                  </div>
                  <div className="col-md-4">
                    <span className="text-dark fw-semibold">Contact:</span> {selectedChild.phone}
                  </div>
                  <div className="col-md-4">
                    <span className="text-dark fw-semibold">Village:</span> {selectedChild.village} ({selectedChild.anganwadiCenter})
                  </div>
                </div>
              </div>

              {/* Longitudinal Growth Timeline */}
              <div className="custom-card mb-4">
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                  <History size={18} color="#245B49" />
                  <h4 className="card-title-lg mb-0 fs-6">
                    Growth Measurement Timeline ({selectedChild.growthHistory?.length || 0} Visits)
                  </h4>
                </div>

                <div className="position-relative ps-3 border-start border-2 ms-2" style={{ borderColor: '#A8D8C5' }}>
                  {selectedChild.growthHistory?.map((visit, index) => (
                    <div key={index} className="position-relative mb-4 ps-3">
                      {/* Timeline Dot */}
                      <div
                        className="position-absolute rounded-circle"
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: visit.status === 'SAM' ? '#D9383A' : visit.status === 'MAM' ? '#E67E22' : '#245B49',
                          left: '-23px',
                          top: '5px',
                          border: '2px solid #ffffff'
                        }}
                      />

                      <div className="p-3 rounded-3 border bg-white" style={{ borderColor: '#E5ECE7' }}>
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold text-dark fs-6">
                            Visit at {visit.ageMonths} Months
                          </span>
                          <span className="small text-muted">{visit.date}</span>
                        </div>

                        <div className="d-flex gap-3 mb-2 small flex-wrap">
                          <span className="badge bg-light text-dark border">
                            ⚖️ Weight: <strong>{visit.weight} kg</strong>
                          </span>
                          <span className="badge bg-light text-dark border">
                            📏 Height: <strong>{visit.height} cm</strong>
                          </span>
                          <span className="badge bg-light text-dark border">
                            🎗️ MUAC: <strong>{visit.muac} cm</strong>
                          </span>
                          <StatusBadge status={visit.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immunization & Vitamin Supplementation Record */}
              <div className="custom-card mb-4">
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                  <Syringe size={18} color="#245B49" />
                  <h4 className="card-title-lg mb-0 fs-6">
                    Universal Immunization Programme (UIP) Status
                  </h4>
                </div>

                <div className="table-responsive">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Vaccine / Supplement</th>
                        <th>Recommended Age</th>
                        <th>Administration Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STANDARD_VACCINES.map((vax, idx) => (
                        <tr key={idx}>
                          <td className="fw-semibold small">{vax.name}</td>
                          <td className="small text-muted">{vax.ageTarget}</td>
                          <td>
                            <span className="badge rounded-pill bg-success-subtle text-success small">
                              <CheckCircle2 size={12} className="inline me-1" /> {vax.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="custom-card text-center py-5 text-muted">
              Select a child from the left to inspect longitudinal health history.
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalChildId && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '400px' }}>
            <div className="modal-content border-0 rounded-4 shadow-lg p-3">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-danger">Delete Child Record?</h5>
                <button type="button" className="btn-close" onClick={() => setDeleteModalChildId(null)}></button>
              </div>
              <div className="modal-body">
                <p className="small text-muted">
                  Are you sure you want to delete this child's record? All longitudinal growth measurements, alerts, and immunization history will be permanently deleted from this device.
                </p>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button type="button" className="btn btn-sm btn-outline-custom" onClick={() => setDeleteModalChildId(null)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-sm btn-danger" onClick={handleDeleteConfirm}>
                    Yes, Delete Record
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
