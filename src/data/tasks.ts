export interface Task {
  id: string;
  title: string;
  desc: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'backlog' | 'in-progress' | 'review' | 'completed';
  assignee: { name: string, avatar: string } | null;
  dueDate: string;
  comments: number;
}

export const INITIAL_TASKS: Task[] = [
  {
    id: 'WO-1042',
    title: 'Replace CNC Spindle Bearing (Alpha)',
    desc: 'Linked to #ERR-502. Spindle overheating detected. Requires immediate replacement to prevent total failure.',
    priority: 'critical',
    status: 'in-progress',
    assignee: { name: 'Tanaka K.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
    dueDate: 'Today, 14:00',
    comments: 3
  },
  {
    id: 'WO-1045',
    title: 'Investigate Hydraulic Pressure Drop',
    desc: 'Linked to #ERR-882. Unprecedented pressure drop in robotic arm hydraulic line. Inspect seals and valves.',
    priority: 'high',
    status: 'backlog',
    assignee: null,
    dueDate: 'Tomorrow',
    comments: 0
  },
  {
    id: 'WO-1038',
    title: 'Routine Conveyor Belt Lubrication',
    desc: 'Line A conveyor system requires standard monthly lubrication.',
    priority: 'low',
    status: 'backlog',
    assignee: { name: 'Sarah M.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
    dueDate: 'Next Week',
    comments: 1
  },
  {
    id: 'WO-1041',
    title: 'Validate AI Vision Calibration (Cam-4)',
    desc: 'Quality inspection camera reporting high false-positive rate. Recalibrate lens and update confidence thresholds.',
    priority: 'medium',
    status: 'review',
    assignee: { name: 'Alex C.', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' },
    dueDate: 'Today',
    comments: 5
  },
  {
    id: 'WO-1031',
    title: 'Update Firmware on Edge Node 02',
    desc: 'Roll out v4.2.1 patch to resolve intermittent latency spikes.',
    priority: 'medium',
    status: 'completed',
    assignee: { name: 'David L.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
    dueDate: 'Yesterday',
    comments: 2
  }
];
