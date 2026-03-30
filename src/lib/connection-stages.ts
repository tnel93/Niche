/**
 * Progressive trust ladder — DB `connections.stage` + server-side action guards.
 * @see SPEC.md · supabase/migrations/
 */

export const CONNECTION_STAGES = [
  "anonymous",
  "photos_requested",
  "photos_shared",
  "meet_requested",
  "consent_pending",
  "consent_signed",
  "verification_pending",
  "verified",
  "booking_ready",
  "booking_active",
  "completed",
  "blocked",
  "expired",
] as const;

/** Spec name for the stage list (subset excludes terminal states in some docs). */
export const STAGES = [
  "anonymous",
  "photos_requested",
  "photos_shared",
  "meet_requested",
  "consent_pending",
  "consent_signed",
  "verification_pending",
  "verified",
  "booking_ready",
  "booking_active",
  "completed",
] as const;

export type ConnectionStage = (typeof CONNECTION_STAGES)[number];

const VALID_TRANSITIONS: Record<ConnectionStage, ConnectionStage[]> = {
  anonymous: ["photos_requested", "blocked", "expired"],
  photos_requested: ["photos_shared", "anonymous", "blocked"],
  photos_shared: ["meet_requested", "anonymous", "blocked"],
  meet_requested: ["consent_pending", "photos_shared", "blocked"],
  consent_pending: ["consent_signed", "photos_shared", "blocked"],
  consent_signed: ["verification_pending", "photos_shared", "blocked"],
  verification_pending: ["verified", "consent_signed", "blocked"],
  verified: ["booking_ready", "blocked"],
  booking_ready: ["booking_active", "blocked"],
  booking_active: ["completed", "blocked"],
  completed: ["booking_ready", "blocked"],
  blocked: [],
  expired: [],
};

export function canTransition(from: ConnectionStage, to: ConnectionStage): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

const ALL_EXCEPT_TERMINAL = CONNECTION_STAGES.filter((s) => s !== "blocked" && s !== "expired");

export function validateStageForAction(stage: ConnectionStage, action: string): boolean {
  const requirements: Record<string, ConnectionStage[]> = {
    send_message: [...ALL_EXCEPT_TERMINAL],
    request_photos: ["anonymous"],
    consent_photos: ["photos_requested"],
    share_photos: ["photos_requested"],
    request_meet: ["photos_shared"],
    create_consent: ["meet_requested", "consent_pending"],
    sign_consent: ["consent_pending"],
    start_verify: ["consent_signed"],
    share_address: ["booking_ready"],
    create_booking: ["booking_ready"],
    view_address: ["booking_ready", "booking_active"],
    view_real_name: ["verified", "booking_ready", "booking_active", "completed"],
    view_photos: [
      "photos_shared",
      "meet_requested",
      "consent_pending",
      "consent_signed",
      "verification_pending",
      "verified",
      "booking_ready",
      "booking_active",
      "completed",
    ],
  };
  return requirements[action]?.includes(stage) ?? false;
}

/** UI ladder (SPEC TRUST_LADDER_UI). */
export const TRUST_LADDER_UI = [
  { stage: "anonymous" as const, emoji: "🔒", label: "Anonymous" },
  { stage: "photos_shared" as const, emoji: "📸", label: "Photos" },
  { stage: "consent_signed" as const, emoji: "🤝", label: "Consent" },
  { stage: "verified" as const, emoji: "🔐", label: "Verified" },
  { stage: "booking_ready" as const, emoji: "📅", label: "Booking" },
] as const;

/** Maps DB stage → furthest progress step for the 5-step strip (approximate). */
export function connectionStageToUiStep(stage: ConnectionStage): number {
  const order: ConnectionStage[] = [
    "anonymous",
    "photos_requested",
    "photos_shared",
    "meet_requested",
    "consent_pending",
    "consent_signed",
    "verification_pending",
    "verified",
    "booking_ready",
    "booking_active",
    "completed",
  ];
  const blockedExpired = stage === "blocked" || stage === "expired";
  if (blockedExpired) return 0;
  const idx = order.indexOf(stage);
  if (idx < 0) return 0;
  if (idx <= order.indexOf("anonymous")) return 0;
  if (idx < order.indexOf("photos_shared")) return 0;
  if (idx < order.indexOf("consent_signed")) return 1;
  if (idx < order.indexOf("verified")) return 2;
  if (idx < order.indexOf("booking_ready")) return 3;
  return 4;
}

/** @deprecated use TRUST_LADDER_UI */
export const TRUST_LADDER_UI_STAGES = TRUST_LADDER_UI;
