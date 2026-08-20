import { Settings } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export default function SettingsPage() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-3xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            Preferences
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Settings
          </h1>

          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            Adjust GymFlow to match your routine.
          </p>
        </header>

        <section className="mt-10 space-y-4">
          <article className="flex items-center justify-between gap-4 rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                <Settings size={21} />
              </div>

              <div>
                <p className="font-bold">Appearance</p>

                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Switch between light and dark themes.
                </p>
              </div>
            </div>

            <ThemeToggle />
          </article>
        </section>
      </div>
    </main>
  );
}