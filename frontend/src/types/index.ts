export interface User {
  id: number;
  username: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
}

export interface Organization {
  id: number;
  name: string;
  description?: string;
  username?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude?: string | null;
  longitude?: string | null;
  start_datetime: string;
  end_datetime?: string;
  modality: 'in-person' | 'online' | 'hybrid';
  category?: Category | null;
  subcategory?: string | null;
  host_organization?: Organization | null;
  host_user?: string | null;
  has_free_food: boolean;
  has_free_swag: boolean;
  other_perks?: string | null;
  employers_in_attendance?: string | null;
  rsvp_count?: number;
  user_has_rsvp?: boolean;
  status?: 'draft' | 'published' | 'cancelled';
  is_approved?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type UserType = 'student' | 'organization_leader' | 'site_admin';
