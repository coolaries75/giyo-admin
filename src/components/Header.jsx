
import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle } from 'lucide-react';

const Header = ({ userName, userRole }) => {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground p-4 shadow-lg sticky top-0 z-40"
    >
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">Brochures Control Panel</h1>
        <div className="flex items-center space-x-2">
          <UserCircle size={24} />
          <span className="text-sm md:text-base">
            Welcome, {userName} ({userRole})
          </span>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
  