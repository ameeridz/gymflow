import type {
  ActivityType,
  GymSession,
  SessionMood,
} from "@/types/session";

const supportedActivityTypes: ActivityType[] = [
  "strength",
  "cardio",
  "mixed",
  "mobility",
  "quick",
];

const supportedSessionMoods: SessionMood[] = [
  "tough",
  "okay",
  "great",
];

const supportedThemes = [
  "light",
  "dark",
  "system",
] as const;

type SupportedTheme =
  (typeof supportedThemes)[number];

export interface GymFlowBackup {
  version: number;
  exportedAt: string;

  settings: {
    displayName: string;
    weeklyTarget: number;
    theme: SupportedTheme;
  };

  completedSessions: GymSession[];
}

export type BackupValidationResult =
  | {
      valid: true;
      data: GymFlowBackup;
    }
  | {
      valid: false;
      error: string;
    };

type SessionValidationResult =
  | {
      valid: true;
      session: GymSession;
    }
  | {
      valid: false;
      error: string;
    };

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isValidDateString(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    !Number.isNaN(new Date(value).getTime())
  );
}

function isActivityType(
  value: unknown,
): value is ActivityType {
  return (
    typeof value === "string" &&
    supportedActivityTypes.includes(
      value as ActivityType,
    )
  );
}

function isSessionMood(
  value: unknown,
): value is SessionMood {
  return (
    typeof value === "string" &&
    supportedSessionMoods.includes(
      value as SessionMood,
    )
  );
}

function isSupportedTheme(
  value: unknown,
): value is SupportedTheme {
  return (
    typeof value === "string" &&
    supportedThemes.includes(
      value as SupportedTheme,
    )
  );
}

function validateCompletedSession(
  value: unknown,
  index: number,
): SessionValidationResult {
  const sessionNumber = index + 1;

  if (!isRecord(value)) {
    return {
      valid: false,
      error: `Session ${sessionNumber} is not valid.`,
    };
  }

  if (
    typeof value.id !== "string" ||
    value.id.trim().length === 0
  ) {
    return {
      valid: false,
      error: `Session ${sessionNumber} has an invalid ID.`,
    };
  }

  if (!isActivityType(value.activityType)) {
    return {
      valid: false,
      error: `Session ${sessionNumber} has an unsupported activity type.`,
    };
  }

  if (!isValidDateString(value.startedAt)) {
    return {
      valid: false,
      error: `Session ${sessionNumber} has an invalid start date.`,
    };
  }

  if (!isValidDateString(value.endedAt)) {
    return {
      valid: false,
      error: `Session ${sessionNumber} has an invalid end date.`,
    };
  }

  if (
    typeof value.durationSeconds !== "number" ||
    !Number.isFinite(value.durationSeconds) ||
    value.durationSeconds < 0
  ) {
    return {
      valid: false,
      error: `Session ${sessionNumber} has an invalid duration.`,
    };
  }

  if (!isSessionMood(value.mood)) {
    return {
      valid: false,
      error: `Session ${sessionNumber} has an invalid mood.`,
    };
  }

  if (typeof value.note !== "string") {
    return {
      valid: false,
      error: `Session ${sessionNumber} has an invalid note.`,
    };
  }

  if (value.status !== "completed") {
    return {
      valid: false,
      error: `Session ${sessionNumber} is not a completed session.`,
    };
  }

  const validatedSession: GymSession = {
    id: value.id,
    activityType: value.activityType,
    startedAt: value.startedAt,
    endedAt: value.endedAt,
    durationSeconds: value.durationSeconds,
    mood: value.mood,
    note: value.note.slice(0, 280),
    status: "completed",
  };

  return {
    valid: true,
    session: validatedSession,
  };
}

export function validateBackup(
  value: unknown,
): BackupValidationResult {
  if (!isRecord(value)) {
    return {
      valid: false,
      error:
        "The selected file is not a GymFlow backup.",
    };
  }

  if (value.version !== 1) {
    return {
      valid: false,
      error:
        "This backup version is not supported by GymFlow.",
    };
  }

  if (!isValidDateString(value.exportedAt)) {
    return {
      valid: false,
      error:
        "The backup export date is invalid.",
    };
  }

  if (!isRecord(value.settings)) {
    return {
      valid: false,
      error:
        "The backup settings are missing.",
    };
  }

  const displayName =
    typeof value.settings.displayName === "string"
      ? value.settings.displayName
          .trim()
          .slice(0, 40)
      : "";

  if (
    typeof value.settings.weeklyTarget !== "number" ||
    !Number.isFinite(
      value.settings.weeklyTarget,
    )
  ) {
    return {
      valid: false,
      error:
        "The weekly target is invalid.",
    };
  }

  const weeklyTarget = Math.min(
    7,
    Math.max(
      2,
      Math.round(
        value.settings.weeklyTarget,
      ),
    ),
  );

  if (!isSupportedTheme(value.settings.theme)) {
    return {
      valid: false,
      error:
        "The backup theme is invalid.",
    };
  }

  if (!Array.isArray(value.completedSessions)) {
    return {
      valid: false,
      error:
        "The completed session history is missing.",
    };
  }

  const completedSessions: GymSession[] = [];

  for (
    let index = 0;
    index < value.completedSessions.length;
    index += 1
  ) {
    const result = validateCompletedSession(
      value.completedSessions[index],
      index,
    );

    if (!result.valid) {
      return {
        valid: false,
        error: result.error,
      };
    }

    completedSessions.push(result.session);
  }

  const validatedBackup: GymFlowBackup = {
    version: 1,
    exportedAt: value.exportedAt,

    settings: {
      displayName,
      weeklyTarget,
      theme: value.settings.theme,
    },

    completedSessions,
  };

  return {
    valid: true,
    data: validatedBackup,
  };
}

export function parseBackupFile(
  fileContent: string,
): BackupValidationResult {
  try {
    const parsedData: unknown =
      JSON.parse(fileContent);

    return validateBackup(parsedData);
  } catch {
    return {
      valid: false,
      error:
        "The selected file does not contain valid JSON.",
    };
  }
}