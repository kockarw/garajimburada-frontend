export interface Garage {
  id: string;
  ad_id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  rating: number;
  reviewCount: number;
  website?: string | null;
  services: string[];
  image_url?: string;
  create_time: string;
  update_time: string | null;
}

export interface GarageWithCoords extends Garage {
  coordinates?: {
    lat: number;
    lng: number;
  };
  working_hours: WorkingHours;
  gallery: GalleryImage[];
}

export interface WorkingHours {
  id: string;
  garage_id: string;
  monday_open: string | null;
  monday_close: string | null;
  tuesday_open: string | null;
  tuesday_close: string | null;
  wednesday_open: string | null;
  wednesday_close: string | null;
  thursday_open: string | null;
  thursday_close: string | null;
  friday_open: string | null;
  friday_close: string | null;
  saturday_open: string | null;
  saturday_close: string | null;
  sunday_open: string | null;
  sunday_close: string | null;
}

export interface GalleryImage {
  id: string;
  garage_id: string;
  image_url: string;
  alt_text: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar_url: string | null;
  is_admin?: boolean;
  role?: 'admin' | 'user' | 'garage_owner';
}

export interface Review {
  id: string;
  garage_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

export interface FilterOptions {
  service?: string;
  rating?: number;
  city?: string;
  district?: string;
  sort?: 'rating' | 'reviews' | 'name';
} 