import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCar, FaBars, FaTimes, FaRobot } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on link click
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'AI Chat', path: '/chatbot', icon: <FaRobot className="inline mr-1 text-skyAccent-400" /> },
    { name: 'Admin', path: '/admin' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'py-3 bg-dark-900/80 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
            <div className="p-2 bg-gradient-to-tr from-skyAccent-500 to-blue-600 rounded-lg text-white shadow-lg group-hover:scale-105 transition-transform">
              <FaCar className="text-xl" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-skyAccent-400 to-goldAccent-400 bg-clip-text text-transparent">
                MANIVTHA
              </span>
              <span className="block text-[10px] tracking-widest text-goldAccent-400 font-bold uppercase -mt-1">
                Tours & Travels
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-skyAccent-400 bg-white/5 shadow-inner border border-white/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              className="ml-4 px-5 py-2 bg-gradient-to-r from-skyAccent-500 to-blue-600 hover:from-skyAccent-400 hover:to-blue-500 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-skyAccent-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-400 hover:text-white focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-dark-900/95 backdrop-blur-lg border-b border-white/5 transition-all duration-300 ease-in-out ${
        isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
      }`}>
        <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={closeMenu}
              className={`block px-4 py-3 rounded-lg text-base font-semibold transition-all duration-200 ${
                isActive(link.path)
                  ? 'text-skyAccent-400 bg-white/5 border-l-4 border-skyAccent-400'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="flex items-center">
                {link.icon}
                {link.name}
              </span>
            </Link>
          ))}
          <div className="pt-4 px-4">
            <Link
              to="/contact"
              onClick={closeMenu}
              className="block w-full text-center py-3 bg-gradient-to-r from-skyAccent-500 to-blue-600 hover:from-skyAccent-400 hover:to-blue-500 text-white font-bold rounded-lg shadow-lg"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
