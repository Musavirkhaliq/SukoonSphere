import React from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaArrowRight, FaLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';

const SukoonAIPromo = () => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="md:flex">
        <div className="md:shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 md:w-48 flex items-center justify-center p-6">
          <div className="relative">
            <FaRobot className="text-white text-6xl" />
            <FaLightbulb className="text-yellow-300 text-2xl absolute top-0 right-0" />
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center">
            <span className="inline-block px-2 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full mr-2">
              Featured
            </span>
            <h2 className="text-xl font-bold text-gray-900">SukoonAI</h2>
          </div>
          
          <p className="text-sm text-purple-600 font-medium italic mt-1">Where you discover yourself, we help you</p>
          
          <p className="mt-3 text-gray-600">
            Embark on a journey of self-discovery with SukoonAI. Gain deeper insights about yourself, 
            develop practical strategies for personal growth, and track your progress along the way.
          </p>
          
          <div className="mt-4">
            <Link 
              to="/sukoonai" 
              className="inline-flex items-center gap-2 text-purple-600 font-medium hover:text-purple-800 transition-colors"
            >
              Start your journey <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SukoonAIPromo;
