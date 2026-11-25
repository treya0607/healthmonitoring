import React, { useState } from 'react';
import { useChildData } from '../context/ChildDataContext';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/common/StatusBadge';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Share2,
  Building,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  AlertOctagon,
  Copy,
  Sparkles
} from 'lucide-react';

export default function Reports() {
  const { childrenList, alerts, activeChildId } = useChildData();
  const { currentUser } = useAuth();

  const [activeReportTab, setActiveReportTab] = useState('MPR'); // MPR (Monthly Progress), HEALTH_CARD, REFERRAL
  const [selectedChildId, setSelectedChildId] = useState(activeChildId || (childrenList[0]?.id));
  const [copiedNotice, setCopiedNotice] = useState(false);

  const selectedChild = childrenList.find(c => c.id === selectedChildId) || childrenList[0];

  // Aggregate Metrics for MPR
  const total = childrenList.length;
  const sam = childrenList.filter(c => c.currentStatus === 'SAM').length;
  const mam = childrenList.filter(c => c.currentStatus === 'MAM').length;
  const stunted = childrenList.filter(c => c.currentStatus === 'Stunted').length;
  const underweight = childrenList.filter(c => c.currentStatus === 'Underweight').length;
  const normal = childrenList.filter(c => c.currentStatus === 'Normal').length;

  const samRate = total > 0 ? ((sam / total) * 100).toFixed(1) : '0';
  const mamRate = total > 0 ? ((mam / total) * 100).toFixed(1) : '0';
  const stuntingRate = total > 0 ? ((stunted / total) * 100).toFixed(1) : '0';

  // Village-level breakdown
  const villageStats = childrenList.reduce((acc, child) => {
    const v = child.village || 'Other';
    if (!acc[v]) acc[v] = { name: v, screened: 0, sam: 0, mam: 0, normal: 0 };
    acc[v].screened++;
    if (child.currentStatus === 'SAM') acc[v].sam++;
    else if (child.currentStatus === 'MAM') acc[v].mam++;
    else acc[v].normal++;
    return acc;
  }, {});

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    let csv = "ID,Name,Gender,AgeMonths,MotherName,Village,Weight,Height,MUAC,Status,LastMeasured\n";
    childrenList.forEach(c => {
      csv += `"${c.id}","${c.name}","${c.gender}","${c.ageMonths}","${c.motherName}","${c.village}","${c.weight}","${c.height}","${c.muac}","${c.currentStatus}","${c.lastMeasured}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ChildCare_AI_Monthly_Report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySummary = () => {
    const text = `ChildCare AI Monthly Progress Report - ${currentUser?.sector || 'Rampur'}
Total Children Screened: ${total}
SAM (Severe Acute Malnutrition): ${sam} (${samRate}%)
MAM (Moderate Acute Malnutrition): ${mam} (${mamRate}%)
Stunting Prevalence: ${stuntingRate}%
Healthy / Normal: ${normal}
Anganwadi Worker: ${currentUser?.name || 'Sunita Devi'}`;
    navigator.clipboard.writeText(text);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2500);
  };

  return (
    <div className="container-fluid p-0">
      
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h2 className="card-title-lg fs-4 mb-1">Health Reports & Anganwadi MPR</h2>
          <p className="card-subtitle-sm mb-0">
            Official POSHAN Abhiyaan Monthly Progress Reports, Printable Child Health Cards & NRC Referrals
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-sm btn-outline-custom"
            onClick={handleDownloadCsv}
          >
            <Download size={14} /> Export CSV Register
          </button>
          <button
            type="button"
            className="btn btn-sm btn-primary-custom"
            onClick={handlePrint}
          >
            <Printer size={14} /> Print Document
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="btn-group mb-4" role="group">
        <button
          type="button"
          className={`btn ${activeReportTab === 'MPR' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
          onClick={() => setActiveReportTab('MPR')}
        >
          <FileSpreadsheet size={15} /> Anganwadi Monthly Progress Report (MPR)
        </button>
        <button
          type="button"
          className={`btn ${activeReportTab === 'HEALTH_CARD' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
          onClick={() => setActiveReportTab('HEALTH_CARD')}
        >
          <HeartHandshake size={15} /> Child Health & Growth MCP Card
        </button>
        <button
          type="button"
          className={`btn ${activeReportTab === 'REFERRAL' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
          onClick={() => setActiveReportTab('REFERRAL')}
        >
          <AlertOctagon size={15} /> NRC Emergency Referral Slip
        </button>
      </div>

      {copiedNotice && (
        <div className="alert alert-success py-2 px-3 small d-flex align-items-center gap-2 rounded-3 mb-3">
          <CheckCircle2 size={16} /> Summary copied to clipboard!
        </div>
      )}

      {/* TAB 1: MONTHLY PROGRESS REPORT */}
      {activeReportTab === 'MPR' && (
        <div className="custom-card p-4">
          
          {/* Official Letterhead Header */}
          <div className="text-center pb-3 mb-4 border-bottom" style={{ borderColor: '#245B49' }}>
            <div className="d-flex justify-content-center align-items-center gap-2 mb-1">
              <Building size={24} color="#245B49" />
              <h3 className="fw-bold fs-5 mb-0" style={{ color: '#245B49' }}>
                MINISTRY OF WOMEN & CHILD DEVELOPMENT &bull; POSHAN ABHIYAAN
              </h3>
            </div>
            <h4 className="fw-bold fs-6 mb-1 text-dark">
              Anganwadi Monthly Progress Report (MPR) - Child Nutrition Monitoring
            </h4>
            <div className="small text-muted">
              Anganwadi Center: <strong>{currentUser?.sector || 'AWC-Rampur Sector 1'}</strong> &bull; Block: <strong>Rampur Rural</strong> &bull; District: <strong>Varanasi</strong> &bull; Date: <strong>{new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</strong>
            </div>
          </div>

          {/* Aggregate KPI Summary Grid */}
          <div className="row g-3 mb-4 text-center">
            <div className="col-sm-4 col-md-2">
              <div className="p-3 rounded-3 bg-light border">
                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.68rem' }}>Total Screened</small>
                <h4 className="fw-bold my-1 text-dark fs-5">{total}</h4>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Under 5 Years</small>
              </div>
            </div>

            <div className="col-sm-4 col-md-2">
              <div className="p-3 rounded-3 border" style={{ backgroundColor: '#FDEDED', borderColor: '#F8C9CA' }}>
                <small className="text-danger d-block text-uppercase fw-bold" style={{ fontSize: '0.68rem' }}>SAM (Severe)</small>
                <h4 className="fw-bold my-1 text-danger fs-5">{sam}</h4>
                <small className="text-danger fw-semibold" style={{ fontSize: '0.7rem' }}>{samRate}% Prevalence</small>
              </div>
            </div>

            <div className="col-sm-4 col-md-2">
              <div className="p-3 rounded-3 border" style={{ backgroundColor: '#FEF5EC', borderColor: '#F9DAB3' }}>
                <small className="text-warning d-block text-uppercase fw-bold" style={{ fontSize: '0.68rem' }}>MAM (Moderate)</small>
                <h4 className="fw-bold my-1 text-warning fs-5">{mam}</h4>
                <small className="text-warning fw-semibold" style={{ fontSize: '0.7rem' }}>{mamRate}% Prevalence</small>
              </div>
            </div>

            <div className="col-sm-4 col-md-2">
              <div className="p-3 rounded-3 bg-light border">
                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.68rem' }}>Stunted (HAZ &lt; -2)</small>
                <h4 className="fw-bold my-1 fs-5" style={{ color: '#8E44AD' }}>{stunted}</h4>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>{stuntingRate}% Prevalence</small>
              </div>
            </div>

            <div className="col-sm-4 col-md-2">
              <div className="p-3 rounded-3 bg-light border">
                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.68rem' }}>Underweight</small>
                <h4 className="fw-bold my-1 text-warning fs-5">{underweight}</h4>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Weight Deficit</small>
              </div>
            </div>

            <div className="col-sm-4 col-md-2">
              <div className="p-3 rounded-3 border" style={{ backgroundColor: '#EDF7ED', borderColor: '#C7E6C9' }}>
                <small className="text-success d-block text-uppercase fw-bold" style={{ fontSize: '0.68rem' }}>Normal Growth</small>
                <h4 className="fw-bold my-1 text-success fs-5">{normal}</h4>
                <small className="text-success fw-semibold" style={{ fontSize: '0.7rem' }}>Optimal Trajectory</small>
              </div>
            </div>
          </div>

          {/* Village Habitation Table */}
          <h5 className="fw-bold fs-6 mb-2" style={{ color: '#245B49' }}>
            Habitation-Wise Malnutrition & Screening Breakdown
          </h5>
          <div className="table-responsive mb-4">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Habitation / Village</th>
                  <th>Children Screened</th>
                  <th>SAM (Critical Red)</th>
                  <th>MAM (Yellow)</th>
                  <th>Normal (Green)</th>
                  <th>Action Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(villageStats).map((st, i) => (
                  <tr key={i}>
                    <td className="fw-bold">{st.name}</td>
                    <td>{st.screened}</td>
                    <td className="text-danger fw-bold">{st.sam}</td>
                    <td className="text-warning fw-bold">{st.mam}</td>
                    <td className="text-success fw-bold">{st.normal}</td>
                    <td>
                      <span className="badge rounded-pill bg-light text-dark border">
                        {st.sam > 0 ? 'NRC Escalation in Progress' : 'Supplementary THR Distributed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Anganwadi Sign-Off Footer */}
          <div className="row g-4 mt-4 pt-3 border-top">
            <div className="col-6">
              <div className="small text-muted">Submitted By:</div>
              <div className="fw-bold text-dark">{currentUser?.name || 'Sunita Devi'}</div>
              <small className="text-muted">Anganwadi Worker / Sevika</small>
            </div>
            <div className="col-6 text-end">
              <div className="small text-muted">Verified & Countersigned:</div>
              <div className="fw-bold text-dark">Medical Officer / CDPO Supervisor</div>
              <small className="text-muted">Primary Health Centre</small>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: PRINTABLE CHILD HEALTH CARD */}
      {activeReportTab === 'HEALTH_CARD' && (
        <div>
          {/* Child Picker */}
          <div className="custom-card mb-4 p-3 d-flex align-items-center gap-3">
            <label className="fw-bold small text-muted text-nowrap">Select Child for Health Card:</label>
            <select
              className="form-select-custom"
              style={{ maxWidth: '300px' }}
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
            >
              {childrenList.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.poshanId}) - {c.village}
                </option>
              ))}
            </select>
          </div>

          {selectedChild && (
            <div className="custom-card p-4 border-2" style={{ borderColor: '#245B49', backgroundColor: '#FFFFFF' }}>
              
              {/* Card Official Header */}
              <div className="d-flex justify-content-between align-items-start pb-3 mb-3 border-bottom" style={{ borderColor: '#245B49' }}>
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2 rounded-3 text-white" style={{ backgroundColor: '#245B49' }}>
                    <HeartHandshake size={32} />
                  </div>
                  <div>
                    <h3 className="fw-bold fs-5 mb-0" style={{ color: '#245B49' }}>
                      Mother & Child Protection (MCP) Health Card
                    </h3>
                    <small className="text-muted">
                      Rural Child Growth & Nutrition Surveillance &bull; POSHAN Abhiyaan
                    </small>
                  </div>
                </div>

                <div className="text-end">
                  <span className="badge rounded-pill px-3 py-1" style={{ backgroundColor: '#DDEBB1', color: '#245B49', fontWeight: 700 }}>
                    Official Health Record
                  </span>
                  <div className="small text-muted mt-1">ID: <code>{selectedChild.poshanId}</code></div>
                </div>
              </div>

              {/* Child Bio Table */}
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <small className="text-muted d-block">Child Full Name</small>
                  <strong className="fs-6 text-dark">{selectedChild.name}</strong>
                </div>
                <div className="col-md-3">
                  <small className="text-muted d-block">Gender & Date of Birth</small>
                  <strong className="text-capitalize">{selectedChild.gender}, {selectedChild.dob}</strong>
                </div>
                <div className="col-md-3">
                  <small className="text-muted d-block">Mother's Name</small>
                  <strong>{selectedChild.motherName}</strong>
                </div>
                <div className="col-md-3">
                  <small className="text-muted d-block">Village & Anganwadi</small>
                  <strong>{selectedChild.village}</strong>
                </div>
              </div>

              {/* Latest Anthropometric Snapshot */}
              <div className="p-3 rounded-4 mb-4" style={{ backgroundColor: '#F9FBF9', border: '1px solid #E5ECE7' }}>
                <div className="fw-bold small text-muted mb-2 text-uppercase">
                  Latest Growth Assessment ({selectedChild.lastMeasured})
                </div>
                <div className="row g-2 text-center">
                  <div className="col-3 border-end">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Weight</small>
                    <span className="fw-bold fs-5 text-success">{selectedChild.weight} kg</span>
                  </div>
                  <div className="col-3 border-end">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Height</small>
                    <span className="fw-bold fs-5">{selectedChild.height} cm</span>
                  </div>
                  <div className="col-3 border-end">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>MUAC Tape</small>
                    <span className="fw-bold fs-5">{selectedChild.muac} cm</span>
                  </div>
                  <div className="col-3">
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Clinical Status</small>
                    <div className="mt-1">
                      <StatusBadge status={selectedChild.currentStatus} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth History Table on Card */}
              <h5 className="fw-bold fs-6 mb-2" style={{ color: '#245B49' }}>
                Anganwadi Growth Record Log
              </h5>
              <div className="table-responsive mb-4">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Age (mo)</th>
                      <th>Weight (kg)</th>
                      <th>Height (cm)</th>
                      <th>MUAC (cm)</th>
                      <th>Classification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedChild.growthHistory?.map((gh, idx) => (
                      <tr key={idx}>
                        <td>{gh.date}</td>
                        <td className="fw-bold">{gh.ageMonths}m</td>
                        <td>{gh.weight} kg</td>
                        <td>{gh.height} cm</td>
                        <td>{gh.muac} cm</td>
                        <td>
                          <StatusBadge status={gh.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Signature Block */}
              <div className="row g-4 pt-4 border-top">
                <div className="col-4 text-center">
                  <div className="border-bottom pb-4 mb-1"></div>
                  <small className="text-muted">Anganwadi Sevika Signature</small>
                </div>
                <div className="col-4 text-center">
                  <div className="border-bottom pb-4 mb-1"></div>
                  <small className="text-muted">Auxiliary Nurse Midwife (ANM)</small>
                </div>
                <div className="col-4 text-center">
                  <div className="border-bottom pb-4 mb-1"></div>
                  <small className="text-muted">Primary Health Centre Stamp</small>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 3: EMERGENCY NRC REFERRAL SLIP */}
      {activeReportTab === 'REFERRAL' && (
        <div className="custom-card p-4 border-2 border-danger">
          <div className="d-flex justify-content-between align-items-center pb-3 mb-3 border-bottom border-danger">
            <div className="d-flex align-items-center gap-3">
              <div className="p-2 bg-danger text-white rounded-3">
                <AlertOctagon size={28} />
              </div>
              <div>
                <h3 className="fw-bold fs-5 mb-0 text-danger">
                  EMERGENCY CLINICAL REFERRAL SLIP
                </h3>
                <small className="text-muted">
                  To: Nutrition Rehabilitation Centre (NRC) / District Paediatric Ward
                </small>
              </div>
            </div>
            <span className="badge bg-danger fs-6 px-3 py-2">
              High Priority SAM Case
            </span>
          </div>

          <div className="p-3 mb-3 rounded-3" style={{ backgroundColor: '#FFF5F5', border: '1px solid #F8C9CA' }}>
            <p className="mb-0 small" style={{ color: '#D9383A', lineHeight: 1.5 }}>
              <strong>Notice to Medical Officer:</strong> This child presents with Severe Acute Malnutrition (SAM) as per WHO and Indian Academy of Paediatrics (IAP) clinical protocol. Immediate medical stabilization, electrolyte correction, and therapeutic feeding (F-75/F-100) are required.
            </p>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label-custom">Child Name</label>
              <input type="text" className="form-control-custom bg-light" value={selectedChild?.name || ''} readOnly />
            </div>
            <div className="col-md-2">
              <label className="form-label-custom">Age</label>
              <input type="text" className="form-control-custom bg-light" value={`${selectedChild?.ageMonths} Months`} readOnly />
            </div>
            <div className="col-md-3">
              <label className="form-label-custom">MUAC Tape Measurement</label>
              <input type="text" className="form-control-custom bg-light text-danger fw-bold" value={`${selectedChild?.muac} cm (Red Zone)`} readOnly />
            </div>
            <div className="col-md-3">
              <label className="form-label-custom">Bilateral Pedal Edema</label>
              <input type="text" className="form-control-custom bg-light text-danger fw-bold" value={selectedChild?.hasEdema ? 'PRESENT (Kwashiorkor)' : 'Absent'} readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label-custom">Mother's Name & Phone</label>
              <input type="text" className="form-control-custom bg-light" value={`${selectedChild?.motherName} (${selectedChild?.phone})`} readOnly />
            </div>
            <div className="col-md-6">
              <label className="form-label-custom">Referring Anganwadi Center</label>
              <input type="text" className="form-control-custom bg-light" value={`${selectedChild?.anganwadiCenter}, Village: ${selectedChild?.village}`} readOnly />
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" className="btn btn-outline-custom" onClick={handlePrint}>
              <Printer size={15} /> Print Referral Slip
            </button>
            <button type="button" className="btn btn-danger" onClick={() => alert('Emergency dispatch notification sent to District 108 Ambulance & NRC Ward.')}>
              Dispatch Emergency Transport
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
