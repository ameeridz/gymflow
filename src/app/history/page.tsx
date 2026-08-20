"use client";

import {
  CalendarDays,
  Clock3,
  Dumbbell,
  Frown,
  HeartPulse,
  History,
  Meh,
  Smile,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { useSyncExternalStore } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { useSessionStore } from "@/stores/session-store";
import type {
  ActivityType,
  GymSession,
  SessionMood,
} from "@/types/session";

const activityLabels: Record<ActivityType, string> = {
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

const moodLabels: Record<SessionMood, string> = {
  tough: "Tough",
  okay: "Okay",
  great: "Great",
};

const moodIcons = {
  tough: Frown,
  okay: Meh,
  great: Smile,
};

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

function formatDuration(totalSeconds: number | null) {
  if (!totalSeconds) {
    return "Less than 1 min";
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }

  if (minutes > 0) {
    return `${minutes} min ${seconds} sec`;
  }

  return `${seconds} sec`;
}

function formatSessionDate(dateValue: string) {
  return new Intl.DateTimeFormat("en-MY", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

function SessionCard({
  session,
}: {
  session: GymSession;
}) {
  const ActivityIcon =
    activityIcons[session.activityType];

  const MoodIcon = session.mood
    ? moodIcons[session.mood]
    : Meh;

  const moodLabel = session.mood
    ? moodLabels[session.mood]
    : "Not recorded";

  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
          <ActivityIcon size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-black">
                {activityLabels[session.activityType]}
              </h2>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {formatSessionDate(session.startedAt)}
              </p>
            </div>

            <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
              Completed
            </span>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800">
              <Clock3 size={16} />
              {formatDuration(session.durationSeconds)}
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800">
              <MoodIcon size={16} />
              {moodLabel}
            </div>
          </div>

          {session.note ? (
            <p className="mt-5 rounded-2xl bg-zinc-100 p-4 text-sm leading-6 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {session.note}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function HistoryPage() {
  const mounted = useMounted();

  const completedSessions = useSessionStore(
    (state) => state.completedSessions,
  );

  const sessions = [...completedSessions].sort(
    (firstSession, secondSession) =>
      new Date(secondSession.startedAt).getTime() -
      new Date(firstSession.startedAt).getTime(),
  );

  return (
    <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Activity
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Your history
            </h1>

            <p className="mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">
              Every visit counts, including the short
              sessions.
            </p>
          </div>

          <ThemeToggle />
        </header>

        {!mounted ? (
          <section className="mt-10 min-h-72 animate-pulse rounded-3xl bg-zinc-200 dark:bg-zinc-900" />
        ) : sessions.length === 0 ? (
          <section className="mt-10 flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
              <History size={25} />
            </div>

            <h2 className="mt-5 text-xl font-black">
              No sessions yet
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Your completed gym sessions will appear
              here after your first check-in.
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              <CalendarDays size={17} />
              Start by checking in from the Today page.
            </div>
          </section>
        ) : (
          <section className="mt-10 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                {sessions.length} completed{" "}
                {sessions.length === 1
                  ? "session"
                  : "sessions"}
              </p>
            </div>

            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}