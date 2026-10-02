import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  Users, AlertCircle, Plus, TrendingUp, CheckCircle2, Clock, ArrowRight,
  X, Wrench, Globe, Factory as FactoryIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiGet, apiPost } from '../lib/api';

interface PendingIssue {
  id: string;
  title: string;
  description?: string;
  factory: string;
  severity: string;
  time: string;
}

interface MySolution {
  id: string;
  title: string;
  factory: string;
  status: 'verified' | 'pending';
  uses: number;
  rating: number;
}

// Offline fallback so the dashboard still renders without the backend
const DEMO_ISSUES: PendingIssue[] = [
  { id: 'd1', title: 'Hydraulic pressure drop', factory: 'Gunma Plant', severity: 'high', time: '30 min ago' },
  { id: 'd2', title: 'Sensor calibration error', factory: 'Hải Phòng', severity: 'medium', time: '2 hours ago' },
  { id: 'd3', title: 'Unusual vibration pattern', factory: 'Bangkok Assembly', severity: 'low', time: '4 hours ago' },
];

const DEMO_SOLUTIONS: MySolution[] = [
  { id: 'ds1', title: 'Motor overheating fix', factory: 'Gunma Plant', status: 'verified', uses: 45, rating: 4.8 },
  { id: 'ds2', title: 'Belt tension adjustment', factory: 'Hải Phòng', status: 'pending', uses: 12, rating: 4.2 },
  { id: 'ds3', title: 'Sensor recalibration protocol', factory: 'Bangkok', status: 'verified', uses: 89, rating: 4.9 },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

const FIELD_STYLE: CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  padding: '0.7rem 0.9rem',
  color: '#fff',
  fontSize: '0.875rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const LABEL_STYLE: CSSProperties = {
  fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)',
  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '0.35rem',
  display: 'block',
};

export function FactoryExpertDashboard() {
  const { user } = useAuth();
  const [pendingIssues, setPendingIssues] = useState<PendingIssue[]>(DEMO_ISSUES);
  const [mySolutions, setMySolutions] = useState<MySolution[]>(DEMO_SOLUTIONS);
  const [offline, setOffline] = useState(false);

  // Create Solution form state
  const [creating, setCreating] = useState<PendingIssue | null>(null);
  const [form, setForm] = useState({ title: '', error_code: '', summary: '', steps: '', warnings: '', tools: '', confidence: 85, severity: 'medium', scope: 'factory' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedFlash, setSavedFlash] = useState('');

  const refresh = useCallback(async () => {
    const [queueRes, mineRes] = await Promise.all([
      apiGet<any>('/reports/pending'),
      apiGet<any>('/solutions?mine=1'),
    ]);

    if (queueRes && queueRes.status === 'success') {
      setPendingIssues(queueRes.data.map((r: any) => ({
        id: `R${r.id}`,
        title: r.title,
        description: r.description,
        factory: r.factory_location || 'Unknown factory',
        severity: r.severity || 'medium',
        time: r.created_at ? timeAgo(r.created_at) : 'recently',
      })));
    } else {
      setOffline(true);
    }

    if (mineRes && mineRes.status === 'success') {
      setMySolutions(mineRes.data.map((s: any) => ({
        id: `S${s.id}`,
        title: s.title,
        factory: s.factory || 'All factories',
        status: 'verified' as const,
        uses: s.uses ?? 0,
        rating: s.rating ?? 0,
      })));
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const openCreateForm = (issue: PendingIssue) => {
    setCreating(issue);
    setSaveError('');
    setForm({
      title: `${issue.title} — fix`,
      error_code: issue.title,
      summary: issue.description || '',
      steps: '',
      warnings: '',
      tools: '',
      confidence: 85,
      severity: issue.severity || 'medium',
      scope: 'factory',
    });
  };

  const submitSolution = async () => {
    if (!form.title.trim() || !form.error_code.trim() || !form.steps.trim()) {
      setSaveError('Title, error code and at least one step are required.');
      return;
    }
    setSaving(true);
    setSaveError('');
    const res = await apiPost<any>('/solutions', {
      error_code: form.error_code.trim(),
      title: form.title.trim(),
      summary: form.summary.trim(),
      steps: form.steps,
      warnings: form.warnings,
      tools: form.tools,
      confidence: Number(form.confidence),
      severity: form.severity,
      estimated_time: '',
      scope: form.scope,
    });
    setSaving(false);

    if (res === null) {
      setSaveError('Backend offline — start the API server to publish solutions.');
      return;
    }

    // Success: close form, flash message, refresh queue (report is now covered)
    setCreating(null);
    setSavedFlash(`Solution "${form.title.trim()}" published${form.scope === 'global' ? ' to all factories' : ` to ${user?.factory_location ?? 'your factory'}`} — operators will now see it automatically.`);
    setTimeout(() => setSavedFlash(''), 6000);
    void refresh();
  };

  const navigateToMySolutions = () => {
    window.dispatchEvent(new CustomEvent('densync_navigate', { detail: { tab: 'my-solutions' } }));
  };

  const severityColor = (sev: string) =>
    sev === 'high' || sev === 'critical' ? '#ef4444' : sev === 'medium' ? '#f59e0b' : '#3b82f6';

  return (
    <div style={{ padding: '2rem', color: '#fff' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Users size={32} color="#8b5cf6" />
          Factory Expert Dashboard
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>
          Analyze new errors and publish solutions — operators see them automatically once verified
        </p>
        {offline && (
          <p style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.5rem' }}>
            ⚠ Backend offline — showing demo queue. Start the API server for live reports.
          </p>
        )}
      </div>

      {savedFlash && (
        <div style={{
          marginBottom: '1.5rem', padding: '0.9rem 1.25rem', borderRadius: '10px',
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.35)',
          color: '#10b981', fontSize: '0.85rem', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          <CheckCircle2 size={16} /> {savedFlash}
        </div>
      )}

      {/* Pending Issues from Operators */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={24} color="#f59e0b" />
            Pending Issues ({pendingIssues.length})
          </h2>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>
            New errors with no known fix — waiting for you
          </span>
        </div>

        {pendingIssues.length === 0 ? (
          <div style={{
            padding: '2rem', borderRadius: '12px', textAlign: 'center',
            background: 'rgba(16,185,129,0.05)', border: '1px dashed rgba(16,185,129,0.3)',
            color: '#10b981', fontSize: '0.9rem', fontWeight: 600,
          }}>
            ✓ Queue empty — every reported error already has a solution.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {pendingIssues.map(issue => (
              <div
                key={issue.id}
                style={{
                  padding: '1.25rem', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', gap: '1rem'
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: `${severityColor(issue.severity)}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <AlertCircle size={20} color={severityColor(issue.severity)} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '1rem' }}>{issue.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FactoryIcon size={12} /> {issue.factory}
                    <span style={{ color: 'rgba(255,255,255,0.25)' }}>•</span>
                    <span style={{ color: severityColor(issue.severity), fontWeight: 700, textTransform: 'uppercase', fontSize: '0.72rem' }}>{issue.severity}</span>
                  </div>
                  {issue.description && (
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {issue.description}
                    </div>
                  )}
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{issue.time}</div>
                </div>
                <button
                  onClick={() => openCreateForm(issue)}
                  style={{
                    padding: '0.6rem 1.2rem', borderRadius: '8px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none', color: '#fff', fontWeight: 600, fontSize: '0.85rem',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                    flexShrink: 0,
                  }}
                >
                  <Plus size={16} />
                  Create Solution
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Solutions */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={24} color="#10b981" />
            My Solutions
          </h2>
          <button
            onClick={navigateToMySolutions}
            style={{
              padding: '0.5rem 1rem', borderRadius: '8px',
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
              color: '#818cf8', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.2)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)';
            }}
          >
            View All
            <ArrowRight size={16} />
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
          {mySolutions.map(solution => (
            <div
              key={solution.id}
              style={{
                padding: '1.5rem', borderRadius: '12px',
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.2)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{solution.title}</h3>
                <div style={{
                  padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                  background: solution.status === 'verified' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                  color: solution.status === 'verified' ? '#10b981' : '#f59e0b',
                  display: 'flex', alignItems: 'center', gap: '0.35rem'
                }}>
                  {solution.status === 'verified' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  {solution.status}
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {solution.factory === 'All factories' ? <Globe size={13} /> : <FactoryIcon size={13} />}
                {solution.factory}
              </div>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.7)' }}>
                  <TrendingUp size={16} />
                  {solution.uses} uses
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24' }}>
                  ★ {solution.rating}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Create Solution Modal ── */}
      {creating && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(5, 6, 14, 0.75)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
          }}
          onClick={e => { if (e.target === e.currentTarget) setCreating(null); }}
        >
          <div style={{
            width: '100%', maxWidth: '560px', maxHeight: '85vh', overflowY: 'auto',
            background: 'rgba(15, 16, 30, 0.98)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px', padding: '1.75rem',
            boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
                  New Error → New Solution
                </div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Create Solution</h3>
              </div>
              <button
                onClick={() => setCreating(null)}
                style={{
                  width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Reporting: <strong style={{ color: '#fff' }}>{creating.title}</strong>
              {creating.description && <> — {creating.description}</>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={LABEL_STYLE}>Error Code</label>
                <input
                  style={{ ...FIELD_STYLE, color: '#818cf8', fontFamily: 'monospace', fontWeight: 700 }}
                  value={form.error_code}
                  onChange={e => setForm(f => ({ ...f, error_code: e.target.value }))}
                  placeholder="#ERR-905"
                />
              </div>
              <div>
                <label style={LABEL_STYLE}>Solution Title</label>
                <input
                  style={FIELD_STYLE}
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Hydraulic pressure top-up & seal check"
                />
              </div>
              <div>
                <label style={LABEL_STYLE}>Summary</label>
                <textarea
                  rows={2}
                  style={{ ...FIELD_STYLE, resize: 'vertical' }}
                  value={form.summary}
                  onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                  placeholder="One-sentence description of the fix…"
                />
              </div>
              <div>
                <label style={LABEL_STYLE}>
                  <Wrench size={11} style={{ display: 'inline', verticalAlign: '-1px' }} /> Steps (one per line)
                </label>
                <textarea
                  rows={4}
                  style={{ ...FIELD_STYLE, resize: 'vertical', lineHeight: 1.6 }}
                  value={form.steps}
                  onChange={e => setForm(f => ({ ...f, steps: e.target.value }))}
                  placeholder={'1. Isolate the hydraulic line\n2. Inspect seals for wear\n3. Re-pressurize and test'}
                />
              </div>
              <div>
                <label style={LABEL_STYLE}>⚠ Safety Warnings (one per line, optional)</label>
                <textarea
                  rows={2}
                  style={{ ...FIELD_STYLE, resize: 'vertical' }}
                  value={form.warnings}
                  onChange={e => setForm(f => ({ ...f, warnings: e.target.value }))}
                  placeholder={'Depressurize before opening the line'}
                />
              </div>
              <div>
                <label style={LABEL_STYLE}>Required Tools (one per line, optional)</label>
                <input
                  style={FIELD_STYLE}
                  value={form.tools}
                  onChange={e => setForm(f => ({ ...f, tools: e.target.value }))}
                  placeholder="Pressure gauge, seal kit"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={LABEL_STYLE}>Severity</label>
                  <select
                    style={FIELD_STYLE}
                    value={form.severity}
                    onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label style={LABEL_STYLE}>Confidence ({form.confidence}%)</label>
                  <input
                    type="range" min={50} max={100} value={form.confidence}
                    onChange={e => setForm(f => ({ ...f, confidence: Number(e.target.value) }))}
                    style={{ width: '100%', accentColor: '#6366f1' }}
                  />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Scope</label>
                  <select
                    style={FIELD_STYLE}
                    value={form.scope}
                    onChange={e => setForm(f => ({ ...f, scope: e.target.value }))}
                  >
                    <option value="factory">My factory only</option>
                    <option value="global">All factories</option>
                  </select>
                </div>
              </div>

              {saveError && (
                <div style={{
                  padding: '0.7rem 0.9rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)', color: '#ef4444',
                }}>
                  {saveError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <button
                  onClick={submitSolution}
                  disabled={saving}
                  style={{
                    flex: 1, padding: '0.8rem', borderRadius: '10px', border: 'none',
                    background: saving ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff', fontSize: '0.9rem', fontWeight: 700,
                    cursor: saving ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  }}
                >
                  <CheckCircle2 size={16} />
                  {saving ? 'Publishing…' : 'Publish Solution'}
                </button>
                <button
                  onClick={() => setCreating(null)}
                  style={{
                    padding: '0.8rem 1.25rem', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
