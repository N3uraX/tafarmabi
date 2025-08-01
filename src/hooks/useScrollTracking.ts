import { useEffect, useRef } from 'react';

interface UseScrollTrackingProps {
  onScrollThreshold?: (percentage: number) => void;
  threshold?: number; // Percentage (0-100)
}

export const useScrollTracking = ({ 
  onScrollThreshold, 
  threshold = 50 
}: UseScrollTrackingProps) => {
  const hasTriggered = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (hasTriggered.current) return;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;

      if (scrollPercentage >= threshold && onScrollThreshold) {
        hasTriggered.current = true;
        onScrollThreshold(scrollPercentage);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [onScrollThreshold, threshold]);

  const resetTracking = () => {
    hasTriggered.current = false;
  };

  return { resetTracking };
};