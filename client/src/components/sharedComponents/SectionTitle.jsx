import React from 'react';

const SectionHeader = ({ title }) => {
  return (
      <>
    <div className="max-w-7xl mx-auto px-6 py-8 lg:py-12">
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute left-[-10px] md:left-[-1rem] top-1/2 w-1 h-1 md:w-2 md:h-2 bg-gray-600 rounded-full transform -translate-y-1/2" />
        {/* <div className="absolute left-3 top-1/2 w-1 h-1 bg-gray-400 rounded-full transform -translate-y-1/2" />  */}
 
        <div className="flex items-center space-x-4">
          {/* Main heading container */}
          <div className="flex-shrink-0">
            <h3 className="text-sm md:text-xl font-medium tracking-wider uppercase text-gray-600">
              {title}
            </h3>
          </div>
   
          {/* Animated line */}
          <div className="flex-grow relative h-0.5 bg-gray-100 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-300 w-full transform hover:translate-x-1 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </div>
    
    </>
  
  );
};

export default SectionHeader;