import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle, Scan, CheckCircle,
  BrainCircuit, Zap, Clock, TrendingUp, Eye, Upload,
  Cpu, Star, ChevronRight, BookOpen, Layers,
  RefreshCw, Download
} from 'lucide-react';
import { GlassCard } from '../components/ui';

const Typewriter = ({ text, delay = 0, speed = 20 }: { text: string, delay?: number, speed?: number }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let timeoutId: number;
    let intervalId: number;
    timeoutId = window.setTimeout(() => {
      let i = 0;
      intervalId = window.setInterval(() => {
        setDisplayed(text.substring(0, i + 1));
        i++;
        if (i >= text.length) window.clearInterval(intervalId);
      }, speed);
    }, delay);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [text, delay, speed]);
  return (
    <>{displayed}{displayed.length < text.length && <span style={{ opacity: 0.6, animation: 'pulse 1s infinite', marginLeft: '2px' }}>▋</span>}</>
  );
};

const recentSessions: any[] = [];

const aiInsights: any[] = [];

export function AiMentor() {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [analysisSteps, setAnalysisSteps] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'steps' | 'insights' | 'history'>('steps');

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResult, setAiResult] = useState<{ caption?: string, objects?: { bboxes: number[][], labels: string[] } } | null>(null);
  const [focusedBox, setFocusedBox] = useState<number[] | null>(null);
  const [isVideoMedia, setIsVideoMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const analyzeCurrentFrame = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");
      try {
        const res = await fetch("http://localhost:8000/api/analyze", {
          method: "POST",
          body: formData });
        const data = await res.json();
        setAiResult(data);
        setAnalysisSteps(prev => prev < 3 ? prev + 1 : prev);
      } catch (err) {
        console.error("Frame analysis failed. Is the backend running?", err);
      }
    }, 'image/jpeg', 0.8);
  };

  useEffect(() => {
    let intervalId: number;
    if (videoPlaying && !uploadedImage && !isProcessing) {
      // Analyze immediately, then every 5 seconds
      analyzeCurrentFrame();
      intervalId = window.setInterval(analyzeCurrentFrame, 5000);
    } else if (!videoPlaying) {
      setAnalysisSteps(0);
    }
    return () => clearInterval(intervalId);
  }, [videoPlaying, uploadedImage, isProcessing]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsVideoMedia(file.type.startsWith('video/'));

    const reader = new FileReader();
    reader.onload = (e) => setUploadedImage(e.target?.result as string);
    reader.readAsDataURL(file);

    setIsProcessing(true);
    setAnalysisSteps(0);
    setVideoPlaying(true);
    setAiResult(null);
    setFocusedBox(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/analyze", {
        method: "POST",
        body: formData });
      const data = await res.json();
      setAiResult(data);
      setAnalysisSteps(1);
      setTimeout(() => setAnalysisSteps(2), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to connect to Python backend. Ensure it is running on port 8000.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="tab-content animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg,rgba(14,165,233,0.2),rgba(14,165,233,0.04))', border: '1px solid rgba(14,165,233,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(14,165,233,0.2)' }}>
            <BrainCircuit size={22} style={{ color: 'var(--accent-400)' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-400)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Visual Demo · AI-Powered</div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>AI Action Mentor</h1>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*,video/*" onChange={handleFileUpload} />
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '0.5rem 1rem', color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
            <Upload size={14} /> Upload Media
          </button>
          <button 
            onClick={() => {
              setUploadedImage(null);
              setAiResult(null);
              setAnalysisSteps(0);
              setFocusedBox(null);
              setIsVideoMedia(false);
              setVideoPlaying(false);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'linear-gradient(135deg,var(--accent-400),var(--brand-400))', border: 'none', borderRadius: '10px', padding: '0.5rem 1.1rem', color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(14,165,233,0.35)' }}
          >
            <Zap size={14} /> New Session
          </button>
        </div>
      </div>

      {/* ── Insight Stats Row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', flexShrink: 0 }}>
        {aiInsights.map((ins, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '14px', padding: '1rem 1.25rem',
            transition: 'transform 0.2s, background 0.2s', cursor: 'default'
          }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: ins.bg, border: `1px solid ${ins.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ins.icon size={18} style={{ color: ins.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>{ins.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{ins.value}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success-400)' }}>{ins.delta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', flex: 1, minHeight: 0 }}>

        {/* ── Left: Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div
            style={{
              flex: 1, borderRadius: '16px', overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)', background: '#030408',
              boxShadow: videoPlaying ? '0 20px 50px rgba(0,0,0,0.7)' : '0 8px 24px rgba(0,0,0,0.4)',
              display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.3s' }}
          >


            {/* Canvas */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.07, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--brand-400) 3px)', pointerEvents: 'none' }} />

              {!uploadedImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ textAlign: 'center', padding: '3rem', zIndex: 2, cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'rgba(100,102,241,0.12)', border: '2px solid rgba(100,102,241,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem', boxShadow: '0 0 30px rgba(100,102,241,0.2)' }}>
                    <Upload size={36} style={{ color: 'var(--brand-400)' }} />
                  </div>
                  <h3 style={{ color: '#fff', fontSize: '1.4rem', marginBottom: '0.5rem', fontWeight: 800 }}>Upload Media for Analysis</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Select an image or video to process with the AI</p>
                </div>
              ) : (
                <>
                  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
                    <div className="map-scanline" style={{ position: 'absolute', inset: 0, height: '15%', background: 'linear-gradient(to bottom, transparent, rgba(100,102,241,0.22), transparent)', boxShadow: 'none' }} />
                  </div>
                  <div style={{
                    position: 'absolute', inset: 0,
                    transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    transform: focusedBox ? 'scale(2.5)' : 'scale(1)',
                    transformOrigin: focusedBox ? `${(focusedBox[0] + focusedBox[2]) / 20}% ${(focusedBox[1] + focusedBox[3]) / 20}%` : 'center center'
                  }}>
                    {isVideoMedia ? (
                      <video src={uploadedImage} ref={videoRef} autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 1, position: 'absolute' }} />
                    ) : (
                      <img src={uploadedImage} alt="Uploaded" style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 1, position: 'absolute' }} />
                    )}

                    {aiResult?.objects && aiResult.objects.bboxes.map((box, idx) => (
                      <div key={idx} className="anim-scale-in" style={{
                        position: 'absolute',
                        top: `${(box[1] / 1000) * 100}%`,
                        left: `${(box[0] / 1000) * 100}%`,
                        width: `${((box[3] - box[0]) / 1000) * 100}%`,
                        height: `${((box[2] - box[1]) / 1000) * 100}%`,
                        border: '2px solid var(--brand-400)',
                        boxShadow: '0 0 16px var(--brand-glow)',
                        borderRadius: '4px',
                        zIndex: 2,
                        opacity: focusedBox ? (focusedBox === box ? 1 : 0.1) : 1,
                        transition: 'opacity 0.3s'
                      }}>
                        <div style={{ position: 'absolute', top: '-24px', left: '-2px', background: 'var(--brand-400)', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px 4px 4px 0', whiteSpace: 'nowrap' }}>
                          {aiResult.objects?.labels[idx]}
                        </div>
                        <div style={{ position: 'absolute', top: 2, right: 2, width: '6px', height: '6px', background: 'var(--brand-400)', borderRadius: '50%', boxShadow: '0 0 8px var(--brand-glow)' }} />
                      </div>
                    ))}
                  </div>

                  {analysisSteps >= 2 && (
                    <div className="anim-fade-in" style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(100,102,241,0.3)', borderRadius: '10px', padding: '0.5rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 3 }}>
                      <Cpu size={13} style={{ color: 'var(--brand-400)' }} />
                      <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: 700 }}>AI Analysis Complete</span>
                    </div>
                  )}
                </>
              )}
            </div>


          </div>
        </div>

        {/* ── Right: Analysis Panel ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: 0 }}>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '0.3rem', flexShrink: 0 }}>
            {([
              { id: 'steps', label: 'AI Steps', icon: Layers },
              { id: 'insights', label: 'Insights', icon: Eye },
              { id: 'history', label: 'Sessions', icon: Clock },
            ] as const).map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                padding: '0.5rem', borderRadius: '9px', border: 'none', cursor: 'pointer',
                fontSize: '0.78rem', fontWeight: 700,
                background: activeTab === tab.id ? 'rgba(255,255,255,0.07)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-tertiary)',
                transition: 'all 0.2s',
                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.3)' : 'none' }}>
                <tab.icon size={13} />{tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: 0 }}>

            {activeTab === 'steps' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginBottom: '0.25rem' }}>
                  <BrainCircuit size={18} style={{ color: 'var(--accent-400)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Segmented Steps</span>
                  {videoPlaying && analysisSteps > 0 && (
                    <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-400)', background: 'rgba(100,102,241,0.1)', padding: '0.2rem 0.5rem', borderRadius: '6px', border: '1px solid rgba(100,102,241,0.2)' }}>
                      {analysisSteps}/3 detected
                    </span>
                  )}
                </div>

                {analysisSteps === 0 && !videoPlaying && (
                  <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', border: '1px dashed rgba(255,255,255,0.07)', borderRadius: '14px', background: 'rgba(255,255,255,0.01)' }}>
                    <BrainCircuit size={40} style={{ opacity: 0.15 }} />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.35rem' }}>No active analysis</div>
                      <div style={{ fontSize: '0.8rem' }}>Click the video to start AI extraction</div>
                    </div>
                  </div>
                )}

                {analysisSteps === 0 && videoPlaying && (
                  <GlassCard className="anim-fade-in" padding="md" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', borderLeft: '3px solid var(--brand-400)', background: 'linear-gradient(90deg, var(--brand-50) 0%, var(--bg-layer2) 100%)' }}>
                    <svg className="animate-spin" style={{ width: '22px', height: '22px', color: 'var(--brand-400)', flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" opacity="0.75" />
                    </svg>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#fff' }}>Processing video feed and extracting knowledge...</span>
                  </GlassCard>
                )}

                {aiResult && analysisSteps >= 1 && (
                  <div className="anim-fade-up" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid var(--brand-400)', borderRadius: '12px', padding: '1rem 1.1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <div style={{ background: 'var(--brand-400)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '5px', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>VISION ANALYSIS</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--success-400)', fontWeight: 700 }}>AI Success</span>
                        <CheckCircle size={15} style={{ color: 'var(--success-400)' }} />
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginBottom: '0.5rem', minHeight: '1.2rem' }}>
                      <Typewriter text={aiResult.caption || "Analyzing scene..."} delay={200} speed={20} />
                    </div>
                  </div>
                )}

                {aiResult && analysisSteps >= 2 && (aiResult.objects?.labels?.length ?? 0) > 0 && (
                  <div className="anim-fade-up" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid var(--brand-500)', borderRadius: '12px', padding: '1rem 1.1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <div style={{ background: 'var(--brand-500)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '5px', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>OBJECT DETECTION</div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {Array.from(new Set(aiResult.objects?.labels || [])).map((label, i) => {
                        const boxIdx = aiResult.objects!.labels.indexOf(label);
                        const box = aiResult.objects!.bboxes[boxIdx];
                        const isFocused = focusedBox === box;
                        return (
                          <button 
                            key={i} 
                            onClick={() => setFocusedBox(isFocused ? null : box)}
                            style={{ 
                              display: 'flex', alignItems: 'center', gap: '0.4rem', 
                              background: isFocused ? 'rgba(100,102,241,0.2)' : 'rgba(255,255,255,0.04)', 
                              border: isFocused ? '1px solid rgba(100,102,241,0.5)' : '1px solid transparent',
                              padding: '0.4rem 0.6rem', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', outline: 'none'
                            }}
                          >
                            <Scan size={12} style={{ color: isFocused ? '#fff' : 'var(--accent-400)' }} />
                            <span style={{ fontSize: '0.78rem', color: isFocused ? '#fff' : 'var(--text-secondary)' }}>
                              <strong style={{ color: '#fff', textTransform: 'capitalize' }}><Typewriter text={label as string} delay={800 + i * 150} speed={25} /></strong>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!aiResult && analysisSteps >= 1 && (
                  <div className="anim-fade-up" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid var(--brand-400)', borderRadius: '12px', padding: '1rem 1.1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <div style={{ background: 'var(--brand-400)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '5px', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>0:05 – 0:12</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--success-400)', fontWeight: 700 }}>98% match</span>
                        <CheckCircle size={15} style={{ color: 'var(--success-400)' }} />
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginBottom: '0.5rem', minHeight: '1.2rem' }}>
                      <Typewriter text="Check clearance using feeler gauge" delay={200} speed={25} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', padding: '0.4rem 0.6rem', borderRadius: '8px' }}>
                      <Scan size={12} style={{ color: 'var(--accent-400)' }} />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Detected tool: <strong style={{ color: '#fff' }}><Typewriter text="Standard 0.15 mm gauge" delay={1200} speed={25} /></strong></span>
                    </div>
                  </div>
                )}

                {!aiResult && analysisSteps >= 2 && (
                  <div className="anim-fade-up" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '3px solid var(--brand-500)', borderRadius: '12px', padding: '1rem 1.1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <div style={{ background: 'var(--brand-500)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '5px', fontSize: '0.65rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>0:15 – 0:25</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--success-400)', fontWeight: 700 }}>95% match</span>
                        <CheckCircle size={15} style={{ color: 'var(--success-400)' }} />
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff', marginBottom: '0.5rem', minHeight: '1.2rem' }}>
                      <Typewriter text="Adjust tension screw by 45 degrees" delay={200} speed={25} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.04)', padding: '0.4rem 0.6rem', borderRadius: '8px' }}>
                      <Scan size={12} style={{ color: 'var(--accent-400)' }} />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Rotation angle: <strong style={{ color: '#fff' }}><Typewriter text="45° ± 2° measured" delay={1200} speed={30} /></strong></span>
                    </div>
                  </div>
                )}

                {!aiResult && analysisSteps >= 3 && (
                  <div className="anim-fade-up" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '1rem 1.1rem', display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                    <div style={{ background: 'var(--warning-400)', padding: '0.5rem', borderRadius: '10px', boxShadow: '0 0 14px rgba(245,158,11,0.4)', flexShrink: 0 }}>
                      <AlertTriangle size={20} style={{ color: '#fff' }} />
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--warning-400)', marginBottom: '0.35rem', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <Typewriter text="Safety Violation Detected" delay={200} speed={25} />
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0, minHeight: '2.6rem' }}>
                        <Typewriter text="Expert is not wearing protective gloves. Ensure PPE compliance before replicating this procedure." delay={1000} speed={15} />
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'insights' && (
              <>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginBottom: '0.25rem' }}>
                  <TrendingUp size={16} style={{ color: 'var(--brand-400)' }} /> Performance Insights
                </div>
                {[
                  { label: 'Tool Recognition', value: 94, color: 'var(--brand-400)', desc: 'Identified 12 unique tools across sessions' },
                  { label: 'Motion Compliance', value: 87, color: 'var(--success-400)', desc: 'Matches expert reference motions' },
                  { label: 'Safety Adherence', value: 72, color: 'var(--warning-400)', desc: '2 PPE violations flagged in recent session' },
                  { label: 'Procedure Accuracy', value: 91, color: 'var(--accent-400)', desc: 'Step sequence matches SOP standard' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1rem 1.1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{item.label}</span>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: item.color }}>{item.value}%</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', marginBottom: '0.6rem', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.value}%`, background: item.color, borderRadius: '99px', boxShadow: `0 0 8px ${item.color}` }} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{item.desc}</div>
                  </div>
                ))}
                <div style={{ background: 'rgba(100,102,241,0.05)', border: '1px solid rgba(100,102,241,0.15)', borderRadius: '12px', padding: '1rem 1.1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <BookOpen size={15} style={{ color: 'var(--brand-400)' }} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>AI Recommendations</span>
                  </div>
                  {['Review PPE compliance in step 3 workflow', 'Calibrate feeler gauge detection threshold', 'Add secondary torque verification step'].map((rec, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: i < 2 ? '0.6rem' : 0 }}>
                      <ChevronRight size={13} style={{ color: 'var(--brand-400)', marginTop: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{rec}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'history' && (
              <>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginBottom: '0.25rem' }}>
                  <Clock size={16} style={{ color: 'var(--brand-400)' }} /> Recent Sessions
                </div>
                {recentSessions.map((session) => (
                  <div key={session.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '1rem 1.1rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.1)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)'; }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>{session.title}</div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '5px', background: session.status === 'complete' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: session.status === 'complete' ? 'var(--success-400)' : 'var(--warning-400)', border: `1px solid ${session.status === 'complete' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`, textTransform: 'uppercase' }}>
                        {session.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Star size={11} /> {session.expert}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={11} /> {session.date}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.6rem' }}>
                      {[
                        { label: `${session.steps} steps`, color: 'var(--brand-400)', bg: 'rgba(100,102,241,0.08)' },
                        { label: `${session.duration} video`, color: 'var(--accent-400)', bg: 'rgba(14,165,233,0.08)' },
                        { label: `${session.confidence}% AI`, color: 'var(--success-400)', bg: 'rgba(16,185,129,0.08)' },
                      ].map((tag, i) => (
                        <span key={i} style={{ fontSize: '0.7rem', fontWeight: 700, color: tag.color, background: tag.bg, padding: '0.15rem 0.55rem', borderRadius: '5px' }}>{tag.label}</span>
                      ))}
                    </div>
                  </div>
                ))}
                <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '12px', color: 'var(--text-tertiary)', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                >
                  <RefreshCw size={13} /> Load More Sessions
                </button>
              </>
            )}
          </div>

          {/* Export CTA */}
          {activeTab === 'steps' && analysisSteps >= 3 && (
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', width: '100%', padding: '0.9rem', background: 'linear-gradient(135deg, var(--brand-400), #9061ea)', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 6px 20px rgba(100,102,241,0.4)', transition: 'all 0.2s', flexShrink: 0 }}>
              <Download size={16} /> Export AI Knowledge Base
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

