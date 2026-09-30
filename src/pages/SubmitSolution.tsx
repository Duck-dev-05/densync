import React, { useState } from 'react';
import {
  UploadCloud, CheckCircle2, RefreshCw, FileEdit, Clock, Hash,
  AlignLeft, ListOrdered, Zap, Shield, ChevronRight,
  AlertTriangle, Tag, Globe, Star, BookOpen
} from 'lucide-react';

const fieldStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '12px',
  padding: '0.8rem 1rem',
  color: '#fff',
  fontSize: '0.9rem',
  fontWeight: 500,
  outline: 'none',
  width: '100%',
  transition: 'border 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box' };

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--text-tertiary)',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: '0.4rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem' };

const steps = ['Error ', 'Root Cause', 'Upload ', 'Review'];

export function SubmitSolution() {
  const [submitted, setSubmitted] = useState(false);
  const [currentStep] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [severity, setSeverity] = useState('high');
  const [category, setCategory] = useState('Mechanical');
  const [fileName, setFileName] = useState('');
  
  // API form states
  const [title, setTitle] = useState('#ERR-502');
  const [factoryLocation, setFactoryLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (submitted) {
    return (
      <div className="tab-content animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{
          maxWidth: '520px', width: '100%', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(25,27,40,0.98) 0%, rgba(18,20,30,0.98) 100%)',
          border: '1px solid rgba(16,185,129,0.2)', borderRadius: '24px',
          padding: '3rem 2.5rem', position: 'relative', overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--success-400), var(--brand-400))', position: 'absolute', top: 0, left: 0, right: 0 }} />

          <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', boxShadow: '0 0 40px rgba(16,185,129,0.2)' }}>
            <CheckCircle2 size={48} style={{ color: 'var(--success-400)', filter: 'drop-shadow(0 0 10px rgba(16,185,129,0.6))' }} />
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '0.75rem', letterSpacing: '-0.025em' }}>Successfully Submitted!</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Your root cause has been uploaded to the <strong style={{ color: '#fff' }}>DenSync Global Network</strong>. It is now live for peer review and AI video extraction.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
            {[
              { label: 'Status', value: 'Under Review', color: 'var(--warning-400)' },
              { label: 'AI Queue', value: '#47', color: 'var(--brand-400)' },
              { label: 'Points Earned', value: '+150 XP', color: 'var(--success-400)' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{s.label}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          <button onClick={() => { setSubmitted(false); setFileName(''); }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.9rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
          >
            <RefreshCw size={16} /> Submit Another Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,rgba(100,102,241,0.2),rgba(100,102,241,0.04))', border: '1px solid rgba(100,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(100,102,241,0.15)' }}>
            <FileEdit size={22} style={{ color: 'var(--brand-400)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--brand-400)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Contribute · Expert Knowledge</div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Submit Root Cause</h1>
          </div>
        </div>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: i < currentStep ? 'var(--success-400)' : i === currentStep ? 'var(--brand-400)' : 'rgba(255,255,255,0.08)', border: `2px solid ${i <= currentStep ? 'transparent' : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: '#fff', boxShadow: i === currentStep ? '0 0 10px rgba(100,102,241,0.5)' : 'none', transition: 'all 0.3s' }}>
                  {i < currentStep ? <CheckCircle2 size={13} /> : i + 1}
                </div>
                <div style={{ fontSize: '0.55rem', fontWeight: 600, color: i <= currentStep ? '#fff' : 'var(--text-tertiary)', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{step}</div>
              </div>
              {i < steps.length - 1 && (
                <div style={{ width: '28px', height: '2px', background: i < currentStep ? 'var(--success-400)' : 'rgba(255,255,255,0.08)', margin: '0 0.2rem', marginBottom: '1rem', transition: 'background 0.3s' }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>


      {/* Main: Form + Sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', flex: 1, minHeight: 0 }}>

        {/* Form */}
        <div style={{ overflowY: 'auto', minHeight: 0 }}>
          <form onSubmit={async (e) => { 
            e.preventDefault(); 
            setIsSubmitting(true);
            try {
              const res = await fetch("http://localhost:8000/api/submit-cause", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  title: title,
                  description: description,
                  severity: severity,
                  category: category,
                  factory_location: factoryLocation
                })
              });
              if(res.ok) setSubmitted(true);
            } catch(e) {
              console.error(e);
            } finally {
              setIsSubmitting(false);
            }
          }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Section 1 */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--brand-400)', boxShadow: '0 0 8px var(--brand-400)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Error rmation</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={labelStyle}><Hash size={12} style={{ color: 'var(--brand-400)' }} /> Error Code</div>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                    style={{ ...fieldStyle, color: 'var(--brand-400)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}
                    onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(100,102,241,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(100,102,241,0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <div style={labelStyle}><Clock size={12} style={{ color: 'var(--accent-400)' }} /> Estimated Repair Time</div>
                  <input type="text" placeholder="e.g. 45m or 2h" style={fieldStyle}
                    onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(100,102,241,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(100,102,241,0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={labelStyle}><Tag size={12} style={{ color: 'var(--success-400)' }} /> Category</div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {['Mechanical', 'Electrical', 'Hydraulic', 'Robotics'].map(c => (
                      <button key={c} type="button" onClick={() => setCategory(c)} style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: category === c ? '1px solid rgba(100,102,241,0.5)' : '1px solid rgba(255,255,255,0.07)', background: category === c ? 'rgba(100,102,241,0.15)' : 'rgba(255,255,255,0.03)', color: category === c ? 'var(--brand-400)' : 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={labelStyle}><AlertTriangle size={12} style={{ color: 'var(--warning-400)' }} /> Severity Level</div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    {[
                      { id: 'low', label: 'Low', color: 'var(--success-400)', border: 'rgba(16,185,129,0.4)', bg: 'rgba(16,185,129,0.12)' },
                      { id: 'high', label: 'High', color: 'var(--warning-400)', border: 'rgba(245,158,11,0.4)', bg: 'rgba(245,158,11,0.12)' },
                      { id: 'critical', label: 'Critical', color: 'var(--danger-400)', border: 'rgba(239,68,68,0.4)', bg: 'rgba(239,68,68,0.12)' },
                    ].map(s => (
                      <button key={s.id} type="button" onClick={() => setSeverity(s.id)} style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: severity === s.id ? `1px solid ${s.border}` : '1px solid rgba(255,255,255,0.07)', background: severity === s.id ? s.bg : 'rgba(255,255,255,0.03)', color: severity === s.id ? s.color : 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', flex: 1 }}>
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={labelStyle}><Zap size={12} style={{ color: 'var(--warning-400)' }} /> Machine / Equipment</div>
                  <input type="text" placeholder="e.g. CNC-Lathe Model 3A" style={fieldStyle}
                    onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(100,102,241,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(100,102,241,0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
                <div>
                  <div style={labelStyle}><Globe size={12} style={{ color: 'var(--accent-400)' }} /> Factory / Location</div>
                  <input type="text" placeholder="e.g. Gunma Plant, Japan" style={fieldStyle}
                    value={factoryLocation} onChange={e => setFactoryLocation(e.target.value)}
                    onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(100,102,241,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(100,102,241,0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-400)', boxShadow: '0 0 8px var(--accent-400)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Analysis &amp; Solution</span>
              </div>

              <div>
                <div style={labelStyle}><AlignLeft size={12} style={{ color: 'var(--accent-400)' }} /> Root Cause Analysis</div>
                <textarea rows={4} placeholder="Describe in detail what caused the issue. Include symptoms, diagnostic steps, and findings..."
                  value={description} onChange={e => setDescription(e.target.value)}
                  style={{ ...fieldStyle, resize: 'vertical', lineHeight: '1.6' }}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(100,102,241,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(100,102,241,0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>

              <div>
                <div style={labelStyle}><ListOrdered size={12} style={{ color: 'var(--success-400)' }} /> Proposed Action Steps</div>
                <textarea rows={4} placeholder={'Step 1: Inspect the spindle bearing temperature...\nStep 2: Apply high-speed grease...\nStep 3: Restart and verify normal operation'}
                  style={{ ...fieldStyle, resize: 'vertical', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', lineHeight: '1.65' }}
                  onFocus={(e) => { e.currentTarget.style.border = '1px solid rgba(100,102,241,0.4)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(100,102,241,0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
              </div>
            </div>

            {/* Section 3: Upload */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--warning-400)', boxShadow: '0 0 8px var(--warning-400)' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Expert Upload</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, marginLeft: 'auto' }}>Optional but recommended</span>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setFileName(f.name); }}
                onClick={() => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'video/*'; inp.onchange = (ev: any) => { if (ev.target.files[0]) setFileName(ev.target.files[0].name); }; inp.click(); }}
                style={{
                  border: `2px dashed ${dragOver ? 'var(--brand-400)' : fileName ? 'var(--success-400)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '14px', padding: '2.5rem',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.2s',
                  background: dragOver ? 'rgba(100,102,241,0.05)' : fileName ? 'rgba(16,185,129,0.04)' : 'rgba(255,255,255,0.01)',
                  boxShadow: dragOver ? '0 0 24px rgba(100,102,241,0.15)' : 'none',
                  gap: '0.75rem' }}
              >
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: fileName ? 'rgba(16,185,129,0.15)' : dragOver ? 'rgba(100,102,241,0.15)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${fileName ? 'rgba(16,185,129,0.3)' : dragOver ? 'rgba(100,102,241,0.3)' : 'rgba(255,255,255,0.1)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: dragOver ? '0 0 20px rgba(100,102,241,0.2)' : fileName ? '0 0 20px rgba(16,185,129,0.2)' : 'none',
                  transition: 'all 0.2s' }}>
                  {fileName
                    ? <CheckCircle2 size={26} style={{ color: 'var(--success-400)' }} />
                    : <UploadCloud size={26} style={{ color: dragOver ? 'var(--brand-400)' : 'var(--text-tertiary)' }} />
                  }
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: fileName ? 'var(--success-400)' : '#fff', marginBottom: '0.25rem' }}>
                    {fileName ? fileName : 'Click to browse or drag video here'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)' }}>
                    {fileName ? 'File ready for upload · Click to replace' : 'Supported formats: MP4, WebM · Max 500 MB'}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isSubmitting} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              padding: '1rem 2rem', borderRadius: '14px', border: 'none',
              background: 'linear-gradient(135deg, var(--brand-400), #9061ea)',
              color: '#fff', fontSize: '0.95rem', fontWeight: 800, cursor: isSubmitting ? 'not-allowed' : 'pointer',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              boxShadow: '0 8px 24px rgba(100,102,241,0.4)', transition: 'all 0.2s', flexShrink: 0,
              opacity: isSubmitting ? 0.7 : 1
            }}
            onMouseOver={(e) => { if(!isSubmitting) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(100,102,241,0.5)'; } }}
            onMouseOut={(e) => { if(!isSubmitting) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(100,102,241,0.4)'; } }}
            >
              <Zap size={18} /> {isSubmitting ? 'Submitting...' : 'Publish to Community & Run AI Extraction'}
            </button>
          </form>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', minHeight: 0 }}>

          <div style={{ background: 'rgba(100,102,241,0.05)', border: '1px solid rgba(100,102,241,0.15)', borderRadius: '14px', padding: '1.1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
              <BookOpen size={16} style={{ color: 'var(--brand-400)' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Submission Tips</span>
            </div>
            {[
              'Be specific about the error symptoms you observed',
              'Include exact timestamps from your video if possible',
              'List all tools and materials used in the repair',
              'Attach a video for 3x higher AI confidence score',
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: i < 3 ? '0.65rem' : 0 }}>
                <ChevronRight size={13} style={{ color: 'var(--brand-400)', marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{tip}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(255,215,0,0.04)', border: '1px solid rgba(255,215,0,0.15)', borderRadius: '14px', padding: '1.1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
              <Star size={16} style={{ color: '#FFD700' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Expert Rewards</span>
            </div>
            {[
              { action: 'Submit Root Cause', xp: '+100 XP' },
              { action: 'Attach Expert ', xp: '+50 XP' },
              { action: 'Community Upvote', xp: '+25 XP' },
              { action: 'AI Verified Solution', xp: '+200 XP' },
            ].map((r, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.4rem 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{r.action}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#FFD700' }}>{r.xp}</span>
              </div>
            ))}
          </div>

          <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.18)', borderRadius: '14px', padding: '1.1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Shield size={18} style={{ color: 'var(--warning-400)', flexShrink: 0, marginTop: '1px' }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--warning-400)', marginBottom: '0.35rem' }}>Safety First</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>Ensure all PPE requirements are met before performing any repair procedure documented here.</div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.1rem 1.25rem' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.6rem' }}>Current Issue Context</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--danger-400)', boxShadow: '0 0 8px var(--danger-400)' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: 'var(--danger-400)' }}>#ERR-502</span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600, marginBottom: '0.3rem' }}>CNC Spindle Overheating</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Gunma Factory · Unresolved · 3 experts analyzing</div>
          </div>
        </div>
      </div>
    </div>
  );
}
