import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useChildData } from '../context/ChildDataContext';
import {
  BellRing,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  PhoneCall,
  FileText,
  MapPin,
  Calendar,
  Send,
  Sparkles,
  Search
} from 'lucide-react';

export default function AlertsReminders() {
  const { alerts, resolveAlert, setActiveChildId } = useChildData();
  const navigate = useNavigate();

  const [filterLevel, setFilterLevel] = useState('ALL'); // ALL, CRITICAL, WARNING, REMINDER
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, UNRESOLVED, RESOLVED
  const [smsSentId, setSmsSentId] = useState(null);

  const filteredAlerts = alerts.filter(a => {
    if (filterLevel !== 'ALL' && a.level !== filterLevel) return false;
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    return true;
  });

  const criticalCount = alerts.filter(a => a.level === 'CRITICAL' && a.status === 'UNRESOLVED').length;
  const warningCount = alerts.filter(a => a.level === 'WARNING' && a.status === 'UNRESOLVED').length;
  const reminderCount = alerts.filter(a => a.level === 'REMINDER' && a.status === 'UNRESOLVED').length;

  const handleSendSms = (alertId) => {
    setSmsSentId(alertId);
    setTimeout(() => {
      setSmsSentId(null);
    }, 2500);
  };

  const handleViewChild = (childId) => {
    setActiveChildId(childId);
    navigate('/history');
  };

  return (
    <div className="container-fluid p-0">
      
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h2 className="card-title-lg fs-4 mb-1">Health Alerts, SAM Triage & Reminders</h2>
          <p className="card-subtitle-sm mb-0">
            Real-time automated clinical alarms for malnutrition, growth faltering, and vaccination due dates
          </p>
        </div>

        <div className="d-flex gap-2">
          <Link to="/reports" className="btn btn-sm btn-outline-custom">
            <FileText size={14} /> Export Referral Register
          </Link>
        </div>
      </div>

      {/* Alert Summary Pill Counters */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div
            className={`p-3 rounded-4 border d-flex align-items-center justify-content-between transition-all cursor-pointer ${
              filterLevel === 'CRITICAL' ? 'shadow' : ''
            }`}
            style={{
              backgroundColor: '#FDEDED',
              borderColor: '#F8C9CA',
              cursor: 'pointer'
            }}
            onClick={() => setFilterLevel(filterLevel === 'CRITICAL' ? 'ALL' : 'CRITICAL')}
          >
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 bg-danger text-white rounded-3">
                <AlertOctagon size={24} />
              </div>
              <div>
                <h4 className="fw-bold mb-0 text-danger">{criticalCount}</h4>
                <small className="text-secondary fw-semibold">Critical SAM Alarms</small>
              </div>
            </div>
            <span className="badge bg-danger rounded-pill">Urgent</span>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className={`p-3 rounded-4 border d-flex align-items-center justify-content-between transition-all cursor-pointer ${
              filterLevel === 'WARNING' ? 'shadow' : ''
            }`}
            style={{
              backgroundColor: '#FEF5EC',
              borderColor: '#F9DAB3',
              cursor: 'pointer'
            }}
            onClick={() => setFilterLevel(filterLevel === 'WARNING' ? 'ALL' : 'WARNING')}
          >
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 text-white rounded-3" style={{ backgroundColor: '#E67E22' }}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="fw-bold mb-0 text-warning">{warningCount}</h4>
                <small className="text-secondary fw-semibold">Moderate (MAM) Warnings</small>
              </div>
            </div>
            <span className="badge rounded-pill" style={{ backgroundColor: '#E67E22' }}>Intervene</span>
          </div>
        </div>

        <div className="col-md-4">
          <div
            className={`p-3 rounded-4 border d-flex align-items-center justify-content-between transition-all cursor-pointer ${
              filterLevel === 'REMINDER' ? 'shadow' : ''
            }`}
            style={{
              backgroundColor: '#EBF3FB',
              borderColor: '#C5DCFA',
              cursor: 'pointer'
            }}
            onClick={() => setFilterLevel(filterLevel === 'REMINDER' ? 'ALL' : 'REMINDER')}
          >
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 bg-primary text-white rounded-3">
                <BellRing size={24} />
              </div>
              <div>
                <h4 className="fw-bold mb-0 text-primary">{reminderCount}</h4>
                <small className="text-secondary fw-semibold">Vaccines & Follow-ups</small>
              </div>
            </div>
            <span className="badge bg-primary rounded-pill">Routine</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="custom-card mb-4 p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className={`btn btn-sm ${filterLevel === 'ALL' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
            onClick={() => setFilterLevel('ALL')}
          >
            All Alert Types
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterLevel === 'CRITICAL' ? 'btn-danger' : 'btn-outline-custom'}`}
            onClick={() => setFilterLevel('CRITICAL')}
          >
            SAM Critical Only ({criticalCount})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterLevel === 'WARNING' ? 'btn-warning text-dark' : 'btn-outline-custom'}`}
            onClick={() => setFilterLevel('WARNING')}
          >
            MAM Warnings ({warningCount})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterLevel === 'REMINDER' ? 'btn-info text-white' : 'btn-outline-custom'}`}
            onClick={() => setFilterLevel('REMINDER')}
          >
            Reminders ({reminderCount})
          </button>
        </div>

        <div className="d-flex align-items-center gap-2">
          <label className="small text-muted fw-bold">Status:</label>
          <select
            className="form-select-custom py-1"
            style={{ width: '150px', fontSize: '0.8rem' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="UNRESOLVED">Pending Action</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="d-flex flex-column gap-3">
        {filteredAlerts.length === 0 ? (
          <div className="custom-card text-center py-5">
            <CheckCircle2 size={42} color="#2E7D32" className="mb-2" />
            <h5 className="fw-bold" style={{ color: '#245B49' }}>No Alerts Match This Filter</h5>
            <p className="text-muted small mb-0">All child records are clear of unresolved alerts in this category.</p>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.level === 'CRITICAL';
            const isWarning = alert.level === 'WARNING';
            const isResolved = alert.status === 'RESOLVED';

            return (
              <div
                key={alert.id}
                className="custom-card border-start border-4 position-relative"
                style={{
                  borderLeftColor: isResolved ? '#718078' : isCritical ? '#D9383A' : isWarning ? '#E67E22' : '#1976D2',
                  backgroundColor: isResolved ? '#f9fbf9' : '#ffffff',
                  opacity: isResolved ? 0.8 : 1
                }}
              >
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
                  
                  {/* Alert Main Details */}
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={`badge rounded-pill px-2 py-1 ${
                          isResolved ? 'bg-secondary' : isCritical ? 'bg-danger' : isWarning ? 'bg-warning text-dark' : 'bg-primary'
                        }`}
                        style={{ fontSize: '0.7rem' }}
                      >
                        {alert.level}
                      </span>

                      <span className="fw-bold fs-6" style={{ color: '#24352E' }}>
                        {alert.childName}
                      </span>

                      <small className="text-muted d-flex align-items-center gap-1">
                        <MapPin size={12} /> {alert.village}
                      </small>

                      <small className="text-muted d-flex align-items-center gap-1 ms-auto">
                        <Calendar size={12} /> {alert.date}
                      </small>
                    </div>

                    <h5 className="fw-bold fs-6 mb-1" style={{ color: isCritical ? '#D9383A' : '#245B49' }}>
                      {alert.title}
                    </h5>

                    <p className="text-muted small mb-2" style={{ lineHeight: 1.5 }}>
                      {alert.description}
                    </p>

                    <div className="p-2 rounded-3 bg-light d-flex align-items-center gap-2 small">
                      <strong style={{ color: '#245B49' }}>Required Health Action:</strong>
                      <span className="text-secondary">{alert.actionRequired}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex flex-column gap-2 flex-shrink-0" style={{ minWidth: '180px' }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-custom w-100 text-start d-flex align-items-center justify-content-between"
                      onClick={() => handleViewChild(alert.childId)}
                    >
                      <span>Child Profile</span>
                      <Sparkles size={14} />
                    </button>

                    <button
                      type="button"
                      className={`btn btn-sm w-100 text-start d-flex align-items-center justify-content-between ${
                        smsSentId === alert.id ? 'btn-success' : 'btn-outline-custom'
                      }`}
                      onClick={() => handleSendSms(alert.id)}
                    >
                      <span>{smsSentId === alert.id ? 'SMS Dispatched!' : 'Notify ASHA / Mother'}</span>
                      <Send size={14} />
                    </button>

                    {isResolved ? (
                      <span className="badge bg-light text-muted border py-2 text-center">
                        <CheckCircle2 size={13} className="me-1 inline" /> Action Resolved
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary-custom w-100"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        <CheckCircle2 size={14} /> Mark as Resolved
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
