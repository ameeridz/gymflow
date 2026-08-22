# Gymeer

**Build consistency one training day at a time.**

Gymeer is a lightweight, mobile-first gym check-in, workout timer, training-day, recovery, and consistency tracker created by **Ridzjuan**.

Gymeer began as GymFlow and evolved after product testing and user feedback. The key product insight is simple:

> Multiple workouts on the same calendar day are multiple sessions, but they count as only one training day toward the weekly goal.

Gymeer focuses on helping users show up consistently without becoming a complicated exercise, set, rep, or weight-management system.

## Product URL

The primary Gymeer domain is:

```text
https://gymeer.ridzu.one
```

The previous GymFlow URL is retained as a legacy address and can redirect to Gymeer:

```text
https://gym.ridzu.one
```

## Why Gymeer?

The name combines:

```text
Gym + Ameer = Gymeer
```

The product is designed around a practical view of consistency:

- Every intentional training day matters
- Multiple sessions on one day should not inflate weekly progress
- Recovery can be recorded intentionally
- Short sessions can still count when deliberately saved
- Accidental completion should be prevented
- User data should remain local, portable, and protected

## Core Features

### Gym Check-In

Users can start a workout by choosing an activity type:

- Strength
- Cardio
- Mixed
- Mobility
- Quick Session

Starting a check-in creates one active workout session and starts a live timer.

### Live Workout Timer

The active-session experience includes:

- Live elapsed time
- Activity type
- Finish Session action
- Cancel Session confirmation
- Persistence through browser refreshes

### Training-Day Logic

Gymeer separates **sessions** from **training days**.

Example:

```text
Monday
- Strength session
- Cardio session

Result
- 2 completed sessions
- 1 training day
```

Weekly goals and streaks use unique local calendar dates based on each session's start time.

Session metrics still include every completed workout:

- Sessions this week
- Total sessions
- Total gym time
- Average session duration

### Multiple Sessions Per Day

After completing the first workout of the day, the primary action changes from:

```text
Check In Now
```

to:

```text
Add Another Session
```

Additional sessions are stored in History and included in gym-time analytics, but the calendar day counts only once toward the weekly training-day goal.

### Weekly Training-Day Goal

Users can choose a weekly target from 2 to 7 training days.

The target can be configured from:

- Today
- Settings

Changing the target recalculates current and previous streak history using the new training-day target.

### Weekly Streaks

Gymeer calculates:

- Current streak
- Longest streak
- Goals achieved
- Recent weekly training-day history

Weeks run from Monday to Sunday.

The current week does not break an existing streak before the user has had the opportunity to complete the weekly goal.

### Intentional Rest Days

Users can record a Rest Day with:

- Rest date
- Reason
- Optional note

Supported reasons include:

- Scheduled rest
- Recovery
- Poor sleep
- Busy day
- Feeling unwell
- Other

Rest Days:

- Do not count as workouts
- Do not increase training-day progress
- Do not increase gym time
- Do not increase weekly streaks
- Appear separately in History

### Workout and Rest-Day Conflict Protection

Gymeer prevents a completed workout and a Rest Day from existing on the same calendar date.

If a workout already exists on a selected date:

```text
Rest Day saving is blocked
```

If a Rest Day exists today and the user starts a workout:

```text
Keep Rest Day
or
Start Workout Instead
```

Choosing Start Workout removes today's Rest Day before opening Check-In.

### Short-Session Protection

Sessions shorter than five minutes trigger a warning before saving.

The user can choose:

```text
Continue Training
or
Save Anyway
```

This protects against accidental completion while still allowing deliberate short workouts.

### Long-Running Session Protection

Sessions active for six hours trigger a long-running warning.

The user can choose:

```text
Continue Session
Finish Session
Discard Session
```

Gymeer does not automatically finish or discard a workout.

### Session Completion Summary

After a workout is saved, Gymeer displays:

- Completed activity
- Duration
- Mood
- Optional note
- Weekly training-day progress
- View History action

### Mood and Notes

Completed workouts can include a mood:

- Tough
- Okay
- Great

Users can also save an optional note of up to 280 characters.

### History

History combines completed workouts and Rest Days in date order.

Users can:

- Search workout and Rest-Day records
- Sort newest or oldest
- Filter by Rest Day or activity type
- Edit completed workouts
- Delete workouts with confirmation
- Delete Rest Days with confirmation

### Progress Analytics

The Progress page includes:

- Weekly training-day goal
- Sessions this week
- Total sessions
- Total gym time
- Average session duration
- Current weekly streak
- Longest weekly streak
- Recent consistency history

### Backup and Restore

Gymeer uses backup schema version 2.

A backup contains:

- Display name
- Weekly training-day target
- Theme preference
- Completed workout sessions
- Rest Days

Users can:

- Export a JSON backup
- Preview a validated backup before importing
- Restore sessions, Rest Days, and preferences
- Import supported version 1 GymFlow backups for backward compatibility

New backup filenames use the Gymeer brand:

```text
gymeer-backup-YYYY-MM-DD.json
```

### Active-Session Data Protection

While a workout is active:

- Backup export remains available
- Backup import is blocked
- Settings provides a Go to Today action
- Reset warns that the active session will be permanently discarded

### Reset All Data

Reset requires explicit confirmation and removes:

- Active session
- Completed sessions
- Rest Days
- User preferences

Users are encouraged to export a backup first.

### Installable Progressive Web App

Gymeer is an installable Progressive Web App.

The PWA experience includes:

- Install banner
- Native browser installation where supported
- iPhone and iPad Add to Home Screen instructions
- Standalone display mode
- Mobile safe-area support
- Light and dark themes

## Local-First Architecture

Gymeer currently uses a local-first, single-user architecture.

The current version does not require:

- Registration
- Login
- Remote database
- Cloud account

Workout history and preferences are stored in browser `localStorage`.

### Local Data Limitations

Because data is stored locally:

- Data does not automatically sync between browsers or devices
- Clearing browser data can remove local history
- Incognito windows use separate temporary storage
- Different domains have separate browser storage

Users should export backups regularly.

## Legacy Storage Compatibility

Gymeer retains the original internal GymFlow storage keys during the initial rebrand so existing local data remains accessible on the same domain.

Examples include:

```text
gymflow-session-storage
gymflow-settings-storage
gymflow-rest-day-storage
gymflow-install-banner-dismissed-at
```

These keys are internal implementation details and do not affect the visible Gymeer brand.

A future migration may rename the keys while preserving existing user data.

## Domain Migration Note

Browser `localStorage` is isolated by origin.

Data stored at:

```text
https://gym.ridzu.one
```

does not automatically appear at:

```text
https://gymeer.ridzu.one
```

Before the legacy domain is redirected, existing users should:

1. Open the previous domain
2. Export a backup
3. Open the Gymeer domain
4. Import the backup

After migration, the legacy domain can redirect to the new canonical domain.

## Technology Stack

Gymeer is built with:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Zustand
- next-themes
- Lucide React
- Progressive Web App capabilities
- Vercel

## Getting Started

### Requirements

- Node.js
- npm

### Clone the Repository

```bash
git clone https://github.com/ameeridz/gymflow.git
cd gymflow
```

### Install Dependencies

```bash
npm install
```

### Start Development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Quality Checks

```bash
npm run lint
npm run build
```

## Development Workflow

Gymeer is developed using small, reviewable milestones:

```text
Feature branch
→ Implement one focused change
→ Test mobile and desktop
→ Run lint
→ Run production build
→ Commit
→ Push
→ Pull request
→ Merge
→ Production smoke test
```

## Design Principles

Gymeer follows these product principles:

- Mobile-first
- Simple before complex
- Consistency over perfection
- Training days over inflated session counts
- Recovery without guilt
- Clear confirmation before destructive actions
- Local data ownership
- Progressive enhancement
- Accessible touch targets
- Responsive light and dark themes

## SEO and Brand Identity

The canonical Gymeer identity uses:

```text
Name: Gymeer
Title: Gymeer — Gym Check-In & Training Day Tracker
Domain: https://gymeer.ridzu.one
Creator: Ridzjuan
```

The application includes metadata, Open Graph information, a PWA manifest, and WebSite structured data to help search engines understand the product identity.

## Current Scope

Gymeer is an active personal project and functional MVP.

The current product deliberately focuses on consistency tracking rather than detailed workout programming.

Not currently included:

- User accounts
- Cloud synchronization
- Exercise libraries
- Sets and repetitions
- Weight tracking
- Personal-record tracking
- Social features

These features may be considered after the local-first experience remains stable.

## Creator

Gymeer was designed and developed by **Ridzjuan**.

Portfolio:

```text
https://ridzu.one
```

## License

This project is maintained as a personal portfolio and product-development project. Add a formal license before permitting external reuse or distribution.


## Creator

Gymeer was designed and developed by **Ridzjuan**.

- Personal website: [https://ridzu.one](https://ridzu.one)
- GitHub: https://github.com/ameeridz

> Build consistency with Ridzjuan.