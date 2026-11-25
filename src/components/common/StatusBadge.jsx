import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'sm' }) {
  const norm = String(status || '').toUpperCase();

  if (norm.includes('SAM') || norm.includes('SEVERE')) {
    return (
      <span className="status-badge badge-sam" title="Severe Acute Malnutrition (WHZ < -3 SD or MUAC < 11.5cm)">
        <AlertCircle size={12} />
        <span>SAM (Severe)</span>
      </span>
    );
  }

  if (norm.includes('MAM') || norm.includes('MODERATE')) {
    return (
      <span className="status-badge badge-mam" title="Moderate Acute Malnutrition (WHZ -2 to -3 SD or MUAC 11.5-12.5cm)">
        <AlertTriangle size={12} />
        <span>MAM (Moderate)</span>
      </span>
    );
  }

  if (norm.includes('STUNTED')) {
    return (
      <span className="status-badge" style={{ backgroundColor: '#F3E8FF', color: '#7E22CE', border: '1px solid #E9D5FF' }} title="Height-for-Age HAZ < -2 SD">
        <AlertTriangle size={12} />
        <span>Stunted</span>
      </span>
    );
  }

  if (norm.includes('UNDERWEIGHT')) {
    return (
      <span className="status-badge badge-mam" title="Weight-for-Age WAZ < -2 SD">
        <AlertTriangle size={12} />
        <span>Underweight</span>
      </span>
    );
  }

  return (
    <span className="status-badge badge-normal" title="Normal WHO Growth Standards">
      <CheckCircle size={12} />
      <span>Normal</span>
    </span>
  );
}
