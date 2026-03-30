/**
 * Anonymous chat PII detection (SPEC). Block message; do not leak sanitized content to peers.
 */

const PII_PATTERNS: RegExp[] = [
  /(\+?1[-.\s]?)?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  /(?:^|\s)@[a-zA-Z0-9_]{2,30}(?:\s|$)/g,
  /https?:\/\/[^\s]+/gi,
  /\b(?:ig|insta|instagram|twitter|snap|snapchat|tiktok|facebook|fb|linkedin|whatsapp|telegram|signal|discord)\b\s*[:=]?\s*[a-zA-Z0-9._-]+/gi,
  /\b(?:find|dm|message|text|call|reach|contact|hit)\s+(?:me|us)\s+(?:on|at|via)\b/gi,
  /\d{1,5}\s+(?:N|S|E|W|North|South|East|West|NE|NW|SE|SW)?\s*(?:[A-Z][a-z]+\s+){1,3}(?:St|Street|Ave|Avenue|Blvd|Boulevard|Dr|Drive|Ln|Lane|Ct|Court|Rd|Road|Way|Pl|Place)\b/gi,
  /\b\d{5}(?:-\d{4})?\b/g,
];

const IDENTITY_PHRASES: RegExp[] = [
  /\bmy\s+(?:real\s+)?name\s+is\b/gi,
  /\bmy\s+(?:full\s+)?name\b/gi,
  /\bi\s+(?:am|go\s+by)\s+[A-Z][a-z]+\s+[A-Z][a-z]+/g,
  /\bmy\s+(?:business|company|shop|studio|practice)\s+(?:is|called)\b/gi,
  /\bcome\s+(?:to|visit)\s+(?:my|the)\b/gi,
];

export interface ModerationResult {
  isClean: boolean;
  flaggedPatterns: string[];
  sanitizedMessage: string | null;
}

export function moderateMessage(text: string): ModerationResult {
  const flagged: string[] = [];

  for (const pattern of [...PII_PATTERNS, ...IDENTITY_PHRASES]) {
    const matches = text.match(pattern);
    if (matches) {
      flagged.push(...matches);
    }
  }

  if (flagged.length === 0) {
    return { isClean: true, flaggedPatterns: [], sanitizedMessage: null };
  }

  return {
    isClean: false,
    flaggedPatterns: flagged,
    sanitizedMessage: null,
  };
}

export const MODERATION_NOTICE =
  "⚠️ For your safety, identifying information can't be shared until both parties complete the trust ladder. This includes names, phone numbers, emails, social media, and addresses.";
