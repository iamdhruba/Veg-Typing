import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <h1 className="text-9xl font-black text-primary/10 tracking-tighter">404</h1>
        <div className="space-y-2">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-on-background">Lost in the Matrix</h2>
          <p className="text-on-background/40 font-bold uppercase tracking-widest text-xs">The page you are looking for does not exist.</p>
        </div>
        <Link 
          to="/" 
          className="inline-block px-12 py-4 bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] hover:shadow-2xl hover:shadow-primary/20 transition-all"
        >
          Return Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
