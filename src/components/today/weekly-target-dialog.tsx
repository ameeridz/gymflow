"use client";

import {
  Save,
  Target,
  X,
} from "lucide-react";
import { useState } from "react";

interface WeeklyTargetDialogProps {
  open: boolean;
  currentTarget: number;
  onClose: () => void;
  onSave: (target: number) => void;
}

const weeklyTargetOptions = [2, 3, 4, 5, 6, 7];

export function WeeklyTargetDialog({
  open,
  currentTarget,
  onClose,
  onSave,
}: WeeklyTargetDialogProps) {
  const [selectedTarget, setSelectedTarget] =
    useState(currentTarget);

  if (!open) {
    return null;
  }

  function handleSave() {
    onSave(selectedTarget);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="weekly-target-title"
      className="fixed inset-0 z-[210] flex items-end justify-center bg-zinc-950/70 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-zinc-200 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-md sm:rounded-[2rem] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
            <Target size={22} />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close weekly goal settings"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 active:scale-95 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={19} />
          </button>
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
          Weekly goal
        </p>

        <h2
          id="weekly-target-title"
          className="mt-2 text-2xl font-black tracking-tight"
        >
          Configure your target
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Choose how many gym sessions you want to
          complete from Monday to Sunday.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {weeklyTargetOptions.map((target) => {
            const selected =
              selectedTarget === target;

            return (
              <button
                key={target}
                type="button"
                onClick={() =>
                  setSelectedTarget(target)
                }
                aria-pressed={selected}
                className={`rounded-2xl border px-4 py-4 text-lg font-black transition active:scale-[0.98] ${
                  selected
                    ? "border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                    : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                }`}
              >
                {target}
              </button>
            );
          })}
        </div>

        <div className="mt-5 rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Selected target
          </p>

          <p className="mt-1 font-bold">
            {selectedTarget} sessions per week
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-zinc-200 px-4 py-3.5 font-bold transition hover:bg-zinc-100 active:scale-[0.98] dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={selectedTarget === currentTarget}
            className="flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />
            Save Goal
          </button>
        </div>
      </div>
    </div>
  );
}
