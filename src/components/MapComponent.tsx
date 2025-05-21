import React from 'react';
import { MapPin } from 'lucide-react';

interface MapComponentProps {
  address: string;
  city?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  height?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  address, 
  city = '', 
  country = 'Turkey',
  coordinates,
  height = '400px' 
}) => {
  // Use coordinates if available, otherwise use the address
  let mapUrl;
  
  if (coordinates) {
    // When using coordinates, we need to add a marker to the map
    mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${coordinates.lat},${coordinates.lng}&center=${coordinates.lat},${coordinates.lng}&zoom=16`;
  } else {
    const formattedAddress = encodeURIComponent(`${address}, ${city}, ${country}`);
    mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${formattedAddress}`;
  }
  
  // For directions and search links
  const formattedAddress = encodeURIComponent(`${address}, ${city}, ${country}`);
  
  return (
    <div className="map-container">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <MapPin size={20} className="text-primary-600" />
        <span>Garage Location</span>
      </h2>
      
      <div className="mb-4 text-sm text-secondary-600">
        <p>{address}, {city}, {country}</p>
      </div>
      
      <div className="relative rounded-lg overflow-hidden shadow-md" style={{ height }}>
        <iframe
          title="Garage Location Map"
          width="100%"
          height="100%"
          frameBorder="0"
          src={mapUrl}
          allowFullScreen
        ></iframe>
      </div>
      
      <div className="mt-4 flex gap-2">
        <a 
          href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates ? `${coordinates.lat},${coordinates.lng}` : formattedAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary flex-1 text-sm"
        >
          Get Directions
        </a>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${coordinates ? `${coordinates.lat},${coordinates.lng}` : formattedAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary flex-1 text-sm"
        >
          View Larger Map
        </a>
      </div>
    </div>
  );
};

export default MapComponent; 