import { 
  ArrowLeft, Clock, MessageSquare, AlertTriangle, 
  CheckCircle2, Wrench, Camera, Play, Server } from 'lucide-react';
import { INITIAL_TASKS } from '../data/tasks';

export function TaskDetail({ id }: { id: string | null }) {
  const task = INITIAL_TASKS.find(t => t.id === id) || INITIAL_TASKS[0];
  const handleBack = () => {
    window.dispatchEvent(new CustomEvent('densync_navigate', { detail: { tab: 'work-orders' } }));
  };

  return (
    <div className="tab-content animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'hidden' }}>
      
      {/* Header / Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', flexShrink: 0 }}>
        <button onClick={handleBack} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }} onMouseOut={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}>
          <ArrowLeft size={18} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--brand-400)', background: 'rgba(56, 189, 248, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '4px' }}>{task.id}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: task.priority === 'critical' ? 'var(--danger-400)' : task.priority === 'high' ? 'var(--warning-400)' : 'var(--brand-400)', display: 'flex', alignItems: 'center', gap: '0.3rem', textTransform: 'uppercase' }}>
              {task.priority === 'critical' && <AlertTriangle size={12} />} {task.priority} Priority
            </span>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fff', background: 'var(--brand-500)', padding: '0.3rem 0.6rem', borderRadius: '4px', textTransform: 'capitalize' }}>{task.status.replace('-', ' ')}</span>
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            {task.title}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>
            Reassign
          </button>
          <button style={{ background: 'var(--success-500)', border: 'none', color: '#fff', padding: '0.6rem 1.5rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} /> Mark as Resolved
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', flex: 1, minHeight: 0 }}>
        
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto', paddingRight: '0.5rem' }} className="scroll-thin">
          
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wrench size={14} style={{ color: 'var(--brand-400)' }} /> Issue Description
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {task.desc}
            </p>
          </div>

          {task.priority === 'critical' || task.priority === 'high' ? (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}>
             <h3 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Camera size={14} style={{ color: 'var(--accent-400)' }} /> Attached Evidence & Logs
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <div style={{ height: '120px', background: `url(${task.id === 'WO-1045' ? '/test-defects/metal_pipe_leak.jpg' : '/test-defects/metal_gear_crack.jpg'}) center/cover`, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.8)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', color: '#fff' }}>CAM Snapshot</div>
              </div>
              <div style={{ height: '120px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                <Server size={20} style={{ marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.75rem' }}>syslog_dump.txt</span>
              </div>
              <div style={{ height: '120px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                 <Play size={20} style={{ marginBottom: '0.5rem' }} />
                <span style={{ fontSize: '0.75rem' }}>Pre-incident video</span>
              </div>
            </div>
          </div>
          ) : null}

          {/* Comments Section */}
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
             <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={14} style={{ color: 'var(--warning-400)' }} /> Activity & Comments
            </h3>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {task.comments > 0 ? (
                <>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {task.assignee ? (
                      <img src={task.assignee.avatar} style={{ width: 36, height: 36, borderRadius: '50%' }} alt={task.assignee.name} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{task.assignee ? task.assignee.name : 'Unknown'}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>1 hour ago</span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '0 12px 12px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        I've reviewed the issue. Proceeding with standard operating procedures.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                     <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--brand-500)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>SY</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>System Notification</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>2 hours ago</span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        Ticket automatically generated based on AI telemetry.
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', fontStyle: 'italic', padding: '1rem 0' }}>No activity yet.</div>
              )}
            </div>

            {/* Input */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <input type="text" placeholder="Add a comment..." style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem 1rem', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
              <button style={{ background: 'var(--brand-500)', border: 'none', color: '#fff', padding: '0 1.5rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Post</button>
            </div>
          </div>

        </div>

        {/* Sidebar Data */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '0.85rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Properties</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '0.3rem' }}>Assignee</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {task.assignee ? (
                    <>
                      <img src={task.assignee.avatar} style={{ width: 28, height: 28, borderRadius: '50%' }} alt={task.assignee.name} />
                      <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>{task.assignee.name}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Unassigned</span>
                  )}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '0.3rem' }}>Due Date</div>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={14} style={{ color: 'var(--text-tertiary)' }} /> {task.dueDate}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '0.3rem' }}>Factory Location</div>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                  {task.id === 'WO-1042' ? 'Gunma Assembly Line A' : 'Haiphong Sector 4'}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: '0.3rem' }}>Linked Asset</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--brand-400)', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
                  {task.id === 'WO-1042' ? 'CNC-SPINDLE-001' : 'SYS-NODE-88'}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
