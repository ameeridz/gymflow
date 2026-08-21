"use client";

import {
  AlertTriangle,
  Clock3,
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Timer,
  X,
  Zap,
} from "lucide-react";

import type {
  ActivityType,
  GymSession,
} from "@/types/session";

interface CancelSessionDialogProps {
  open: boolean;
  session: GymSession;
  elapsedSeconds: number;
  onClose: () => void;
  onConfirm: () => void;
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

function formatDuration(
  totalSeconds: number,
) {
  const hours = Math.floor(
    totalSeconds / 3600,
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) =>
      String(value).padStart(2, "0"),
    )
    .join(":");
}

export function CancelSessionDialog({
  open,
  session,
  elapsedSeconds,
  onClose,
  onConfirm,
}: CancelSessionDialogProps) {
  if (!open) {
    return null;
  }

  const ActivityIcon =
    activityIcons[session.activityType];

  const activityLabel =
    activityLabels[session.activityType];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-session-title"
      className="fixed inset-0 z-[140] flex items-end justify-center bg-zinc-950/70 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-zinc-200 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-md sm:rounded-[2rem] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
            <AlertTriangle size={23} />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cancel session confirmation"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 active:scale-95 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={19} />
          </button>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
            Active workout
          </p>

          <h2
            id="cancel-session-title"
            className="mt-2 text-2xl font-black tracking-tight"
          >
            Cancel this session?
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            This active session will be discarded and
            will not appear in your History or Progress.
          </p>
        </div>

        <section className="mt-5 rounded-3xl bg-zinc-100 p-5 dark:bg-zinc-900">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
              <ActivityIcon size={21} />
            </div>

            <div className="min-w-0">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Current activity
              </p>

              <p className="mt-1 text-lg font-black">
                {activityLabel}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-4 dark:bg-zinc-950/50">
            <Clock3
              size={18}
              className="text-violet-600 dark:text-violet-400"
            />

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Current duration
              </p>

              <p className="mt-1 font-mono text-xl font-black">
                {formatDuration(
                  elapsedSeconds,
                )}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
          <ShieldCheck
            size={19}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm leading-6">
            Choose Keep Training if the session was
            opened accidentally. Cancelling cannot be
            undone.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.98]"
          >
            <ShieldCheck size={18} />
            Keep Training
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center justify-center gap-2 rounded-2xl border border-rose-200 px-5 py-3.5 font-bold text-rose-600 transition hover:bg-rose-50 active:scale-[0.98] dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10"
          >
            <X size={18} />
            Cancel Session
          </button>
        </div>
      </div>
    </div>
  );
}