import React, { useEffect, useState, JSX } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, MapPin, Phone, Mail, Globe, MessageSquare, Calendar, Tag, ChevronRight, Info, AlertTriangle, ThumbsUp, Share2, Facebook, Twitter, Mail as MailIcon, Edit, Shield, Check, X, Trash, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import MapComponent from '../components/MapComponent';
import OwnerControls from '../components/OwnerControls';
import AdminControls from '../components/AdminControls';
import garageService, { GarageResponse } from '../services/garage.service';
import type { 
  Review as ReviewType,
  WorkingHours,
  GalleryImage 
} from '../mockdata/types';

// Add this near the top of the file, after the imports
type TabType = 'about' | 'location' | 'gallery' | 'reviews';

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

const GarageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [garage, setGarage] = useState<GarageResponse | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('about');
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
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
  
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    const fetchGarageDetails = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await garageService.getGarageById(id);
        setGarage(data);
      } catch (error: any) {
        console.error('Error fetching garage details:', error);
        showToast('Failed to load garage details', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGarageDetails();
  }, [id, showToast]);

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

  // Admin actions with modals
  const confirmToggleVerify = async () => {
    closeModal();
    try {
      // Here you would call the API to toggle verification status
      // await garageService.toggleVerified(id);
      showToast(`Garage ${garage?.is_verified ? 'unverified' : 'verified'} successfully`, 'success');
    } catch (error) {
      console.error('Error toggling verification status:', error);
      showToast('Failed to update verification status', 'error');
    }
  };

  const confirmToggleActive = async () => {
    closeModal();
    try {
      // Here you would call the API to toggle active status
      // await garageService.toggleActive(id);
      showToast(`Garage ${garage?.is_active ? 'deactivated' : 'activated'} successfully`, 'success');
    } catch (error) {
      console.error('Error toggling active status:', error);
      showToast('Failed to update active status', 'error');
    }
  };

  const confirmDelete = async () => {
    closeModal();
    try {
      if (!id) return;
      await garageService.deleteGarage(id);
      showToast('Garage deleted successfully', 'success');
      navigate('/admin/garages');
    } catch (error) {
      console.error('Error deleting garage:', error);
      showToast('Failed to delete garage', 'error');
    }
  };

  // Handlers to open modals
  const handleToggleVerify = () => {
    openConfirmModal({
      title: garage?.is_verified ? 'Remove Verification' : 'Verify Garage',
      message: garage?.is_verified 
        ? 'Are you sure you want to remove verification status from this garage? This may affect its visibility and trust.'
        : 'Are you sure you want to verify this garage? This will mark it as a trusted business.',
      confirmText: garage?.is_verified ? 'Remove Verification' : 'Verify',
      confirmButtonClass: garage?.is_verified ? 'btn-secondary' : 'btn-primary',
      onConfirm: confirmToggleVerify
    });
  };

  const handleToggleActive = () => {
    openConfirmModal({
      title: garage?.is_active ? 'Deactivate Garage' : 'Activate Garage',
      message: garage?.is_active 
        ? 'Are you sure you want to deactivate this garage? It will no longer be visible to users.'
        : 'Are you sure you want to activate this garage? It will become visible to all users.',
      confirmText: garage?.is_active ? 'Deactivate' : 'Activate',
      confirmButtonClass: garage?.is_active ? 'btn-error' : 'btn-success',
      onConfirm: confirmToggleActive
    });
  };

  const handleDelete = () => {
    openConfirmModal({
      title: 'Delete Garage',
      message: 'Are you sure you want to delete this garage? This action cannot be undone and all associated data will be permanently removed.',
      confirmText: 'Delete',
      confirmButtonClass: 'btn-error',
      onConfirm: confirmDelete
    });
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: name === 'rating' ? parseInt(value) : value,
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (!id || !user) return;
      
      // Mock creating a new review
      const newReview: ReviewType = {
        id: `${Date.now()}`,
        garage_id: id,
        user_id: user.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        created_at: new Date().toISOString(),
        profiles: {
          id: user.id,
          username: user.username,
          avatar_url: user.avatar_url
        }
      };
      
      // Here you would call the API to submit the review
      // await garageService.submitReview(newReview);
      
      showToast('Review submitted successfully', 'success');
    } catch (error) {
      console.error('Error submitting review:', error);
      showToast('Failed to submit review', 'error');
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return 'Closed';
    
    try {
      const [hours, minutes] = time.split(':');
      const dateObj = new Date();
      dateObj.setHours(parseInt(hours));
      dateObj.setMinutes(parseInt(minutes));
      
      return dateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return time;
    }
  };

  if (loading) {
    return (
      <div className="container py-16 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!garage) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Garage Not Found</h1>
        <p className="text-secondary-600">The garage you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
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
      
      {/* Owner Controls Component */}
      {user && garage?.owner && user.id === garage.owner.id && !user.is_admin && (
        <OwnerControls garageId={garage.id} />
      )}

      {/* Desktop Admin Controls Component */}
      {user?.is_admin && garage && (
        <div className="hidden lg:block">
          <AdminControls 
            garageId={garage.id}
            isVerified={garage.is_verified}
            isActive={garage.is_active}
            onToggleVerify={handleToggleVerify}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-secondary-500 mb-4">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to={`/?city=${garage.city}`} className="hover:text-primary-600">{garage.city}</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to={`/?district=${garage.district}`} className="hover:text-primary-600">{garage.district}</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-secondary-700 font-medium">{garage.name}</span>
          </div>

          {/* Titlee */}
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{garage.name}</h1>
          
          {/* Location and Ad Details */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-secondary-600 mb-6">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{garage.city} / {garage.district} / {garage.address.split(',')[0]}</span>
            </div>
            <span className="mx-1">•</span>
            <div className="flex items-center gap-1">
              <Tag size={14} />
              <span>Ad No: {garage.ad_id}</span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="mb-8">
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-2">
              <img 
                src={garage.gallery[activeImage]?.image_url || garage.image_url} 
                alt={garage.name} 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnails */}
            {garage.gallery && garage.gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {garage.gallery.map((image, index) => (
                  <button 
                    key={image.id} 
                    className={`relative rounded-md overflow-hidden w-20 h-20 flex-shrink-0 ${
                      activeImage === index ? 'ring-2 ring-primary-600' : ''
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img 
                      src={image.image_url} 
                      alt={image.alt_text} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Share This Listing */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Share2 size={18} />
              <span>Share This Listing</span>
            </h3>
            <div className="flex gap-2">
              <button className="btn btn-icon bg-blue-600 hover:bg-blue-700 text-white">
                <Facebook size={18} />
              </button>
              <button className="btn btn-icon bg-blue-400 hover:bg-blue-500 text-white">
                <Twitter size={18} />
              </button>
              <button className="btn btn-icon bg-secondary-600 hover:bg-secondary-700 text-white">
                <MailIcon size={18} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-secondary-200">
              <div className="grid grid-cols-4 gap-1 relative">
                {/* Active Tab Indicator */}
                <div 
                  className="absolute bottom-0 h-0.5 bg-primary-600 transition-transform duration-300 ease-out"
                  style={{
                    width: '25%',
                    transform: `translateX(${['about', 'location', 'gallery', 'reviews'].indexOf(activeTab) * 100}%)`
                  }}
                />
                <button
                  className={`flex flex-col items-center justify-center py-3 text-xs md:text-sm font-medium transition-colors relative ${
                    activeTab === 'about' 
                      ? 'text-primary-600' 
                      : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                  onClick={() => handleTabChange('about')}
                >
                  <span>Details</span>
                </button>
                <button
                  className={`flex flex-col items-center justify-center py-3 text-xs md:text-sm font-medium transition-colors relative ${
                    activeTab === 'location' 
                      ? 'text-primary-600' 
                      : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                  onClick={() => handleTabChange('location')}
                >
                  <span>Location</span>
                </button>
                <button
                  className={`flex flex-col items-center justify-center py-3 text-xs md:text-sm font-medium transition-colors relative ${
                    activeTab === 'gallery' 
                      ? 'text-primary-600' 
                      : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                  onClick={() => handleTabChange('gallery')}
                >
                  <span>Gallery</span>
                </button>
                <button
                  className={`flex flex-col items-center justify-center py-3 text-xs md:text-sm font-medium transition-colors relative ${
                    activeTab === 'reviews' 
                      ? 'text-primary-600' 
                      : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                  onClick={() => handleTabChange('reviews')}
                >
                  <div className="flex items-center gap-1">
                    <span>Reviews</span>
                    <span className="opacity-75">({garage.reviews.length})</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-out w-[400%]"
                  style={{
                    transform: `translateX(-${['about', 'location', 'gallery', 'reviews'].indexOf(activeTab) * 25}%)`
                  }}
                >
                  {/* About Tab */}
                  <div className="w-1/4 min-w-[25%] px-0 md:px-2">
                    <div>
                      {/* Description */}
                      <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">About {garage.name}</h2>
                        <p className="text-secondary-700 whitespace-pre-line">
                          {garage.description}
                        </p>
                      </div>
                      
                      {/* Contact Information */}
                      <div className="mb-8">
                        <h3 className="text-lg font-medium mb-3">Contact Information</h3>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Phone size={18} className="text-primary-600" />
                            <span>{garage.phone}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Mail size={18} className="text-primary-600" />
                            <span>{garage.email}</span>
                          </div>
                          {garage.website && (
                            <div className="flex items-center gap-3">
                              <Globe size={18} className="text-primary-600" />
                              <a 
                                href={garage.website.startsWith('http') ? garage.website : `https://${garage.website}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:underline"
                              >
                                {garage.website}
                              </a>
                            </div>
                          )}
                          <div className="flex items-center gap-3">
                            <MapPin size={18} className="text-primary-600" />
                            <span>{garage.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Tab */}
                  <div className="w-1/4 min-w-[25%] px-0 md:px-2">
                    <div>
                      <MapComponent 
                        address={garage.address}
                        city={garage.city} 
                        coordinates={garage.coordinates}
                        height="450px"
                      />
                    </div>
                  </div>

                  {/* Gallery Tab */}
                  <div className="w-1/4 min-w-[25%] px-0 md:px-2">
                    <div>
                      <h2 className="text-xl font-semibold mb-6">Photo Gallery</h2>
                      {garage.gallery && garage.gallery.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {garage.gallery.map((image) => (
                            <div key={image.id} className="relative rounded-lg overflow-hidden aspect-square">
                              <img 
                                src={image.image_url} 
                                alt={image.alt_text} 
                                className="w-full h-full object-cover transition-transform hover:scale-105"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 bg-secondary-50 rounded-lg">
                          <p className="text-secondary-500">No images available.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reviews Tab */}
                  <div className="w-1/4 min-w-[25%] px-0 md:px-2">
                    <div>
                      <h2 className="text-xl font-semibold mb-6">Customer Reviews</h2>
                      
                      {user && (
                        <div className="mb-8 card border border-secondary-200 p-4">
                          <h3 className="text-lg font-medium mb-4">Submit a Review</h3>
                          <form onSubmit={handleReviewSubmit}>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-secondary-700 mb-1">
                                Rating
                              </label>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <label key={star} className="cursor-pointer">
                                    <input
                                      type="radio"
                                      name="rating"
                                      value={star}
                                      checked={reviewForm.rating === star}
                                      onChange={handleReviewChange}
                                      className="sr-only"
                                    />
                                    <Star 
                                      size={24} 
                                      className={`transition-colors ${
                                        reviewForm.rating >= star 
                                          ? 'text-accent-500 fill-accent-500' 
                                          : 'text-secondary-300'
                                      }`} 
                                    />
                                  </label>
                                ))}
                              </div>
                            </div>
                            <div className="mb-4">
                              <label 
                                htmlFor="comment" 
                                className="block text-sm font-medium text-secondary-700 mb-1"
                              >
                                Comment
                              </label>
                              <textarea
                                id="comment"
                                name="comment"
                                value={reviewForm.comment}
                                onChange={handleReviewChange}
                                rows={4}
                                className="input"
                                placeholder="Share your experience..."
                                required
                              ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">
                              Submit Review
                            </button>
                          </form>
                        </div>
                      )}
                      
                      <div className="space-y-6">
                        {garage.reviews.length > 0 ? (
                          garage.reviews.map((review) => (
                            <div 
                              key={review.id} 
                              className="card border border-secondary-200 p-4"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                                    {review.profiles.username.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <h3 className="font-medium">{review.profiles.username}</h3>
                                    <div className="text-xs text-secondary-500">
                                      {new Date(review.created_at).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      size={16}
                                      className={`${
                                        review.rating >= star 
                                          ? 'text-accent-500 fill-accent-500' 
                                          : 'text-secondary-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-secondary-700">{review.comment}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 bg-secondary-50 rounded-lg">
                            <p className="text-secondary-500">No reviews yet. Be the first to leave a review!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Mobile Admin Controls */}
          {user?.is_admin && garage && (
            <div className="lg:hidden">
              <AdminControls 
                garageId={garage.id}
                isVerified={garage.is_verified}
                isActive={garage.is_active}
                onToggleVerify={handleToggleVerify}
                onToggleActive={handleToggleActive}
                onDelete={handleDelete}
              />
            </div>
          )}

          {/* Price Card */}
          <div className="card border border-secondary-200 p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary-600">Rating</h2>
              <div className="flex items-center gap-1 bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                <Star size={16} className="fill-primary-600" />
                <span className="font-semibold">{garage.rating}</span>
                <span className="text-xs">({garage.reviewCount})</span>
              </div>
            </div>

            <div className="border-t border-secondary-200 pt-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="font-medium mb-1">Ad No</div>
                  <div className="text-primary-600">{garage.ad_id}</div>
                </div>
                <div className="text-center">
                  <div className="font-medium mb-1">Published</div>
                  <div className="text-secondary-600">{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                <Phone size={18} />
                <span>{garage.phone}</span>
              </button>
              <button className="btn btn-secondary w-full flex items-center justify-center gap-2">
                <MessageSquare size={18} />
                <span>Send Message</span>
              </button>
            </div>
          </div>

          {/* Services */}
          <div className="card border border-secondary-200 p-4 mb-6">
            <h3 className="font-semibold mb-4">Services</h3>
            <div className="flex flex-wrap gap-2">
              {garage.services.map(service => (
                <span 
                  key={service} 
                  className="inline-block px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>

          {/* Working Hours Card */}
          <div className="card border border-secondary-200 p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock size={18} className="text-primary-600" />
              <span>Working Hours</span>
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Monday</span>
                <span className="text-secondary-600">
                  {garage.working_hours.monday_open 
                    ? `${formatTime(garage.working_hours.monday_open)} - ${formatTime(garage.working_hours.monday_close)}`
                    : 'Closed'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Tuesday</span>
                <span className="text-secondary-600">
                  {garage.working_hours.tuesday_open 
                    ? `${formatTime(garage.working_hours.tuesday_open)} - ${formatTime(garage.working_hours.tuesday_close)}`
                    : 'Closed'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Wednesday</span>
                <span className="text-secondary-600">
                  {garage.working_hours.wednesday_open 
                    ? `${formatTime(garage.working_hours.wednesday_open)} - ${formatTime(garage.working_hours.wednesday_close)}`
                    : 'Closed'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Thursday</span>
                <span className="text-secondary-600">
                  {garage.working_hours.thursday_open 
                    ? `${formatTime(garage.working_hours.thursday_open)} - ${formatTime(garage.working_hours.thursday_close)}`
                    : 'Closed'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Friday</span>
                <span className="text-secondary-600">
                  {garage.working_hours.friday_open 
                    ? `${formatTime(garage.working_hours.friday_open)} - ${formatTime(garage.working_hours.friday_close)}`
                    : 'Closed'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Saturday</span>
                <span className="text-secondary-600">
                  {garage.working_hours.saturday_open 
                    ? `${formatTime(garage.working_hours.saturday_open)} - ${formatTime(garage.working_hours.saturday_close)}`
                    : 'Closed'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-medium">Sunday</span>
                <span className="text-secondary-600">
                  {garage.working_hours.sunday_open 
                    ? `${formatTime(garage.working_hours.sunday_open)} - ${formatTime(garage.working_hours.sunday_close)}`
                    : 'Closed'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarageDetailPage;