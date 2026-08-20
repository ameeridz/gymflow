"use client";

import { Dumbbell, Flame, Target } from "lucide-react";
import { useState } from "react";

import { ActiveSessionCard } from "@/components/check-in/active-session-card";
import { CheckInDialog } from "@/components/check-in/check-in-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSessionStore } from "@/stores/session-store";

export default function Home() {
  const [checkInOpen, setCheckInOpen] =
    useState(false);

  const activeSession = useSessionStore(
    (state) => state.activeSession,
  );

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between lg:justify-end">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
              <Dumbbell size={22} />
            </div>

            <div>
              <p className="text-lg font-black tracking-tight">
                GymFlow
              </p>

              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Build consistency
              </p>
            </div>
          </div>

          <ThemeToggle />
        </header>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
              Wednesday, 19 August
            </p>

            <h1 className="mt-3 max-w-xl text-4xl font-black tracking-tight sm:text-5xl">
              {activeSession
                ? "You showed up."
                : "Ready to show up today?"}
            </h1>

            <p className="mt-4 max-w-lg text-base leading-7 text-zinc-600 dark:text-zinc-400">
              {activeSession
                ? "Your session is active. Focus on moving and let GymFlow count the time."
                : "You do not need the perfect workout. Start with a small commitment and protect the habit."}
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  This week
                </p>

                <p className="mt-1 text-3xl font-black">
                  2 / 3
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                <Target size={23} />
              </div>
            </div>

            <div className="mt-6 h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" />
            </div>

            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
              One more session to achieve your weekly
              target.
            </p>
          </div>
        </section>

        {activeSession ? (
          <ActiveSessionCard />
        ) : (
          <section className="mt-8 rounded-[2rem] bg-gradient-to-br from-violet-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-2xl shadow-violet-600/20 sm:p-8">
            <div className="flex max-w-xl flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                <Flame size={23} />
              </div>

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-violet-100">
                Today&apos;s commitment
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Just begin.
              </h2>

              <p className="mt-3 text-violet-100">
                Check in when you arrive and let the
                session count itself.
              </p>

              <button
                type="button"
                onClick={() => setCheckInOpen(true)}
                className="mt-7 rounded-2xl bg-white px-6 py-4 font-bold text-violet-700 transition hover:bg-violet-50 active:scale-[0.98]"
              >
                Check In Now
              </button>
            </div>
          </section>
        )}

        <CheckInDialog
          open={checkInOpen}
          onClose={() => setCheckInOpen(false)}
        />
      </div>
    </main>
  );
}