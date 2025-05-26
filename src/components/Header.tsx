import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Shield, Wrench, ChevronDown, Plus, Settings, Home, Warehouse } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useScrollToTop } from '../hooks/useScrollToTop';

const Header: React.FC = () => {
  useScrollToTop();
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
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Warehouse size={16} />
                          <span>My Garage Ads</span>
                        </Link>
                        <Link 
                          to="/account" 
                          className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <Settings size={16} />
                          <span>My Account</span>
                        </Link>
                        <div className="border-t border-secondary-200 my-1"></div>
                        <button 
                          onClick={() => {
                            setIsDropdownOpen(false);
                            handleSignOutClick();
                          }}
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
        <div 
          className={`md:hidden fixed inset-x-0 top-0 h-[50vh] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {/* Mobile Menu Header */}
          <div className="sticky top-0 bg-white border-b border-secondary-100 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench size={20} className="text-primary-600" />
              <span className="text-lg font-semibold text-primary-600">GarajımBurada</span>
            </div>
            <button 
              onClick={toggleMenu}
              className="p-2 hover:bg-secondary-50 rounded-full transition-colors duration-200"
            >
              <X size={24} className="text-secondary-600" />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="p-4 overflow-y-auto h-[calc(50vh-60px)]">
            {user ? (
              <>
                {/* User Profile Section */}
                <div className="bg-secondary-50 rounded-xl p-4 mb-6 transform transition-all duration-300 delay-100 ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                }">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xl font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-secondary-900">{user.username}</div>
                        <div className="text-sm text-secondary-500">Üye</div>
                      </div>
                    </div>
                    <button 
                      onClick={handleSignOutClick}
                      className="btn btn-error text-sm py-2 transition-colors duration-200"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mb-6 transform transition-all duration-300 delay-150 ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                }">
                  <Link 
                    to="/add-garage" 
                    className="btn btn-primary flex items-center justify-center gap-2 py-3 transition-colors duration-200 w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus size={18} />
                    <span>Garaj Ekle</span>
                  </Link>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1 transform transition-all duration-300 delay-200 ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                }">
                  <Link 
                    to="/" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-50 text-secondary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home size={20} />
                    <span>Ana Sayfa</span>
                  </Link>

                  <Link 
                    to="/my-garage-ads" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-50 text-secondary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Warehouse size={20} />
                    <span>Garajlarım</span>
                  </Link>

                  {user.is_admin && (
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-50 text-secondary-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield size={20} />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <Link 
                    to="/account" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-50 text-secondary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings size={20} />
                    <span>Hesap Ayarları</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Guest Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6 transform transition-all duration-300 delay-100 ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                }">
                  <Link 
                    to="/login" 
                    className="btn btn-primary flex items-center justify-center gap-2 py-3 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    <span>Giriş Yap</span>
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-secondary flex items-center justify-center gap-2 py-3 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus size={18} />
                    <span>Kayıt Ol</span>
                  </Link>
                </div>

                {/* Guest Navigation */}
                <div className="space-y-1 transform transition-all duration-300 delay-150 ${
                  isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                }">
                  <Link 
                    to="/" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary-50 text-secondary-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home size={20} />
                    <span>Ana Sayfa</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Overlay */}
        <div 
          className={`md:hidden fixed inset-0 bg-black transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleMenu}
        />
      </header>

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-xl font-semibold mb-4">Çıkış Onayı</h3>
            <p className="mb-6 text-secondary-600">
              Hesabınızdan çıkış yapmak istediğinize emin misiniz?
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={handleSignOutCancel}
                className="btn btn-secondary"
              >
                İptal
              </button>
              <button 
                onClick={handleSignOutConfirm}
                className="btn btn-primary bg-error-600 hover:bg-error-700 border-error-600 hover:border-error-700"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;