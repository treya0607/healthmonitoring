import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChildData } from '../../context/ChildDataContext';
import {
  Menu,
  Search,
  Bell,
  Calendar,
  ChevronDown,
  User,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': 'Executive Health Dashboard',
  '/register': 'Child Registration & Maternal Profile',
  '/measurement': 'Growth Measurement & Assessment',
  '/assessment': 'Comprehensive Nutritional Assessment',
  '/monitoring': 'WHO Growth Trajectory & Curves',
  '/alerts': 'Alerts, Malnutrition & Reminders',
  '/guidance': 'AI Rural Nutrition Guidance & Diet Plans',
  '/history': 'Child Growth & Medical History',
  '/reports': 'Health Cards & Anganwadi MPR Reports',
  '/settings': 'System Settings & Village Configuration'
};

export default function Topbar({ setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, switchUser, DEMO_USERS, logout } = useAuth();
  const { alerts, resolveAlert, searchFilter, setSearchFilter, setActiveChildId } = useChildData();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const currentTitle = PAGE_TITLES[location.pathname] || 'ChildCare AI System';
  const unreadAlerts = alerts.filter(a => a.status === 'UNRESOLVED');

  const todayFormatted = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handleAlertClick = (alert) => {
    setActiveChildId(alert.childId);
    setShowNotifications(false);
    navigate('/alerts');
  };

  return (
    <header
      className="topbar bg-white border-bottom sticky-top px-3 px-md-4 d-flex align-items-center justify-content-between"
      style={{ borderColor: '#E5ECE7', height: '68px', zIndex: 1030 }}
    >
      {/* Left: Mobile Toggle & Page Title / Breadcrumb */}
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-sm btn-outline-custom p-2 d-lg-none"
          onClick={() => setMobileOpen(true)}
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div>
          <nav aria-label="breadcrumb" className="d-none d-sm-block">
            <ol className="breadcrumb mb-0 py-0" style={{ fontSize: '0.75rem' }}>
              <li className="breadcrumb-item">
                <Link to="/dashboard">ChildCare AI</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {currentTitle.split(' ')[0]}
              </li>
            </ol>
          </nav>
          <h1 className="h5 fw-bold mb-0 text-truncate" style={{ color: '#24352E', fontSize: '1.1rem' }}>
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* Right: Search, Date, Notifications, Profile */}
      <div className="d-flex align-items-center gap-2 gap-md-3">
        {/* Global Search Bar */}
        <div className="position-relative d-none d-md-block" style={{ width: '230px' }}>
          <input
            type="text"
            className="form-control form-control-sm ps-4 pe-4"
            placeholder="Search child, Poshan ID, village..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            style={{
              backgroundColor: '#F7F9F7',
              borderColor: '#E5ECE7',
              borderRadius: '20px',
              fontSize: '0.8rem'
            }}
          />
          <Search
            size={14}
            className="position-absolute start-0 top-50 translate-middle-y ms-2 text-muted"
          />
          {searchFilter && (
            <button
              type="button"
              className="btn btn-sm p-0 position-absolute end-0 top-50 translate-middle-y me-2 text-muted border-0 bg-transparent"
              onClick={() => setSearchFilter('')}
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Date Display */}
        <div
          className="d-none d-xl-flex align-items-center gap-2 px-3 py-1 rounded-pill"
          style={{ backgroundColor: '#F7F9F7', border: '1px solid #E5ECE7', fontSize: '0.8rem', color: '#24352E' }}
        >
          <Calendar size={14} color="#245B49" />
          <span>{todayFormatted}</span>
        </div>

        {/* Notifications Icon & Popover */}
        <div className="position-relative">
          <button
            type="button"
            className="btn btn-sm btn-outline-custom position-relative p-2 rounded-circle"
            style={{ width: '38px', height: '38px' }}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            title="Active Health Alerts & Reminders"
          >
            <Bell size={18} color="#245B49" />
            {unreadAlerts.length > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light"
                style={{ fontSize: '0.65rem' }}
              >
                {unreadAlerts.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Card */}
          {showNotifications && (
            <div
              className="card position-absolute end-0 mt-2 shadow-lg border-0 rounded-4"
              style={{ width: '340px', zIndex: 1060, borderColor: '#E5ECE7' }}
            >
              <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
                <div className="fw-bold" style={{ color: '#245B49', fontSize: '0.9rem' }}>
                  Health Alerts & Reminders ({unreadAlerts.length})
                </div>
                <button
                  type="button"
                  className="btn btn-link p-0 text-muted"
                  onClick={() => setShowNotifications(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="card-body p-2" style={{ maxHeight: '360px', overflowY: 'auto' }}>
                {unreadAlerts.length === 0 ? (
                  <div className="text-center py-4 text-muted small">
                    <CheckCircle2 size={32} color="#2E7D32" className="mb-2" />
                    <div>All alerts resolved! No pending health issues.</div>
                  </div>
                ) : (
                  unreadAlerts.slice(0, 5).map(alert => (
                    <div
                      key={alert.id}
                      className="p-2 mb-2 rounded-3 border transition-all cursor-pointer"
                      style={{
                        backgroundColor: alert.level === 'CRITICAL' ? '#FDEDED' : '#FEF5EC',
                        borderColor: alert.level === 'CRITICAL' ? '#F8C9CA' : '#F9DAB3',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleAlertClick(alert)}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span
                          className={`badge ${
                            alert.level === 'CRITICAL' ? 'bg-danger' : 'bg-warning text-dark'
                          }`}
                          style={{ fontSize: '0.65rem' }}
                        >
                          {alert.level}
                        </span>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                          {alert.date}
                        </small>
                      </div>
                      <div className="fw-bold text-truncate" style={{ fontSize: '0.8rem', color: '#24352E' }}>
                        {alert.childName} ({alert.village})
                      </div>
                      <div className="text-truncate small text-secondary" style={{ fontSize: '0.74rem' }}>
                        {alert.title}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="card-footer bg-light p-2 text-center border-top">
                <Link
                  to="/alerts"
                  className="btn btn-sm btn-link text-decoration-none fw-bold"
                  style={{ color: '#245B49', fontSize: '0.8rem' }}
                  onClick={() => setShowNotifications(false)}
                >
                  View All Alerts & Triage Center &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="position-relative">
          <button
            type="button"
            className="btn btn-sm d-flex align-items-center gap-2 p-1 pe-2 rounded-pill border"
            style={{ backgroundColor: '#ffffff', borderColor: '#E5ECE7' }}
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
          >
            <div
              className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
              style={{ width: '32px', height: '32px', backgroundColor: '#245B49', fontSize: '0.75rem' }}
            >
              {currentUser?.avatar || 'US'}
            </div>
            <div className="text-start d-none d-sm-block pe-1">
              <div className="fw-bold text-truncate" style={{ fontSize: '0.8rem', maxWidth: '120px', color: '#24352E' }}>
                {currentUser?.name?.split(' ')[0] || 'User'}
              </div>
              <div className="text-muted text-truncate" style={{ fontSize: '0.68rem', maxWidth: '120px' }}>
                {currentUser?.roleId === 'aww' ? 'Anganwadi' : currentUser?.roleId === 'doctor' ? 'Doctor' : 'Supervisor'}
              </div>
            </div>
            <ChevronDown size={14} className="text-muted" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div
              className="card position-absolute end-0 mt-2 shadow-lg border-0 rounded-4"
              style={{ width: '270px', zIndex: 1060 }}
            >
              <div className="card-body p-3 border-bottom" style={{ backgroundColor: '#f9fbf9' }}>
                <div className="fw-bold text-truncate" style={{ color: '#245B49', fontSize: '0.9rem' }}>
                  {currentUser?.name}
                </div>
                <div className="text-muted small mb-2">{currentUser?.role}</div>
                <span className="badge rounded-pill" style={{ backgroundColor: '#DDEBB1', color: '#245B49', fontSize: '0.7rem' }}>
                  {currentUser?.badge}
                </span>
                <div className="text-muted mt-2" style={{ fontSize: '0.72rem' }}>
                  📍 {currentUser?.phc}
                </div>
              </div>

              {/* Role Switcher */}
              <div className="p-2 border-bottom">
                <small className="text-muted px-2 fw-bold text-uppercase" style={{ fontSize: '0.65rem' }}>
                  Switch Demo Account
                </small>
                {DEMO_USERS.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    className={`btn btn-sm w-100 text-start px-2 py-1 mt-1 rounded-2 border-0 ${
                      currentUser?.id === user.id ? 'fw-bold bg-light' : ''
                    }`}
                    style={{ fontSize: '0.78rem', color: currentUser?.id === user.id ? '#245B49' : '#24352E' }}
                    onClick={() => {
                      switchUser(user);
                      setShowProfileMenu(false);
                    }}
                  >
                    👤 {user.name} ({user.roleId.toUpperCase()})
                  </button>
                ))}
              </div>

              <div className="p-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger w-100 rounded-3 text-start px-3 py-1"
                  style={{ fontSize: '0.8rem' }}
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
