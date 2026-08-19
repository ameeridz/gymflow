"use client";

import {
  Activity,
  Dumbbell,
  HeartPulse,
  Timer,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { useSessionStore } from "@/stores/session-store";
import type { ActivityType } from "@/types/session";

interface CheckInDialogProps {
  open: boolean;
  onClose: () => void;
}

const activityOptions: {
  type: ActivityType;
  label: string;
  description: string;
  icon: typeof Dumbbell;
}[] = [
  {
    type: "strength",
    label: "Strength",
    description: "Weights and resistance training",
    icon: Dumbbell,
  },
  {
    type: "cardio",
    label: "Cardio",
    description: "Running, cycling or conditioning",
    icon: HeartPulse,
  },
  {
    type: "mixed",
    label: "Mixed",
    description: "A combination of activities",
    icon: Activity,
  },
  {
    type: "mobility",
    label: "Mobility",
    description: "Stretching and recovery movement",
    icon: Zap,
  },
  {
    type: "quick",
    label: "Quick Session",
    description: "A short session that protects the habit",
    icon: Timer,
  },
];

export function CheckInDialog({
  open,
  onClose,
}: CheckInDialogProps) {
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityType>("strength");

  const startSession = useSessionStore(
    (state) => state.startSession,
  );

  if (!open) {
    return null;
  }

  function handleStartSession() {
    startSession(selectedActivity);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-zinc-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-[2rem] border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-xl sm:rounded-[2rem] sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Gym check-in
            </p>

            <h2 className="mt-2 text-2xl font-black">
              What are you doing today?
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Choose one activity. The goal is to begin,
              not to be perfect.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close check-in dialog"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={19} />
          </button>
        </header>

        <div className="mt-6 space-y-3">
          {activityOptions.map((option) => {
            const Icon = option.icon;
            const selected =
              selectedActivity === option.type;

            return (
              <button
                key={option.type}
                type="button"
                onClick={() =>
                  setSelectedActivity(option.type)
                }
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                  selected
                    ? "border-violet-600 bg-violet-50 ring-2 ring-violet-600/15 dark:bg-violet-500/10"
                    : "border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900"
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                    selected
                      ? "bg-violet-600 text-white"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  <Icon size={21} />
                </div>

                <div>
                  <p className="font-bold">
                    {option.label}
                  </p>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleStartSession}
          className="mt-6 w-full rounded-2xl bg-violet-600 px-6 py-4 font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.98]"
        >
          Start Session
        </button>
      </div>
    </div>
  );
}