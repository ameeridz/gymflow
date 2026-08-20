"use client";

import {
  Frown,
  Meh,
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

const moodOptions: {
  value: SessionMood;
  label: string;
  description: string;
  icon: typeof Smile;
}[] = [
  {
    value: "tough",
    label: "Tough",
    description: "It was difficult, but you still showed up.",
    icon: Frown,
  },
  {
    value: "okay",
    label: "Okay",
    description: "A solid session that protected the habit.",
    icon: Meh,
  },
  {
    value: "great",
    label: "Great",
    description: "You finished feeling strong.",
    icon: Smile,
  },
];

export function FinishSessionDialog({
  open,
  onClose,
}: FinishSessionDialogProps) {
  const [selectedMood, setSelectedMood] =
    useState<SessionMood>("okay");

  const [note, setNote] = useState("");

  const finishSession = useSessionStore(
    (state) => state.finishSession,
  );

  if (!open) {
    return null;
  }

  function handleCompleteSession() {
    finishSession(selectedMood, note.trim());

    setSelectedMood("okay");
    setNote("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center bg-zinc-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-[2rem] border border-zinc-200 bg-white p-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-lg sm:rounded-[2rem] sm:p-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Session complete
            </p>

            <h2 className="mt-2 text-2xl font-black">
              How did it go?
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Every completed session is progress,
              including the difficult ones.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
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
          className="mt-5 w-full rounded-2xl bg-violet-600 px-6 py-4 font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.98]"
        >
          Complete Session
        </button>
      </div>
    </div>
  );
}