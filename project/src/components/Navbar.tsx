import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Code2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' }
  ];

  const isHomePage = location.pathname === '/';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark-bg/95 backdrop-blur-md border-b border-dark-border' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/" className="flex items-center space-x-2">
              <Code2 className="w-8 h-8 text-neon-green" />
              <span className="text-xl font-bold text-white font-mono">Tafar M</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || 
                (link.path.includes('#') && isHomePage && link.path.includes(location.hash));
              
              return (
                <motion.div key={link.name}>
                  {link.path.startsWith('#') ? (
                    <a
                      href={link.path}
                      className={`transition-colors duration-200 font-mono text-sm ${
                        isActive ? 'text-neon-green' : 'text-gray-300 hover:text-neon-green'
                      }`}
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={`transition-colors duration-200 font-mono text-sm ${
                        isActive ? 'text-neon-green' : 'text-gray-300 hover:text-neon-green'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.a
              href="#contact-form"
              className="text-gray-300 hover:text-white transition-colors duration-200 font-mono text-sm"
              whileHover={{ scale: 1.05 }}
            >
              Reach Out
            </motion.a>
            <motion.a
              href="/projects"
              className="bg-neon-green text-black px-4 py-2 rounded-lg font-mono text-sm font-semibold hover:bg-neon-green/90 transition-colors duration-200 animate-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Work
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-card border-t border-dark-border"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                
                return (
                  <div key={link.name}>
                    {link.path.startsWith('#') ? (
                      <a
                        href={link.path}
                        className={`block px-3 py-2 transition-colors duration-200 font-mono text-sm ${
                          isActive ? 'text-neon-green' : 'text-gray-300 hover:text-neon-green'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.path}
                        className={`block px-3 py-2 transition-colors duration-200 font-mono text-sm ${
                          isActive ? 'text-neon-green' : 'text-gray-300 hover:text-neon-green'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                );
              })}
              <div className="border-t border-dark-border pt-4 space-y-2">
                <a 
                  href="#contact-form"
                  className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-mono text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Reach Out
                </a>
                <Link 
                  to="/projects"
                  className="block w-full bg-neon-green text-black px-3 py-2 rounded-lg font-mono text-sm font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  View Work
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;