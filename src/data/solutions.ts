export interface SolutionStep {
  title: string;
  detail: string;
}

export interface Solution {
  id: string;
  /** Numeric id when the solution comes from the backend API. */
  apiId?: number;
  title: string;
  summary: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  equipment: string;
  relatedError: string;
  /** Factory this solution applies to; undefined/null = every factory. */
  factory?: string | null;
  confidence: number;
  estimatedTime: string;
  lastVerified: string;
  author: { name: string; role: string };
  uses: number;
  rating: number;
  steps: SolutionStep[];
  warnings: string[];
  tools: string[];
}

export const SOLUTIONS: Solution[] = [
  {
    id: 'SOL-001',
    title: 'Conveyor Belt Jam',
    summary: 'Immediate intervention to clear a stalled conveyor and safely restart the line without damaging the drive assembly.',
    severity: 'high',
    equipment: 'Conveyor Belt #3 — Line A',
    relatedError: '#ERR-101',
    confidence: 95,
    estimatedTime: '10–15 min',
    lastVerified: 'Oct 12, 2025',
    author: { name: 'Dr. Kenji Tanaka', role: 'Senior Diagnostics Eng' },
    uses: 42,
    rating: 4.9,
    steps: [
      {
        title: 'Stop conveyor',
        detail: 'Press the E-stop on control panel CP-3 and wait for all belt motion to come to a complete halt. Confirm the drive motor indicator is off before proceeding.',
      },
      {
        title: 'Clear debris',
        detail: 'Inspect the full belt path for jammed material. Wearing cut-resistant gloves, remove debris from between the rollers and belt seams. Check that the belt is still tracked correctly on both ends.',
      },
      {
        title: 'Restart system',
        detail: 'Release the E-stop, reset the overload breaker, and restart at reduced speed. Observe one full cycle for unusual noise or slipping, then return the line to normal throughput.',
      },
    ],
    warnings: [
      'Lock out / tag out the panel before reaching into the belt path.',
      'Do not restart if the belt is misaligned — re-track it first to prevent edge damage.',
      'If the jam recurs twice, stop and escalate to a Factory Expert: a sensor fault may be the root cause.',
    ],
    tools: ['Cut-resistant gloves', 'Lockout / tagout kit', 'Inspection flashlight'],
  },
  {
    id: 'SOL-002',
    title: 'Motor Overheating',
    summary: 'Stabilize motor temperature by restoring airflow and shedding load, preventing thermal damage to the windings.',
    severity: 'critical',
    equipment: 'Main Drive Motor M-7 — Assembly Line B',
    relatedError: '#ERR-233',
    confidence: 88,
    estimatedTime: '15–20 min',
    lastVerified: 'Sep 28, 2025',
    author: { name: 'Nguyen Thi Mai', role: 'Lead Robotics Tech' },
    uses: 37,
    rating: 4.7,
    steps: [
      {
        title: 'Check ventilation',
        detail: 'Confirm the cooling fan spins freely and that intake filters are not clogged with dust. Clean filters with compressed air and verify there is at least 30 cm clearance around the housing.',
      },
      {
        title: 'Reduce load',
        detail: 'Lower the operating load below 80% of rated capacity — shed non-critical consumers on the line and switch the drive to the reduced-speed profile.',
      },
      {
        title: 'Monitor temp',
        detail: 'Watch the temperature sensor for 15 minutes. Reading must fall below 75 °C and keep trending down before resuming full production.',
      },
    ],
    warnings: [
      'If temperature exceeds 110 °C or you smell burning, emergency-stop and isolate power immediately.',
      'Never block the fan opening with guards or material during the reset.',
      'A repeat overheating event within 24 h indicates bearing wear — escalate instead of re-applying this solution.',
    ],
    tools: ['IR thermometer', 'Compressed air can', 'Thermal camera (optional)'],
  },
];

export function getSolutionById(id: string | null): Solution {
  return SOLUTIONS.find(s => s.id === id) ?? runtimeSolutions.get(id ?? '') ?? SOLUTIONS[0];
}

/** Solutions fetched from the API at runtime (matched for the current factory). */
const runtimeSolutions = new Map<string, Solution>();

export function registerSolution(solution: Solution): void {
  runtimeSolutions.set(solution.id, solution);
}

/** Normalizes an error code for comparison ('#ERR-101' == 'err-101'). */
export function normalizeErrorCode(code?: string): string {
  return (code ?? '').trim().toUpperCase().replace(/^#/, '');
}

/** Maps a backend solution payload (see backend/routers/solutions.py) to the UI model. */
export function toSolutionFromApi(raw: any): Solution {
  return {
    id: `SOL-API-${raw.id}`,
    apiId: raw.id,
    title: raw.title,
    summary: raw.summary ?? '',
    severity: (['low', 'medium', 'high', 'critical'].includes(raw.severity) ? raw.severity : 'medium'),
    equipment: raw.equipment ?? '',
    relatedError: raw.error_code ?? '',
    factory: raw.factory ?? null,
    confidence: raw.confidence ?? 0,
    estimatedTime: raw.estimated_time ?? '—',
    lastVerified: raw.created_at ? String(raw.created_at).slice(0, 10) : '—',
    author: { name: raw.author ?? 'Unknown', role: raw.author_role ?? 'Factory Expert' },
    uses: raw.uses ?? 0,
    rating: raw.rating ?? 0,
    steps: Array.isArray(raw.steps) ? raw.steps : [],
    warnings: Array.isArray(raw.warnings) ? raw.warnings : [],
    tools: Array.isArray(raw.tools) ? raw.tools : [],
  };
}
