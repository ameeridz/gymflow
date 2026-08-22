import {
  getEndOfLocalWeek,
  getLocalDateKey,
  getStartOfLocalWeek,
} from "@/lib/local-date";
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

function getTrainingDayCountForWeek(
  sessions: GymSession[],
  weekStart: Date,
  weekEnd: Date,
) {
  const trainingDateKeys = new Set<string>();

  for (const session of sessions) {
    if (!isCompletedSession(session)) {
      continue;
    }

    const sessionDate = new Date(
      session.startedAt,
    );

    if (
      sessionDate < weekStart ||
      sessionDate > weekEnd
    ) {
      continue;
    }

    trainingDateKeys.add(
      getLocalDateKey(sessionDate),
    );
  }

  return trainingDateKeys.size;
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

  const currentWeekStart =
    getStartOfLocalWeek();

  const weeklySummaries = Array.from(
    { length: numberOfWeeks },
    (_, index) => {
      const weekStart = addWeeks(
        currentWeekStart,
        -index,
      );
      const weekEnd =
        getEndOfLocalWeek(weekStart);
      const trainingDayCount =
        getTrainingDayCountForWeek(
          sessions,
          weekStart,
          weekEnd,
        );

      return {
        weekStart: weekStart.toISOString(),
        weekEnd: weekEnd.toISOString(),
        sessionCount: trainingDayCount,
        target: safeWeeklyTarget,
        achieved:
          trainingDayCount >= safeWeeklyTarget,
        currentWeek: index === 0,
      };
    },
  );

  let currentStreak = 0;
  const currentWeek = weeklySummaries[0];
  const streakEligibleSummaries =
    currentWeek?.achieved
      ? weeklySummaries
      : weeklySummaries.slice(1);

  for (const summary of streakEligibleSummaries) {
    if (!summary.achieved) {
      break;
    }

    currentStreak += 1;
  }

  const completedWeeks =
    weeklySummaries.filter(
      (summary) => summary.achieved,
    ).length;

  return {
    currentStreak,
    longestStreak:
      calculateLongestStreak(
        weeklySummaries,
      ),
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
