"use client";

import {
  AlertTriangle,
  Clock3,
  Play,
  Square,
  Trash2,
} from "lucide-react";

import type { GymSession } from "@/types/session";

interface LongRunningSessionDialogProps {
  open: boolean;
  session: GymSession;
  elapsedSeconds: number;
  onContinue: () => void;
  onFinish: () => void;
  onDiscard: () => void;
}

const activityLabels = {
  strength: "Strength",
  cardio: "Cardio",
  mixed: "Mixed",
  mobility: "Mobility",
  quick: "Quick Session",
};

function formatLongDuration(totalSeconds: number) {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  }

  return `${hours} hr ${minutes} min`;
}

export function LongRunningSessionDialog({
  open,
  session,
  elapsedSeconds,
  onContinue,
  onFinish,
  onDiscard,
}: LongRunningSessionDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="long-running-session-title"
      className="fixed inset-0 z-[150] flex items-end justify-center bg-zinc-950/75 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-zinc-200 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-md sm:rounded-[2rem] sm:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
          <AlertTriangle size={23} />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
          Long-running session
        </p>

        <h2
          id="long-running-session-title"
          className="mt-2 text-2xl font-black tracking-tight"
        >
          Is this workout still active?
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          This session has been running for an unusually long time. Choose
          what should happen next.
        </p>

        <section className="mt-5 rounded-3xl bg-zinc-100 p-5 dark:bg-zinc-900">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
              <Clock3 size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {activityLabels[session.activityType]}
              </p>

              <p className="mt-1 text-2xl font-black">
                {formatLongDuration(elapsedSeconds)}
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                Started {new Intl.DateTimeFormat("en-MY", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  hour: "numeric",
                  minute: "2-digit",
                }).format(new Date(session.startedAt))}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
          Gymeer will not finish or discard the session automatically. The
          training day will continue to follow the date when the session
          started.
        </div>

        <div className="mt-6 grid gap-3">
          <button
            type="button"
            onClick={onContinue}
            className="flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.98]"
          >
            <Play size={18} />
            Continue Session
          </button>

          <button
            type="button"
            onClick={onFinish}
            className="flex items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-5 py-3.5 font-bold text-violet-700 transition hover:bg-violet-100 active:scale-[0.98] dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/15"
          >
            <Square size={18} />
            Finish Session
          </button>

          <button
            type="button"
            onClick={onDiscard}
            className="flex items-center justify-center gap-2 rounded-2xl border border-rose-200 px-5 py-3.5 font-bold text-rose-600 transition hover:bg-rose-50 active:scale-[0.98] dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10"
          >
            <Trash2 size={18} />
            Discard Session
          </button>
        </div>
      </div>
    </div>
  );
}
