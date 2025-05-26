import React, { useState, useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Edit, Trash, Eye, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { garageService, GarageStatus } from '../services/garage.service';

// Delete confirmation modal interface
interface DeleteModalProps {
  isOpen: boolean;
  garage: any;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({ isOpen, garage, onConfirm, onCancel }) => {
  if (!isOpen || !garage) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-secondary-800 mb-2">Confirm Deletion</h3>
        <p className="text-secondary-600 mb-6">
          Are you sure you want to delete <span className="font-medium">{garage.name}</span>?
          <br />This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="btn bg-error-600 hover:bg-error-700 text-white focus:ring-error-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const MyGarageAdsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userGarages, setUserGarages] = useState<any[]>([]);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    inactive: 0
  });
  const [statusFilter, setStatusFilter] = useState<GarageStatus | 'all'>('all');
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, garage: any | null}>({
    isOpen: false,
    garage: null
  });

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Load garages based on status filter
  useEffect(() => {
    const loadGarages = async () => {
      try {
        setLoading(true);
        const response = await garageService.getUserGarages(statusFilter === 'all' ? undefined : statusFilter);
        setUserGarages(response.garages);
        setStatusCounts(response.statusCounts);
      } catch (error) {
        showToast('Failed to load garages', 'error');
        console.error('Error loading garages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGarages();
  }, [statusFilter]);

  // Parse the query parameter for status filter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get('status') as GarageStatus | null;
    
    if (statusParam && ['pending', 'approved', 'rejected', 'inactive'].includes(statusParam)) {
      setStatusFilter(statusParam);
    }
  }, [location.search]);

  const openDeleteModal = (garage: any) => {
    setDeleteModal({
      isOpen: true,
      garage: garage
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      garage: null
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.garage) return;
    
    try {
      setLoading(true);
      await garageService.deleteGarage(deleteModal.garage.id);
      
      // Refresh garage list
      const response = await garageService.getUserGarages(statusFilter === 'all' ? undefined : statusFilter);
      setUserGarages(response.garages);
      setStatusCounts(response.statusCounts);
      
      showToast('Garage has been deleted successfully', 'success');
      closeDeleteModal();
    } catch (error) {
      showToast('Failed to delete garage', 'error');
      console.error('Error deleting garage:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: GarageStatus) => {
    try {
      setLoading(true);
      await garageService.updateGarageStatus(id, newStatus);
      
      // Refresh garage list
      const response = await garageService.getUserGarages(statusFilter === 'all' ? undefined : statusFilter);
      setUserGarages(response.garages);
      setStatusCounts(response.statusCounts);
      
      if (newStatus === 'pending') {
        showToast(
          'Your garage listing request has been resubmitted successfully. Average approval time is 30-60 minutes.',
          'success',
          true,
          'Resubmission Received'
        );
        navigate('/my-garage-ads?status=pending');
      } else {
        showToast(`Garage status has been updated to ${newStatus}`, 'success');
        navigate(`/my-garage-ads?status=${newStatus}`);
      }
    } catch (error) {
      showToast('Failed to update garage status', 'error');
      console.error('Error updating garage status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter garages based on selected status
  const filteredGarages = statusFilter === 'all' 
    ? userGarages 
    : userGarages.filter(garage => garage.status === statusFilter);

  // Count garages by status for tabs
  const countByStatus = {
    all: userGarages.length,
    approved: userGarages.filter(g => g.status === 'approved').length,
    pending: userGarages.filter(g => g.status === 'pending').length,
    rejected: userGarages.filter(g => g.status === 'rejected').length,
    inactive: userGarages.filter(g => g.status === 'inactive').length
  };

  const getStatusColor = (status: GarageStatus) => {
    switch (status) {
      case 'approved': return 'bg-success-50 text-success-700 border-success-200';
      case 'pending': return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'rejected': return 'bg-error-50 text-error-700 border-error-200';
      case 'inactive': return 'bg-secondary-50 text-secondary-700 border-secondary-200';
    }
  };

  const getStatusIcon = (status: GarageStatus) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} className="text-success-600" />;
      case 'pending': return <Clock size={16} className="text-warning-600" />;
      case 'rejected': return <XCircle size={16} className="text-error-600" />;
      case 'inactive': return <AlertCircle size={16} className="text-secondary-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="container py-8">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal 
        isOpen={deleteModal.isOpen}
        garage={deleteModal.garage}
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
      />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Garage Advertisements</h1>
          <p className="text-secondary-600 mt-2">Manage all your garage listings in one place</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <div className="grid grid-cols-5 gap-1 md:gap-2">
          <Link
            to="/my-garage-ads"
            className={`flex flex-col items-center justify-center px-2 py-2 rounded-md text-xs md:text-sm font-medium ${
              statusFilter === 'all' 
                ? 'bg-primary-100 text-primary-800' 
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
            onClick={() => setStatusFilter('all')}
          >
            <span>All</span>
            <span className="text-xs opacity-75">({countByStatus.all})</span>
          </Link>
          <Link
            to="/my-garage-ads?status=approved"
            className={`flex flex-col items-center justify-center px-2 py-2 rounded-md text-xs md:text-sm font-medium ${
              statusFilter === 'approved' 
                ? 'bg-success-100 text-success-800' 
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
            onClick={() => setStatusFilter('approved')}
          >
            <span>Approved</span>
            <span className="text-xs opacity-75">({countByStatus.approved})</span>
          </Link>
          <Link
            to="/my-garage-ads?status=pending"
            className={`flex flex-col items-center justify-center px-2 py-2 rounded-md text-xs md:text-sm font-medium ${
              statusFilter === 'pending' 
                ? 'bg-warning-100 text-warning-800' 
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
            onClick={() => setStatusFilter('pending')}
          >
            <span>Pending</span>
            <span className="text-xs opacity-75">({countByStatus.pending})</span>
          </Link>
          <Link
            to="/my-garage-ads?status=rejected"
            className={`flex flex-col items-center justify-center px-2 py-2 rounded-md text-xs md:text-sm font-medium ${
              statusFilter === 'rejected' 
                ? 'bg-error-100 text-error-800' 
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
            onClick={() => setStatusFilter('rejected')}
          >
            <span>Rejected</span>
            <span className="text-xs opacity-75">({countByStatus.rejected})</span>
          </Link>
          <Link
            to="/my-garage-ads?status=inactive"
            className={`flex flex-col items-center justify-center px-2 py-2 rounded-md text-xs md:text-sm font-medium ${
              statusFilter === 'inactive' 
                ? 'bg-secondary-200 text-secondary-800' 
                : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
            }`}
            onClick={() => setStatusFilter('inactive')}
          >
            <span>Inactive</span>
            <span className="text-xs opacity-75">({countByStatus.inactive})</span>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {filteredGarages.length === 0 ? (
            <div className="card p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-secondary-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Garage Advertisements Found</h2>
              <p className="text-secondary-600">
                {statusFilter === 'all' 
                  ? "You haven't created any garage advertisements yet." 
                  : `You don't have any garage advertisements with '${statusFilter}' status.`}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredGarages.map(garage => (
                <div 
                  key={garage.id} 
                  className="card overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => navigate(`/garage/${garage.id}`)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4">
                    {/* Garage image */}
                    <div className="md:col-span-1 h-48 md:h-full">
                      <img 
                        src={garage.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} 
                        alt={garage.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Garage details */}
                    <div className="p-6 md:col-span-3">
                      <div className="flex flex-col md:flex-row justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold">{garage.name}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 border ${getStatusColor(garage.status)}`}>
                              {getStatusIcon(garage.status)}
                              <span className="capitalize">{garage.status}</span>
                            </span>
                          </div>
                          <p className="text-sm text-secondary-500">
                            Advert ID: {garage.ad_id} • Created on {formatDate(garage.create_time)}
                          </p>
                        </div>
                        <div className="flex gap-2 mt-4 md:mt-0">
                          {garage.status !== 'approved' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                navigate(`/edit-garage/${garage.id}`);
                              }} 
                              className="btn btn-primary btn-sm flex items-center gap-1"
                              title="Edit Garage"
                            >
                              <Edit size={16} />
                              <span className="hidden sm:inline">Edit</span>
                            </button>
                          )}
                          <button 
                            className="btn btn-secondary btn-sm flex items-center gap-1 text-error-600 hover:bg-error-50"
                            title="Delete Garage"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              openDeleteModal(garage);
                            }}
                          >
                            <Trash size={16} />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-secondary-700 mb-4 line-clamp-2">{garage.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {garage.services.map((service: string, index: number) => (
                          <span 
                            key={index} 
                            className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                      
                      {/* Status actions */}
                      {garage.status === 'approved' && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-200">
                          <div className="text-sm text-secondary-600">
                            <span className="font-medium">Active and Visible</span> - Your garage is live and can be found by users
                          </div>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              handleStatusChange(garage.id, 'inactive');
                            }}
                          >
                            Set as Inactive
                          </button>
                        </div>
                      )}
                      
                      {garage.status === 'inactive' && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-200">
                          <div className="text-sm text-secondary-600">
                            <span className="font-medium">Currently Inactive</span> - Your garage is not visible to users
                          </div>
                          <button 
                            className="btn btn-primary btn-sm"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent card click
                              handleStatusChange(garage.id, 'approved');
                            }}
                          >
                            Activate Listing
                          </button>
                        </div>
                      )}
                      
                      {garage.status === 'pending' && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-200">
                          <div className="text-sm text-warning-600">
                            <span className="font-medium">Pending Approval</span> - Your listing is being reviewed by our team
                          </div>
                          <span className="flex items-center gap-1 bg-warning-50 text-warning-700 px-3 py-1.5 rounded-md border border-warning-200 text-sm font-medium">
                            <Clock size={16} />
                            Typically takes 30-60 minutes
                          </span>
                        </div>
                      )}
                      
                      {garage.status === 'rejected' && (
                        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-secondary-200">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-error-600">
                              <span className="font-medium">Rejected</span> - Your listing requires changes before it can be approved
                            </div>
                            <button 
                              className="btn btn-primary btn-sm"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent card click
                                handleStatusChange(garage.id, 'pending');
                              }}
                            >
                              Resubmit
                            </button>
                          </div>
                          {garage.rejection_reason && (
                            <div className="bg-error-50 p-3 rounded-md text-sm text-error-700 border border-error-200">
                              <strong>Reason:</strong> {garage.rejection_reason}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyGarageAdsPage; 