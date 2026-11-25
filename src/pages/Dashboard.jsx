import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChildData } from '../context/ChildDataContext';
import StatCard from '../components/common/StatCard';
import StatusBadge from '../components/common/StatusBadge';
import {
  Users,
  AlertOctagon,
  AlertTriangle,
  HeartPulse,
  Scale,
  UserPlus,
  FileText,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { childrenList, alerts, setActiveChildId } = useChildData();
  const navigate = useNavigate();

  // Compute metrics
  const totalChildren = childrenList.length;
  const samCount = childrenList.filter(c => c.currentStatus === 'SAM').length;
  const mamCount = childrenList.filter(c => c.currentStatus === 'MAM').length;
  const stuntedCount = childrenList.filter(c => c.currentStatus === 'Stunted').length;
  const underweightCount = childrenList.filter(c => c.currentStatus === 'Underweight').length;
  const normalCount = childrenList.filter(c => c.currentStatus === 'Normal').length;

  const samPercentage = totalChildren > 0 ? ((samCount / totalChildren) * 100).toFixed(1) : 0;
  const healthyPercentage = totalChildren > 0 ? ((normalCount / totalChildren) * 100).toFixed(1) : 0;

  const criticalAlerts = alerts.filter(a => a.level === 'CRITICAL' && a.status === 'UNRESOLVED');

  // Chart 1: Malnutrition Distribution
  const doughnutData = {
    labels: ['SAM (Severe)', 'MAM (Moderate)', 'Stunted', 'Underweight', 'Normal / Healthy'],
    datasets: [
      {
        data: [samCount, mamCount, stuntedCount, underweightCount, normalCount],
        backgroundColor: ['#D9383A', '#E67E22', '#8E44AD', '#F39C12', '#245B49'],
        borderWidth: 2,
        borderColor: '#FFFFFF',
        hoverOffset: 6
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
        }
      }
    },
    cutout: '72%'
  };

  // Chart 2: Village / Sector Health Distribution
  const villageGroups = childrenList.reduce((acc, child) => {
    const v = child.village || 'Other';
    if (!acc[v]) acc[v] = { total: 0, atRisk: 0, normal: 0 };
    acc[v].total += 1;
    if (child.currentStatus === 'Normal') acc[v].normal += 1;
    else acc[v].atRisk += 1;
    return acc;
  }, {});

  const barLabels = Object.keys(villageGroups);
  const barData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Normal & Healthy',
        data: barLabels.map(v => villageGroups[v].normal),
        backgroundColor: '#245B49',
        borderRadius: 6
      },
      {
        label: 'At Risk (SAM/MAM/Stunted)',
        data: barLabels.map(v => villageGroups[v].atRisk),
        backgroundColor: '#E67E22',
        borderRadius: 6
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { grid: { display: false } },
      y: { 
        beginAtZero: true, 
        ticks: { stepSize: 1 },
        grid: { color: '#E5ECE7' }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 12, font: { size: 11 } }
      }
    }
  };

  const handleChildClick = (childId, targetRoute = '/history') => {
    setActiveChildId(childId);
    navigate(targetRoute);
  };

  return (
    <div className="container-fluid p-0">
      
      {/* Welcome & Sector Banner */}
      <div 
        className="rounded-4 p-4 mb-4 border d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3"
        style={{
          background: 'linear-gradient(135deg, #245B49 0%, #1d4b3c 100%)',
          color: '#ffffff',
          borderColor: '#1d4b3c'
        }}
      >
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge rounded-pill" style={{ backgroundColor: '#DDEBB1', color: '#245B49', fontWeight: 700, fontSize: '0.72rem' }}>
              <Sparkles size={12} className="inline me-1" /> POSHAN Abhiyaan 2.0
            </span>
            <span className="badge bg-white bg-opacity-25" style={{ fontSize: '0.72rem' }}>
              Center: {currentUser?.sector || 'Rampur Block A'}
            </span>
          </div>
          <h2 className="fw-bold mb-1 fs-4">
            Welcome, {currentUser?.name || 'Healthcare Worker'}
          </h2>
          <p className="mb-0 text-white-50 small">
            Monitoring rural child growth, early nutritional screening, and POSHAN malnutrition triage.
          </p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <Link to="/register" className="btn btn-sm" style={{ backgroundColor: '#DDEBB1', color: '#245B49', fontWeight: 700, borderRadius: '10px', padding: '0.55rem 1rem' }}>
            <UserPlus size={16} className="me-1" /> Register Child
          </Link>
          <Link to="/measurement" className="btn btn-sm btn-outline-light" style={{ borderRadius: '10px', padding: '0.55rem 1rem' }}>
            <Scale size={16} className="me-1" /> New Measurement
          </Link>
          <Link to="/reports" className="btn btn-sm btn-outline-light" style={{ borderRadius: '10px', padding: '0.55rem 1rem' }}>
            <FileText size={16} className="me-1" /> Monthly Report
          </Link>
        </div>
      </div>

      {/* Critical SAM / Urgent Alert Notification Banner */}
      {criticalAlerts.length > 0 && (
        <div className="alert alert-danger rounded-4 border-danger border-opacity-25 p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2 shadow-sm">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 bg-danger text-white rounded-3">
              <AlertOctagon size={24} />
            </div>
            <div>
              <div className="fw-bold text-danger">
                {criticalAlerts.length} Critical Malnutrition (SAM) Cases Requiring Immediate Medical Attention!
              </div>
              <small className="text-secondary">
                Children flagged with MUAC &lt; 11.5cm or bilateral edema need urgent NRC referral.
              </small>
            </div>
          </div>
          <Link to="/alerts" className="btn btn-sm btn-danger px-3 py-1 rounded-pill fw-bold">
            Open Triage Protocol &rarr;
          </Link>
        </div>
      )}

      {/* KPI Stat Cards Grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Total Registered Children"
            value={totalChildren}
            subtitle="Under 5 years screened"
            icon={Users}
            color="#245B49"
            trend="+2 this month"
            trendType="up"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Severe Malnutrition (SAM)"
            value={samCount}
            subtitle={`${samPercentage}% of local cohort`}
            icon={AlertOctagon}
            color="#D9383A"
            bg="#FFF7F7"
            trend="Urgent NRC Action"
            trendType="down"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Moderate Malnutrition (MAM)"
            value={mamCount}
            subtitle="Enrolled in Supplementary THR"
            icon={AlertTriangle}
            color="#E67E22"
            bg="#FFFBF5"
            trend="Needs monitoring"
            trendType="up"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            title="Healthy & Age-Appropriate"
            value={normalCount}
            subtitle={`${healthyPercentage}% optimal trajectory`}
            icon={HeartPulse}
            color="#2E7D32"
            bg="#F6FBF7"
            trend="WHO Standard"
            trendType="up"
          />
        </div>
      </div>

      {/* Charts Section: Malnutrition Breakdown & Village Screening Progress */}
      <div className="row g-3 mb-4">
        
        {/* Nutrition Distribution Doughnut */}
        <div className="col-lg-5">
          <div className="custom-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="card-title-lg">Nutritional Triage Distribution</h3>
                <span className="card-subtitle-sm">WHO classification across registered children</span>
              </div>
              <span className="badge rounded-pill bg-light text-dark border">Real-Time</span>
            </div>

            <div style={{ height: '260px' }}>
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>

            <div className="row g-2 mt-2 pt-2 border-top text-center" style={{ borderColor: '#E5ECE7' }}>
              <div className="col-4">
                <span className="text-danger fw-bold d-block fs-6">{samCount}</span>
                <small className="text-muted" style={{ fontSize: '0.72rem' }}>SAM Critical</small>
              </div>
              <div className="col-4">
                <span className="text-warning fw-bold d-block fs-6">{mamCount}</span>
                <small className="text-muted" style={{ fontSize: '0.72rem' }}>MAM Moderate</small>
              </div>
              <div className="col-4">
                <span className="text-success fw-bold d-block fs-6">{normalCount}</span>
                <small className="text-muted" style={{ fontSize: '0.72rem' }}>Normal Growth</small>
              </div>
            </div>
          </div>
        </div>

        {/* Village / Sector Health Comparison Bar Chart */}
        <div className="col-lg-7">
          <div className="custom-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h3 className="card-title-lg">Village Coverage & Risk Analysis</h3>
                <span className="card-subtitle-sm">Normal vs At-Risk cases by rural habitation</span>
              </div>
              <span className="badge" style={{ backgroundColor: '#eaf3f0', color: '#245B49' }}>
                Anganwadi Sectors
              </span>
            </div>

            <div style={{ height: '260px' }}>
              <Bar data={barData} options={barOptions} />
            </div>

            <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top small text-muted">
              <span>Village Health, Sanitation & Nutrition Days (VHSND) Coverage</span>
              <Link to="/monitoring" className="text-decoration-none fw-bold" style={{ color: '#245B49', fontSize: '0.8rem' }}>
                View Growth Trajectories &rarr;
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Recent Screenings & Registrations Table */}
      <div className="custom-card mb-4">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
          <div>
            <h3 className="card-title-lg">Recent Child Measurements & Health Status</h3>
            <span className="card-subtitle-sm">Latest clinical assessments recorded in this sector</span>
          </div>
          <Link to="/history" className="btn btn-sm btn-outline-custom">
            View All Child Records ({childrenList.length}) &rarr;
          </Link>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Child Name & ID</th>
                <th>Age & Gender</th>
                <th>Mother's Name</th>
                <th>Village</th>
                <th>Weight & Height</th>
                <th>MUAC Tape</th>
                <th>Nutrition Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {childrenList.slice(0, 6).map((child) => (
                <tr key={child.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                        style={{ width: '32px', height: '32px', backgroundColor: child.avatarColor || '#245B49', fontSize: '0.75rem' }}
                      >
                        {child.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="fw-bold text-truncate" style={{ fontSize: '0.88rem', color: '#24352E' }}>
                          {child.name}
                        </div>
                        <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                          {child.poshanId}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="fw-semibold">{child.ageMonths} mo</span>
                    <small className="text-muted d-block text-capitalize" style={{ fontSize: '0.72rem' }}>
                      {child.gender}
                    </small>
                  </td>
                  <td>
                    <div className="small fw-semibold">{child.motherName}</div>
                    <small className="text-muted" style={{ fontSize: '0.72rem' }}>{child.phone}</small>
                  </td>
                  <td>
                    <div className="small d-flex align-items-center gap-1">
                      <MapPin size={12} className="text-muted" />
                      <span>{child.village}</span>
                    </div>
                  </td>
                  <td>
                    <span className="fw-bold">{child.weight} kg</span>
                    <small className="text-muted d-block" style={{ fontSize: '0.72rem' }}>
                      {child.height} cm
                    </small>
                  </td>
                  <td>
                    <span className="badge rounded-pill px-2 py-1" style={{
                      backgroundColor: child.muac < 11.5 ? '#FDEDED' : child.muac < 12.5 ? '#FEF5EC' : '#EDF7ED',
                      color: child.muac < 11.5 ? '#D9383A' : child.muac < 12.5 ? '#E67E22' : '#2E7D32',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}>
                      {child.muac} cm
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={child.currentStatus} />
                  </td>
                  <td className="text-end">
                    <div className="btn-group btn-group-sm">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-custom"
                        onClick={() => handleChildClick(child.id, '/measurement')}
                        title="Add New Measurement"
                      >
                        <Scale size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-custom"
                        onClick={() => handleChildClick(child.id, '/guidance')}
                        title="AI Diet Plan"
                      >
                        Diet
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary-custom"
                        onClick={() => handleChildClick(child.id, '/history')}
                        title="View Full History"
                      >
                        Profile
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
