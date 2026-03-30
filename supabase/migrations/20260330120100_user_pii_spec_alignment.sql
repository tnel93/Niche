-- SPEC alignment: PII isolated in user_pii (BYTEA for app-layer AES-GCM ciphertext).
-- Removes duplicate columns from users. Safe if users table still has old columns.

CREATE TABLE user_pii (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  real_first_name       BYTEA,
  real_last_name        BYTEA,
  date_of_birth         BYTEA,
  verified_selfie_url   BYTEA,
  phone                 BYTEA,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_pii_user_id ON user_pii (user_id);

CREATE TRIGGER user_pii_updated_at
  BEFORE UPDATE ON user_pii FOR EACH ROW EXECUTE PROCEDURE niche_set_updated_at();

-- Drop legacy PII columns from users if present (initial migration had them).
ALTER TABLE users DROP COLUMN IF EXISTS phone;
ALTER TABLE users DROP COLUMN IF EXISTS real_first_name;
ALTER TABLE users DROP COLUMN IF EXISTS real_last_name;
ALTER TABLE users DROP COLUMN IF EXISTS date_of_birth;
ALTER TABLE users DROP COLUMN IF EXISTS verified_selfie_url;

-- Allow admin role (SPEC project structure / middleware).
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('seeker', 'provider', 'both', 'admin'));
