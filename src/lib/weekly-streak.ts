import type { GymSession } from "@/types/session";

export interface WeeklySessionSummary {
  weekStart: string;
  weekEnd: string;
  sessionCount: number;
  target: number;
  achieved: boolean;
  currentWeek: boolean;
}

export interface WeeklyStreakResult {
  currentStreak: number;
  longestStreak: number;
  completedWeeks: number;
  weeklySummaries: WeeklySessionSummary[];
}

function getStartOfWeek(date: Date) {
  const result = new Date(date);

  const day = result.getDay();

  const daysSinceMonday =
    day === 0 ? 6 : day - 1;

  result.setDate(
    result.getDate() - daysSinceMonday,
  );

  result.setHours(0, 0, 0, 0);

  return result;
}

function getEndOfWeek(weekStart: Date) {
  const result = new Date(weekStart);

  result.setDate(result.getDate() + 6);
  result.setHours(23, 59, 59, 999);

  return result;
}

function addWeeks(
  date: Date,
  numberOfWeeks: number,
) {
  const result = new Date(date);

  result.setDate(
    result.getDate() + numberOfWeeks * 7,
  );

  return result;
}

function isCompletedSession(
  session: GymSession,
) {
  return session.status === "completed";
}

function getSessionCountForWeek(
  sessions: GymSession[],
  weekStart: Date,
  weekEnd: Date,
) {
  return sessions.filter((session) => {
    if (!isCompletedSession(session)) {
      return false;
    }

    const sessionDate = new Date(
      session.startedAt,
    );

    return (
      sessionDate >= weekStart &&
      sessionDate <= weekEnd
    );
  }).length;
}

function calculateLongestStreak(
  summaries: WeeklySessionSummary[],
) {
  let longestStreak = 0;
  let runningStreak = 0;

  const chronologicalSummaries = [
    ...summaries,
  ].reverse();

  for (const summary of chronologicalSummaries) {
    if (summary.achieved) {
      runningStreak += 1;

      longestStreak = Math.max(
        longestStreak,
        runningStreak,
      );
    } else {
      runningStreak = 0;
    }
  }

  return longestStreak;
}

export function calculateWeeklyStreak(
  sessions: GymSession[],
  weeklyTarget: number,
  numberOfWeeks = 12,
): WeeklyStreakResult {
  const safeWeeklyTarget = Math.min(
    7,
    Math.max(2, Math.round(weeklyTarget)),
  );

  const currentDate = new Date();

  const currentWeekStart =
    getStartOfWeek(currentDate);

  const weeklySummaries =
    Array.from(
      {
        length: numberOfWeeks,
      },
      (_, index) => {
        const weekStart = addWeeks(
          currentWeekStart,
          -index,
        );

        const weekEnd =
          getEndOfWeek(weekStart);

        const sessionCount =
          getSessionCountForWeek(
            sessions,
            weekStart,
            weekEnd,
          );

        return {
          weekStart:
            weekStart.toISOString(),
          weekEnd: weekEnd.toISOString(),
          sessionCount,
          target: safeWeeklyTarget,
          achieved:
            sessionCount >= safeWeeklyTarget,
          currentWeek: index === 0,
        };
      },
    );

  let currentStreak = 0;

  const currentWeek =
    weeklySummaries[0];

  const completedWeekSummaries =
    currentWeek?.achieved
      ? weeklySummaries
      : weeklySummaries.slice(1);

  for (
    const summary of completedWeekSummaries
  ) {
    if (!summary.achieved) {
      break;
    }

    currentStreak += 1;
  }

  const completedWeeks =
    weeklySummaries.filter(
      (summary) => summary.achieved,
    ).length;

  const longestStreak =
    calculateLongestStreak(
      weeklySummaries,
    );

  return {
    currentStreak,
    longestStreak,
    completedWeeks,
    weeklySummaries,
  };
}

export function formatWeekRange(
  weekStartValue: string,
  weekEndValue: string,
) {
  const weekStart = new Date(
    weekStartValue,
  );

  const weekEnd = new Date(
    weekEndValue,
  );

  const startText =
    new Intl.DateTimeFormat("en-MY", {
      day: "numeric",
      month: "short",
    }).format(weekStart);

  const endText =
    new Intl.DateTimeFormat("en-MY", {
      day: "numeric",
      month: "short",
    }).format(weekEnd);

  return `${startText} - ${endText}`;
}