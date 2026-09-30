import React from 'react';
import { Router, Server, Camera, Cpu, Settings, Wifi, WifiOff, Plus, HardDrive, RefreshCw, Search } from 'lucide-react';

const MOCK_DEVICES = [
  { name: 'Cam-A01 Production Line', id: 'CAM-2041', type: 'Camera',  location: 'Haiphong – Line A', ip: '192.168.1.11', uptime: '14d 3h', status: 'online' },
  { name: 'IMU-Sensor Weld-07',      id: 'IMU-0042', type: 'Sensor',  location: 'Bangkok – Station 3', ip: '192.168.2.42', uptime: '—', status: 'offline' },
  { name: 'Edge Gateway EG-01',      id: 'EGW-001',  type: 'Gateway', location: 'Gunma – Main Hub', ip: '10.0.0.1', uptime: '30d 12h', status: 'online' },
  { name: 'Cam-B03 Assembly Bay',    id: 'CAM-2044', type: 'Camera',  location: 'Haiphong – Line B', ip: '192.168.1.14', uptime: '3d 8h', status: 'online' },
  { name: 'Pressure Sensor P-22',   id: 'PSR-0022', type: 'Sensor',  location: 'Bangkok – Press #7', ip: '192.168.2.22', uptime: '7d 1h', status: 'online' },
];

const iconMap: Record<string, any> = {
  Camera:  { icon: Camera,    color: '#818cf8', bg: 'rgba(129,140,248,0.1)' },
  Sensor:  { icon: Cpu,       color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Gateway: { icon: Server,    color: '#10b981', bg: 'rgba(16,185,129,0.1)' } };

const SUMMARY = [
  { label: 'Total',     value: '1,204', color: '#fff' },
  { label: 'Online',    value: '1,198', color: '#10b981' },
  { label: 'Offline',   value: '6',     color: '#ef4444' },
  { label: 'Calibration', value: '12', color: '#f59e0b' },
];

export function Devices() {
  const [search, setSearch] = React.useState('');
  const devices = MOCK_DEVICES.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.location.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="tab-content animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(16,185,129,0.04))', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}>
            <Router size={22} style={{ color: '#10b981' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Hardware Configuration</div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Device Manager</h1>
          </div>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: '10px', padding: '0.55rem 1.1rem', color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}>
          <Plus size={14} /> Add Device
        </button>
      </div>

      {/* Summary Chips */}
      <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
        {SUMMARY.map((s, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '0.6rem 1rem' }}>
          <Search size={15} style={{ color: 'rgba(255,255,255,0.35)', flexShrink: 0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search devices…" style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.85rem', outline: 'none', width: '100%' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 80px', gap: '1rem', padding: '0.85rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.25)', fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <div>Device</div><div>Location</div><div>IP</div><div>Uptime</div><div>Status</div><div style={{ textAlign: 'right' }}>Actions</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }} className="scroll-thin">
          {devices.map((d, i) => {
            const meta = iconMap[d.type] || { icon: HardDrive, color: '#818cf8', bg: 'rgba(129,140,248,0.1)' };
            const online = d.status === 'online';
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 80px', gap: '1rem', padding: '0.9rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)', alignItems: 'center', transition: 'background 0.18s' }}
                onMouseOver={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)'}
                onMouseOut={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <meta.icon size={17} style={{ color: meta.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{d.name}</div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{d.id} · {d.type}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)' }}>{d.location}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>{d.ip}</div>
                <div style={{ fontSize: '0.82rem', color: online ? 'rgba(255,255,255,0.5)' : 'rgba(239,68,68,0.6)' }}>{d.uptime}</div>
                <div>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.65rem', borderRadius: '99px', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', background: online ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: online ? '#10b981' : '#ef4444', border: `1px solid ${online ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
                    {online ? <Wifi size={10} /> : <WifiOff size={10} />} {d.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem' }}>
                  <button title="Reboot" style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><RefreshCw size={13} /></button>
                  <button title="Configure" style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Settings size={13} /></button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
