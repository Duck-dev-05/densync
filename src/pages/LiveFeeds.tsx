import { useState, useEffect  } from "react";
import { Video, Maximize2, Minimize2, ShieldAlert, Cpu, Zap, Settings, AlertTriangle, Activity, Server, Clock, AlertCircle, Camera, Crosshair, History, ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

const MOCK_CAMERAS = [
  { id: 'cam-1', name: 'Line A - Conveyor Belt', location: 'Zone 1 (Assembly)', status: 'online', ai_fps: 24, alerts: 1, poster: '/test-defects/metal_gear_crack.jpg', duration: 25, resolution: '4K', fps: 60, bitrate: 14.2, temp: 42 },
  { id: 'cam-2', name: 'Line B - Welding Station', location: 'Zone 2 (Fabrication)', status: 'online', ai_fps: 22, alerts: 1, poster: '/test-defects/pcb_burnt_component.jpg', duration: 32, resolution: '1440p', fps: 30, bitrate: 8.5, temp: 55 },
  { id: 'cam-3', name: 'Hydraulic Press #4', location: 'Zone 3 (Heavy Machining)', status: 'online', ai_fps: 25, alerts: 1, poster: '/test-defects/metal_pipe_leak.jpg', duration: 28, resolution: '1080p', fps: 60, bitrate: 11.4, temp: 38 },
  { id: 'cam-4', name: 'Quality Inspection Area', location: 'Zone 4 (QA)', status: 'online', ai_fps: 30, alerts: 0, poster: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80', duration: 22, resolution: '4K', fps: 120, bitrate: 22.0, temp: 45 },
];

export function LiveFeeds() {
  const [aiOverlayEnabled, setAiOverlayEnabled] = useState(false);
  const [fullscreenCam, setFullscreenCam] = useState<string | null>(null);
  const [gridSize, setGridSize] = useState('2x2');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Reusable Target Reticle Component
  const Reticle = ({ top, left, width, height, color, label }: any) => (
    <div style={{ position: 'absolute', top, left, width, height, border: `1px solid rgba(${color === '#f43f5e' ? '244,63,94' : '245,158,11'}, 0.2)`, background: `rgba(${color === '#f43f5e' ? '244,63,94' : '245,158,11'}, 0.05)`, zIndex: 5 }}>
      {/* Corner Brackets */}
      <div style={{ position: 'absolute', top: -1, left: -1, width: '12px', height: '12px', borderTop: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      <div style={{ position: 'absolute', top: -1, right: -1, width: '12px', height: '12px', borderTop: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
      <div style={{ position: 'absolute', bottom: -1, left: -1, width: '12px', height: '12px', borderBottom: `2px solid ${color}`, borderLeft: `2px solid ${color}` }} />
      <div style={{ position: 'absolute', bottom: -1, right: -1, width: '12px', height: '12px', borderBottom: `2px solid ${color}`, borderRight: `2px solid ${color}` }} />
      
      {/* HUD Label */}
      <div style={{ position: 'absolute', top: '-24px', left: '-1px', background: color, color: color === '#f59e0b' ? '#000' : '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 6px', letterSpacing: '0.05em', boxShadow: `0 0 10px ${color}`, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
        <Zap size={10} /> {label}
      </div>
    </div>
  );

  return (
    <div className="tab-content animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      <style>{`
        @keyframes ai-scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes hud-flicker {
          0% { opacity: 0.9; }
          5% { opacity: 0.4; }
          10% { opacity: 0.95; }
          15% { opacity: 0.8; }
          100% { opacity: 1; }
        }
        @keyframes ptz-pan {
          0% { transform: scale(1.05) translate(0, 0); }
          25% { transform: scale(1.1) translate(-2%, 1%); }
          50% { transform: scale(1.08) translate(1%, -2%); }
          75% { transform: scale(1.12) translate(-1%, -1%); }
          100% { transform: scale(1.05) translate(0, 0); }
        }
        @keyframes video-noise {
          0%, 100% { opacity: 0.03; transform: translate(0,0); }
          10% { opacity: 0.05; transform: translate(-1%, -1%); }
          50% { opacity: 0.04; transform: translate(1%, 2%); }
          90% { opacity: 0.06; transform: translate(2%, -1%); }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(244,63,94,0.2), rgba(244,63,94,0.04))', border: '1px solid rgba(244,63,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(244,63,94,0.2)' }}>
            <Video size={22} style={{ color: '#f43f5e' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f43f5e', boxShadow: '0 0 8px #f43f5e', display: 'inline-block', animation: 'pulse 2s infinite' }} /> 
              Real-Time Surveillance
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Live Camera Grid</h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          
          {/* Grid Layout Selector */}
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {['1x1', '2x2', '3x3'].map(size => (
              <button 
                key={size}
                onClick={() => { setGridSize(size); setFullscreenCam(null); }}
                style={{
                  background: gridSize === size ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: gridSize === size ? '#fff' : 'var(--text-tertiary)',
                  border: 'none', borderRadius: '8px', padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: gridSize === size ? '0 2px 8px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                {size}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Cpu size={14} style={{ color: 'var(--text-secondary)' }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>AI Vision Pipeline:</span>
            <button 
              onClick={() => setAiOverlayEnabled(!aiOverlayEnabled)}
              style={{ 
                background: aiOverlayEnabled ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)', 
                border: `1px solid ${aiOverlayEnabled ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`, 
                color: aiOverlayEnabled ? '#10b981' : 'var(--text-secondary)',
                padding: '0.3rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem',
                boxShadow: aiOverlayEnabled ? '0 0 16px rgba(16,185,129,0.2)' : 'none'
              }}
            >
              {aiOverlayEnabled ? <><ShieldAlert size={12} /> ARMED</> : 'OFF'}
            </button>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
            <Settings size={14} /> Configure
          </button>
        </div>
      </div>

      {/* ── Dashboard Layout ── */}
      <div style={{ display: 'flex', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        
        {/* ── Grid Area ── */}
        <div style={{ 
          flex: 1, 
          display: 'grid', 
          gridTemplateColumns: fullscreenCam || gridSize === '1x1' ? '1fr' : gridSize === '3x3' ? 'repeat(3, 1fr)' : '1fr 1fr', 
          gridTemplateRows: fullscreenCam || gridSize === '1x1' ? 'auto' : gridSize === '3x3' ? 'auto' : '1fr 1fr', 
          gridAutoRows: fullscreenCam || gridSize === '1x1' ? '100%' : gridSize === '3x3' ? '48%' : 'auto',
          gap: '1rem', 
          minHeight: 0,
          overflowY: 'auto',
          paddingRight: '4px'
        }} className="scroll-thin">
          {MOCK_CAMERAS.filter(c => !fullscreenCam || c.id === fullscreenCam).map((cam) => (
            <div key={cam.id} style={{ 
              background: '#0a0a0f', 
              borderRadius: '16px', 
              border: `1px solid ${cam.alerts > 0 && aiOverlayEnabled ? 'rgba(244,63,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
              overflow: 'hidden',
              position: 'relative',
              display: 'flex', flexDirection: 'column',
              boxShadow: cam.alerts > 0 && aiOverlayEnabled ? '0 0 30px rgba(244,63,94,0.15)' : 'none'
            }}>
              
              {/* Camera Feed Container */}
              <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#000' }}>
                <div 
                  style={{ 
                    position: 'absolute', inset: -20, 
                    backgroundImage: `url(${cam.poster})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    opacity: 0.85,
                    animation: `ptz-pan ${cam.duration}s infinite ease-in-out`
                  }} 
                />
                
                {/* Video Noise Overlay */}
                <div style={{
                  position: 'absolute', inset: -50,
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
                  backgroundSize: '4px 4px',
                  animation: 'video-noise 0.2s infinite',
                  pointerEvents: 'none'
                }} />

                {/* Live Ticking Timestamp */}
                <div style={{ position: 'absolute', bottom: fullscreenCam === cam.id ? '9rem' : '1rem', right: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 600, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,1)', zIndex: 20, transition: 'bottom 0.3s' }}>
                  {now.toISOString().replace('T', ' ').substring(0, 19)} UTC
                </div>
                
                {/* Simulated AI Overlays (Only shown if AI is armed) */}
                {aiOverlayEnabled && (
                  <>
                    {/* Global Scanning Laser */}
                    <div style={{
                      position: 'absolute', left: 0, right: 0, height: '2px',
                      background: 'linear-gradient(90deg, transparent, #10b981, transparent)',
                      boxShadow: '0 0 15px #10b981, 0 0 5px #10b981',
                      animation: 'ai-scan 3.5s infinite linear',
                      zIndex: 10, pointerEvents: 'none'
                    }} />

                    {/* HUD Elements */}
                    <div style={{ animation: 'hud-flicker 5s infinite alternate' }}>
                      {cam.id === 'cam-1' && <Reticle top="25%" left="35%" width="30%" height="50%" color="#f43f5e" label="CRITICAL CRACK (98%)" />}
                      {cam.id === 'cam-2' && <Reticle top="40%" left="40%" width="20%" height="20%" color="#f59e0b" label="THERMAL DAMAGE (87%)" />}
                      {cam.id === 'cam-3' && <Reticle top="60%" left="60%" width="30%" height="30%" color="#f43f5e" label="FLUID LEAK (94%)" />}
                    </div>
                  </>
                )}
              </div>

              {/* Camera Info Overlay */}
              <div style={{ 
                position: 'absolute', top: 0, left: 0, right: 0, padding: '1rem',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, transparent 100%)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                zIndex: 20
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>{cam.name}</span>
                    {cam.alerts > 0 && aiOverlayEnabled && <AlertTriangle size={14} style={{ color: '#f43f5e', filter: 'drop-shadow(0 0 4px #f43f5e)' }} />}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                    {cam.id.toUpperCase()} · {cam.location}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {aiOverlayEnabled && (
                    <div style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.65rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', border: '1px solid rgba(16,185,129,0.3)', boxShadow: '0 0 10px rgba(16,185,129,0.2)' }}>
                      <Zap size={10} /> {cam.ai_fps} FPS
                    </div>
                  )}
                  <button 
                    onClick={() => setFullscreenCam(fullscreenCam === cam.id ? null : cam.id)}
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.35rem 0.6rem', borderRadius: '6px', color: '#fff', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                  >
                    {fullscreenCam === cam.id ? <Minimize2 size={14} /> : <Maximize2 size={12} />}
                  </button>
                </div>
              </div>
              
              {/* Live Rec Indicator */}
              <div style={{ position: 'absolute', bottom: fullscreenCam === cam.id ? '9rem' : '1rem', left: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '0.2rem 0.6rem', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.1)', zIndex: 20, transition: 'bottom 0.3s' }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite', boxShadow: '0 0 6px #ef4444' }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>LIVE</span>
              </div>

              {/* Advanced Fullscreen Controls */}
              {fullscreenCam === cam.id && (
                <div className="anim-slide-up" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 80%, transparent 100%)', padding: '3rem 2rem 1.5rem', zIndex: 30, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  
                  {/* PTZ and Tools */}
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.25rem', background: 'rgba(0,0,0,0.4)', padding: '0.5rem', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                        <div />
                        <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer' }}><ChevronUp size={14}/></button>
                        <div />
                        <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer' }}><ChevronLeft size={14}/></button>
                        <button style={{ background: 'rgba(100,102,241,0.2)', border: '1px solid var(--brand-400)', color: 'var(--brand-400)', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer' }}><Crosshair size={14}/></button>
                        <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer' }}><ChevronRight size={14}/></button>
                        <div />
                        <button style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '6px', padding: '0.4rem', cursor: 'pointer' }}><ChevronDown size={14}/></button>
                        <div />
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 700, letterSpacing: '0.05em' }}>PTZ CTRL</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 1.2rem', borderRadius: '10px', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(5px)' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                        <Camera size={16} style={{ color: 'var(--brand-400)' }} /> Snapshot Frame
                      </button>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 1.2rem', borderRadius: '10px', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', backdropFilter: 'blur(5px)' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
                        <History size={16} style={{ color: 'var(--success-400)' }} /> 24h Playback
                      </button>
                    </div>
                  </div>

                  {/* Telemetry Stats */}
                  <div style={{ display: 'flex', gap: '2rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', padding: '1.25rem 2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>Resolution</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{cam.resolution} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{cam.fps}fps</span></div>
                    </div>
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>Bitrate</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success-400)' }}>
                        {(cam.bitrate + (now.getSeconds() % 3 === 0 ? 0.1 : (now.getSeconds() % 2 === 0 ? -0.1 : 0))).toFixed(1)} <span style={{ fontSize: '0.8rem' }}>Mbps</span>
                      </div>
                    </div>
                    <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.2rem' }}>Temperature</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: cam.temp > 50 ? 'var(--danger-400)' : 'var(--warning-400)' }}>
                        {Math.floor(cam.temp + (now.getSeconds() % 4 === 0 ? 1 : 0))}°C
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          ))}
        </div>

        {/* ── Telemetry Sidebar ── */}
        {!fullscreenCam && (
          <div className="scroll-thin" style={{ width: '280px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={16} style={{ color: 'var(--brand-400)' }} /> System Telemetry
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Total Cams</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>24</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>Network</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success-400)' }}>1.2 <span style={{ fontSize: '0.75rem' }}>Gbps</span></div>
                </div>
              </div>
            </div>

            <div style={{ padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Server size={14} style={{ color: 'var(--text-secondary)' }} /> Edge Nodes
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--success-400)', fontWeight: 700 }}>4/4 ONLINE</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[1, 2, 3, 4].map(n => (
                  <div key={n} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--success-400)' }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Node 0{n}</span>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>{Math.floor(Math.random() * 30 + 10)}ms</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: '1.25rem', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={14} style={{ color: aiOverlayEnabled ? 'var(--danger-400)' : 'var(--text-secondary)' }} /> 
                  Active Threats
                </h3>
                <span style={{ fontSize: '0.7rem', color: aiOverlayEnabled ? 'var(--danger-400)' : 'var(--text-tertiary)', fontWeight: 700, background: aiOverlayEnabled ? 'rgba(244,63,94,0.1)' : 'transparent', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  {aiOverlayEnabled ? '3 DETECTED' : 'AI OFFLINE'}
                </span>
              </div>

              {aiOverlayEnabled ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.2)', padding: '0.75rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--danger-400)', marginBottom: '0.25rem' }}>CRITICAL CRACK (98%)</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Line A - Conveyor Belt</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={10} /> Just now</div>
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => window.dispatchEvent(new CustomEvent('densync_navigate', { detail: { tab: 'diagnostics' } }))} style={{ flex: 1, background: '#c25e40', border: 'none', color: '#fff', padding: '0.4rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '0.9'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>Diagnostics</button>
                      <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.4rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>Acknowledge</button>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', padding: '0.75rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--warning-400)', marginBottom: '0.25rem' }}>THERMAL DAMAGE (87%)</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Line B - Welding Station</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={10} /> 2m ago</div>
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => window.dispatchEvent(new CustomEvent('densync_navigate', { detail: { tab: 'diagnostics' } }))} style={{ flex: 1, background: '#c25e40', border: 'none', color: '#fff', padding: '0.4rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '0.9'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>Diagnostics</button>
                      <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.4rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>Acknowledge</button>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(244,63,94,0.05)', border: '1px solid rgba(244,63,94,0.2)', padding: '0.75rem', borderRadius: '10px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--danger-400)', marginBottom: '0.25rem' }}>FLUID LEAK (94%)</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Hydraulic Press #4</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Clock size={10} /> 5m ago</div>
                    <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => window.dispatchEvent(new CustomEvent('densync_navigate', { detail: { tab: 'diagnostics' } }))} style={{ flex: 1, background: '#c25e40', border: 'none', color: '#fff', padding: '0.4rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '0.9'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>Diagnostics</button>
                      <button style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.4rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>Acknowledge</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 0', color: 'var(--text-tertiary)', textAlign: 'center' }}>
                  <ShieldAlert size={24} style={{ opacity: 0.2, marginBottom: '0.5rem' }} />
                  <span style={{ fontSize: '0.75rem' }}>AI Vision Pipeline is disabled.<br/>Threat monitoring offline.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
