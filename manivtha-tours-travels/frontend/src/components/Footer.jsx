import React from 'react';
import { Link } from 'react-router-dom';
import { FaCar, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaArrowUp } from 'react-icons/fa';

const Footer = () => {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-8 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-skyAccent-400/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Logo & About */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-gradient-to-tr from-skyAccent-500 to-blue-600 rounded-lg text-white shadow-md">
                <FaCar className="text-xl" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight text-white">
                  MANIVTHA
                </span>
                <span className="block text-[10px] tracking-widest text-goldAccent-400 font-bold uppercase -mt-1">
                  Tours & Travels
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Your trusted travel partner in Hyderabad. Providing premium vehicles, verified drivers, and affordable rates for airport transfers, outstation tours, and local city commutes.
            </p>
            <div className="flex gap-3 pt-2">
              <a 
                href="https://wa.me/919490102588" 
                target="_blank" 
                rel="noreferrer"
                className="p-2 bg-emerald-950 text-emerald-400 hover:bg-emerald-800 hover:text-white rounded-lg transition-colors duration-200"
              >
                <FaWhatsapp className="text-lg" />
              </a>
              <a 
                href="tel:+919490102588" 
                className="p-2 bg-sky-950 text-sky-400 hover:bg-sky-800 hover:text-white rounded-lg transition-colors duration-200"
              >
                <FaPhone className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-base font-bold uppercase tracking-wider mb-4 font-outfit">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-skyAccent-400 hover:translate-x-1 inline-block transition-all duration-200">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-skyAccent-400 hover:translate-x-1 inline-block transition-all duration-200">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-skyAccent-400 hover:translate-x-1 inline-block transition-all duration-200">Services & Rates</Link>
              </li>
              <li>
                <Link to="/fleet" className="hover:text-skyAccent-400 hover:translate-x-1 inline-block transition-all duration-200">Our Fleet</Link>
              </li>
              <li>
                <Link to="/chatbot" className="hover:text-skyAccent-400 hover:translate-x-1 inline-block transition-all duration-200">AI Chatbot Assistant</Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white text-base font-bold uppercase tracking-wider mb-4 font-outfit">Our Services</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services" className="hover:text-skyAccent-400 hover:translate-x-1 inline-block transition-all duration-200">Airport Transfers (RGIA)</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-skyAccent-400 hover:translate-x-1 inline-block transition-all duration-200">Outstation Roundtrips</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-skyAccent-400 hover:translate-x-1 inline-block transition-all duration-200">Local Hourly Rentals</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-skyAccent-400 hover:translate-x-1 inline-block transition-all duration-200">Corporate Employee Commute</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-skyAccent-400 hover:translate-x-1 inline-block transition-all duration-200">Wedding & Fleet Hire</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white text-base font-bold uppercase tracking-wider mb-4 font-outfit">Get in Touch</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-skyAccent-400 mt-1 flex-shrink-0" />
                <span>
                  Flat No. 302, Sai Teja Residency, Miyapur, Hyderabad, Telangana - 500049
                </span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-skyAccent-400 flex-shrink-0" />
                <a href="tel:+919490102588" className="hover:text-white transition-colors">+91 94901 02588</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-skyAccent-400 flex-shrink-0" />
                <a href="mailto:info@manivthatravels.com" className="hover:text-white transition-colors">info@manivthatravels.com</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} Manivtha Tours & Travels. All rights reserved. Designed in Hyderabad.</p>
          <button 
            onClick={handleScrollTop}
            className="p-3 bg-dark-800 border border-white/10 hover:border-skyAccent-400 text-skyAccent-400 rounded-full transition-all duration-200"
            aria-label="Scroll to top"
          >
            <FaArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
