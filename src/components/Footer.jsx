
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dejair-900 text-white">
      <div className="container-padding max-w-7xl mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Dejair Skyline</h3>
            <p className="text-gray-300 mb-4">
              Premium helicopter rental services for business and leisure. Experience the world from above.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/helicopters" className="text-gray-300 hover:text-white">Helicopters</Link></li>
              <li><Link to="/login" className="text-gray-300 hover:text-white">Sign In</Link></li>
              <li><Link to="/signup" className="text-gray-300 hover:text-white">Sign Up</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Aerial Tours</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Corporate Travel</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Special Events</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Custom Routes</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 text-dejair-400" />
                <span className="text-gray-300">123 Aviation Way, Skyview, CA 90210</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-dejair-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-dejair-400" />
                <span className="text-gray-300">info@dejairskyline.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-dejair-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Dejair Skyline. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
