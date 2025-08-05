export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  priority: "low" | "medium" | "high";
  category: string;
  timer?: number;
  isTimerRunning?: boolean;
  alarmTime?: string;
  hasAlarm?: boolean;
  tags: string[];
  dueDate?: Date;
  estimatedTime?: number;
  alarm?: boolean; 
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  streak: number;
  bestStreak: number;
  frequency: "daily" | "weekly" | "monthly";
  difficulty: "easy" | "medium" | "hard";
  createdAt: Date;
  lastCompleted?: Date;
  completedDates: Date[];
  target: number;
  category: string;
  color: string;
  isCompleted: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  deadline: Date;
  category: string;
  priority: "low" | "medium" | "high";
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  color: string;
  pinned: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "alarm" | "reminder" | "success" | "warning" | "info";
  timestamp: Date;
}
