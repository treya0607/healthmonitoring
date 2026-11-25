import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useChildData } from '../../context/ChildDataContext';
import {
  LayoutDashboard,
  UserPlus,
  Scale,
  Activity,
  LineChart,
  BellRing,
  UtensilsCrossed,
  History,
  FileSpreadsheet,
  Settings,
  LogOut,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const { currentUser, logout } = useAuth();
  const { alerts } = useChildData();
  const navigate = useNavigate();

  const unresolvedAlertsCount = alerts.filter(a => a.status === 'UNRESOLVED').length;
  const criticalCount = alerts.filter(a => a.level === 'CRITICAL' && a.status === 'UNRESOLVED').length;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Child Registration', path: '/register', icon: UserPlus },
    { label: 'Growth Measurement', path: '/measurement', icon: Scale },
    { label: 'Nutritional Assessment', path: '/assessment', icon: Activity },
    { label: 'Growth Monitoring', path: '/monitoring', icon: LineChart },
    { 
      label: 'Alerts & Reminders', 
      path: '/alerts', 
      icon: BellRing, 
      badge: unresolvedAlertsCount > 0 ? unresolvedAlertsCount : null,
      badgeColor: criticalCount > 0 ? '#D9383A' : '#E67E22'
    },
    { label: 'Nutrition Guidance', path: '/guidance', icon: UtensilsCrossed },
    { label: 'Child History', path: '/history', icon: History },
    { label: 'Reports', path: '/reports', icon: FileSpreadsheet },
    { label: 'Settings', path: '/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarWidth = collapsed ? '78px' : '260px';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-lg-none"
          style={{ zIndex: 1040 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`sidebar bg-white border-end d-flex flex-column transition-all ${
          mobileOpen ? 'mobile-visible' : ''
        }`}
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          maxWidth: sidebarWidth,
          borderColor: '#E5ECE7',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 1045,
          transition: 'width 0.25s ease, transform 0.25s ease'
        }}
      >
        {/* Brand Header */}
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between" style={{ borderColor: '#E5ECE7', height: '68px' }}>
          <div className="d-flex align-items-center gap-2 overflow-hidden">
            <div 
              className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
              style={{ width: '38px', height: '38px', backgroundColor: '#245B49', color: '#DDEBB1' }}
            >
              <HeartHandshake size={22} />
            </div>
            {!collapsed && (
              <div className="text-truncate">
                <span className="fw-bold fs-5 text-truncate d-block" style={{ color: '#245B49', lineHeight: 1.1 }}>
                  ChildCare AI
                </span>
                <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>
                  Rural Health Mission
                </small>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            className="btn btn-sm p-1 d-none d-lg-flex align-items-center justify-content-center rounded-circle border"
            style={{ width: '26px', height: '26px', borderColor: '#E5ECE7', color: '#245B49' }}
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation Link List */}
        <div className="flex-grow-1 overflow-y-auto py-3 px-2">
          {!collapsed && (
            <div className="px-3 pb-2 text-uppercase fw-bold text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}>
              Main Navigation
            </div>
          )}

          <nav className="nav flex-column gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none transition-all ${
                      isActive
                        ? 'fw-bold'
                        : 'text-secondary-emphasis hover-bg'
                    }`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? '#eaf3f0' : 'transparent',
                    color: isActive ? '#245B49' : '#24352E',
                    fontSize: '0.88rem',
                    borderLeft: isActive ? '3.5px solid #245B49' : '3.5px solid transparent'
                  })}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={20} className="flex-shrink-0" color={item.path === window.location.pathname ? '#245B49' : '#57675f'} />
                  
                  {!collapsed && (
                    <span className="flex-grow-1 text-truncate">{item.label}</span>
                  )}

                  {!collapsed && item.badge && (
                    <span 
                      className="badge rounded-pill text-white px-2 py-1"
                      style={{ backgroundColor: item.badgeColor, fontSize: '0.7rem' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout Bottom Section */}
        <div className="p-2 border-top" style={{ borderColor: '#E5ECE7' }}>
          {!collapsed && currentUser && (
            <div className="p-2 mb-2 rounded-3 d-flex align-items-center gap-2" style={{ backgroundColor: '#F7F9F7' }}>
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                style={{ width: '34px', height: '34px', backgroundColor: '#245B49', fontSize: '0.8rem' }}
              >
                {currentUser.avatar}
              </div>
              <div className="overflow-hidden flex-grow-1">
                <div className="fw-bold text-truncate" style={{ fontSize: '0.82rem', color: '#24352E' }}>
                  {currentUser.name}
                </div>
                <div className="text-muted text-truncate" style={{ fontSize: '0.72rem' }}>
                  {currentUser.role}
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            className="w-100 btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 border-0 text-danger"
            style={{ backgroundColor: '#FDEDED', fontSize: '0.85rem', fontWeight: 600 }}
            onClick={handleLogout}
            title="Sign out of ChildCare AI"
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
