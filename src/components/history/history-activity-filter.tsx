"use client";

import {
  Activity,
  Dumbbell,
  HeartPulse,
  LayoutGrid,
  Timer,
  Zap,
} from "lucide-react";

import type { ActivityType } from "@/types/session";

export type HistoryActivityFilter =
  | "all"
  | ActivityType;

interface HistoryActivityFilterProps {
  value: HistoryActivityFilter;
  onChange: (
    value: HistoryActivityFilter,
  ) => void;
  sessionCounts: Record<
    HistoryActivityFilter,
    number
  >;
}

const filterOptions: {
  value: HistoryActivityFilter;
  label: string;
  icon: typeof Dumbbell;
}[] = [
  {
    value: "all",
    label: "All",
    icon: LayoutGrid,
  },
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

export function HistoryActivityFilter({
  value,
  onChange,
  sessionCounts,
}: HistoryActivityFilterProps) {
  return (
    <div
      aria-label="Filter sessions by activity"
      className="flex gap-2 overflow-x-auto pb-2"
    >
      {filterOptions.map((option) => {
        const Icon = option.icon;
        const selected =
          value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              onChange(option.value)
            }
            aria-pressed={selected}
            className={`flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
              selected
                ? "border-violet-600 bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            <Icon size={17} />

            <span>{option.label}</span>

            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                selected
                  ? "bg-white/15 text-white"
                  : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {sessionCounts[option.value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}