"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  displayName: string;
  weeklyTarget: number;

  setDisplayName: (name: string) => void;
  setWeeklyTarget: (target: number) => void;
}

export const useSettingsStore =
  create<SettingsState>()(
    persist(
      (set) => ({
        displayName: "",
        weeklyTarget: 3,

        setDisplayName: (name) => {
          set({
            displayName: name.trim().slice(0, 40),
          });
        },

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
        version: 1,
      },
    ),
  );
