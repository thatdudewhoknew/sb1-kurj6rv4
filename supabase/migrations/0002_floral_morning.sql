/*
  # Add admin role and notices system
  
  1. Changes
    - Add 'admin' to user_role enum
    - Create notices table for system-wide announcements
  
  2. Security
    - Enable RLS on notices table
    - Only admins can create/update/delete notices
    - All authenticated users can view notices
*/

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'admin';

CREATE TABLE IF NOT EXISTS notices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  priority text NOT NULL DEFAULT 'normal',
  active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notices ENABLE ROW LEVEL SECURITY;

-- Notices policies
CREATE POLICY "Notices are viewable by authenticated users"
  ON notices FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Only admins can manage notices"
  ON notices FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );