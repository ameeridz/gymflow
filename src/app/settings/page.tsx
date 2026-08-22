"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileJson,
  Palette,
  RotateCcw,
  Target,
  Upload,
  UserRound,
  XCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import {
  parseBackupFile,
  type GymFlowBackup,
} from "@/lib/backup-validation";
import { useRestDayStore } from "@/stores/rest-day-store";
import { useSessionStore } from "@/stores/session-store";
import { useSettingsStore } from "@/stores/settings-store";
import { useToastStore } from "@/stores/toast-store";

const weeklyTargetOptions = [2, 3, 4, 5, 6, 7];
const themeOptions = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

type ImportMessage = {
  type: "success" | "error";
  text: string;
} | null;

function formatBackupDate(dateValue: string) {
  return new Intl.DateTimeFormat("en-MY", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const showToast = useToastStore((state) => state.showToast);

  const displayName = useSettingsStore((state) => state.displayName);
  const setDisplayName = useSettingsStore((state) => state.setDisplayName);
  const weeklyTarget = useSettingsStore((state) => state.weeklyTarget);
  const setWeeklyTarget = useSettingsStore((state) => state.setWeeklyTarget);
  const restoreSettings = useSettingsStore((state) => state.restoreSettings);

  const activeSession = useSessionStore((state) => state.activeSession);
  const completedSessions = useSessionStore(
    (state) => state.completedSessions,
  );
  const restoreCompletedSessions = useSessionStore(
    (state) => state.restoreCompletedSessions,
  );

  const restDays = useRestDayStore((state) => state.restDays);
  const restoreRestDays = useRestDayStore(
    (state) => state.restoreRestDays,
  );

  const [nameInput, setNameInput] = useState(displayName);
  const [showResetConfirmation, setShowResetConfirmation] =
    useState(false);
  const [selectedBackup, setSelectedBackup] =
    useState<GymFlowBackup | null>(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [importMessage, setImportMessage] =
    useState<ImportMessage>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleSaveName() {
    const cleanName = nameInput.trim().slice(0, 40);
    setDisplayName(cleanName);
    setNameInput(cleanName);
    showToast({
      type: "success",
      title: "Name saved",
      description: cleanName
        ? `GymFlow will greet you as ${cleanName}.`
        : "Your personal greeting has been removed.",
    });
  }

  function handleExportData() {
    const backup: GymFlowBackup = {
      version: 2,
      exportedAt: new Date().toISOString(),
      settings: {
        displayName,
        weeklyTarget,
        theme:
          theme === "light" || theme === "dark" || theme === "system"
            ? theme
            : "system",
      },
      completedSessions,
      restDays,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const exportDate = new Date().toISOString().split("T")[0];

    link.href = downloadUrl;
    link.download = `gymflow-backup-${exportDate}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(downloadUrl);
  }

  function clearSelectedBackup() {
    setSelectedBackup(null);
    setSelectedFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleImportRequest() {
    if (activeSession) {
      showToast({
        type: "warning",
        title: "Active session in progress",
        description:
          "Finish or cancel your active session before importing a backup.",
        duration: 6000,
      });
      return;
    }
    fileInputRef.current?.click();
  }

  async function handleBackupFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    setImportMessage(null);
    setSelectedBackup(null);
    setSelectedFileName("");

    if (activeSession) {
      setImportMessage({
        type: "error",
        text: "Finish or cancel your active session before importing a backup.",
      });
      event.target.value = "";
      return;
    }
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".json")) {
      setImportMessage({
        type: "error",
        text: "Please select a GymFlow JSON backup file.",
      });
      event.target.value = "";
      return;
    }

    try {
      const validationResult = parseBackupFile(await file.text());
      if (!validationResult.valid) {
        setImportMessage({ type: "error", text: validationResult.error });
        event.target.value = "";
        return;
      }
      setSelectedBackup(validationResult.data);
      setSelectedFileName(file.name);
    } catch {
      setImportMessage({
        type: "error",
        text: "GymFlow could not read the selected backup file.",
      });
      event.target.value = "";
    }
  }

  function handleConfirmImport() {
    if (!selectedBackup) return;
    if (activeSession) {
      clearSelectedBackup();
      showToast({
        type: "warning",
        title: "Import blocked",
        description:
          "Finish or cancel your active session before restoring a backup.",
        duration: 6000,
      });
      return;
    }

    restoreCompletedSessions(selectedBackup.completedSessions);
    restoreRestDays(selectedBackup.restDays);
    restoreSettings({
      displayName: selectedBackup.settings.displayName,
      weeklyTarget: selectedBackup.settings.weeklyTarget,
    });
    setTheme(selectedBackup.settings.theme);
    setNameInput(selectedBackup.settings.displayName);

    const sessionCount = selectedBackup.completedSessions.length;
    const restDayCount = selectedBackup.restDays.length;
    clearSelectedBackup();
    showToast({
      type: "success",
      title: "Backup restored",
      description: `${sessionCount} completed ${
        sessionCount === 1 ? "session" : "sessions"
      }, ${restDayCount} rest ${
        restDayCount === 1 ? "day" : "days"
      } and your preferences were restored successfully.`,
    });
  }

  function handleResetData() {
    localStorage.removeItem("gymflow-session-storage");
    localStorage.removeItem("gymflow-settings-storage");
    localStorage.removeItem("gymflow-rest-day-storage");
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
                <UserRound size={21} />
              </div>
              <div>
                <p className="font-bold">Personal greeting</p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Enter a name or nickname for your Today greeting.
                </p>
              </div>
            </div>
            <label className="mt-5 block">
              <span className="text-sm font-bold">Display name</span>
              <input
                type="text"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") handleSaveName();
                }}
                maxLength={40}
                placeholder="What should GymFlow call you?"
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 outline-none transition placeholder:text-zinc-400 focus:border-violet-600 focus:ring-2 focus:ring-violet-600/15 dark:border-zinc-800 dark:bg-zinc-950"
              />
            </label>
            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="text-xs text-zinc-400">{nameInput.length} / 40</p>
              <button
                type="button"
                onClick={handleSaveName}
                disabled={nameInput.trim() === displayName}
                className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Name
              </button>
            </div>
          </article>

          <article className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                <Target size={21} />
              </div>
              <div>
                <p className="font-bold">Weekly target</p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Choose how many days you want to train each week. Multiple
                  sessions on one day count as one training day.
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
              {weeklyTargetOptions.map((target) => {
                const selected = weeklyTarget === target;
                return (
                  <button
                    key={target}
                    type="button"
                    onClick={() => {
                      setWeeklyTarget(target);
                      showToast({
                        type: "success",
                        title: "Weekly goal updated",
                        description: `Your new target is ${target} training days per week.`,
                      });
                    }}
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
            <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              Changing your target recalculates current and previous weekly
              streaks using the new training-day goal.
            </p>
          </article>

          <article className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                <Palette size={21} />
              </div>
              <div>
                <p className="font-bold">Appearance</p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Choose a theme or follow your device.
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {themeOptions.map((option) => {
                const selected = theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
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
                <FileJson size={21} />
              </div>
              <div>
                <p className="font-bold">Backup data</p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Export or restore your workouts, rest days and preferences.
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
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleBackupFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={handleImportRequest}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-5 py-3 font-bold text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <Upload size={18} />
              Import Backup
            </button>

            {activeSession ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/20 dark:bg-amber-500/10">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 shrink-0 text-amber-700 dark:text-amber-300" size={19} />
                  <div>
                    <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
                      Active session in progress
                    </p>
                    <p className="mt-1 text-xs leading-5 text-amber-700/80 dark:text-amber-300/75">
                      Backup import is unavailable until the active session is
                      finished or cancelled. Export remains available.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="mt-4 w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-700 active:scale-[0.98]"
                >
                  Go to Today
                </button>
              </div>
            ) : null}

            {importMessage ? (
              <div
                className={`mt-4 flex items-start gap-3 rounded-2xl p-4 text-sm ${
                  importMessage.type === "success"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
                }`}
              >
                {importMessage.type === "success" ? (
                  <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                ) : (
                  <XCircle size={19} className="mt-0.5 shrink-0" />
                )}
                <p>{importMessage.text}</p>
              </div>
            ) : null}

            {selectedBackup ? (
              <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-500/20 dark:bg-violet-500/10">
                <p className="font-bold text-violet-700 dark:text-violet-300">
                  Backup ready to import
                </p>
                <p className="mt-1 break-all text-xs text-violet-600/80 dark:text-violet-300/70">
                  {selectedFileName}
                </p>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div><dt className="text-zinc-500 dark:text-zinc-400">Exported</dt><dd className="mt-1 font-bold">{formatBackupDate(selectedBackup.exportedAt)}</dd></div>
                  <div><dt className="text-zinc-500 dark:text-zinc-400">Completed sessions</dt><dd className="mt-1 font-bold">{selectedBackup.completedSessions.length}</dd></div>
                  <div><dt className="text-zinc-500 dark:text-zinc-400">Rest days</dt><dd className="mt-1 font-bold">{selectedBackup.restDays.length}</dd></div>
                  <div><dt className="text-zinc-500 dark:text-zinc-400">Display name</dt><dd className="mt-1 font-bold">{selectedBackup.settings.displayName || "Not set"}</dd></div>
                  <div><dt className="text-zinc-500 dark:text-zinc-400">Weekly target</dt><dd className="mt-1 font-bold">{selectedBackup.settings.weeklyTarget} training days</dd></div>
                  <div><dt className="text-zinc-500 dark:text-zinc-400">Theme</dt><dd className="mt-1 font-bold capitalize">{selectedBackup.settings.theme}</dd></div>
                </dl>
                <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Importing will replace your current completed sessions, rest
                  days and preferences. Active sessions will not be restored.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button type="button" onClick={clearSelectedBackup} className="rounded-xl border border-zinc-200 px-4 py-3 font-bold transition hover:bg-white dark:border-zinc-700 dark:hover:bg-zinc-900">Cancel</button>
                  <button type="button" onClick={handleConfirmImport} className="rounded-xl bg-violet-600 px-4 py-3 font-bold text-white transition hover:bg-violet-700">Confirm Import</button>
                </div>
              </div>
            ) : null}
          </article>

          <article className="rounded-3xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-500/20 dark:bg-rose-500/10 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                <RotateCcw size={21} />
              </div>
              <div>
                <p className="font-bold text-rose-700 dark:text-rose-300">Reset GymFlow</p>
                <p className="mt-1 text-sm text-rose-600/80 dark:text-rose-300/70">
                  Permanently delete sessions, rest days and reset all preferences.
                </p>
              </div>
            </div>
            {!showResetConfirmation ? (
              <button type="button" onClick={() => setShowResetConfirmation(true)} className="mt-5 w-full rounded-2xl bg-rose-600 px-5 py-3 font-bold text-white transition hover:bg-rose-700">Reset All Data</button>
            ) : (
              <div className="mt-5 rounded-2xl bg-white/70 p-4 dark:bg-zinc-950/40">
                <p className="text-sm font-bold text-rose-700 dark:text-rose-300">Delete all GymFlow data?</p>
                <p className="mt-1 text-sm text-rose-600/80 dark:text-rose-300/70">
                  {activeSession
                    ? "An active session is currently running. Resetting will permanently discard it together with all workouts, rest days and preferences."
                    : "This action cannot be undone. Export a backup first if needed."}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setShowResetConfirmation(false)} className="rounded-xl border border-zinc-200 px-4 py-3 font-bold dark:border-zinc-700">Cancel</button>
                  <button type="button" onClick={handleResetData} className="rounded-xl bg-rose-600 px-4 py-3 font-bold text-white transition hover:bg-rose-700">Yes, Reset</button>
                </div>
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
  );
}
