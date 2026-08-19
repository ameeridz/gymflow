import { CalendarDays, History } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export default function HistoryPage() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Activity
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Your history
            </h1>

            <p className="mt-3 max-w-xl text-zinc-500 dark:text-zinc-400">
              Every visit counts, including the short sessions.
            </p>
          </div>

          <ThemeToggle />
        </header>

        <section className="mt-10 flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
            <History size={25} />
          </div>

          <h2 className="mt-5 text-xl font-black">
            No sessions yet
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Your completed gym sessions will appear here after your first
            check-in.
          </p>

          <div className="mt-6 flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            <CalendarDays size={17} />
            Start by checking in from the Today page.
          </div>
        </section>
      </div>
    </main>
  );
}