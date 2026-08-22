"use client";

import {
  BatteryCharging,
  BedDouble,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  Dumbbell,
  Frown,
  HeartPulse,
  History,
  Meh,
  Pencil,
  ShieldPlus,
  Smile,
  Sparkles,
  Timer,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
import { useRestDayStore } from "@/stores/rest-day-store";
import { useSessionStore } from "@/stores/session-store";
import { useToastStore } from "@/stores/toast-store";
import type {
  RestDay,
  RestDayReason,
} from "@/types/rest-day";
import type {
  ActivityType,
  GymSession,
  SessionMood,
} from "@/types/session";

const activityLabels: Record<ActivityType, string> = {
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

const moodLabels: Record<SessionMood, string> = {
  tough: "Tough",
  okay: "Okay",
  great: "Great",
};

const moodIcons = {
  tough: Frown,
  okay: Meh,
  great: Smile,
};

const restDayLabels: Record<RestDayReason, string> = {
  scheduled: "Scheduled rest",
  recovery: "Recovery",
  "poor-sleep": "Poor sleep",
  busy: "Busy day",
  unwell: "Feeling unwell",
  other: "Other",
};

const restDayIcons = {
  scheduled: CalendarDays,
  recovery: BatteryCharging,
  "poor-sleep": BedDouble,
  busy: BriefcaseBusiness,
  unwell: HeartPulse,
  other: Sparkles,
};

type HistoryRecord =
  | {
      type: "session";
      id: string;
      sortDate: string;
      session: GymSession;
    }
  | {
      type: "rest-day";
      id: string;
      sortDate: string;
      restDay: RestDay;
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

function formatDuration(totalSeconds: number | null) {
  if (!totalSeconds) return "Less than 1 min";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) return `${hours} hr ${minutes} min`;
  if (minutes > 0) return `${minutes} min ${seconds} sec`;
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

function formatRestDayDate(dateValue: string) {
  return new Intl.DateTimeFormat("en-MY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${dateValue}T12:00:00`));
}

function getRestDaySortDate(restDay: RestDay) {
  return `${restDay.date}T12:00:00`;
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
  const ActivityIcon = activityIcons[session.activityType];
  const MoodIcon = session.mood ? moodIcons[session.mood] : Meh;
  const moodLabel = session.mood
    ? moodLabels[session.mood]
    : "Not recorded";
  const activityLabel = activityLabels[session.activityType];

  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
          <ActivityIcon size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-black">{activityLabel}</h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {formatSessionDate(session.startedAt)}
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
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-200 text-violet-600 transition hover:bg-violet-50 active:scale-95 dark:border-violet-500/20 dark:text-violet-400 dark:hover:bg-violet-500/10"
              >
                <Pencil size={16} />
              </button>

              <button
                type="button"
                onClick={() => onDelete(session)}
                aria-label={`Delete ${activityLabel} session`}
                title="Delete session"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 text-rose-600 transition hover:bg-rose-50 active:scale-95 dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-800">
              <Clock3 size={16} />
              {formatDuration(session.durationSeconds)}
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

interface RestDayCardProps {
  restDay: RestDay;
  onDelete: (restDay: RestDay) => void;
}

function RestDayCard({
  restDay,
  onDelete,
}: RestDayCardProps) {
  const ReasonIcon = restDayIcons[restDay.reason];
  const reasonLabel = restDayLabels[restDay.reason];

  return (
    <article className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 shadow-sm dark:border-emerald-500/20 dark:from-emerald-500/10 dark:via-zinc-900 dark:to-teal-500/10 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
          <ReasonIcon size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
  <div className="min-w-0 flex-1">
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="text-lg font-black">
        Rest Day
      </h2>

      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
        Recovery
      </span>
    </div>

    <p className="mt-1 text-sm leading-5 text-zinc-500 dark:text-zinc-400">
      {formatRestDayDate(restDay.date)}
    </p>
  </div>

  <button
    type="button"
    onClick={() => onDelete(restDay)}
    aria-label={`Delete ${reasonLabel} rest day`}
    title="Delete rest day"
    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-200 text-rose-600 transition hover:bg-rose-50 active:scale-95 dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10"
  >
    <Trash2 size={16} />
  </button>
</div>

          <div className="mt-5 flex w-fit items-center gap-2 rounded-xl bg-white/80 px-3 py-2 text-sm font-bold text-emerald-700 dark:bg-zinc-950/40 dark:text-emerald-300">
            <ShieldPlus size={16} />
            {reasonLabel}
          </div>

          <div className="mt-4 rounded-2xl border border-emerald-200/70 bg-emerald-50/80 p-4 dark:border-emerald-500/15 dark:bg-emerald-500/[0.07]">
  <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
    Recovery reminder
  </p>

  <p className="mt-2 text-xs leading-5 text-zinc-600 dark:text-zinc-300 sm:text-sm sm:leading-6">
  Recovery is part of consistency. This day does not
  count as a workout.
</p>

</div>

{restDay.note ? (
  <div className="mt-3 rounded-2xl bg-white/90 p-4 dark:bg-zinc-950/40">
    <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">
      Rest day note
    </p>

    <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
      {restDay.note}
    </p>
  </div>
) : null}
        </div>
      </div>
    </article>
  );
}

interface DeleteDialogProps {
  title: string;
  description: string;
  summaryTitle: string;
  summaryDescription: string;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteDialog({
  title,
  description,
  summaryTitle,
  summaryDescription,
  onCancel,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-record-title"
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
          id="delete-record-title"
          className="mt-6 text-2xl font-black tracking-tight"
        >
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          {description}
        </p>

        <div className="mt-5 rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">
          <p className="font-bold">{summaryTitle}</p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {summaryDescription}
          </p>
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
  const router = useRouter();

  const showToast = useToastStore(
    (state) => state.showToast,
  );

  const restDays = useRestDayStore(
    (state) => state.restDays,
  );
  const deleteRestDay = useRestDayStore(
    (state) => state.deleteRestDay,
  );

  const completedSessions = useSessionStore(
    (state) => state.completedSessions,
  );
  const updateCompletedSession = useSessionStore(
    (state) => state.updateCompletedSession,
  );
  const deleteCompletedSession = useSessionStore(
    (state) => state.deleteCompletedSession,
  );

  const [activityFilter, setActivityFilter] =
    useState<HistoryActivityFilterValue>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] =
    useState<HistorySortOrder>("newest");
  const [sessionPendingEdit, setSessionPendingEdit] =
    useState<GymSession | null>(null);
  const [sessionPendingDelete, setSessionPendingDelete] =
    useState<GymSession | null>(null);
  const [restDayPendingDelete, setRestDayPendingDelete] =
    useState<RestDay | null>(null);

  const sessions = [...completedSessions];

  const sessionCounts: Record<
    HistoryActivityFilterValue,
    number
  > = {
    all: sessions.length + restDays.length,
    "rest-day": restDays.length,
    strength: sessions.filter(
      (session) => session.activityType === "strength",
    ).length,
    cardio: sessions.filter(
      (session) => session.activityType === "cardio",
    ).length,
    mixed: sessions.filter(
      (session) => session.activityType === "mixed",
    ).length,
    mobility: sessions.filter(
      (session) => session.activityType === "mobility",
    ).length,
    quick: sessions.filter(
      (session) => session.activityType === "quick",
    ).length,
  };

  const records: HistoryRecord[] = [
    ...sessions.map((session) => ({
      type: "session" as const,
      id: session.id,
      sortDate: session.startedAt,
      session,
    })),
    ...restDays.map((restDay) => ({
      type: "rest-day" as const,
      id: restDay.id,
      sortDate: getRestDaySortDate(restDay),
      restDay,
    })),
  ];

  const normalizedSearchQuery =
    searchQuery.trim().toLowerCase();

  const activityFilteredRecords =
    activityFilter === "all"
      ? records
      : activityFilter === "rest-day"
        ? records.filter(
            (record) => record.type === "rest-day",
          )
        : records.filter(
            (record) =>
              record.type === "session" &&
              record.session.activityType === activityFilter,
          );

  const searchedRecords =
    normalizedSearchQuery.length === 0
      ? activityFilteredRecords
      : activityFilteredRecords.filter((record) => {
          if (record.type === "rest-day") {
            return (
              "rest day".includes(normalizedSearchQuery) ||
              "recovery".includes(normalizedSearchQuery) ||
              restDayLabels[record.restDay.reason]
                .toLowerCase()
                .includes(normalizedSearchQuery) ||
              record.restDay.note
                .toLowerCase()
                .includes(normalizedSearchQuery)
            );
          }

          const activityLabel =
            activityLabels[
              record.session.activityType
            ].toLowerCase();
          const moodLabel = record.session.mood
            ? moodLabels[record.session.mood].toLowerCase()
            : "";

          return (
            record.session.note
              .toLowerCase()
              .includes(normalizedSearchQuery) ||
            activityLabel.includes(normalizedSearchQuery) ||
            moodLabel.includes(normalizedSearchQuery)
          );
        });

  const filteredRecords = [...searchedRecords].sort(
    (firstRecord, secondRecord) => {
      const firstTime = new Date(
        firstRecord.sortDate,
      ).getTime();
      const secondTime = new Date(
        secondRecord.sortDate,
      ).getTime();

      return sortOrder === "newest"
        ? secondTime - firstTime
        : firstTime - secondTime;
    },
  );

  const activeFilterLabel =
    activityFilter === "all"
      ? "All"
      : activityFilter === "rest-day"
        ? "Rest Day"
        : activityLabels[activityFilter];

  const hasActiveSearch =
    normalizedSearchQuery.length > 0;
  const hasAnyRecords = records.length > 0;

  function handleStartFirstSession() {
    router.push("/?checkin=true");
  }

  function handleEditRequest(session: GymSession) {
    setSessionPendingEdit(session);
  }

  function handleSaveEdit(
    sessionId: string,
    updates: {
      activityType: ActivityType;
      mood: SessionMood;
      note: string;
    },
  ) {
    updateCompletedSession(sessionId, updates);
    setSessionPendingEdit(null);

    showToast({
      type: "success",
      title: "Session updated",
      description:
        "Your activity, mood and note changes have been saved.",
    });
  }

  function handleConfirmSessionDelete() {
    if (!sessionPendingDelete) return;

    const sessionLabel =
      activityLabels[sessionPendingDelete.activityType];

    deleteCompletedSession(sessionPendingDelete.id);
    setSessionPendingDelete(null);

    showToast({
      type: "success",
      title: "Session deleted",
      description: `${sessionLabel} was removed and your progress has been updated.`,
    });
  }

  function handleConfirmRestDayDelete() {
    if (!restDayPendingDelete) return;

    const reasonLabel =
      restDayLabels[restDayPendingDelete.reason];

    deleteRestDay(restDayPendingDelete.id);
    setRestDayPendingDelete(null);

    showToast({
      type: "success",
      title: "Rest day deleted",
      description: `${reasonLabel} was removed from your History.`,
    });
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
                Every workout and intentional recovery day has a place here.
              </p>
            </div>

            <ThemeToggle />
          </header>

          {mounted && hasAnyRecords ? (
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

          {!mounted ? (
            <section className="mt-10 min-h-72 animate-pulse rounded-3xl bg-zinc-200 dark:bg-zinc-900" />
          ) : !hasAnyRecords ? (
            <section className="mt-10 flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                <History size={28} />
              </div>

              <h2 className="mt-6 text-2xl font-black tracking-tight">
                Your consistency story starts here
              </h2>

              <p className="mt-3 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Complete your first workout or record an intentional recovery day from Today.
              </p>

              <button
                type="button"
                onClick={handleStartFirstSession}
                className="mt-7 flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.98]"
              >
                <CalendarDays size={18} />
                Go to Today
              </button>
            </section>
          ) : filteredRecords.length === 0 ? (
            <section className="mt-8 flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white p-8 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                <History size={25} />
              </div>

              <h2 className="mt-5 text-xl font-black">
                {hasActiveSearch
                  ? "No matching records"
                  : activityFilter === "rest-day"
                    ? "No rest days"
                    : `No ${activeFilterLabel.toLowerCase()} sessions`}
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {hasActiveSearch
                  ? `No history records match "${searchQuery.trim()}". Try another keyword or clear the search.`
                  : activityFilter === "rest-day"
                    ? "There are no intentional recovery days recorded yet."
                    : "There are no completed sessions matching this activity filter yet."}
              </p>

              <button
                type="button"
                onClick={handleClearResults}
                className="mt-6 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
              >
                {hasActiveSearch
                  ? "Clear Search"
                  : "Show All Records"}
              </button>
            </section>
          ) : (
            <section className="mt-8 space-y-4">
              <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                {filteredRecords.length}{" "}
                {hasActiveSearch
                  ? "matching"
                  : activityFilter === "all"
                    ? "history"
                    : activeFilterLabel.toLowerCase()}{" "}
                {filteredRecords.length === 1
                  ? "record"
                  : "records"}
              </p>

              {filteredRecords.map((record) =>
                record.type === "session" ? (
                  <SessionCard
                    key={`session-${record.id}`}
                    session={record.session}
                    onEdit={handleEditRequest}
                    onDelete={setSessionPendingDelete}
                  />
                ) : (
                  <RestDayCard
                    key={`rest-${record.id}`}
                    restDay={record.restDay}
                    onDelete={setRestDayPendingDelete}
                  />
                ),
              )}
            </section>
          )}
        </div>
      </main>

      {sessionPendingEdit ? (
        <EditSessionDialog
          key={sessionPendingEdit.id}
          session={sessionPendingEdit}
          onClose={() => setSessionPendingEdit(null)}
          onSave={handleSaveEdit}
        />
      ) : null}

      {sessionPendingDelete ? (
        <DeleteDialog
          title="Delete this session?"
          description="This completed session will be removed from History and all related progress calculations."
          summaryTitle={
            activityLabels[sessionPendingDelete.activityType]
          }
          summaryDescription={`${formatSessionDate(
            sessionPendingDelete.startedAt,
          )} • ${formatDuration(
            sessionPendingDelete.durationSeconds,
          )}`}
          onCancel={() => setSessionPendingDelete(null)}
          onConfirm={handleConfirmSessionDelete}
        />
      ) : null}

      {restDayPendingDelete ? (
        <DeleteDialog
          title="Delete this rest day?"
          description="This intentional recovery record will be removed from History. Workout analytics will remain unchanged."
          summaryTitle={
            restDayLabels[restDayPendingDelete.reason]
          }
          summaryDescription={formatRestDayDate(
            restDayPendingDelete.date,
          )}
          onCancel={() => setRestDayPendingDelete(null)}
          onConfirm={handleConfirmRestDayDelete}
        />
      ) : null}
    </div>
  );
}
