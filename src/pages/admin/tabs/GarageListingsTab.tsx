import React, { useState } from 'react';
import { Eye, Edit, Trash, Search, X, Check, Shield, AlertCircle } from 'lucide-react';
import { useToast } from '../../../contexts/ToastContext';
import { Garage as BaseGarage } from '../../../mockdata/types';
import { Link, useNavigate } from 'react-router-dom';
import { adminGarages } from '../../../mockdata/admin';

// Extend the Garage type to include admin-specific properties
interface AdminGarage extends BaseGarage {
  is_active: boolean;
  is_verified: boolean;
}

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
  
  // Initialize garages with default active/verified status
  const [garages, setGarages] = useState<AdminGarage[]>(
    adminGarages.map(garage => ({
      ...garage,
      create_time: garage.create_time || new Date().toISOString(),
      update_time: garage.update_time || null,
      is_active: true,
      is_verified: ['1', '2', '5'].includes(garage.id) // Just for example: only a few garages are verified
    }))
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
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

  // Updated handlers with confirmation modals
  const confirmToggleActive = (id: string) => {
    const garage = garages.find(g => g.id === id);
    if (!garage) return;
    
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      const updatedGarages = garages.map(g => 
        g.id === id 
          ? { ...g, is_active: !g.is_active } 
          : g
      );
      
      setGarages(updatedGarages);
      showToast(`Garage status ${!garage.is_active ? 'activated' : 'deactivated'} successfully`, 'success');
      setLoading(false);
      closeModal();
    }, 500);
  };

  const confirmToggleVerified = (id: string) => {
    const garage = garages.find(g => g.id === id);
    if (!garage) return;
    
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      const updatedGarages = garages.map(g => 
        g.id === id 
          ? { ...g, is_verified: !g.is_verified } 
          : g
      );
      
      setGarages(updatedGarages);
      showToast(`Garage ${!garage.is_verified ? 'verified' : 'unverified'} successfully`, 'success');
      setLoading(false);
      closeModal();
    }, 500);
  };

  const confirmDeleteGarage = (id: string) => {
    setLoading(true);
    
    // Simulating API call
    setTimeout(() => {
      const updatedGarages = garages.filter(garage => garage.id !== id);
      setGarages(updatedGarages);
      showToast('Garage deleted successfully', 'success');
      setLoading(false);
      closeModal();
    }, 500);
  };

  // Modal opener functions
  const handleToggleActive = (id: string) => {
    const garage = garages.find(g => g.id === id);
    if (!garage) return;
    
    openConfirmModal({
      title: garage.is_active ? 'Deactivate Garage' : 'Activate Garage',
      message: garage.is_active 
        ? 'Are you sure you want to deactivate this garage? It will no longer be visible to users.'
        : 'Are you sure you want to activate this garage? It will become visible to all users.',
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
        ? 'Are you sure you want to remove verification status from this garage? This may affect its visibility and trust.'
        : 'Are you sure you want to verify this garage? This will mark it as a trusted business.',
      confirmText: garage.is_verified ? 'Remove Verification' : 'Verify',
      confirmButtonClass: garage.is_verified ? 'btn-secondary' : 'btn-primary',
      onConfirm: () => confirmToggleVerified(id)
    });
  };

  const handleDeleteGarage = (id: string) => {
    openConfirmModal({
      title: 'Delete Garage',
      message: 'Are you sure you want to delete this garage? This action cannot be undone and all associated data will be permanently removed.',
      confirmText: 'Delete',
      confirmButtonClass: 'btn-error',
      onConfirm: () => confirmDeleteGarage(id)
    });
  };

  return (
    <div className="card">
      {/* Confirmation Modal */}
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
      
      <div className="p-4 border-b border-secondary-200">
        <h2 className="text-lg font-semibold">Garage Listings</h2>
      </div>
      
      <div className="p-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search garages by ad ID or name..."
            value={searchQuery}
            onChange={handleSearch}
            className="input pl-10 w-full md:w-64"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" size={18} />
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {filteredGarages.length === 0 ? (
              <div className="text-center py-8 bg-secondary-50 rounded-lg">
                <p className="text-secondary-500">No garages found matching your search.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary-50">
                      <th className="px-4 py-2 text-left font-medium text-secondary-700">Ad ID</th>
                      <th className="px-4 py-2 text-left font-medium text-secondary-700">Name</th>
                      <th className="px-4 py-2 text-left font-medium text-secondary-700">Location</th>
                      <th className="px-4 py-2 text-left font-medium text-secondary-700">Rating</th>
                      <th className="px-4 py-2 text-left font-medium text-secondary-700">Status</th>
                      <th className="px-4 py-2 text-left font-medium text-secondary-700">Verified</th>
                      <th className="px-4 py-2 text-left font-medium text-secondary-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGarages.map((garage) => (
                      <tr key={garage.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                        <td className="px-4 py-3 font-medium text-secondary-700">{garage.ad_id}</td>
                        <td className="px-4 py-3 font-medium">{garage.name}</td>
                        <td className="px-4 py-3 text-secondary-700">{garage.city}, {garage.district}</td>
                        <td className="px-4 py-3 text-secondary-700">
                          {garage.rating} ★ ({garage.reviewCount} reviews)
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            garage.is_active 
                              ? 'bg-success-100 text-success-800' 
                              : 'bg-error-100 text-error-800'
                          }`}>
                            {garage.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            garage.is_verified 
                              ? 'bg-primary-100 text-primary-800' 
                              : 'bg-secondary-100 text-secondary-800'
                          }`}>
                            {garage.is_verified ? 'Verified' : 'Unverified'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              className="text-primary-600 hover:text-primary-800"
                              title="View Details"
                              onClick={() => handleViewDetails(garage.id)}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className="text-primary-600 hover:text-primary-800"
                              title="Edit"
                              onClick={() => handleEditGarage(garage.id)}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className={`${garage.is_active ? 'text-error-600 hover:text-error-800' : 'text-success-600 hover:text-success-800'}`}
                              title={garage.is_active ? 'Deactivate' : 'Activate'}
                              onClick={() => handleToggleActive(garage.id)}
                            >
                              {garage.is_active ? <X size={16} /> : <Check size={16} />}
                            </button>
                            <button
                              className={`${garage.is_verified ? 'text-error-600 hover:text-error-800' : 'text-primary-600 hover:text-primary-800'}`}
                              title={garage.is_verified ? 'Remove Verification' : 'Verify Garage'}
                              onClick={() => handleToggleVerified(garage.id)}
                            >
                              <Shield size={16} />
                            </button>
                            <button
                              className="text-error-600 hover:text-error-800"
                              title="Delete"
                              onClick={() => handleDeleteGarage(garage.id)}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GarageListingsTab; 