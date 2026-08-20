"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  weeklyTarget: number;
  setWeeklyTarget: (target: number) => void;
}

export const useSettingsStore =
  create<SettingsState>()(
    persist(
      (set) => ({
        weeklyTarget: 3,

        setWeeklyTarget: (target) => {
          const safeTarget = Math.min(
            5,
            Math.max(2, target),
          );

          set({
            weeklyTarget: safeTarget,
          });
        },
      }),
      {
        name: "gymflow-settings-storage",
      },
    ),
  );