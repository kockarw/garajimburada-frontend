import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Shield, Wrench, ChevronDown, Plus, Settings, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOutClick = () => {
    setShowSignOutModal(true);
  };

  const handleSignOutConfirm = async () => {
    await signOut();
    setShowSignOutModal(false);
    navigate('/login');
  };

  const handleSignOutCancel = () => {
    setShowSignOutModal(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const headerClasses = hasScrolled
    ? "bg-white bg-opacity-60 backdrop-blur-sm shadow-sm sticky top-0 z-50 transition-all duration-300"
    : "bg-white shadow-sm sticky top-0 z-50 transition-all duration-300";

  return (
    <>
      <header className={headerClasses}>
        <div className="container py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Wrench size={24} className="text-primary-600" />
            <span className="text-xl font-bold text-primary-600">GarajımBurada</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            
            <div className="flex items-center ml-4 gap-2">
              {user ? (
                <div className="flex items-center gap-4">
                  {user.is_admin && (
                    <Link 
                      to="/admin" 
                      className="btn btn-secondary flex items-center gap-1"
                    >
                      <Shield size={16} />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  {/* User Account Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={toggleDropdown}
                      className="flex items-center gap-2 bg-secondary-100 hover:bg-secondary-200 transition-colors rounded-full py-2 px-4"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-secondary-700 font-medium">{user.username}</span>
                      <ChevronDown size={16} className={`text-secondary-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-secondary-200">
                        <Link 
                          to="/my-garage-ads" 
                          className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        >
                          <Home size={16} />
                          <span>My Garage Ads</span>
                        </Link>
                        <Link 
                          to="/account" 
                          className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                        >
                          <Settings size={16} />
                          <span>My Account</span>
                        </Link>
                        <div className="border-t border-secondary-200 my-1"></div>
                        <button 
                          onClick={handleSignOutClick}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-error-600 hover:bg-secondary-50 w-full text-left"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Add Garage Button for logged in users */}
                  <Link 
                    to="/add-garage" 
                    className="btn btn-primary flex items-center gap-1"
                  >
                    <Plus size={16} />
                    <span>Garage Advert</span>
                  </Link>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn btn-secondary">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-primary">
                    Sign Up
                  </Link>
                  {/* Add Garage Button for non-logged in users */}
                  <Link 
                    to="/login"
                    className="btn btn-primary flex items-center gap-1 ml-2"
                  >
                    <Plus size={16} />
                    <span>Garage Advert</span>
                  </Link>
                </>
              )}
            </div>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-secondary-700"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4 shadow-lg absolute w-full">
            <nav className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-secondary-700 hover:text-primary-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {user ? (
                <>
                  {user.is_admin && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-2 text-secondary-700 hover:text-primary-600 transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield size={16} />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <div className="border-t border-secondary-200 pt-4 mt-2">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.username}</span>
                    </div>

                    <Link 
                      to="/my-garage-ads" 
                      className="flex items-center gap-2 text-secondary-700 hover:text-primary-600 transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Home size={16} />
                      <span>My Garage Ads</span>
                    </Link>
                    
                    <Link 
                      to="/account" 
                      className="flex items-center gap-2 text-secondary-700 hover:text-primary-600 transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings size={16} />
                      <span>My Account</span>
                    </Link>
                    
                    {/* Add Garage Link for Mobile */}
                    <Link 
                      to="/add-garage" 
                      className="flex items-center gap-2 text-secondary-700 hover:text-primary-600 transition-colors py-2 mt-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Plus size={16} />
                      <span>Garage Advert</span>
                    </Link>
                    
                    <button 
                      onClick={handleSignOutClick}
                      className="flex items-center gap-2 text-error-600 hover:text-error-700 transition-colors py-2 mt-2"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-3 border-t border-secondary-200 pt-4 mt-2">
                  <Link 
                    to="/login" 
                    className="btn btn-secondary w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-primary w-full justify-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                  {/* Mobile Garage Advert Button for non-logged in users */}
                  <Link 
                    to="/login" 
                    className="btn btn-primary w-full justify-center flex items-center gap-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus size={16} />
                    <span>Garage Advert</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4">Sign Out Confirmation</h3>
            <p className="mb-6 text-secondary-600">
              Are you sure you want to sign out of your account?
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={handleSignOutCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleSignOutConfirm}
                className="btn btn-primary bg-error-600 hover:bg-error-700 border-error-600 hover:border-error-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;