import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center ">
            <div className="relative">
                {/* Main circle with pulsing effect */}
                <div className="w-24 h-24 rounded-full bg-blue-400/20 absolute animate-ping " />
                <div className="w-24 h-24 rounded-full bg-blue-500/20 animate-pulse" />

                {/* Orbiting circles */}
                <div className="absolute inset-0">
                    {/* Inner orbiting circle */}
                    <div className="w-full h-full animate-spin-slow relative ">
                        <div className="absolute w-4 h-4 bg-purple-400 rounded-full 
                          top-0 left-1/2 transform -translate-x-1/2
                          shadow-lg shadow-purple-200">
                            <div className="w-full h-full bg-purple-400 rounded-full animate-pulse" />
                        </div>
                    </div>

                    {/* Outer orbiting circle */}
                    <div className="w-full h-full animate-spin-slow-reverse relative ">
                        <div className="absolute w-4 h-4 bg-blue-400 rounded-full 
                          bottom-0 left-1/2 transform -translate-x-1/2
                          shadow-lg shadow-blue-200">
                            <div className="w-full h-full bg-blue-400 rounded-full animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Center breathing circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center
                        animate-breathe">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full" />
                    </div>
                </div>

                {/* Loading text */}
                <div className="mt-32 text-center">
                    <p className="text-gray-400 text-sm">
                        Loading content...
                    </p>
                    <p className="text-gray-600 text-lg font-medium animate-pulse">
                        Taking a moment to breathe...
                    </p>
                    {/* <p className="text-gray-400 text-sm mt-2">
                        Your mental wellness matters
                    </p> */}
                </div>
            </div>
        </div>
    );
};


export default LoadingSpinner;