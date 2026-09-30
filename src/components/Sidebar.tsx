import { useState  } from "react";
import {
  Map, Users, Video, Book, Edit, Settings, Cpu,
  ChevronLeft, ChevronRight, Zap, BarChart3, Router, Bell,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navGroups = [
  {
    label: 'Live Operations',
    items: [
      { id: 'live',   icon: Video, label: 'Live Camera Grid',  badge: 'NEW' },
      { id: 'sim',    icon: Map,   label: 'Factory Monitor',   badge: null },
      { id: 'work-orders', icon: Edit,  label: 'Maintenance Kanban', badge: null },
    ]
  },
  {
    label: 'AI & Intelligence',
    items: [
      { id: 'ai',        icon: Video, label: 'AI Video Mentor',  badge: 'NEW' },
      { id: 'knowledge', icon: Book,  label: 'Global Knowledge', badge: null  },
      { id: 'ai-management', icon: Cpu, label: 'Model Management', badge: null },
      { id: 'solutions', icon: Users, label: 'Expert Ranking',   badge: null  },
    ]
  },
  {
    label: 'Reports & Admin',
    items: [
      { id: 'analytics',     icon: BarChart3, label: 'Analytics',       badge: null },
      { id: 'notifications', icon: Bell,      label: 'Notifications',   badge: '3'  },
      { id: 'devices',       icon: Router,    label: 'Device Manager',  badge: null },
    ]
  },
];


export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <aside
      style={{
        width: collapsed ? '72px' : '240px',
        height: '100vh',
        background: 'rgba(10, 11, 22, 0.92)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 100,
        overflow: 'hidden',
        flexShrink: 0,
      }}
      data-tauri-drag-region
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '240px',
        background: 'radial-gradient(ellipse at 40% -10%, rgba(99,102,241,0.18), transparent 65%)',
        pointerEvents: 'none'
      }} />

      <div
        style={{
          height: '64px',
          padding: collapsed ? '0 1rem' : '0 1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          flexShrink: 0, cursor: 'default',
          position: 'relative', zIndex: 1,
        }}
        data-tauri-drag-region
      >
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 24px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.2)'
        }}>
          <Zap size={17} color="#fff" fill="#fff" />
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontSize: '1.1rem', fontWeight: 800, color: '#fff',
              letterSpacing: '-0.03em', whiteSpace: 'nowrap', lineHeight: 1.1
            }}>DenSync</div>
            <div style={{ fontSize: '0.6rem', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Factory Intelligence
            </div>
          </div>
        )}
      </div>

      <nav style={{
        flex: 1, padding: '0.75rem 0.6rem',
        display: 'flex', flexDirection: 'column', gap: '1.5rem',
        overflowY: 'auto', overflowX: 'hidden',
        position: 'relative', zIndex: 1,
      }}>
        {navGroups.map(({ label, items }) => (
          <div key={label}>
            {!collapsed ? (
              <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 0.6rem', marginBottom: '0.35rem' }}>
                {label}
              </div>
            ) : (
              <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '0.5rem' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              {items.map(({ id, icon: Icon, label: itemLabel, badge }) => {
                const isActive = activeTab === id;
                const isHovered = hoveredId === id;
                return (
                  <div key={id} style={{ position: 'relative' }}>
                    {collapsed && isHovered && (
                      <div style={{ position: 'absolute', left: 'calc(100% + 12px)', top: '50%', transform: 'translateY(-50%)', background: 'rgba(15,16,30,0.98)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.4rem 0.75rem', whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 600, color: '#fff', pointerEvents: 'none', zIndex: 999, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                        {itemLabel}
                      </div>
                    )}
                    <button
                      onClick={() => setActiveTab(id)}
                      onMouseEnter={() => setHoveredId(id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: collapsed ? '0.65rem' : '0.6rem 0.75rem', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: '10px', cursor: 'pointer', transition: 'all 0.18s ease', border: 'none', background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.08) 100%)' : isHovered ? 'rgba(255,255,255,0.04)' : 'transparent', position: 'relative', outline: 'none' }}
                    >
                      {isActive && (
                        <div style={{ position: 'absolute', left: 0, top: '18%', bottom: '18%', width: '3px', borderRadius: '0 3px 3px 0', background: 'linear-gradient(180deg, #6366f1, #8b5cf6)', boxShadow: '0 0 10px rgba(99,102,241,0.7)' }} />
                      )}
                      <Icon size={17} style={{ flexShrink: 0, color: isActive ? '#818cf8' : isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)', filter: isActive ? 'drop-shadow(0 0 8px rgba(129,140,248,0.7))' : 'none', transition: 'all 0.18s' }} />
                      {!collapsed && (
                        <>
                          <span style={{ fontSize: '0.845rem', fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap', flex: 1, textAlign: 'left', transition: 'all 0.18s', color: isActive ? '#fff' : isHovered ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)' }}>
                            {itemLabel}
                          </span>
                          {badge && (
                            <span style={{ fontSize: '0.55rem', fontWeight: 800, padding: badge === 'NEW' ? '0.15rem 0.4rem' : '0.1rem 0.45rem', borderRadius: '20px', background: badge === 'NEW' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(239,68,68,0.15)', color: badge === 'NEW' ? '#fff' : '#ef4444', border: badge === 'NEW' ? 'none' : '1px solid rgba(239,68,68,0.3)', letterSpacing: '0.04em', flexShrink: 0 }}>
                              {badge}
                            </span>
                          )}
                        </>
                      )}
                      {collapsed && badge && badge !== 'NEW' && (
                        <div style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', borderRadius: '50%', background: '#ef4444', boxShadow: '0 0 6px #ef4444' }} />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div style={{ padding: '0.75rem 0.6rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <button
          onClick={() => setActiveTab('settings')}
          onMouseEnter={() => setHoveredId('settings')}
          onMouseLeave={() => setHoveredId(null)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: collapsed ? '0.65rem' : '0.6rem 0.75rem', justifyContent: collapsed ? 'center' : 'flex-start', borderRadius: '10px', background: activeTab === 'settings' ? 'rgba(99,102,241,0.12)' : hoveredId === 'settings' ? 'rgba(255,255,255,0.04)' : 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.18s', outline: 'none' }}
        >
          <Settings size={17} style={{ flexShrink: 0, color: activeTab === 'settings' ? '#818cf8' : hoveredId === 'settings' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)', transition: 'all 0.18s' }} />
          {!collapsed && (
            <span style={{ fontSize: '0.845rem', fontWeight: activeTab === 'settings' ? 700 : 500, color: activeTab === 'settings' ? '#fff' : hoveredId === 'settings' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)', transition: 'all 0.18s' }}>
              Settings
            </span>
          )}
        </button>

        <button
          onClick={() => setCollapsed(c => !c)}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: '0.6rem', padding: '0.55rem 0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', color: 'rgba(255,255,255,0.35)', cursor: 'pointer', transition: 'all 0.18s', outline: 'none' }}
          onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
          onMouseOut={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.02)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.35)'; }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          {!collapsed && <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Collapse</span>}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', padding: collapsed ? '0.6rem' : '0.6rem 0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', justifyContent: collapsed ? 'center' : 'flex-start', marginTop: '0.25rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '9px', flexShrink: 0, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, color: '#fff', boxShadow: '0 0 14px rgba(99,102,241,0.4)' }}>
            AD
          </div>
          {!collapsed && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Admin User</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.1rem' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 5px #10b981', flexShrink: 0 }} />
                <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 600 }}>System Online</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
