import React, { useState } from 'react';
import { RURAL_NUTRITION_PLANS } from '../data/nutritionPlans';
import {
  UtensilsCrossed,
  Heart,
  Sparkles,
  Flame,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck,
  Leaf
} from 'lucide-react';

export default function NutritionGuidance() {
  const [selectedPlanTab, setSelectedPlanTab] = useState('SAM'); // SAM, MAM, NORMAL
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('12-23m');

  const planData = 
    selectedPlanTab === 'SAM' 
      ? RURAL_NUTRITION_PLANS.SAM_RECOVERY 
      : selectedPlanTab === 'MAM' 
      ? RURAL_NUTRITION_PLANS.MAM_INTERVENTION 
      : RURAL_NUTRITION_PLANS.NORMAL_PREVENTATIVE;

  // Age-specific meal schedules
  const MEAL_SCHEDULES = {
    '6-8m': [
      { time: '07:30 AM', meal: 'Early Morning', menu: 'Mother’s Breastmilk on demand' },
      { time: '09:30 AM', meal: 'Breakfast', menu: 'Smooth mashed Ragi porridge with jaggery + 1/2 tsp ghee' },
      { time: '12:30 PM', meal: 'Lunch', menu: 'Soft cooked yellow moong dal khichdi mashed smoothly' },
      { time: '04:00 PM', meal: 'Snack', menu: 'Mashed ripe banana or boiled sweet potato' },
      { time: '07:30 PM', meal: 'Dinner', menu: 'Soft rice-dal mash + Breastfeeding before sleep' }
    ],
    '9-11m': [
      { time: '07:30 AM', meal: 'Breakfast', menu: 'Breastmilk + Sprouted ragi malt with milk/jaggery' },
      { time: '10:00 AM', meal: 'Mid-Morning', menu: 'Soft seasonal papaya slices or mashed chikoo' },
      { time: '01:00 PM', meal: 'Lunch', menu: 'Tricolor khichdi with shredded moringa leaves + 1 tsp cow ghee' },
      { time: '04:30 PM', meal: 'Snack', mealDesc: 'Roasted chana sattu paste or Amrutham poshan laddu' },
      { time: '07:30 PM', meal: 'Dinner', menu: 'Finely chopped soft roti soaked in warm dal with mashed vegetables' }
    ],
    '12-23m': [
      { time: '07:30 AM', meal: 'Breakfast', menu: '1 Boiled egg / sprouted pulse cheela + cup of whole milk' },
      { time: '10:30 AM', meal: 'Mid-Morning', menu: 'Local seasonal fruit (Guava/Papaya/Orange) + groundnut chikki' },
      { time: '01:00 PM', meal: 'Lunch', menu: 'Family meal: Roti/Rice + thick dal + leafy green sabzi with ghee' },
      { time: '04:30 PM', meal: 'Snack', menu: 'Poha with peanuts or roasted makhana / Poshan snack' },
      { time: '08:00 PM', meal: 'Dinner', menu: 'Vegetable khichdi or soft roti with curd and seasonal vegetable' }
    ],
    '24-59m': [
      { time: '08:00 AM', meal: 'Breakfast', menu: 'Ragi / Bajra roti with jaggery and butter, or vegetable upma' },
      { time: '11:00 AM', meal: 'Mid-Morning', menu: 'Sprouted moong chaat or fresh buttermilk (chaas)' },
      { time: '01:30 PM', meal: 'Lunch', menu: 'Anganwadi hot cooked meal: Rice, dal, egg/soybean, and green vegetable' },
      { time: '05:00 PM', meal: 'Snack', menu: 'Chana sattu drink or roasted gram with jaggery' },
      { time: '08:00 PM', meal: 'Dinner', menu: '2 Soft rotis, mixed dal with greens, small cup of homemade curd' }
    ]
  };

  const currentSchedule = MEAL_SCHEDULES[selectedAgeGroup] || MEAL_SCHEDULES['12-23m'];

  return (
    <div className="container-fluid p-0">
      
      {/* Header */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-4">
        <div>
          <h2 className="card-title-lg fs-4 mb-1">AI Rural Nutrition Guidance & Indigenous Diet Plans</h2>
          <p className="card-subtitle-sm mb-0">
            Formulated using locally accessible, inexpensive superfoods for Anganwadi & POSHAN Sevikas
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-custom"
          onClick={() => window.print()}
        >
          <Printer size={15} /> Print Nutrition Pamphlet
        </button>
      </div>

      {/* Protocol Selection Tabs */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        <button
          type="button"
          className={`btn flex-grow-1 py-3 px-3 rounded-4 text-start border transition-all ${
            selectedPlanTab === 'SAM' ? 'shadow-sm border-2' : ''
          }`}
          style={{
            backgroundColor: selectedPlanTab === 'SAM' ? '#FFF5F5' : '#ffffff',
            borderColor: selectedPlanTab === 'SAM' ? '#D9383A' : '#E5ECE7'
          }}
          onClick={() => setSelectedPlanTab('SAM')}
        >
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="badge bg-danger rounded-pill">Clinical High Priority</span>
            <Flame size={16} color="#D9383A" />
          </div>
          <h5 className="fw-bold mb-1" style={{ color: '#D9383A', fontSize: '1rem' }}>
            SAM Therapeutic Nutrition
          </h5>
          <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
            WHZ &lt; -3 SD or MUAC &lt; 11.5 cm (NRC Protocol)
          </small>
        </button>

        <button
          type="button"
          className={`btn flex-grow-1 py-3 px-3 rounded-4 text-start border transition-all ${
            selectedPlanTab === 'MAM' ? 'shadow-sm border-2' : ''
          }`}
          style={{
            backgroundColor: selectedPlanTab === 'MAM' ? '#FFFBF5' : '#ffffff',
            borderColor: selectedPlanTab === 'MAM' ? '#E67E22' : '#E5ECE7'
          }}
          onClick={() => setSelectedPlanTab('MAM')}
        >
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="badge rounded-pill" style={{ backgroundColor: '#E67E22' }}>Supplementary THR</span>
            <UtensilsCrossed size={16} color="#E67E22" />
          </div>
          <h5 className="fw-bold mb-1" style={{ color: '#E67E22', fontSize: '1rem' }}>
            MAM Community Recovery
          </h5>
          <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
            WHZ -2 to -3 SD or MUAC 11.5 - 12.5 cm
          </small>
        </button>

        <button
          type="button"
          className={`btn flex-grow-1 py-3 px-3 rounded-4 text-start border transition-all ${
            selectedPlanTab === 'NORMAL' ? 'shadow-sm border-2' : ''
          }`}
          style={{
            backgroundColor: selectedPlanTab === 'NORMAL' ? '#F6FBF7' : '#ffffff',
            borderColor: selectedPlanTab === 'NORMAL' ? '#245B49' : '#E5ECE7'
          }}
          onClick={() => setSelectedPlanTab('NORMAL')}
        >
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="badge rounded-pill" style={{ backgroundColor: '#245B49' }}>Age-Appropriate</span>
            <Leaf size={16} color="#245B49" />
          </div>
          <h5 className="fw-bold mb-1" style={{ color: '#245B49', fontSize: '1rem' }}>
            Normal Healthy Trajectory
          </h5>
          <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
            WHO Standard Growth & Preventive Dietary Diversity
          </small>
        </button>
      </div>

      {/* Plan Clinical Overview Card */}
      <div className="custom-card mb-4" style={{ backgroundColor: '#F9FBF9' }}>
        <div className="row g-3">
          <div className="col-md-3 border-end">
            <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Target Caloric Density</small>
            <h4 className="fw-bold text-success my-1 fs-5">{planData.calorieGoal}</h4>
            <small className="text-muted" style={{ fontSize: '0.72rem' }}>High-density feeds</small>
          </div>

          <div className="col-md-3 border-end">
            <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Target Protein Intake</small>
            <h4 className="fw-bold text-primary my-1 fs-5">{planData.proteinGoal}</h4>
            <small className="text-muted" style={{ fontSize: '0.72rem' }}>High biological value</small>
          </div>

          <div className="col-md-3 border-end">
            <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Recommended Meal Frequency</small>
            <h4 className="fw-bold my-1 fs-5" style={{ color: '#245B49' }}>{planData.feedingFrequency}</h4>
            <small className="text-muted" style={{ fontSize: '0.72rem' }}>Frequent small feeds</small>
          </div>

          <div className="col-md-3">
            <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Action Mandate</small>
            <p className="small mb-0 fw-semibold text-secondary" style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
              {planData.clinicalProtocol}
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        
        {/* Left Column: Indigenous Superfood Recipes */}
        <div className="col-lg-7">
          <div className="custom-card h-100">
            <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
              <Sparkles size={18} color="#245B49" />
              <h4 className="card-title-lg mb-0 fs-6">
                Indigenous High-Energy Nutrient Formulations
              </h4>
            </div>

            <div className="d-flex flex-column gap-3">
              {planData.indigenousRecipes.map((recipe, idx) => (
                <div key={idx} className="p-3 rounded-4 border bg-white" style={{ borderColor: '#E5ECE7' }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="fw-bold fs-6 mb-0" style={{ color: '#245B49' }}>
                      {recipe.name}
                    </h5>
                    <span className="badge rounded-pill" style={{ backgroundColor: '#eaf3f0', color: '#245B49', fontSize: '0.7rem' }}>
                      {recipe.costCategory}
                    </span>
                  </div>

                  <div className="d-flex gap-3 mb-2 small">
                    <span className="badge bg-light text-dark border">
                      ⚡ {recipe.calories}
                    </span>
                    <span className="badge bg-light text-dark border">
                      💪 Protein: {recipe.protein}
                    </span>
                  </div>

                  <div className="small mb-2 text-secondary">
                    <strong className="text-dark">Ingredients:</strong> {recipe.ingredients}
                  </div>

                  <div className="p-2 rounded-3 bg-light small" style={{ fontSize: '0.78rem' }}>
                    <strong style={{ color: '#245B49' }}>Anganwadi Preparation:</strong> {recipe.preparation}
                  </div>
                </div>
              ))}
            </div>

            {/* Dos and Don'ts */}
            <div className="row g-3 mt-3 pt-3 border-top">
              <div className="col-md-6">
                <div className="fw-bold small text-success mb-2 d-flex align-items-center gap-1">
                  <CheckCircle size={15} /> Counseling DOs for Mothers:
                </div>
                <ul className="ps-3 mb-0 small" style={{ fontSize: '0.78rem' }}>
                  {planData.dosAndDonts.dos.map((d, i) => (
                    <li key={i} className="mb-1 text-secondary">{d}</li>
                  ))}
                </ul>
              </div>

              <div className="col-md-6">
                <div className="fw-bold small text-danger mb-2 d-flex align-items-center gap-1">
                  <XCircle size={15} /> Critical DON'Ts:
                </div>
                <ul className="ps-3 mb-0 small" style={{ fontSize: '0.78rem' }}>
                  {planData.dosAndDonts.donts.map((d, i) => (
                    <li key={i} className="mb-1 text-secondary">{d}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Interactive Age-Specific Daily Meal Planner */}
        <div className="col-lg-5">
          <div className="custom-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div>
                <h4 className="card-title-lg mb-0 fs-6">Daily Rural Meal Schedule</h4>
                <small className="card-subtitle-sm">Structured time-of-day feeding routine</small>
              </div>
              <Clock size={18} color="#245B49" />
            </div>

            {/* Age Selector Tabs */}
            <div className="btn-group w-100 mb-3" role="group">
              <button
                type="button"
                className={`btn btn-sm ${selectedAgeGroup === '6-8m' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                onClick={() => setSelectedAgeGroup('6-8m')}
              >
                6-8 mo
              </button>
              <button
                type="button"
                className={`btn btn-sm ${selectedAgeGroup === '9-11m' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                onClick={() => setSelectedAgeGroup('9-11m')}
              >
                9-11 mo
              </button>
              <button
                type="button"
                className={`btn btn-sm ${selectedAgeGroup === '12-23m' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                onClick={() => setSelectedAgeGroup('12-23m')}
              >
                12-23 mo
              </button>
              <button
                type="button"
                className={`btn btn-sm ${selectedAgeGroup === '24-59m' ? 'btn-primary-custom' : 'btn-outline-custom'}`}
                style={{ fontSize: '0.75rem', padding: '0.4rem' }}
                onClick={() => setSelectedAgeGroup('24-59m')}
              >
                24-59 mo
              </button>
            </div>

            {/* Timeline of Meals */}
            <div className="d-flex flex-column gap-2 mb-3">
              {currentSchedule.map((slot, index) => (
                <div key={index} className="p-2 rounded-3 border d-flex gap-2 align-items-center bg-white" style={{ borderColor: '#E5ECE7' }}>
                  <div className="badge rounded-pill text-nowrap px-2 py-1" style={{ backgroundColor: '#eaf3f0', color: '#245B49', fontSize: '0.7rem' }}>
                    {slot.time}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <span className="fw-bold d-block text-truncate" style={{ fontSize: '0.8rem', color: '#24352E' }}>
                      {slot.meal}
                    </span>
                    <small className="text-secondary d-block text-truncate" style={{ fontSize: '0.75rem' }}>
                      {slot.menu}
                    </small>
                  </div>
                </div>
              ))}
            </div>

            {/* Mother's Hygiene & POSHAN Kit Tip Box */}
            <div className="ai-insight-box">
              <div className="fw-bold small mb-1 d-flex align-items-center gap-1" style={{ color: '#245B49' }}>
                <ShieldCheck size={16} /> POSHAN Hygiene Tip:
              </div>
              <p className="small mb-0 text-muted" style={{ fontSize: '0.78rem', lineHeight: 1.5 }}>
                Always counsel rural mothers on washing hands with soap before preparing feeds and feeding the baby. Use clean, covered vessels for storage.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
