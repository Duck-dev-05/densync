
import { BarChart3, TrendingUp, TrendingDown, Activity, Zap, Calendar } from 'lucide-react';

const STATS = [
  { label: 'Overall OEE', value: '82.4%', sub: '+4.2% vs last month', icon: Activity, color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)', trend: '+4.2%' },
  { label: 'AI Resolutions', value: '412', sub: 'Saved 1,240 hours', icon: Zap, color: '#818cf8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.2)', trend: '+12%' },
  { label: 'Mean Time to Repair', value: '1.2h', sub: '-18% vs last month', icon: TrendingDown, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)', trend: '-18%' },
  { label: 'Downtime Cost', value: '$45.2k', sub: 'Prevented: $120k', icon: TrendingUp, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', trend: '-6%' },
];

const UPTIME = [
  { month: 'Jul', up: 85, down: 15 },
  { month: 'Aug', up: 82, down: 18 },
  { month: 'Sep', up: 88, down: 12 },
  { month: 'Oct', up: 92, down: 8 },
  { month: 'Nov', up: 95, down: 5 },
  { month: 'Dec', up: 97, down: 3 },
];

const ERRORS = [
  { label: 'Mechanical', val: 45, color: '#818cf8', issues: 185 },
  { label: 'Electrical', val: 28, color: '#f59e0b', issues: 115 },
  { label: 'Hydraulic',  val: 15, color: '#10b981', issues: 62  },
  { label: 'Robotics',   val: 12, color: '#ef4444', issues: 49  },
];

export function Analytics() {
  return (
    <div className="tab-content animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(245,158,11,0.04))', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(245,158,11,0.15)' }}>
            <BarChart3 size={22} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Historical Reporting</div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Analytics</h1>
          </div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
          <Calendar size={14} /> Last 30 Days
        </button>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.85rem', flexShrink: 0 }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${s.border}`, borderRadius: '14px', padding: '1.1rem 1.25rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg,${s.color},transparent)` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '0.2rem 0.45rem', borderRadius: '6px', background: s.bg, color: s.color }}>{s.trend}</span>
            </div>
            <div style={{ marginTop: '0.85rem', fontSize: '1.65rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.15rem' }}>{s.label}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', flex: 1, minHeight: 0 }}>

        {/* Bar Chart */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Last 6 Months</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Uptime vs Downtime</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[{ c: '#818cf8', l: 'Uptime' }, { c: '#ef4444', l: 'Downtime' }].map(({ c, l }) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: c }} />
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '0.85rem' }}>
            {UPTIME.map(d => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '2px' }}>
                  <div style={{ height: `${d.down * 1.2}px`, background: 'rgba(239,68,68,0.65)', borderRadius: '4px 4px 0 0', minHeight: '4px' }} />
                  <div style={{ height: `${d.up * 1.2}px`, background: 'linear-gradient(to top,#6366f1,#818cf8)', borderRadius: '4px 4px 0 0', boxShadow: '0 -4px 12px rgba(99,102,241,0.3)' }} />
                </div>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Distribution */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Breakdown</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Error Distribution</div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            {ERRORS.map(c => (
              <div key={c.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color, boxShadow: `0 0 6px ${c.color}` }} />
                    <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>{c.label}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{c.issues} issues</span>
                    <span style={{ fontSize: '0.88rem', color: c.color, fontWeight: 800 }}>{c.val}%</span>
                  </div>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.val}%`, background: `linear-gradient(90deg,${c.color}66,${c.color})`, borderRadius: '99px', boxShadow: `0 0 10px ${c.color}66` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
