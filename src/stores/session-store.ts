"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  ActivityType,
  GymSession,
  SessionMood,
} from "@/types/session";

interface SessionUpdates {
  activityType: ActivityType;
  mood: SessionMood;
  note: string;
}

function createSessionId() {
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

interface SessionState {
  activeSession: GymSession | null;
  completedSessions: GymSession[];

  startSession: (
    activityType: ActivityType,
  ) => void;

  finishSession: (
    mood: SessionMood,
    note?: string,
  ) => void;

  cancelSession: () => void;

  updateCompletedSession: (
    sessionId: string,
    updates: SessionUpdates,
  ) => void;

  deleteCompletedSession: (
    sessionId: string,
  ) => void;

  restoreCompletedSessions: (
    sessions: GymSession[],
  ) => void;
}

export const useSessionStore =
  create<SessionState>()(
    persist(
      (set, get) => ({
        activeSession: null,
        completedSessions: [],

        startSession: (activityType) => {
          const session: GymSession = {
            id: createSessionId(),
            activityType,
            startedAt: new Date().toISOString(),
            endedAt: null,
            durationSeconds: null,
            mood: null,
            note: "",
            status: "active",
          };

          set({
            activeSession: session,
          });
        },

        finishSession: (
          mood,
          note = "",
        ) => {
          const activeSession =
            get().activeSession;

          if (!activeSession) {
            return;
          }

          const endedAt = new Date();

          const startedAt = new Date(
            activeSession.startedAt,
          );

          const durationSeconds = Math.max(
            0,
            Math.floor(
              (endedAt.getTime() -
                startedAt.getTime()) /
                1000,
            ),
          );

          const completedSession: GymSession = {
            ...activeSession,
            endedAt: endedAt.toISOString(),
            durationSeconds,
            mood,
            note,
            status: "completed",
          };

          set((state) => ({
            activeSession: null,

            completedSessions: [
              completedSession,
              ...state.completedSessions,
            ],
          }));
        },

        cancelSession: () => {
          set({
            activeSession: null,
          });
        },

        updateCompletedSession: (
          sessionId,
          updates,
        ) => {
          const cleanNote = updates.note
            .trim()
            .slice(0, 280);

          set((state) => ({
            completedSessions:
              state.completedSessions.map(
                (session) => {
                  if (session.id !== sessionId) {
                    return session;
                  }

                  return {
                    ...session,
                    activityType:
                      updates.activityType,
                    mood: updates.mood,
                    note: cleanNote,
                  };
                },
              ),
          }));
        },

        deleteCompletedSession: (
          sessionId,
        ) => {
          set((state) => ({
            completedSessions:
              state.completedSessions.filter(
                (session) =>
                  session.id !== sessionId,
              ),
          }));
        },

        restoreCompletedSessions: (
          sessions,
        ) => {
          const completedSessions = sessions
            .filter(
              (session) =>
                session.status === "completed",
            )
            .sort(
              (
                firstSession,
                secondSession,
              ) =>
                new Date(
                  secondSession.startedAt,
                ).getTime() -
                new Date(
                  firstSession.startedAt,
                ).getTime(),
            );

          set({
            activeSession: null,
            completedSessions,
          });
        },
      }),
      {
        name: "gymflow-session-storage",
        version: 1,
      },
    ),
  );