import { useCallback, useEffect, useState } from 'react';
import { Factory, AlertTriangle, CheckCircle, Clock, Zap, ArrowRight, Hourglass, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiGet, apiPost } from '../lib/api';
import {
  SOLUTIONS, Solution, normalizeErrorCode, registerSolution, toSolutionFromApi,
} from '../data/solutions';

interface Alert {
  id: number;
  type: 'error' | 'warning' | 'success';
  errorCode?: string;
  message: string;
  time: string;
}

const ALERTS: Alert[] = [
  { id: 1, type: 'error', errorCode: '#ERR-101', message: 'Conveyor Belt #3 malfunction detected', time: '2 min ago' },
  { id: 2, type: 'warning', errorCode: '#ERR-233', message: 'Temperature rising in Assembly Line B', time: '15 min ago' },
  { id: 3, type: 'error', errorCode: '#ERR-905', message: 'Hydraulic pressure drop on Robotic Arm R-4', time: '30 min ago' },
  { id: 4, type: 'success', message: 'Solution applied: Motor reset completed', time: '1 hour ago' },
];

interface MatchState {
  solution: Solution | null;
  reported: boolean;
  offline: boolean;
  loading: boolean;
}

const INITIAL_MATCHES: Record<string, MatchState> = {};

export function FactoryOperatorDashboard() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<Record<string, MatchState>>(INITIAL_MATCHES);

  /**
   * For every active alert with an error code, automatically look up the
   * solution known for THIS factory (then global). New errors (no solution)
   * are auto-reported to the Factory Expert queue.
   */
  const fetchMatches = useCallback(async () => {
    const codes = Array.from(new Set(
      ALERTS.filter(a => a.errorCode).map(a => a.errorCode as string)
    ));

    setMatches(prev => {
      const next = { ...prev };
      for (const code of codes) {
        next[code] = { ...next[code], solution: next[code]?.solution ?? null, reported: next[code]?.reported ?? false, offline: false, loading: true };
      }
      return next;
    });

    await Promise.all(codes.map(async code => {
      const alert = ALERTS.find(a => a.errorCode === code)!;
      const res = await apiGet<any>(`/solutions/match?error_code=${encodeURIComponent(code)}`);

      // Backend offline -> fall back to the bundled demo solutions
      if (res === null) {
        const local = SOLUTIONS.find(s => normalizeErrorCode(s.relatedError) === normalizeErrorCode(code)) ?? null;
        setMatches(prev => ({ ...prev, [code]: { solution: local, reported: false, offline: true, loading: false } }));
        return;
      }

      // Known error: solution found for this factory (or global)
      if (res.data) {
        const solution = toSolutionFromApi(res.data);
        registerSolution(solution);
        setMatches(prev => ({ ...prev, [code]: { solution, reported: false, offline: false, loading: false } }));
        return;
      }

      // New error: no solution yet -> auto-report to experts, then wait
      let reported = !!res.already_reported;
      if (!reported) {
        const posted = await apiPost('/submit-cause', {
          title: code,
          description: `${alert.message} — auto-reported by the operator dashboard, no known solution.`,
          severity: alert.type === 'error' ? 'high' : 'medium',
          category: 'Auto-detected',
          factory_location: '',
        });
        reported = posted !== null;
      }
      setMatches(prev => ({ ...prev, [code]: { solution: null, reported, offline: false, loading: false } }));
    }));
  }, []);

  useEffect(() => {
    void fetchMatches();
  }, [fetchMatches]);

  const notifyExpert = async (code: string) => {
    const alert = ALERTS.find(a => a.errorCode === code);
    if (!alert) return;
    const posted = await apiPost('/submit-cause', {
      title: code,
      description: `${alert.message} — reported manually by the operator.`,
      severity: alert.type === 'error' ? 'high' : 'medium',
      category: 'Auto-detected',
      factory_location: '',
    });
    if (posted !== null) {
      setMatches(prev => ({ ...prev, [code]: { ...prev[code], reported: true } }));
    }
  };

  const openSolution = (id: string) => {
    window.dispatchEvent(new CustomEvent('densync_navigate', { detail: { tab: 'solution-detail', id } }));
  };

  const errorAlerts = ALERTS.filter(a => a.errorCode);

  const statusChip = (alert: Alert) => {
    if (!alert.errorCode) return null;
    const m = matches[alert.errorCode];
    if (!m || m.loading) {
      return <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.4)' }}>matching…</span>;
    }
    if (m.solution) {
      return (
        <span style={{
          fontSize: '0.68rem', fontWeight: 700, color: '#10b981',
          background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)',
          padding: '0.15rem 0.55rem', borderRadius: '20px',
        }}>
          ✓ solution found
        </span>
      );
    }
    return (
      <span style={{
        fontSize: '0.68rem', fontWeight: 700, color: '#f59e0b',
        background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
        padding: '0.15rem 0.55rem', borderRadius: '20px',
      }}>
        waiting for expert
      </span>
    );
  };

  return (
    <div style={{ padding: '2rem', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Factory size={32} color="#6366f1" />
            Factory Operator Dashboard
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>
            Monitor equipment and receive automatic solution suggestions — no searching required
          </p>
        </div>
        <button
          onClick={fetchMatches}
          title="Re-scan solutions for this factory"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.1rem', borderRadius: '10px',
            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
            color: '#818cf8', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} /> Re-match
        </button>
      </div>

      {/* Active Alerts */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={24} color="#f59e0b" />
          Active Alerts
        </h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {ALERTS.map(alert => (
            <div
              key={alert.id}
              style={{
                padding: '1.25rem', borderRadius: '12px',
                background: alert.type === 'error' ? 'rgba(239,68,68,0.1)' :
                         alert.type === 'warning' ? 'rgba(245,158,11,0.1)' :
                         'rgba(16,185,129,0.1)',
                border: `1px solid ${alert.type === 'error' ? 'rgba(239,68,68,0.3)' :
                                 alert.type === 'warning' ? 'rgba(245,158,11,0.3)' :
                                 'rgba(16,185,129,0.3)'}`,
                display: 'flex', alignItems: 'center', gap: '1rem'
              }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '10px',
                background: alert.type === 'error' ? 'rgba(239,68,68,0.2)' :
                         alert.type === 'warning' ? 'rgba(245,158,11,0.2)' :
                         'rgba(16,185,129,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                {alert.type === 'error' ? <AlertTriangle size={20} color="#ef4444" /> :
                 alert.type === 'warning' ? <Clock size={20} color="#f59e0b" /> :
                 <CheckCircle size={20} color="#10b981" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  {alert.message}
                  {alert.errorCode && (
                    <span style={{
                      fontSize: '0.68rem', fontWeight: 800, fontFamily: 'monospace',
                      color: '#818cf8', background: 'rgba(99,102,241,0.12)',
                      border: '1px solid rgba(99,102,241,0.3)', padding: '0.1rem 0.45rem', borderRadius: '6px',
                    }}>
                      {alert.errorCode}
                    </span>
                  )}
                  {statusChip(alert)}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>{alert.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automatic Solutions — matched per error, per factory */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Zap size={24} color="#6366f1" />
            Suggested Solutions
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
            Matched automatically{user ? ` for ${user.factory_location}` : ''}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {errorAlerts.map(alert => {
            const code = alert.errorCode!;
            const m = matches[code];

            // Loading
            if (!m || m.loading) {
              return (
                <div key={code} style={{
                  padding: '1.5rem', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'rgba(255,255,255,0.45)',
                  fontSize: '0.85rem', fontWeight: 600, minHeight: '140px',
                }}>
                  <RefreshCw size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Matching known fixes for {code}…
                </div>
              );
            }

            // Known error -> solution card (clickable to full detail page)
            if (m.solution) {
              const sol = m.solution;
              return (
                <div
                  key={code}
                  onClick={() => openSolution(sol.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSolution(sol.id); } }}
                  style={{
                    padding: '1.5rem', borderRadius: '12px',
                    background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.14)';
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.45)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{sol.title}</h3>
                    <ArrowRight size={16} color="#818cf8" />
                  </div>
                  <div style={{
                    fontSize: '0.7rem', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase',
                    letterSpacing: '0.08em', marginBottom: '0.6rem',
                  }}>
                    {sol.factory ? `Fix for ${sol.factory}` : 'Global fix · all factories'}
                  </div>
                  <div style={{
                    fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6,
                    marginBottom: '1rem', whiteSpace: 'pre-line',
                  }}>
                    {sol.steps.map((step, i) => `${i + 1}. ${step.title}`).join('\n')}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    fontSize: '0.85rem', color: '#6366f1', fontWeight: 600,
                  }}>
                    <CheckCircle size={16} />
                    {sol.confidence}% confidence
                  </div>
                </div>
              );
            }

            // New error -> waiting for expert card
            return (
              <div key={code} style={{
                padding: '1.5rem', borderRadius: '12px',
                background: 'rgba(245,158,11,0.06)', border: '1px dashed rgba(245,158,11,0.35)',
                display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '140px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Hourglass size={18} color="#f59e0b" />
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#f59e0b' }}>No solution yet</h3>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, fontFamily: 'monospace', color: '#818cf8' }}>
                  {code}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, flex: 1 }}>
                  This error has not been solved at this factory before.
                  {' '}{m.reported
                    ? 'A Factory Expert has been notified and is working on a fix — it will appear here automatically once verified.'
                    : m.offline
                      ? 'The backend is offline, so experts could not be notified yet.'
                      : 'Reporting it to the Factory Experts now…'}
                </div>
                {m.offline && !m.reported && (
                  <button
                    onClick={() => notifyExpert(code)}
                    style={{
                      padding: '0.55rem 1rem', borderRadius: '8px',
                      background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.4)',
                      color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    Notify Expert
                  </button>
                )}
                {m.reported && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    fontSize: '0.78rem', fontWeight: 700, color: '#10b981',
                  }}>
                    <CheckCircle size={14} /> In expert queue
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
