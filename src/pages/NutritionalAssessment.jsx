import React, { useState } from 'react';
import { useChildData } from '../context/ChildDataContext';
import StatusBadge from '../components/common/StatusBadge';
import { MICRONUTRIENT_DEFICIENCIES } from '../data/nutritionPlans';
import {
  Activity,
  HeartPulse,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Apple,
  FileCheck,
  ShieldAlert,
  ChevronRight,
  Info
} from 'lucide-react';

export default function NutritionalAssessment() {
  const { childrenList, activeChildId, setActiveChildId } = useChildData();
  const selectedChild = childrenList.find(c => c.id === activeChildId) || childrenList[0];

  // Assessment Questionnaire State
  const [assessmentForm, setAssessmentForm] = useState({
    breastfeeding: 'exclusive', // exclusive, partial, none
    dailyMealCount: '3',
    eatsGreenLeafy: true,
    eatsEggsOrPulses: true,
    eatsFruits: false,
    eatsDairy: true,
    hasPallor: false,
    hasHairChanges: false,
    hasSkinLesions: false,
    hasDiarrheaEpisodes: false,
    waterSource: 'Safe Handpump / Tap'
  });

  const [aiScoreReport, setAiScoreReport] = useState(null);

  const handleCheckbox = (field) => {
    setAssessmentForm(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleRunAssessment = (e) => {
    e.preventDefault();
    if (!selectedChild) return;

    // Calculate Dietary Diversity Score (out of 4 core rural food groups)
    let diversityScore = 0;
    if (assessmentForm.eatsGreenLeafy) diversityScore++;
    if (assessmentForm.eatsEggsOrPulses) diversityScore++;
    if (assessmentForm.eatsFruits) diversityScore++;
    if (assessmentForm.eatsDairy) diversityScore++;

    let riskLevel = 'LOW';
    let recommendations = [];
    let detectedDeficiencies = [];

    if (selectedChild.currentStatus === 'SAM' || assessmentForm.hasPallor || assessmentForm.hasDiarrheaEpisodes) {
      riskLevel = 'HIGH';
    } else if (selectedChild.currentStatus === 'MAM' || diversityScore < 2) {
      riskLevel = 'MODERATE';
    }

    if (assessmentForm.hasPallor) {
      detectedDeficiencies.push(MICRONUTRIENT_DEFICIENCIES[0]); // Iron Deficiency
      recommendations.push('Administer Iron-Folic Acid (IFA) syrup 1ml bi-weekly & moringa powder.');
    }

    if (!assessmentForm.eatsGreenLeafy && !assessmentForm.eatsFruits) {
      detectedDeficiencies.push(MICRONUTRIENT_DEFICIENCIES[1]); // Vitamin A
      recommendations.push('Schedule 100,000 / 200,000 IU Vitamin A oral megadose at Anganwadi.');
    }

    if (assessmentForm.hasDiarrheaEpisodes) {
      detectedDeficiencies.push(MICRONUTRIENT_DEFICIENCIES[2]); // Zinc
      recommendations.push('Prescribe Oral Rehydration Salts (ORS) + 20mg Zinc dispersible tablets for 14 days.');
    }

    if (diversityScore < 3) {
      recommendations.push('Low Dietary Diversity Score (' + diversityScore + '/4): Introduce locally grown sattu, roasted groundnuts, and seasonal papayas.');
    }

    if (recommendations.length === 0) {
      recommendations.push('Dietary intake meets age-appropriate POSHAN standards. Maintain balanced home meals.');
    }

    setAiScoreReport({
      childName: selectedChild.name,
      diversityScore,
      riskLevel,
      detectedDeficiencies,
      recommendations,
      timestamp: new Date().toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })
    });
  };

  return (
    <div className="container-fluid p-0">
      
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h2 className="card-title-lg fs-4 mb-1">AI Nutritional Assessment & Clinical Screening</h2>
          <p className="card-subtitle-sm mb-0">
            Screen dietary diversity, clinical deficiency markers, and micronutrient gaps
          </p>
        </div>

        {/* Child Selector */}
        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold small text-muted text-nowrap">Screening Child:</label>
          <select
            className="form-select-custom"
            style={{ width: '220px', fontWeight: 600 }}
            value={selectedChild?.id || ''}
            onChange={(e) => {
              setActiveChildId(e.target.value);
              setAiScoreReport(null);
            }}
          >
            {childrenList.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.currentStatus})
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedChild && (
        <div className="row g-4">
          
          {/* Left Column: Form Questionnaire */}
          <div className="col-lg-7">
            
            {/* Child Header Card */}
            <div className="custom-card mb-4" style={{ backgroundColor: '#F9FBF9' }}>
              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: '44px', height: '44px', backgroundColor: selectedChild.avatarColor || '#245B49' }}
                  >
                    {selectedChild.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="fw-bold fs-6" style={{ color: '#24352E' }}>{selectedChild.name}</div>
                    <small className="text-muted">
                      Age: {selectedChild.ageMonths} mo &bull; MUAC: {selectedChild.muac} cm &bull; Status: <StatusBadge status={selectedChild.currentStatus} />
                    </small>
                  </div>
                </div>
                <span className="badge rounded-pill bg-light text-dark border">
                  POSHAN ID: {selectedChild.poshanId}
                </span>
              </div>
            </div>

            <form onSubmit={handleRunAssessment}>
              
              {/* Feeding Patterns */}
              <div className="custom-card mb-4">
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom" style={{ borderColor: '#E5ECE7' }}>
                  <Apple size={20} color="#245B49" />
                  <h4 className="fs-6 fw-bold mb-0" style={{ color: '#245B49' }}>
                    1. Infant & Young Child Feeding (IYCF) Practices
                  </h4>
                </div>

                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label-custom">Breastfeeding Status</label>
                    <select
                      className="form-select-custom"
                      value={assessmentForm.breastfeeding}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, breastfeeding: e.target.value })}
                    >
                      <option value="exclusive">Exclusive Breastfeeding (0-6 months)</option>
                      <option value="complementary">Complementary Feeding + Breastmilk (6-24 months)</option>
                      <option value="weaned">Weaned from Breastmilk</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label-custom">Daily Solid / Semi-Solid Meals</label>
                    <select
                      className="form-select-custom"
                      value={assessmentForm.dailyMealCount}
                      onChange={(e) => setAssessmentForm({ ...assessmentForm, dailyMealCount: e.target.value })}
                    >
                      <option value="1">1 Meal / day (Inadequate)</option>
                      <option value="2">2 Meals / day</option>
                      <option value="3">3 Meals / day (Standard)</option>
                      <option value="4+">4 or more Meals + Snacks</option>
                    </select>
                  </div>

                  {/* Dietary Diversity 24-hr Recall Checklist */}
                  <div className="col-12 mt-2">
                    <label className="form-label-custom mb-2">
                      24-Hour Food Groups Consumed (Minimum Dietary Diversity Screening):
                    </label>

                    <div className="row g-2">
                      <div className="col-sm-6">
                        <div className="p-2 border rounded-3 d-flex align-items-center gap-2 bg-white">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="food1"
                            checked={assessmentForm.eatsGreenLeafy}
                            onChange={() => handleCheckbox('eatsGreenLeafy')}
                          />
                          <label className="form-check-label small" htmlFor="food1">
                            🥬 Dark Leafy Greens (Moringa, Palak, Methi)
                          </label>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="p-2 border rounded-3 d-flex align-items-center gap-2 bg-white">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="food2"
                            checked={assessmentForm.eatsEggsOrPulses}
                            onChange={() => handleCheckbox('eatsEggsOrPulses')}
                          />
                          <label className="form-check-label small" htmlFor="food2">
                            🥚 Eggs / Pulses / Roasted Sattu / Lentils
                          </label>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="p-2 border rounded-3 d-flex align-items-center gap-2 bg-white">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="food3"
                            checked={assessmentForm.eatsFruits}
                            onChange={() => handleCheckbox('eatsFruits')}
                          />
                          <label className="form-check-label small" htmlFor="food3">
                            🥭 Seasonal Vitamin A Fruits (Papaya, Mango)
                          </label>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="p-2 border rounded-3 d-flex align-items-center gap-2 bg-white">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="food4"
                            checked={assessmentForm.eatsDairy}
                            onChange={() => handleCheckbox('eatsDairy')}
                          />
                          <label className="form-check-label small" htmlFor="food4">
                            🥛 Milk / Homemade Curd / Desi Ghee
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clinical Signs Checklist */}
              <div className="custom-card mb-4">
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom" style={{ borderColor: '#E5ECE7' }}>
                  <HeartPulse size={20} color="#245B49" />
                  <h4 className="fs-6 fw-bold mb-0" style={{ color: '#245B49' }}>
                    2. Physical Deficiency Signs & Infection Checklist
                  </h4>
                </div>

                <div className="row g-2">
                  <div className="col-sm-6">
                    <div className="p-2 border rounded-3 d-flex align-items-center gap-2" style={{ backgroundColor: assessmentForm.hasPallor ? '#FFF5F5' : '#ffffff' }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="sign1"
                        checked={assessmentForm.hasPallor}
                        onChange={() => handleCheckbox('hasPallor')}
                      />
                      <label className="form-check-label small fw-semibold" htmlFor="sign1">
                        Palmar / Conjunctival Pallor (Anemia)
                      </label>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="p-2 border rounded-3 d-flex align-items-center gap-2" style={{ backgroundColor: assessmentForm.hasHairChanges ? '#FFF5F5' : '#ffffff' }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="sign2"
                        checked={assessmentForm.hasHairChanges}
                        onChange={() => handleCheckbox('hasHairChanges')}
                      />
                      <label className="form-check-label small fw-semibold" htmlFor="sign2">
                        Thin, depigmented hair (Kwashiorkor)
                      </label>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="p-2 border rounded-3 d-flex align-items-center gap-2" style={{ backgroundColor: assessmentForm.hasSkinLesions ? '#FFF5F5' : '#ffffff' }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="sign3"
                        checked={assessmentForm.hasSkinLesions}
                        onChange={() => handleCheckbox('hasSkinLesions')}
                      />
                      <label className="form-check-label small fw-semibold" htmlFor="sign3">
                        Skin peeling / flaky paint dermatosis
                      </label>
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <div className="p-2 border rounded-3 d-flex align-items-center gap-2" style={{ backgroundColor: assessmentForm.hasDiarrheaEpisodes ? '#FFF5F5' : '#ffffff' }}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="sign4"
                        checked={assessmentForm.hasDiarrheaEpisodes}
                        onChange={() => handleCheckbox('hasDiarrheaEpisodes')}
                      />
                      <label className="form-check-label small fw-semibold" htmlFor="sign4">
                        Recent diarrhea or vomiting (&lt; 14 days)
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assessment Submit */}
              <button
                type="submit"
                className="btn-primary-custom w-100 py-2 fs-6 mb-4"
              >
                <Sparkles size={18} /> Run AI Nutritional Risk Diagnosis
              </button>
            </form>

          </div>

          {/* Right Column: AI Nutritional Diagnosis Card */}
          <div className="col-lg-5">
            <div className="custom-card position-sticky" style={{ top: '88px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="d-flex align-items-center gap-2">
                  <Sparkles size={20} color="#245B49" />
                  <h4 className="card-title-lg mb-0 fs-6">AI Clinical Nutrition Report</h4>
                </div>
                {aiScoreReport && (
                  <span className="badge bg-light text-muted border">
                    {aiScoreReport.timestamp}
                  </span>
                )}
              </div>

              {aiScoreReport ? (
                <div>
                  {/* Risk Badge */}
                  <div
                    className="p-3 rounded-4 mb-3 text-center"
                    style={{
                      backgroundColor: aiScoreReport.riskLevel === 'HIGH' ? '#FDEDED' : aiScoreReport.riskLevel === 'MODERATE' ? '#FEF5EC' : '#EDF7ED',
                      border: `1.5px solid ${aiScoreReport.riskLevel === 'HIGH' ? '#F8C9CA' : aiScoreReport.riskLevel === 'MODERATE' ? '#F9DAB3' : '#C7E6C9'}`
                    }}
                  >
                    <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>
                      Nutritional Vulnerability Risk
                    </small>
                    <h3 className="fw-bold my-1" style={{
                      color: aiScoreReport.riskLevel === 'HIGH' ? '#D9383A' : aiScoreReport.riskLevel === 'MODERATE' ? '#E67E22' : '#2E7D32',
                      fontSize: '1.4rem'
                    }}>
                      {aiScoreReport.riskLevel} RISK
                    </h3>
                    <small className="text-secondary fw-semibold">
                      Dietary Diversity Score: {aiScoreReport.diversityScore} / 4 Essential Food Groups
                    </small>
                  </div>

                  {/* Flagged Deficiencies */}
                  {aiScoreReport.detectedDeficiencies.length > 0 && (
                    <div className="mb-3">
                      <div className="fw-bold small text-muted mb-2">Detected Micronutrient Deficiencies:</div>
                      {aiScoreReport.detectedDeficiencies.map((def, idx) => (
                        <div key={idx} className="p-2 mb-2 rounded-3 border" style={{ backgroundColor: '#FFF9F9', borderColor: '#FADBD8' }}>
                          <div className="fw-bold text-danger small">&bull; {def.nutrient}</div>
                          <p className="mb-0 text-muted" style={{ fontSize: '0.74rem' }}>
                            {def.symptoms}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* AI Prescriptive Protocol */}
                  <div className="ai-insight-box">
                    <div className="fw-bold small mb-2 d-flex align-items-center gap-1" style={{ color: '#245B49' }}>
                      <FileCheck size={16} /> Targeted Frontline Nutrition Prescription:
                    </div>
                    <ul className="ps-3 mb-0 small" style={{ fontSize: '0.8rem' }}>
                      {aiScoreReport.recommendations.map((rec, i) => (
                        <li key={i} className="mb-2">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-5 text-muted">
                  <Activity size={40} className="mb-2 text-secondary opacity-50" />
                  <p className="small mb-0">
                    Complete the 24-hr feeding recall and physical signs checklist on the left, then click <strong>"Run AI Nutritional Risk Diagnosis"</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
