export type ActivityType =
  | "strength"
  | "cardio"
  | "mixed"
  | "mobility"
  | "quick";

export type SessionMood =
  | "tough"
  | "okay"
  | "great";

export type SessionStatus =
  | "active"
  | "completed"
  | "cancelled";

export interface GymSession {
  id: string;
  activityType: ActivityType;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  mood: SessionMood | null;
  note: string;
  status: SessionStatus;
}
