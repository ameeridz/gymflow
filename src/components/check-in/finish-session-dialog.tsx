"use client";

import {
  AlertTriangle,
  Clock3,
  Frown,
  Meh,
  Play,
  Save,
  Smile,
  X,
} from "lucide-react";
import { useState } from "react";

import { useSessionStore } from "@/stores/session-store";
import type { SessionMood } from "@/types/session";

interface FinishSessionDialogProps {
  open: boolean;
  onClose: () => void;
}

const SHORT_SESSION_THRESHOLD_SECONDS =
  5 * 60;

const moodOptions: {
  value: SessionMood;
  label: string;
  description: string;
  icon: typeof Smile;
}[] = [
  {
    value: "tough",
    label: "Tough",
    description:
      "It was difficult, but you still showed up.",
    icon: Frown,
  },
  {
    value: "okay",
    label: "Okay",
    description:
      "A solid session that protected the habit.",
    icon: Meh,
  },
  {
    value: "great",
    label: "Great",
    description:
      "You finished feeling strong.",
    icon: Smile,
  },
];

function getElapsedSeconds(
  startedAt: string,
) {
  return Math.max(
    0,
    Math.floor(
      (Date.now() -
        new Date(startedAt).getTime()) /
        1000,
    ),
  );
}

function formatShortDuration(
  totalSeconds: number,
) {
  const minutes = Math.floor(
    totalSeconds / 60,
  );
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds} ${
      seconds === 1 ? "second" : "seconds"
    }`;
  }

  if (seconds === 0) {
    return `${minutes} ${
      minutes === 1 ? "minute" : "minutes"
    }`;
  }

  return `${minutes} min ${seconds} sec`;
}

export function FinishSessionDialog({
  open,
  onClose,
}: FinishSessionDialogProps) {
  const [selectedMood, setSelectedMood] =
    useState<SessionMood>("okay");
  const [note, setNote] = useState("");
  const [showShortWarning, setShowShortWarning] =
    useState(false);
  const [isSaving, setIsSaving] =
    useState(false);

  const activeSession = useSessionStore(
    (state) => state.activeSession,
  );
  const finishSession = useSessionStore(
    (state) => state.finishSession,
  );

  if (!open || !activeSession) {
    return null;
  }

  const elapsedSeconds = getElapsedSeconds(
    activeSession.startedAt,
  );
  const isShortSession =
    elapsedSeconds <
    SHORT_SESSION_THRESHOLD_SECONDS;

  function resetDialog() {
    setSelectedMood("okay");
    setNote("");
    setShowShortWarning(false);
    setIsSaving(false);
  }

  function handleClose() {
    resetDialog();
    onClose();
  }

  function saveSession() {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    finishSession(selectedMood, note.trim());
    resetDialog();
    onClose();
  }

  function handleCompleteSession() {
    if (isSaving) {
      return;
    }

    if (isShortSession) {
      setShowShortWarning(true);
      return;
    }

    saveSession();
  }

  function handleContinueTraining() {
    resetDialog();
    onClose();
  }

  if (showShortWarning) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="short-session-title"
        className="fixed inset-0 z-[115] flex items-end justify-center bg-zinc-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      >
        <div className="w-full rounded-t-[2rem] border border-zinc-200 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-md sm:rounded-[2rem] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400">
              <AlertTriangle size={23} />
            </div>

            <button
              type="button"
              onClick={() =>
                setShowShortWarning(false)
              }
              aria-label="Return to finish session"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 active:scale-95 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <X size={19} />
            </button>
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-amber-600 dark:text-amber-400">
            Short session
          </p>

          <h2
            id="short-session-title"
            className="mt-2 text-2xl font-black tracking-tight"
          >
            Save this workout?
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            This session has only been active for{" "}
            <span className="font-bold text-zinc-700 dark:text-zinc-200">
              {formatShortDuration(
                elapsedSeconds,
              )}
            </span>
            . A five-minute session is recommended
            before saving.
          </p>

          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            <Clock3
              size={19}
              className="mt-0.5 shrink-0"
            />

            <p className="text-sm leading-6">
              Saving anyway will add the session to
              History. If this is the first workout
              today, today will count as one training
              day.
            </p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleContinueTraining}
              className="flex items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3.5 font-bold text-violet-700 transition hover:bg-violet-100 active:scale-[0.98] dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/15"
            >
              <Play size={18} />
              Continue Training
            </button>

            <button
              type="button"
              onClick={saveSession}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 rounded-2xl bg-amber-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-amber-600/20 transition hover:bg-amber-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />
              {isSaving
                ? "Saving..."
                : "Save Anyway"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="finish-session-title"
      className="fixed inset-0 z-[110] flex items-end justify-center bg-zinc-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-[2rem] border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-lg sm:rounded-[2rem] sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Session complete
            </p>

            <h2
              id="finish-session-title"
              className="mt-2 text-2xl font-black"
            >
              How did it go?
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Every completed session is progress,
              including the difficult ones.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close finish session dialog"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={19} />
          </button>
        </header>

        <div className="mt-6 grid gap-3">
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
                aria-pressed={selected}
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

        <label className="mt-6 block">
          <span className="text-sm font-bold">
            Optional note
          </span>

          <textarea
            value={note}
            onChange={(event) =>
              setNote(event.target.value)
            }
            rows={3}
            maxLength={280}
            placeholder="Anything you want to remember?"
            className="mt-2 w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-violet-600 focus:ring-2 focus:ring-violet-600/15 dark:border-zinc-800 dark:bg-zinc-900"
          />

          <span className="mt-1 block text-right text-xs text-zinc-400">
            {note.length} / 280
          </span>
        </label>

        <button
          type="button"
          onClick={handleCompleteSession}
          disabled={isSaving}
          className="mt-5 w-full rounded-2xl bg-violet-600 px-6 py-4 font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving
            ? "Saving..."
            : "Complete Session"}
        </button>
      </div>
    </div>
  );
}
