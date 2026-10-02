import { useState } from 'react';
import { Shield, Users, Factory, Server, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

export function SystemAdminDashboard() {
  const [systemStats] = useState([
    { label: 'Total Users', value: '156', change: '+12', icon: Users, color: '#6366f1' },
    { label: 'Active Factories', value: '8', change: '+2', icon: Factory, color: '#10b981' },
    { label: 'System Health', value: '98%', change: '+2%', icon: Activity, color: '#f59e0b' },
    { label: 'Server Load', value: '34%', change: '-5%', icon: Server, color: '#3b82f6' },
  ]);

  const [recentAlerts] = useState([
    { id: 1, type: 'critical', message: 'Database connection timeout at Hải Phòng', time: '5 min ago' },
    { id: 2, type: 'warning', message: 'High memory usage on Gunma server', time: '30 min ago' },
    { id: 3, type: 'info', message: 'Scheduled maintenance completed', time: '2 hours ago' },
  ]);

  const [factoryStatus] = useState([
    { name: 'Gunma Plant', status: 'online', users: 45, uptime: '99.8%' },
    { name: 'Hải Phòng', status: 'online', users: 38, uptime: '99.5%' },
    { name: 'Bangkok Assembly', status: 'warning', users: 32, uptime: '98.2%' },
    { name: 'Berlin Stamping', status: 'online', users: 28, uptime: '99.9%' },
  ]);

  return (
    <div style={{ padding: '2rem', color: '#fff' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Shield size={32} color="#f59e0b" />
          System Administrator Dashboard
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem' }}>
          Manage platform deployment and coordinate across factory locations
        </p>
      </div>

      {/* System Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {systemStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              style={{
                padding: '1.5rem',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: `${stat.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={20} color={stat.color} />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>{stat.value}</div>
              <div style={{ fontSize: '0.85rem', color: stat.change.startsWith('+') ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                {stat.change} this week
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Recent Alerts */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={24} color="#f59e0b" />
            Recent Alerts
          </h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {recentAlerts.map(alert => (
              <div
                key={alert.id}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: alert.type === 'critical' ? 'rgba(239,68,68,0.1)' : 
                           alert.type === 'warning' ? 'rgba(245,158,11,0.1)' : 
                           'rgba(59,130,246,0.1)',
                  border: `1px solid ${alert.type === 'critical' ? 'rgba(239,68,68,0.3)' : 
                                   alert.type === 'warning' ? 'rgba(245,158,11,0.3)' : 
                                   'rgba(59,130,246,0.3)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: alert.type === 'critical' ? 'rgba(239,68,68,0.2)' : 
                           alert.type === 'warning' ? 'rgba(245,158,11,0.2)' : 
                           'rgba(59,130,246,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {alert.type === 'critical' ? <AlertTriangle size={16} color="#ef4444" /> :
                   alert.type === 'warning' ? <AlertTriangle size={16} color="#f59e0b" /> :
                   <CheckCircle size={16} color="#3b82f6" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>{alert.message}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{alert.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Factory Status */}
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Factory size={24} color="#10b981" />
            Factory Status
          </h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {factoryStatus.map((factory, index) => (
              <div
                key={index}
                style={{
                  padding: '1rem',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: factory.status === 'online' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {factory.status === 'online' ? <CheckCircle size={16} color="#10b981" /> : <AlertTriangle size={16} color="#f59e0b" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.15rem' }}>{factory.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>
                    {factory.users} users • {factory.uptime} uptime
                  </div>
                </div>
                <div style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  background: factory.status === 'online' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                  color: factory.status === 'online' ? '#10b981' : '#f59e0b',
                  textTransform: 'capitalize'
                }}>
                  {factory.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
