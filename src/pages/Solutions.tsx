import { useState } from 'react';
import { CheckCircle, TrendingUp, Star, Award, Brain, Timer, ThumbsUp, ChevronRight, ChevronLeft, Zap, Filter, Search, Globe, Medal, Target, Crown, Trophy, Shield, Clock, Zap as Lightning, X } from 'lucide-react';
import { GlassCard } from '../components/ui';

export function Solutions() {
  const [upvotes, setUpvotes] = useState({ jp: 124, vn: 42, th: 89, kr: 67, de: 156 });
  const [filter, setFilter] = useState<'all' | 'top-rated' | 'recent' | 'most-upvoted'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpert, setSelectedExpert] = useState<any>(null);

  const [experts, ] = useState<any[]>([
    {
      id: 'jp',
      name: 'Dr. Kenji Tanaka',
      role: 'Senior Diagnostics Eng',
      location: 'Gunma Plant',
      flag: 'https://flagcdn.com/w40/jp.png',
      avatar: '👨‍🔧',
      score: 12400,
      rank: 1,
      trend: 'up',
      badges: ['Top Contributor'],
      aiConfidence: 98,
      successRate: 99,
      responseTime: '< 5m',
      achievements: ['Master Diagnostician', 'Fastest Response', '100+ Saves'],
      steps: [
        "Review error logs and sensor telemetry data.",
        "Run diagnostic scripts on the affected subsystem.",
        "Isolate the faulty component and initiate bypass if applicable.",
        "Deploy the finalized patch to restore full operation."
      ],
      level: 'Elite',
      isTopRated: true,
      avatarGradient: 'gradient-brand',
      status: 'success'
    },
    {
      id: 'vn',
      name: 'Nguyen Thi Mai',
      role: 'Lead Robotics Tech',
      location: 'Hải Phòng',
      flag: 'https://flagcdn.com/w40/vn.png',
      avatar: '👩‍🔬',
      score: 9850,
      rank: 2,
      trend: 'up',
      badges: ['Top Contributor'],
      aiConfidence: 96,
      successRate: 98,
      responseTime: '< 15m',
      achievements: ['Master Diagnostician', 'Fastest Response', '100+ Saves'],
      steps: [
        "Review error logs and sensor telemetry data.",
        "Run diagnostic scripts on the affected subsystem.",
        "Isolate the faulty component and initiate bypass if applicable.",
        "Deploy the finalized patch to restore full operation."
      ],
      level: 'Senior',
      isTopRated: true,
      avatarGradient: 'gradient-brand',
      status: 'warning'
    },
    {
      id: 'th',
      name: 'Somchai Prasert',
      role: 'Quality Assurance Lead',
      location: 'Bangkok Assembly',
      flag: 'https://flagcdn.com/w40/th.png',
      avatar: '👨‍💼',
      score: 8900,
      rank: 3,
      trend: 'down',
      badges: ['Top Contributor'],
      aiConfidence: 94,
      successRate: 97,
      responseTime: '< 15m',
      achievements: ['Master Diagnostician', 'Fastest Response', '100+ Saves'],
      steps: [
        "Review error logs and sensor telemetry data.",
        "Run diagnostic scripts on the affected subsystem.",
        "Isolate the faulty component and initiate bypass if applicable.",
        "Deploy the finalized patch to restore full operation."
      ],
      level: 'Senior',
      isTopRated: false,
      avatarGradient: 'gradient-brand',
      status: 'success'
    },
    {
      id: 'kr',
      name: 'Elena Rostova',
      role: 'Automation Specialist',
      location: 'Berlin Stamping',
      flag: 'https://flagcdn.com/w40/de.png',
      avatar: '👩‍💻',
      score: 8100,
      rank: 4,
      trend: 'up',
      badges: ['Top Contributor'],
      aiConfidence: 92,
      successRate: 96,
      responseTime: '< 15m',
      achievements: ['Master Diagnostician', 'Fastest Response', '100+ Saves'],
      steps: [
        "Review error logs and sensor telemetry data.",
        "Run diagnostic scripts on the affected subsystem.",
        "Isolate the faulty component and initiate bypass if applicable.",
        "Deploy the finalized patch to restore full operation."
      ],
      level: 'Specialist',
      isTopRated: false,
      avatarGradient: 'gradient-brand',
      status: 'warning'
    },
    {
      id: 'de',
      name: 'Marcus Chen',
      role: 'Systems Architect',
      location: 'Global Support',
      flag: 'https://flagcdn.com/w40/un.png',
      avatar: '👨‍💻',
      score: 7650,
      rank: 5,
      trend: 'up',
      badges: ['Top Contributor'],
      aiConfidence: 90,
      successRate: 95,
      responseTime: '< 15m',
      achievements: ['Master Diagnostician', 'Fastest Response', '100+ Saves'],
      steps: [
        "Review error logs and sensor telemetry data.",
        "Run diagnostic scripts on the affected subsystem.",
        "Isolate the faulty component and initiate bypass if applicable.",
        "Deploy the finalized patch to restore full operation."
      ],
      level: 'Specialist',
      isTopRated: false,
      avatarGradient: 'gradient-brand',
      status: 'success'
    }
  ]);
  if (selectedExpert) {
    return (
      <div className="solutions-container animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* ── Top Nav Bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          marginBottom: '1.75rem',
          padding: '0.5rem 0.75rem',
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '14px',
          backdropFilter: 'blur(12px)'
        }}>
          {/* Back button */}
          <button
            onClick={() => setSelectedExpert(null)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px',
              width: '36px', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontWeight: 500, cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-tertiary)'}
              onClick={() => setSelectedExpert(null)}
            >Expert Rankings</span>
            <ChevronRight size={14} style={{ color: 'var(--text-tertiary)', opacity: 0.5 }} />
            <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>Expert Profile</span>
          </div>

          {/* Issue badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>Active Issue</span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '8px',
              padding: '0.3rem 0.75rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--danger-400)', boxShadow: '0 0 8px var(--danger-400)', animation: 'pulse 2s infinite' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--danger-400)', fontWeight: 700, letterSpacing: '0.02em' }}>#ERR-502</span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '0.5rem', paddingBottom: '2rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

            {/* ── Profile Hero Card ── */}
            <div
              className="animate-fade-in"
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}
            >
              {/* Accent top bar */}
              <div style={{
                height: '4px',
                background: selectedExpert.rank === 1
                  ? 'linear-gradient(90deg, #FFD700 0%, #F59E0B 50%, #FFD700 100%)'
                  : 'linear-gradient(90deg, var(--brand-400) 0%, var(--brand-600) 50%, var(--brand-400) 100%)',
                backgroundSize: '200% 100%'
              }} />

              {/* Card body */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(30,33,46,0.98) 0%, rgba(18,20,30,0.98) 100%)',
                padding: '2.5rem',
                position: 'relative' }}>
                {/* Ambient glow */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  background: selectedExpert.rank === 1
                    ? 'radial-gradient(ellipse at 15% 50%, rgba(255,215,0,0.08) 0%, transparent 55%)'
                    : 'radial-gradient(ellipse at 15% 50%, rgba(100,102,241,0.08) 0%, transparent 55%)',
                  pointerEvents: 'none' }} />

                <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div
                      className={`expert-avatar ${selectedExpert.avatarGradient}`}
                      style={{
                        width: '120px', height: '120px',
                        fontSize: '3rem',
                        borderRadius: '24px',
                        boxShadow: selectedExpert.rank === 1
                          ? '0 0 0 3px rgba(255,215,0,0.4), 0 16px 40px rgba(255,215,0,0.15)'
                          : '0 0 0 3px rgba(100,102,241,0.3), 0 16px 40px rgba(0,0,0,0.4)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, color: '#fff' }}
                    >
                      {selectedExpert.avatar}
                    </div>

                    {/* Rank badge */}
                    {selectedExpert.rank <= 3 && (
                      <div style={{
                        position: 'absolute', bottom: '-12px', right: '-12px',
                        background: selectedExpert.rank === 1
                          ? 'linear-gradient(135deg, #FFD700, #F59E0B)'
                          : selectedExpert.rank === 2
                            ? 'linear-gradient(135deg, #E5E7EB, #9CA3AF)'
                            : 'linear-gradient(135deg, #D97706, #92400E)',
                        width: '40px', height: '40px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem', fontWeight: 900, color: '#fff',
                        boxShadow: selectedExpert.rank === 1
                          ? '0 6px 18px rgba(245,158,11,0.6)'
                          : '0 6px 18px rgba(0,0,0,0.5)',
                        border: '3px solid rgba(18,20,30,0.98)',
                        textShadow: '0 1px 3px rgba(0,0,0,0.4)'
                      }}>
                        {selectedExpert.rank}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Name row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <h2 style={{
                        margin: 0, fontSize: '2.5rem', fontWeight: 800, color: '#fff',
                        letterSpacing: '-0.03em', lineHeight: 1.05,
                        textShadow: '0 2px 20px rgba(255,255,255,0.1)'
                      }}>
                        {selectedExpert.name}
                      </h2>

                      {selectedExpert.level === 'Elite' && (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '0.4rem',
                          background: 'linear-gradient(135deg, rgba(255,215,0,0.12), rgba(245,158,11,0.04))',
                          padding: '0.45rem 0.9rem',
                          borderRadius: '10px',
                          border: '1px solid rgba(255,215,0,0.35)',
                          boxShadow: '0 0 20px rgba(255,215,0,0.12)',
                          backdropFilter: 'blur(8px)' }}>
                          <Crown size={16} style={{ color: '#FFD700', filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.9))' }} />
                          <span style={{
                            fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em',
                            background: 'linear-gradient(135deg, #FFD700, #F59E0B)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            Elite Status
                          </span>
                        </div>
                      )}

                      {selectedExpert.level !== 'Elite' && (
                        <div style={{
                          background: 'var(--brand-100)', border: '1px solid var(--border-brand)',
                          borderRadius: '8px', padding: '0.3rem 0.75rem',
                          fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-400)', textTransform: 'uppercase', letterSpacing: '0.05em'
                        }}>
                          {selectedExpert.level}
                        </div>
                      )}
                    </div>

                    {/* Role */}
                    <p style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>
                      {selectedExpert.role}
                    </p>

                    {/* Tag pills */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'rgba(255,255,255,0.04)',
                        padding: '0.5rem 1rem', borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.07)' }}>
                        <Globe size={15} style={{ color: 'var(--accent-400)' }} />
                        <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>{selectedExpert.location}</span>
                      </div>

                      {selectedExpert.isTopRated && (
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          background: 'rgba(255,215,0,0.06)',
                          padding: '0.5rem 1rem', borderRadius: '10px',
                          border: '1px solid rgba(255,215,0,0.2)' }}>
                          <Star size={15} fill="#FFD700" style={{ color: '#FFD700' }} />
                          <span style={{ fontSize: '0.9rem', color: '#FFD700', fontWeight: 700 }}>Top Rated Expert</span>
                        </div>
                      )}

                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'rgba(16,185,129,0.06)',
                        padding: '0.5rem 1rem', borderRadius: '10px',
                        border: '1px solid rgba(16,185,129,0.2)' }}>
                        <Shield size={15} style={{ color: 'var(--success-400)' }} />
                        <span style={{ fontSize: '0.9rem', color: 'var(--success-400)', fontWeight: 700 }}>Verified Professional</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: estimated time pill */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px', padding: '1.25rem 1.5rem',
                    flexShrink: 0, textAlign: 'center'
                  }}>
                    <Timer size={22} style={{ color: 'var(--brand-400)', marginBottom: '0.25rem' }} />
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{selectedExpert.estTime}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Est. Fix Time</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
              {[
                { label: 'AI Confidence', value: `${selectedExpert.aiConfidence}%`, icon: Brain, color: 'var(--brand-400)', bg: 'rgba(100,102,241,0.08)', border: 'rgba(100,102,241,0.2)' },
                { label: 'Total Votes', value: upvotes[selectedExpert.id as keyof typeof upvotes], icon: TrendingUp, color: 'var(--accent-400)', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)' },
                { label: 'Success Rate', value: `${selectedExpert.successRate}%`, icon: Target, color: 'var(--success-400)', bg: 'var(--success-100)', border: 'var(--success-glow)' },
                { label: 'Avg. Response', value: selectedExpert.responseTime, icon: Clock, color: 'var(--warning-400)', bg: 'var(--warning-100)', border: 'var(--warning-glow)' }
              ].map((stat, i) => (
                <GlassCard
                  key={i}
                  padding="md"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                    background: 'var(--bg-layer2)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'default'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 24px ${stat.bg}`; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: stat.bg, border: `1px solid ${stat.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '1rem'
                  }}>
                    <stat.icon size={18} style={{ color: stat.color }} />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
                    {stat.value}
                  </div>
                </GlassCard>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem' }}>
              {/* Left Column: Achievements */}
              <GlassCard padding="lg" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Trophy size={20} style={{ color: 'var(--brand-400)' }} />
                  Expert Achievements
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedExpert.achievements.map((achievement: string, i: number) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      padding: '1rem 1.25rem',
                      borderRadius: '12px',
                      transition: 'background 0.2s'
                    }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    >
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'var(--brand-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Medal size={14} style={{ color: 'var(--brand-400)' }} />
                      </div>
                      <span style={{ color: '#fff', fontWeight: 500, fontSize: '0.95rem' }}>{achievement}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Right Column: Solution Steps */}
              <GlassCard padding="lg" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Lightning size={20} style={{ color: 'var(--warning-400)' }} />
                  Proposed Solution Flow
                </h3>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '0.5rem' }}>
                  {/* Vertical Line for timeline */}
                  <div style={{ position: 'absolute', left: '23px', top: '24px', bottom: '24px', width: '2px', background: 'linear-gradient(180deg, var(--brand-500) 0%, transparent 100%)', opacity: 0.3 }} />

                  {selectedExpert.steps.map((step: string, stepIndex: number) => (
                    <div key={stepIndex} style={{
                      display: 'flex', gap: '1.5rem', alignItems: 'flex-start',
                      padding: '1.25rem 0',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '36px', height: '36px',
                        background: 'var(--bg-layer2)',
                        border: '2px solid var(--brand-500)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1rem', fontWeight: 800, color: '#fff',
                        flexShrink: 0,
                        zIndex: 2,
                        boxShadow: '0 0 15px rgba(100,102,241,0.2)'
                      }}>
                        {stepIndex + 1}
                      </div>
                      <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        flex: 1,
                        transition: 'all 0.2s',
                        marginTop: '-0.25rem'
                      }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.05)'; }}
                      >
                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.5 }}>
                          {step}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
              <button
                className="btn btn-outline"
                style={{
                  flex: 1, padding: '1.25rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  border: '2px solid rgba(255,255,255,0.1)'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                onClick={() => setUpvotes(prev => ({ ...prev, [selectedExpert.id]: prev[selectedExpert.id as keyof typeof upvotes] + 1 }))}
              >
                <ThumbsUp size={22} /> Upvote Solution
              </button>
              <button
                className="btn btn-gradient"
                style={{
                  flex: 2, padding: '1.25rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  boxShadow: '0 10px 30px rgba(100,102,241,0.4)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)', pointerEvents: 'none' }} />
                <CheckCircle size={22} /> Deploy This Solution
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="solutions-container animate-slide-up">
        {/* ── Page Hero Header ── */}
        <div style={{
          position: 'relative',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.07)',
          marginBottom: '1.75rem',
          flexShrink: 0 }}>
          {/* Top accent stripe */}
          <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--brand-400) 0%, var(--accent-400) 50%, var(--brand-600) 100%)' }} />
          <div style={{
            background: 'linear-gradient(135deg, rgba(25,27,40,0.98) 0%, rgba(18,20,30,0.98) 100%)',
            padding: '1.75rem 2rem',
            display: 'flex', alignItems: 'center', gap: '2rem',
            position: 'relative' }}>
            {/* Ambient glow */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'radial-gradient(ellipse at 0% 50%, rgba(100,102,241,0.07) 0%, transparent 60%)',
              pointerEvents: 'none'
            }} />

            {/* Icon */}
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(100,102,241,0.2) 0%, rgba(100,102,241,0.05) 100%)',
              border: '1px solid rgba(100,102,241,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(100,102,241,0.15)',
              position: 'relative', zIndex: 1
            }}>
              <Zap size={26} style={{ color: 'var(--brand-400)', filter: 'drop-shadow(0 0 8px rgba(100,102,241,0.8))' }} />
            </div>

            {/* Title + subtitle */}
            <div style={{ position: 'relative', zIndex: 1, flex: 1 }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--brand-400)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.35rem' }}>
                Expert Analysis Engine
              </div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
                Expert Solutions
              </h1>
            </div>

            {/* Issue badge + status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1, flexShrink: 0 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>
                  Active Issue
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                  borderRadius: '10px', padding: '0.5rem 1rem' }}>
                  <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--danger-400)', boxShadow: '0 0 10px var(--danger-400)' }} />
                  <span style={{ fontSize: '1rem', color: 'var(--danger-400)', fontWeight: 800, letterSpacing: '0.02em' }}>#ERR-502</span>
                </div>
              </div>

              {/* Divider */}
              <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.07)' }} />

              {/* Global experts count */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Experts</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>5</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem',
          marginBottom: '1.5rem', flexShrink: 0
        }}>
          {[
            { icon: Globe, label: 'Global Experts', value: '5', color: 'var(--brand-400)', bg: 'rgba(100,102,241,0.08)', border: 'rgba(100,102,241,0.2)' },
            { icon: Crown, label: 'Elite Level', value: '1', color: 'var(--warning-400)', bg: 'var(--warning-100)', border: 'var(--warning-glow)' },
            { icon: ThumbsUp, label: 'Total Upvotes', value: String(Object.values(upvotes).reduce((a, b) => a + b, 0)), color: 'var(--success-400)', bg: 'var(--success-100)', border: 'var(--success-glow)' },
            { icon: Target, label: 'Avg. Success', value: '94%', color: 'var(--accent-400)', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)' },
          ].map((stat, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '1rem',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '14px', padding: '1rem 1.25rem',
              transition: 'background 0.2s, transform 0.2s',
              cursor: 'default'
            }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
                background: stat.bg, border: `1px solid ${stat.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.15rem' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Filter + Search Bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          marginBottom: '1.5rem', flexShrink: 0
        }}>
          {/* Filter pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {[
              { id: 'all', label: 'All', icon: Filter },
              { id: 'top-rated', label: 'Top Rated', icon: Star },
              { id: 'recent', label: 'Recent', icon: Clock },
              { id: 'most-upvoted', label: 'Most Upvoted', icon: TrendingUp },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.55rem 1.1rem',
                  borderRadius: '10px',
                  fontSize: '0.82rem', fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: filter === f.id ? '1px solid rgba(100,102,241,0.5)' : '1px solid rgba(255,255,255,0.07)',
                  background: filter === f.id
                    ? 'linear-gradient(135deg, var(--brand-400), #9061ea)'
                    : 'rgba(255,255,255,0.03)',
                  color: filter === f.id ? '#fff' : 'var(--text-secondary)',
                  boxShadow: filter === f.id ? '0 4px 16px rgba(100,102,241,0.35)' : 'none',
                  transform: filter === f.id ? 'translateY(-1px)' : 'translateY(0)',
                  whiteSpace: 'nowrap' }}
                onMouseOver={(e) => { if (filter !== f.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#fff'; } }}
                onMouseOut={(e) => { if (filter !== f.id) { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
              >
                <f.icon size={13} />
                {f.label}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Search bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '0.6rem 1rem',
            minWidth: '240px',
            transition: 'all 0.2s ease' }}
            onFocus={() => { }}
          >
            <Search size={15} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search experts or solutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent', border: 'none',
                color: '#fff', fontSize: '0.85rem', outline: 'none',
                flex: 1, fontWeight: 500 }}
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', padding: 0 }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div
          className="solutions-grid"
          style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '0.375rem', paddingBottom: '1rem' }}
        >
          {experts.map((expert, index) => (
            <GlassCard
              key={expert.id}
              className={`solution-card-pro animate-scale-in ${expert.rank === 1 ? 'gold-card' : expert.rank === 2 ? 'silver-card' : expert.rank === 3 ? 'bronze-card' : ''}`}
              padding="md"
              style={{ animationDelay: `${index * 100}ms`, cursor: 'pointer' }}
              onClick={() => setSelectedExpert(expert)}
            >
              {/* Rank Badge */}
              {expert.rank <= 3 && (
                <div className="rank-badge" style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: expert.rank === 1 ? 'linear-gradient(135deg, #FFD700, #FFA500)' : expert.rank === 2 ? 'linear-gradient(135deg, #C0C0C0, #A8A8A8)' : 'linear-gradient(135deg, #CD7F32, #8B4513)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#fff',
                  boxShadow: `0 0 15px ${expert.rank === 1 ? 'rgba(255, 215, 0, 0.5)' : expert.rank === 2 ? 'rgba(192, 192, 192, 0.5)' : 'rgba(205, 127, 50, 0.5)'}`,
                  zIndex: 10
                }}>
                  {expert.rank}
                </div>
              )}

              {/* Header Section */}
              <div className="flex-enhanced flex-between" style={{ marginBottom: '0.75rem' }}>
                <div className="flex-enhanced">
                  <div className={`expert-avatar ${expert.avatarGradient}`} style={{
                    width: '42px', height: '42px', borderRadius: '0.7rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '1rem', color: '#fff',
                    marginRight: '0.65rem',
                    position: 'relative'
                  }}>
                    {expert.level === 'Elite' && (
                      <div style={{ position: 'absolute', top: '-3px', right: '-3px', background: 'var(--status-warning)', borderRadius: '50%', padding: '2px' }}>
                        <Crown size={7} fill="currentColor" style={{ color: '#fff' }} />
                      </div>
                    )}
                    {expert.avatar}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.1rem' }}>
                      <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>{expert.name}</h3>
                      {expert.level === 'Elite' && (
                        <span style={{ fontSize: '0.55rem', background: 'linear-gradient(135deg, #FFD700, #FFA500)', color: '#000', padding: '0.1rem 0.35rem', borderRadius: '0.25rem', fontWeight: 800, textTransform: 'uppercase' }}>Elite</span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{expert.role}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                      <Globe size={9} style={{ color: 'var(--text-tertiary)' }} />
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontWeight: 500 }}>{expert.location}</span>
                    </div>
                  </div>
                </div>
                {expert.isTopRated && (
                  <div className="top-badge" style={{ fontSize: '0.6rem', padding: '0.25rem 0.5rem' }}>
                    <Star size={9} fill="currentColor" /> TOP RATED
                  </div>
                )}
              </div>

              {/* Quick Stats Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.4rem', marginBottom: '0.75rem' }}>
                <div className="mini-stat">
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.1rem' }}>AI</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: expert.status === 'success' ? 'var(--status-success)' : 'var(--status-warning)' }}>{expert.aiConfidence}%</div>
                </div>
                <div className="mini-stat">
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.1rem' }}>Votes</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-primary)' }}>{upvotes[expert.id as keyof typeof upvotes]}</div>
                </div>
                <div className="mini-stat">
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.1rem' }}>Success</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--status-success)' }}>{expert.successRate}%</div>
                </div>
                <div className="mini-stat">
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.1rem' }}>Response</div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--brand-secondary)' }}>{expert.responseTime}</div>
                </div>
              </div>

              {/* Achievements */}
              <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {expert.achievements.slice(0, 2).map((achievement: string, i: number) => (
                  <span key={i} style={{
                    fontSize: '0.6rem',
                    background: 'rgba(99, 102, 241, 0.12)',
                    color: 'var(--brand-primary)',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '0.3rem',
                    fontWeight: 600,
                    border: '1px solid rgba(99, 102, 241, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}>
                    <Medal size={7} /> {achievement}
                  </span>
                ))}
                {expert.achievements.length > 2 && (
                  <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>+{expert.achievements.length - 2} more</span>
                )}
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <h4 style={{
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  <div style={{ width: '5px', height: '5px', background: expert.status === 'success' ? 'var(--brand-primary)' : 'var(--status-warning)', borderRadius: '2px', transform: 'rotate(45deg)', boxShadow: expert.status === 'success' ? '0 0 8px var(--brand-glow)' : '0 0 8px rgba(245,158,11,0.5)' }}></div>
                  Solution Steps
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {expert.steps.map((step: string, stepIndex: number) => (
                    <div key={stepIndex} className="action-item-pro" style={{ padding: '0.5rem', fontSize: '0.75rem', borderBottom: stepIndex < expert.steps.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <CheckCircle size={12} style={{ color: 'var(--status-success)', flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-enhanced spacing-md" style={{ marginTop: '1rem' }}>
                <button
                  onClick={() => setUpvotes(prev => ({ ...prev, [expert.id]: prev[expert.id as keyof typeof upvotes] + 1 }))}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '0.6rem', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  <TrendingUp size={12} /> Upvote
                </button>
                <button className="btn btn-gradient" style={{ flex: 1.5, padding: '0.5rem', borderRadius: '0.6rem', fontSize: '0.75rem', fontWeight: 800 }}>
                  <Award size={12} /> Select
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </>
  );
}
