import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, MoreHorizontal, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import appointmentService, { Appointment } from '../../services/appointment.service';

const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const data = await appointmentService.getUserAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        showToast('Failed to load appointments', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [user, showToast]);

  // Cancel an appointment
  const handleCancelAppointment = async (id: string) => {
    try {
      await appointmentService.cancelAppointment(id);
      // Update the local state after successful cancellation
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id 
            ? { ...appointment, status: 'cancelled' } 
            : appointment
        )
      );
      showToast('Appointment cancelled successfully', 'success');
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      showToast('Failed to cancel appointment', 'error');
    }
  };

  // Status helpers
  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'confirmed':
        return 'Onaylandı';
      case 'completed':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Randevularım</h1>
        <Link 
          to="/appointment/new" 
          className="btn btn-primary"
        >
          Yeni Randevu
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Henüz randevunuz bulunmamaktadır</h2>
          <p className="text-secondary-600 mb-6">
            Yeni bir garaj randevusu oluşturmak için "Yeni Randevu" butonuna tıklayın veya garaj sayfalarını ziyaret edin.
          </p>
          <Link to="/" className="btn btn-primary">
            Garajları Keşfedin
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div 
              key={appointment.id} 
              className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">
                    <Link to={`/garage/${appointment.garageId}`} className="hover:text-primary-600">
                      {appointment.garageName}
                    </Link>
                  </h3>
                  <p className="text-secondary-600">{appointment.serviceType}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-secondary-700">
                  <Calendar size={16} />
                  <span>{appointment.date}</span>
                  <Clock size={16} className="ml-2" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary-700">
                  <MapPin size={16} />
                  <span>{appointment.address}</span>
                </div>
                {appointment.notes && (
                  <p className="text-secondary-600 text-sm mt-2">
                    <strong>Not:</strong> {appointment.notes}
                  </p>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <div className="relative dropdown">
                  <button className="p-2 hover:bg-secondary-100 rounded-full text-secondary-500">
                    <MoreHorizontal size={20} />
                  </button>
                  <div className="dropdown-content hidden absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                    <Link to={`/appointment/${appointment.id}`} className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">
                      Detayları Görüntüle
                    </Link>
                    {appointment.status === 'pending' && (
                      <>
                        <Link to={`/appointment/edit/${appointment.id}`} className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100">
                          Randevuyu Düzenle
                        </Link>
                        <button 
                          onClick={() => handleCancelAppointment(appointment.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-secondary-100"
                        >
                          İptal Et
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentList; 