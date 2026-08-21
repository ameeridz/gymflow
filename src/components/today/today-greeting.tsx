"use client";

import { useSyncExternalStore } from "react";

import { useSettingsStore } from "@/stores/settings-store";

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

function getGreeting(currentDate: Date) {
  const currentHour = currentDate.getHours();

  if (currentHour < 12) {
    return "Good morning";
  }

  if (currentHour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

function formatCurrentDate(currentDate: Date) {
  return new Intl.DateTimeFormat("en-MY", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(currentDate);
}

export function TodayGreeting() {
  const mounted = useMounted();

  const displayName = useSettingsStore(
    (state) => state.displayName,
  );

  if (!mounted) {
    return (
      <div>
        <div className="h-4 w-36 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />

        <div className="mt-3 h-5 w-48 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
      </div>
    );
  }

  const currentDate = new Date();
  const greeting = getGreeting(currentDate);
  const formattedDate = formatCurrentDate(currentDate);

  const greetingText = displayName
    ? `${greeting}, ${displayName}`
    : greeting;

  return (
    <div>
      <p className="text-xl font-black tracking-tight text-violet-600 dark:text-violet-400 sm:text-2xl">
      {greetingText}
      </p>

      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-400 sm:text-sm">
      {formattedDate}
      </p>
    </div>
  );
}