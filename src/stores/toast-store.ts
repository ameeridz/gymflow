"use client";

import { create } from "zustand";

export type ToastType =
  | "success"
  | "error"
  | "warning"
  | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration: number;
}

interface ShowToastOptions {
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastState {
  toasts: ToastMessage[];

  showToast: (
    options: ShowToastOptions,
  ) => string;

  dismissToast: (
    toastId: string,
  ) => void;

  clearToasts: () => void;
}

function createToastId() {
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

export const useToastStore =
  create<ToastState>()((set) => ({
    toasts: [],

    showToast: ({
      type = "success",
      title,
      description,
      duration = 4000,
    }) => {
      const toastId = createToastId();

      const toast: ToastMessage = {
        id: toastId,
        type,
        title: title.trim(),
        description:
          description?.trim() || undefined,
        duration: Math.max(
          1500,
          Math.min(duration, 10000),
        ),
      };

      set((state) => ({
        toasts: [
          ...state.toasts,
          toast,
        ].slice(-3),
      }));

      return toastId;
    },

    dismissToast: (toastId) => {
      set((state) => ({
        toasts: state.toasts.filter(
          (toast) =>
            toast.id !== toastId,
        ),
      }));
    },

    clearToasts: () => {
      set({
        toasts: [],
      });
    },
  }));