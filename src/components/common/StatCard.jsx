import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = '#245B49', bg = '#ffffff', trend, trendType = 'up', badge }) {
  return (
    <div className="custom-card h-100 position-relative overflow-hidden" style={{ backgroundColor: bg }}>
      <div className="d-flex align-items-start justify-content-between mb-2">
        <div className="text-truncate">
          <span className="card-subtitle-sm text-uppercase fw-bold d-block text-truncate" style={{ letterSpacing: '0.04em', fontSize: '0.75rem' }}>
            {title}
          </span>
          <h3 className="fw-bold my-1 text-truncate" style={{ color: '#24352E', fontSize: '1.75rem' }}>
            {value}
          </h3>
        </div>

        {Icon && (
          <div 
            className="p-3 rounded-4 d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ 
              backgroundColor: `${color}15`, 
              color: color,
              border: `1px solid ${color}30` 
            }}
          >
            <Icon size={24} />
          </div>
        )}
      </div>

      <div className="d-flex align-items-center justify-content-between mt-2 pt-2 border-top" style={{ borderColor: '#E5ECE7' }}>
        <small className="text-muted text-truncate" style={{ fontSize: '0.78rem' }}>
          {subtitle}
        </small>
        {trend && (
          <span className={`badge d-inline-flex align-items-center gap-1 ${trendType === 'up' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`} style={{ fontSize: '0.7rem' }}>
            {trendType === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}
