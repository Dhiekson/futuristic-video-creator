
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-secondary/50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start">
              <div className="relative h-6 w-6 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mr-2">
                <div className="absolute inset-0.5 rounded-full bg-white" />
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
              </div>
              <span className="text-lg font-semibold">NeoCreate</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground text-center md:text-left">
              AI-powered video and image generation
            </p>
          </div>
          
          <div className="space-y-2 text-center md:text-right">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} NeoCreate. All rights reserved.
            </p>
            <div className="flex items-center justify-center md:justify-end space-x-4 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
