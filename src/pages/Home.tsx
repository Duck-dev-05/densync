
const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);
const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
);

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

export function Home({ setActiveTab }: HomeProps) {
  return (
    <div className="tab-content animate-slide-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Hero Section */}
      <div style={{ padding: '4rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden', borderRadius: '1.25rem', marginBottom: '2rem', border: '1px solid var(--border-subtle)', background: 'radial-gradient(ellipse at top, rgba(56, 189, 248, 0.15) 0%, rgba(13, 20, 36, 0.8) 70%)' }}>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            DenSync Intelligence Core
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
            Global synchronization of factory telemetry, AI-driven root cause analysis, and community expert knowledge base.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={() => setActiveTab('sim')} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Launch Monitoring
            </button>
            <button className="btn btn-outline" onClick={() => setActiveTab('knowledge')} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Access Knowledge Base
            </button>
          </div>
        </div>

        {/* Decorative Grid Background for Hero */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px', zIndex: 1, opacity: 0.5, transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)' }}></div>
      </div>

      {/* Feature Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', flex: 1 }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('sim')}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)' }}>
            <GlobeIcon />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.75rem' }}>Global Sync</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>Real-time telemetry and anomaly detection across all registered manufacturing facilities worldwide.</p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem', cursor: 'pointer', borderColor: 'rgba(16, 185, 129, 0.3)' }} onClick={() => setActiveTab('solutions')}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--status-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}>
            <ShieldIcon />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.75rem' }}>Expert Ranking</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>Crowdsourced root cause analysis peer-reviewed by top engineers to establish the highest confidence fixes.</p>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.5rem 1.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('ai')}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(192, 132, 252, 0.1)', color: 'var(--brand-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(192, 132, 252, 0.2)' }}>
            <ZapIcon />
          </div>
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '0.75rem' }}>AI Action Mentor</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>Machine learning models that extract physical action steps from expert repair videos for instant training.</p>
        </div>
      </div>
    </div>
  );
}
