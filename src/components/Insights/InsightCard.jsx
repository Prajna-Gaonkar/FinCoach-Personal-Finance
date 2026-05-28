import React from 'react';
import { 
  AlertTriangle, 
  AlertOctagon, 
  CheckCircle2, 
  Info,
  Sparkles 
} from 'lucide-react';

const InsightCard = ({ insight }) => {
  const { title, description, type } = insight;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="insight-icon" size={20} style={{ color: 'var(--success)' }} />;
      case 'warning':
        return <AlertTriangle className="insight-icon" size={20} style={{ color: 'var(--warning)' }} />;
      case 'danger':
        return <AlertOctagon className="insight-icon" size={20} style={{ color: 'var(--danger)' }} />;
      case 'info':
      default:
        return <Sparkles className="insight-icon" size={20} style={{ color: 'var(--secondary)' }} />;
    }
  };

  return (
    <div className={`insight-card ${type || 'info'}`}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {getIcon()}
      </div>
      <div className="insight-content">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default InsightCard;
