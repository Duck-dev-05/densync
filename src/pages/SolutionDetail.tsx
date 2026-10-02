import { useState } from 'react';
import {
  ArrowLeft, Zap, CheckCircle, AlertTriangle, Wrench, Clock,
  MapPin, Activity, ThumbsUp, User, ShieldAlert, RotateCcw, Flag,
} from 'lucide-react';
import { getSolutionById } from '../data/solutions';
import { apiPost } from '../lib/api';

const SEVERITY_COLORS: Record<string, { bg: string; border: string; text: string; label: string }> = {
  low:      { bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.3)',  text: '#10b981', label: 'Low Severity' },
  medium:   { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  text: '#f59e0b', label: 'Medium Severity' },
  high:     { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   text: '#ef4444', label: 'High Severity' },
  critical: { bg: 'rgba(239,68,68,0.14)',  border: 'rgba(239,68,68,0.45)',  text: '#ef4444', label: 'Critical Severity' },
};

export function SolutionDetail({ id }: { id: string | null }) {
  const solution = getSolutionById(id);
  const [applied, setApplied] = useState(false);
  const [reported, setReported] = useState(false);
  const severity = SEVERITY_COLORS[solution.severity];

  const goBack = () => {
    window.dispatchEvent(new CustomEvent('densync_navigate', { detail: { tab: 'sim' } }));
  };

  // Operator feedback: mark applied -> increments usage stats on the backend
  const markApplied = async () => {
    setApplied(true);
    if (solution.apiId != null) {
      await apiPost(`/solutions/${solution.apiId}/apply`, {});
    }
  };

  // Operator feedback: fix didn't work -> report to the expert queue
  const reportFailure = async () => {
    setReported(true);
    await apiPost('/submit-cause', {
      title: solution.relatedError,
      description: `Solution "${solution.title}" (${solution.id}) did not resolve the issue — reported from the solution detail page.`,
      severity: solution.severity,
      category: 'Follow-up',
      factory_location: '',
    });
  };

  return (
    <div className="tab-content animate-slide-up" style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ padding: '2rem', color: '#fff', maxWidth: '1100px' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <button
            onClick={goBack}
            title="Back to dashboard"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
                color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}>
                <Zap size={11} /> Suggested Solution · {solution.id}
              </span>
              <span style={{
                fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
                padding: '0.2rem 0.6rem', borderRadius: '20px',
                background: severity.bg, border: `1px solid ${severity.border}`, color: severity.text,
              }}>
                {severity.label}
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              {solution.title}
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.6, maxWidth: '720px' }}>
              {solution.summary}
            </p>
          </div>
        </div>

        {/* ── Meta chips ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {[
            { icon: <MapPin size={13} />, label: solution.equipment },
            { icon: <Activity size={13} />, label: `Error ${solution.relatedError}` },
            { icon: <Clock size={13} />, label: solution.estimatedTime },
            { icon: <ThumbsUp size={13} />, label: `${solution.uses} successful uses` },
            { icon: <CheckCircle size={13} />, label: `★ ${solution.rating}` },
          ].map((chip, i) => (
            <span key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.65)',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              padding: '0.4rem 0.75rem', borderRadius: '8px',
            }}>
              <span style={{ color: '#818cf8', display: 'flex' }}>{chip.icon}</span>
              {chip.label}
            </span>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(240px, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
          {/* ── Left column: steps + warnings ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

            {/* Confidence meter */}
            <div style={{
              padding: '1.25rem 1.5rem', borderRadius: '14px',
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldAlert size={14} color="#6366f1" /> AI Confidence
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#818cf8' }}>{solution.confidence}%</span>
              </div>
              <div style={{ height: '8px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                <div style={{
                  width: `${solution.confidence}%`, height: '100%', borderRadius: '6px',
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 0 12px rgba(99,102,241,0.6)',
                }} />
              </div>
              <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
                Verified against {solution.uses} past incidents · last verified {solution.lastVerified}
              </div>
            </div>

            {/* Step-by-step */}
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} color="#10b981" /> Step-by-Step Instructions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {solution.steps.map((step, index) => (
                  <div key={index} style={{
                    display: 'flex', gap: '1rem', padding: '1.15rem 1.25rem',
                    borderRadius: '12px', background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '9px', flexShrink: 0,
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', fontWeight: 800, color: '#fff',
                      boxShadow: '0 0 12px rgba(99,102,241,0.35)',
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>{step.title}</div>
                      <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65 }}>
                        {step.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safety warnings */}
            <div style={{
              padding: '1.25rem 1.5rem', borderRadius: '14px',
              background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.3)',
            }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}>
                <AlertTriangle size={16} /> Safety Warnings
              </h2>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {solution.warnings.map((warning, i) => (
                  <li key={i} style={{
                    display: 'flex', gap: '0.6rem', fontSize: '0.85rem', lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.7)',
                  }}>
                    <span style={{ color: '#ef4444', fontWeight: 800, flexShrink: 0 }}>!</span>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right column: tools, expert, actions ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Required tools */}
            <div style={{
              padding: '1.25rem', borderRadius: '14px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.85)' }}>
                <Wrench size={14} color="#f59e0b" /> Required Tools
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {solution.tools.map((tool, i) => (
                  <div key={i} style={{
                    fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#818cf8', flexShrink: 0 }} />
                    {tool}
                  </div>
                ))}
              </div>
            </div>

            {/* Verified by expert */}
            <div style={{
              padding: '1.25rem', borderRadius: '14px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.85)' }}>
                <User size={14} color="#8b5cf6" /> Verified By
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                  background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 800, color: '#fff',
                }}>
                  {solution.author.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{solution.author.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)' }}>{solution.author.role}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                onClick={markApplied}
                disabled={applied}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.8rem 1rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 700,
                  cursor: applied ? 'default' : 'pointer', transition: 'all 0.2s',
                  background: applied ? 'rgba(16,185,129,0.15)' : 'linear-gradient(135deg, #10b981, #059669)',
                  border: applied ? '1px solid rgba(16,185,129,0.4)' : '1px solid transparent',
                  color: applied ? '#10b981' : '#fff',
                  boxShadow: applied ? 'none' : '0 4px 16px rgba(16,185,129,0.3)',
                }}
              >
                <CheckCircle size={16} />
                {applied ? 'Marked as Applied' : 'Mark as Applied'}
              </button>

              <button
                onClick={reportFailure}
                disabled={reported}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.8rem 1rem', borderRadius: '10px', fontSize: '0.875rem', fontWeight: 600,
                  cursor: reported ? 'default' : 'pointer', transition: 'all 0.2s',
                  background: reported ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${reported ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  color: reported ? '#f59e0b' : 'rgba(255,255,255,0.75)',
                }}
              >
                <Flag size={15} />
                {reported ? 'Reported to Expert' : "This didn't fix it"}
              </button>

              <button
                onClick={() => { setApplied(false); setReported(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  padding: '0.65rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600,
                  background: 'transparent', border: 'none',
                  color: 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'color 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.color = 'rgba(255,255,255,0.75)'}
                onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                <RotateCcw size={13} /> Reset status
              </button>

              {(applied || reported) && (
                <div style={{
                  fontSize: '0.75rem', lineHeight: 1.5, textAlign: 'center',
                  color: applied ? '#10b981' : '#f59e0b',
                }}>
                  {applied
                    ? 'Feedback recorded — this improves future AI confidence scores.'
                    : 'A Factory Expert has been notified to review this solution.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
