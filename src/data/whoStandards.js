// WHO Child Growth Standards (0-60 Months) Reference Data & Clinical Calculators

export const WHO_STANDARDS = {
  // Boys 0-60 months: [AgeMonths, MedianWeightKg, SD_WeightKg, MedianHeightCm, SD_HeightCm]
  boys: [
    { month: 0,  wMedian: 3.3,  wSD: 0.45, hMedian: 49.9, hSD: 1.9 },
    { month: 3,  wMedian: 6.4,  wSD: 0.70, hMedian: 61.4, hSD: 2.1 },
    { month: 6,  wMedian: 7.9,  wSD: 0.80, hMedian: 67.6, hSD: 2.2 },
    { month: 9,  wMedian: 8.9,  wSD: 0.85, hMedian: 72.0, hSD: 2.3 },
    { month: 12, wMedian: 9.6,  wSD: 0.90, hMedian: 75.7, hSD: 2.4 },
    { month: 18, wMedian: 10.9, wSD: 1.00, hMedian: 82.3, hSD: 2.6 },
    { month: 24, wMedian: 12.2, wSD: 1.15, hMedian: 87.8, hSD: 2.8 },
    { month: 30, wMedian: 13.3, wSD: 1.25, hMedian: 92.4, hSD: 3.0 },
    { month: 36, wMedian: 14.3, wSD: 1.35, hMedian: 96.1, hSD: 3.2 },
    { month: 42, wMedian: 15.3, wSD: 1.45, hMedian: 99.9, hSD: 3.4 },
    { month: 48, wMedian: 16.3, wSD: 1.55, hMedian: 103.3, hSD: 3.6 },
    { month: 60, wMedian: 18.3, wSD: 1.80, hMedian: 110.0, hSD: 4.0 },
  ],
  // Girls 0-60 months: [AgeMonths, MedianWeightKg, SD_WeightKg, MedianHeightCm, SD_HeightCm]
  girls: [
    { month: 0,  wMedian: 3.2,  wSD: 0.42, hMedian: 49.1, hSD: 1.9 },
    { month: 3,  wMedian: 5.8,  wSD: 0.65, hMedian: 59.8, hSD: 2.0 },
    { month: 6,  wMedian: 7.3,  wSD: 0.75, hMedian: 65.7, hSD: 2.1 },
    { month: 9,  wMedian: 8.2,  wSD: 0.80, hMedian: 70.1, hSD: 2.2 },
    { month: 12, wMedian: 8.9,  wSD: 0.85, hMedian: 74.0, hSD: 2.3 },
    { month: 18, wMedian: 10.2, wSD: 0.95, hMedian: 80.7, hSD: 2.5 },
    { month: 24, wMedian: 11.5, wSD: 1.10, hMedian: 86.4, hSD: 2.7 },
    { month: 30, wMedian: 12.7, wSD: 1.20, hMedian: 91.2, hSD: 2.9 },
    { month: 36, wMedian: 13.9, wSD: 1.30, hMedian: 95.1, hSD: 3.1 },
    { month: 42, wMedian: 14.9, wSD: 1.40, hMedian: 99.0, hSD: 3.3 },
    { month: 48, wMedian: 16.1, wSD: 1.50, hMedian: 102.7, hSD: 3.5 },
    { month: 60, wMedian: 18.2, wSD: 1.75, hMedian: 109.4, hSD: 3.9 },
  ]
};

// Helper: Linear Interpolation for arbitrary age in months
function getInterpolatedStandard(ageMonths, gender = 'male') {
  const dataset = (gender.toLowerCase() === 'female' || gender.toLowerCase() === 'girl') 
    ? WHO_STANDARDS.girls 
    : WHO_STANDARDS.boys;

  const age = Math.max(0, Math.min(60, Number(ageMonths) || 0));

  if (age <= dataset[0].month) return dataset[0];
  if (age >= dataset[dataset.length - 1].month) return dataset[dataset.length - 1];

  for (let i = 0; i < dataset.length - 1; i++) {
    const cur = dataset[i];
    const next = dataset[i + 1];
    if (age >= cur.month && age <= next.month) {
      const ratio = (age - cur.month) / (next.month - cur.month);
      return {
        month: age,
        wMedian: cur.wMedian + ratio * (next.wMedian - cur.wMedian),
        wSD: cur.wSD + ratio * (next.wSD - cur.wSD),
        hMedian: cur.hMedian + ratio * (next.hMedian - cur.hMedian),
        hSD: cur.hSD + ratio * (next.hSD - cur.hSD),
      };
    }
  }
  return dataset[0];
}

// Z-Score = (Observed - Median) / SD
export function calculateWAZ(ageMonths, weightKg, gender = 'male') {
  const std = getInterpolatedStandard(ageMonths, gender);
  if (!weightKg || weightKg <= 0) return 0;
  const z = (weightKg - std.wMedian) / std.wSD;
  return Number(z.toFixed(2));
}

export function calculateHAZ(ageMonths, heightCm, gender = 'male') {
  const std = getInterpolatedStandard(ageMonths, gender);
  if (!heightCm || heightCm <= 0) return 0;
  const z = (heightCm - std.hMedian) / std.hSD;
  return Number(z.toFixed(2));
}

export function calculateWHZ(heightCm, weightKg, gender = 'male') {
  if (!heightCm || !weightKg) return 0;
  // Approximation for Weight-for-Length/Height
  const expectedWeight = 0.00014 * Math.pow(heightCm, 2.5);
  const sd = 0.12 * expectedWeight;
  const z = (weightKg - expectedWeight) / sd;
  return Number(z.toFixed(2));
}

// MUAC (Mid-Upper Arm Circumference) WHO Categorization:
// < 11.5 cm = SAM (Severe Acute Malnutrition) - Red
// 11.5 - 12.5 cm = MAM (Moderate Acute Malnutrition) - Yellow
// >= 12.5 cm = Normal / Green
export function getMUACClassification(muacCm) {
  const val = Number(muacCm);
  if (!val || val <= 0) return { label: 'Not Recorded', status: 'normal', color: '#718078' };
  if (val < 11.5) {
    return { label: 'SAM (Severe Acute Malnutrition)', status: 'sam', color: '#D9383A', code: 'RED' };
  } else if (val < 12.5) {
    return { label: 'MAM (Moderate Acute Malnutrition)', status: 'mam', color: '#E67E22', code: 'YELLOW' };
  } else {
    return { label: 'Normal Nutrition', status: 'normal', color: '#2E7D32', code: 'GREEN' };
  }
}

// Overall Automated Clinical Classification
export function assessChildNutritionStatus(ageMonths, weightKg, heightCm, muacCm, gender = 'male', hasEdema = false) {
  const waz = calculateWAZ(ageMonths, weightKg, gender);
  const haz = calculateHAZ(ageMonths, heightCm, gender);
  const whz = calculateWHZ(heightCm, weightKg, gender);
  const muac = getMUACClassification(muacCm);

  let overallStatus = 'Normal';
  let severity = 'success';
  let reasons = [];
  let recommendations = [];

  // Check for Bilateral Pitting Edema (Clinical sign of Kwashiorkor -> SAM immediately)
  if (hasEdema) {
    overallStatus = 'SAM (Severe Acute Malnutrition)';
    severity = 'danger';
    reasons.push('Presence of bilateral pitting edema (Kwashiorkor indicator)');
    recommendations.push('Immediate referral to Nutrition Rehabilitation Centre (NRC) or Medical Officer.');
  } else if (whz < -3 || (muacCm && muacCm < 11.5)) {
    overallStatus = 'SAM (Severe Acute Malnutrition)';
    severity = 'danger';
    if (whz < -3) reasons.push(`Severe Wasting (WHZ: ${whz} SD < -3 SD)`);
    if (muacCm && muacCm < 11.5) reasons.push(`Critical MUAC (${muacCm} cm < 11.5 cm - Red Zone)`);
    recommendations.push('High-priority urgent referral to NRC / Primary Health Centre.');
    recommendations.push('Prescribe Therapeutic Ready-to-Use Supplementary Food (RUSF/RUTF).');
    recommendations.push('Check for medical complications (fever, hypothermia, anorexia).');
  } else if (whz < -2 || (muacCm && muacCm >= 11.5 && muacCm < 12.5)) {
    overallStatus = 'MAM (Moderate Acute Malnutrition)';
    severity = 'warning';
    if (whz < -2) reasons.push(`Moderate Wasting (WHZ: ${whz} SD between -2 and -3 SD)`);
    if (muacCm >= 11.5 && muacCm < 12.5) reasons.push(`At-risk MUAC (${muacCm} cm in Yellow Zone)`);
    recommendations.push('Enroll in Anganwadi Supplementary Nutrition Programme (SNP).');
    recommendations.push('Fortified take-home rations (THR) with high-density energy laddu / ragi mix.');
    recommendations.push('Bi-weekly follow-up measurement at Anganwadi.');
  } else if (waz < -2) {
    overallStatus = 'Underweight';
    severity = 'warning';
    reasons.push(`Weight-for-Age is low (WAZ: ${waz} SD)`);
    recommendations.push('Counsel mother on frequent nutrient-dense feeding & clean drinking water.');
  } else if (haz < -2) {
    overallStatus = 'Stunted';
    severity = 'warning';
    reasons.push(`Height-for-Age deficit (HAZ: ${haz} SD indicates chronic undernutrition)`);
    recommendations.push('Promote dietary diversity: eggs, milk, dark green leafy vegetables (moringa), pulses.');
  } else {
    overallStatus = 'Normal & Healthy';
    severity = 'success';
    reasons.push('Growth metrics align with WHO standards.');
    recommendations.push('Continue age-appropriate balanced diet, hygiene, and scheduled immunizations.');
  }

  return {
    waz,
    haz,
    whz,
    muacClassification: muac,
    overallStatus,
    severity,
    reasons,
    recommendations,
    assessedAt: new Date().toISOString()
  };
}
