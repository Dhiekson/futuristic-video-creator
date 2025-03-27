
import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden py-12 md:py-24">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[30%] -right-[20%] h-[600px] w-[600px] rounded-full bg-blue-200/10 blur-3xl" />
        <div className="absolute -bottom-[30%] -left-[20%] h-[600px] w-[600px] rounded-full bg-purple-200/10 blur-3xl" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium uppercase tracking-wider text-secondary-foreground">
              Next-Generation Creation
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-4xl font-bold tracking-tight md:text-6xl"
          >
            AI-Powered Video & Image 
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent"> 
              Generation
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-lg text-muted-foreground md:text-xl"
          >
            Create stunning videos and images with cutting-edge AI technology. 
            Transform your ideas into visual content in seconds.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4"
          >
            <a href="#creator" className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-6 font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90">
              Start Creating
            </a>
            <a href="#examples" className="inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background px-6 font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
              View Examples
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
