
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  // Transform navbar background opacity based on scroll position
  const navbarBgOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const navbarBlur = useTransform(scrollY, [0, 50], [0, 8]);
  
  useEffect(() => {
    const updateScrollPosition = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', updateScrollPosition);
    return () => window.removeEventListener('scroll', updateScrollPosition);
  }, []);
  
  return (
    <motion.nav
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "py-2" : "py-4"
      )}
      style={{
        backgroundColor: `rgba(255, 255, 255, ${navbarBgOpacity.get() * 0.7})`,
        backdropFilter: `blur(${navbarBlur.get()}px)`,
        borderBottom: isScrolled ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="absolute inset-1 rounded-full bg-white" />
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
              </div>
              <span className="text-xl font-bold">NeoCreate</span>
            </Link>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center space-x-1"
          >
            <a
              href="#creator"
              className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Creator
            </a>
            <a
              href="#examples"
              className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              Examples
            </a>
            <a
              href="#about"
              className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              About
            </a>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
