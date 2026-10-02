import { ShieldAlert, ArrowLeft } from 'lucide-react';
import type { UserRole } from '../contexts/AuthContext';
import { ROLE_LABELS, getPageTitle } from '../access/rbac';

interface AccessDeniedProps {
  pageId: string;
  allowedRoles: readonly UserRole[];
  userRole: UserRole;
  onBack: () => void;
}

/**
 * 403-style screen shown when a user tries to open a page
 * their role is not allowed to access.
 */
export function AccessDenied({ pageId, allowedRoles, userRole, onBack }: AccessDeniedProps) {
  const pageTitle = getPageTitle(pageId);
  const allowedLabel = allowedRoles.map(r => ROLE_LABELS[r]).join(' or ');

  return (
    <div
      className="tab-content animate-slide-up"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '20px',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 32px rgba(239,68,68,0.15)',
        }}
      >
        <ShieldAlert size={32} style={{ color: '#ef4444' }} />
      </div>

      <div
        style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          color: '#ef4444',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
        }}
      >
        403 — Access Restricted
      </div>

      <h1
        style={{
          margin: 0,
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#fff',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          maxWidth: '480px',
        }}
      >
        You don't have permission to view this page
      </h1>

      <p
        style={{
          margin: 0,
          maxWidth: '460px',
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}
      >
        The <strong style={{ color: '#fff' }}>{pageTitle}</strong> page is restricted to{' '}
        <strong style={{ color: '#818cf8' }}>{allowedLabel}</strong>{' '}
        {allowedRoles.length > 1 ? 'roles' : 'role'}. You are currently signed in as{' '}
        <strong style={{ color: '#fff' }}>{ROLE_LABELS[userRole]}</strong>.
      </p>

      <button
        onClick={onBack}
        style={{
          marginTop: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.7rem 1.5rem',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          border: 'none',
          color: '#fff',
          fontSize: '0.85rem',
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
        }}
        onMouseOver={e => {
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.5)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.35)';
        }}
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>
    </div>
  );
}
