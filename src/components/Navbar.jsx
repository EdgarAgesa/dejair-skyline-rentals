
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-dejair-700">Dejair</span>
              <span className="text-2xl font-light text-dejair-500">Skyline</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-gray-700 hover:text-dejair-600 font-medium">Home</Link>
            <Link to="/helicopters" className="text-gray-700 hover:text-dejair-600 font-medium">Helicopters</Link>
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="flex items-center text-gray-700 hover:text-dejair-600 font-medium"
              >
                <span>Services</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-1 z-50">
                  <Link 
                    to="/contact-admin" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-dejair-50"
                  >
                    Custom Pricing
                  </Link>
                  <Link 
                    to="/user-dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-dejair-50"
                  >
                    My Bookings
                  </Link>
                </div>
              )}
            </div>
            <Link to="/login" className="flex items-center text-dejair-600 hover:text-dejair-800 font-medium">
              <LogIn className="mr-1 h-4 w-4" />
              <span>Sign In</span>
            </Link>
            <Link to="/signup">
              <Button className="bg-dejair-600 hover:bg-dejair-700">
                Get Started
              </Button>
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-dejair-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-dejair-50">Home</Link>
            <Link to="/helicopters" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-dejair-50">Helicopters</Link>
            <Link to="/contact-admin" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-dejair-50">Custom Pricing</Link>
            <Link to="/user-dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-dejair-50">My Bookings</Link>
            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-dejair-50">Sign In</Link>
            <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium bg-dejair-600 text-white hover:bg-dejair-700">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
