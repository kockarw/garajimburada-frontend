import React, { useEffect, useRef } from 'react';

interface GoogleMapProps {
  address: string;
  lat?: number;
  lng?: number;
  height?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  address, 
  lat = 41.0082, // Default to Istanbul coordinates if no specific lat/lng provided
  lng = 28.9784, 
  height = '400px' 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create a script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
    script.async = true;
    script.defer = true;
    
    // Function to initialize the map
    const initMap = () => {
      if (!mapRef.current) return;
      
      // Create map
      const mapOptions = {
        center: { lat, lng },
        zoom: 15,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      };
      
      // @ts-ignore - window.google is available after script loads
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      
      // Add marker
      // @ts-ignore
      const marker = new window.google.maps.Marker({
        position: { lat, lng },
        map,
        title: address,
        animation: window.google.maps.Animation.DROP,
      });
      
      // Info window
      // @ts-ignore
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding: 8px;"><strong>${address}</strong></div>`,
      });
      
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
      
      // Open info window by default
      infoWindow.open(map, marker);
    };
    
    // Execute callback once script is loaded
    script.addEventListener('load', initMap);
    
    // Add script to document
    document.body.appendChild(script);
    
    // Clean up function
    return () => {
      document.body.removeChild(script);
    };
  }, [address, lat, lng]);
  
  return (
    <div className="google-map-container" style={{ height, width: '100%' }}>
      {/* Fallback message when API key is not provided */}
      <div ref={mapRef} style={{ height: '100%', width: '100%', position: 'relative' }}>
        <div className="absolute inset-0 flex items-center justify-center bg-secondary-100 z-10">
          <p className="text-secondary-600 text-center p-4">
            To display the actual map, replace 'YOUR_API_KEY' in the GoogleMap component with a valid Google Maps API key.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoogleMap; 