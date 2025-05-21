import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, FileText, MapPin } from 'lucide-react';
import appointmentService, { CreateAppointmentRequest } from '../../services/appointment.service';
import garageService, { GarageResponse } from '../../services/garage.service';

const AppointmentForm: React.FC = () => {
  const { garageId } = useParams<{ garageId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [formValues, setFormValues] = useState<CreateAppointmentRequest>({
    garageId: garageId || '',
    serviceType: '',
    date: '',
    time: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [garage, setGarage] = useState<GarageResponse | null>(null);
  const [isLoadingGarage, setIsLoadingGarage] = useState(false);
  
  // Load garage details if garageId is provided
  useEffect(() => {
    const fetchGarageDetails = async () => {
      if (!garageId) return;
      
      try {
        setIsLoadingGarage(true);
        const data = await garageService.getGarageById(garageId);
        setGarage(data);
        setFormValues(prev => ({
          ...prev,
          garageId: data.id
        }));
      } catch (error) {
        console.error('Error fetching garage details:', error);
        showToast('Garaj bilgileri yüklenirken hata oluştu', 'error');
      } finally {
        setIsLoadingGarage(false);
      }
    };
    
    fetchGarageDetails();
  }, [garageId, showToast]);
  
  // Fetch available times when date is selected
  const fetchAvailableTimes = async (date: string) => {
    if (!date || !formValues.garageId) return;
    
    try {
      const times = await appointmentService.getAvailableTimes(formValues.garageId, date);
      setAvailableTimes(times);
    } catch (error) {
      console.error('Error fetching available times:', error);
      showToast('Uygun saatler yüklenirken hata oluştu', 'error');
    }
  };
  
  // Update form values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Fetch available times when date changes
    if (name === 'date') {
      fetchAvailableTimes(value);
    }
  };
  
  // Form validation
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formValues.garageId) {
      newErrors.garageId = 'Lütfen bir garaj seçin';
    }
    
    if (!formValues.serviceType) {
      newErrors.serviceType = 'Lütfen bir hizmet türü seçin';
    }
    
    if (!formValues.date) {
      newErrors.date = 'Lütfen tarih seçin';
    }
    
    if (!formValues.time) {
      newErrors.time = 'Lütfen saat seçin';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      showToast('Randevu oluşturmak için giriş yapmalısınız', 'error');
      navigate('/login');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      await appointmentService.createAppointment(formValues);
      
      showToast('Randevunuz başarıyla oluşturuldu', 'success');
      navigate('/appointments');
    } catch (error) {
      console.error('Error creating appointment:', error);
      showToast('Randevu oluşturulurken hata oluştu', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Randevu Oluştur</h1>
        
        {isLoadingGarage ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
            {garage && (
              <div className="mb-6 pb-6 border-b border-secondary-200">
                <h2 className="font-semibold text-lg mb-2">{garage.name}</h2>
                <div className="flex items-start gap-2 text-secondary-700">
                  <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                  <span>{garage.address}, {garage.district}, {garage.city}</span>
                </div>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="serviceType" className="block text-sm font-medium text-secondary-700 mb-1">
                Hizmet Türü
              </label>
              <select
                id="serviceType"
                name="serviceType"
                value={formValues.serviceType}
                onChange={handleChange}
                className={`select w-full ${errors.serviceType ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Hizmet Seçin</option>
                {garage && garage.services ? (
                  garage.services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Yağ Değişimi">Yağ Değişimi</option>
                    <option value="Fren Bakımı">Fren Bakımı</option>
                    <option value="Lastik Değişimi">Lastik Değişimi</option>
                    <option value="Motor Bakımı">Motor Bakımı</option>
                    <option value="Genel Bakım">Genel Bakım</option>
                  </>
                )}
              </select>
              {errors.serviceType && <p className="mt-1 text-sm text-red-600">{errors.serviceType}</p>}
            </div>
            
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="w-full md:w-1/2">
                <label htmlFor="date" className="block text-sm font-medium text-secondary-700 mb-1">
                  Tarih
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-secondary-400" />
                  </div>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formValues.date}
                    onChange={handleChange}
                    className={`input pl-10 ${errors.date ? 'border-red-500' : ''}`}
                    min={new Date().toISOString().split('T')[0]} // Bugünden itibaren tarihler
                    required
                  />
                </div>
                {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
              </div>
              
              <div className="w-full md:w-1/2">
                <label htmlFor="time" className="block text-sm font-medium text-secondary-700 mb-1">
                  Saat
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock size={18} className="text-secondary-400" />
                  </div>
                  <select
                    id="time"
                    name="time"
                    value={formValues.time}
                    onChange={handleChange}
                    className={`select pl-10 ${errors.time ? 'border-red-500' : ''}`}
                    disabled={!formValues.date || availableTimes.length === 0}
                    required
                  >
                    <option value="">Saat Seçin</option>
                    {availableTimes.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
                {formValues.date && availableTimes.length === 0 && (
                  <p className="mt-1 text-sm text-yellow-600">
                    Seçilen tarih için uygun saat bulunamadı. Lütfen başka bir tarih seçin.
                  </p>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-secondary-700 mb-1">
                Notlar (Opsiyonel)
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText size={18} className="text-secondary-400" />
                </div>
                <textarea
                  id="notes"
                  name="notes"
                  value={formValues.notes}
                  onChange={handleChange}
                  className="input pl-10 h-24"
                  placeholder="Araç bilgileri veya diğer özel isteklerinizi belirtebilirsiniz"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
              >
                İptal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    <span>Oluşturuluyor...</span>
                  </div>
                ) : (
                  'Randevu Oluştur'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AppointmentForm; 