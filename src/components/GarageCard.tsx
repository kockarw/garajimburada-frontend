import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Wrench, Calendar, ChevronRight, Shield, Check } from 'lucide-react';
import { GarageResponse } from '../services/garage.service';
import { useAuth } from '../contexts/AuthContext';

// Define a collection of reliable fallback garage images
const fallbackImages = [
  'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1597766353939-79f992f636f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1562009910-525375d7e966?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
];

interface GarageCardProps {
  garage: GarageResponse;
}

const GarageCard: React.FC<GarageCardProps> = ({ garage }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get a deterministic fallback image based on garage ID
  const getFallbackImage = (id: string) => {
    // Use the last character of the ID to select a fallback image
    const idNum = parseInt(id.slice(-1), 10) || 0;
    const index = idNum % fallbackImages.length;
    return fallbackImages[index];
  };
  
  // Use the provided image_url or select a fallback image
  const backgroundImage = garage.image_url || getFallbackImage(garage.id);
  
  // Format the creation date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default behavior
    navigate(`/garage/${garage.id}`);
  };
  
  return (
    <div 
      className="card overflow-hidden mb-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Desktop Layout */}
      <div className="hidden md:flex items-center h-full p-4">
        {/* Image Section */}
        <div className="w-1/6 min-w-[120px] h-24 relative mr-4">
          <div 
            className="absolute inset-0 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute bottom-1 left-1 bg-black/50 rounded-full px-1.5 py-0.5 flex items-center text-white">
            <div className="flex mr-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  className={`${
                    star <= Math.round(garage.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-400'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-medium">
              {garage.rating.toFixed(1)}
            </span>
          </div>
        </div>
        
        <div className="h-24 border-l border-secondary-200 mr-4"></div>
        
        <div className="w-1/6 flex flex-col mr-4">
          <div className="flex flex-col gap-1">
            {garage.services && garage.services.slice(0, 3).map((service, index) => (
              <span 
                key={index} 
                className="bg-primary-50 text-primary-700 text-xs px-2 py-0.5 rounded-full flex items-center"
              >
                <Wrench size={12} className="mr-1" />
                {service}
              </span>
            ))}
            {garage.services && garage.services.length > 3 && (
              <span className="text-xs text-secondary-500">+{garage.services.length - 3} more</span>
            )}
          </div>
        </div>
        
        <div className="h-24 border-l border-secondary-200 mr-4"></div>
        
        <div className="w-1/6 mr-4">
          <h3 className="text-base font-semibold text-secondary-900 flex items-center gap-1.5">
            {garage.is_verified && (
              <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
            )}
            {garage.name}
          </h3>
          <div className="text-xs text-secondary-500 mt-1">
            ADVERT NO: {garage.ad_id}
          </div>
        </div>
        
        <div className="h-24 border-l border-secondary-200 mr-4"></div>
        
        <div className="w-1/6 mr-4">
          <p className="text-sm text-secondary-600 line-clamp-2">{garage.description}</p>
        </div>
        
        <div className="h-24 border-l border-secondary-200 mr-4"></div>
        
        <div className="w-1/8 flex items-center mr-4">
          <Calendar size={16} className="text-secondary-400 mr-2" />
          <div className="text-xs text-secondary-500">
            {formatDate(garage.create_time)}
          </div>
        </div>
        
        <div className="h-24 border-l border-secondary-200 mr-4"></div>
        
        <div className="w-1/12 flex items-center">
          <MapPin size={16} className="text-secondary-400 mr-2" />
          <div>
            <div className="text-secondary-500 text-xs">
              {garage.city}, {garage.district}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="relative h-48 w-full">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-lg font-semibold mb-1 flex items-center gap-1.5">
              {garage.is_verified && (
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <Check size={14} className="text-white" strokeWidth={3} />
                </div>
              )}
              {garage.name}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      className={`${
                        star <= Math.round(garage.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-400'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white text-sm font-medium">
                  {garage.rating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center text-white text-sm">
                <MapPin size={14} className="mr-1" />
                {garage.city}
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {garage.services && garage.services.slice(0, 3).map((service, index) => (
              <span 
                key={index} 
                className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full flex items-center"
              >
                <Wrench size={12} className="mr-1" />
                {service}
              </span>
            ))}
            {garage.services && garage.services.length > 3 && (
              <span className="text-xs text-secondary-500 flex items-center">
                +{garage.services.length - 3} more
              </span>
            )}
          </div>
          
          <p className="text-sm text-secondary-600 line-clamp-2 mb-3">
            {garage.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-secondary-500">
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              {formatDate(garage.create_time)}
            </div>
            <div>
              ADVERT NO: {garage.ad_id}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GarageCard;
