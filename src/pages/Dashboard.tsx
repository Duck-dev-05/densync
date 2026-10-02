import { useState, useEffect  } from "react";
import {
  AlertTriangle, Activity, Cpu, Globe, Users, Server, Radio,
  Database, ShieldCheck, Zap, ActivitySquare, BarChart3, MapPin,
  Clock, Thermometer, Gauge, Play, Pause, RotateCcw,
  Network, ArrowRight
} from 'lucide-react';
import { authHeaders } from '../lib/api';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'alerts' | 'analysis' | 'kpis'>('alerts');
  const [selectedFactory, setSelectedFactory] = useState('haiphong');
  const [isMonitoring, setIsMonitoring] = useState(true);

  const [stats, setStats] = useState<any[]>([]);
  const [factories, setFactories] = useState<any[]>([]);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (baseSeconds: number) => {
    const total = baseSeconds + elapsed;
    const h = Math.floor(total / 3600).toString().padStart(2, '0');
    const m = Math.floor((total % 3600) / 60).toString().padStart(2, '0');
    const s = (total % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    let intervalId: any;
    const fetchAnalytics = async () => {
      if (!isMonitoring) return;
      try {
        const res = await fetch("http://localhost:8000/api/analytics/factory", { headers: authHeaders() });
        const data = await res.json();
        if (data.status === "success") {
          setStats([
             { label: 'Active Sensors', value: data.data.active_sensors, icon: Server, color: 'var(--brand-400)', bg: 'rgba(100,102,241,0.08)', border: 'rgba(100,102,241,0.2)' },
             { label: 'AI Latency', value: `${data.data.ai_latency_ms} ms`, icon: Cpu, color: 'var(--accent-400)', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)' },
             { label: 'Critical Alerts', value: data.data.critical_alerts, icon: AlertTriangle, color: 'var(--danger-400)', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
             { label: 'Engineers Online', value: data.data.engineers_online, icon: Users, color: 'var(--success-400)', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
          ]);
          setFactories(data.data.factories);
        }
      } catch (e) {
        console.error(e);
      }
    };
    
    fetchAnalytics();
    if (isMonitoring) {
        intervalId = setInterval(fetchAnalytics, 3000);
    }
    return () => clearInterval(intervalId);
  }, [isMonitoring]);

  const renderMap = () => {
    switch (selectedFactory) {
      case 'gunma':
        return (
          <>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <line x1="20%" y1="50%" x2="50%" y2="50%" stroke="var(--success-400)" strokeWidth="2.5" className="pulse-glow" opacity="0.6" />
              <line x1="50%" y1="50%" x2="80%" y2="50%" stroke="var(--success-400)" strokeWidth="2.5" className="pulse-glow" opacity="0.6" />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '20%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Database size={18} style={{ color: 'var(--success-400)' }} /></div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Input</div>
            </div>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16,185,129,0.2)' }}><Cpu size={24} style={{ color: 'var(--success-400)' }} /></div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff' }}>Assembly (100%)</div>
            </div>
            <div style={{ position: 'absolute', top: '50%', left: '80%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Server size={18} style={{ color: 'var(--success-400)' }} /></div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Output</div>
            </div>
          </>
        );
      case 'bangkok':
        return (
          <>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <line x1="25%" y1="50%" x2="50%" y2="30%" stroke="var(--brand-400)" strokeWidth="2.5" opacity="0.4" />
              <line x1="25%" y1="50%" x2="50%" y2="70%" stroke="var(--warning-400)" strokeWidth="2.5" strokeDasharray="6,6" className="pulse-glow" />
              <line x1="50%" y1="30%" x2="75%" y2="50%" stroke="var(--brand-400)" strokeWidth="2.5" opacity="0.4" />
              <line x1="50%" y1="70%" x2="75%" y2="50%" stroke="var(--warning-400)" strokeWidth="2.5" strokeDasharray="6,6" className="pulse-glow" />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '25%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(100,102,241,0.1)', border: '1px solid rgba(100,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Database size={18} style={{ color: 'var(--brand-400)' }} /></div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Intake</div>
            </div>
            <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(100,102,241,0.1)', border: '1px solid rgba(100,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Cpu size={20} style={{ color: 'var(--brand-400)' }} /></div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Press A</div>
            </div>
            <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(245,158,11,0.15)', border: '2px solid rgba(245,158,11,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(245,158,11,0.3)' }}><Thermometer size={22} style={{ color: 'var(--warning-400)' }} /></div>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fff', textAlign: 'center' }}>Press B<br/><span style={{ color: 'var(--warning-400)', fontSize: '0.7rem' }}>88°C Warn</span></div>
            </div>
            <div style={{ position: 'absolute', top: '50%', left: '75%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Gauge size={18} style={{ color: 'var(--warning-400)' }} /></div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Final (Slowed)</div>
            </div>
          </>
        );
      case 'haiphong':
      default:
        return (
          <>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
              <line x1="15%" y1="50%" x2="30%" y2="50%" stroke="var(--brand-400)" strokeWidth="2.5" className="pulse-glow" opacity="0.6" />
              <line x1="30%" y1="50%" x2="30%" y2="30%" stroke="var(--danger-400)" strokeWidth="2.5" strokeDasharray="6,6" className="pulse-glow" />
              <line x1="30%" y1="30%" x2="45%" y2="30%" stroke="var(--danger-400)" strokeWidth="2.5" strokeDasharray="6,6" className="pulse-glow" />
              <line x1="30%" y1="50%" x2="30%" y2="70%" stroke="var(--success-400)" strokeWidth="2.5" opacity="0.6" />
              <line x1="30%" y1="70%" x2="45%" y2="70%" stroke="var(--success-400)" strokeWidth="2.5" opacity="0.6" />
              <line x1="45%" y1="30%" x2="60%" y2="30%" stroke="var(--danger-400)" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
              <line x1="60%" y1="30%" x2="60%" y2="50%" stroke="var(--danger-400)" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
              <line x1="45%" y1="70%" x2="60%" y2="70%" stroke="var(--success-400)" strokeWidth="2" opacity="0.6" />
              <line x1="60%" y1="70%" x2="60%" y2="50%" stroke="var(--success-400)" strokeWidth="2" opacity="0.6" />
              <line x1="60%" y1="50%" x2="75%" y2="50%" stroke="var(--accent-400)" strokeWidth="2.5" strokeDasharray="6,6" className="pulse-glow" />
            </svg>

            {/* Nodes */}
            <div style={{ position: 'absolute', top: '50%', left: '15%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(100,102,241,0.1)', border: '1px solid rgba(100,102,241,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Database size={18} style={{ color: 'var(--brand-400)' }} /></div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff' }}>Raw Input</div>
            </div>

            <div style={{ position: 'absolute', top: '30%', left: '45%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', background: 'radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(239,68,68,0.15)', border: '2px solid rgba(239,68,68,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(239,68,68,0.3)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -6, right: -6, background: 'var(--danger-400)', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px' }}>ERR</div>
                <AlertTriangle size={24} style={{ color: 'var(--danger-400)' }} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', textAlign: 'center' }}>CNC Alpha<br/><span style={{ color: 'var(--danger-400)', fontSize: '0.7rem' }}>HALTED</span></div>
            </div>

            <div style={{ position: 'absolute', top: '70%', left: '45%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Cpu size={20} style={{ color: 'var(--success-400)' }} /></div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', textAlign: 'center' }}>Assembly<br/><span style={{ color: 'var(--text-tertiary)', fontSize: '0.65rem' }}>Idle</span></div>
            </div>

            <div style={{ position: 'absolute', top: '50%', left: '75%', transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Server size={20} style={{ color: 'var(--accent-400)' }} /></div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', textAlign: 'center' }}>QA Output<br/><span style={{ color: 'var(--accent-400)', fontSize: '0.65rem' }}>Delayed</span></div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="tab-content animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,rgba(239,68,68,0.2),rgba(239,68,68,0.04))', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(239,68,68,0.2)' }}>
            <Globe size={22} style={{ color: 'var(--danger-400)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--danger-400)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--danger-400)', boxShadow: '0 0 6px var(--danger-400)', display: 'inline-block' }} /> Global Operations
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Factory Monitor</h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Network size={14} style={{ color: 'var(--success-400)' }} />
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 700 }}>Network</div>
              <div style={{ color: 'var(--success-400)', fontWeight: 800, fontSize: '0.78rem' }}>12/12 ONLINE</div>
            </div>
          </div>
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', boxShadow: '0 0 14px rgba(239,68,68,0.1)' }}>
            <AlertTriangle size={14} style={{ color: 'var(--danger-400)' }} />
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', fontWeight: 700 }}>Status</div>
              <div style={{ color: 'var(--danger-400)', fontWeight: 800, fontSize: '0.78rem' }}>CRITICAL ALERT</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', flexShrink: 0 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1rem 1.25rem', transition: 'transform 0.2s, background 0.2s', cursor: 'default' }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: s.bg, border: `1px solid ${s.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.15rem' }}>{s.label}</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', flex: 1, minHeight: 0 }}>

        {/* Digital Twin Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', minHeight: 0 }}>

          {/* Map Card */}
          <div style={{ flex: 1, background: 'rgba(10,12,20,0.95)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5)' }}>

            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.3, pointerEvents: 'none' }} />

            {/* Toolbar */}
            <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 2, background: 'linear-gradient(180deg, rgba(10,12,20,0.9) 0%, transparent 100%)' }}>
              <div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <Zap size={16} style={{ color: 'var(--accent-400)' }} /> Digital Twin Model
                </h3>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Radio size={12} className="pulse-glow" style={{ color: 'var(--success-400)' }} /> Spatial anomaly tracking active
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setIsMonitoring(!isMonitoring)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '10px', border: 'none', background: isMonitoring ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', color: isMonitoring ? 'var(--danger-400)' : 'var(--success-400)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}>
                  {isMonitoring ? <Pause size={14} /> : <Play size={14} />} {isMonitoring ? 'Pause Tracking' : 'Resume Tracking'}
                </button>
                <button style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#fff', cursor: 'pointer' }}>
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>

            {/* Factory tabs */}
            <div style={{ position: 'relative', zIndex: 2, padding: '0 1.5rem', display: 'flex', gap: '0.5rem' }}>
              {factories.map(f => {
                const isActive = selectedFactory === f.id;
                const colors = {
                  danger: { color: 'var(--danger-400)', bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)' },
                  success: { color: 'var(--success-400)', bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)' },
                  warning: { color: 'var(--warning-400)', bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)' } };
                const c = colors[f.status as keyof typeof colors];
                return (
                  <button key={f.id} onClick={() => setSelectedFactory(f.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem',
                    borderRadius: '20px', border: isActive ? `1px solid ${c.border}` : '1px solid rgba(255,255,255,0.08)',
                    background: isActive ? c.bg : 'rgba(255,255,255,0.03)',
                    color: isActive ? c.color : 'var(--text-secondary)',
                    fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: isActive ? `0 4px 12px ${c.bg}` : 'none'
                  }}>
                    <MapPin size={12} /> {f.name} <span style={{ opacity: 0.5, fontSize: '0.65rem' }}>{f.loc}</span>
                  </button>
                );
              })}
            </div>

            {/* Map Canvas Layer */}
            <div style={{ flex: 1, position: 'relative', minHeight: '300px' }}>
              {renderMap()}
            </div>

            {/* Bottom Telemetry Bar */}
            <div style={{ background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
              {[
                { icon: Thermometer, label: 'TEMP', value: '85°C', color: 'var(--danger-400)' },
                { icon: Gauge, label: 'PRESSURE', value: '45 PSI', color: 'var(--brand-400)' },
                { icon: Activity, label: 'FLOW', value: '100%', color: 'var(--success-400)' },
                { icon: Clock, label: 'UPTIME', value: '99.8%', color: 'var(--accent-400)' },
              ].map((dp, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
                    <dp.icon size={12} style={{ color: dp.color }} />
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 700 }}>{dp.label}</span>
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: dp.color, fontFamily: 'var(--font-mono)' }}>{dp.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Stream */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem', flexShrink: 0 }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontSize: '0.85rem', fontWeight: 700, margin: '0 0 1rem 0' }}>
              <ActivitySquare size={16} style={{ color: 'var(--brand-400)' }} /> Live Telemetry Stream
            </h3>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '110px', overflowY: 'auto' }} className="scroll-thin">
              <div style={{ display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>[10:45:03]</span> <span style={{ color: 'var(--danger-400)' }}>SYSLOG: Initiating auto-shutdown sequence for CNC Alpha.</span></div>
              <div style={{ display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>[10:45:02]</span> <span style={{ color: 'var(--danger-400)', fontWeight: 700 }}>ERR: Spindle RPM exceeded 15,000 threshold (CRITICAL)</span></div>
              <div style={{ display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>[10:45:00]</span> <span style={{ color: 'var(--warning-400)' }}>WARN: Temp rise detected (85°C) across bearing assembly</span></div>
              <div style={{ display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>[10:44:55]</span> <span style={{ color: 'var(--success-400)' }}>INFO: Coolant flow nominal (45 PSI)</span></div>
              <div style={{ display: 'flex', gap: '0.75rem' }}><span style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>[10:44:30]</span> <span style={{ color: 'var(--text-secondary)' }}>SYS: Routine auto-calibration completed on Axis Z</span></div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', minHeight: 0 }}>

          {/* Custom Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '0.3rem', border: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
            {[
              { id: 'alerts', icon: AlertTriangle, label: 'Alerts' },
              { id: 'analysis', icon: ShieldCheck, label: 'AI Match' },
              { id: 'kpis', icon: BarChart3, label: 'KPIs' },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id as any)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                padding: '0.6rem 0', borderRadius: '8px', border: 'none',
                background: activeTab === t.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: activeTab === t.id ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }} className="scroll-thin">

            {activeTab === 'alerts' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--danger-400)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <AlertTriangle size={14} /> #ERR-502
                    </div>
                    <div style={{ background: 'var(--danger-400)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px' }}>{formatTime(862)}</div>
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>CNC Spindle Halt</h3>
                  <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>Spindle overheating detected. Production halted immediately to prevent hardware damage.</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => window.dispatchEvent(new CustomEvent('densync_navigate', { detail: { tab: 'diagnostics' } }))} style={{ flex: 1, padding: '0.5rem', background: '#c25e40', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '0.9'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>Diagnostics</button>
                    <button style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>Acknowledge</button>
                  </div>
                </div>

                <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--warning-400)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <AlertTriangle size={14} /> #ERR-882
                    </div>
                    <div style={{ background: 'var(--warning-400)', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px' }}>{formatTime(195)}</div>
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>Pressure Drop</h3>
                  <p style={{ margin: '0 0 1rem 0', color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: 1.5 }}>Unprecedented pressure drop in robotic arm hydraulic line. No historical data match.</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => window.dispatchEvent(new CustomEvent('densync_navigate', { detail: { tab: 'diagnostics' } }))} style={{ flex: 1, padding: '0.5rem', background: 'var(--warning-400)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '0.9'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>Investigate</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '14px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--success-400)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    <ShieldCheck size={14} /> Case 1.1: Auto-Match
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#fff', fontWeight: 700 }}>Historical Match Found</h3>
                  <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--success-400)', margin: '0.5rem 0', fontFamily: 'var(--font-mono)' }}>98%</div>
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.2)', marginBottom: '1rem' }}>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.8rem', lineHeight: 1.5 }}>
                      "Sự cố #ERR-502 khớp 98% với lỗi đã xử lý tại Gunma. Đã tự động trích xuất giải pháp từ chuyên gia Tanaka Kenji."
                    </p>
                  </div>
                  <button style={{ width: '100%', padding: '0.6rem', background: 'var(--success-400)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                    Dispatch Video Guide <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'kpis' && (
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem' }}>
                <h3 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 0 1.25rem 0', color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>
                  Global KPIs <span style={{ background: 'var(--danger-400)', color: '#fff', fontSize: '0.6rem', padding: '2px 6px', borderRadius: '4px', animation: 'pulse 2s infinite' }}>LIVE</span>
                </h3>
                
                {[
                  { label: 'Overall Eq. Effectiveness', value: '78%', pct: 78, color: 'var(--brand-400)' },
                  { label: 'Global Uptime', value: '99.8%', pct: 99.8, color: 'var(--success-400)' },
                  { label: 'Maintenance Load', value: '85%', pct: 85, color: 'var(--warning-400)' },
                ].map((kpi, i) => (
                  <div key={i} style={{ marginBottom: i < 2 ? '1rem' : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{kpi.label}</span>
                      <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>{kpi.value}</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${kpi.pct}%`, background: kpi.color, borderRadius: '99px', boxShadow: `0 0 8px ${kpi.color}` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
