import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
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

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  const steps = [
    { id: 1, title: 'General Information' },
    { id: 2, title: 'Location' },
    { id: 3, title: 'Services' },
    { id: 4, title: 'Images' },
    { id: 5, title: 'Working Hours' }
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GeneralInfoStep
            formData={formData}
            setFormData={setFormData}
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
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= step.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-200 text-secondary-600'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check size={16} />
                    ) : (
                      <span>{step.id}</span>
                    )}
                  </div>
                  <span className="text-sm mt-2 text-secondary-600">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step.id ? 'bg-primary-600' : 'bg-secondary-200'
                    }`}
                  />
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
                className="btn btn-primary flex items-center gap-2"
                disabled={loading}
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