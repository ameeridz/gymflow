"use client";

import {
  Clock3,
  Dumbbell,
  Flame,
  Gauge,
  Target,
  TrendingUp,
} from "lucide-react";
import { useSyncExternalStore } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import {
  formatAnalyticsDuration,
  getAverageDurationSeconds,
  getCompletedSessionsThisWeek,
  getTotalDurationSeconds,
} from "@/lib/session-analytics";
import { useSessionStore } from "@/stores/session-store";

const weeklyTarget = 3;

function subscribe() {
  return () => {};
}

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export default function ProgressPage() {
  const mounted = useMounted();

  const completedSessions = useSessionStore(
    (state) => state.completedSessions,
  );

  const sessionsThisWeek =
    getCompletedSessionsThisWeek(completedSessions);

  const totalDuration =
    getTotalDurationSeconds(completedSessions);

  const averageDuration =
    getAverageDurationSeconds(completedSessions);

  const weeklyProgress = Math.min(
    100,
    (sessionsThisWeek.length / weeklyTarget) * 100,
  );

  const weeklyGoalReached =
    sessionsThisWeek.length >= weeklyTarget;

  const progressItems = [
    {
      label: "Sessions this week",
      value: `${sessionsThisWeek.length} / ${weeklyTarget}`,
      description: weeklyGoalReached
        ? "Your weekly goal has been achieved."
        : `${Math.max(
            0,
            weeklyTarget - sessionsThisWeek.length,
          )} more to reach your weekly goal.`,
      icon: Target,
    },
    {
      label: "Total sessions",
      value: String(completedSessions.length),
      description:
        "Every completed session contributes to consistency.",
      icon: Dumbbell,
    },
    {
      label: "Total gym time",
      value: formatAnalyticsDuration(totalDuration),
      description:
        "Total time across all completed sessions.",
      icon: Clock3,
    },
    {
      label: "Average session",
      value: formatAnalyticsDuration(averageDuration),
      description:
        "Average duration across completed sessions.",
      icon: Gauge,
    },
  ];

  if (!mounted) {
    return (
      <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto min-h-96 max-w-6xl animate-pulse rounded-3xl bg-zinc-200 dark:bg-zinc-900" />
      </main>
    );
  }

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Consistency
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Your progress
            </h1>

            <p className="mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">
              Progress is built by returning, not by being
              perfect.
            </p>
          </div>

          <ThemeToggle />
        </header>

        <section className="mt-10 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-2xl shadow-violet-600/20 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                {weeklyGoalReached ? (
                  <Flame size={23} />
                ) : (
                  <TrendingUp size={23} />
                )}
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-violet-100">
                Weekly goal
              </p>

              <h2 className="mt-2 text-4xl font-black">
                {sessionsThisWeek.length} / {weeklyTarget}
              </h2>

              <p className="mt-3 text-violet-100">
                {weeklyGoalReached
                  ? "Weekly goal achieved. Keep the momentum going."
                  : `${Math.max(
                      0,
                      weeklyTarget -
                        sessionsThisWeek.length,
                    )} more session${
                      weeklyTarget -
                        sessionsThisWeek.length ===
                      1
                        ? ""
                        : "s"
                    } to reach your goal.`}
              </p>
            </div>

            <span className="w-fit rounded-full bg-white/15 px-4 py-2 text-sm font-bold">
              {Math.round(weeklyProgress)}%
            </span>
          </div>

          <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{
                width: `${weeklyProgress}%`,
              }}
            />
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {progressItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                  <Icon size={22} />
                </div>

                <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
                  {item.label}
                </p>

                <p className="mt-1 text-3xl font-black">
                  {item.value}
                </p>

                <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {item.description}
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}