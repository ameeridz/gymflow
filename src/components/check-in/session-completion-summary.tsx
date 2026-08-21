"use client";

import {
  ArrowRight,
  Check,
  Clock3,
  Dumbbell,
  Frown,
  HeartPulse,
  History,
  Meh,
  Smile,
  Sparkles,
  Target,
  Timer,
  Trophy,
  X,
  Zap,
} from "lucide-react";

import type {
  ActivityType,
  GymSession,
  SessionMood,
} from "@/types/session";

interface SessionCompletionSummaryProps {
  session: GymSession;
  completedThisWeek: number;
  weeklyTarget: number;
  onDone: () => void;
  onViewHistory: () => void;
}

const activityLabels: Record<
  ActivityType,
  string
> = {
  strength: "Strength",
  cardio: "Cardio",
  mixed: "Mixed",
  mobility: "Mobility",
  quick: "Quick Session",
};

const activityIcons = {
  strength: Dumbbell,
  cardio: HeartPulse,
  mixed: Sparkles,
  mobility: Zap,
  quick: Timer,
};

const moodLabels: Record<
  SessionMood,
  string
> = {
  tough: "Tough",
  okay: "Okay",
  great: "Great",
};

const moodIcons = {
  tough: Frown,
  okay: Meh,
  great: Smile,
};

function formatDuration(
  totalSeconds: number | null,
) {
  if (
    totalSeconds === null ||
    totalSeconds < 60
  ) {
    return totalSeconds === null
      ? "Less than 1 min"
      : `${totalSeconds} sec`;
  }

  const totalMinutes = Math.floor(
    totalSeconds / 60,
  );

  const hours = Math.floor(
    totalMinutes / 60,
  );

  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return minutes > 0
      ? `${hours} hr ${minutes} min`
      : `${hours} hr`;
  }

  return `${totalMinutes} min`;
}

export function SessionCompletionSummary({
  session,
  completedThisWeek,
  weeklyTarget,
  onDone,
  onViewHistory,
}: SessionCompletionSummaryProps) {
  const ActivityIcon =
    activityIcons[session.activityType];

  const activityLabel =
    activityLabels[session.activityType];

  const MoodIcon = session.mood
    ? moodIcons[session.mood]
    : Meh;

  const moodLabel = session.mood
    ? moodLabels[session.mood]
    : "Not recorded";

  const remainingSessions = Math.max(
    0,
    weeklyTarget - completedThisWeek,
  );

  const weeklyGoalReached =
    completedThisWeek >= weeklyTarget;

  const weeklyProgress = Math.min(
    100,
    (completedThisWeek / weeklyTarget) * 100,
  );

  const progressMessage = weeklyGoalReached
    ? completedThisWeek === weeklyTarget
      ? "Weekly goal achieved. Great work showing up."
      : `You have exceeded your weekly goal by ${
          completedThisWeek - weeklyTarget
        } session${
          completedThisWeek - weeklyTarget === 1
            ? ""
            : "s"
        }.`
    : remainingSessions === 1
      ? "One more session to reach your weekly goal."
      : `${remainingSessions} more sessions to reach your weekly goal.`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-complete-title"
      className="fixed inset-0 z-[130] flex items-end justify-center bg-zinc-950/70 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-[2rem] border border-white/20 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-5 shadow-2xl dark:border-white/10 dark:bg-zinc-950 sm:max-w-lg sm:rounded-[2rem] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/25">
            <Check size={28} strokeWidth={3} />
          </div>

          <button
            type="button"
            onClick={onDone}
            aria-label="Close session summary"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 active:scale-95 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            Workout saved
          </p>

          <h2
            id="session-complete-title"
            className="mt-2 text-3xl font-black tracking-tight"
          >
            Session complete
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Another completed session has been added to
            your consistency journey.
          </p>
        </div>

        <section className="mt-6 rounded-3xl bg-gradient-to-br from-violet-600 via-violet-600 to-fuchsia-600 p-5 text-white shadow-xl shadow-violet-600/20">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
              <ActivityIcon size={23} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-wider text-violet-100">
                Completed activity
              </p>

              <h3 className="mt-1 text-2xl font-black">
                {activityLabel}
              </h3>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/15 p-4">
              <div className="flex items-center gap-2 text-violet-100">
                <Clock3 size={17} />

                <p className="text-xs font-semibold uppercase tracking-wider">
                  Duration
                </p>
              </div>

              <p className="mt-2 text-xl font-black">
                {formatDuration(
                  session.durationSeconds,
                )}
              </p>
            </div>

            <div className="rounded-2xl bg-white/15 p-4">
              <div className="flex items-center gap-2 text-violet-100">
                <MoodIcon size={17} />

                <p className="text-xs font-semibold uppercase tracking-wider">
                  Mood
                </p>
              </div>

              <p className="mt-2 text-xl font-black">
                {moodLabel}
              </p>
            </div>
          </div>

          {session.note ? (
            <div className="mt-3 rounded-2xl bg-white/15 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-violet-100">
                Session note
              </p>

              <p className="mt-2 text-sm leading-6 text-white">
                {session.note}
              </p>
            </div>
          ) : null}
        </section>

        <section className="mt-5 rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                  weeklyGoalReached
                    ? "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
                    : "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"
                }`}
              >
                {weeklyGoalReached ? (
                  <Trophy size={21} />
                ) : (
                  <Target size={21} />
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                  Weekly progress
                </p>

                <p className="mt-1 text-2xl font-black">
                  {completedThisWeek} /{" "}
                  {weeklyTarget}
                </p>
              </div>
            </div>

            <span className="rounded-full bg-violet-100 px-3 py-1.5 text-xs font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
              {Math.round(weeklyProgress)}%
            </span>
          </div>

          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                weeklyGoalReached
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : "bg-gradient-to-r from-violet-600 to-fuchsia-500"
              }`}
              style={{
                width: `${weeklyProgress}%`,
              }}
            />
          </div>

          <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {progressMessage}
          </p>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onDone}
            className="order-2 rounded-2xl border border-zinc-200 px-5 py-3.5 font-bold transition hover:bg-zinc-100 active:scale-[0.98] dark:border-zinc-700 dark:hover:bg-zinc-900 sm:order-1"
          >
            Done
          </button>

          <button
            type="button"
            onClick={onViewHistory}
            className="order-1 flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.98] sm:order-2"
          >
            <History size={18} />
            View History
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}