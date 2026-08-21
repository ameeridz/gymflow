"use client";

import {
  Activity,
  Dumbbell,
  Frown,
  HeartPulse,
  Meh,
  Save,
  Smile,
  Timer,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

import type {
  ActivityType,
  GymSession,
  SessionMood,
} from "@/types/session";

interface EditSessionDialogProps {
  session: GymSession;
  onClose: () => void;
  onSave: (
    sessionId: string,
    updates: {
      activityType: ActivityType;
      mood: SessionMood;
      note: string;
    },
  ) => void;
}

const activityOptions: {
  value: ActivityType;
  label: string;
  icon: typeof Dumbbell;
}[] = [
  {
    value: "strength",
    label: "Strength",
    icon: Dumbbell,
  },
  {
    value: "cardio",
    label: "Cardio",
    icon: HeartPulse,
  },
  {
    value: "mixed",
    label: "Mixed",
    icon: Activity,
  },
  {
    value: "mobility",
    label: "Mobility",
    icon: Zap,
  },
  {
    value: "quick",
    label: "Quick",
    icon: Timer,
  },
];

const moodOptions: {
  value: SessionMood;
  label: string;
  icon: typeof Smile;
}[] = [
  {
    value: "tough",
    label: "Tough",
    icon: Frown,
  },
  {
    value: "okay",
    label: "Okay",
    icon: Meh,
  },
  {
    value: "great",
    label: "Great",
    icon: Smile,
  },
];

export function EditSessionDialog({
  session,
  onClose,
  onSave,
}: EditSessionDialogProps) {
  
  const [
  selectedActivity,
  setSelectedActivity,
] = useState<ActivityType>(
  session.activityType,
);

const [selectedMood, setSelectedMood] =
  useState<SessionMood>(
    session.mood ?? "okay",
  );

const [note, setNote] =
  useState(session.note);




const sessionId = session.id;

function handleSave() {
  onSave(sessionId, {
    activityType: selectedActivity,
    mood: selectedMood,
    note,
  });
}

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-session-title"
      className="fixed inset-0 z-[120] flex items-end justify-center bg-zinc-950/70 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-zinc-200 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-xl sm:rounded-[2rem] sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Edit workout
            </p>

            <h2
              id="edit-session-title"
              className="mt-2 text-2xl font-black tracking-tight"
            >
              Update session
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Update the activity, mood or note for this
              completed session.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit session dialog"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={19} />
          </button>
        </header>

        <section className="mt-7">
          <p className="text-sm font-bold">
            Activity type
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {activityOptions.map((option) => {
              const Icon = option.icon;

              const selected =
                selectedActivity === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setSelectedActivity(
                      option.value,
                    )
                  }
                  className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${
                    selected
                      ? "border-violet-600 bg-violet-50 text-violet-700 ring-2 ring-violet-600/15 dark:bg-violet-500/10 dark:text-violet-300"
                      : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon size={18} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-7">
          <p className="text-sm font-bold">
            Session mood
          </p>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {moodOptions.map((option) => {
              const Icon = option.icon;

              const selected =
                selectedMood === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setSelectedMood(option.value)
                  }
                  className={`flex flex-col items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-sm font-bold transition ${
                    selected
                      ? "border-violet-600 bg-violet-50 text-violet-700 ring-2 ring-violet-600/15 dark:bg-violet-500/10 dark:text-violet-300"
                      : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                  }`}
                >
                  <Icon size={20} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </section>

        <label className="mt-7 block">
          <span className="text-sm font-bold">
            Optional note
          </span>

          <textarea
            value={note}
            onChange={(event) =>
              setNote(event.target.value)
            }
            rows={4}
            maxLength={280}
            placeholder="Anything you want to remember?"
            className="mt-2 w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-violet-600 focus:ring-2 focus:ring-violet-600/15 dark:border-zinc-800 dark:bg-zinc-900"
          />

          <span className="mt-1 block text-right text-xs text-zinc-400">
            {note.length} / 280
          </span>
        </label>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-zinc-200 px-4 py-3 font-bold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 font-bold text-white transition hover:bg-violet-700 active:scale-[0.98]"
          >
            <Save size={17} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}