import React from 'react';
import { Bell, AlertTriangle, ShieldCheck, Database, CheckCircle2, Search, X } from 'lucide-react';

const MOCK_NOTIFS = [
  { id: 1, type: 'alert', title: 'Critical Overheat – Line B Weld Robot', desc: 'Temperature exceeded 98°C threshold. Auto-shutdown triggered.', time: '2 min ago', unread: true },
  { id: 2, type: 'ai',    title: 'AI Root Cause Matched', desc: 'Qwen2-VL identified hydraulic seal failure on Press #7 with 94% confidence.', time: '14 min ago', unread: true },
  { id: 3, type: 'knowledge', title: 'New Case Study Added', desc: 'Engineers from Gunma uploaded Coolant Valve Replacement SOP.', time: '1h ago', unread: false },
  { id: 4, type: 'alert', title: 'Sensor Offline – Station 3', desc: 'IMU-0042 has not reported in 5 minutes. Check network gateway.', time: '2h ago', unread: false },
  { id: 5, type: 'ai',    title: 'Weekly AI Report Ready', desc: 'AI resolutions saved 312 engineer-hours this week.', time: '3h ago', unread: false },
];

const iconMap: Record<string, any> = {
  alert:     { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.2)' },
  ai:        { icon: ShieldCheck,   color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.2)' },
  knowledge: { icon: Database,      color: '#818cf8', bg: 'rgba(129,140,248,0.12)', border: 'rgba(129,140,248,0.2)' } };

export function Notifications() {
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState<'all'|'unread'|'alert'|'ai'>('all');

  const filtered = MOCK_NOTIFS.filter(n => {
    const matchText = n.title.toLowerCase().includes(search.toLowerCase()) || n.desc.toLowerCase().includes(search.toLowerCase());
    if (filter === 'unread') return matchText && n.unread;
    if (filter === 'alert')  return matchText && n.type === 'alert';
    if (filter === 'ai')     return matchText && n.type === 'ai';
    return matchText;
  });

  return (
    <div className="tab-content animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,rgba(144,97,234,0.2),rgba(144,97,234,0.04))', border: '1px solid rgba(144,97,234,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(144,97,234,0.15)', position: 'relative' }}>
            <Bell size={20} style={{ color: '#9061ea' }} />
            <div style={{ position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 8px #ef4444', border: '2px solid rgba(10,11,22,0.9)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#9061ea', textTransform: 'uppercase', letterSpacing: '0.12em' }}>System Inbox</div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Notifications</h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{filtered.filter(n => n.unread).length} unread</span>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', padding: '0.45rem 0.85rem', color: '#10b981', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
            <CheckCircle2 size={13} /> Mark All Read
          </button>
        </div>
      </div>

      {/* Search + s */}
      <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '0.55rem 1rem' }}>
          <Search size={15} style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Search notifications..." style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', outline: 'none', width: '100%' }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={14} /></button>}
        </div>
        {(['all','unread','alert','ai'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.5rem 0.9rem', borderRadius: '10px', border: `1px solid ${filter === f ? 'rgba(129,140,248,0.4)' : 'rgba(255,255,255,0.07)'}`, background: filter === f ? 'rgba(129,140,248,0.1)' : 'rgba(255,255,255,0.02)', color: filter === f ? '#818cf8' : 'rgba(255,255,255,0.45)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', textTransform: 'capitalize' }}>
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }} className="scroll-thin">
        {filtered.map(n => {
          const meta = iconMap[n.type] || iconMap['knowledge'];
          return (
            <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem 1.25rem', background: n.unread ? 'rgba(129,140,248,0.04)' : 'rgba(255,255,255,0.015)', border: `1px solid ${n.unread ? 'rgba(129,140,248,0.15)' : 'rgba(255,255,255,0.05)'}`, borderRadius: '14px', position: 'relative', transition: 'all 0.18s' }}>
              {n.unread && <div style={{ position: 'absolute', left: '0', top: '20%', bottom: '20%', width: '3px', borderRadius: '0 3px 3px 0', background: '#818cf8', boxShadow: '0 0 8px rgba(129,140,248,0.6)' }} />}
              <div style={{ width: '40px', height: '40px', borderRadius: '11px', background: meta.bg, border: `1px solid ${meta.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <meta.icon size={18} style={{ color: meta.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: n.unread ? 700 : 600, color: n.unread ? '#fff' : 'rgba(255,255,255,0.6)' }}>{n.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>{n.time}</div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{n.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
