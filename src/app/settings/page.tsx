"use client";

import {
  Download,
  Palette,
  RotateCcw,
  Target,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";

import { useSessionStore } from "@/stores/session-store";
import { useSettingsStore } from "@/stores/settings-store";

const weeklyTargetOptions = [2, 3, 4, 5];

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
};

const themeOptions: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
  },
  {
    value: "dark",
    label: "Dark",
  },
  {
    value: "system",
    label: "System",
  },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const weeklyTarget = useSettingsStore(
    (state) => state.weeklyTarget,
  );

  const setWeeklyTarget = useSettingsStore(
    (state) => state.setWeeklyTarget,
  );

  const completedSessions = useSessionStore(
    (state) => state.completedSessions,
  );

  const [showResetConfirmation, setShowResetConfirmation] =
    useState(false);

  function handleExportData() {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings: {
        weeklyTarget,
        theme: theme ?? "system",
      },
      completedSessions,
    };

    const fileContent = JSON.stringify(
      backup,
      null,
      2,
    );

    const blob = new Blob([fileContent], {
      type: "application/json",
    });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const exportDate = new Date()
      .toISOString()
      .split("T")[0];

    link.href = downloadUrl;
    link.download = `gymflow-backup-${exportDate}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadUrl);
  }

  function handleResetData() {
    localStorage.removeItem(
      "gymflow-session-storage",
    );

    localStorage.removeItem(
      "gymflow-settings-storage",
    );

    setShowResetConfirmation(false);
    window.location.reload();
  }

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

        <section className="mt-10 space-y-5">
          <article className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                <Target size={21} />
              </div>

              <div>
                <p className="font-bold">
                  Weekly target
                </p>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Choose how many sessions you want to
                  complete each week.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2">
              {weeklyTargetOptions.map((target) => {
                const selected =
                  weeklyTarget === target;

                return (
                  <button
                    key={target}
                    type="button"
                    onClick={() =>
                      setWeeklyTarget(target)
                    }
                    className={`rounded-2xl px-4 py-3 font-bold transition ${
                      selected
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {target}
                  </button>
                );
              })}
            </div>
          </article>

          <article className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                <Palette size={21} />
              </div>

              <div>
                <p className="font-bold">
                  Appearance
                </p>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Choose a theme or follow your device.
                </p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2">
              {themeOptions.map((option) => {
                const selected =
                  theme === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setTheme(option.value)
                    }
                    className={`rounded-2xl px-3 py-3 text-sm font-bold transition ${
                      selected
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </article>

          <article className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                <Download size={21} />
              </div>

              <div>
                <p className="font-bold">
                  Backup data
                </p>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Download your GymFlow history and
                  preferences as JSON.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleExportData}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-100 px-5 py-3 font-bold text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
            >
              <Download size={18} />
              Export Backup
            </button>

            <button
              type="button"
              disabled
              className="mt-3 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-5 py-3 font-bold text-zinc-400 dark:border-zinc-700"
            >
              <Upload size={18} />
              Import Coming Soon
            </button>
          </article>

          <article className="rounded-3xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-500/20 dark:bg-rose-500/10 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                <RotateCcw size={21} />
              </div>

              <div>
                <p className="font-bold text-rose-700 dark:text-rose-300">
                  Reset GymFlow
                </p>

                <p className="mt-1 text-sm text-rose-600/80 dark:text-rose-300/70">
                  Permanently delete sessions and reset
                  all preferences.
                </p>
              </div>
            </div>

            {!showResetConfirmation ? (
              <button
                type="button"
                onClick={() =>
                  setShowResetConfirmation(true)
                }
                className="mt-5 w-full rounded-2xl bg-rose-600 px-5 py-3 font-bold text-white transition hover:bg-rose-700"
              >
                Reset All Data
              </button>
            ) : (
              <div className="mt-5 rounded-2xl bg-white/70 p-4 dark:bg-zinc-950/40">
                <p className="text-sm font-bold text-rose-700 dark:text-rose-300">
                  Delete all GymFlow data?
                </p>

                <p className="mt-1 text-sm text-rose-600/80 dark:text-rose-300/70">
                  This action cannot be undone. Export a
                  backup first if needed.
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setShowResetConfirmation(false)
                    }
                    className="rounded-xl border border-zinc-200 px-4 py-3 font-bold dark:border-zinc-700"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleResetData}
                    className="rounded-xl bg-rose-600 px-4 py-3 font-bold text-white transition hover:bg-rose-700"
                  >
                    Yes, Reset
                  </button>
                </div>
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}