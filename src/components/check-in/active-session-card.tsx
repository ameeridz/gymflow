"use client";

import { Clock3, Square, X } from "lucide-react";
import { useEffect, useState } from "react";

import { FinishSessionDialog } from "@/components/check-in/finish-session-dialog";
import { useSessionStore } from "@/stores/session-store";
import type { ActivityType } from "@/types/session";

const activityLabels: Record<ActivityType, string> = {
  strength: "Strength",
  cardio: "Cardio",
  mixed: "Mixed",
  mobility: "Mobility",
  quick: "Quick Session",
};

function getElapsedSeconds(startedAt: string) {
  const startTime = new Date(startedAt).getTime();
  const currentTime = Date.now();

  return Math.max(
    0,
    Math.floor((currentTime - startTime) / 1000),
  );
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export function ActiveSessionCard() {
  const activeSession = useSessionStore(
    (state) => state.activeSession,
  );

  const cancelSession = useSessionStore(
    (state) => state.cancelSession,
  );

  const [elapsedSeconds, setElapsedSeconds] = useState(
    () =>
      activeSession
        ? getElapsedSeconds(activeSession.startedAt)
        : 0,
  );

  const [finishDialogOpen, setFinishDialogOpen] =
    useState(false);

  useEffect(() => {
  if (!activeSession) {
    return;
  }

  const interval = window.setInterval(() => {
    setElapsedSeconds(
      getElapsedSeconds(activeSession.startedAt),
    );
  }, 1000);

  return () => {
    window.clearInterval(interval);
  };
}, [activeSession]);

  if (!activeSession) {
    return null;
  }

  return (
    <>
      <section className="mt-8 overflow-hidden rounded-[2rem] border border-violet-500/30 bg-gradient-to-br from-violet-600 via-violet-600 to-fuchsia-600 p-6 text-white shadow-2xl shadow-violet-600/20 sm:p-8">
        <div className="flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <Clock3 size={23} />
            </div>

            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider">
              Session active
            </span>
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-violet-100">
            {activityLabels[activeSession.activityType]}
          </p>

          <p className="mt-3 font-mono text-5xl font-black tracking-tight sm:text-6xl">
            {formatDuration(elapsedSeconds)}
          </p>

          <p className="mt-4 max-w-lg text-violet-100">
            You already won by showing up. Keep moving at
            your own pace.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setFinishDialogOpen(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-bold text-violet-700 transition hover:bg-violet-50 active:scale-[0.98]"
            >
              <Square size={18} />
              Finish Session
            </button>

            <button
              type="button"
              onClick={cancelSession}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-6 py-4 font-bold text-white transition hover:bg-white/15 active:scale-[0.98]"
            >
              <X size={18} />
              Cancel Session
            </button>
          </div>
        </div>
      </section>

      <FinishSessionDialog
        open={finishDialogOpen}
        onClose={() => setFinishDialogOpen(false)}
      />
    </>
  );
}