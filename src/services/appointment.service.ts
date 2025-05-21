import api from './api';

// Randevu tipi
export interface Appointment {
  id: string;
  garageId: string;
  garageName: string;
  userId: string;
  serviceType: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  address: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Randevu oluşturma istek tipi
export interface CreateAppointmentRequest {
  garageId: string;
  serviceType: string;
  date: string;
  time: string;
  notes?: string;
}

// Randevu güncelleme istek tipi
export interface UpdateAppointmentRequest {
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  date?: string;
  time?: string;
  notes?: string;
}

// Kullanıcının randevularını getirme
export const getUserAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get<Appointment[]>('/appointments/user');
  return response.data;
};

// Bir garajın randevularını getirme (garaj sahibi için)
export const getGarageAppointments = async (garageId: string): Promise<Appointment[]> => {
  const response = await api.get<Appointment[]>(`/appointments/garage/${garageId}`);
  return response.data;
};

// Tek bir randevu detayını getirme
export const getAppointmentById = async (id: string): Promise<Appointment> => {
  const response = await api.get<Appointment>(`/appointments/${id}`);
  return response.data;
};

// Randevu oluşturma
export const createAppointment = async (data: CreateAppointmentRequest): Promise<Appointment> => {
  const response = await api.post<Appointment>('/appointments', data);
  return response.data;
};

// Randevu güncelleme
export const updateAppointment = async (id: string, data: UpdateAppointmentRequest): Promise<Appointment> => {
  const response = await api.put<Appointment>(`/appointments/${id}`, data);
  return response.data;
};

// Randevu iptal etme
export const cancelAppointment = async (id: string): Promise<Appointment> => {
  const response = await api.patch<Appointment>(`/appointments/${id}/cancel`, {});
  return response.data;
};

// Bir garaj için belirli bir gündeki müsait saatleri getirme
export const getAvailableTimes = async (garageId: string, date: string): Promise<string[]> => {
  const response = await api.get<string[]>(`/appointments/available-times`, {
    params: { garageId, date }
  });
  return response.data;
};

const appointmentService = {
  getUserAppointments,
  getGarageAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  cancelAppointment,
  getAvailableTimes,
};

export default appointmentService; 