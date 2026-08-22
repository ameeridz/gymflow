"use client";

import {
  CheckCircle2,
  Download,
  MoreVertical,
  Share,
  Smartphone,
  SquarePlus,
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

interface BeforeInstallPromptEvent
  extends Event {
  prompt: () => Promise<void>;

  userChoice:
    Promise<InstallPromptChoice>;
}

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

export function InstallGymFlowCard() {
  const mounted = useMounted();

  const [
    deferredPrompt,
    setDeferredPrompt,
  ] =
    useState<BeforeInstallPromptEvent | null>(
      null,
    );

  const [
    installedByEvent,
    setInstalledByEvent,
  ] = useState(false);

  const [
    showInstructions,
    setShowInstructions,
  ] = useState(false);

  const [
    installDismissed,
    setInstallDismissed,
  ] = useState(false);

  const isIos =
    mounted && isIosDevice();

  const isInstalled =
    installedByEvent ||
    (mounted && isStandaloneMode());

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
      setShowInstructions(false);
      setInstallDismissed(false);
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

  async function handleInstall() {
    if (!deferredPrompt) {
      setShowInstructions(true);
      return;
    }

    await deferredPrompt.prompt();

    const choice =
      await deferredPrompt.userChoice;

    setDeferredPrompt(null);

    if (choice.outcome === "accepted") {
      setInstalledByEvent(true);
      setInstallDismissed(false);
      return;
    }

    setInstallDismissed(true);
  }

  if (!mounted || isInstalled) {
    return null;
  }

  const showManualInstructions =
    showInstructions && !isIos;

  return (
    <article className="overflow-hidden rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-5 shadow-sm dark:border-violet-500/20 dark:from-violet-500/10 dark:via-zinc-900 dark:to-fuchsia-500/10 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
          <Smartphone size={21} />
        </div>

        <div>
          <p className="font-bold">
            Install Gymeer
          </p>

          <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Add Gymeer to your home screen for quicker
            access and a more app-like experience.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <div className="rounded-2xl bg-white/80 p-3 text-center dark:bg-zinc-950/40">
          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
            Quick access
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 p-3 text-center dark:bg-zinc-950/40">
          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
            Full screen
          </p>
        </div>

        <div className="rounded-2xl bg-white/80 p-3 text-center dark:bg-zinc-950/40">
          <p className="text-xs font-bold text-zinc-700 dark:text-zinc-200">
            App icon
          </p>
        </div>
      </div>

      {isIos ? (
        <section className="mt-5 rounded-2xl border border-violet-200 bg-white/80 p-4 dark:border-violet-500/20 dark:bg-zinc-950/40">
          <p className="text-sm font-bold">
            Add Gymeer on iPhone or iPad
          </p>

          <ol className="mt-4 space-y-4">
            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                1
              </span>

              <div className="flex min-w-0 items-start gap-2">
                <Share
                  size={18}
                  className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400"
                />

                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Open Gymeer in Safari then tap the
                  Share button.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                2
              </span>

              <div className="flex min-w-0 items-start gap-2">
                <SquarePlus
                  size={18}
                  className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400"
                />

                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Scroll down and choose Add to Home
                  Screen.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-sm font-black text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                3
              </span>

              <div className="flex min-w-0 items-start gap-2">
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400"
                />

                <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                  Tap Add to place Gymeer on your home
                  screen.
                </p>
              </div>
            </li>
          </ol>
        </section>
      ) : (
        <>
          <button
            type="button"
            onClick={handleInstall}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 active:scale-[0.98]"
          >
            <Download size={18} />

            {deferredPrompt
              ? "Install Gymeer"
              : "View Install Instructions"}
          </button>

          {showManualInstructions ? (
            <section className="mt-4 rounded-2xl border border-violet-200 bg-white/80 p-4 dark:border-violet-500/20 dark:bg-zinc-950/40">
              <div className="flex items-start gap-3">
                <MoreVertical
                  size={20}
                  className="mt-0.5 shrink-0 text-violet-600 dark:text-violet-400"
                />

                <div>
                  <p className="text-sm font-bold">
                    Install from your browser
                  </p>

                  <p className="mt-1 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    Open your browser menu and choose
                    Install app or Add to home screen.
                  </p>
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}

      {installDismissed ? (
        <p className="mt-4 text-center text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          Installation was cancelled. You can try again
          whenever your browser offers the install
          option.
        </p>
      ) : null}

      <p className="mt-4 text-center text-xs leading-5 text-zinc-400">
        No app store or account is required.
      </p>
    </article>
  );
}