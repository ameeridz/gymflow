"use client";

import { Dumbbell, Flame, Target } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { ActiveSessionCard } from "@/components/check-in/active-session-card";
import { CheckInDialog } from "@/components/check-in/check-in-dialog";
import { SessionCompletionSummary } from "@/components/check-in/session-completion-summary";
import { InstallGymFlowBanner } from "@/components/pwa/install-gymflow-banner";
import { LogRestDayDialog } from "@/components/rest-day/log-rest-day-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { TodayGreeting } from "@/components/today/today-greeting";
import { WeeklyTargetDialog } from "@/components/today/weekly-target-dialog";
import { getCompletedSessionsThisWeek } from "@/lib/session-analytics";
import { useRestDayStore } from "@/stores/rest-day-store";
import { useSessionStore } from "@/stores/session-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useToastStore } from "@/stores/toast-store";
import type { RestDayReason } from "@/types/rest-day";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const showToast = useToastStore((state) => state.showToast);
  const addRestDay = useRestDayStore((state) => state.addRestDay);
  const activeSession = useSessionStore((state) => state.activeSession);
  const completedSessions = useSessionStore(
    (state) => state.completedSessions,
  );
  const lastCompletedSession = useSessionStore(
    (state) => state.lastCompletedSession,
  );
  const dismissLastCompletedSession = useSessionStore(
    (state) => state.dismissLastCompletedSession,
  );
  const weeklyTarget = useSettingsStore((state) => state.weeklyTarget);
  const setWeeklyTarget = useSettingsStore(
    (state) => state.setWeeklyTarget,
  );

  const [checkInOpen, setCheckInOpen] = useState(() => {
    const requestedCheckIn = searchParams.get("checkin") === "true";
    return requestedCheckIn && activeSession === null;
  });
  const [weeklyTargetOpen, setWeeklyTargetOpen] = useState(false);
  const [restDayDialogOpen, setRestDayDialogOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("checkin") !== "true") return;
    router.replace("/", { scroll: false });
  }, [router, searchParams]);

  const sessionsThisWeek = getCompletedSessionsThisWeek(completedSessions);
  const completedThisWeek = sessionsThisWeek.length;
  const remainingSessions = Math.max(0, weeklyTarget - completedThisWeek);
  const weeklyProgress = Math.min(
    100,
    (completedThisWeek / weeklyTarget) * 100,
  );
  const weeklyMessage =
    completedThisWeek >= weeklyTarget
      ? completedThisWeek === weeklyTarget
        ? "Weekly goal achieved. Great work showing up."
        : `Weekly goal exceeded by ${completedThisWeek - weeklyTarget} session${
            completedThisWeek - weeklyTarget === 1 ? "" : "s"
          }.`
      : remainingSessions === 1
        ? "One more session to achieve your weekly target."
        : `${remainingSessions} more sessions to achieve your weekly target.`;

  function handleViewHistory() {
    dismissLastCompletedSession();
    router.push("/history");
  }

  function handleSaveWeeklyTarget(target: number) {
    setWeeklyTarget(target);
    setWeeklyTargetOpen(false);
    showToast({
      type: "success",
      title: "Weekly goal updated",
      description: `Your new target is ${target} sessions per week.`,
    });
  }

  function handleSaveRestDay(input: {
    date: string;
    reason: RestDayReason;
    note: string;
  }) {
    addRestDay(input);
    setRestDayDialogOpen(false);
    showToast({
      type: "success",
      title: "Rest day recorded",
      description:
        "Recovery supports consistency. This day will not count as a workout.",
    });
  }

  return (
    <>
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-6xl">
          <header className="flex items-center justify-between lg:justify-end">
            <div className="flex min-w-0 items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
                <Dumbbell size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-black tracking-tight">GymFlow</p>
                <a
                  href="https://ridzu.one"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Ridzjuan personal website"
                  className="block truncate text-xs text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                >
                  Build consistency with{" "}
                  <span className="font-bold text-violet-600 dark:text-violet-400">
                    Ridzjuan
                  </span>
                </a>
              </div>
            </div>
            <ThemeToggle />
          </header>

          <section className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="order-1">
              <TodayGreeting />
              <h1 className="mt-5 max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                {activeSession ? "You showed up." : "Ready to show up today?"}
              </h1>
              <p className="mt-3 max-w-lg text-base leading-7 text-zinc-600 dark:text-zinc-400">
                {activeSession
                  ? "Your session is active. Focus on moving and let GymFlow count the time."
                  : "You do not need the perfect workout. Start with a small commitment and protect the habit."}
              </p>
            </div>

            <div className="order-3 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20 lg:order-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    This week
                  </p>
                  <p className="mt-1 text-3xl font-black">
                    {completedThisWeek} / {weeklyTarget}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setWeeklyTargetOpen(true)}
                  aria-label="Configure weekly goal"
                  title="Edit weekly goal"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 transition hover:bg-violet-200 active:scale-95 dark:bg-violet-500/15 dark:text-violet-400 dark:hover:bg-violet-500/25"
                >
                  <Target size={23} />
                </button>
              </div>
              <div className="mt-6 h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-500"
                  style={{ width: `${weeklyProgress}%` }}
                />
              </div>
              <div className="mt-4">
  <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">
    {weeklyMessage}
  </p>

  <button
    type="button"
    onClick={() => setWeeklyTargetOpen(true)}
    className="mt-4 flex w-full items-center justify-center rounded-2xl border border-violet-200 bg-violet-50 px-5 py-3.5 text-sm font-bold text-violet-700 transition hover:border-violet-300 hover:bg-violet-100 active:scale-[0.98] dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/15"
  >
    Configure Weekly Target
  </button>
</div>
            </div>

            <div className="order-2 lg:order-3 lg:col-span-2">
              {activeSession ? (
                <ActiveSessionCard />
              ) : (
                <section className="rounded-[2rem] bg-gradient-to-br from-violet-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-2xl shadow-violet-600/20 sm:p-8">
                  <div className="flex max-w-xl flex-col">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                      <Flame size={23} />
                    </div>
                    <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-violet-100">
                      Today&apos;s commitment
                    </p>
                    <h2 className="mt-2 text-3xl font-black">Just begin.</h2>
                    <p className="mt-3 text-violet-100">
                      Check in when you arrive, or choose an intentional rest
                      day when recovery is the better decision.
                    </p>
                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setCheckInOpen(true)}
                        className="rounded-2xl bg-white px-6 py-4 font-bold text-violet-700 transition hover:bg-violet-50 active:scale-[0.98]"
                      >
                        Check In Now
                      </button>
                      <button
                        type="button"
                        onClick={() => setRestDayDialogOpen(true)}
                        className="rounded-2xl border border-white/25 bg-white/10 px-6 py-4 font-bold text-white transition hover:bg-white/15 active:scale-[0.98]"
                      >
                        Log a Rest Day
                      </button>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </section>

          {!activeSession &&
          !lastCompletedSession &&
          !restDayDialogOpen ? (
            <InstallGymFlowBanner />
          ) : null}

          <CheckInDialog
            open={checkInOpen && activeSession === null}
            onClose={() => setCheckInOpen(false)}
          />
        </div>
      </main>

      <LogRestDayDialog
        key={`${restDayDialogOpen}`}
        open={restDayDialogOpen}
        onClose={() => setRestDayDialogOpen(false)}
        onSave={handleSaveRestDay}
      />

      <WeeklyTargetDialog
        key={`${weeklyTarget}-${weeklyTargetOpen}`}
        open={weeklyTargetOpen}
        currentTarget={weeklyTarget}
        onClose={() => setWeeklyTargetOpen(false)}
        onSave={handleSaveWeeklyTarget}
      />

      {lastCompletedSession ? (
        <SessionCompletionSummary
          session={lastCompletedSession}
          completedThisWeek={completedThisWeek}
          weeklyTarget={weeklyTarget}
          onDone={dismissLastCompletedSession}
          onViewHistory={handleViewHistory}
        />
      ) : null}
    </>
  );
}

function HomeLoading() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto min-h-96 max-w-6xl animate-pulse rounded-3xl bg-zinc-200 dark:bg-zinc-900" />
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}
