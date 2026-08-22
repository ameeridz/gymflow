"use client";

import {
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Dumbbell,
  History,
  Settings,
} from "lucide-react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

const navigationItems = [
  {
    label: "Today",
    href: "/",
    icon: CalendarDays,
  },
  {
    label: "History",
    href: "/history",
    icon: History,
  },
  {
    label: "Progress",
    href: "/progress",
    icon: ChartNoAxesColumnIncreasing,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

function isActiveRoute(
  pathname: string,
  href: string,
) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

function desktopButtonClass(
  active: boolean,
) {
  const base =
    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors";

  const activeStyle =
    "bg-violet-600 text-white shadow-lg shadow-violet-600/20";

  const inactiveStyle =
    "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white";

  return `${base} ${
    active ? activeStyle : inactiveStyle
  }`;
}

function mobileButtonClass(
  active: boolean,
) {
  const base =
    "group relative flex min-w-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-[1.35rem] px-2 py-2.5 text-[0.68rem] font-semibold transition-all duration-300 ease-out active:scale-95";

  const activeStyle =
    "bg-violet-500/15 text-violet-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_6px_20px_rgba(124,58,237,0.14)] ring-1 ring-violet-500/20 dark:bg-violet-400/15 dark:text-violet-300 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_6px_24px_rgba(124,58,237,0.18)] dark:ring-violet-300/15";

  const inactiveStyle =
    "text-zinc-500 hover:bg-white/45 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-white/[0.06] dark:hover:text-zinc-100";

  return `${base} ${
    active ? activeStyle : inactiveStyle
  }`;
}

export function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-zinc-200 bg-white px-5 py-6 dark:border-zinc-800 dark:bg-zinc-950 lg:flex">
      <div className="flex items-center gap-3 px-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
          <Dumbbell size={22} />
        </div>

        <div className="min-w-0">
          <p className="text-lg font-black tracking-tight">
            Gymeer
          </p>

          <a
            href="https://ridzu.one"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Ridzjuan personal website"
            className="mt-0.5 block text-xs leading-5 text-zinc-500 transition-colors hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
          >
            <span className="block">
              Build consistency with
            </span>

            <span className="font-bold text-violet-600 underline decoration-violet-600/30 underline-offset-2 dark:text-violet-400 dark:decoration-violet-400/30">
              Ridzjuan
            </span>
          </a>
        </div>
      </div>

      <nav
        aria-label="Desktop navigation"
        className="mt-10 space-y-2"
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActiveRoute(
            pathname,
            item.href,
          );

          return (
            <button
              key={item.href}
              type="button"
              onClick={() =>
                router.push(item.href)
              }
              aria-current={
                active ? "page" : undefined
              }
              className={desktopButtonClass(
                active,
              )}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">
        <p className="text-sm font-bold">
          Every training day counts.
        </p>

        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          Show up, recover intentionally and build
          consistency at your own pace.
        </p>
      </div>
    </aside>
  );
}

export function MobileNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom)+0.6rem)] lg:hidden">
      <div className="mx-auto max-w-lg">
        <nav
          aria-label="Mobile navigation"
          className="pointer-events-auto relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-1.5 shadow-[0_12px_40px_rgba(24,24,27,0.16),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl backdrop-saturate-150 dark:border-white/10 dark:bg-zinc-950/65 dark:shadow-[0_14px_45px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-white/20"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-8 -top-10 h-24 w-24 rounded-full bg-violet-400/15 blur-2xl dark:bg-violet-500/10"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-12 -right-8 h-28 w-28 rounded-full bg-fuchsia-400/10 blur-2xl dark:bg-fuchsia-500/10"
          />

          <div className="relative grid grid-cols-4 gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const active = isActiveRoute(
                pathname,
                item.href,
              );

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() =>
                    router.push(item.href)
                  }
                  aria-current={
                    active
                      ? "page"
                      : undefined
                  }
                  className={mobileButtonClass(
                    active,
                  )}
                >
                  <span
                    className={`flex h-6 w-8 items-center justify-center rounded-full transition-transform duration-300 ${
                      active
                        ? "scale-105"
                        : "group-hover:scale-105"
                    }`}
                  >
                    <Icon
                      size={20}
                      strokeWidth={
                        active ? 2.35 : 2
                      }
                    />
                  </span>

                  <span className="max-w-full truncate">
                    {item.label}
                  </span>

                  {active ? (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-1 h-1 w-1 rounded-full bg-violet-600 shadow-[0_0_8px_rgba(124,58,237,0.9)] dark:bg-violet-300"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
