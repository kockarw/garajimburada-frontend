import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Wrench, MapPin, Phone, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wrench size={24} className="text-primary-500" />
              <h3 className="text-lg font-bold text-white">GarajımBurada</h3>
            </div>
            <p className="text-secondary-300 mb-4">
              Turkey's premier garage finding platform. Discover the nearest professional garages for your vehicle repair, maintenance, and modification services.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-secondary-400 hover:text-primary-500 transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="mailto:info@garajimburada.com" className="text-secondary-400 hover:text-primary-500 transition-colors" aria-label="Email">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-secondary-300 hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/add-garage" className="text-secondary-300 hover:text-primary-500 transition-colors">
                  Add Garage
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-secondary-300 hover:text-primary-500 transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-secondary-300 hover:text-primary-500 transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Garage Services</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary-300 hover:text-primary-500 transition-colors">
                  Tuning
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-primary-500 transition-colors">
                  Maintenance
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-primary-500 transition-colors">
                  Custom Modification
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-primary-500 transition-colors">
                  Body Work
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-primary-500 transition-colors">
                  Electrical Repairs
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact</h4>
            <address className="not-italic text-secondary-300 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary-500 shrink-0" />
                <p>Ataturk District, Technology Street No:12, Istanbul</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-primary-500 shrink-0" />
                <p>+90 (212) 456 7890</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-primary-500 shrink-0" />
                <p>info@garajimburada.com</p>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-primary-500 shrink-0" />
                <p>Monday - Saturday: 09:00 - 18:00</p>
              </div>
            </address>
          </div>
        </div>
        
        <div className="border-t border-secondary-700 mt-8 pt-8 text-center text-secondary-400">
          <p>&copy; {new Date().getFullYear()} GarajimBurada. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;