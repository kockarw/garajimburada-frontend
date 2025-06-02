import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash, Search, X, Check, Shield, AlertCircle, ChevronRight, MapPin } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import garageService, { GarageResponse } from '../../../services/garage.service';

// Modal component for confirmation
interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  confirmButtonClass: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  confirmButtonClass,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="p-4 border-b border-secondary-200">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertCircle size={20} className="text-primary-600" />
            {title}
          </h3>
        </div>
        <div className="p-4">
          <p className="text-secondary-700">{message}</p>
        </div>
        <div className="p-4 border-t border-secondary-200 flex justify-end gap-2">
          <button 
            className="btn btn-secondary" 
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button 
            className={`btn ${confirmButtonClass}`} 
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const GarageListingsTab: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [garages, setGarages] = useState<GarageResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmButtonClass: 'btn-primary',
    onConfirm: () => {}
  });

  // Fetch garages on component mount
  useEffect(() => {
    fetchGarages();
  }, []);

  const fetchGarages = async () => {
    try {
      setLoading(true);
      // Get all garages by setting status to undefined and is_active to undefined
      const fetchedGarages = await garageService.getAllGarages({
        status: undefined,
        is_active: undefined
      });
      setGarages(fetchedGarages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch garages');
      showToast('Failed to fetch garages', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Function to open the confirmation modal
  const openConfirmModal = (options: Partial<typeof modal>) => {
    setModal({
      ...modal,
      isOpen: true,
      ...options
    });
  };

  // Function to close the modal
  const closeModal = () => {
    setModal({
      ...modal,
      isOpen: false
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredGarages = garages.filter(garage => 
    garage.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    garage.ad_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (id: string) => {
    navigate(`/garage/${id}`);
  };

  const handleEditGarage = (id: string) => {
    try {
      console.log('Navigating to edit garage with ID:', id);
      const garage = garages.find(g => g.id === id);
      if (!garage) {
        showToast('Garage not found', 'error');
        return;
      }
      navigate(`/edit-garage/${id}`);
    } catch (error) {
      console.error('Error navigating to edit garage:', error);
      showToast('Failed to navigate to edit page', 'error');
    }
  };

  // Updated handlers with API calls
  const confirmToggleActive = async (id: string) => {
    const garage = garages.find(g => g.id === id);
    if (!garage) {
      showToast('Garage not found', 'error');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Toggling garage active status:', { id, currentStatus: garage.is_active });
      
      // Update the garage active status using admin endpoint
      const updatedGarage = await garageService.toggleGarageActive(id);
      console.log('Updated garage:', updatedGarage);
      
      // Refresh the entire list to get the latest data
      await fetchGarages();
      
      showToast(`Garage ${!garage.is_active ? 'activated' : 'deactivated'} successfully`, 'success');
    } catch (error: any) {
      console.error('Error toggling garage active status:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update garage status';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const confirmToggleVerified = async (id: string) => {
    const garage = garages.find(g => g.id === id);
    if (!garage) {
      showToast('Garage not found', 'error');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Toggling garage verification status:', { id, currentStatus: garage.is_verified });
      
      // Update the garage verification status using admin endpoint
      const updatedGarage = await garageService.toggleGarageVerified(id);
      console.log('Updated garage:', updatedGarage);
      
      // Refresh the list to get the latest data
      await fetchGarages();
      
      showToast(`Garage ${!garage.is_verified ? 'verified' : 'unverified'} successfully`, 'success');
    } catch (error: any) {
      console.error('Error toggling garage verification:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update garage verification';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const confirmDeleteGarage = async (id: string) => {
    setLoading(true);
    try {
      await garageService.deleteGarage(id);
      setGarages(prevGarages => prevGarages.filter(garage => garage.id !== id));
      showToast('Garage deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete garage', 'error');
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  // Modal opener functions
  const handleToggleActive = (id: string) => {
    const garage = garages.find(g => g.id === id);
    if (!garage) return;
    
    openConfirmModal({
      title: garage.is_active ? 'Deactivate Garage' : 'Activate Garage',
      message: garage.is_active 
        ? 'Are you sure you want to deactivate this garage? It will no longer be visible to users.'
        : 'Are you sure you want to activate this garage? It will become visible to users.',
      confirmText: garage.is_active ? 'Deactivate' : 'Activate',
      confirmButtonClass: garage.is_active ? 'btn-error' : 'btn-success',
      onConfirm: () => confirmToggleActive(id)
    });
  };

  const handleToggleVerified = (id: string) => {
    const garage = garages.find(g => g.id === id);
    if (!garage) return;
    
    openConfirmModal({
      title: garage.is_verified ? 'Remove Verification' : 'Verify Garage',
      message: garage.is_verified
        ? 'Are you sure you want to remove verification from this garage?'
        : 'Are you sure you want to verify this garage? This will mark it as a trusted business.',
      confirmText: garage.is_verified ? 'Remove Verification' : 'Verify',
      confirmButtonClass: garage.is_verified ? 'btn-error' : 'btn-success',
      onConfirm: () => confirmToggleVerified(id)
    });
  };

  const handleDeleteGarage = (id: string) => {
    openConfirmModal({
      title: 'Delete Garage',
      message: 'Are you sure you want to delete this garage? This action cannot be undone.',
      confirmText: 'Delete',
      confirmButtonClass: 'btn-error',
      onConfirm: () => confirmDeleteGarage(id)
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-success-100 text-success-700';
      case 'pending':
        return 'bg-warning-100 text-warning-700';
      case 'rejected':
        return 'bg-error-100 text-error-700';
      case 'inactive':
        return 'bg-secondary-100 text-secondary-700';
      default:
        return 'bg-secondary-100 text-secondary-700';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading && garages.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && garages.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-error-600 text-center">
          <p className="text-lg font-semibold">{error}</p>
          <button 
            className="btn btn-primary mt-4"
            onClick={fetchGarages}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-4 border-b border-secondary-200">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search garages by name or ID..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={20} />
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="block lg:hidden">
        <div className="space-y-4 p-4">
          {filteredGarages.map(garage => (
            <div key={garage.id} className="bg-white rounded-xl shadow-sm border border-secondary-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Header Section */}
              <div className="p-4 border-b border-secondary-100 bg-secondary-50/50">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {garage.is_verified && (
                        <Shield size={16} className="text-primary-600 shrink-0" />
                      )}
                      <h3 className="font-semibold text-secondary-900 text-lg">
                        {garage.name}
                      </h3>
                    </div>
                    <p className="text-sm text-secondary-600 mt-1 font-mono">
                      ID: {garage.ad_id}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Info Section */}
              <div className="p-4 space-y-4 bg-white">
                {/* Location Info */}
                <div className="flex items-start gap-2">
                  <div className="shrink-0 mt-0.5">
                    <MapPin size={16} className="text-secondary-500" />
                  </div>
                  <div>
                    <p className="text-sm text-secondary-900">{garage.city}</p>
                    <p className="text-sm text-secondary-600">{garage.district}</p>
                  </div>
                </div>

                {/* Status Tags */}
                <div className="flex items-center gap-1.5">
                  {/* Status Tag */}
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary-50">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      garage.status === 'approved' ? 'bg-success-500' :
                      garage.status === 'pending' ? 'bg-warning-500' :
                      garage.status === 'rejected' ? 'bg-error-500' :
                      'bg-secondary-500'
                    }`} />
                    <span className="text-xs font-medium text-secondary-900">
                      {getStatusText(garage.status)}
                    </span>
                  </div>

                  {/* Active/Inactive Tag */}
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                    garage.is_active 
                      ? 'bg-success-50 text-success-700'
                      : 'bg-error-50 text-error-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      garage.is_active ? 'bg-success-500' : 'bg-error-500'
                    }`} />
                    <span className="text-xs font-medium">
                      {garage.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Verified Tag */}
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                    garage.is_verified
                      ? 'bg-primary-50 text-primary-700'
                      : 'bg-secondary-50 text-secondary-700'
                  }`}>
                    <Shield size={12} />
                    <span className="text-xs font-medium">
                      {garage.is_verified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="px-4 py-3 bg-secondary-50 border-t border-secondary-100">
                <div className="flex items-center justify-end gap-2">
                  {/* View Details Button */}
                  <button
                    className="btn btn-ghost btn-sm text-secondary-700 hover:text-primary-600 flex items-center gap-1"
                    onClick={() => handleViewDetails(garage.id)}
                    title="View Details"
                  >
                    <Eye size={16} />
                    <span className="hidden sm:inline">View</span>
                  </button>

                  {/* Edit Button */}
                  <button
                    className="btn btn-ghost btn-sm text-secondary-700 hover:text-primary-600 flex items-center gap-1"
                    onClick={() => handleEditGarage(garage.id)}
                    title="Edit"
                  >
                    <Edit size={16} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  {/* Active/Inactive Toggle Button */}
                  <button
                    className={`btn btn-ghost btn-sm flex items-center gap-1 ${
                      garage.is_active 
                        ? 'text-success-600 hover:text-success-700' 
                        : 'text-error-600 hover:text-error-700'
                    }`}
                    onClick={() => handleToggleActive(garage.id)}
                    title={garage.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {garage.is_active ? <X size={16} /> : <Check size={16} />}
                    <span className="hidden sm:inline">
                      {garage.is_active ? 'Deactivate' : 'Activate'}
                    </span>
                  </button>

                  {/* Verify Toggle Button */}
                  <button
                    className={`btn btn-ghost btn-sm flex items-center gap-1 ${
                      garage.is_verified 
                        ? 'text-success-600 hover:text-success-700' 
                        : 'text-secondary-600 hover:text-secondary-700'
                    }`}
                    onClick={() => handleToggleVerified(garage.id)}
                    title={garage.is_verified ? 'Unverify' : 'Verify'}
                  >
                    <Shield size={16} />
                    <span className="hidden sm:inline">
                      {garage.is_verified ? 'Unverify' : 'Verify'}
                    </span>
                  </button>

                  {/* Delete Button */}
                  <button
                    className="btn btn-ghost btn-sm text-error-600 hover:text-error-700 flex items-center gap-1"
                    onClick={() => handleDeleteGarage(garage.id)}
                    title="Delete"
                  >
                    <Trash size={16} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {filteredGarages.length === 0 && (
            <div className="text-center py-8 bg-secondary-50 rounded-xl">
              <p className="text-secondary-500">No garages found matching your search.</p>
            </div>
          )}
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary-50">
              <th className="p-4 text-left">Garage Name</th>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">City</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGarages.map(garage => (
              <tr key={garage.id} className="border-b border-secondary-100">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {garage.is_verified && (
                      <Shield size={16} className="text-primary-600" />
                    )}
                    <span>{garage.name}</span>
                  </div>
                </td>
                <td className="p-4">{garage.ad_id}</td>
                <td className="p-4">{garage.city}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(garage.status)}`}>
                      {getStatusText(garage.status)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      garage.is_verified ? 'bg-primary-100 text-primary-800' : 'bg-secondary-100 text-secondary-800'
                    }`}>
                      {garage.is_verified ? 'Verified' : 'Unverified'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      garage.is_active ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                    }`}>
                      {garage.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 hover:bg-secondary-100 rounded-full text-secondary-700 hover:text-primary-600"
                      onClick={() => handleViewDetails(garage.id)}
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="p-1 hover:bg-secondary-100 rounded-full text-secondary-700 hover:text-primary-600"
                      onClick={() => handleEditGarage(garage.id)}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className={`p-1 hover:bg-secondary-100 rounded-full ${
                        garage.is_active 
                          ? 'text-success-600 hover:text-success-700' 
                          : 'text-error-600 hover:text-error-700'
                      }`}
                      onClick={() => handleToggleActive(garage.id)}
                      title={garage.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {garage.is_active ? <X size={18} /> : <Check size={18} />}
                    </button>
                    <button
                      className={`p-1 hover:bg-secondary-100 rounded-full ${
                        garage.is_verified 
                          ? 'text-success-600 hover:text-success-700' 
                          : 'text-secondary-600 hover:text-secondary-700'
                      }`}
                      onClick={() => handleToggleVerified(garage.id)}
                      title={garage.is_verified ? 'Remove Verification' : 'Verify'}
                    >
                      <Shield size={18} />
                    </button>
                    <button
                      className="p-1 hover:bg-secondary-100 rounded-full text-error-600 hover:text-error-700"
                      onClick={() => handleDeleteGarage(garage.id)}
                      title="Delete"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        confirmButtonClass={modal.confirmButtonClass}
        onConfirm={modal.onConfirm}
        onCancel={closeModal}
      />
    </div>
  );
};

export default GarageListingsTab; 