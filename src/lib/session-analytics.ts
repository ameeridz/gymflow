import {
  getLocalDateKey,
  getStartOfLocalWeek,
  isDateWithinLocalWeek,
  isSameLocalDate,
} from "@/lib/local-date";
import type { GymSession } from "@/types/session";

function isCompletedSession(
  session: GymSession,
) {
  return session.status === "completed";
}

export function getStartOfCurrentWeek() {
  return getStartOfLocalWeek();
}

export function getCompletedSessionsThisWeek(
  sessions: GymSession[],
) {
  return sessions.filter((session) => {
    return (
      isCompletedSession(session) &&
      isDateWithinLocalWeek(session.startedAt)
    );
  });
}

export function getUniqueTrainingDateKeys(
  sessions: GymSession[],
) {
  const dateKeys = new Set<string>();

  for (const session of sessions) {
    if (!isCompletedSession(session)) {
      continue;
    }

    dateKeys.add(
      getLocalDateKey(session.startedAt),
    );
  }

  return [...dateKeys].sort();
}

export function getTrainingDaysThisWeek(
  sessions: GymSession[],
) {
  return getUniqueTrainingDateKeys(
    getCompletedSessionsThisWeek(sessions),
  );
}

export function getTrainingDayCountThisWeek(
  sessions: GymSession[],
) {
  return getTrainingDaysThisWeek(sessions)
    .length;
}

export function getCompletedSessionsToday(
  sessions: GymSession[],
) {
  const currentDate = new Date();

  return sessions.filter((session) => {
    return (
      isCompletedSession(session) &&
      isSameLocalDate(
        session.startedAt,
        currentDate,
      )
    );
  });
}

export function hasCompletedSessionToday(
  sessions: GymSession[],
) {
  return (
    getCompletedSessionsToday(sessions).length > 0
  );
}

export function hasCompletedSessionOnDate(
  sessions: GymSession[],
  dateValue: Date | string,
) {
  return sessions.some((session) => {
    return (
      isCompletedSession(session) &&
      isSameLocalDate(
        session.startedAt,
        dateValue,
      )
    );
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

  const hours = Math.floor(
    totalMinutes / 60,
  );
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }

  return `${totalMinutes} min`;
}
