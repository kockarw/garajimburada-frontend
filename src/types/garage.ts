export interface GarageFormData {
  // Step 1: General Information
  name: string;
  about: string;
  website: string;
  phone: string;
  email: string;
  
  // Step 2: Location
  city: string;
  district: string;
  address: string;
  
  // Step 3: Services
  services: string[];
  
  // Step 4: Images
  logo: File | null;
  coverImage: File | null;
  
  // Step 5: Working Hours
  workingHours: {
    Monday: { isOpen: boolean; openTime: string; closeTime: string };
    Tuesday: { isOpen: boolean; openTime: string; closeTime: string };
    Wednesday: { isOpen: boolean; openTime: string; closeTime: string };
    Thursday: { isOpen: boolean; openTime: string; closeTime: string };
    Friday: { isOpen: boolean; openTime: string; closeTime: string };
    Saturday: { isOpen: boolean; openTime: string; closeTime: string };
    Sunday: { isOpen: boolean; openTime: string; closeTime: string };
  };
} 