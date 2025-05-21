import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { garageService, GarageResponse } from '../services/garage.service';
import { WorkingHours } from '../mockdata/types';

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
  logoUrl?: string;
  coverImageUrl?: string;
  
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

const defaultWorkingHours = {
  Monday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  Tuesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  Wednesday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  Thursday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  Friday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
  Saturday: { isOpen: true, openTime: '09:00', closeTime: '14:00' },
  Sunday: { isOpen: false, openTime: '09:00', closeTime: '18:00' }
};

const EditGaragePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<GarageFormData>({
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
    logoUrl: '',
    coverImageUrl: '',
    workingHours: defaultWorkingHours
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [garageData, setGarageData] = useState<any | null>(null);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  const convertWorkingHoursToAPI = (hours: typeof defaultWorkingHours): Partial<WorkingHours> => {
    return {
      monday_open: hours.Monday.isOpen ? hours.Monday.openTime : null,
      monday_close: hours.Monday.isOpen ? hours.Monday.closeTime : null,
      tuesday_open: hours.Tuesday.isOpen ? hours.Tuesday.openTime : null,
      tuesday_close: hours.Tuesday.isOpen ? hours.Tuesday.closeTime : null,
      wednesday_open: hours.Wednesday.isOpen ? hours.Wednesday.openTime : null,
      wednesday_close: hours.Wednesday.isOpen ? hours.Wednesday.closeTime : null,
      thursday_open: hours.Thursday.isOpen ? hours.Thursday.openTime : null,
      thursday_close: hours.Thursday.isOpen ? hours.Thursday.closeTime : null,
      friday_open: hours.Friday.isOpen ? hours.Friday.openTime : null,
      friday_close: hours.Friday.isOpen ? hours.Friday.closeTime : null,
      saturday_open: hours.Saturday.isOpen ? hours.Saturday.openTime : null,
      saturday_close: hours.Saturday.isOpen ? hours.Saturday.closeTime : null,
      sunday_open: hours.Sunday.isOpen ? hours.Sunday.openTime : null,
      sunday_close: hours.Sunday.isOpen ? hours.Sunday.closeTime : null
    };
  };

  const convertAPIToWorkingHours = (hours: WorkingHours) => {
    return {
      Monday: { 
        isOpen: !!hours.monday_open, 
        openTime: hours.monday_open || '09:00', 
        closeTime: hours.monday_close || '18:00' 
      },
      Tuesday: { 
        isOpen: !!hours.tuesday_open, 
        openTime: hours.tuesday_open || '09:00', 
        closeTime: hours.tuesday_close || '18:00' 
      },
      Wednesday: { 
        isOpen: !!hours.wednesday_open, 
        openTime: hours.wednesday_open || '09:00', 
        closeTime: hours.wednesday_close || '18:00' 
      },
      Thursday: { 
        isOpen: !!hours.thursday_open, 
        openTime: hours.thursday_open || '09:00', 
        closeTime: hours.thursday_close || '18:00' 
      },
      Friday: { 
        isOpen: !!hours.friday_open, 
        openTime: hours.friday_open || '09:00', 
        closeTime: hours.friday_close || '18:00' 
      },
      Saturday: { 
        isOpen: !!hours.saturday_open, 
        openTime: hours.saturday_open || '09:00', 
        closeTime: hours.saturday_close || '14:00' 
      },
      Sunday: { 
        isOpen: !!hours.sunday_open, 
        openTime: hours.sunday_open || '09:00', 
        closeTime: hours.sunday_close || '18:00' 
      }
    };
  };

  useEffect(() => {
    const fetchGarageData = async () => {
      setInitialLoading(true);
      
      try {
        if (!id) {
          navigate('/my-garage-ads');
          return;
        }
        
        // Fetch garage data from API
        const garage = await garageService.getGarageById(id);
        
        if (!garage) {
          showToast('Garage not found', 'error');
          navigate('/my-garage-ads');
          return;
        }
        
        setGarageData(garage);
        
        // Prepare form data
        setFormData({
          name: garage.name || '',
          about: garage.description || '',
          website: garage.website || '',
          phone: garage.phone || '',
          email: garage.email || '',
          city: garage.city || '',
          district: garage.district || '',
          address: garage.address || '',
          services: garage.services || [],
          logo: null,
          coverImage: null,
          logoUrl: garage.image_url || '',
          coverImageUrl: garage.image_url || '',
          workingHours: garage.working_hours ? convertAPIToWorkingHours(garage.working_hours) : defaultWorkingHours
        });
      } catch (error) {
        console.error('Error fetching garage data:', error);
        showToast('Failed to load garage data', 'error');
        navigate('/my-garage-ads');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchGarageData();
  }, [id, navigate, showToast]);

  const steps = [
    { id: 1, title: 'General Information' },
    { id: 2, title: 'Location' },
    { id: 3, title: 'Services' },
    { id: 4, title: 'Images' },
    { id: 5, title: 'Working Hours' }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      if (!id || !garageData) {
        throw new Error('Missing garage data');
      }

      // Only send the fields that have changed
      const changedFields: Record<string, any> = {};
      
      // Check for changes in basic fields
      if (formData.name !== garageData.name) changedFields.name = formData.name;
      if (formData.about !== garageData.description) changedFields.description = formData.about;
      if (formData.website !== garageData.website) changedFields.website = formData.website;
      if (formData.phone !== garageData.phone) changedFields.phone = formData.phone;
      if (formData.email !== garageData.email) changedFields.email = formData.email;
      if (formData.city !== garageData.city) changedFields.city = formData.city;
      if (formData.district !== garageData.district) changedFields.district = formData.district;
      if (formData.address !== garageData.address) changedFields.address = formData.address;
      if (JSON.stringify(formData.services) !== JSON.stringify(garageData.services)) {
        changedFields.services = formData.services;
      }
      if (formData.coverImageUrl !== garageData.image_url) {
        changedFields.image_url = formData.coverImageUrl;
      }

      // Check if working hours have changed
      const workingHoursUpdate = {
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

      const currentHours = garageData.working_hours;
      const hasWorkingHoursChanged = 
        currentHours.monday_open !== workingHoursUpdate.monday_open ||
        currentHours.monday_close !== workingHoursUpdate.monday_close ||
        currentHours.tuesday_open !== workingHoursUpdate.tuesday_open ||
        currentHours.tuesday_close !== workingHoursUpdate.tuesday_close ||
        currentHours.wednesday_open !== workingHoursUpdate.wednesday_open ||
        currentHours.wednesday_close !== workingHoursUpdate.wednesday_close ||
        currentHours.thursday_open !== workingHoursUpdate.thursday_open ||
        currentHours.thursday_close !== workingHoursUpdate.thursday_close ||
        currentHours.friday_open !== workingHoursUpdate.friday_open ||
        currentHours.friday_close !== workingHoursUpdate.friday_close ||
        currentHours.saturday_open !== workingHoursUpdate.saturday_open ||
        currentHours.saturday_close !== workingHoursUpdate.saturday_close ||
        currentHours.sunday_open !== workingHoursUpdate.sunday_open ||
        currentHours.sunday_close !== workingHoursUpdate.sunday_close;

      if (hasWorkingHoursChanged) {
        changedFields.working_hours = {
          id: garageData.working_hours.id,
          garage_id: garageData.working_hours.garage_id,
          ...workingHoursUpdate
        };
      }

      // Only proceed with update if there are changes
      if (Object.keys(changedFields).length > 0) {
        // Add required fields for the update
        const updateData = {
          ...changedFields,
          id: garageData.id,
          ad_id: garageData.ad_id,
          rating: garageData.rating,
          reviewCount: garageData.reviewCount,
          create_time: garageData.create_time,
          update_time: new Date().toISOString(),
          status: garageData.status,
          is_active: garageData.is_active,
          is_verified: garageData.is_verified
        };

        await garageService.updateGarage(id, updateData);
        
        showToast(
          'Your garage listing has been updated successfully. It will be reviewed by our team.',
          'success',
          true,
          'Update Successful'
        );
      } else {
        showToast(
          'No changes were made to update.',
          'info',
          true,
          'No Changes'
        );
      }
      
      // Navigate back to my-garage-ads
      navigate('/my-garage-ads');
    } catch (error) {
      console.error('Error updating garage:', error);
      showToast('Failed to update garage', 'error');
    } finally {
      setLoading(false);
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

  if (initialLoading) {
    return (
      <div className="container py-16 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mb-4"></div>
        <p className="text-secondary-600">Loading garage data...</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/my-garage-ads')}
          className="mr-4 text-secondary-600 hover:text-secondary-800"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-3xl font-bold">Edit Garage Advertisement</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Admin Notice */}
        {user?.is_admin && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-primary-600 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-primary-800">
                You are currently editing the garage page as an admin.
              </p>
              <p className="text-sm text-primary-700 mt-1">
                Any changes you make will be applied immediately without requiring approval.
              </p>
            </div>
          </div>
        )}
        
        {/* Rejection Notice */}
        {garageData?.status === 'rejected' && garageData?.rejection_reason && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-error-600 mt-0.5" size={20} />
            <div>
              <p className="font-medium text-error-800">
                Your garage listing was rejected for the following reason:
              </p>
              <p className="text-sm text-error-700 mt-1">
                {garageData.rejection_reason}
              </p>
              <p className="text-sm text-error-700 mt-2">
                Please make the necessary changes and resubmit your listing.
              </p>
            </div>
          </div>
        )}
        
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
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Update Garage</span>
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

export default EditGaragePage; 