-- Row Level Security (SPEC). Requires Supabase Auth: public.users.id = auth.users.id.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pii ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- users
CREATE POLICY "users_select_public" ON users
  FOR SELECT USING (is_active = true AND is_banned = false);

CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "users_insert_own" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- user_pii
CREATE POLICY "pii_select_own" ON user_pii
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "pii_update_own" ON user_pii
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "pii_insert_own" ON user_pii
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "pii_delete_own" ON user_pii
  FOR DELETE USING (auth.uid() = user_id);

-- provider_profiles
CREATE POLICY "providers_select_public" ON provider_profiles
  FOR SELECT USING (is_visible = true AND is_accepting = true);

CREATE POLICY "providers_insert_own" ON provider_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "providers_update_own" ON provider_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- connections
CREATE POLICY "connections_select_own" ON connections
  FOR SELECT USING (auth.uid() = seeker_id OR auth.uid() = provider_id);

CREATE POLICY "connections_insert_seeker" ON connections
  FOR INSERT WITH CHECK (auth.uid() = seeker_id);

CREATE POLICY "connections_update_own" ON connections
  FOR UPDATE USING (auth.uid() = seeker_id OR auth.uid() = provider_id);

-- messages
CREATE POLICY "messages_select_own" ON messages
  FOR SELECT USING (
    connection_id IN (
      SELECT id FROM connections WHERE seeker_id = auth.uid() OR provider_id = auth.uid()
    )
  );

CREATE POLICY "messages_insert_own" ON messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid()
    AND connection_id IN (
      SELECT id FROM connections WHERE seeker_id = auth.uid() OR provider_id = auth.uid()
    )
  );

-- bookings
CREATE POLICY "bookings_select_own" ON bookings
  FOR SELECT USING (
    seeker_id = auth.uid()
    OR provider_id IN (SELECT id FROM provider_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "bookings_insert_seeker" ON bookings
  FOR INSERT WITH CHECK (seeker_id = auth.uid());

CREATE POLICY "bookings_update_parties" ON bookings
  FOR UPDATE USING (
    seeker_id = auth.uid()
    OR provider_id IN (SELECT id FROM provider_profiles WHERE user_id = auth.uid())
  );

-- reviews
CREATE POLICY "reviews_select_public" ON reviews
  FOR SELECT USING (is_visible = true);

CREATE POLICY "reviews_insert_own" ON reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());

CREATE POLICY "reviews_update_own" ON reviews
  FOR UPDATE USING (reviewer_id = auth.uid());
