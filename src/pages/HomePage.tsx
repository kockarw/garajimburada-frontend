import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, X, ChevronLeft, ChevronRight, Star, Calendar, MapPin } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import GarageCard from '../components/GarageCard';
import { 
  serviceOptions, 
  cityOptions, 
  districtOptions, 
  sortOptions 
} from '../mockdata/filters';
import garageService, { GarageResponse } from '../services/garage.service';

const HomePage: React.FC = () => {
  const [garages, setGarages] = useState<GarageResponse[]>([]);
  const [filteredGarages, setFilteredGarages] = useState<GarageResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const garagesPerPage = 10;

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [serviceFilter, setServiceFilter] = useState('All Services');
  const [ratingFilter, setRatingFilter] = useState(0);
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [districtFilter, setDistrictFilter] = useState('All Districts');
  const [sortBy, setSortBy] = useState('rating');
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    const fetchGarages = async () => {
      setLoading(true);
      try {
        const data = await garageService.getAllGarages();
        setGarages(data);
        setFilteredGarages(data);
      } catch (error) {
        console.error('Error fetching garages:', error);
        showToast('Failed to load garages', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGarages();
  }, [showToast]);

  useEffect(() => {
    // Apply filters whenever filter states change
    let results = [...garages];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(garage => 
        garage.name.toLowerCase().includes(query) || 
        garage.description.toLowerCase().includes(query)
      );
    }
    
    // Apply service filter
    if (serviceFilter !== 'All Services') {
      results = results.filter(garage => 
        garage.services.includes(serviceFilter)
      );
    }
    
    // Apply rating filter
    if (ratingFilter > 0) {
      results = results.filter(garage => 
        garage.rating >= ratingFilter
      );
    }
    
    // Apply city filter
    if (cityFilter !== 'All Cities') {
      results = results.filter(garage => 
        garage.city === cityFilter
      );
      
      // Apply district filter only if a specific city is selected
      if (districtFilter !== 'All Districts') {
        results = results.filter(garage => 
          garage.district === districtFilter
        );
      }
    }
    
    // Apply sorting
    results = results.sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'reviews') {
        return b.reviewCount - a.reviewCount;
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    
    setFilteredGarages(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [garages, searchQuery, serviceFilter, ratingFilter, cityFilter, districtFilter, sortBy]);

  // Get current garages for pagination
  const indexOfLastGarage = currentPage * garagesPerPage;
  const indexOfFirstGarage = indexOfLastGarage - garagesPerPage;
  const currentGarages = filteredGarages.slice(indexOfFirstGarage, indexOfLastGarage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredGarages.length / garagesPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleServiceFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setServiceFilter(e.target.value);
  };

  const handleRatingFilterChange = (value: number) => {
    setRatingFilter(value === ratingFilter ? 0 : value);
  };

  const handleCityFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const city = e.target.value;
    setCityFilter(city);
    setDistrictFilter('All Districts');
  };

  const handleDistrictFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrictFilter(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setServiceFilter('All Services');
    setRatingFilter(0);
    setCityFilter('All Cities');
    setDistrictFilter('All Districts');
    setSortBy('rating');
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredGarages.length / garagesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      {/* Full-width intro section */}
      <section className="relative mb-12 w-full">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
            filter: "brightness(0.6)"
          }}
        />
        
        {/* Content on top of the background */}
        <div className="relative py-24 px-6 text-center text-white max-w-7xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary-500 drop-shadow-lg">GarajımBurada</h1>
          <p className="text-xl max-w-3xl mx-auto mb-10 drop-shadow-md">
            Discover professional garages offering the best tuning and modification services for your car.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto relative mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by garage name or keyword..."
                className="input w-full pl-12 py-4 text-base border-white shadow-lg text-secondary-800"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search size={24} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" />
            </div>
          </div>
          
          {/* Mobile Filter Toggle */}
          <div className="md:hidden max-w-sm mx-auto">
            <button 
              className="btn btn-secondary w-full flex items-center justify-center gap-2 shadow-lg"
              onClick={toggleFilters}
            >
              <Filter size={18} />
              <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
          </div>
          </div>
        </section>

      <div className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filters - Desktop (left side) and Mobile (expandable) */}
            <div className={`md:block ${showFilters ? 'block' : 'hidden'}`}>
              <div className="card p-6 sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Filters</h2>
                  <button 
                    className="text-primary-600 text-sm font-medium hover:underline"
                    onClick={resetFilters}
                  >
                    Reset All
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Service Type */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Type of Service
                    </label>
                    <select 
                      className="input w-full" 
                      value={serviceFilter}
                      onChange={handleServiceFilterChange}
                    >
                      {serviceOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Minimum Rating - Stars instead of numbers */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Minimum Rating
                    </label>
                    <div className="flex gap-1 items-center">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          className="flex items-center justify-center p-1 transition-colors"
                          onClick={() => handleRatingFilterChange(rating)}
                          onMouseEnter={() => setHoveredRating(rating)}
                          onMouseLeave={() => setHoveredRating(0)}
                          title={`${rating} stars`}
                        >
                          <Star 
                            size={24} 
                            fill={rating <= (hoveredRating || ratingFilter) ? "#FBBF24" : "none"}
                            stroke={rating <= (hoveredRating || ratingFilter) ? "#FBBF24" : "#9CA3AF"}
                            className="transition-colors"
                          />
                        </button>
                      ))}
                      {ratingFilter > 0 && (
                        <button 
                          className="ml-2 text-xs text-secondary-500 hover:text-secondary-700"
                          onClick={() => setRatingFilter(0)}
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    {ratingFilter > 0 && (
                      <p className="text-xs text-secondary-500 mt-1">
                        Showing garages with {ratingFilter}+ star ratings
                      </p>
                    )}
                  </div>
                  
                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      City
                    </label>
                    <select 
                      className="input w-full mb-4" 
                      value={cityFilter}
                      onChange={handleCityFilterChange}
                    >
                      {cityOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      District
                    </label>
                    <select 
                      className="input w-full" 
                      value={districtFilter}
                      onChange={handleDistrictFilterChange}
                      disabled={cityFilter === 'All Cities'}
                    >
                      {districtOptions[cityFilter as keyof typeof districtOptions]?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Sort By
                    </label>
                    <select 
                      className="input w-full" 
                      value={sortBy}
                      onChange={handleSortChange}
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Garage Listings */}
            <div className="md:col-span-3">
              {/* Results Summary */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-secondary-600">
                  {filteredGarages.length} {filteredGarages.length === 1 ? 'garage' : 'garages'} found
                  {filteredGarages.length > 0 && `, showing ${indexOfFirstGarage + 1}-${Math.min(indexOfLastGarage, filteredGarages.length)} of ${filteredGarages.length}`}
                </p>
                
                {/* Sort By - Mobile Only */}
                <div className="md:hidden">
                  <select 
                    className="input" 
                    value={sortBy}
                    onChange={handleSortChange}
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
                <div className="space-y-6">
                  {filteredGarages.length > 0 ? (
                    <div>
                      {/* Column Headers */}
                      <div className="flex items-center px-4 py-3 bg-secondary-100 rounded-t-lg font-medium">
                        <div className="w-1/6 min-w-[120px] mr-4">Image</div>
                        {/* Vertical Divider */}
                        <div className="h-8 border-l border-secondary-300 mr-4"></div>
                        <div className="w-1/6 mr-4">Services</div>
                        {/* Vertical Divider */}
                        <div className="h-8 border-l border-secondary-300 mr-4"></div>
                        <div className="w-1/6 mr-4">Garage Name</div>
                        {/* Vertical Divider */}
                        <div className="h-8 border-l border-secondary-300 mr-4"></div>
                        <div className="w-1/6 mr-4">Description</div>
                        {/* Vertical Divider */}
                        <div className="h-8 border-l border-secondary-300 mr-4"></div>
                        <div className="w-1/8 mr-4 flex items-center">
                          Listing Date
                        </div>
                        {/* Vertical Divider */}
                        <div className="h-8 border-l border-secondary-300 mr-4"></div>
                        <div className="w-1/12 flex items-center">
                          <MapPin size={16} className="mr-2" />
                          Location
                        </div>
                      </div>
                      
                      {/* Garage Cards */}
                      <div className="space-y-6 mt-4">
                        {currentGarages.map((garage) => (
                          <GarageCard key={garage.id} garage={garage} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-secondary-50 rounded-lg">
                      <p className="text-lg text-secondary-500 mb-4">No garages found.</p>
                      <button
                        onClick={resetFilters}
                        className="btn btn-primary"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}

                  {/* Pagination */}
                  {filteredGarages.length > garagesPerPage && (
                    <div className="mt-8 flex justify-center">
                      <nav className="flex items-center gap-1">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className={`p-2 rounded-md ${
                            currentPage === 1
                              ? 'text-secondary-400 cursor-not-allowed'
                              : 'text-secondary-700 hover:bg-secondary-100'
                          }`}
                        >
                          <ChevronLeft size={20} />
                        </button>
                        
                        {/* Show all page numbers if 7 or fewer, otherwise show a subset with ellipsis */}
                        {pageNumbers.length <= 7 ? (
                          pageNumbers.map(number => (
                            <button
                              key={number}
                              onClick={() => paginate(number)}
                              className={`w-10 h-10 rounded-md ${
                                currentPage === number
                                  ? 'bg-primary-600 text-white'
                                  : 'text-secondary-700 hover:bg-secondary-100'
                              }`}
                            >
                              {number}
                            </button>
                ))
              ) : (
                          <>
                            {/* First page */}
                            <button
                              onClick={() => paginate(1)}
                              className={`w-10 h-10 rounded-md ${
                                currentPage === 1
                                  ? 'bg-primary-600 text-white'
                                  : 'text-secondary-700 hover:bg-secondary-100'
                              }`}
                            >
                              1
                            </button>
                            
                            {/* Ellipsis for pages before current if not showing first few pages */}
                            {currentPage > 3 && (
                              <span className="px-2">...</span>
                            )}
                            
                            {/* Pages around current page */}
                            {pageNumbers
                              .filter(number => 
                                number !== 1 && 
                                number !== pageNumbers.length && 
                                (
                                  (currentPage <= 4 && number <= 5) || 
                                  (currentPage >= pageNumbers.length - 3 && number >= pageNumbers.length - 4) ||
                                  (number >= currentPage - 1 && number <= currentPage + 1)
                                )
                              )
                              .map(number => (
                                <button
                                  key={number}
                                  onClick={() => paginate(number)}
                                  className={`w-10 h-10 rounded-md ${
                                    currentPage === number
                                      ? 'bg-primary-600 text-white'
                                      : 'text-secondary-700 hover:bg-secondary-100'
                                  }`}
                                >
                                  {number}
                                </button>
                              ))
                            }
                            
                            {/* Ellipsis for pages after current if not showing last few pages */}
                            {currentPage < pageNumbers.length - 2 && (
                              <span className="px-2">...</span>
                            )}
                            
                            {/* Last page */}
                            <button
                              onClick={() => paginate(pageNumbers.length)}
                              className={`w-10 h-10 rounded-md ${
                                currentPage === pageNumbers.length
                                  ? 'bg-primary-600 text-white'
                                  : 'text-secondary-700 hover:bg-secondary-100'
                              }`}
                            >
                              {pageNumbers.length}
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={nextPage}
                          disabled={currentPage === Math.ceil(filteredGarages.length / garagesPerPage)}
                          className={`p-2 rounded-md ${
                            currentPage === Math.ceil(filteredGarages.length / garagesPerPage)
                              ? 'text-secondary-400 cursor-not-allowed'
                              : 'text-secondary-700 hover:bg-secondary-100'
                          }`}
                        >
                          <ChevronRight size={20} />
                        </button>
                      </nav>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          </div>
      </div>
    </div>
  );
};

export default HomePage;