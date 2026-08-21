"use client";

import {
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Dumbbell,
  History,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

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

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

function desktopButtonClass(active: boolean) {
  const base =
    "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors";

  const activeStyle =
    "bg-violet-600 text-white shadow-lg shadow-violet-600/20";

  const inactiveStyle =
    "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white";

  return `${base} ${active ? activeStyle : inactiveStyle}`;
}

function mobileButtonClass(active: boolean) {
  const base =
    "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition-colors";

  const activeStyle =
    "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400";

  const inactiveStyle =
    "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900";

  return `${base} ${active ? activeStyle : inactiveStyle}`;
}

export function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-zinc-200 bg-white px-5 py-6 dark:border-zinc-800 dark:bg-zinc-950 lg:flex">
      <div className="flex items-center gap-3 px-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
          <Dumbbell size={22} />
        </div>

        <div className="min-w-0">
  <p className="text-lg font-black tracking-tight">
    GymFlow
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

      <nav className="mt-10 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActiveRoute(pathname, item.href);

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={desktopButtonClass(active)}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-900">
        <p className="text-sm font-bold">Small steps count.</p>

        <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          A short session still protects the habit.
        </p>
      </div>
    </aside>
  );
}

export function MobileNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-200 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-2 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/95 lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActiveRoute(pathname, item.href);

          return (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={mobileButtonClass(active)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}