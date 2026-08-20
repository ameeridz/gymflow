# GymFlow

**GymFlow** is a lightweight gym motivation and consistency tracker designed to help users build the habit of showing up.

Instead of becoming a complicated workout management system, GymFlow focuses on a simple experience:

> Check in, start moving, complete the session, and build consistency.

🌐 **Live application:** https://gym.ridzu.one  
👨‍💻 **Created by Ridzjuan:** [https://ridzu.one](https://ridzu.one)

---

## Why GymFlow?

Going to the gym consistently can be harder than completing the workout itself.

GymFlow encourages users to protect the habit by making every completed session count, including short or difficult sessions.

The application provides:

- A simple gym check-in flow
- An active-session timer
- Weekly attendance goals
- Persistent activity history
- Real-time progress analytics
- Positive and non-judgmental feedback

GymFlow is designed around the idea that:

> Consistency is built by returning, not by being perfect.

---

## Features

### Gym Check-In

Users can check in and select an activity type:

- Strength
- Cardio
- Mixed
- Mobility
- Quick Session

Each check-in creates an active gym session with a unique ID and start timestamp.

### Active-Session Timer

After check-in, GymFlow starts a live session timer.

The timer is calculated using:

```text
Current time - Session start time
```

The timer remains accurate even when the browser is refreshed because the original start timestamp is stored locally.

### Session Completion

Users can complete an active session and record:

- Session mood: Tough, Okay, or Great
- Optional session note
- End timestamp
- Total session duration
- Completion status

### Persistent History

Completed sessions appear automatically on the History page.

Each history record includes:

- Activity type
- Session date and time
- Session duration
- Mood
- Optional note
- Completion status

### Progress Analytics

GymFlow calculates progress from completed sessions instead of displaying static data.

The Progress page includes:

- Sessions completed during the current week
- Weekly goal progress
- Total completed sessions
- Total gym time
- Average session duration

### Weekly Target

Users can set a weekly target of:

```text
2, 3, 4, or 5 sessions
```

The selected target is used automatically by the Today and Progress pages.

For example:

```text
5 completed sessions
Weekly target: 5

Result: 5 / 5 — Weekly goal achieved
```

### Appearance Settings

GymFlow supports:

- Light mode
- Dark mode
- System theme

The selected appearance is retained after the browser is refreshed or reopened.

### Data Backup

Users can export their GymFlow data as a JSON backup containing:

- Application version
- Export timestamp
- Weekly target
- Theme preference
- Completed sessions

### Protected Data Reset

GymFlow includes a confirmation step before deleting local session history and preferences.

### Responsive Design

GymFlow is designed for:

- Mobile phones
- Tablets
- Desktop computers

The interface uses:

- Bottom navigation on mobile
- Persistent sidebar navigation on desktop
- Responsive cards and dialogs
- Touch-friendly controls
- Light and dark responsive layouts

### Progressive Web App

GymFlow is an installable Progressive Web App.

Users can open GymFlow in a browser and add it directly to the home screen without downloading it from the Google Play Store or Apple App Store.

The PWA includes:

- Web app manifest
- App icons
- Apple touch icon
- Standalone display mode
- Mobile theme colors
- Safe-area viewport support

---

## Application Routes

```text
/           Today dashboard and gym check-in
/history    Completed session history
/progress   Weekly and overall progress analytics
/settings   User preferences and local data controls
```

---

## Technology Stack

GymFlow is built using:

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Zustand**
- **next-themes**
- **Lucide React**
- **Vercel**
- **Cloudflare DNS**

---

## Current Architecture

GymFlow currently follows a local-first, single-user architecture.

```text
User
  ↓
Next.js PWA
  ↓
Zustand state management
  ↓
Browser localStorage
```

Vercel hosts the application files, while the user's session history and preferences remain in the user's browser.

---

## How Data Is Stored

GymFlow currently does not require registration or login.

There is no remote database in the current version.

Application data is stored in browser `localStorage` through Zustand persistence.

### Session Storage

Session data is stored using the following key:

```text
gymflow-session-storage
```

The session store contains:

```text
activeSession
completedSessions
```

An example completed session has the following structure:

```json
{
  "id": "session-id",
  "activityType": "strength",
  "startedAt": "2026-08-20T04:10:00.000Z",
  "endedAt": "2026-08-20T04:55:00.000Z",
  "durationSeconds": 2700,
  "mood": "great",
  "note": "Good strength session",
  "status": "completed"
}
```

### Settings Storage

User settings are stored using:

```text
gymflow-settings-storage
```

The settings store currently contains:

```json
{
  "weeklyTarget": 5
}
```

Theme preferences are managed separately through `next-themes`.

---

## Data Flow

GymFlow uses a single source of truth for session data.

```text
User completes a session
          ↓
Zustand session store updates
          ↓
Data is persisted to localStorage
          ↓
History displays completed sessions
          ↓
Analytics calculate progress
          ↓
Today and Progress update automatically
```

The History, Today, and Progress pages do not maintain separate copies of session data.

All pages read from the same persisted Zustand store.

---

## Local Storage Limitations

Because GymFlow currently uses browser `localStorage`:

- Data does not automatically sync between devices
- Data does not automatically sync between browsers
- Clearing browser data can remove GymFlow history
- Incognito sessions have separate temporary storage
- Local development and production domains use separate storage

For example:

```text
http://localhost:3000
https://gymflow-six-rho.vercel.app
https://gym.ridzu.one
```

Each address has its own separate browser storage.

Similarly:

```text
Phone browser data ≠ Laptop browser data
```

Users should use https://gym.ridzu.one as the primary address for real session tracking.

---

## Privacy

The current version of GymFlow does not send workout history to a remote database.

Session history and application preferences remain locally in the user's browser unless the user manually exports a backup file.

---

## Getting Started

### Requirements

Install the following tools:

- Node.js
- npm
- Git

### Clone the Repository

```bash
git clone https://github.com/ameeridz/gymflow.git
cd gymflow
```

### Install Dependencies

```bash
npm install
```

### Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Test on Another Device

To expose the development server to another device on the same permitted network:

```bash
npm run dev -- --hostname 0.0.0.0
```

Use the network URL displayed by Next.js.

Network access may still be restricted by corporate firewalls, Wi-Fi client isolation, or device security policies.

---

## Quality Checks

Run ESLint:

```bash
npm run lint
```

Create an optimized production build:

```bash
npm run build
```

Run the production build locally:

```bash
npm start
```

---

## Deployment

GymFlow is deployed automatically through Vercel.

The deployment workflow is:

```text
Feature branch
→ Commit
→ Push
→ Pull Request
→ Merge into main
→ Vercel automatic deployment
→ gym.ridzu.one updated
```

### Production

```text
https://gym.ridzu.one
```

### Source Code

```text
https://github.com/ameeridz/gymflow
```

---

## Project Structure

```text
src/
├── app/
│   ├── history/
│   ├── progress/
│   ├── settings/
│   ├── layout.tsx
│   ├── manifest.ts
│   └── page.tsx
├── components/
│   ├── check-in/
│   ├── app-navigation.tsx
│   ├── app-shell.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/
│   └── session-analytics.ts
├── stores/
│   ├── session-store.ts
│   └── settings-store.ts
└── types/
    └── session.ts
```

---

## Future Roadmap

Possible future improvements include:

- JSON backup import
- User registration and login
- Cloud database integration
- Cross-device synchronization
- Weekly consistency streaks
- Calendar activity heatmap
- Personal milestones and badges
- Motivational reminders
- Push notifications
- Optional social challenges
- Improved accessibility
- Automated tests

A future cloud-enabled version may use:

```text
Next.js
→ Supabase Auth
→ PostgreSQL
→ Row Level Security
```

This would allow users to log in and access the same session history across multiple devices.

---

## Development Status

GymFlow is currently an active personal project and functional MVP.

The current release is designed as:

```text
A local-first, single-user gym motivation and consistency PWA.
```

---

## Creator

GymFlow was designed and developed by **Ridzjuan**.

- Personal website: [https://ridzu.one](https://ridzu.one)
- GitHub: https://github.com/ameeridz

> Build consistency with Ridzjuan.