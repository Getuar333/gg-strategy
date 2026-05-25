import React from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';

const SidebarToggle = ({ isOpen, setIsOpen }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setIsOpen(!isOpen)}
      className="p-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-violet-500 transition-all md:hidden fixed top-4 left-4 z-50"
    >
      {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
    </motion.button>
  );
};

export default SidebarToggle;