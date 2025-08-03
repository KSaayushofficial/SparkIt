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
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "alarm" | "reminder" | "success";
  timestamp: Date;
}
