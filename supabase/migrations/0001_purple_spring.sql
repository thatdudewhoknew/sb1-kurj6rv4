/*
  # Initial Schema for Trucking Site Information Platform

  1. New Tables
    - `sites`
      - Basic site information including name, address, and general rules
    - `access_points`
      - Information about site entry/exit points and procedures
    - `contacts`
      - Department contact information for each site
    - `site_updates`
      - Log of site information updates with timestamp and author
    
  2. Security
    - Enable RLS on all tables
    - Policies for authenticated users to read all data
    - Policies for company admins to manage their site data
    - Policies for truckers to add site updates
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('trucker', 'company_admin');

-- Create custom users table that extends auth.users
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  full_name text,
  role user_role DEFAULT 'trucker',
  company_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sites table
CREATE TABLE IF NOT EXISTS sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company_name text NOT NULL,
  address text NOT NULL,
  general_rules text,
  operating_hours text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Access points table
CREATE TABLE IF NOT EXISTS access_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  access_instructions text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  department text NOT NULL,
  contact_name text,
  phone text,
  email text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Site updates table for tracking changes and additional information
CREATE TABLE IF NOT EXISTS site_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  update_type text NOT NULL,
  description text NOT NULL,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_updates ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Sites policies
CREATE POLICY "Sites are viewable by authenticated users"
  ON sites FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Company admins can insert their company sites"
  ON sites FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company_admin'
      AND profiles.company_name = NEW.company_name
    )
  );

CREATE POLICY "Company admins can update their company sites"
  ON sites FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'company_admin'
      AND profiles.company_name = sites.company_name
    )
  );

-- Access points policies
CREATE POLICY "Access points are viewable by authenticated users"
  ON access_points FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Company admins can manage access points"
  ON access_points FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sites
      JOIN profiles ON profiles.id = auth.uid()
      WHERE sites.id = access_points.site_id
      AND profiles.role = 'company_admin'
      AND profiles.company_name = sites.company_name
    )
  );

-- Contacts policies
CREATE POLICY "Contacts are viewable by authenticated users"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Company admins can manage contacts"
  ON contacts FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM sites
      JOIN profiles ON profiles.id = auth.uid()
      WHERE sites.id = contacts.site_id
      AND profiles.role = 'company_admin'
      AND profiles.company_name = sites.company_name
    )
  );

-- Site updates policies
CREATE POLICY "Updates are viewable by authenticated users"
  ON site_updates FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can create updates"
  ON site_updates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);