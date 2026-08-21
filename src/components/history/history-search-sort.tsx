"use client";

import {
  ArrowDownAZ,
  ArrowUpAZ,
  Search,
  X,
} from "lucide-react";

export type HistorySortOrder =
  | "newest"
  | "oldest";

interface HistorySearchSortProps {
  searchQuery: string;
  sortOrder: HistorySortOrder;
  onSearchChange: (value: string) => void;
  onSortChange: (
    value: HistorySortOrder,
  ) => void;
}

export function HistorySearchSort({
  searchQuery,
  sortOrder,
  onSearchChange,
  onSortChange,
}: HistorySearchSortProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
      <label className="relative block">
        <span className="sr-only">
          Search session notes
        </span>

        <Search
          size={18}
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
        />

        <input
          type="search"
          value={searchQuery}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search session notes..."
          className="h-12 w-full rounded-2xl border border-zinc-200 bg-white pl-11 pr-11 text-sm outline-none transition placeholder:text-zinc-400 focus:border-violet-600 focus:ring-2 focus:ring-violet-600/15 dark:border-zinc-800 dark:bg-zinc-900"
        />

        {searchQuery ? (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label="Clear session search"
            title="Clear search"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <X size={16} />
          </button>
        ) : null}
      </label>

      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-900">
        <button
          type="button"
          onClick={() =>
            onSortChange("newest")
          }
          aria-pressed={
            sortOrder === "newest"
          }
          className={`flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition ${
            sortOrder === "newest"
              ? "bg-white text-violet-600 shadow-sm dark:bg-zinc-800 dark:text-violet-400"
              : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          }`}
        >
          <ArrowDownAZ size={17} />
          Newest
        </button>

        <button
          type="button"
          onClick={() =>
            onSortChange("oldest")
          }
          aria-pressed={
            sortOrder === "oldest"
          }
          className={`flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition ${
            sortOrder === "oldest"
              ? "bg-white text-violet-600 shadow-sm dark:bg-zinc-800 dark:text-violet-400"
              : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          }`}
        >
          <ArrowUpAZ size={17} />
          Oldest
        </button>
      </div>
    </div>
  );
}