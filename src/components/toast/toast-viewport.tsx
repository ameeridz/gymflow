"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";
import { useEffect } from "react";

import {
  type ToastMessage,
  useToastStore,
} from "@/stores/toast-store";

const toastStyles = {
  success: {
    container:
      "border-emerald-200 bg-white/90 dark:border-emerald-500/20 dark:bg-zinc-950/90",
    icon:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    iconComponent: CheckCircle2,
  },

  error: {
    container:
      "border-rose-200 bg-white/90 dark:border-rose-500/20 dark:bg-zinc-950/90",
    icon:
      "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
    iconComponent: XCircle,
  },

  warning: {
    container:
      "border-amber-200 bg-white/90 dark:border-amber-500/20 dark:bg-zinc-950/90",
    icon:
      "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
    iconComponent: AlertTriangle,
  },

  info: {
    container:
      "border-violet-200 bg-white/90 dark:border-violet-500/20 dark:bg-zinc-950/90",
    icon:
      "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    iconComponent: Info,
  },
};

interface ToastItemProps {
  toast: ToastMessage;
}

function ToastItem({
  toast,
}: ToastItemProps) {
  const dismissToast = useToastStore(
    (state) => state.dismissToast,
  );

  const style =
    toastStyles[toast.type];

  const Icon = style.iconComponent;

  useEffect(() => {
    const timeout = window.setTimeout(
      () => {
        dismissToast(toast.id);
      },
      toast.duration,
    );

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    dismissToast,
    toast.duration,
    toast.id,
  ]);

  return (
    <article
      role={
        toast.type === "error"
          ? "alert"
          : "status"
      }
      className={`pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-2xl border p-4 shadow-[0_16px_45px_rgba(24,24,27,0.16)] backdrop-blur-2xl backdrop-saturate-150 dark:shadow-[0_18px_50px_rgba(0,0,0,0.45)] ${style.container}`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
      >
        <Icon size={20} />
      </div>

      <div className="min-w-0 flex-1 pr-7">
        <p className="text-sm font-black">
          {toast.title}
        </p>

        {toast.description ? (
          <p className="mt-1 text-sm leading-5 text-zinc-500 dark:text-zinc-400">
            {toast.description}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() =>
          dismissToast(toast.id)
        }
        aria-label={`Dismiss ${toast.title} notification`}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700 active:scale-95 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
      >
        <X size={16} />
      </button>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 bg-current opacity-10"
      />
    </article>
  );
}

export function ToastViewport() {
  const toasts = useToastStore(
    (state) => state.toasts,
  );

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+7.5rem)] z-[250] flex flex-col gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-full sm:max-w-sm lg:bottom-6"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
        />
      ))}
    </div>
  );
}