/**
 * Connection `stage` values — progressive trust ladder (DB + product).
 * @see supabase/migrations/*_initial_schema.sql
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

export type ConnectionStage = (typeof CONNECTION_STAGES)[number];

/** Ordered stages for UI (excludes terminal / meta states). */
export const TRUST_LADDER_UI_STAGES: {
  stage: ConnectionStage;
  emoji: string;
  label: string;
}[] = [
  { stage: "anonymous", emoji: "🔒", label: "Anonymous" },
  { stage: "photos_shared", emoji: "📸", label: "Photos" },
  { stage: "consent_signed", emoji: "🤝", label: "Consent signed" },
  { stage: "verified", emoji: "🔐", label: "ID verified" },
  { stage: "booking_ready", emoji: "📅", label: "Book" },
];
