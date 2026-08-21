"use client";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Frown,
  HeartPulse,
  History,
  Meh,
  Pencil,
  Smile,
  Sparkles,
  Timer,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import {
  useState,
  useSyncExternalStore,
} from "react";

import { EditSessionDialog } from "@/components/history/edit-session-dialog";
import {
  HistoryActivityFilter,
  type HistoryActivityFilter as HistoryActivityFilterValue,
} from "@/components/history/history-activity-filter";
import {
  HistorySearchSort,
  type HistorySortOrder,
} from "@/components/history/history-search-sort";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSessionStore } from "@/stores/session-store";
import type {
  ActivityType,
  GymSession,
  SessionMood,
} from "@/types/session";

const activityLabels: Record<
  ActivityType,
  string
> = {
  strength: "Strength",
  cardio: "Cardio",
  mixed: "Mixed",
  mobility: "Mobility",
  quick: "Quick Session",
};

const activityIcons = {
  strength: Dumbbell,
  cardio: HeartPulse,
  mixed: Sparkles,
  mobility: Zap,
  quick: Timer,
};

const moodLabels: Record<
  SessionMood,
  string
> = {
  tough: "Tough",
  okay: "Okay",
  great: "Great",
};

const moodIcons = {
  tough: Frown,
  okay: Meh,
  great: Smile,
};

function subscribe() {
  return () => {};
}

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

function formatDuration(
  totalSeconds: number | null,
) {
  if (!totalSeconds) {
    return "Less than 1 min";
  }

  const hours = Math.floor(
    totalSeconds / 3600,
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60,
  );

  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }

  if (minutes > 0) {
    return `${minutes} min ${seconds} sec`;
  }

  return `${seconds} sec`;
}

function formatSessionDate(dateValue: string) {
  return new Intl.DateTimeFormat("en-MY", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

interface SessionCardProps {
  session: GymSession;
  onEdit: (session: GymSession) => void;
  onDelete: (session: GymSession) => void;
}

function SessionCard({
  session,
  onEdit,
  onDelete,
}: SessionCardProps) {
  const ActivityIcon =
    activityIcons[session.activityType];

  const MoodIcon = session.mood
    ? moodIcons[session.mood]
    : Meh;

  const moodLabel = session.mood
    ? moodLabels[session.mood]
    : "Not recorded";

  const activityLabel =
    activityLabels[session.activityType];

  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
          <ActivityIcon size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-black">
                {activityLabel}
              </h2>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {formatSessionDate(
                  session.startedAt,
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                Completed
              </span>

              <button
                type="button"
                onClick={() => onEdit(session)}
                aria-label={`Edit ${activityLabel} session`}
                title="Edit session"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-200 text-violet-600 transition hover:bg-violet-50 active:scale-95 dark:border-violet-500/20 dark:text-violet-400 dark:hover:bg-violet-500/10"
              >
                <Pencil size={16} />
              </button>

              <button
                type="button"
                onClick={() => onDelete(session)}
                aria-label={`Delete ${activityLabel} session`}
                title="Delete session"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 text-rose-600 transition hover:bg-rose-50 active:scale-95 dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800">
              <Clock3 size={16} />

              {formatDuration(
                session.durationSeconds,
              )}
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800">
              <MoodIcon size={16} />

              {moodLabel}
            </div>
          </div>

          {session.note ? (
            <p className="mt-5 rounded-2xl bg-zinc-100 p-4 text-sm leading-6 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              {session.note}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}

interface DeleteSessionDialogProps {
  session: GymSession;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteSessionDialog({
  session,
  onCancel,
  onConfirm,
}: DeleteSessionDialogProps) {
  const ActivityIcon =
    activityIcons[session.activityType];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-session-title"
      className="fixed inset-0 z-[120] flex items-end justify-center bg-zinc-950/70 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-[2rem] border border-zinc-200 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-md sm:rounded-[2rem] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
            <Trash2 size={22} />
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label="Close delete confirmation"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={19} />
          </button>
        </div>

        <h2
          id="delete-session-title"
          className="mt-6 text-2xl font-black tracking-tight"
        >
          Delete this session?
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          This completed session will be removed from
          your History and all related progress
          calculations.
        </p>

        <div className="mt-5 rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
              <ActivityIcon size={19} />
            </div>

            <div>
              <p className="font-bold">
                {
                  activityLabels[
                    session.activityType
                  ]
                }
              </p>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {formatSessionDate(
                  session.startedAt,
                )}
              </p>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {formatDuration(
                  session.durationSeconds,
                )}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-sm font-semibold text-rose-600 dark:text-rose-400">
          This action cannot be undone.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-2xl border border-zinc-200 px-4 py-3 font-bold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 font-bold text-white transition hover:bg-rose-700 active:scale-[0.98]"
          >
            <Trash2 size={17} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const mounted = useMounted();

  const [activityFilter, setActivityFilter] =
    useState<HistoryActivityFilterValue>("all");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState<HistorySortOrder>("newest");

  const completedSessions = useSessionStore(
    (state) => state.completedSessions,
  );

  const updateCompletedSession =
    useSessionStore(
      (state) =>
        state.updateCompletedSession,
    );

  const deleteCompletedSession =
    useSessionStore(
      (state) =>
        state.deleteCompletedSession,
    );

  const [
    sessionPendingEdit,
    setSessionPendingEdit,
  ] = useState<GymSession | null>(null);

  const [
    sessionPendingDelete,
    setSessionPendingDelete,
  ] = useState<GymSession | null>(null);

  const [feedback, setFeedback] =
    useState<string | null>(null);

  const sessions = [...completedSessions].sort(
    (firstSession, secondSession) =>
      new Date(
        secondSession.startedAt,
      ).getTime() -
      new Date(
        firstSession.startedAt,
      ).getTime(),
  );

  const sessionCounts: Record<
    HistoryActivityFilterValue,
    number
  > = {
    all: sessions.length,

    strength: sessions.filter(
      (session) =>
        session.activityType === "strength",
    ).length,

    cardio: sessions.filter(
      (session) =>
        session.activityType === "cardio",
    ).length,

    mixed: sessions.filter(
      (session) =>
        session.activityType === "mixed",
    ).length,

    mobility: sessions.filter(
      (session) =>
        session.activityType === "mobility",
    ).length,

    quick: sessions.filter(
      (session) =>
        session.activityType === "quick",
    ).length,
  };

  const normalizedSearchQuery =
    searchQuery.trim().toLowerCase();

  const activityFilteredSessions =
    activityFilter === "all"
      ? sessions
      : sessions.filter(
          (session) =>
            session.activityType ===
            activityFilter,
        );

  const searchedSessions =
    normalizedSearchQuery.length === 0
      ? activityFilteredSessions
      : activityFilteredSessions.filter(
          (session) => {
            const activityLabel =
              activityLabels[
                session.activityType
              ].toLowerCase();

            const moodLabel = session.mood
              ? moodLabels[
                  session.mood
                ].toLowerCase()
              : "";

            const note =
              session.note.toLowerCase();

            return (
              note.includes(
                normalizedSearchQuery,
              ) ||
              activityLabel.includes(
                normalizedSearchQuery,
              ) ||
              moodLabel.includes(
                normalizedSearchQuery,
              )
            );
          },
        );

  const filteredSessions = [
    ...searchedSessions,
  ].sort((firstSession, secondSession) => {
    const firstTime = new Date(
      firstSession.startedAt,
    ).getTime();

    const secondTime = new Date(
      secondSession.startedAt,
    ).getTime();

    return sortOrder === "newest"
      ? secondTime - firstTime
      : firstTime - secondTime;
  });

  const activeFilterLabel =
    activityFilter === "all"
      ? "All"
      : activityLabels[activityFilter];

  const hasActiveSearch =
    normalizedSearchQuery.length > 0;

  function handleEditRequest(
    session: GymSession,
  ) {
    setFeedback(null);
    setSessionPendingEdit(session);
  }

  function handleCloseEdit() {
    setSessionPendingEdit(null);
  }

  function handleSaveEdit(
    sessionId: string,
    updates: {
      activityType: ActivityType;
      mood: SessionMood;
      note: string;
    },
  ) {
    updateCompletedSession(
      sessionId,
      updates,
    );

    setSessionPendingEdit(null);

    setFeedback(
      "Session updated successfully. Your History now reflects the latest changes.",
    );
  }

  function handleDeleteRequest(
    session: GymSession,
  ) {
    setFeedback(null);
    setSessionPendingDelete(session);
  }

  function handleCancelDelete() {
    setSessionPendingDelete(null);
  }

  function handleConfirmDelete() {
    if (!sessionPendingDelete) {
      return;
    }

    const sessionLabel =
      activityLabels[
        sessionPendingDelete.activityType
      ];

    deleteCompletedSession(
      sessionPendingDelete.id,
    );

    setSessionPendingDelete(null);

    setFeedback(
      `${sessionLabel} session deleted successfully. Your progress has been updated.`,
    );
  }

  function handleClearResults() {
    setActivityFilter("all");
    setSearchQuery("");
  }

  return (
    <div className="contents">
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
                Every visit counts, including the short
                sessions.
              </p>
            </div>

            <ThemeToggle />
          </header>

          {mounted && sessions.length > 0 ? (
            <div className="mt-8 space-y-4">
              <HistoryActivityFilter
                value={activityFilter}
                onChange={setActivityFilter}
                sessionCounts={sessionCounts}
              />

              <HistorySearchSort
                searchQuery={searchQuery}
                sortOrder={sortOrder}
                onSearchChange={setSearchQuery}
                onSortChange={setSortOrder}
              />
            </div>
          ) : null}

          {feedback ? (
            <div className="mt-6 flex items-start gap-3 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0"
              />

              <p>{feedback}</p>
            </div>
          ) : null}

          {!mounted ? (
            <section className="mt-10 min-h-72 animate-pulse rounded-3xl bg-zinc-200 dark:bg-zinc-900" />
          ) : sessions.length === 0 ? (
            <section className="mt-10 flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                <History size={25} />
              </div>

              <h2 className="mt-5 text-xl font-black">
                No sessions yet
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Your completed gym sessions will appear
                here after your first check-in.
              </p>

              <div className="mt-6 flex items-center gap-2 rounded-2xl bg-zinc-100 px-4 py-3 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                <CalendarDays size={17} />
                Start by checking in from the Today page.
              </div>
            </section>
          ) : filteredSessions.length === 0 ? (
            <section className="mt-8 flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                <History size={25} />
              </div>

              <h2 className="mt-5 text-xl font-black">
                {hasActiveSearch
                  ? "No matching sessions"
                  : `No ${activeFilterLabel.toLowerCase()} sessions`}
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {hasActiveSearch
                  ? `No sessions match "${searchQuery.trim()}". Try another keyword or clear the search.`
                  : "There are no completed sessions matching this activity filter yet."}
              </p>

              <button
                type="button"
                onClick={handleClearResults}
                className="mt-6 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
              >
                {hasActiveSearch
                  ? "Clear Search"
                  : "Show All Sessions"}
              </button>
            </section>
          ) : (
            <section className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                  {filteredSessions.length}{" "}
                  {hasActiveSearch
                    ? "matching"
                    : activityFilter === "all"
                      ? "completed"
                      : activeFilterLabel.toLowerCase()}{" "}
                  {filteredSessions.length === 1
                    ? "session"
                    : "sessions"}
                </p>
              </div>

              {filteredSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onEdit={handleEditRequest}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </section>
          )}
        </div>
      </main>

      {sessionPendingEdit ? (
        <EditSessionDialog
          key={sessionPendingEdit.id}
          session={sessionPendingEdit}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      ) : null}

      {sessionPendingDelete ? (
        <DeleteSessionDialog
          session={sessionPendingDelete}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      ) : null}
    </div>
  );
}