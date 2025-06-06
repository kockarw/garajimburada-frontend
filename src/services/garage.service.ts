import api from './api';
import { Garage, WorkingHours, GalleryImage, Review } from '../mockdata/types';

// Garage status type
export type GarageStatus = 'approved' | 'pending' | 'rejected' | 'inactive' | 'all';

// Response types based on API structure
export interface GarageResponse extends Garage {
  working_hours: WorkingHours;
  gallery: GalleryImage[];
  is_active: boolean;
  is_verified: boolean;
  status: GarageStatus;
  rejection_reason?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  reviews: Review[];
  rating: number;
  reviewCount: number;
  owner: {
    id: string;
    username: string;
    email: string;
    avatar_url: string | null;
  };
  ad_id: string;
}

export interface GarageListResponse {
  garages: GarageResponse[];
  statusCounts: {
    all: number;
    approved: number;
    pending: number;
    rejected: number;
    inactive: number;
  };
}

class GarageService {
  private handleError(error: any): Error {
    console.error('API Error:', error);
    if (error.response) {
      return new Error(error.response.data.message || 'An error occurred with the API');
    }
    return new Error('Network error occurred');
  }

  async getAllGarages(filters?: {
    search?: string;
    city?: string;
    district?: string;
    service?: string;
    minRating?: number;
    is_active?: boolean;
    status?: GarageStatus;
  }): Promise<GarageResponse[]> {
    try {
      // Set default filters for public listing
      const defaultFilters = {
        is_active: true,
        status: 'approved' as GarageStatus,
        ...filters // Allow overriding defaults if needed
      };

      console.log('Making API request to /garages with filters:', defaultFilters);
      const response = await api.get<GarageResponse[]>('/garages', { params: defaultFilters });
      console.log('Raw API response:', response);
      return response.data;
    } catch (error) {
      console.error('Detailed API error:', error);
      throw this.handleError(error);
    }
  }

  async getGarageById(id: string): Promise<GarageResponse> {
    try {
      console.log('Making API request to get garage by ID:', id);
      const response = await api.get<GarageResponse>(`/garages/${id}`);
      console.log('Received garage data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error getting garage by ID:', error.response?.data || error);
      throw this.handleError(error);
    }
  }

  async createGarage(garageData: Partial<GarageResponse>): Promise<GarageResponse> {
    try {
      const response = await api.post<{message: string, garage: GarageResponse}>('/garages', garageData);
      return response.data.garage;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateGarageWorkingHours(id: string, workingHours: Partial<WorkingHours>): Promise<GarageResponse> {
    try {
      const response = await api.put<{message: string, garage: GarageResponse}>(
        `/garages/${id}/working-hours`,
        workingHours
      );
      return response.data.garage;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateGarageDetails(id: string, garageData: Partial<Omit<GarageResponse, 'working_hours'>>): Promise<GarageResponse> {
    try {
      const cleanedData = Object.fromEntries(
        Object.entries(garageData)
          .filter(([_, value]) => value !== undefined)
          .map(([key, value]) => [
            key,
            value !== null && typeof value === 'object'
              ? Object.fromEntries(
                  Object.entries(value).filter(([_, v]) => v !== undefined)
                )
              : value
          ])
      );

      const response = await api.put<{message: string, garage: GarageResponse}>(
        `/garages/${id}/details`,
        cleanedData
      );
      return response.data.garage;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateGarage(id: string, garageData: Partial<GarageResponse>): Promise<GarageResponse> {
    try {
      // Get current garage data first
      const currentGarage = await this.getGarageById(id);
      
      // Prepare the update data
      const updateData = {
        id: currentGarage.id,
        ad_id: currentGarage.ad_id,
        name: garageData.name || currentGarage.name,
        description: garageData.description || currentGarage.description,
        website: garageData.website || currentGarage.website,
        phone: garageData.phone || currentGarage.phone,
        email: garageData.email || currentGarage.email,
        city: garageData.city || currentGarage.city,
        district: garageData.district || currentGarage.district,
        address: garageData.address || currentGarage.address,
        services: garageData.services || currentGarage.services,
        image_url: garageData.image_url || currentGarage.image_url,
        rating: currentGarage.rating,
        reviewCount: currentGarage.reviewCount,
        create_time: currentGarage.create_time,
        update_time: new Date().toISOString(),
        status: currentGarage.status,
        is_active: currentGarage.is_active,
        is_verified: currentGarage.is_verified,
        working_hours: garageData.working_hours 
          ? { ...currentGarage.working_hours, ...garageData.working_hours }
          : currentGarage.working_hours
      };

      const response = await api.put<{message: string, garage: GarageResponse}>(
        `/garages/${id}`,
        updateData
      );
      return response.data.garage;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getUserGarages(status?: GarageStatus): Promise<GarageListResponse> {
    try {
      console.log('Requesting garages with status:', status); // Debug log
      
      // Status parametresini query string'e ekle
      const queryParams = status ? `?status=${status}` : '';
      const response = await api.get<GarageListResponse>(`/garages/user/garages${queryParams}`);
      
      console.log('API response:', response.data); // Debug log
      
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateGarageStatus(garageId: string, status: GarageStatus, rejectionReason?: string, is_active?: boolean): Promise<GarageResponse> {
    try {
      console.log('Updating garage status:', { garageId, status, rejectionReason, is_active });
      const response = await api.patch<{message: string, garage: GarageResponse}>(`/garages/${garageId}/status`, {
        status,
        rejection_reason: rejectionReason,
        is_active: is_active
      });
      console.log('Update response:', response.data);
      return response.data.garage;
    } catch (error) {
      console.error('Error updating garage status:', error);
      throw this.handleError(error);
    }
  }

  async deleteGarage(garageId: string): Promise<void> {
    try {
      await api.delete(`/garages/${garageId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async toggleGarageActive(garageId: string): Promise<GarageResponse> {
    try {
      console.log('Toggling garage active status:', { garageId });
      const response = await api.patch<{message: string, garage: GarageResponse}>(`/garages/${garageId}/toggle-active`);
      console.log('Toggle response:', response.data);
      return response.data.garage;
    } catch (error) {
      console.error('Error toggling garage active status:', error);
      throw this.handleError(error);
    }
  }

  async toggleGarageVerified(garageId: string): Promise<GarageResponse> {
    try {
      console.log('Toggling garage verification status:', { garageId });
      const response = await api.patch<{message: string, garage: GarageResponse}>(`/garages/${garageId}/toggle-verified`);
      console.log('Toggle response:', response.data);
      return response.data.garage;
    } catch (error) {
      console.error('Error toggling garage verification status:', error);
      throw this.handleError(error);
    }
  }
}

export const garageService = new GarageService();
export default garageService; 