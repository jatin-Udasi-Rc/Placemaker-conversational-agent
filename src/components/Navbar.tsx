'use client';

import { useState } from 'react';
import { Search, ShoppingCart, MapPin, User, ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isStoreDropdownOpen, setIsStoreDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  return (
    <nav className="bg-primary text-white">
      {/* Top Bar */}
      <div className="bg-primary border-b border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-300 transition-colors">Home Improvement</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Trade</a>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 hover:text-gray-300 transition-colors"
                  onClick={() => setIsStoreDropdownOpen(!isStoreDropdownOpen)}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Choose Store</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isStoreDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Store Finder</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Change Store</a>
                    </div>
                  </div>
                )}
              </div>
              <a href="#" className="hover:text-gray-300 transition-colors">Register</a>
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 hover:text-gray-300 transition-colors"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <User className="w-4 h-4" />
                  <span>Sign in</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Retail Customer</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Trade Customer</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Buying Group</a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <span className="text-xl font-bold">PlaceMakers</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="hover:text-gray-300 transition-colors font-medium">Shop</a>
              <a href="#" className="hover:text-gray-300 transition-colors font-medium">Plan Your Space</a>
              <a href="#" className="hover:text-gray-300 transition-colors font-medium">Services</a>
              <a href="#" className="hover:text-gray-300 transition-colors font-medium">Tools</a>
              <a href="#" className="hover:text-gray-300 transition-colors font-medium">Deals</a>
            </div>

            {/* Search and Cart */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block relative">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="I am looking for..."
                    className="w-64 pl-4 pr-10 py-2 text-gray-900 bg-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button className="bg-accent hover:bg-[#0099D4] px-4 py-2 rounded-r-md transition-colors">
                    <Search className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <ShoppingCart className="w-6 h-6" />
                <span>$0.00 (0)</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-gray-300"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Bar */}
      <div className="bg-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex space-x-6">
              <a href="#" className="hover:text-blue-100 transition-colors">Trade: Spend, Earn, Redeem</a>
              <a href="#" className="hover:text-blue-100 transition-colors">Kitchens & Bathrooms My Food Bag Offer</a>
            </div>
            <div>
              <a href="#" className="hover:text-blue-100 transition-colors">Farm Shed Quote</a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary border-t border-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="block px-3 py-2 text-white hover:text-gray-300">Shop</a>
            <a href="#" className="block px-3 py-2 text-white hover:text-gray-300">Plan Your Space</a>
            <a href="#" className="block px-3 py-2 text-white hover:text-gray-300">Services</a>
            <a href="#" className="block px-3 py-2 text-white hover:text-gray-300">Tools</a>
            <a href="#" className="block px-3 py-2 text-white hover:text-gray-300">Deals</a>
          </div>
        </div>
      )}
    </nav>
  );
}
