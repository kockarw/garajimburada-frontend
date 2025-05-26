import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Info, 
  MapPin, 
  Wrench, 
  Image, 
  Clock 
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { useScrollToTop } from '../hooks/useScrollToTop';
import garageService from '../services/garage.service';
import uploadService from '../services/upload.service';

// Import step components
import GeneralInfoStep from '../components/garage-creation/GeneralInfoStep';
import LocationStep from '../components/garage-creation/LocationStep';
import ServiceSelectionStep from '../components/garage-creation/ServiceSelectionStep';
import ImageUploadStep from '../components/garage-creation/ImageUploadStep';
import WorkingHoursStep from '../components/garage-creation/WorkingHoursStep';

// Types
interface GarageFormData {
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

const initialFormData: GarageFormData = {
  name: '',
  about: '',
  website: '',
  phone: '',
  email: '',
  city: '',
  district: '',
  address: '',
  services: [],
  logo: null,
  coverImage: null,
  workingHours: {
    Monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    Tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    Wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    Thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    Friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
    Saturday: { isOpen: true, openTime: '09:00', closeTime: '14:00' },
    Sunday: { isOpen: false, openTime: '09:00', closeTime: '18:00' }
  }
};

// Transform the form data to match the API expectations
const prepareDataForSubmission = async (formData: GarageFormData) => {
  // Transform working hours to match the database model
  const workingHoursData = {
    monday_open: formData.workingHours.Monday.isOpen ? formData.workingHours.Monday.openTime : null,
    monday_close: formData.workingHours.Monday.isOpen ? formData.workingHours.Monday.closeTime : null,
    tuesday_open: formData.workingHours.Tuesday.isOpen ? formData.workingHours.Tuesday.openTime : null,
    tuesday_close: formData.workingHours.Tuesday.isOpen ? formData.workingHours.Tuesday.closeTime : null,
    wednesday_open: formData.workingHours.Wednesday.isOpen ? formData.workingHours.Wednesday.openTime : null,
    wednesday_close: formData.workingHours.Wednesday.isOpen ? formData.workingHours.Wednesday.closeTime : null,
    thursday_open: formData.workingHours.Thursday.isOpen ? formData.workingHours.Thursday.openTime : null,
    thursday_close: formData.workingHours.Thursday.isOpen ? formData.workingHours.Thursday.closeTime : null,
    friday_open: formData.workingHours.Friday.isOpen ? formData.workingHours.Friday.openTime : null,
    friday_close: formData.workingHours.Friday.isOpen ? formData.workingHours.Friday.closeTime : null,
    saturday_open: formData.workingHours.Saturday.isOpen ? formData.workingHours.Saturday.openTime : null,
    saturday_close: formData.workingHours.Saturday.isOpen ? formData.workingHours.Saturday.closeTime : null,
    sunday_open: formData.workingHours.Sunday.isOpen ? formData.workingHours.Sunday.openTime : null,
    sunday_close: formData.workingHours.Sunday.isOpen ? formData.workingHours.Sunday.closeTime : null
  };

  // Upload images if they exist
  let image_url = '';
  const gallery = [];
  
  // Upload cover image if it exists
  if (formData.coverImage) {
    try {
      image_url = await uploadService.uploadFile(formData.coverImage, 'cover');
      
      // Add to gallery as well
      gallery.push({
        image_url: image_url,
        alt_text: `${formData.name} main image`,
        display_order: 0
      });
    } catch (error) {
      console.error('Error uploading cover image:', error);
      // Use a placeholder if upload fails
      image_url = 'https://via.placeholder.com/800x600';
    }
  } else {
    // Use placeholder if no image provided
    image_url = 'https://via.placeholder.com/800x600';
  }

  // Upload logo if it exists (and add to gallery)
  if (formData.logo) {
    try {
      const logoUrl = await uploadService.uploadFile(formData.logo, 'logo');
      gallery.push({
        image_url: logoUrl,
        alt_text: `${formData.name} logo`,
        display_order: 1
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
    }
  }

  // Prepare final data structure for API
  return {
    name: formData.name,
    description: formData.about,
    address: formData.address,
    phone: formData.phone,
    email: formData.email,
    city: formData.city,
    district: formData.district,
    website: formData.website,
    services: formData.services,
    image_url: image_url,
    working_hours: workingHoursData,
    gallery: gallery
  };
};

const CreateGaragePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<GarageFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Add effect to scroll to top when step changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentStep]);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  const steps = [
    { id: 1, title: 'General Information', icon: Info },
    { id: 2, title: 'Location', icon: MapPin },
    { id: 3, title: 'Services', icon: Wrench },
    { id: 4, title: 'Images', icon: Image },
    { id: 5, title: 'Working Hours', icon: Clock }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setUploadProgress(10);
      
      // Validate form data before submission
      if (!formData.name || !formData.city || !formData.district || !formData.address) {
        showToast('Please fill in all required fields', 'error');
        setLoading(false);
        return;
      }
      
      // Prepare data for API
      setUploadProgress(30);
      const garageData = await prepareDataForSubmission(formData);
      
      setUploadProgress(70);
      // Submit to backend API
      await garageService.createGarage(garageData);
      
      setUploadProgress(100);
      // Show success modal toast
      showToast(
        'Your garage listing request has been received successfully. Average approval time is 30-60 minutes.',
        'success',
        true,
        'Garage Listing Request Received'
      );
      
      // Navigate to my-garage-ads page with filter set to pending
      setTimeout(() => {
        navigate('/my-garage-ads?status=pending');
      }, 100);
    } catch (error) {
      console.error('Error creating garage:', error);
      showToast('Failed to create garage. Please try again later.', 'error');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Email validation function
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation function for each step
  const isStepValid = () => {
    switch (currentStep) {
      case 1: // General Information
        return (
          formData.name.trim() !== '' &&
          formData.name.length <= 32 &&
          formData.about.trim() !== '' &&
          formData.phone.trim() !== '' &&
          formData.email.trim() !== '' &&
          isValidEmail(formData.email)
        );
      case 2: // Location
        return (
          formData.city.trim() !== '' &&
          formData.district.trim() !== '' &&
          formData.address.trim() !== ''
        );
      case 3: // Services
        return formData.services.length > 0;
      case 4: // Images
        return true; // Images are optional
      case 5: // Working Hours
        return true; // Working hours have default values
      default:
        return false;
    }
  };

  // Get error message for inputs
  const getInputError = (field: string) => {
    switch (field) {
      case 'name':
        if (formData.name.length > 32) {
          return 'Garage name cannot exceed 32 characters';
        }
        return '';
      case 'email':
        if (formData.email && !isValidEmail(formData.email)) {
          return 'Please enter a valid email address';
        }
        return '';
      default:
        return '';
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GeneralInfoStep
            formData={formData}
            setFormData={setFormData}
            getInputError={getInputError}
          />
        );
      case 2:
        return (
          <LocationStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <ServiceSelectionStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 4:
        return (
          <ImageUploadStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 5:
        return (
          <WorkingHoursStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between px-2 md:px-0">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                    className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all duration-300 ease-in-out transform ${
                      currentStep >= step.id
                        ? 'bg-primary-600 text-white scale-100'
                        : 'bg-secondary-200 text-secondary-600 scale-95'
                    } ${currentStep > step.id ? 'cursor-pointer hover:bg-primary-700' : 'cursor-default'}`}
                  >
                    {currentStep > step.id ? (
                      <Check size={14} className="transition-transform duration-300 ease-in-out" />
                    ) : (
                      <span className="text-sm">{step.id}</span>
                    )}
                  </button>
                  <div className="flex items-center gap-1 mt-2">
                    <step.icon size={14} className="text-secondary-500" />
                    <span className="text-xs md:text-sm text-secondary-600 hidden md:inline">{step.title}</span>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 md:mx-4 relative">
                    <div className="absolute inset-0 bg-secondary-200" />
                    <div
                      className="absolute inset-0 bg-primary-600 transition-all duration-500 ease-in-out origin-left"
                      style={{ transform: `scaleX(${currentStep > step.id ? 1 : 0})` }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="card">
          <div className="p-6">
            {renderStep()}
          </div>
          
          {/* Navigation Buttons */}
          <div className="p-6 border-t border-secondary-200 flex justify-between">
            <button
              onClick={handleBack}
              className={`btn btn-secondary flex items-center gap-2 ${
                currentStep === 1 ? 'invisible' : ''
              }`}
              disabled={loading}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
            
            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                className={`btn btn-primary flex items-center gap-2 ${
                  !isStepValid() ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={loading || !isStepValid()}
              >
                <span>Next</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="btn btn-primary flex items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-r-2 border-white"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Create Garage</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGaragePage; 