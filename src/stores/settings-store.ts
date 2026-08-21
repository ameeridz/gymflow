"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RestoredSettings {
  displayName?: string;
  weeklyTarget?: number;
}

interface SettingsState {
  displayName: string;
  weeklyTarget: number;

  setDisplayName: (name: string) => void;

  setWeeklyTarget: (target: number) => void;

  restoreSettings: (
    settings: RestoredSettings,
  ) => void;
}

function cleanDisplayName(name: string) {
  return name.trim().slice(0, 40);
}

function getSafeWeeklyTarget(target: number) {
  return Math.min(
    7,
    Math.max(2, Math.round(target)),
  );
}

export const useSettingsStore =
  create<SettingsState>()(
    persist(
      (set) => ({
        displayName: "",
        weeklyTarget: 3,

        setDisplayName: (name) => {
          set({
            displayName: cleanDisplayName(name),
          });
        },

        setWeeklyTarget: (target) => {
          set({
            weeklyTarget:
              getSafeWeeklyTarget(target),
          });
        },

        restoreSettings: (settings) => {
          const restoredDisplayName =
            typeof settings.displayName === "string"
              ? cleanDisplayName(
                  settings.displayName,
                )
              : "";

          const restoredWeeklyTarget =
            typeof settings.weeklyTarget === "number" &&
            Number.isFinite(
              settings.weeklyTarget,
            )
              ? getSafeWeeklyTarget(
                  settings.weeklyTarget,
                )
              : 3;

          set({
            displayName: restoredDisplayName,
            weeklyTarget:
              restoredWeeklyTarget,
          });
        },
      }),
      {
        name: "gymflow-settings-storage",
        version: 1,
      },
    ),
  );