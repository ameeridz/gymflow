export type RestDayReason =
  | "scheduled"
  | "recovery"
  | "poor-sleep"
  | "busy"
  | "unwell"
  | "other";

export interface RestDay {
  id: string;
  date: string;
  reason: RestDayReason;
  note: string;
  createdAt: string;
}