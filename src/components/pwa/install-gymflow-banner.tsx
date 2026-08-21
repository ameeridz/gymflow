"use client";

import {
  CheckCircle2,
  Download,
  Share,
  Smartphone,
  SquarePlus,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";

interface InstallPromptChoice {
  outcome: "accepted" | "dismissed";
  platform: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallPromptChoice>;
}

const DISMISS_STORAGE_KEY =
  "gymflow-install-banner-dismissed-at";

const DISMISS_DURATION_MS =
  7 * 24 * 60 * 60 * 1000;

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

function isIosDevice() {
  const userAgent =
    window.navigator.userAgent.toLowerCase();

  const iosUserAgent =
    /iphone|ipad|ipod/.test(userAgent);

  const ipadDesktopMode =
    window.navigator.platform === "MacIntel" &&
    window.navigator.maxTouchPoints > 1;

  return iosUserAgent || ipadDesktopMode;
}

function isStandaloneMode() {
  const standaloneDisplay =
    window.matchMedia(
      "(display-mode: standalone)",
    ).matches;

  const iosStandalone =
    "standalone" in window.navigator &&
    (
      window.navigator as Navigator & {
        standalone?: boolean;
      }
    ).standalone === true;

  return standaloneDisplay || iosStandalone;
}

function wasDismissedRecently() {
  const dismissedAt = window.localStorage.getItem(
    DISMISS_STORAGE_KEY,
  );

  if (!dismissedAt) {
    return false;
  }

  const dismissedTime = Number(dismissedAt);

  if (!Number.isFinite(dismissedTime)) {
    window.localStorage.removeItem(
      DISMISS_STORAGE_KEY,
    );
    return false;
  }

  return (
    Date.now() - dismissedTime <
    DISMISS_DURATION_MS
  );
}

interface InstallInstructionsDialogProps {
  open: boolean;
  isIos: boolean;
  onClose: () => void;
}

function InstallInstructionsDialog({
  open,
  isIos,
  onClose,
}: InstallInstructionsDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-gymflow-title"
      className="fixed inset-0 z-[220] flex items-end justify-center bg-zinc-950/70 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div className="max-h-[92vh] w-full overflow-y-auto rounded-t-[2rem] border border-zinc-200 bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] pt-5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:max-w-md sm:rounded-[2rem] sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
            <Smartphone size={22} />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close install instructions"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 transition hover:bg-zinc-200 active:scale-95 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <X size={19} />
          </button>
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
          Install app
        </p>

        <h2
          id="install-gymflow-title"
          className="mt-2 text-2xl font-black tracking-tight"
        >
          Add GymFlow to your Home Screen
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Get quicker access and a full-screen app
          experience without an app store.
        </p>

        {isIos ? (
          <ol className="mt-6 space-y-4">
            <li className="flex items-start gap-3 rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                1
              </span>

              <div className="flex min-w-0 items-start gap-3">
                <Share
                  size={19}
                  className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400"
                />

                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Open GymFlow in Safari and tap the
                  Share button.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                2
              </span>

              <div className="flex min-w-0 items-start gap-3">
                <SquarePlus
                  size={19}
                  className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400"
                />

                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Choose Add to Home Screen from the
                  sharing menu.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                3
              </span>

              <div className="flex min-w-0 items-start gap-3">
                <CheckCircle2
                  size={19}
                  className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400"
                />

                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Tap Add to place GymFlow on your Home
                  Screen.
                </p>
              </div>
            </li>
          </ol>
        ) : (
          <div className="mt-6 rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">
            <p className="text-sm font-bold">
              Install from your browser menu
            </p>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Open the browser menu and choose Install
              app or Add to Home Screen.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-violet-600 px-5 py-3.5 font-bold text-white transition hover:bg-violet-700 active:scale-[0.98]"
        >
          Got It
        </button>
      </div>
    </div>
  );
}

export function InstallGymFlowBanner() {
  const mounted = useMounted();

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(
      null,
    );

  const [installedByEvent, setInstalledByEvent] =
    useState(false);

  const [dismissed, setDismissed] =
    useState(false);

  const [instructionsOpen, setInstructionsOpen] =
    useState(false);

  const isIos = mounted && isIosDevice();

  const isInstalled =
    installedByEvent ||
    (mounted && isStandaloneMode());

  const isRecentlyDismissed =
    mounted && wasDismissedRecently();

  useEffect(() => {
    function handleBeforeInstallPrompt(
      event: Event,
    ) {
      event.preventDefault();

      setDeferredPrompt(
        event as BeforeInstallPromptEvent,
      );
    }

    function handleAppInstalled() {
      setInstalledByEvent(true);
      setDeferredPrompt(null);
      setInstructionsOpen(false);
    }

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt,
    );

    window.addEventListener(
      "appinstalled",
      handleAppInstalled,
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );

      window.removeEventListener(
        "appinstalled",
        handleAppInstalled,
      );
    };
  }, []);

  function handleDismiss() {
    window.localStorage.setItem(
      DISMISS_STORAGE_KEY,
      String(Date.now()),
    );

    setDismissed(true);
  }

  async function handleInstall() {
    if (isIos || !deferredPrompt) {
      setInstructionsOpen(true);
      return;
    }

    await deferredPrompt.prompt();

    const choice =
      await deferredPrompt.userChoice;

    setDeferredPrompt(null);

    if (choice.outcome === "accepted") {
      setInstalledByEvent(true);
      return;
    }

    setInstructionsOpen(true);
  }

  if (
    !mounted ||
    isInstalled ||
    dismissed ||
    isRecentlyDismissed
  ) {
    return null;
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+7.35rem)] z-[190] sm:inset-x-auto sm:right-6 sm:w-[26rem] lg:bottom-6">
        <aside className="pointer-events-auto relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-zinc-950/90 px-3 py-3 text-white shadow-[0_18px_50px_rgba(24,24,27,0.28)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-zinc-900/90 sm:rounded-[1.75rem] sm:px-5 sm:py-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-12 -top-12 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 right-10 h-32 w-32 rounded-full bg-fuchsia-500/15 blur-3xl"
        />

        <div className="relative flex items-center gap-2.5 sm:gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-600/25 sm:h-12 sm:w-12 sm:rounded-2xl">
            <Smartphone size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-black sm:text-base">
              Install GymFlow
            </p>

            <p className="mt-0.5 line-clamp-2 text-[0.7rem] leading-4 text-zinc-300 sm:mt-1 sm:text-sm sm:leading-5">
              Quick access from your Home Screen with a
              full-screen app experience.
            </p>
          </div>

          <button
            type="button"
            onClick={handleInstall}
            className="flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-3 text-xs font-bold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500 active:scale-[0.98] sm:h-auto sm:rounded-2xl sm:px-5 sm:py-3 sm:text-sm"
          >
            <Download size={15} className="sm:h-[17px] sm:w-[17px]" />
            Install
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss install GymFlow banner"
            title="Dismiss"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/10 hover:text-white active:scale-95 sm:h-10 sm:w-10 sm:rounded-xl"
          >
            <X size={16} className="sm:h-[18px] sm:w-[18px]" />
          </button>
        </div>

        </aside>
      </div>

      <InstallInstructionsDialog
        open={instructionsOpen}
        isIos={isIos}
        onClose={() =>
          setInstructionsOpen(false)
        }
      />
    </>
  );
}
