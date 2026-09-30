import { Cpu, Activity, Crosshair, AlertTriangle, PlayCircle, ArrowLeft } from 'lucide-react';

export function Diagnostics() {
  return (
    <div className="tab-content animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'rgba(255,255,255,0.02)', padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
          <button onClick={() => window.dispatchEvent(new CustomEvent('densync_navigate', { detail: { tab: 'sim' } }))} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }} onMouseOut={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--brand-400)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <Activity size={10} /> Threat Diagnostics
            </div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
              Incident #CRIT-992
            </h1>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', height: '36px' }}>
          <button onClick={() => window.dispatchEvent(new CustomEvent('densync_navigate', { detail: { tab: 'sim' } }))} style={{ height: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}>
            Acknowledge & Dismiss
          </button>
          <button onClick={() => window.dispatchEvent(new CustomEvent('densync_navigate', { detail: { tab: 'submit' } }))} style={{ height: '100%', background: 'var(--brand-500)', border: 'none', color: '#fff', padding: '0 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseOver={e => e.currentTarget.style.opacity = '0.9'} onMouseOut={e => e.currentTarget.style.opacity = '1'}>
            Submit Root Cause
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ display: 'flex', gap: '1.25rem', flex: 1, minHeight: 0 }}>
        
        {/* Left Col: Evidence */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ flex: 1, background: '#000', borderRadius: '16px', border: '1px solid rgba(244,63,94,0.3)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/test-defects/metal_gear_crack.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8 }} />
            
            {/* AI Heatmap Overlay */}
            <div style={{ position: 'absolute', top: '25%', left: '35%', width: '30%', height: '50%', background: 'radial-gradient(ellipse at center, rgba(244,63,94,0.4) 0%, transparent 70%)', zIndex: 5, animation: 'pulse 2s infinite' }} />
            
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem' }}>
              <div style={{ background: 'rgba(244,63,94,0.2)', border: '1px solid rgba(244,63,94,0.5)', padding: '0.4rem 0.8rem', borderRadius: '8px', color: 'var(--danger-400)', fontSize: '0.75rem', fontWeight: 700, backdropFilter: 'blur(10px)' }}>
                CONFIDENCE: 98.4%
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', padding: '0.4rem 0.8rem', borderRadius: '8px', color: '#fff', fontSize: '0.75rem', fontWeight: 600, backdropFilter: 'blur(10px)' }}>
                <PlayCircle size={14} /> View Pre-Incident Footage
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Details */}
        <div className="scroll-thin" style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', paddingRight: '4px' }}>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={14} style={{ color: 'var(--brand-400)' }} /> Model Inference Data
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Model</span>
                <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>VisionNet-v4.2-Industrial</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Classification</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--danger-400)', fontWeight: 800 }}>CRITICAL_FRACTURE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Source</span>
                <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>CAM-1 (Line A)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Detected At</span>
                <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>10:15:22 UTC</span>
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertTriangle size={14} style={{ color: 'var(--warning-400)' }} /> Automated Impact Analysis
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The identified fracture in the primary gear mechanism poses an immediate risk of catastrophic mechanical failure. 
              If operated under current load, complete structural disintegration is expected within 4-6 hours of continuous use.
            </p>
            <div style={{ marginTop: '1rem', background: 'rgba(244,63,94,0.05)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(244,63,94,0.2)', fontSize: '0.75rem', color: 'var(--danger-400)', fontWeight: 600, display: 'flex', gap: '0.5rem' }}>
              <Crosshair size={14} /> Recommendation: Immediate Line Stoppage
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
