import { LucideIcon, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  color: string;
  glow: string;
  change?: string;
  isPositive?: boolean;
  isDanger?: boolean;
  status?: string;
}

export function StatCard({ 
  label, 
  value, 
  unit, 
  icon: Icon, 
  color, 
  glow, 
  change, 
  isPositive = true, 
  isDanger = false,
  status 
}: StatCardProps) {
  return (
    <div 
      className={`stat-mini-card glass-card ${isDanger ? 'card-danger' : ''}`}
      style={isDanger ? { 
        borderColor: 'rgba(239,68,68,0.40)', 
        boxShadow: '0 8px 32px rgba(239,68,68,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
      } : {}}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.625rem' }}>
        <div style={{ color, background: glow, padding: '0.45rem', borderRadius: 'var(--radius-md)' }}>
          <Icon size={16} />
        </div>
        {change && (
          <span style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.2rem', 
            color: isDanger ? 'var(--danger-400)' : 'var(--success-400)', 
            fontSize: '0.65rem', 
            fontWeight: 700, 
            padding: '0.12rem 0.375rem', 
            background: isDanger ? 'var(--danger-100)' : 'var(--success-100)', 
            borderRadius: 'var(--radius-full)', 
            border: `1px solid ${isDanger ? 'rgba(239,68,68,0.25)' : 'rgba(16,185,129,0.25)'}` 
          }}>
            {isPositive && <ArrowUpRight size={10} />} {change}
          </span>
        )}
        {status && (
          <span className="badge badge-success">{status}</span>
        )}
      </div>
      <div className="stat-mini-value" style={isDanger ? { color: 'var(--danger-400)', textShadow: '0 0 10px rgba(239,68,68,0.3)' } : {}}>
        {value}
        {unit && <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginLeft: '0.15rem', fontWeight: 400 }}>{unit}</span>}
      </div>
      <div className="stat-mini-label">{label}</div>
    </div>
  );
}