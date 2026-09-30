import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon?: LucideIcon;
  subtitle: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({ icon: Icon, subtitle, title, description, actions, badge }: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        <div className="page-eyebrow">
          {Icon && <Icon size={14} className="pulse-glow" style={{ color: 'var(--accent-400)' }} />}
          <span style={{ background: 'linear-gradient(90deg, var(--accent-400), var(--brand-500))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {subtitle}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 className="page-title">{title}</h1>
          {badge}
        </div>
        {description && <p className="page-subtitle">{description}</p>}
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  );
}