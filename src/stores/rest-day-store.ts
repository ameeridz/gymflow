"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  RestDay,
  RestDayReason,
} from "@/types/rest-day";

interface CreateRestDayInput {
  date: string;
  reason: RestDayReason;
  note?: string;
}

interface RestDayState {
  restDays: RestDay[];

  addRestDay: (
    input: CreateRestDayInput,
  ) => void;

  deleteRestDay: (
    restDayId: string,
  ) => void;

  restoreRestDays: (
    restDays: RestDay[],
  ) => void;
}

function createRestDayId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function sortRestDays(
  restDays: RestDay[],
) {
  return [...restDays].sort(
    (firstRestDay, secondRestDay) =>
      new Date(
        secondRestDay.date,
      ).getTime() -
      new Date(
        firstRestDay.date,
      ).getTime(),
  );
}

export const useRestDayStore =
  create<RestDayState>()(
    persist(
      (set) => ({
        restDays: [],

        addRestDay: ({
          date,
          reason,
          note = "",
        }) => {
          const restDay: RestDay = {
            id: createRestDayId(),
            date,
            reason,
            note: note
              .trim()
              .slice(0, 280),
            createdAt:
              new Date().toISOString(),
          };

          set((state) => {
            const restDaysWithoutSameDate =
              state.restDays.filter(
                (existingRestDay) =>
                  existingRestDay.date !==
                  date,
              );

            return {
              restDays: sortRestDays([
                restDay,
                ...restDaysWithoutSameDate,
              ]),
            };
          });
        },

        deleteRestDay: (
          restDayId,
        ) => {
          set((state) => ({
            restDays:
              state.restDays.filter(
                (restDay) =>
                  restDay.id !==
                  restDayId,
              ),
          }));
        },

        restoreRestDays: (
          restDays,
        ) => {
          set({
            restDays:
              sortRestDays(restDays),
          });
        },
      }),
      {
        name: "gymflow-rest-day-storage",
        version: 1,
      },
    ),
  );