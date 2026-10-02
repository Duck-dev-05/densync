import { useState, useEffect  } from "react";
import {
  Search, Database, User, MapPin, Calendar, PlayCircle, FileText,
  CheckCircle, XCircle, TrendingUp, Filter, Globe, Zap, BookOpen, BarChart2, ChevronRight, Download, Eye
} from 'lucide-react';
import { authHeaders } from '../lib/api';



const stats: any[] = [];

const categories = [
  { id: 'all', label: 'All Records' },
  { id: 'Mechanical', label: 'Mechanical' },
  { id: 'Electrical', label: 'Electrical' },
  { id: 'Hydraulic', label: 'Hydraulic' },
  { id: 'Robotics', label: 'Robotics' },
];

const trending: any[] = [];

export function KnowledgeBase() {
  const [archives, setArchives] = useState<any[]>([]);
  
  useEffect(() => {
    fetch("http://localhost:8000/api/knowledge", { headers: authHeaders() })
      .then(res => res.json())
      .then(data => {
        if(data.status === "success") {
          setArchives(data.data);
        }
      })
      .catch(console.error);
  }, []);

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeReportUrl, setActiveReportUrl] = useState<string | null>(null);

  const filtered = archives.filter(a => {
    const matchCat = activeCategory === 'all' || a.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || a.id.toLowerCase().includes(q) || a.title.toLowerCase().includes(q) || a.author.toLowerCase().includes(q) || a.tags.some((t: string) => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="tab-content animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,rgba(16,185,129,0.2),rgba(16,185,129,0.04))', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}>
            <Database size={22} style={{ color: 'var(--success-400)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--success-400)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Global Knowledge · Cloud Repository</div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>Knowledge Base</h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
            <Download size={14} /> Export CSV
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg,var(--success-400),var(--brand-400))', border: 'none', borderRadius: '10px', padding: '0.5rem 1.1rem', color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
            <Zap size={14} /> Submit Record
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
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

      {/* ── Search + Filters ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
        {/* Search bar */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '0.75rem 1.25rem', transition: 'border 0.2s' }}
            onFocusCapture={(e) => e.currentTarget.style.border = '1px solid rgba(100,102,241,0.3)'}
            onBlurCapture={(e) => e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'}
          >
            <Search size={18} style={{ color: 'var(--brand-400)', filter: 'drop-shadow(0 0 4px var(--brand-glow))', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search by error code, machine part, expert name, or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '0.9rem', fontWeight: 500, flex: 1, width: '100%' }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', fontSize: '0.75rem', fontWeight: 600, padding: 0, alignItems: 'center' }}>
                ✕
              </button>
            )}
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, var(--brand-400), #9061ea)', border: 'none', borderRadius: '12px', padding: '0.75rem 1.5rem', color: '#fff', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(100,102,241,0.35)', flexShrink: 0 }}>
            <Search size={16} /> Search Hub
          </button>
        </div>

        {/* Category filter pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{
              padding: '0.4rem 1rem', borderRadius: '20px', border: activeCategory === cat.id ? '1px solid rgba(100,102,241,0.5)' : '1px solid rgba(255,255,255,0.07)',
              background: activeCategory === cat.id ? 'linear-gradient(135deg, var(--brand-400), #9061ea)' : 'rgba(255,255,255,0.03)',
              color: activeCategory === cat.id ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
              boxShadow: activeCategory === cat.id ? '0 4px 12px rgba(100,102,241,0.3)' : 'none' }}>
              {cat.label}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
            {filtered.length} record{filtered.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </div>

      {/* ── Main Content: Archive list + Sidebar ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', flex: 1, minHeight: 0 }}>

        {/* Archive list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', minHeight: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: '1px dashed rgba(255,255,255,0.07)', borderRadius: '16px' }}>
              <Database size={40} style={{ opacity: 0.15 }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>No records match your search</div>
              <div style={{ fontSize: '0.8rem' }}>Try a different keyword or category</div>
            </div>
          ) : (
            filtered.map((arch, i) => {
              const isExpanded = expandedId === arch.id;
              return (
                <div key={arch.id} style={{
                  background: 'rgba(255,255,255,0.02)', border: `1px solid rgba(255,255,255,0.06)`,
                  borderLeft: `4px solid ${arch.solved ? 'var(--success-400)' : 'var(--danger-400)'}`,
                  borderRadius: '14px', overflow: 'hidden',
                  transition: 'all 0.2s',
                  animationDelay: `${i * 80}ms`,
                  boxShadow: isExpanded ? '0 8px 24px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.2)',
                  flexShrink: 0 }}
                onMouseOver={(e) => { if (!isExpanded) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseOut={(e) => { if (!isExpanded) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                >
                  {/* Card header row */}
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.1rem 1.25rem', cursor: 'pointer' }}
                    onClick={() => setExpandedId(isExpanded ? null : arch.id)}
                  >
                    {/* Error code pill */}
                    <div style={{
                      background: arch.solved ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      border: `1px solid ${arch.solved ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                      borderRadius: '8px', padding: '0.4rem 0.75rem',
                      minWidth: '88px', textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: arch.solved ? 'var(--success-400)' : 'var(--danger-400)', letterSpacing: '0.04em' }}>{arch.id}</div>
                    </div>

                    {/* Title + meta */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <h3 style={{ margin: 0, fontSize: '0.95rem', color: '#fff', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{arch.title}</h3>
                        {arch.solved ? <CheckCircle size={14} style={{ color: 'var(--success-400)', flexShrink: 0 }} /> : <XCircle size={14} style={{ color: 'var(--danger-400)', flexShrink: 0 }} />}
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.1rem 0.5rem', borderRadius: '5px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-tertiary)', flexShrink: 0 }}>{arch.category}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {[
                          { icon: User, text: arch.author, color: 'var(--accent-400)' },
                          { icon: MapPin, text: `${arch.factory || 'Global Cloud'}`, color: 'var(--brand-400)' },
                          { icon: Calendar, text: arch.date, color: 'var(--text-tertiary)' },
                        ].map((m, j) => (
                          <span key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            <m.icon size={11} style={{ color: m.color }} /> {m.text}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right stats */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI</div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: arch.confidence >= 90 ? 'var(--success-400)' : arch.confidence >= 80 ? 'var(--warning-400)' : 'var(--danger-400)' }}>{arch.confidence}%</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Views</div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{arch.views}</div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {arch.solved && (
                          <button onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '8px', padding: '0.45rem 0.8rem', color: 'var(--success-400)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                            <PlayCircle size={13} /> AI Video
                          </button>
                        )}
                        <button onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.45rem 0.8rem', color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}>
                          <FileText size={13} /> Report
                        </button>
                      </div>

                      <ChevronRight size={16} style={{ color: 'var(--text-tertiary)', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '1rem 0 1rem' }}>{arch.description}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>s</div>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            {arch.tags.map((tag: string) => (
                              <span key={tag} style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '5px', background: 'rgba(100,102,241,0.1)', color: 'var(--brand-400)', border: '1px solid rgba(100,102,241,0.2)' }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Solution Steps</div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>{arch.steps} steps documented</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Status</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: arch.solved ? 'var(--success-400)' : 'var(--danger-400)', boxShadow: arch.solved ? '0 0 8px var(--success-400)' : '0 0 8px var(--danger-400)' }} />
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: arch.solved ? 'var(--success-400)' : 'var(--danger-400)' }}>{arch.solved ? 'Resolved' : 'Investigating'}</span>
                          </div>
                        </div>
                        <div style={{ marginLeft: 'auto' }}>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (arch.url) setActiveReportUrl(arch.url);
                            }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, var(--brand-400), #9061ea)', border: 'none', borderRadius: '9px', padding: '0.55rem 1.1rem', color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(100,102,241,0.35)' }}
                          >
                            <Eye size={14} /> {arch.url ? 'Read on Wikipedia' : 'View Full Report'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Sidebar ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', minHeight: 0 }}>

          {/* Trending searches */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <TrendingUp size={16} style={{ color: 'var(--brand-400)' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Trending Searches</span>
            </div>
            {trending.map((t, i) => (
              <button key={i} onClick={() => setSearch(t.split(' · ')[1] || t)} style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                width: '100%', padding: '0.55rem 0.75rem', borderRadius: '9px',
                background: 'transparent', border: 'none', cursor: 'pointer',
                transition: 'background 0.15s', marginBottom: i < trending.length - 1 ? '0.25rem' : 0 }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-tertiary)', minWidth: '18px' }}>#{i + 1}</span>
                <Search size={12} style={{ color: 'var(--brand-400)', flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500, textAlign: 'left' }}>{t}</span>
              </button>
            ))}
          </div>

          {/* Category breakdown */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <BarChart2 size={16} style={{ color: 'var(--accent-400)' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>By Category</span>
            </div>
            {[
              { name: 'Mechanical', count: 412, pct: 33, color: 'var(--brand-400)' },
              { name: 'Electrical', count: 358, pct: 29, color: 'var(--accent-400)' },
              { name: 'Hydraulic', count: 247, pct: 20, color: 'var(--warning-400)' },
              { name: 'Robotics', count: 230, pct: 18, color: 'var(--success-400)' },
            ].map((c, i) => (
              <div key={i} style={{ marginBottom: i < 3 ? '0.9rem' : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{c.name}</span>
                  <span style={{ fontSize: '0.78rem', color: c.color, fontWeight: 700 }}>{c.count}</span>
                </div>
                <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.pct}%`, background: c.color, borderRadius: '99px', boxShadow: `0 0 6px ${c.color}` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Quick facts */}
          <div style={{ background: 'rgba(100,102,241,0.05)', border: '1px solid rgba(100,102,241,0.15)', borderRadius: '14px', padding: '1.1rem 1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.9rem' }}>
              <BookOpen size={16} style={{ color: 'var(--brand-400)' }} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Facts</span>
            </div>
            {[
              { label: 'Avg. Resolution Time', value: '32m' },
              { label: 'Most Active Factory', value: 'Gunma' },
              { label: 'Top Expert', value: 'Tanaka Kenji' },
              { label: 'Last Updated', value: '2h ago' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{f.label}</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{f.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* In-App Report Modal */}
      {activeReportUrl && (
        <div className="anim-fade-in" style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="anim-scale-in" style={{ width: '100%', maxWidth: '1200px', height: '100%', background: '#0a0a0f', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Globe size={18} style={{ color: 'var(--brand-400)' }} />
                <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 700 }}>In-App Browser</h3>
              </div>
              <button 
                onClick={() => setActiveReportUrl(null)} 
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', transition: 'all 0.2s' }}
                onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'var(--danger-400)'; e.currentTarget.style.borderColor = 'var(--danger-400)'; }}
                onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              >
                ✕
              </button>
            </div>
            <iframe src={activeReportUrl} style={{ flex: 1, border: 'none', width: '100%', background: '#fff' }} title="Report Content" />
          </div>
        </div>
      )}
    </div>
  );
}
