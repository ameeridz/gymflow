import type {
  Metadata,
  Viewport,
} from "next";
import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { ThemeProvider } from "@/components/theme-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://gymeer.ridzu.one";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Gymeer — Gym Check-In & Training Day Tracker",
    template: "%s | Gymeer",
  },

  description:
    "Gymeer is a lightweight gym check-in, workout timer, training-day and recovery tracker created by Ridzjuan.",

  applicationName: "Gymeer",

  alternates: {
    canonical: "/",
  },

  manifest: "/manifest.webmanifest",

  keywords: [
    "Gymeer",
    "gym check-in",
    "workout timer",
    "training day tracker",
    "gym consistency tracker",
    "rest day tracker",
    "fitness PWA",
    "Ridzjuan",
  ],

  authors: [
    {
      name: "Ridzjuan",
      url: "https://ridzu.one",
    },
  ],

  creator: "Ridzjuan",
  publisher: "Ridzjuan",

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Gymeer",
    title:
      "Gymeer — Gym Check-In & Training Day Tracker",
    description:
      "Build consistency one training day at a time with gym check-ins, workout timers, recovery tracking and weekly streaks.",
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Gymeer — Gym Check-In & Training Day Tracker",
    description:
      "Build consistency one training day at a time with gym check-ins, workout timers, recovery tracking and weekly streaks.",
  },

  icons: {
    icon: [
      {
        url: "/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  appleWebApp: {
    capable: true,
    title: "Gymeer",
    statusBarStyle: "black-translucent",
  },

  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",

  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: "#fafafa",
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: "#09090b",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Gymeer",
    alternateName: "Gymeer by Ridzjuan",
    url: `${siteUrl}/`,
    description:
      "A lightweight gym check-in, workout timer, training-day and recovery tracker.",
    creator: {
      "@type": "Person",
      name: "Ridzjuan",
      url: "https://ridzu.one",
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              websiteStructuredData,
            ),
          }}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
