import { useState  } from "react";
import { 
  Settings as SettingsIcon, User, Bell, Shield, Key, Sliders, 
  Smartphone, Globe, Save, AlertTriangle, Fingerprint, 
  Monitor, Lock, CheckCircle, Copy, Plus, Moon, RefreshCw,
  Database, Trash2, EyeOff
} from 'lucide-react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (id: string) => {
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const Toggle = ({ defaultChecked = false, color = 'var(--brand-400)' }) => {
    const [checked, setChecked] = useState(defaultChecked);
    return (
      <div 
        onClick={() => setChecked(!checked)}
        style={{
          width: '38px', height: '22px', borderRadius: '20px', 
          background: checked ? color : 'rgba(255,255,255,0.1)',
          display: 'flex', alignItems: 'center', padding: '0 3px', cursor: 'pointer',
          transition: 'background 0.3s', flexShrink: 0
        }}
      >
        <div style={{
          width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
          transform: checked ? 'translateX(16px)' : 'translateX(0)', transition: 'transform 0.3s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }} />
      </div>
    );
  };

  const InputField = ({ label, type = 'text', defaultValue, disabled = false }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>{label}</label>
      <input type={type} defaultValue={defaultValue} disabled={disabled} style={{ 
        background: disabled ? 'rgba(255,255,255,0.01)' : 'rgba(255,255,255,0.03)', 
        border: disabled ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(255,255,255,0.08)', 
        borderRadius: '10px', padding: '0.85rem 1rem', 
        color: disabled ? 'var(--text-tertiary)' : '#fff', 
        outline: 'none', fontSize: '0.9rem',
        transition: 'border 0.2s' }} 
      onFocus={(e) => { if (!disabled) e.currentTarget.style.border = '1px solid var(--brand-400)' }}
      onBlur={(e) => { if (!disabled) e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)' }}
      />
    </div>
  );

  return (
    <div className="tab-content animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,rgba(100,102,241,0.2),rgba(100,102,241,0.04))', border: '1px solid rgba(100,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(100,102,241,0.15)' }}>
            <SettingsIcon size={22} style={{ color: 'var(--brand-400)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--brand-400)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>System Core</div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Settings & Preferences</h1>
          </div>
        </div>
      </div>

      {/* Horizontal Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0, overflowX: 'auto' }} className="scroll-thin">
        {[
          { id: 'profile', icon: User, label: 'User Profile' },
          { id: 'notifications', icon: Bell, label: 'Notifications' },
          { id: 'security', icon: Shield, label: 'Security & Access' },
          { id: 'api', icon: Key, label: 'API Keys' },
          { id: 'preferences', icon: Sliders, label: 'App Preferences' },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1.25rem',
            borderRadius: '12px', border: activeTab === t.id ? '1px solid rgba(100,102,241,0.4)' : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'all 0.2s',
            background: activeTab === t.id ? 'linear-gradient(135deg, rgba(100,102,241,0.2), rgba(100,102,241,0.05))' : 'rgba(255,255,255,0.02)',
            color: activeTab === t.id ? '#fff' : 'var(--text-secondary)',
            fontWeight: activeTab === t.id ? 700 : 600, fontSize: '0.85rem', flexShrink: 0
          }}
          onMouseOver={(e) => { if (activeTab !== t.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
          onMouseOut={(e) => { if (activeTab !== t.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
          >
            <t.icon size={16} style={{ color: activeTab === t.id ? 'var(--brand-400)' : 'var(--text-tertiary)' }} /> {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Content Area */}
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '2.5rem', overflowY: 'auto' }} className="scroll-thin">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ width: '96px', height: '96px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--brand-400), #9061ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: '#fff', boxShadow: '0 8px 32px rgba(100,102,241,0.4)', position: 'relative' }}>
                  AD
                  <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', background: 'var(--success-400)', borderRadius: '50%', border: '4px solid #0a0a0f' }} />
                </div>
                <div>
                  <h2 style={{ margin: '0 0 0.35rem 0', color: '#fff', fontSize: '1.4rem' }}>Admin User</h2>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Monitor size={14} /> Lead Systems Engineer
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                    <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>Change Avatar</button>
                    <button style={{ background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger-400)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>Remove</button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <InputField label="Full Name" defaultValue="Admin User" />
                <InputField label="Email Address" type="email" defaultValue="admin@densync.cloud" />
                <InputField label="Role" defaultValue="Administrator" disabled={true} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Primary Factory</label>
                  <select style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.85rem 1rem', color: '#fff', outline: 'none', fontSize: '0.9rem', transition: 'border 0.2s' }}>
                    <option>Hải Phòng, VN</option>
                    <option>Gunma, JP</option>
                    <option>Bangkok, TH</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
                <button style={{ background: 'linear-gradient(135deg, var(--brand-400), #9061ea)', border: 'none', color: '#fff', padding: '0.85rem 1.75rem', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 8px 24px rgba(100,102,241,0.3)' }}>
                  <Save size={16} /> Save Profile Changes
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.4rem' }}>Alerts & Notifications</h2>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Configure how Densync sends you updates for factory events.</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { icon: AlertTriangle, title: 'Critical System Alerts', desc: 'Hardware failures, leaks, and production halts', sms: true, email: true, color: 'var(--danger-400)' },
                  { icon: Shield, title: 'AI Diagnostics Match Found', desc: 'When the AI mentor identifies a root cause to your issue', sms: false, email: true, color: 'var(--brand-400)' },
                  { icon: Globe, title: 'Global Knowledge Digest', desc: 'Weekly summary of top resolved factory issues worldwide', sms: false, email: false, color: 'var(--success-400)' },
                  { icon: Smartphone, title: 'IoT Device Offline', desc: 'When a camera or sensor disconnects from the grid', sms: true, email: true, color: 'var(--warning-400)' },
                ].map((n, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', transition: 'background 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `rgba(255,255,255,0.04)`, border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <n.icon size={20} style={{ color: n.color }} />
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '1rem', marginBottom: '0.2rem' }}>{n.title}</div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>{n.desc}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                        <Toggle defaultChecked={n.sms} /> SMS
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
                        <Toggle defaultChecked={n.email} /> Email
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
             <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
               <div>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.4rem' }}>Security & Access</h2>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Protect your Densync account and manage active sessions.</p>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success-400)', border: '1px solid rgba(16,185,129,0.2)' }}><Fingerprint size={24} /></div>
                      <div>
                        <h4 style={{ margin: '0 0 0.2rem', color: '#fff', fontSize: '1rem' }}>Two-Factor Authentication (2FA)</h4>
                        <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Extra layer of security using an authenticator app.</p>
                      </div>
                    </div>
                    <button style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--success-400)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>Enabled</button>
                  </div>
                  
                  <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.08)' }}><Lock size={24} /></div>
                      <div>
                        <h4 style={{ margin: '0 0 0.2rem', color: '#fff', fontSize: '1rem' }}>Password Settings</h4>
                        <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>Last changed 45 days ago.</p>
                      </div>
                    </div>
                    <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Update Password</button>
                  </div>
               </div>

               <div>
                 <h3 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '1.1rem' }}>Active Sessions</h3>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                      { os: 'Windows 11', browser: 'Chrome', ip: '192.168.1.42', current: true, location: 'Hải Phòng, VN' },
                      { os: 'iOS 17', browser: 'Safari Mobile', ip: '114.12.5.99', current: false, location: 'Tokyo, JP' },
                    ].map((s, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', background: s.current ? 'rgba(100,102,241,0.05)' : 'rgba(255,255,255,0.01)', border: s.current ? '1px solid rgba(100,102,241,0.2)' : '1px solid rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                            <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{s.os} · {s.browser}</span>
                            {s.current && <span style={{ background: 'rgba(100,102,241,0.2)', color: 'var(--brand-400)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Current</span>}
                          </div>
                          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>{s.ip} · {s.location}</div>
                        </div>
                        {!s.current && <button style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><Trash2 size={16} /></button>}
                      </div>
                    ))}
                 </div>
               </div>
             </div>
          )}

          {/* API KEYS TAB */}
          {activeTab === 'api' && (
             <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                 <div>
                  <h2 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.4rem' }}>API Keys</h2>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage API keys for Densync Cloud integrations and automation.</p>
                 </div>
                 <button style={{ background: 'linear-gradient(135deg, var(--brand-400), #9061ea)', border: 'none', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 16px rgba(100,102,241,0.3)' }}>
                   <Plus size={16} /> Generate Key
                 </button>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { id: 'key_live_9a8b7c6d', name: 'Production Pipeline Script', created: 'Oct 12, 2025', lastUsed: '2 mins ago', permissions: 'Full Access' },
                    { id: 'key_test_1x2y3z4w', name: 'Local Dev Testing', created: 'Sep 05, 2026', lastUsed: '3 months ago', permissions: 'Read Only' },
                  ].map(k => (
                    <div key={k.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                          <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '0.2rem' }}>{k.name}</div>
                          <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Created {k.created} · Last used {k.lastUsed}</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, height: 'fit-content' }}>
                          {k.permissions}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{k.id.split('_')[0]}_{k.id.split('_')[1]}_••••••••••••••••</span>
                          <EyeOff size={14} style={{ color: 'var(--text-tertiary)' }} />
                        </div>
                        <button onClick={() => handleCopy(k.id)} style={{ width: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: copiedKey === k.id ? 'var(--success-400)' : 'rgba(255,255,255,0.05)', border: copiedKey === k.id ? '1px solid var(--success-400)' : '1px solid rgba(255,255,255,0.1)', color: copiedKey === k.id ? '#fff' : 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}>
                          {copiedKey === k.id ? <CheckCircle size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                    </div>
                  ))}
               </div>
             </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'preferences' && (
             <div className="anim-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
               <div>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '1.4rem' }}>App Preferences</h2>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Customize your interface and data management settings.</p>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Language</label>
                    <select style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.85rem 1rem', color: '#fff', outline: 'none', fontSize: '0.9rem' }}>
                      <option>English (US)</option>
                      <option>Japanese (日本語)</option>
                      <option>Vietnamese (Tiếng Việt)</option>
                    </select>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Timezone</label>
                    <select style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.85rem 1rem', color: '#fff', outline: 'none', fontSize: '0.9rem' }}>
                      <option>UTC+07:00 (Indochina Time)</option>
                      <option>UTC+09:00 (Japan Standard)</option>
                      <option>UTC+00:00 (Greenwich Mean)</option>
                    </select>
                 </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Moon size={20} style={{ color: 'var(--brand-400)' }} />
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>Dark Mode Enforcement</div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Densync forces Dark Mode by default to reduce eye strain.</div>
                      </div>
                    </div>
                    <Toggle defaultChecked={true} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <RefreshCw size={20} style={{ color: 'var(--success-400)' }} />
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>Auto-Refresh Telemetry</div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Dashboard data will automatically refresh every 5 seconds.</div>
                      </div>
                    </div>
                    <Toggle defaultChecked={true} color="var(--success-400)" />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Database size={20} style={{ color: 'var(--warning-400)' }} />
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>Local Data Caching</div>
                        <div style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>Store heavy AI models in local Tauri cache (Uses ~2GB).</div>
                      </div>
                    </div>
                    <Toggle defaultChecked={true} color="var(--warning-400)" />
                  </div>
               </div>
             </div>
          )}

        </div>
      </div>
    </div>
  );
}
