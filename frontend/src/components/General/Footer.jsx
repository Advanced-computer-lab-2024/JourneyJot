/** @format */

import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300  text-white py-8">
      <div className="container mx-auto px-4">
        {/* Footer Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          {/* Logo and Description */}
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-bold">Journey Jot</h2>
            <p className="text-sm mt-2">
              &copy; {new Date().getFullYear()} Journey Jot. All rights
              reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Footer Navigation" className="mb-6 md:mb-0">
            <ul className="flex flex-col md:flex-row md:space-x-6">
              <li className="mb-2 md:mb-0">
                <a
                  href="/step-guide"
                  className="hover:text-gray-300 transition-colors duration-200"
                >
                  Step Guide
                </a>
              </li>
              <li className="mb-2 md:mb-0">
                <a
                  href="/services"
                  className="hover:text-gray-300 transition-colors duration-200"
                >
                  Services
                </a>
              </li>
              <li className="mb-2 md:mb-0">
                <a
                  href="/contact"
                  className="hover:text-gray-300 transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
              <li className="mb-2 md:mb-0">
                <a
                  href="/privacy"
                  className="hover:text-gray-300 transition-colors duration-200"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </nav>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              <FaInstagram size={20} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="border-t border-gray-400 pt-4 text-center text-sm">
          Designed with ❤️ by Journey Jot Team
        </div>
      </div>
    </footer>
  );
};

export default Footer;
