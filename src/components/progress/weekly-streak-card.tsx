"use client";

import {
  Award,
  Check,
  Flame,
  Trophy,
} from "lucide-react";

import {
  formatWeekRange,
  type WeeklyStreakResult,
} from "@/lib/weekly-streak";

interface WeeklyStreakCardProps {
  streakResult: WeeklyStreakResult;
}

export function WeeklyStreakCard({
  streakResult,
}: WeeklyStreakCardProps) {
  const {
    currentStreak,
    longestStreak,
    completedWeeks,
    weeklySummaries,
  } = streakResult;

  const recentWeeks =
    weeklySummaries.slice(0, 4);

  const streakMessage =
    currentStreak === 0
      ? "Complete your weekly goal to begin a consistency streak."
      : currentStreak === 1
        ? "Your consistency streak has started."
        : `You have achieved your weekly goal for ${currentStreak} consecutive weeks.`;

  return (
    <section className="mt-0 grid gap-4 lg:mt-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <article className="overflow-hidden rounded-[2rem] border border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 shadow-sm dark:border-orange-500/20 dark:from-orange-500/10 dark:via-zinc-900 dark:to-amber-500/10 sm:p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 sm:h-12 sm:w-12">
            <Flame size={23} />
          </div>

          <span className="rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
            Weekly streak
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between gap-4 lg:mt-7 lg:block">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 sm:text-sm sm:normal-case sm:tracking-normal">
              Current streak
            </p>

            <div className="mt-1 flex items-end gap-2">
              <p className="text-4xl font-black tracking-tight text-orange-600 dark:text-orange-400 sm:text-5xl">
                {currentStreak}
              </p>

              <p className="pb-1 text-base font-bold text-zinc-600 dark:text-zinc-300 sm:text-lg">
                {currentStreak === 1
                  ? "week"
                  : "weeks"}
              </p>
            </div>
          </div>

          {currentStreak > 0 ? (
            <div className="flex h-10 items-center rounded-full bg-orange-100 px-3 text-xs font-bold text-orange-700 dark:bg-orange-500/15 dark:text-orange-300 lg:hidden">
              Keep going
            </div>
          ) : null}
        </div>

        <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:mt-4">
          {streakMessage}
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:mt-7">
          <div className="rounded-2xl bg-white/80 p-3 dark:bg-zinc-950/40 sm:p-4">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Trophy
                size={16}
                className="shrink-0"
              />

              <p className="truncate text-xs font-semibold sm:text-sm">
                Longest streak
              </p>
            </div>

            <p className="mt-2 text-xl font-black sm:text-2xl">
              {longestStreak}{" "}
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 sm:text-sm">
                {longestStreak === 1
                  ? "week"
                  : "weeks"}
              </span>
            </p>
          </div>

          <div className="rounded-2xl bg-white/80 p-3 dark:bg-zinc-950/40 sm:p-4">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
              <Award
                size={16}
                className="shrink-0"
              />

              <p className="truncate text-xs font-semibold sm:text-sm">
                Goals achieved
              </p>
            </div>

            <p className="mt-2 text-xl font-black sm:text-2xl">
              {completedWeeks}{" "}
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 sm:text-sm">
                {completedWeeks === 1
                  ? "week"
                  : "weeks"}
              </span>
            </p>
          </div>
        </div>
      </article>

      <article className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6 lg:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 sm:text-sm">
              Recent weeks
            </p>

            <h2 className="mt-1 text-xl font-black tracking-tight sm:mt-2 sm:text-2xl">
              Consistency history
            </h2>

            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400 sm:mt-2 sm:text-sm sm:leading-6">
              Weekly goals run from Monday to Sunday.
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2 lg:mt-6 lg:grid-cols-1 lg:gap-3">
          {recentWeeks.map((summary, index) => {
            const weekLabel = summary.currentWeek
              ? "This week"
              : index === 1
                ? "Last week"
                : `${index} weeks ago`;

            return (
              <div
                key={summary.weekStart}
                className="flex min-w-0 items-center justify-between gap-3 rounded-2xl bg-zinc-100 px-4 py-3 dark:bg-zinc-800 sm:p-4"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold sm:text-base">
                    {weekLabel}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400 sm:mt-1">
                    {formatWeekRange(
                      summary.weekStart,
                      summary.weekEnd,
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                  <p className="text-sm font-black">
                    {summary.sessionCount} /{" "}
                    {summary.target}
                  </p>

                  <div
                    aria-label={
                      summary.achieved
                        ? "Weekly goal achieved"
                        : "Weekly goal not achieved"
                    }
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      summary.achieved
                        ? "bg-emerald-500 text-white"
                        : "bg-zinc-200 text-zinc-400 dark:bg-zinc-700 dark:text-zinc-500"
                    }`}
                  >
                    {summary.achieved ? (
                      <Check size={16} />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-current" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </article>
    </section>
  );
}