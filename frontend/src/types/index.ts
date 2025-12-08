export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

export interface Organization {
  id: number;
  name: string;
  slug: string;
  logo: string;
  description: string;
  email: string;
  website: string;
  discord: string;
  instagram: string;
  linkedin: string;
  slack: string;
  events: Event[];
  members_count: number;
  members: OrganizationMember[];
  created_at: string;
  created_by: number;
  is_verified: boolean;
  updated_at: string;
}

export interface MinimalOrganization {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string;
  is_verified: boolean;
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
  room?: string;
  start_datetime: string;
  end_datetime?: string;
  modality: 'in-person' | 'online' | 'hybrid';
  category?: Category | null;
  subcategory?: string | null;
  host_organization?: MinimalOrganization | null;
  host_user?: string | null;
  has_free_food: boolean;
  has_free_swag: boolean;
  other_perks?: string | null;
  employers_in_attendance?: string | null;
  rsvp_users: User[];
  user_has_rsvp?: boolean;
  status: "draft" | "published" | "cancelled";
  is_approved?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RSVP {
  id: number;
  attended: boolean;
  event: Event;
  rsvp_at: string;
  user: string;
}

export interface OrganizationMember {
  id: number;
  is_board_member: boolean;
  is_leader: boolean;
  joined_at: string;
  organization: MinimalOrganization;
  role: string;
  user: string;
  user_username: string;
  user_full_name: string;
  user_profile_picture: string;
}

export interface UserProfile {
    id: number;
    user: User;
    description: string;
    profile_picture: string | null;
    pronouns: string;
    rsvps: RSVP[];
    organizations_board_member: OrganizationMember[];
    created_at: string;
    updated_at: string;
}