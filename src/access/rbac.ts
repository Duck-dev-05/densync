import type { UserRole } from '../contexts/AuthContext';

/**
 * Role-Based Access Control (RBAC) for page navigation.
 *
 * Single source of truth: which roles may open which pages.
 * Consumed by:
 *   - App.tsx       -> page guard + Access Denied (403) screen
 *   - Sidebar.tsx   -> hides links the current role cannot use
 *
 * Access matrix:
 *
 *   Page (id)         Label                 Operator  Expert  Admin
 *   ----------------- --------------------- --------- ------- -----
 *   live              Live Camera Grid         x        x      x
 *   sim               Factory Monitor          x        x      x
 *   work-orders       Maintenance Kanban       x        x      x
 *   submit            Submit Root Cause        x        x      x
 *   task-detail       Task Detail              x        x      x
 *   solution-detail   Solution Details         x        x      x
 *   diagnostics       Threat Diagnostics       x        x      x
 *   ai                AI Video Mentor          x        x      x
 *   knowledge         Global Knowledge         x        x      x
 *   solutions         Expert Ranking           x        x      x
 *   notifications     Notifications            x        x      x
 *   settings          Settings                 x        x      x
 *   analytics         Analytics                -        x      x
 *   ai-management     Model Management         -        x      x
 *   my-solutions      My Solutions             -        x      x
 *   devices           Device Manager           -        -      x
 */

/** Human-readable role names. */
export const ROLE_LABELS: Record<UserRole, string> = {
  factory_operator: 'Factory Operator',
  factory_expert: 'Factory Expert',
  system_admin: 'System Administrator',
};

/** Human-readable page titles (used on the Access Denied screen). */
const PAGE_TITLES: Record<string, string> = {
  'live': 'Live Camera Grid',
  'sim': 'Factory Monitor',
  'work-orders': 'Maintenance Kanban',
  'submit': 'Submit Root Cause',
  'task-detail': 'Task Detail',
  'diagnostics': 'Threat Diagnostics',
  'ai': 'AI Video Mentor',
  'knowledge': 'Global Knowledge',
  'solutions': 'Expert Ranking',
  'notifications': 'Notifications',
  'settings': 'Settings',
  'solution-detail': 'Solution Details',
  'analytics': 'Analytics',
  'ai-management': 'Model Management',
  'my-solutions': 'My Solutions',
  'devices': 'Device Manager',
};

/** Pages every authenticated role can access (base tier). */
const BASE_PAGES: readonly string[] = [
  'live',
  'sim',
  'work-orders',
  'submit',
  'task-detail',
  'solution-detail',
  'diagnostics',
  'ai',
  'knowledge',
  'solutions',
  'notifications',
  'settings',
];

/** Factory Expert = base tier + solution/analysis tools. */
const EXPERT_PAGES: readonly string[] = [
  ...BASE_PAGES,
  'analytics',
  'ai-management',
  'my-solutions',
];

/** System Administrator = everything (expert tier + platform tools). */
const ADMIN_PAGES: readonly string[] = [
  ...EXPERT_PAGES,
  'devices',
];

/** RBAC role -> allowed page ids. */
const ROLE_PAGES: Record<UserRole, readonly string[]> = {
  factory_operator: BASE_PAGES,
  factory_expert: EXPERT_PAGES,
  system_admin: ADMIN_PAGES,
};

/** Every page id known to the RBAC table. */
const ALL_PAGES: ReadonlySet<string> = new Set(
  Object.values(ROLE_PAGES).flat()
);

/**
 * Returns true when the given role may access the given page.
 *
 * - Unknown page ids are allowed (they render the generic dashboard
 *   fallback in App.tsx and are not part of the RBAC table).
 * - Known pages require the role to be listed in ROLE_PAGES.
 */
export function canAccessPage(pageId: string, role: UserRole | null | undefined): boolean {
  if (!ALL_PAGES.has(pageId)) return true;
  if (!role) return false;
  return ROLE_PAGES[role].includes(pageId);
}

/**
 * Returns the roles allowed to access the given page,
 * or null when the page is unrestricted (available to every role).
 */
export function getAllowedRoles(pageId: string): readonly UserRole[] | null {
  if (!ALL_PAGES.has(pageId)) return null;
  const allRoles = Object.keys(ROLE_PAGES) as UserRole[];
  const roles = allRoles.filter(r => ROLE_PAGES[r].includes(pageId));
  return roles.length === allRoles.length ? null : roles;
}

/** Returns the human-readable title for a page id. */
export function getPageTitle(pageId: string): string {
  return PAGE_TITLES[pageId] ?? pageId;
}
