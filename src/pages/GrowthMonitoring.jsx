import React, { useState } from 'react';
import { useChildData } from '../context/ChildDataContext';
import { WHO_STANDARDS } from '../data/whoStandards';
import StatusBadge from '../components/common/StatusBadge';
import {
  LineChart,
  Scale,
  Ruler,
  TrendingUp,
  Download,
  Info,
  ChevronRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function GrowthMonitoring() {
  const { childrenList, activeChildId, setActiveChildId } = useChildData();
  const selectedChild = childrenList.find(c => c.id === activeChildId) || childrenList[0];

  const [activeCurveType, setActiveCurveType] = useState('WAZ'); // 'WAZ' (Weight-for-Age), 'HAZ' (Height-for-Age)

  const genderDataset = selectedChild?.gender === 'female' ? WHO_STANDARDS.girls : WHO_STANDARDS.boys;
  const history = selectedChild?.growthHistory || [];

  // Month labels for X-axis: 0, 3, 6, 9, 12, 18, 24, 30, 36, 42, 48, 60
  const xLabels = genderDataset.map(d => `${d.month}m`);

  // Prepare WHO reference bands for Weight-for-Age
  const wazMedian = genderDataset.map(d => d.wMedian);
  const wazMinus2SD = genderDataset.map(d => +(d.wMedian - 2 * d.wSD).toFixed(2));
  const wazMinus3SD = genderDataset.map(d => +(d.wMedian - 3 * d.wSD).toFixed(2));

  // Prepare WHO reference bands for Height-for-Age
  const hazMedian = genderDataset.map(d => d.hMedian);
  const hazMinus2SD = genderDataset.map(d => +(d.hMedian - 2 * d.hSD).toFixed(2));
  const hazMinus3SD = genderDataset.map(d => +(d.hMedian - 3 * d.hSD).toFixed(2));

  // Map Child's Actual History Points onto standard intervals
  const childPoints = genderDataset.map(d => {
    // Find closest measurement within 2 months
    const match = history.find(h => Math.abs(h.ageMonths - d.month) <= 1.5);
    if (!match) return null;
    return activeCurveType === 'WAZ' ? match.weight : match.height;
  });

  const chartData = {
    labels: xLabels,
    datasets: [
      {
        label: `${selectedChild?.name || 'Child'} Trajectory`,
        data: childPoints,
        borderColor: '#245B49',
        backgroundColor: '#245B49',
        borderWidth: 3.5,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#245B49',
        pointBorderWidth: 3,
        spanGaps: true,
        order: 1
      },
      {
        label: 'WHO Median (Normal 50th Percentile)',
        data: activeCurveType === 'WAZ' ? wazMedian : hazMedian,
        borderColor: '#2E7D32',
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        fill: false,
        order: 2
      },
      {
        label: activeCurveType === 'WAZ' ? 'WHO -2 SD (Moderate Underweight)' : 'WHO -2 SD (Stunting Line)',
        data: activeCurveType === 'WAZ' ? wazMinus2SD : hazMinus2SD,
        borderColor: '#E67E22',
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        order: 3
      },
      {
        label: activeCurveType === 'WAZ' ? 'WHO -3 SD (Severe Malnutrition / SAM)' : 'WHO -3 SD (Severe Stunting)',
        data: activeCurveType === 'WAZ' ? wazMinus3SD : hazMinus3SD,
        borderColor: '#D9383A',
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        order: 4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 14,
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const unit = activeCurveType === 'WAZ' ? 'kg' : 'cm';
            return `${context.dataset.label}: ${context.parsed.y} ${unit}`;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'Child Age (Months)', font: { weight: 'bold' } },
        grid: { color: '#E5ECE7' }
      },
      y: {
        title: {
          display: true,
          text: activeCurveType === 'WAZ' ? 'Weight (kg)' : 'Height / Length (cm)',
          font: { weight: 'bold' }
        },
        grid: { color: '#E5ECE7' }
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container-fluid p-0">
      
      {/* Top Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h2 className="card-title-lg fs-4 mb-1">WHO Growth Monitoring Trajectory</h2>
          <p className="card-subtitle-sm mb-0">
            Plotting child anthropometric velocity against WHO Reference Standard Percentiles
          </p>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <select
            className="form-select-custom"
            style={{ width: '220px', fontWeight: 600 }}
            value={selectedChild?.id || ''}
            onChange={(e) => setActiveChildId(e.target.value)}
          >
            {childrenList.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.currentStatus})
              </option>
            ))}
          </select>

          <button
            type="button"
            className="btn btn-outline-custom text-nowrap"
            onClick={handlePrint}
          >
            <Download size={15} /> Print Growth Chart
          </button>
        </div>
      </div>

      {selectedChild && (
        <div className="row g-4">
          
          {/* Main Chart Column */}
          <div className="col-lg-8">
            <div className="custom-card mb-4">
              
              {/* Curve Switcher Tabs & Info */}
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3 pb-3 border-bottom">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn btn-sm ${activeCurveType === 'WAZ' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                    onClick={() => setActiveCurveType('WAZ')}
                  >
                    <Scale size={14} /> Weight-for-Age (Underweight)
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm ${activeCurveType === 'HAZ' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                    onClick={() => setActiveCurveType('HAZ')}
                  >
                    <Ruler size={14} /> Height-for-Age (Stunting)
                  </button>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted">Gender Standard:</span>
                  <span className="badge rounded-pill text-capitalize" style={{ backgroundColor: '#eaf3f0', color: '#245B49' }}>
                    {selectedChild.gender} (0-60 Months)
                  </span>
                </div>
              </div>

              {/* Chart Canvas */}
              <div style={{ height: '380px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>

              {/* WHO Standard Explanatory Legend */}
              <div className="row g-2 mt-3 pt-3 border-top text-center" style={{ fontSize: '0.78rem' }}>
                <div className="col-4">
                  <span className="d-inline-block rounded-circle me-1" style={{ width: '10px', height: '10px', backgroundColor: '#2E7D32' }}></span>
                  <strong className="text-success">Green Zone:</strong> Normal WHO Standard
                </div>
                <div className="col-4">
                  <span className="d-inline-block rounded-circle me-1" style={{ width: '10px', height: '10px', backgroundColor: '#E67E22' }}></span>
                  <strong className="text-warning">Yellow Zone (-2 SD):</strong> At Risk / MAM
                </div>
                <div className="col-4">
                  <span className="d-inline-block rounded-circle me-1" style={{ width: '10px', height: '10px', backgroundColor: '#D9383A' }}></span>
                  <strong className="text-danger">Red Zone (&lt; -3 SD):</strong> Severe Deficit (SAM)
                </div>
              </div>

            </div>

            {/* Longitudinal Measurement Log Table */}
            <div className="custom-card">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="card-title-lg mb-0 fs-6">Longitudinal Measurement Points</h4>
                <span className="small text-muted">{history.length} Visits Logged</span>
              </div>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Visit Date</th>
                      <th>Age (mo)</th>
                      <th>Weight (kg)</th>
                      <th>Height (cm)</th>
                      <th>MUAC (cm)</th>
                      <th>Status Classification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center gap-1">
                            <Calendar size={13} className="text-muted" />
                            <span>{entry.date}</span>
                          </div>
                        </td>
                        <td className="fw-bold">{entry.ageMonths}m</td>
                        <td>{entry.weight} kg</td>
                        <td>{entry.height} cm</td>
                        <td>
                          <span className={`badge rounded-pill ${entry.muac < 11.5 ? 'bg-danger-subtle text-danger' : entry.muac < 12.5 ? 'bg-warning-subtle text-warning' : 'bg-success-subtle text-success'}`}>
                            {entry.muac} cm
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={entry.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Child Status & Clinical Summary */}
          <div className="col-lg-4">
            <div className="custom-card mb-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold fs-5 flex-shrink-0"
                  style={{ width: '50px', height: '50px', backgroundColor: selectedChild.avatarColor || '#245B49' }}
                >
                  {selectedChild.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="fw-bold mb-0" style={{ color: '#24352E', fontSize: '1.2rem' }}>
                    {selectedChild.name}
                  </h4>
                  <small className="text-muted">
                    {selectedChild.gender === 'male' ? 'Boy' : 'Girl'}, {selectedChild.ageMonths} Months
                  </small>
                </div>
              </div>

              <div className="p-3 rounded-3 mb-3 text-center" style={{ backgroundColor: '#F9FBF9', border: '1px solid #E5ECE7' }}>
                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>
                  Current Nutrition Diagnosis
                </small>
                <div className="my-1">
                  <StatusBadge status={selectedChild.currentStatus} />
                </div>
                <small className="text-muted d-block">
                  Last Measured on {selectedChild.lastMeasured}
                </small>
              </div>

              {/* Z-Scores */}
              <div className="mb-3">
                <div className="fw-bold small text-muted mb-2">Standard Deviation Indices:</div>
                <div className="d-flex justify-content-between p-2 mb-1 rounded bg-light small">
                  <span>Weight-for-Age (WAZ):</span>
                  <strong className={selectedChild.waz < -2 ? 'text-danger' : 'text-success'}>
                    {selectedChild.waz} SD
                  </strong>
                </div>
                <div className="d-flex justify-content-between p-2 mb-1 rounded bg-light small">
                  <span>Height-for-Age (HAZ):</span>
                  <strong className={selectedChild.haz < -2 ? 'text-danger' : 'text-success'}>
                    {selectedChild.haz} SD
                  </strong>
                </div>
                <div className="d-flex justify-content-between p-2 mb-1 rounded bg-light small">
                  <span>Weight-for-Height (WHZ):</span>
                  <strong className={selectedChild.whz < -2 ? 'text-danger' : 'text-success'}>
                    {selectedChild.whz} SD
                  </strong>
                </div>
              </div>

              {/* Clinical History Notes */}
              <div className="ai-insight-box">
                <div className="fw-bold small mb-1" style={{ color: '#245B49' }}>
                  Clinical Case Notes:
                </div>
                <p className="small mb-0 text-muted" style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                  {selectedChild.notes}
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
