
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const InteractiveBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.addEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const xFactor = mousePosition.x / window.innerWidth;
  const yFactor = mousePosition.y / window.innerHeight;
  
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div 
        className="absolute top-0 left-0 w-[120vw] h-[120vh] -translate-x-[10%] -translate-y-[10%] opacity-60"
        animate={{
          background: `radial-gradient(circle at ${xFactor * 100}% ${yFactor * 100}%, 
            rgba(59, 130, 246, 0.15) 0%, 
            rgba(139, 92, 246, 0.1) 45%, 
            rgba(236, 72, 153, 0.05) 70%,
            rgba(0, 0, 0, 0) 100%)`
        }}
        transition={{ type: "spring", damping: 30 }}
      />
      <motion.div 
        className="absolute top-[30%] right-[10%] w-[40vw] h-[40vh] rounded-full bg-blue-200/10 blur-3xl"
        animate={{
          x: xFactor * 10 - 5,
          y: yFactor * 10 - 5,
        }}
        transition={{ type: "spring", damping: 50 }}
      />
      <motion.div 
        className="absolute bottom-[10%] left-[20%] w-[30vw] h-[30vh] rounded-full bg-purple-200/10 blur-3xl"
        animate={{
          x: -xFactor * 10 + 5,
          y: -yFactor * 10 + 5,
        }}
        transition={{ type: "spring", damping: 50 }}
      />
    </div>
  );
};

export default InteractiveBackground;
