import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-gray-300 py-6">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Left Section */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-lg font-bold text-white mb-2">Journey Jot</h2>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Journey Jot. All rights reserved.
          </p>
        </div>

        {/* Center Section (Navigation Links) */}
        <div className="flex space-x-6 mb-4 md:mb-0">
          <a href="/about" className="hover:text-white transition duration-200">
            About Us
          </a>
          <a
            href="/services"
            className="hover:text-white transition duration-200"
          >
            Services
          </a>
          <a
            href="/contact"
            className="hover:text-white transition duration-200"
          >
            Contact
          </a>
          <a
            href="/privacy"
            className="hover:text-white transition duration-200"
          >
            Privacy Policy
          </a>
        </div>

        {/* Right Section (Social Media Links) */}
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-blue-500 transition duration-200"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-blue-400 transition duration-200"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-pink-500 transition duration-200"
          >
            <FaInstagram size={20} />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-blue-600 transition duration-200"
          >
            <FaLinkedinIn size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
