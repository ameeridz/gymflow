import type { GymSession } from "@/types/session";

export function getStartOfCurrentWeek() {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();

  const daysSinceMonday =
    currentDay === 0 ? 6 : currentDay - 1;

  const monday = new Date(currentDate);

  monday.setDate(
    currentDate.getDate() - daysSinceMonday,
  );

  monday.setHours(0, 0, 0, 0);

  return monday;
}

export function getCompletedSessionsThisWeek(
  sessions: GymSession[],
) {
  const startOfWeek = getStartOfCurrentWeek();

  return sessions.filter((session) => {
    if (session.status !== "completed") {
      return false;
    }

    const sessionDate = new Date(session.startedAt);

    return sessionDate >= startOfWeek;
  });
}

export function getTotalDurationSeconds(
  sessions: GymSession[],
) {
  return sessions.reduce(
    (total, session) =>
      total + (session.durationSeconds ?? 0),
    0,
  );
}

export function getAverageDurationSeconds(
  sessions: GymSession[],
) {
  if (sessions.length === 0) {
    return 0;
  }

  return Math.floor(
    getTotalDurationSeconds(sessions) /
      sessions.length,
  );
}

export function formatAnalyticsDuration(
  totalSeconds: number,
) {
  if (totalSeconds < 60) {
    return `${totalSeconds} sec`;
  }

  const totalMinutes = Math.floor(
    totalSeconds / 60,
  );

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }

  return `${totalMinutes} min`;
}
