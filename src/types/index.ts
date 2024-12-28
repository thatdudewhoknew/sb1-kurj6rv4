export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'trucker' | 'company_admin';
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface Site {
  id: string;
  name: string;
  company_name: string;
  address: string;
  general_rules: string | null;
  operating_hours: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AccessPoint {
  id: string;
  site_id: string;
  name: string;
  description: string;
  access_instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  site_id: string;
  department: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteUpdate {
  id: string;
  site_id: string;
  update_type: string;
  description: string;
  created_by: string;
  created_at: string;
}