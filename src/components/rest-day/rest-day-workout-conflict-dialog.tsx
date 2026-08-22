"use client";

import {
  Dumbbell,
  ShieldCheck,
  ShieldPlus,
  Trash2,
  X,
} from "lucide-react";

import type { RestDay } from "@/types/rest-day";

interface RestDayWorkoutConflictDialogProps {
  open: boolean;
  restDay: RestDay | null;
  onKeepRestDay: () => void;
  onStartWorkout: () => void;
}

const reasonLabels = {
  scheduled: "Scheduled rest",
  recovery: "Recovery",
  "poor-sleep": "Poor sleep",
  busy: "Busy day",
  unwell: "Feeling unwell",
  other: "Other",
};

function formatRestDate(dateValue: string) {
  return new Intl.DateTimeFormat("en-MY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(
    new Date(`${dateValue}T12:00:00`),
  );
}

export function RestDayWorkoutConflictDialog({
  open,
  restDay,
  onKeepRestDay,
  onStartWorkout,
}: RestDayWorkoutConflictDialogProps) {
  if (!open || !restDay) {
    return null;
  }

  const reasonLabel =
    reasonLabels[restDay.reason];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rest-day-conflict-title"
      className="fixed inset-0 z-[220] flex items-end justify-center bg-zinc-950/70 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-zinc-200 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-md sm:rounded-[2rem] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
            <ShieldPlus size={23} />
          </div>

          <button
            type="button"
            onClick={onKeepRestDay}
            aria-label="Close rest day confirmation"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 active:scale-95 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={19} />
          </button>
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
          Rest day recorded
        </p>

        <h2
          id="rest-day-conflict-title"
          className="mt-2 text-2xl font-black tracking-tight"
        >
          Start a workout instead?
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          A rest day is already recorded for today.
          Starting a workout will remove today&apos;s
          rest-day record before opening Check-In.
        </p>

        <section className="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <ShieldCheck size={19} />
            </div>

            <div className="min-w-0">
              <p className="font-black text-emerald-800 dark:text-emerald-300">
                {reasonLabel}
              </p>

              <p className="mt-1 text-sm leading-5 text-emerald-700/80 dark:text-emerald-300/75">
                {formatRestDate(restDay.date)}
              </p>
            </div>
          </div>

          {restDay.note ? (
            <div className="mt-4 rounded-2xl bg-white/70 p-4 dark:bg-zinc-950/30">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Rest day note
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                {restDay.note}
              </p>
            </div>
          ) : null}
        </section>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
          <Trash2
            size={19}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm leading-6">
            Starting a workout permanently removes
            today&apos;s rest-day record. The new
            workout will count as today&apos;s training
            day after completion.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={onKeepRestDay}
            className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 font-bold text-emerald-700 transition hover:bg-emerald-100 active:scale-[0.98] dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/15"
          >
            <ShieldCheck size={18} />
            Keep Rest Day
          </button>

          <button
            type="button"
            onClick={onStartWorkout}
            className="flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.98]"
          >
            <Dumbbell size={18} />
            Start Workout
          </button>
        </div>
      </div>
    </div>
  );
}