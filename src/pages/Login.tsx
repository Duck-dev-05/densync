import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Users, Zap, Factory, Shield, ArrowRight, Globe } from 'lucide-react';

const demoUsers = [
  {
    user_id: 'op1',
    name: 'Tanaka Hiroshi',
    role: 'factory_operator' as const,
    factory_location: 'Gunma Plant',
    icon: Factory,
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Monitors equipment and receives automatic solution suggestions'
  },
  {
    user_id: 'op2',
    name: 'Nguyen Van A',
    role: 'factory_operator' as const,
    factory_location: 'Hải Phòng',
    icon: Factory,
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Monitors equipment and receives automatic solution suggestions'
  },
  {
    user_id: 'op3',
    name: 'Somchai B',
    role: 'factory_operator' as const,
    factory_location: 'Bangkok Assembly',
    icon: Factory,
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-500',
    description: 'Monitors equipment and receives automatic solution suggestions'
  },
  {
    user_id: 'exp1',
    name: 'Dr. Kenji Tanaka',
    role: 'factory_expert' as const,
    factory_location: 'Gunma Plant',
    icon: Users,
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Analyzes errors and creates solutions'
  },
  {
    user_id: 'exp2',
    name: 'Nguyen Thi Mai',
    role: 'factory_expert' as const,
    factory_location: 'Hải Phòng',
    icon: Users,
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-pink-500',
    description: 'Analyzes errors and creates solutions'
  },
  {
    user_id: 'admin1',
    name: 'Marcus Chen',
    role: 'system_admin' as const,
    factory_location: 'Global Support',
    icon: Shield,
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-500',
    description: 'Manages platform and coordinates teams'
  }
];

export function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);

  const handleLogin = async (userId: string) => {
    setLoading(userId);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
    await login(userId);
    setLoading(null);
  };

  const groupedUsers = {
    'Factory Operators': { users: demoUsers.filter(u => u.role === 'factory_operator'), icon: Factory, color: '#3b82f6' },
    'Factory Experts': { users: demoUsers.filter(u => u.role === 'factory_expert'), icon: Users, color: '#8b5cf6' },
    'System Administrators': { users: demoUsers.filter(u => u.role === 'system_admin'), icon: Shield, color: '#f59e0b' }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(ellipse at 30% 20%, rgba(99,102,241,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
        animation: 'pulse 8s ease-in-out infinite'
      }} />

      <div style={{
        maxWidth: '1000px',
        width: '100%',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3.5rem'
        }}>
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: '0 0 50px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
          }}>
            <Zap size={36} color="#fff" fill="#fff" />
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '0.75rem',
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            DenSync
          </h1>
          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 500,
            letterSpacing: '0.02em'
          }}>
            Factory Intelligence Platform
          </p>
        </div>

        {/* User Cards */}
        {Object.entries(groupedUsers).map(([groupName, group]) => {
          const GroupIcon = group.icon;
          return (
            <div key={groupName} style={{ marginBottom: '2.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem',
                paddingLeft: '0.5rem'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: `${group.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <GroupIcon size={18} color={group.color} />
                </div>
                <h2 style={{
                  fontSize: '1rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.6)'
                }}>
                  {groupName}
                </h2>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem'
              }}>
                {group.users.map((user) => {
                  const Icon = user.icon;
                  const isHovered = hoveredUser === user.user_id;
                  const isLoading = loading === user.user_id;

                  return (
                    <button
                      key={user.user_id}
                      onClick={() => handleLogin(user.user_id)}
                      disabled={loading !== null}
                      onMouseEnter={() => setHoveredUser(user.user_id)}
                      onMouseLeave={() => setHoveredUser(null)}
                      style={{
                        padding: '1.5rem',
                        background: isHovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                        border: isHovered ? `1px solid ${user.color}40` : '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '20px',
                        cursor: loading === null ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        textAlign: 'left',
                        opacity: loading === null ? 1 : 0.5,
                        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
                        boxShadow: isHovered ? `0 8px 30px ${user.color}15` : 'none',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Gradient overlay on hover */}
                      {isHovered && (
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, ${user.color}08 0%, transparent 100%)`,
                          pointerEvents: 'none'
                        }} />
                      )}

                      <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          marginBottom: '1rem'
                        }}>
                          <div style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '14px',
                            background: `linear-gradient(135deg, ${user.color}, ${user.color}cc)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: `0 4px 20px ${user.color}30`
                          }}>
                            <Icon size={26} color="#fff" />
                          </div>
                          <div style={{ flex: 1, overflow: 'hidden' }}>
                            <div style={{
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: '#fff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginBottom: '0.25rem'
                            }}>
                              {user.name}
                            </div>
                            <div style={{
                              fontSize: '0.8rem',
                              color: 'rgba(255,255,255,0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem'
                            }}>
                              <Globe size={12} />
                              {user.factory_location}
                            </div>
                          </div>
                        </div>

                        <p style={{
                          fontSize: '0.8rem',
                          color: 'rgba(255,255,255,0.5)',
                          lineHeight: 1.5,
                          marginBottom: '1rem'
                        }}>
                          {user.description}
                        </p>

                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: user.color,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '8px',
                            background: `${user.color}15`
                          }}>
                            {user.role.replace('_', ' ')}
                          </div>
                          {isLoading ? (
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              border: '2px solid rgba(255,255,255,0.2)',
                              borderTopColor: user.color,
                              animation: 'spin 0.8s linear infinite'
                            }} />
                          ) : (
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '10px',
                              background: `${user.color}20`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: isHovered ? 1 : 0.5,
                              transition: 'opacity 0.2s'
                            }}>
                              <ArrowRight size={16} color={user.color} />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Loading Text */}
        {loading && (
          <div style={{
            textAlign: 'center',
            marginTop: '2rem',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.9rem',
            fontWeight: 500
          }}>
            Authenticating...
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
