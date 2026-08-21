"use client";

import {
  Clock3,
  Dumbbell,
  Flame,
  Gauge,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

import { WeeklyStreakCard } from "@/components/progress/weekly-streak-card";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  formatAnalyticsDuration,
  getAverageDurationSeconds,
  getCompletedSessionsThisWeek,
  getTotalDurationSeconds,
} from "@/lib/session-analytics";
import { calculateWeeklyStreak } from "@/lib/weekly-streak";
import { useSessionStore } from "@/stores/session-store";
import { useSettingsStore } from "@/stores/settings-store";

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
  const router = useRouter();

  const completedSessions = useSessionStore(
    (state) => state.completedSessions,
  );

  const weeklyTarget = useSettingsStore(
    (state) => state.weeklyTarget,
  );

  const sessionsThisWeek =
    getCompletedSessionsThisWeek(
      completedSessions,
    );

  const totalDuration =
    getTotalDurationSeconds(
      completedSessions,
    );

  const averageDuration =
    getAverageDurationSeconds(
      completedSessions,
    );

  const streakResult =
    calculateWeeklyStreak(
      completedSessions,
      weeklyTarget,
    );

  const weeklyProgress = Math.min(
    100,
    (sessionsThisWeek.length / weeklyTarget) *
      100,
  );

  const weeklyGoalReached =
    sessionsThisWeek.length >= weeklyTarget;

  const remainingSessions = Math.max(
    0,
    weeklyTarget - sessionsThisWeek.length,
  );

  const goalMessage = weeklyGoalReached
    ? sessionsThisWeek.length === weeklyTarget
      ? "Weekly goal achieved. Keep the momentum going."
      : `Weekly goal exceeded by ${
          sessionsThisWeek.length -
          weeklyTarget
        } session${
          sessionsThisWeek.length -
            weeklyTarget ===
          1
            ? ""
            : "s"
        }.`
    : `${remainingSessions} more session${
        remainingSessions === 1 ? "" : "s"
      } to reach your goal.`;

  const progressItems = [
    {
      label: "This week",
      value: `${sessionsThisWeek.length} / ${weeklyTarget}`,
      description: weeklyGoalReached
        ? "Weekly goal achieved."
        : `${remainingSessions} more to reach your goal.`,
      icon: Target,
    },
    {
      label: "Total sessions",
      value: String(completedSessions.length),
      description:
        "Completed sessions across your history.",
      icon: Dumbbell,
    },
    {
      label: "Total gym time",
      value:
        formatAnalyticsDuration(
          totalDuration,
        ),
      description:
        "Time across all completed sessions.",
      icon: Clock3,
    },
    {
      label: "Average session",
      value:
        formatAnalyticsDuration(
          averageDuration,
        ),
      description:
        "Average completed-session duration.",
      icon: Gauge,
    },
  ];

  function handleCheckIn() {
    router.push("/?checkin=true");
  }

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
              Progress is built by returning, not by
              being perfect.
            </p>
          </div>

          <ThemeToggle />
        </header>

        {completedSessions.length === 0 ? (
          <section className="mt-10 overflow-hidden rounded-[2rem] border border-dashed border-violet-300 bg-white p-6 text-center shadow-sm dark:border-violet-500/30 dark:bg-zinc-900 sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-600 shadow-lg shadow-violet-600/10 dark:bg-violet-500/15 dark:text-violet-400">
              <Sparkles size={28} />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
              Start building consistency
            </p>

            <h2 className="mx-auto mt-2 max-w-lg text-2xl font-black tracking-tight sm:text-3xl">
              Your progress starts here
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400 sm:text-base sm:leading-7">
              Complete your first session to unlock
              weekly goals, workout analytics and
              consistency streaks.
            </p>

            <div className="mx-auto mt-7 grid max-w-md gap-3 text-left sm:grid-cols-3">
              <div className="rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-800">
                <Target
                  size={19}
                  className="text-violet-600 dark:text-violet-400"
                />

                <p className="mt-3 text-sm font-bold">
                  Weekly goals
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-800">
                <Gauge
                  size={19}
                  className="text-violet-600 dark:text-violet-400"
                />

                <p className="mt-3 text-sm font-bold">
                  Workout analytics
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-800">
                <Flame
                  size={19}
                  className="text-orange-500"
                />

                <p className="mt-3 text-sm font-bold">
                  Weekly streaks
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckIn}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.98]"
            >
              <Dumbbell size={19} />
              Check In Now
            </button>
          </section>
        ) : (
          <div className="mt-8 flex flex-col lg:mt-10">
            <div className="order-1 lg:order-3">
              <WeeklyStreakCard
                streakResult={streakResult}
              />
            </div>

            <section className="order-2 mt-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-violet-600 to-fuchsia-600 p-5 text-white shadow-2xl shadow-violet-600/20 sm:p-7 lg:order-1 lg:mt-0 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:h-12 sm:w-12">
                    {weeklyGoalReached ? (
                      <Flame size={22} />
                    ) : (
                      <TrendingUp size={22} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-100 sm:text-sm sm:tracking-[0.2em]">
                      Weekly goal
                    </p>

                    <h2 className="mt-1 text-3xl font-black sm:mt-2 sm:text-4xl">
                      {sessionsThisWeek.length} /{" "}
                      {weeklyTarget}
                    </h2>
                  </div>
                </div>

                <span className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold sm:px-4 sm:py-2">
                  {Math.round(weeklyProgress)}%
                </span>
              </div>

              <p className="mt-4 text-sm leading-6 text-violet-100 sm:text-base">
                {goalMessage}
              </p>

              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/15 sm:mt-7 sm:h-3">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500"
                  style={{
                    width: `${weeklyProgress}%`,
                  }}
                />
              </div>
            </section>

            <section className="order-3 mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:order-2 lg:grid-cols-4">
              {progressItems.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.label}
                    className="min-w-0 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-5 lg:p-6"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400 sm:h-11 sm:w-11 lg:h-12 lg:w-12">
                      <Icon
                        size={20}
                        className="lg:h-[22px] lg:w-[22px]"
                      />
                    </div>

                    <p className="mt-4 truncate text-xs font-semibold text-zinc-500 dark:text-zinc-400 sm:text-sm lg:mt-6">
                      {item.label}
                    </p>

                    <p className="mt-1 break-words text-2xl font-black tracking-tight sm:text-3xl">
                      {item.value}
                    </p>

                    <p className="mt-3 hidden text-sm leading-6 text-zinc-500 dark:text-zinc-400 lg:block">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}