import { Garage, WorkingHours, GalleryImage } from './types';

// Generate a random ad ID
const generateAdId = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Generate random dates for created_at
const generateCreatedAt = () => {
  const now = new Date();
  const randomDays = Math.floor(Math.random() * 180) + 1; // 1-180 days ago
  const date = new Date(now);
  date.setDate(now.getDate() - randomDays);
  return date.toISOString();
};

// Mock data for admin dashboard
export const adminGarages: Garage[] = [
  {
    id: '1',
    ad_id: generateAdId(),
    name: 'AutoFix Garage',
    description: 'Full-service auto repair shop specializing in domestic and foreign vehicles.',
    address: '123 Main St, Anytown, USA',
    phone: '(555) 123-4567',
    email: 'info@autofixgarage.com',
    city: 'Istanbul',
    district: 'Kadıköy',
    rating: 4.8,
    reviewCount: 24,
    website: 'www.autofixgarage.com',
    services: ['Tuning', 'Maintenance', 'Custom Modification'],
    image_url: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    create_time: generateCreatedAt(),
    update_time: null
  },
  {
    id: '2',
    ad_id: generateAdId(),
    name: 'City Motors',
    description: 'Your trusted neighborhood garage with certified technicians.',
    address: '456 Oak Ave, Metropolis, USA',
    phone: '(555) 987-6543',
    email: 'service@citymotors.com',
    city: 'Istanbul',
    district: 'Beşiktaş',
    rating: 4.2,
    reviewCount: 18,
    website: 'www.citymotors.com',
    services: ['Tuning', 'Body Work', 'Electrical Repairs'],
    image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    create_time: generateCreatedAt(),
    update_time: null
  },
  {
    id: '3',
    ad_id: generateAdId(),
    name: 'Premium Auto Care',
    description: 'Luxury and exotic vehicle specialists with state-of-the-art facility.',
    address: '789 Luxury Lane, Uptown, USA',
    phone: '(555) 456-7890',
    email: 'appointments@premiumauto.com',
    city: 'Ankara',
    district: 'Çankaya',
    rating: 4.9,
    reviewCount: 36,
    website: 'www.premiumautocare.com',
    services: ['Custom Modification', 'Performance Tuning', 'Luxury Detailing'],
    image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    create_time: generateCreatedAt(),
    update_time: null
  }
];

// Mock admin reviews
export const adminReviews = [
  {
    id: '1',
    garage_id: '1',
    user_id: '101',
    rating: 5,
    comment: 'Great service, very professional and reasonably priced!',
    created_at: '2023-04-15T14:30:00Z',
    profiles: {
      id: '101',
      username: 'johndoe',
      avatar_url: null
    }
  },
  {
    id: '2',
    garage_id: '1',
    user_id: '102',
    rating: 4,
    comment: 'Good work, but took longer than expected.',
    created_at: '2023-03-22T09:15:00Z',
    profiles: {
      id: '102',
      username: 'sarahm',
      avatar_url: null
    }
  }
]; 