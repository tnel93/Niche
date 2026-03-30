"use client";

/**
 * NICHE — complete design system & component library (living spec).
 * Every token, component, pattern, and page layout reference is defined here
 * as renderable code. Tokens: ./tokens.ts
 */

import { useState } from "react";
import { TRUST_LADDER_UI } from "@/lib/connection-stages";
import { T } from "./tokens";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "56px" }}>
      <h2
        style={{
          fontFamily: T.font.brand,
          fontSize: T.fontSize["2xl"],
          fontWeight: T.fontWeight.heavy,
          color: T.color.text,
          margin: "0 0 4px 0",
          letterSpacing: T.letterSpacing.tight,
        }}
      >
        {title}
      </h2>
      {description ? (
        <p
          style={{
            fontSize: T.fontSize.md,
            color: T.color.textSoft,
            margin: "0 0 24px 0",
            lineHeight: T.lineHeight.relaxed,
          }}
        >
          {description}
        </p>
      ) : (
        <div style={{ height: "20px" }} />
      )}
      {children}
    </div>
  );
}

function Swatch({
  color,
  name,
  value,
  dark,
}: {
  color: string;
  name: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: T.radius.lg,
          background: color,
          border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : T.color.border}`,
          margin: "0 auto 8px",
          boxShadow: T.shadow.sm,
        }}
      />
      <div
        style={{
          fontSize: T.fontSize.sm,
          fontWeight: T.fontWeight.semi,
          color: T.color.text,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontSize: T.fontSize.xs,
          color: T.color.textMuted,
          fontFamily: T.font.mono,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ComponentDemo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          fontSize: T.fontSize.xs,
          fontWeight: T.fontWeight.bold,
          color: T.color.textMuted,
          textTransform: "uppercase",
          letterSpacing: T.letterSpacing.caps,
          marginBottom: "10px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Btn({
  variant = "primary",
  size = "md",
  children,
  disabled,
}: {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const styles = {
    primary: {
      bg: T.color.accent,
      color: "#fff",
      border: "none",
      hover: T.color.accentHover,
      shadow: T.shadow.glow,
    },
    secondary: {
      bg: "transparent",
      color: T.color.textSoft,
      border: `1.5px solid ${T.color.border}`,
      hover: T.color.surfaceHover,
      shadow: "none",
    },
    ghost: {
      bg: "transparent",
      color: T.color.accent,
      border: "none",
      hover: T.color.accentSoft,
      shadow: "none",
    },
    danger: {
      bg: T.color.red,
      color: "#fff",
      border: "none",
      hover: "#C84040",
      shadow: "0 4px 16px rgba(224,82,82,0.25)",
    },
  };
  const sizes = {
    sm: { padding: "8px 14px", fontSize: T.fontSize.sm, radius: T.radius.sm },
    md: { padding: "12px 20px", fontSize: T.fontSize.base, radius: T.radius.md },
    lg: { padding: "16px 28px", fontSize: "16px", radius: T.radius.lg },
    xl: { padding: "18px 32px", fontSize: T.fontSize.lg, radius: T.radius.lg },
  };
  const s = styles[variant];
  const sz = sizes[size];
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        background: disabled ? T.color.border : hovered ? s.hover : s.bg,
        color: disabled ? T.color.textMuted : s.color,
        border: s.border,
        borderRadius: sz.radius,
        padding: sz.padding,
        fontSize: sz.fontSize,
        fontWeight: T.fontWeight.bold,
        fontFamily: T.font.body,
        cursor: disabled ? "not-allowed" : "pointer",
        transition: T.transition.base,
        letterSpacing: T.letterSpacing.wide,
        boxShadow: hovered && !disabled ? s.shadow : "none",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );
}

function BadgeDemo({
  variant = "default",
  children,
}: {
  variant?: "default" | "accent" | "green" | "red" | "purple" | "amber";
  children: React.ReactNode;
}) {
  const styles = {
    default: {
      bg: T.color.bgAlt,
      color: T.color.textMuted,
      border: T.color.borderLight,
    },
    accent: {
      bg: T.color.accentSoft,
      color: T.color.accent,
      border: `${T.color.accent}25`,
    },
    green: {
      bg: T.color.greenSoft,
      color: T.color.green,
      border: `${T.color.green}30`,
    },
    red: {
      bg: T.color.redSoft,
      color: T.color.red,
      border: `${T.color.red}30`,
    },
    purple: {
      bg: T.color.purpleSoft,
      color: T.color.purple,
      border: `${T.color.purple}30`,
    },
    amber: {
      bg: T.color.amberSoft,
      color: T.color.amber,
      border: `${T.color.amber}30`,
    },
  };
  const st = styles[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 12px",
        borderRadius: T.radius.full,
        fontSize: T.fontSize.sm,
        fontWeight: T.fontWeight.semi,
        color: st.color,
        background: st.bg,
        border: `1px solid ${st.border}`,
        letterSpacing: T.letterSpacing.wide,
      }}
    >
      {children}
    </span>
  );
}

function InputDemo({ placeholder, label }: { placeholder?: string; label?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ flex: 1, minWidth: "200px" }}>
      {label ? (
        <label
          style={{
            display: "block",
            fontSize: T.fontSize.sm,
            fontWeight: T.fontWeight.bold,
            color: T.color.textSoft,
            marginBottom: "6px",
          }}
        >
          {label}
        </label>
      ) : null}
      <input
        type="text"
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          padding: "13px 16px",
          borderRadius: T.radius.md,
          fontSize: T.fontSize.base,
          fontFamily: T.font.body,
          background: focused ? T.color.surface : T.color.bgAlt,
          border: `1.5px solid ${focused ? T.color.borderFocus : T.color.border}`,
          color: T.color.text,
          outline: "none",
          boxSizing: "border-box",
          transition: T.transition.base,
          boxShadow: focused ? `0 0 0 3px ${T.color.accentSoft}` : "none",
        }}
      />
    </div>
  );
}

function Avatar({
  initials,
  size = 48,
  idx = 0,
  online,
}: {
  initials: string;
  size?: number;
  idx?: number;
  online?: boolean;
}) {
  const [c1, c2] = T.color.avatarGradients[idx % T.color.avatarGradients.length];
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size > 60 ? T.radius.xl : T.radius.lg,
          background: `linear-gradient(135deg, ${c1}, ${c2})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.3,
          fontWeight: T.fontWeight.heavy,
          color: "#fff",
          letterSpacing: T.letterSpacing.wider,
        }}
      >
        {initials}
      </div>
      {online ? (
        <div
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: size * 0.24,
            height: size * 0.24,
            borderRadius: "50%",
            background: T.color.teal,
            border: `2px solid ${T.color.surface}`,
          }}
        />
      ) : null}
    </div>
  );
}

function Card({
  children,
  hoverable = true,
}: {
  children: React.ReactNode;
  hoverable?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => hoverable && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.color.surface,
        borderRadius: T.radius.xl,
        padding: "24px",
        border: `1px solid ${hovered ? `${T.color.accent}40` : T.color.border}`,
        boxShadow: hovered ? T.shadow.cardHover : T.shadow.card,
        transition: T.transition.base,
        transform: hovered ? "translateY(-3px)" : "none",
        cursor: hoverable ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
}

function TagChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 14px",
        borderRadius: T.radius.full,
        fontSize: T.fontSize.sm,
        fontWeight: T.fontWeight.semi,
        fontFamily: T.font.body,
        cursor: "pointer",
        transition: T.transition.fast,
        border: "none",
        background: active ? T.color.accentSoft : "transparent",
        color: active ? T.color.accent : T.color.textMuted,
        outline: `1px solid ${active ? `${T.color.accent}30` : T.color.border}`,
      }}
    >
      {label}
    </button>
  );
}

function CategoryPill({
  emoji,
  label,
  active,
}: {
  emoji: string;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "10px 18px",
        borderRadius: T.radius.md,
        fontSize: T.fontSize.base,
        fontWeight: T.fontWeight.bold,
        fontFamily: T.font.body,
        cursor: "pointer",
        border: "none",
        transition: T.transition.base,
        background: active ? T.color.accent : T.color.surface,
        color: active ? "#fff" : T.color.textSoft,
        boxShadow: active ? T.shadow.glow : T.shadow.sm,
      }}
    >
      {emoji} {label}
    </button>
  );
}

function PhotoExchangeBtn() {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "12px 22px",
        borderRadius: T.radius.lg,
        fontSize: T.fontSize.base,
        fontWeight: T.fontWeight.bold,
        fontFamily: T.font.body,
        cursor: "pointer",
        border: `1.5px solid ${T.color.border}`,
        background: hov ? T.color.surfaceHover : "transparent",
        color: T.color.textSoft,
        letterSpacing: T.letterSpacing.wide,
        transition: T.transition.base,
      }}
    >
      📸 Exchange photos
    </button>
  );
}

function MeetRequestBtn() {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "16px 32px",
        borderRadius: T.radius.lg,
        fontSize: "16px",
        fontWeight: T.fontWeight.heavy,
        fontFamily: T.font.body,
        cursor: "pointer",
        border: "none",
        background: hov
          ? `linear-gradient(135deg, ${T.color.accentHover}, ${T.color.accentPressed})`
          : `linear-gradient(135deg, ${T.color.accent}, ${T.color.accentHover})`,
        color: "#fff",
        letterSpacing: T.letterSpacing.wide,
        boxShadow: hov ? "0 8px 32px rgba(232,115,74,0.35)" : T.shadow.glow,
        transition: T.transition.base,
        transform: hov ? "translateY(-1px)" : "none",
      }}
    >
      🤝 I&apos;d like to meet in person
    </button>
  );
}

/** Gradient CTA — same visual weight as meet request; 🔓 variant from the base design spec. */
function RevealBtn() {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "16px 32px",
        borderRadius: T.radius.lg,
        fontSize: "16px",
        fontWeight: T.fontWeight.heavy,
        fontFamily: T.font.body,
        cursor: "pointer",
        border: "none",
        background: hov
          ? `linear-gradient(135deg, ${T.color.accentHover}, ${T.color.accentPressed})`
          : `linear-gradient(135deg, ${T.color.accent}, ${T.color.accentHover})`,
        color: "#fff",
        letterSpacing: T.letterSpacing.wide,
        boxShadow: hov ? "0 8px 32px rgba(232,115,74,0.35)" : T.shadow.glow,
        transition: T.transition.base,
        transform: hov ? "translateY(-1px)" : "none",
      }}
    >
      🔓 I&apos;d like to meet in person
    </button>
  );
}

function VerifiedBadge({ type = "id" }: { type?: "id" | "bg" | "consent" }) {
  const config = {
    id: { emoji: "✅", label: "ID Verified", color: T.color.green, bg: T.color.greenSoft },
    bg: { emoji: "🛡", label: "BG Checked", color: T.color.green, bg: T.color.greenSoft },
    consent: {
      emoji: "🎓",
      label: "Consent Cert",
      color: T.color.purple,
      bg: T.color.purpleSoft,
    },
  };
  const c = config[type];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "3px 10px",
        borderRadius: T.radius.full,
        fontSize: T.fontSize.xs,
        fontWeight: T.fontWeight.semi,
        color: c.color,
        background: c.bg,
        border: `1px solid ${c.color}30`,
      }}
    >
      {c.emoji} {c.label}
    </span>
  );
}

function ConsentStep({
  number,
  title,
  done,
}: {
  number: string;
  title: string;
  done: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
        padding: "14px 16px",
        borderRadius: T.radius.md,
        background: done ? T.color.greenSoft : T.color.bgAlt,
        border: `1px solid ${done ? `${T.color.green}25` : T.color.borderLight}`,
      }}
    >
      <div
        style={{
          width: "28px",
          height: "28px",
          borderRadius: T.radius.sm,
          flexShrink: 0,
          background: done ? T.color.green : T.color.accentSoft,
          color: done ? "#fff" : T.color.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: T.fontSize.sm,
          fontWeight: T.fontWeight.heavy,
        }}
      >
        {done ? "✓" : number}
      </div>
      <div
        style={{
          fontSize: T.fontSize.base,
          fontWeight: T.fontWeight.semi,
          color: done ? T.color.green : T.color.text,
        }}
      >
        {title}
      </div>
    </div>
  );
}

function ProviderCardDemo() {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: T.color.surface,
        borderRadius: T.radius.xl,
        padding: "24px",
        border: `1px solid ${hov ? `${T.color.accent}40` : T.color.border}`,
        boxShadow: hov ? T.shadow.cardHover : T.shadow.card,
        transition: T.transition.base,
        cursor: "pointer",
        transform: hov ? "translateY(-3px)" : "none",
        maxWidth: "380px",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", gap: "14px", marginBottom: "14px" }}>
        <Avatar initials="SH" size={50} idx={0} online />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              marginBottom: "3px",
            }}
          >
            <span
              style={{
                fontSize: T.fontSize.lg,
                fontWeight: T.fontWeight.bold,
                color: T.color.text,
              }}
            >
              SteadyHands_303
            </span>
            <span title="Platform Verified" style={{ fontSize: "14px" }}>
              ✅
            </span>
          </div>
          <div style={{ fontSize: T.fontSize.base, color: T.color.textMuted }}>
            Barber · &ldquo;Patient & precise&rdquo;
          </div>
        </div>
        <div
          style={{
            padding: "6px 12px",
            borderRadius: T.radius.sm,
            background: T.color.bgWarm,
            alignSelf: "flex-start",
          }}
        >
          <span
            style={{
              fontSize: T.fontSize.lg,
              fontWeight: T.fontWeight.heavy,
              color: T.color.accent,
            }}
          >
            $80–110
          </span>
        </div>
      </div>
      <p
        style={{
          fontSize: T.fontSize.base,
          color: T.color.textSoft,
          lineHeight: T.lineHeight.relaxed,
          margin: "0 0 14px 0",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        Slow, intentional haircuts for clients who appreciate the full sensory ritual.
        Straight razor specialist with 8 years experience.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "14px" }}>
        <BadgeDemo variant="accent">Straight Razor</BadgeDemo>
        <BadgeDemo variant="accent">Scalp Massage</BadgeDemo>
        <BadgeDemo variant="accent">ASMR</BadgeDemo>
        <BadgeDemo>+2</BadgeDemo>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "12px",
          borderTop: `1px solid ${T.color.borderLight}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: T.color.amber }}>★</span>
          <span
            style={{
              fontSize: T.fontSize.base,
              fontWeight: T.fontWeight.bold,
              color: T.color.text,
            }}
          >
            4.9
          </span>
          <span style={{ fontSize: T.fontSize.sm, color: T.color.textMuted }}>
            (127)
          </span>
        </div>
        <span style={{ fontSize: T.fontSize.sm, color: T.color.textMuted }}>
          ~4 mi · Denver Metro
        </span>
      </div>
    </div>
  );
}

function MsgBubble({
  text,
  isOwn,
  time,
}: {
  text: string;
  isOwn?: boolean;
  time: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: isOwn ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          maxWidth: "280px",
          padding: "12px 16px",
          borderRadius: T.radius.lg,
          borderBottomRightRadius: isOwn ? "4px" : T.radius.lg,
          borderBottomLeftRadius: isOwn ? T.radius.lg : "4px",
          background: isOwn ? T.color.accent : T.color.bgAlt,
          color: isOwn ? "#fff" : T.color.text,
          fontSize: T.fontSize.base,
          lineHeight: T.lineHeight.relaxed,
        }}
      >
        {text}
        <div
          style={{
            fontSize: T.fontSize.xs,
            color: isOwn ? "rgba(255,255,255,0.6)" : T.color.textMuted,
            marginTop: "4px",
            textAlign: "right",
          }}
        >
          {time}
        </div>
      </div>
    </div>
  );
}

function SystemMsg({ text, icon = "🔒" }: { text: string; icon?: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        margin: "16px 0",
        padding: "12px 20px",
        borderRadius: T.radius.full,
        background: T.color.bgWarm,
        border: `1px solid ${T.color.border}`,
        fontSize: T.fontSize.sm,
        color: T.color.textSoft,
        fontWeight: T.fontWeight.semi,
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {icon} {text}
    </div>
  );
}

export default function DesignSystemShowcase() {
  const [activeTags, setActiveTags] = useState(["Straight Razor", "ASMR"]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.color.bg,
        fontFamily: T.font.body,
        color: T.color.text,
      }}
    >
      <div
        style={{
          padding: "32px 40px",
          borderBottom: `1px solid ${T.color.border}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <span
            style={{
              fontFamily: T.font.brand,
              fontSize: T.fontSize["3xl"],
              fontWeight: T.fontWeight.heavy,
              color: T.color.accent,
              letterSpacing: T.letterSpacing.tight,
            }}
          >
            niche
          </span>
          <span
            style={{
              fontSize: T.fontSize.sm,
              color: T.color.textMuted,
              marginLeft: "12px",
              letterSpacing: T.letterSpacing.caps,
              textTransform: "uppercase",
            }}
          >
            design system v1.0
          </span>
        </div>
        <div style={{ fontSize: T.fontSize.sm, color: T.color.textMuted }}>
          For Cursor agent reference — all tokens, components &amp; patterns
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 40px" }}>
        <Section
          title="Brand"
          description="The niche logo is always set in Fraunces (800 weight), lowercase, in terracotta (#E8734A). The tagline &apos;find your thing&apos; is uppercase DM Sans in muted text."
        >
          <div style={{ display: "flex", gap: "48px", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div>
              <div
                style={{
                  fontFamily: T.font.brand,
                  fontSize: "56px",
                  fontWeight: T.fontWeight.heavy,
                  color: T.color.accent,
                  letterSpacing: T.letterSpacing.tight,
                }}
              >
                niche
              </div>
              <div
                style={{
                  fontSize: T.fontSize.sm,
                  color: T.color.textMuted,
                  letterSpacing: T.letterSpacing.caps,
                  textTransform: "uppercase",
                  marginTop: "4px",
                }}
              >
                find your thing
              </div>
            </div>
            <div style={{ padding: "24px 32px", borderRadius: T.radius.xl, background: T.color.bgDark }}>
              <div
                style={{
                  fontFamily: T.font.brand,
                  fontSize: "56px",
                  fontWeight: T.fontWeight.heavy,
                  color: T.color.accent,
                  letterSpacing: T.letterSpacing.tight,
                }}
              >
                niche
              </div>
              <div
                style={{
                  fontSize: T.fontSize.sm,
                  color: "rgba(255,251,247,0.5)",
                  letterSpacing: T.letterSpacing.caps,
                  textTransform: "uppercase",
                  marginTop: "4px",
                }}
              >
                find your thing
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Colors"
          description="Warm cream backgrounds, espresso text (never pure black), terracotta accent. Semantic colors for status states."
        >
          <div
            style={{
              fontSize: T.fontSize.sm,
              fontWeight: T.fontWeight.bold,
              color: T.color.textMuted,
              textTransform: "uppercase",
              letterSpacing: T.letterSpacing.caps,
              marginBottom: "12px",
            }}
          >
            Backgrounds &amp; Surfaces
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}>
            <Swatch color={T.color.bg} name="bg" value="#FFFBF7" />
            <Swatch color={T.color.bgAlt} name="bg-alt" value="#FFF5EC" />
            <Swatch color={T.color.bgWarm} name="bg-warm" value="#FEF0E4" />
            <Swatch color={T.color.surface} name="surface" value="#FFFFFF" />
            <Swatch color={T.color.bgDark} name="bg-dark" value="#1A1410" dark />
          </div>

          <div
            style={{
              fontSize: T.fontSize.sm,
              fontWeight: T.fontWeight.bold,
              color: T.color.textMuted,
              textTransform: "uppercase",
              letterSpacing: T.letterSpacing.caps,
              marginBottom: "12px",
            }}
          >
            Text
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}>
            <Swatch color={T.color.text} name="text" value="#2D2016" dark />
            <Swatch color={T.color.textSoft} name="text-soft" value="#6B5B4E" dark />
            <Swatch color={T.color.textMuted} name="text-muted" value="#A89888" />
          </div>

          <div
            style={{
              fontSize: T.fontSize.sm,
              fontWeight: T.fontWeight.bold,
              color: T.color.textMuted,
              textTransform: "uppercase",
              letterSpacing: T.letterSpacing.caps,
              marginBottom: "12px",
            }}
          >
            Brand &amp; Accent
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "28px" }}>
            <Swatch color={T.color.accent} name="accent" value="#E8734A" />
            <Swatch color={T.color.accentHover} name="accent-hover" value="#D4623B" />
            <Swatch color={T.color.accentPressed} name="accent-pressed" value="#C05530" />
            <Swatch color={T.color.accentSoft} name="accent-soft" value="10% opacity" />
          </div>

          <div
            style={{
              fontSize: T.fontSize.sm,
              fontWeight: T.fontWeight.bold,
              color: T.color.textMuted,
              textTransform: "uppercase",
              letterSpacing: T.letterSpacing.caps,
              marginBottom: "12px",
            }}
          >
            Semantic
          </div>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Swatch color={T.color.green} name="verified" value="#4CAF6E" />
            <Swatch color={T.color.red} name="danger" value="#E05252" />
            <Swatch color={T.color.amber} name="gold" value="#D4A24C" />
            <Swatch color={T.color.purple} name="vibe" value="#8B6CC1" />
            <Swatch color={T.color.teal} name="online" value="#3DAFA5" />
          </div>
        </Section>

        <Section title="Typography" description="Fraunces for brand personality. DM Sans for everything functional.">
          <div style={{ display: "grid", gap: "16px", marginBottom: "24px" }}>
            <div
              style={{
                fontFamily: T.font.brand,
                fontSize: T.fontSize.hero,
                fontWeight: T.fontWeight.heavy,
                color: T.color.text,
                lineHeight: T.lineHeight.tight,
                letterSpacing: T.letterSpacing.tight,
              }}
            >
              Personal services,
              <br />
              <span style={{ color: T.color.accent }}>your way</span>
            </div>
            <div
              style={{
                fontFamily: T.font.brand,
                fontSize: T.fontSize["2xl"],
                fontWeight: T.fontWeight.bold,
                color: T.color.text,
              }}
            >
              Section Heading (Fraunces 700, 24px)
            </div>
            <div
              style={{
                fontFamily: T.font.brand,
                fontSize: T.fontSize.xl,
                fontWeight: T.fontWeight.bold,
                color: T.color.text,
              }}
            >
              Card Title (Fraunces 700, 20px)
            </div>
            <div
              style={{
                fontFamily: T.font.body,
                fontSize: T.fontSize.lg,
                fontWeight: T.fontWeight.bold,
                color: T.color.text,
              }}
            >
              UI Heading (DM Sans 700, 17px)
            </div>
            <div
              style={{
                fontFamily: T.font.body,
                fontSize: T.fontSize.md,
                color: T.color.textSoft,
                lineHeight: T.lineHeight.relaxed,
              }}
            >
              Body text in DM Sans. This is how descriptions, bios, and general content reads.
              Comfortable line-height for long-form readability. (15px, 400 weight, 1.65 line-height)
            </div>
            <div
              style={{
                fontFamily: T.font.body,
                fontSize: T.fontSize.sm,
                fontWeight: T.fontWeight.bold,
                color: T.color.textMuted,
                textTransform: "uppercase",
                letterSpacing: T.letterSpacing.caps,
              }}
            >
              Label / Overline (DM Sans 700, 12px, uppercase, wide tracking)
            </div>
            <div
              style={{
                fontFamily: T.font.mono,
                fontSize: T.fontSize.sm,
                color: T.color.textMuted,
              }}
            >
              Monospace: user IDs, technical info, aliases (JetBrains Mono, 12px)
            </div>
          </div>
        </Section>

        <Section
          title="Anonymous Avatars"
          description="Stage 1 (anonymous): gradient avatar + initials only — no real photos. After mutual photo consent (Stage 2), voluntary exchanged photos may appear; verified selfie and ID-linked imagery only after Stage 4. Eight gradient pairs rotate deterministically from user id."
        >
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
            {T.color.avatarGradients.map(([c1, c2], i) => (
              <Avatar
                key={`${c1}-${c2}`}
                initials={["SH", "MR", "JL", "DX", "RK", "KN", "MS", "AB"][i]!}
                size={56}
                idx={i}
                online={i % 3 === 0}
              />
            ))}
          </div>
          <div style={{ marginTop: "16px", display: "flex", gap: "16px", alignItems: "center" }}>
            <Avatar initials="SH" size={36} idx={0} />
            <Avatar initials="SH" size={48} idx={0} />
            <Avatar initials="SH" size={64} idx={0} online />
            <Avatar initials="SH" size={80} idx={0} />
            <span style={{ fontSize: T.fontSize.sm, color: T.color.textMuted }}>
              ← Sizes: 36, 48, 64, 80px
            </span>
          </div>
        </Section>

        <Section
          title="Buttons"
          description="Primary (terracotta fill), secondary (outlined), ghost (text only), danger (red). Four sizes: sm, md, lg, xl."
        >
          <ComponentDemo label="Variants">
            <Btn variant="primary">Book Session</Btn>
            <Btn variant="secondary">Message</Btn>
            <Btn variant="ghost">Learn More</Btn>
            <Btn variant="danger">Report</Btn>
            <Btn variant="primary" disabled>
              Disabled
            </Btn>
          </ComponentDemo>
          <ComponentDemo label="Sizes">
            <Btn size="sm">Small</Btn>
            <Btn size="md">Medium</Btn>
            <Btn size="lg">Large</Btn>
            <Btn size="xl">Extra Large</Btn>
          </ComponentDemo>
          <ComponentDemo label="Trust ladder — Stage 2 (photo exchange)">
            <PhotoExchangeBtn />
          </ComponentDemo>
          <ComponentDemo label="Trust ladder — Stage 3 (agree to meet)">
            <MeetRequestBtn />
          </ComponentDemo>
          <ComponentDemo label="Alternate meet CTA (🔓 — same treatment as spec hero button)">
            <RevealBtn />
          </ComponentDemo>
        </Section>

        <Section title="Badges & Tags" description="Used for tags, status indicators, and verification badges.">
          <ComponentDemo label="Badge Variants">
            <BadgeDemo>Default</BadgeDemo>
            <BadgeDemo variant="accent">Interest Tag</BadgeDemo>
            <BadgeDemo variant="green">Verified</BadgeDemo>
            <BadgeDemo variant="red">Boundary</BadgeDemo>
            <BadgeDemo variant="purple">Vibe Tag</BadgeDemo>
            <BadgeDemo variant="amber">Gold Status</BadgeDemo>
          </ComponentDemo>
          <ComponentDemo label="Verification Badges">
            <VerifiedBadge type="id" />
            <VerifiedBadge type="bg" />
            <VerifiedBadge type="consent" />
          </ComponentDemo>
          <ComponentDemo label="Interactive Tag Chips">
            {["Hair Cutting", "Straight Razor", "ASMR", "Deep Pressure", "Blindfold OK"].map(
              (t) => (
                <TagChip
                  key={t}
                  label={t}
                  active={activeTags.includes(t)}
                  onClick={() =>
                    setActiveTags((prev) =>
                      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
                    )
                  }
                />
              ),
            )}
          </ComponentDemo>
          <ComponentDemo label="Category Pills">
            <CategoryPill emoji="✂️" label="Barber" active />
            <CategoryPill emoji="🤲" label="Massage" />
            <CategoryPill emoji="🦷" label="Dentist" />
            <CategoryPill emoji="💪" label="Trainer" />
          </ComponentDemo>
        </Section>

        <Section title="Inputs" description="Warm background, subtle border, terracotta focus ring with 3px glow.">
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <InputDemo label="Alias" placeholder="Choose your alias..." />
            <InputDemo label="Search" placeholder="🔍  Search providers, services, tags..." />
          </div>
        </Section>

        <Section
          title="Card"
          description="Default elevated surface: white background, xl radius, lift and accent border on hover."
        >
          <Card>
            <p
              style={{
                margin: 0,
                fontSize: T.fontSize.base,
                color: T.color.textSoft,
                lineHeight: T.lineHeight.relaxed,
              }}
            >
              Generic card container for settings panels, modals, and stacked sections. Provider
              cards use the same hover treatment with marketplace-specific layout.
            </p>
          </Card>
        </Section>

        <Section
          title="Provider Card"
          description="The primary marketplace component. Anonymous — shows alias, gradient avatar, tags, rating, and distance. No real names or face photos."
        >
          <ProviderCardDemo />
        </Section>

        <Section
          title="Connection trust ladder"
          description="Connections move through mutual-consent stages. /connections shows progress as 🔒 → 📸 → 🤝 → 🔐 → 📅. Address and phone only after photos, signed consent, and ID verification (see product spec)."
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              alignItems: "center",
            }}
          >
            {TRUST_LADDER_UI.map(({ stage, emoji, label }, i) => (
              <span
                key={stage}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    borderRadius: T.radius.md,
                    fontSize: T.fontSize.sm,
                    fontWeight: T.fontWeight.semi,
                    background: i <= 2 ? T.color.accentSoft : T.color.bgAlt,
                    border: `1px solid ${i <= 2 ? `${T.color.accent}30` : T.color.borderLight}`,
                    color: i <= 2 ? T.color.accent : T.color.textMuted,
                  }}
                >
                  {emoji} {label}
                </span>
                {i < TRUST_LADDER_UI.length - 1 ? (
                  <span style={{ color: T.color.textMuted, fontSize: T.fontSize.sm }}>→</span>
                ) : null}
              </span>
            ))}
          </div>
          <p
            style={{
              marginTop: "16px",
              marginBottom: 0,
              fontSize: T.fontSize.sm,
              color: T.color.textSoft,
              lineHeight: T.lineHeight.relaxed,
              maxWidth: "640px",
            }}
          >
            <strong style={{ color: T.color.text }}>Core rule:</strong> no address or contact info
            until (1) optional mutual photo exchange, (2) both sign the consent form, and (3) both
            pass ID verification. Booking unlocks only at Stage 5.
          </p>
        </Section>

        <Section
          title="Messaging"
          description="Anonymous conversation UI. Own messages in terracotta, received in cream-alt. System messages centered, pill-shaped, bg-warm — use icons for trust-ladder events (🔒 start, 📸 photos, 🤝 meet, 🔐 verify, 📅 booking)."
        >
          <div
            style={{
              maxWidth: "400px",
              padding: "20px",
              borderRadius: T.radius.xl,
              background: T.color.surface,
              border: `1px solid ${T.color.border}`,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "12px" }}>
              <SystemMsg text="Conversation started · Both anonymous" icon="🔒" />
            </div>
            <MsgBubble
              text="Hey, I'm interested in your straight razor sessions. Can you tell me more about the sensory add-ons?"
              time="2:14 PM"
              isOwn
            />
            <MsgBubble
              text="Absolutely! I offer extended hot towel wraps, scalp massage, and optional blindfold. Everything is discussed beforehand."
              time="2:16 PM"
            />
            <MsgBubble
              text="That sounds perfect. What's your availability like this week?"
              time="2:17 PM"
              isOwn
            />
            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <SystemMsg
                text="🤝 SteadyHands_303 wants to meet — agree on session details next"
                icon="🤝"
              />
            </div>
            <div style={{ textAlign: "center", marginTop: "8px" }}>
              <SystemMsg
                text="SteadyHands_303 would like to meet in person"
                icon="🔓"
              />
            </div>
          </div>
        </Section>

        <Section
          title="Consent form (Stage 3)"
          description="After both parties agree to meet, they define activities, hard limits, and safe words — then both sign digitally before ID verification (Stage 4)."
        >
          <div style={{ maxWidth: "380px", display: "grid", gap: "8px" }}>
            <ConsentStep number="1" title="Agreed activities (tags)" done />
            <ConsentStep number="2" title="Hard limits marked" done />
            <ConsentStep number="3" title="Safe word protocol (e.g. traffic light)" done />
            <ConsentStep number="4" title="Both digital signatures" done={false} />
          </div>
        </Section>

        <Section
          title="Spacing & Radius"
          description="Consistent spatial rhythm using 4px base unit. Generous radius for warmth."
        >
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", marginBottom: "24px" }}>
            {[4, 8, 12, 16, 20, 24, 32, 40, 48].map((s) => (
              <div key={s} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: s,
                    height: s,
                    background: T.color.accent,
                    borderRadius: "2px",
                    margin: "0 auto 6px",
                  }}
                />
                <div
                  style={{
                    fontSize: "10px",
                    color: T.color.textMuted,
                    fontFamily: T.font.mono,
                  }}
                >
                  {s}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            {[
              { r: T.radius.sm, label: "sm (8)" },
              { r: T.radius.md, label: "md (12)" },
              { r: T.radius.lg, label: "lg (16)" },
              { r: T.radius.xl, label: "xl (20)" },
              { r: T.radius["2xl"], label: "2xl (24)" },
              { r: T.radius.full, label: "full (pill)" },
            ].map(({ r, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: r,
                    background: T.color.accentSoft,
                    border: `1.5px solid ${T.color.accent}40`,
                    margin: "0 auto 6px",
                  }}
                />
                <div
                  style={{
                    fontSize: "10px",
                    color: T.color.textMuted,
                    fontFamily: T.font.mono,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Shadows"
          description="Warm-toned shadows using espresso brown base, never pure black. Accent glow for CTAs."
        >
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              { s: T.shadow.sm, label: "sm" },
              { s: T.shadow.md, label: "md" },
              { s: T.shadow.lg, label: "lg" },
              { s: T.shadow.xl, label: "xl" },
              { s: T.shadow.glow, label: "glow (accent)" },
              { s: T.shadow.card, label: "card" },
              { s: T.shadow.modal, label: "modal" },
            ].map(({ s, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: T.radius.lg,
                    background: T.color.surface,
                    boxShadow: s,
                    margin: "0 auto 8px",
                    border: `1px solid ${T.color.borderLight}`,
                  }}
                />
                <div
                  style={{
                    fontSize: "10px",
                    color: T.color.textMuted,
                    fontFamily: T.font.mono,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Motion & Transitions"
          description="Subtle, warm. Cards lift on hover (translateY -3px). CTAs glow. Page elements stagger-fade on load."
        >
          <div
            style={{
              padding: "20px 24px",
              borderRadius: T.radius.lg,
              background: T.color.bgAlt,
              border: `1px solid ${T.color.borderLight}`,
              fontSize: T.fontSize.base,
              color: T.color.textSoft,
              lineHeight: T.lineHeight.loose,
              maxWidth: "600px",
            }}
          >
            <b style={{ color: T.color.text }}>Transitions:</b> fast (150ms), base (250ms), slow
            (400ms), spring (300ms cubic-bezier bounce)
            <br />
            <b style={{ color: T.color.text }}>Card hover:</b> translateY(-3px) + accent-tinted
            shadow + border color shift
            <br />
            <b style={{ color: T.color.text }}>Button hover:</b> background darken + glow shadow +
            translateY(-1px)
            <br />
            <b style={{ color: T.color.text }}>Page load:</b> staggered fadeIn (opacity 0→1,
            translateY 8→0) with 50ms delays
            <br />
            <b style={{ color: T.color.text }}>Modal:</b> fade backdrop + scale(0.95→1) content
            <br />
            <b style={{ color: T.color.text }}>Verification:</b> spin loader → pop animation (scale
            0.8→1.05→1) on success
            <br />
            <b style={{ color: T.color.text }}>Messages:</b> slide in from left/right depending on
            sender
          </div>
        </Section>

        <Section title="Key Design Rules" description="Non-negotiable visual principles for every page.">
          <div style={{ display: "grid", gap: "10px", maxWidth: "620px" }}>
            {[
              "Never use pure black (#000). Darkest text is espresso #2D2016.",
              "Never show real names, verified selfies, addresses, or phones until the connection stage allows it (photos → signed consent → ID verify → booking).",
              "Gradient avatars + alias in anonymous stages; Stage 2+ may show voluntary exchanged photos per mutual consent.",
              "Border radius minimum 8px. Nothing sharp. Warmth is the goal.",
              "Shadows use warm brown (rgba(45,32,22,x)), never cool gray or pure black.",
              "Accent terracotta (#E8734A) is for CTAs, brand, and active states ONLY. Don't overuse.",
              "Background is always cream (#FFFBF7), never pure white for the page itself. Cards can be #FFFFFF.",
              "All interactive elements need visible hover + focus states. Focus ring: 3px accent glow.",
              "Anonymous content uses alias + gradient avatar. Revealed content adds real name + selfie.",
              "System messages (reveal requests, booking updates) are always centered, pill-shaped, cream-warm bg.",
              "Tags use rounded-full pills. Interest tags in accent-soft, boundary tags in red-soft, vibe tags in purple-soft.",
              "Spacing follows 4px grid. Most common gaps: 8, 12, 16, 24, 32.",
              "Mobile-first. Cards stack single-column below 768px. Touch targets minimum 44px.",
            ].map((rule, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: T.radius.md,
                  background: T.color.bgAlt,
                }}
              >
                <span
                  style={{
                    fontWeight: T.fontWeight.heavy,
                    color: T.color.accent,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}.
                </span>
                <span
                  style={{
                    fontSize: T.fontSize.base,
                    color: T.color.textSoft,
                    lineHeight: T.lineHeight.relaxed,
                  }}
                >
                  {rule}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
