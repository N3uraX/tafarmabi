import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Twitter, Linkedin, Facebook, Link, Check } from 'lucide-react';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ 
  url, 
  title, 
  description = '', 
  className = '' 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Check if Web Share API is supported
  const isWebShareSupported = typeof navigator !== 'undefined' && 'share' in navigator;

  const shareData = {
    title,
    text: description,
    url
  };

  const handleNativeShare = async () => {
    if (isWebShareSupported) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled or error occurred, fall back to dropdown
        if (error instanceof Error && error.name !== 'AbortError') {
          setShowDropdown(true);
        }
      }
    } else {
      setShowDropdown(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShowToast(true);
      setShowDropdown(false);
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
      color: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:text-blue-500'
    }
  ];

  return (
    <>
      <div className={`relative ${className}`}>
        <motion.button
          onClick={handleNativeShare}
          className="flex items-center space-x-2 bg-dark-card border border-dark-border rounded-lg px-4 py-2 text-gray-400 hover:text-neon-green hover:border-neon-green/50 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Share2 className="w-4 h-4" />
          <span className="font-mono text-sm">Share</span>
        </motion.button>

        {/* Custom Share Dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              
              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-xl z-50 overflow-hidden"
              >
                <div className="p-2">
                  <div className="text-xs font-mono text-gray-400 px-3 py-2 border-b border-dark-border">
                    Share this article
                  </div>
                  
                  {/* Social Share Links */}
                  {shareLinks.map((social) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center space-x-3 px-3 py-2 text-gray-400 ${social.color} transition-colors duration-200 rounded hover:bg-dark-bg`}
                      whileHover={{ x: 5 }}
                      onClick={() => setShowDropdown(false)}
                    >
                      <social.icon className="w-4 h-4" />
                      <span className="font-mono text-sm">{social.name}</span>
                    </motion.a>
                  ))}
                  
                  {/* Copy Link */}
                  <motion.button
                    onClick={handleCopyLink}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-gray-400 hover:text-neon-green transition-colors duration-200 rounded hover:bg-dark-bg"
                    whileHover={{ x: 5 }}
                  >
                    <Link className="w-4 h-4" />
                    <span className="font-mono text-sm">Copy Link</span>
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-neon-green text-black px-4 py-3 rounded-lg shadow-lg font-mono font-semibold"
          >
            <Check className="w-4 h-4" />
            <span>Link Copied!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareButton;