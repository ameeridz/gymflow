"use client";

import {
  AlertTriangle,
  BatteryCharging,
  BedDouble,
  BriefcaseBusiness,
  CalendarDays,
  HeartPulse,
  Save,
  ShieldPlus,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";

import type { RestDayReason } from "@/types/rest-day";

interface LogRestDayDialogProps {
  open: boolean;
  blockedDates?: string[];
  onClose: () => void;
  onSave: (input: {
    date: string;
    reason: RestDayReason;
    note: string;
  }) => void;
}

const restDayOptions: {
  value: RestDayReason;
  label: string;
  description: string;
  icon: typeof CalendarDays;
}[] = [
  {
    value: "scheduled",
    label: "Scheduled rest",
    description: "A planned recovery day.",
    icon: CalendarDays,
  },
  {
    value: "recovery",
    label: "Recovery",
    description: "Give your body time to rebuild.",
    icon: BatteryCharging,
  },
  {
    value: "poor-sleep",
    label: "Poor sleep",
    description: "Prioritize sleep and energy.",
    icon: BedDouble,
  },
  {
    value: "busy",
    label: "Busy day",
    description: "Life needed your attention today.",
    icon: BriefcaseBusiness,
  },
  {
    value: "unwell",
    label: "Feeling unwell",
    description: "Rest and return when ready.",
    icon: HeartPulse,
  },
  {
    value: "other",
    label: "Other",
    description: "Record another reason.",
    icon: Sparkles,
  },
];

function getLocalDateValue() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(
    currentDate.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(
    currentDate.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function LogRestDayDialog({
  open,
  blockedDates = [],
  onClose,
  onSave,
}: LogRestDayDialogProps) {
  const today = getLocalDateValue();

  const [selectedDate, setSelectedDate] =
    useState(today);
  const [selectedReason, setSelectedReason] =
    useState<RestDayReason>("recovery");
  const [note, setNote] = useState("");

  if (!open) {
    return null;
  }

  const selectedDateHasWorkout =
    blockedDates.includes(selectedDate);

  function handleSave() {
    if (
      !selectedDate ||
      selectedDateHasWorkout
    ) {
      return;
    }

    onSave({
      date: selectedDate,
      reason: selectedReason,
      note,
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="log-rest-day-title"
      className="fixed inset-0 z-[210] flex items-end justify-center bg-zinc-950/70 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="max-h-[94vh] w-full overflow-y-auto rounded-t-[2rem] border border-zinc-200 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-xl sm:rounded-[2rem] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
            <ShieldPlus size={23} />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close rest day dialog"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 active:scale-95 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={19} />
          </button>
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
          Intentional recovery
        </p>

        <h2
          id="log-rest-day-title"
          className="mt-2 text-2xl font-black tracking-tight sm:text-3xl"
        >
          Log a rest day
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Recovery supports consistency. Rest days do
          not count as workouts or change your weekly
          progress.
        </p>

        <label className="mt-6 block">
          <span className="text-sm font-bold">
            Rest date
          </span>

          <input
            type="date"
            value={selectedDate}
            max={today}
            onChange={(event) =>
              setSelectedDate(event.target.value)
            }
            aria-invalid={selectedDateHasWorkout}
            aria-describedby={
              selectedDateHasWorkout
                ? "rest-day-date-conflict"
                : undefined
            }
            className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm outline-none transition dark:bg-zinc-900 ${
              selectedDateHasWorkout
                ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 dark:border-rose-500/50"
                : "border-zinc-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 dark:border-zinc-800"
            }`}
          />
        </label>

        {selectedDateHasWorkout ? (
          <div
            id="rest-day-date-conflict"
            role="alert"
            className="mt-3 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <AlertTriangle
              size={19}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="text-sm font-bold">
                A workout already exists on this date
              </p>

              <p className="mt-1 text-xs leading-5 text-rose-600/80 dark:text-rose-300/75">
                A rest day cannot be recorded on the
                same calendar day as a completed
                workout. Choose another date.
              </p>
            </div>
          </div>
        ) : null}

        <section className="mt-6">
          <p className="text-sm font-bold">
            Why are you resting?
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {restDayOptions.map((option) => {
              const Icon = option.icon;
              const selected =
                selectedReason === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setSelectedReason(option.value)
                  }
                  aria-pressed={selected}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                    selected
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-600/15 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      selected
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    <Icon size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold">
                      {option.label}
                    </p>

                    <p
                      className={`mt-1 text-xs leading-5 ${
                        selected
                          ? "text-emerald-700/80 dark:text-emerald-300/75"
                          : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

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
            placeholder="Anything you want to remember about today?"
            className="mt-2 w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 dark:border-zinc-800 dark:bg-zinc-900"
          />

          <span className="mt-1 block text-right text-xs text-zinc-400">
            {note.length} / 280
          </span>
        </label>

        <div className="mt-6 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
          <BatteryCharging
            size={19}
            className="mt-0.5 shrink-0"
          />

          <p className="text-sm leading-6">
            This rest day will be saved separately and
            will not increase sessions, gym time or
            weekly streaks.
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
            disabled={
              !selectedDate ||
              selectedDateHasWorkout
            }
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />
            Save Rest Day
          </button>
        </div>
      </div>
    </div>
  );
}
