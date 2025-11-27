export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_staff: boolean;
}

export interface Organization {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  created_by: string;
  is_verified: boolean;
  updated_at: string;
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
  room?: string;
  start_datetime: string;
  end_datetime?: string;
  modality: 'in-person' | 'online' | 'hybrid';
  category?: Category;
  subcategory?: string;
  host_organization?: Organization;
  host_user?: string;
  has_free_food: boolean;
  has_free_swag: boolean;
  other_perks?: string;
  employers_in_attendance?: string;
  rsvp_count?: number;
  user_has_rsvp?: boolean;
  status: "draft" | "published" | "cancelled";
  is_approved: boolean;
}
