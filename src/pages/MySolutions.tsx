import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, TrendingUp, Star, Edit, Eye, Plus } from 'lucide-react';
import { apiGet } from '../lib/api';

interface SolutionRow {
  id: number;
  title: string;
  factory: string;
  status: 'verified' | 'pending';
  uses: number;
  rating: number;
  created: string;
}

/** Offline fallback only (same pattern as FactoryOperatorDashboard). */
const DEMO_SOLUTIONS: SolutionRow[] = [
  { id: 1, title: 'Motor overheating fix', factory: 'Gunma Plant', status: 'verified', uses: 45, rating: 4.8, created: '2024-01-15' },
  { id: 2, title: 'Belt tension adjustment', factory: 'Hải Phòng', status: 'pending', uses: 12, rating: 4.2, created: '2024-01-20' },
  { id: 3, title: 'Sensor recalibration protocol', factory: 'Bangkok', status: 'verified', uses: 89, rating: 4.9, created: '2024-01-10' },
  { id: 4, title: 'Hydraulic pressure reset', factory: 'Gunma Plant', status: 'verified', uses: 67, rating: 4.7, created: '2024-01-18' },
  { id: 5, title: 'Conveyor belt alignment', factory: 'Hải Phòng', status: 'pending', uses: 8, rating: 4.0, created: '2024-01-22' },
  { id: 6, title: 'Cooling system optimization', factory: 'Bangkok', status: 'verified', uses: 134, rating: 4.9, created: '2024-01-05' },
];

export function MySolutions() {
  // Only the signed-in expert's own solutions (backend filters by author).
  const [solutions, setSolutions] = useState<SolutionRow[]>(DEMO_SOLUTIONS);

  useEffect(() => {
    let cancelled = false;
    apiGet<any>('/solutions?mine=1').then(res => {
      if (cancelled || !res || !res.data) return; // backend offline -> keep demo rows
      const rows: SolutionRow[] = res.data.map((raw: any) => ({
        id: raw.id,
        title: raw.title,
        factory: raw.factory ?? 'Global — all factories',
        // The backend has no moderation status yet, so confidence is the closest
        // signal available (>= 85 counts as verified).
        status: (raw.confidence ?? 0) >= 85 ? 'verified' : 'pending',
        uses: raw.uses ?? 0,
        rating: raw.rating ?? 0,
        created: raw.created_at ? String(raw.created_at).slice(0, 10) : '—',
      }));
      setSolutions(rows);
    });
    return () => { cancelled = true; };
  }, []);

  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');

  const filteredSolutions = solutions.filter(s => 
    filter === 'all' ? true : s.status === filter
  );

  return (
    <div style={{ padding: '2rem', color: '#fff' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <TrendingUp size={32} color="#10b981" />
            My Solutions
          </h1>
          <button
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
            }}
          >
            <Plus size={18} />
            Create New Solution
          </button>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>
          Manage and track your solutions for factory issues
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        {(['all', 'verified', 'pending'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              background: filter === filterType ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
              border: filter === filterType ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.08)',
              color: filter === filterType ? '#818cf8' : 'rgba(255,255,255,0.6)',
              fontWeight: filter === filterType ? 600 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textTransform: 'capitalize'
            }}
          >
            {filterType} ({solutions.filter(s => filterType === 'all' ? true : s.status === filterType).length})
          </button>
        ))}
      </div>

      {/* Solutions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.25rem' }}>
        {filteredSolutions.map((solution) => (
          <div
            key={solution.id}
            style={{
              padding: '1.75rem',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Status Badge */}
            <div style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              padding: '0.35rem 0.85rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: 700,
              background: solution.status === 'verified' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
              color: solution.status === 'verified' ? '#10b981' : '#f59e0b',
              border: solution.status === 'verified' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              {solution.status === 'verified' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
              {solution.status}
            </div>

            {/* Title */}
            <h3 style={{ fontWeight: 700, fontSize: '1.15rem', marginBottom: '0.5rem', paddingRight: '100px' }}>
              {solution.title}
            </h3>

            {/* Location */}
            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.25rem' }}>
              {solution.factory}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'rgba(255,255,255,0.7)' }}>
                <TrendingUp size={16} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{solution.uses}</span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>uses</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24' }}>
                <Star size={16} fill="#fbbf24" />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{solution.rating}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                style={{
                  flex: 1,
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(99,102,241,0.1)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  color: '#818cf8',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.2)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)';
                }}
              >
                <Eye size={16} />
                View
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                }}
              >
                <Edit size={16} />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSolutions.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '16px',
          border: '1px dashed rgba(255,255,255,0.1)'
        }}>
          <TrendingUp size={48} color="rgba(255,255,255,0.2)" style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>
            No solutions found
          </div>
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.3)' }}>
            Create your first solution to help factory operators
          </div>
        </div>
      )}
    </div>
  );
}
