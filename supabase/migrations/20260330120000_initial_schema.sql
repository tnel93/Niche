-- Niche — initial schema (Postgres + PostGIS)
-- Run in Supabase SQL editor or via supabase db push.
-- Resolves FK cycles: connections ↔ consent_forms, bookings ↔ consent_forms.

CREATE EXTENSION IF NOT EXISTS postgis;

-- ─── users ───────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                 TEXT UNIQUE NOT NULL,
  phone                 TEXT UNIQUE,
  alias                 TEXT UNIQUE NOT NULL,
  real_first_name       TEXT,
  real_last_name        TEXT,
  date_of_birth         DATE,
  verified_selfie_url   TEXT,
  role                  TEXT NOT NULL DEFAULT 'seeker'
    CHECK (role IN ('seeker', 'provider', 'both')),
  bio                   TEXT,
  avatar_style          JSONB,
  metro_area            TEXT,
  geo                   GEOGRAPHY(POINT, 4326),
  timezone              TEXT,
  id_verified           BOOLEAN NOT NULL DEFAULT FALSE,
  id_verified_at        TIMESTAMPTZ,
  persona_inquiry_id    TEXT,
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  is_banned             BOOLEAN NOT NULL DEFAULT FALSE,
  last_active_at        TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_alias ON users (alias);
CREATE INDEX idx_users_metro ON users (metro_area) WHERE metro_area IS NOT NULL;
CREATE INDEX idx_users_geo ON users USING GIST (geo) WHERE geo IS NOT NULL;

-- ─── categories & tags ───────────────────────────────────────────────────────
CREATE TABLE categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT UNIQUE NOT NULL,
  emoji           TEXT,
  description     TEXT,
  sort_order      INTEGER,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE tags (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT UNIQUE NOT NULL,
  type            TEXT NOT NULL
    CHECK (type IN ('interest', 'sensation', 'dynamic', 'equipment', 'boundary')),
  sort_order      INTEGER
);

CREATE INDEX idx_tags_type ON tags (type);

-- ─── provider_profiles ───────────────────────────────────────────────────────
CREATE TABLE provider_profiles (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  industry              TEXT NOT NULL,
  category_id           UUID REFERENCES categories(id),
  tagline               TEXT,
  service_description   TEXT NOT NULL,
  vibe                  TEXT,
  years_experience      INTEGER,
  rate_min_cents        INTEGER NOT NULL,
  rate_max_cents        INTEGER,
  session_duration_min  INTEGER NOT NULL DEFAULT 60,
  currency              TEXT NOT NULL DEFAULT 'USD',
  location_type         TEXT CHECK (location_type IN ('studio', 'home', 'mobile', 'flexible')),
  service_radius_miles  INTEGER,
  license_number        TEXT,
  license_verified      BOOLEAN NOT NULL DEFAULT FALSE,
  bg_check_status       TEXT NOT NULL DEFAULT 'none'
    CHECK (bg_check_status IN ('none', 'pending', 'passed', 'failed')),
  bg_check_id           TEXT,
  consent_certified     BOOLEAN NOT NULL DEFAULT FALSE,
  consent_certified_at  TIMESTAMPTZ,
  stripe_connect_id     TEXT,
  stripe_onboarded      BOOLEAN NOT NULL DEFAULT FALSE,
  is_accepting          BOOLEAN NOT NULL DEFAULT TRUE,
  is_visible            BOOLEAN NOT NULL DEFAULT TRUE,
  total_sessions        INTEGER NOT NULL DEFAULT 0,
  avg_rating            NUMERIC(3, 2) NOT NULL DEFAULT 0,
  total_reviews         INTEGER NOT NULL DEFAULT 0,
  response_time_avg_min INTEGER,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

CREATE INDEX idx_provider_profiles_category ON provider_profiles (category_id);
CREATE INDEX idx_provider_profiles_visible ON provider_profiles (is_visible, is_accepting)
  WHERE is_visible AND is_accepting;

CREATE TABLE provider_tags (
  provider_id     UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  tag_id          UUID NOT NULL REFERENCES tags(id),
  comfort_level   TEXT NOT NULL DEFAULT 'willing'
    CHECK (comfort_level IN ('enthusiastic', 'willing', 'negotiable')),
  PRIMARY KEY (provider_id, tag_id)
);

CREATE TABLE seeker_interests (
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tag_id          UUID NOT NULL REFERENCES tags(id),
  intensity       TEXT NOT NULL DEFAULT 'interested'
    CHECK (intensity IN ('curious', 'interested', 'must_have')),
  PRIMARY KEY (user_id, tag_id)
);

-- Saved session locations (Stage 5 — address via platform, not free-text chat)
CREATE TABLE provider_locations (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_profile_id   UUID NOT NULL REFERENCES provider_profiles(id) ON DELETE CASCADE,
  label                 TEXT,
  address_encrypted     TEXT,
  geo                   GEOGRAPHY(POINT, 4326),
  location_type         TEXT CHECK (location_type IN ('studio', 'home', 'mobile', 'client')),
  is_active             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_provider_locations_profile ON provider_locations (provider_profile_id);

-- ─── markets ─────────────────────────────────────────────────────────────────
CREATE TABLE markets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT UNIQUE NOT NULL,
  state           TEXT,
  center          GEOGRAPHY(POINT, 4326),
  radius_miles    INTEGER,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  launched_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── connections (progressive trust ladder; consent_form_id added after consent_forms) ───
CREATE TABLE connections (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seeker_id             UUID NOT NULL REFERENCES users(id),
  provider_id           UUID NOT NULL REFERENCES users(id),
  stage                 TEXT NOT NULL DEFAULT 'anonymous'
    CHECK (stage IN (
      'anonymous',
      'photos_requested',
      'photos_shared',
      'meet_requested',
      'consent_pending',
      'consent_signed',
      'verification_pending',
      'verified',
      'booking_ready',
      'booking_active',
      'completed',
      'blocked',
      'expired'
    )),
  photos_requested_by   UUID REFERENCES users(id),
  photos_requested_at   TIMESTAMPTZ,
  photos_consented_by   UUID REFERENCES users(id),
  photos_consented_at   TIMESTAMPTZ,
  seeker_photo_urls     TEXT[],
  provider_photo_urls   TEXT[],
  meet_requested_by     UUID REFERENCES users(id),
  meet_requested_at     TIMESTAMPTZ,
  meet_consented_by     UUID REFERENCES users(id),
  meet_consented_at     TIMESTAMPTZ,
  seeker_verified_for_connection   BOOLEAN NOT NULL DEFAULT FALSE,
  provider_verified_for_connection BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at           TIMESTAMPTZ,
  address_shared_at     TIMESTAMPTZ,
  provider_shared_location_id UUID REFERENCES provider_locations(id),
  seeker_shared_phone   BOOLEAN NOT NULL DEFAULT FALSE,
  provider_shared_phone BOOLEAN NOT NULL DEFAULT FALSE,
  seeker_shared_fields  JSONB,
  provider_shared_fields JSONB,
  blocked_by            UUID REFERENCES users(id),
  blocked_at            TIMESTAMPTZ,
  block_reason          TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (seeker_id <> provider_id)
);

CREATE INDEX idx_connections_seeker ON connections (seeker_id);
CREATE INDEX idx_connections_provider ON connections (provider_id);
CREATE INDEX idx_connections_stage ON connections (stage);

-- ─── bookings (consent_form_id FK added after consent_forms) ───────────────
CREATE TABLE bookings (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id           UUID NOT NULL REFERENCES connections(id),
  seeker_id               UUID NOT NULL REFERENCES users(id),
  provider_id             UUID NOT NULL REFERENCES provider_profiles(id),
  session_date            DATE NOT NULL,
  session_time            TIME NOT NULL,
  duration_min            INTEGER NOT NULL,
  rate_cents              INTEGER NOT NULL,
  platform_fee_cents      INTEGER NOT NULL,
  provider_payout_cents   INTEGER NOT NULL,
  deposit_cents           INTEGER,
  tip_cents               INTEGER NOT NULL DEFAULT 0,
  status                  TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN (
      'requested', 'confirmed', 'in_progress', 'completed',
      'cancelled', 'disputed', 'no_show'
    )),
  consent_form_id         UUID,
  stripe_payment_intent   TEXT,
  payment_status          TEXT
    CHECK (payment_status IS NULL OR payment_status IN (
      'pending', 'authorized', 'captured', 'refunded', 'failed'
    )),
  started_at              TIMESTAMPTZ,
  completed_at            TIMESTAMPTZ,
  cancelled_by            UUID REFERENCES users(id),
  cancellation_reason     TEXT,
  cancelled_at            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_connection ON bookings (connection_id);
CREATE INDEX idx_bookings_seeker ON bookings (seeker_id);
CREATE INDEX idx_bookings_provider_profile ON bookings (provider_id);

-- ─── consent_forms ───────────────────────────────────────────────────────────
CREATE TABLE consent_forms (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id            UUID REFERENCES bookings(id) ON DELETE SET NULL,
  connection_id         UUID REFERENCES connections(id) ON DELETE CASCADE,
  agreed_tags           UUID[],
  hard_limits           UUID[],
  soft_limits           UUID[],
  safe_word_protocol    TEXT NOT NULL DEFAULT 'traffic_light',
  custom_safe_word      TEXT,
  additional_notes      TEXT,
  seeker_signed         BOOLEAN NOT NULL DEFAULT FALSE,
  seeker_signed_at      TIMESTAMPTZ,
  provider_signed       BOOLEAN NOT NULL DEFAULT FALSE,
  provider_signed_at    TIMESTAMPTZ,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_consent_forms_connection ON consent_forms (connection_id);
CREATE INDEX idx_consent_forms_booking ON consent_forms (booking_id);

ALTER TABLE bookings
  ADD CONSTRAINT bookings_consent_form_id_fkey
  FOREIGN KEY (consent_form_id) REFERENCES consent_forms(id) ON DELETE SET NULL;

ALTER TABLE connections
  ADD COLUMN consent_form_id UUID REFERENCES consent_forms(id) ON DELETE SET NULL;

CREATE INDEX idx_connections_consent_form ON connections (consent_form_id);

-- ─── messages ────────────────────────────────────────────────────────────────
CREATE TABLE messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id     UUID NOT NULL REFERENCES connections(id) ON DELETE CASCADE,
  sender_id         UUID NOT NULL REFERENCES users(id),
  body              TEXT NOT NULL,
  message_type      TEXT NOT NULL DEFAULT 'text'
    CHECK (message_type IN ('text', 'image', 'system', 'reveal_request', 'consent_form')),
  is_read           BOOLEAN NOT NULL DEFAULT FALSE,
  read_at           TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_connection_created ON messages (connection_id, created_at DESC);

-- ─── reviews ─────────────────────────────────────────────────────────────────
CREATE TABLE reviews (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id        UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  reviewer_id       UUID NOT NULL REFERENCES users(id),
  provider_id       UUID NOT NULL REFERENCES provider_profiles(id),
  rating            INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body              TEXT,
  is_anonymous      BOOLEAN NOT NULL DEFAULT TRUE,
  provider_response TEXT,
  is_visible        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_provider ON reviews (provider_id);

-- ─── reports ───────────────────────────────────────────────────────────────
CREATE TABLE reports (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id       UUID NOT NULL REFERENCES users(id),
  reported_user_id  UUID NOT NULL REFERENCES users(id),
  connection_id     UUID REFERENCES connections(id),
  booking_id        UUID REFERENCES bookings(id),
  reason            TEXT NOT NULL
    CHECK (reason IN (
      'boundary_violation', 'harassment', 'fake_profile',
      'no_show', 'unsafe_behavior', 'identity_mismatch', 'other'
    )),
  description       TEXT,
  evidence_urls     TEXT[],
  status            TEXT NOT NULL DEFAULT 'submitted',
  admin_notes       TEXT,
  resolution        TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at       TIMESTAMPTZ
);

CREATE INDEX idx_reports_status ON reports (status);

-- ─── updated_at trigger ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION niche_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE niche_set_updated_at();

CREATE TRIGGER provider_profiles_updated_at
  BEFORE UPDATE ON provider_profiles FOR EACH ROW EXECUTE PROCEDURE niche_set_updated_at();

CREATE TRIGGER provider_locations_updated_at
  BEFORE UPDATE ON provider_locations FOR EACH ROW EXECUTE PROCEDURE niche_set_updated_at();

CREATE TRIGGER connections_updated_at
  BEFORE UPDATE ON connections FOR EACH ROW EXECUTE PROCEDURE niche_set_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE PROCEDURE niche_set_updated_at();

-- ─── seed: categories ────────────────────────────────────────────────────────
INSERT INTO categories (name, emoji, sort_order, is_active) VALUES
  ('Barber / Hair Stylist', '✂️', 10, TRUE),
  ('Massage Therapist', '🤲', 20, TRUE),
  ('Esthetician / Facial', '✨', 30, TRUE),
  ('Nail Technician', '💅', 40, TRUE),
  ('Wax / Grooming Specialist', '🪒', 50, TRUE),
  ('Touch / Cuddle Therapist', '🫂', 60, TRUE),
  ('Dentist / Dental Hygienist', '🦷', 70, TRUE),
  ('Chiropractor', '🦴', 80, TRUE),
  ('Personal Trainer / Coach', '💪', 90, TRUE),
  ('Yoga / Pilates Instructor', '🧘', 100, TRUE),
  ('Tailor / Fitter', '📏', 110, TRUE),
  ('Podiatrist / Foot Care', '🦶', 120, TRUE),
  ('Photographer', '📸', 130, TRUE),
  ('Makeup Artist', '💄', 140, TRUE),
  ('Tattoo Artist', '🎨', 150, TRUE),
  ('Piercing Artist', '📌', 160, TRUE),
  ('Dermatologist / Skin', '🧴', 170, TRUE),
  ('Physical Therapist', '🏥', 180, TRUE),
  ('Acupuncturist', '📍', 190, TRUE),
  ('Reiki / Energy Worker', '✋', 200, TRUE),
  ('House Cleaner', '🧹', 210, TRUE),
  ('Shoe Fitter / Cobbler', '👟', 220, TRUE),
  ('Optometrist / Eye Care', '👁', 230, TRUE),
  ('Audiologist', '👂', 240, TRUE),
  ('Nurse / Phlebotomist', '💉', 250, TRUE),
  ('Other', '➕', 999, TRUE);

-- ─── seed: tags (sort_order batch by type) ─────────────────────────────────
INSERT INTO tags (name, type, sort_order) VALUES
  ('Hair Cutting', 'interest', 10),
  ('Head Shave', 'interest', 11),
  ('Beard Grooming', 'interest', 12),
  ('Hair Washing', 'interest', 13),
  ('Scalp Treatment', 'interest', 14),
  ('Dental Exam', 'interest', 20),
  ('Teeth Cleaning', 'interest', 21),
  ('Oral Inspection', 'interest', 22),
  ('Foot Exam', 'interest', 30),
  ('Foot Massage', 'interest', 31),
  ('Body Measurement', 'interest', 40),
  ('Fitting', 'interest', 41),
  ('Hand Care', 'interest', 50),
  ('Eye Exam', 'interest', 60),
  ('Ear Cleaning', 'interest', 61),
  ('Blood Draw', 'interest', 70),
  ('Injection', 'interest', 71),
  ('Body Piercing', 'interest', 80),
  ('Tattoo Session', 'interest', 81),
  ('Spine Adjustment', 'interest', 90),
  ('Full Body Massage', 'interest', 100),
  ('Targeted Massage', 'interest', 101),
  ('Stretching', 'interest', 102),
  ('Acupuncture', 'interest', 103),
  ('Skin Examination', 'interest', 110),
  ('Facial Treatment', 'interest', 111),
  ('Waxing', 'interest', 112),
  ('Shaving', 'interest', 113),
  ('Nail Care', 'interest', 114),
  ('Photography Session', 'interest', 120),
  ('Makeup Application', 'interest', 121),
  ('Costume/Wardrobe Fitting', 'interest', 122),
  ('Deep Pressure', 'sensation', 200),
  ('Light Touch', 'sensation', 201),
  ('Temperature Play', 'sensation', 202),
  ('Vibration', 'sensation', 203),
  ('Scratching', 'sensation', 204),
  ('Sharp Sensation', 'sensation', 205),
  ('Smooth Sensation', 'sensation', 206),
  ('Wet Sensation', 'sensation', 207),
  ('Oil/Lotion', 'sensation', 208),
  ('Breath Work', 'sensation', 209),
  ('ASMR', 'sensation', 210),
  ('White Noise', 'sensation', 211),
  ('Silence', 'sensation', 212),
  ('Verbal Narration', 'sensation', 213),
  ('Power Exchange', 'dynamic', 300),
  ('Verbal Guidance', 'dynamic', 301),
  ('Instruction Following', 'dynamic', 302),
  ('Role Play', 'dynamic', 303),
  ('Worship', 'dynamic', 304),
  ('Service', 'dynamic', 305),
  ('Examination', 'dynamic', 306),
  ('Clinical', 'dynamic', 307),
  ('Nurturing', 'dynamic', 308),
  ('Authoritative', 'dynamic', 309),
  ('Patient/Practitioner', 'dynamic', 310),
  ('Teacher/Student', 'dynamic', 311),
  ('Latex Gloves', 'equipment', 400),
  ('Blindfold', 'equipment', 401),
  ('Restraints Light', 'equipment', 402),
  ('Medical Instruments', 'equipment', 403),
  ('Straight Razor', 'equipment', 404),
  ('Hot Towel', 'equipment', 405),
  ('Cold Instruments', 'equipment', 406),
  ('Needles', 'equipment', 407),
  ('Clamps', 'equipment', 408),
  ('Stethoscope', 'equipment', 409),
  ('Measuring Tape', 'equipment', 410),
  ('Dental Mirror', 'equipment', 411),
  ('No Face Touching', 'boundary', 500),
  ('No Disrobing', 'boundary', 501),
  ('Clinical Only', 'boundary', 502),
  ('Hands Only', 'boundary', 503),
  ('No Photography', 'boundary', 504),
  ('No Verbal', 'boundary', 505),
  ('Minimal Conversation', 'boundary', 506),
  ('Clothed Only', 'boundary', 507),
  ('No Scents/Oils', 'boundary', 508),
  ('Quiet Environment', 'boundary', 509),
  ('Music Preferred', 'boundary', 510);
