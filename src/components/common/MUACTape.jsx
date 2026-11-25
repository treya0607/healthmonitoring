import React from 'react';

export default function MUACTape({ value = 12.5 }) {
  const numericVal = Number(value) || 12.5;
  // MUAC scale: 9cm to 16cm (7cm span)
  const min = 9.0;
  const max = 16.0;
  const clamped = Math.min(max, Math.max(min, numericVal));
  const percent = ((clamped - min) / (max - min)) * 100;

  let color = '#2E7D32';
  let zoneLabel = 'Normal (> 12.5 cm)';
  let zoneClass = 'text-success';

  if (numericVal < 11.5) {
    color = '#D9383A';
    zoneLabel = 'RED ZONE: Severe Acute Malnutrition (< 11.5 cm)';
    zoneClass = 'text-danger';
  } else if (numericVal < 12.5) {
    color = '#E67E22';
    zoneLabel = 'YELLOW ZONE: Moderate Acute Malnutrition (11.5 - 12.5 cm)';
    zoneClass = 'text-warning';
  }

  return (
    <div className="my-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="small text-muted fw-bold">MUAC Tape Indicator</span>
        <span className={`fw-bold small ${zoneClass}`}>
          {numericVal} cm &bull; {zoneLabel}
        </span>
      </div>

      <div className="position-relative" style={{ height: '14px', borderRadius: '7px', background: 'linear-gradient(to right, #D9383A 0%, #D9383A 35%, #E67E22 35%, #E67E22 50%, #2E7D32 50%, #2E7D32 100%)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' }}>
        {/* Needle Marker */}
        <div
          style={{
            position: 'absolute',
            top: '-5px',
            left: `${percent}%`,
            width: '4px',
            height: '24px',
            backgroundColor: '#1E293B',
            border: '1.5px solid #FFFFFF',
            borderRadius: '2px',
            transform: 'translateX(-50%)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.35)',
            transition: 'left 0.3s ease'
          }}
        />
      </div>

      <div className="d-flex justify-content-between text-muted mt-1" style={{ fontSize: '0.68rem' }}>
        <span className="text-danger fw-bold">&lt; 11.5cm (SAM)</span>
        <span className="text-warning fw-bold">11.5 - 12.5cm (MAM)</span>
        <span className="text-success fw-bold">&gt; 12.5cm (Normal)</span>
      </div>
    </div>
  );
}
