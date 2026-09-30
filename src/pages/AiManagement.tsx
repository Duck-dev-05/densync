import { useState, useEffect  } from "react";
import { 
  Server, Database, Check, X,
  Crosshair, BrainCircuit, LineChart } from 'lucide-react';

export function AiManagement() {
  const [queue, setQueue] = useState<any[]>([]);
  const [gpuUsage, setGpuUsage] = useState(0);
  const [vram, setVram] = useState(0);
  const [totalVram, setTotalVram] = useState(0);
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    const fetchAiData = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/analytics/ai');
        const data = await res.json();
        if (data.status === 'success') {
          setQueue(data.data.queue);
          setGpuUsage(data.data.gpu_usage);
          setVram(data.data.vram);
          setTotalVram(data.data.total_vram);
          setLatency(data.data.latency);
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchAiData();
    const interval = setInterval(fetchAiData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    // Optimistic UI update
    setQueue(prev => prev.filter(q => q.task_id !== id));
    
    try {
      await fetch(`http://localhost:8000/api/analytics/ai/queue/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: action === 'approve' ? 'approved' : 'rejected' })
      });
    } catch (err) {
      console.error("Failed to post action", err);
    }
  };

  return (
    <div className="tab-content animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'hidden' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--brand-400)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <BrainCircuit size={10} /> Core AI Systems
          </div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Model Management
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success-400)', boxShadow: '0 0 10px var(--success-400)' }} />
            <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>Qwen2-VL-72B (Online)</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        
        {/* Left Column: System Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', paddingRight: '4px' }} className="scroll-thin">
          
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Server size={14} style={{ color: 'var(--brand-400)' }} /> Compute Cluster
            </h3>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>GPU Utilization</span>
                <span style={{ fontSize: '0.8rem', color: gpuUsage > 90 ? 'var(--danger-400)' : '#fff', fontWeight: 700 }}>{(gpuUsage || 0).toFixed(1)}%</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${gpuUsage || 0}%`, background: gpuUsage > 90 ? 'var(--danger-400)' : 'var(--brand-400)', transition: 'width 1s ease' }} />
              </div>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>VRAM Allocation</span>
                <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>{(vram || 0).toFixed(1)} / {(totalVram || 0).toFixed(0)} GB</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${totalVram > 0 ? ((vram || 0) / totalVram) * 100 : 0}%`, background: 'var(--accent-400)', transition: 'width 1s ease' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Inference Latency</span>
                <span style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 700 }}>{(latency || 0).toFixed(0)} ms</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${((latency || 0) / 120) * 100}%`, background: 'var(--success-400)', transition: 'width 1s ease' }} />
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '1.25rem' }}>
             <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={14} style={{ color: 'var(--accent-400)' }} /> Training Corpus
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Total Datasets</span>
                <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 600 }}>14</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Annotated Frames</span>
                <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 600 }}>1,240,592</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pending Review</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--warning-400)', fontWeight: 600 }}>{queue.length} items</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Analytics & HITL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '4px' }} className="scroll-thin">
          
          {/* Performance Chart Placeholder */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', height: '240px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LineChart size={14} style={{ color: 'var(--success-400)' }} /> Model Confidence Trend (30 Days)
            </h3>
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '4px', marginTop: '1rem' }}>
              {Array.from({ length: 30 }).map((_, i) => {
                const height = 60 + Math.random() * 35;
                return (
                  <div key={i} style={{ flex: 1, background: `linear-gradient(0deg, rgba(16,185,129,0.2) 0%, rgba(16,185,129,0.8) 100%)`, height: `${height}%`, borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
                )
              })}
            </div>
          </div>

          {/* Human-in-the-Loop Queue */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Crosshair size={14} style={{ color: 'var(--warning-400)' }} /> Human-in-the-Loop (Active Learning)
              </h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                {queue.length} items require review
              </span>
            </div>

            {queue.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 0', color: 'var(--text-tertiary)' }}>
                <Check size={32} style={{ color: 'var(--success-400)', opacity: 0.5, marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.85rem' }}>All uncertain predictions reviewed!</span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {queue.map(item => (
                  <div key={item.task_id} style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{ height: '140px', backgroundImage: `url(${item.image_src})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '10%', left: '20%', width: '40%', height: '50%', border: '2px dashed var(--warning-400)', background: 'rgba(245,158,11,0.1)' }} />
                      <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.8)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', color: '#fff', fontWeight: 600 }}>
                        {item.date_str}
                      </div>
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>AI Prediction</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 700 }}>{item.prediction}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--warning-400)', fontWeight: 800 }}>{item.confidence}% Conf</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleAction(item.task_id, 'approve')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--success-400)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(16,185,129,0.25)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(16,185,129,0.15)'}>
                          <Check size={14} /> Correct
                        </button>
                        <button onClick={() => handleAction(item.task_id, 'reject')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--danger-400)', padding: '0.5rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'} onMouseOut={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}>
                          <X size={14} /> Re-classify
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
