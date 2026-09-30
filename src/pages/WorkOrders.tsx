import React, { useState } from 'react';
import { 
  Plus, MoreHorizontal, Clock, MessageSquare, AlertTriangle, Wrench, Search, Filter } from 'lucide-react';

import { Task, INITIAL_TASKS } from '../data/tasks';

export function WorkOrders() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const columns = [
    { id: 'backlog', label: 'Backlog', color: 'var(--text-tertiary)' },
    { id: 'in-progress', label: 'In Progress', color: 'var(--brand-400)' },
    { id: 'review', label: 'Under Review', color: 'var(--warning-400)' },
    { id: 'completed', label: 'Completed', color: 'var(--success-400)' }
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = 'move';
    // Small delay to allow the drag image to generate before we hide the original
    setTimeout(() => {
      const el = document.getElementById(`task-${id}`);
      if (el) el.style.opacity = '0.4';
    }, 0);
  };

  const handleDragEnd = (_e: React.DragEvent, id: string) => {
    setDraggedTaskId(null);
    const el = document.getElementById(`task-${id}`);
    if (el) el.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    if (draggedTaskId) {
      setTasks(prev => prev.map(t => t.id === draggedTaskId ? { ...t, status } : t));
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'critical': return 'var(--danger-400)';
      case 'high': return 'var(--warning-400)';
      case 'medium': return 'var(--brand-400)';
      default: return 'var(--text-tertiary)';
    }
  };

  return (
    <div className="tab-content animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflow: 'hidden' }}>
      
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--brand-400)', textTransform: 'uppercase', letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Wrench size={10} /> Maintenance Operations
          </div>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
            Work Orders Kanban
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input 
              type="text" 
              placeholder="Search WO or tags..." 
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '10px', color: '#fff', fontSize: '0.8rem', width: '220px', outline: 'none' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem 1rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            <Filter size={14} /> Filter
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--brand-500)', border: 'none', color: '#fff', padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
            <Plus size={16} /> New Work Order
          </button>
        </div>
      </div>

      {/* ── Kanban Board ── */}
      <div style={{ display: 'flex', gap: '1.25rem', flex: 1, minHeight: 0, overflowX: 'auto', paddingBottom: '1rem' }} className="scroll-thin">
        {columns.map(col => (
          <div 
            key={col.id}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id as Task['status'])}
            style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', padding: '1rem' }}
          >
            {/* Column Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.color }} />
                {col.label}
                <span style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </h3>
              <button style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}><MoreHorizontal size={16} /></button>
            </div>

            {/* Task Cards Container */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }} className="scroll-thin">
              {tasks.filter(t => t.status === col.id).map(task => (
                <div
                  key={task.id}
                  id={`task-${task.id}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  onDragEnd={(e) => handleDragEnd(e, task.id)}
                  onClick={() => window.dispatchEvent(new CustomEvent('densync_navigate', { detail: { tab: 'task-detail', id: task.id } }))}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'grab',
                    transition: 'transform 0.1s, box-shadow 0.1s',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Priority indicator line */}
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: getPriorityColor(task.priority) }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{task.id}</span>
                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: getPriorityColor(task.priority), textTransform: 'uppercase' }}>
                      {task.priority === 'critical' ? <span style={{display: 'flex', alignItems: 'center', gap: '2px'}}><AlertTriangle size={10}/> Critical</span> : task.priority}
                    </span>
                  </div>
                  
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#fff', fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.4 }}>{task.title}</h4>
                  <p style={{ margin: '0 0 1.25rem 0', color: 'var(--text-tertiary)', fontSize: '0.75rem', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.desc}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                    
                    {/* Assignee */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {task.assignee ? (
                        <>
                          <img src={task.assignee.avatar} alt={task.assignee.name} style={{ width: '24px', height: '24px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{task.assignee.name}</span>
                        </>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)', cursor: 'pointer' }}>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Unassigned</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--text-tertiary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem' }}>
                        <Clock size={12} /> {task.dueDate}
                      </span>
                      {task.comments > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem' }}>
                          <MessageSquare size={12} /> {task.comments}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
