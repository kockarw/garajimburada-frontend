import React, { useState, useEffect } from 'react';
import { Eye, Edit, Trash, Search, X, Check, Shield, AlertCircle, ChevronRight } from 'lucide-react';
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
    navigate(`/edit-garage/${id}`);
  };

  // Updated handlers with API calls
  const confirmToggleActive = async (id: string) => {
    const garage = garages.find(g => g.id === id);
    if (!garage) return;
    
    setLoading(true);
    try {
      const newStatus = garage.status === 'approved' ? 'inactive' : 'approved';
      await garageService.updateGarageStatus(id, newStatus);
      
      // Refresh the entire list to get the latest data
      await fetchGarages();
      
      showToast(`Garage status updated to ${newStatus} successfully`, 'success');
    } catch (err) {
      showToast(`Failed to update garage status`, 'error');
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  const confirmToggleVerified = async (id: string) => {
    const garage = garages.find(g => g.id === id);
    if (!garage) return;
    
    setLoading(true);
    try {
      const updatedGarage = await garageService.updateGarageDetails(id, {
        is_verified: !garage.is_verified
      });
      
      setGarages(prevGarages => 
        prevGarages.map(g => g.id === id ? updatedGarage : g)
      );
      
      showToast(`Garage ${!garage.is_verified ? 'verified' : 'unverified'} successfully`, 'success');
    } catch (err) {
      showToast(`Failed to ${!garage.is_verified ? 'verify' : 'unverify'} garage`, 'error');
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
    
    const isApproved = garage.status === 'approved';
    openConfirmModal({
      title: isApproved ? 'Deactivate Garage' : 'Activate Garage',
      message: isApproved 
        ? 'Are you sure you want to deactivate this garage? It will no longer be visible to users.'
        : 'Are you sure you want to activate this garage? It will become visible to all users.',
      confirmText: isApproved ? 'Deactivate' : 'Activate',
      confirmButtonClass: isApproved ? 'btn-error' : 'btn-success',
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {garage.is_verified && (
                      <div className="shrink-0">
                        <Shield size={16} className="text-primary-600" />
                      </div>
                    )}
                    <h3 className="font-semibold text-secondary-900 truncate">
                      {garage.name}
                    </h3>
                  </div>
                  <span className={`ml-3 shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(garage.status)}`}>
                    {getStatusText(garage.status)}
                  </span>
                </div>
              </div>
              
              {/* Info Section */}
              <div className="p-4 space-y-3 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-secondary-500 font-medium">ID</p>
                    <p className="text-sm font-mono text-secondary-900">{garage.ad_id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-secondary-500 font-medium">City</p>
                    <p className="text-sm text-secondary-900">{garage.city}</p>
                  </div>
                </div>
              </div>

              {/* Actions Section */}
              <div className="px-4 py-3 bg-secondary-50/50 border-t border-secondary-100">
                <div className="flex items-center justify-end gap-1">
                  <button
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-white text-secondary-700 hover:text-primary-600 transition-colors duration-200"
                    onClick={() => handleViewDetails(garage.id)}
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-white text-secondary-700 hover:text-primary-600 transition-colors duration-200"
                    onClick={() => handleEditGarage(garage.id)}
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-white transition-colors duration-200 ${
                      garage.status === 'approved' 
                        ? 'text-error-600 hover:text-error-700' 
                        : 'text-success-600 hover:text-success-700'
                    }`}
                    onClick={() => handleToggleActive(garage.id)}
                    title={garage.status === 'approved' ? 'Deactivate' : 'Activate'}
                  >
                    {garage.status === 'approved' ? <X size={18} /> : <Check size={18} />}
                  </button>
                  <button
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-white transition-colors duration-200 ${
                      garage.is_verified 
                        ? 'text-error-600 hover:text-error-700' 
                        : 'text-success-600 hover:text-success-700'
                    }`}
                    onClick={() => handleToggleVerified(garage.id)}
                    title={garage.is_verified ? 'Remove Verification' : 'Verify'}
                  >
                    <Shield size={18} />
                  </button>
                  <button
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-white text-error-600 hover:text-error-700 transition-colors duration-200"
                    onClick={() => handleDeleteGarage(garage.id)}
                    title="Delete"
                  >
                    <Trash size={18} />
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
                  <span className={`px-2 py-1 rounded-full text-sm ${getStatusStyle(garage.status)}`}>
                    {getStatusText(garage.status)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 hover:bg-secondary-100 rounded-full"
                      onClick={() => handleViewDetails(garage.id)}
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="p-1 hover:bg-secondary-100 rounded-full"
                      onClick={() => handleEditGarage(garage.id)}
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className={`p-1 hover:bg-secondary-100 rounded-full ${
                        garage.status === 'approved' ? 'text-error-600' : 'text-success-600'
                      }`}
                      onClick={() => handleToggleActive(garage.id)}
                      title={garage.status === 'approved' ? 'Deactivate' : 'Activate'}
                    >
                      {garage.status === 'approved' ? <X size={18} /> : <Check size={18} />}
                    </button>
                    <button
                      className={`p-1 hover:bg-secondary-100 rounded-full ${
                        garage.is_verified ? 'text-error-600' : 'text-success-600'
                      }`}
                      onClick={() => handleToggleVerified(garage.id)}
                      title={garage.is_verified ? 'Remove Verification' : 'Verify'}
                    >
                      <Shield size={18} />
                    </button>
                    <button
                      className="p-1 hover:bg-secondary-100 rounded-full text-error-600"
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