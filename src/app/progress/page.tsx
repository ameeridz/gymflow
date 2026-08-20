import { ChartNoAxesColumnIncreasing } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export default function ProgressPage() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Consistency
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Your progress
            </h1>

            <p className="mt-3 text-zinc-500 dark:text-zinc-400">
              Progress is built by returning, not by being
              perfect.
            </p>
          </div>

          <ThemeToggle />
        </header>

        <section className="mt-10 flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
            <ChartNoAxesColumnIncreasing size={25} />
          </div>

          <h2 className="mt-5 text-xl font-black">
            Progress dashboard coming next
          </h2>

          <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Your completed sessions, total time and weekly
            consistency will appear here.
          </p>
        </section>
      </div>
    </main>
  );
}