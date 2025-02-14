import React, { useEffect, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import customFetch from '@/utils/customFetch.js';
import { ChatSidebar } from '@/components';

const Chat = () => {
  const [activeUser, setActiveUser] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { id } = useParams();

  const fetchActiveUser = async () => {
    const response = await customFetch.get(`/messages/active-user/${id}`);
    setActiveUser(response.data.user);
  };

  useEffect(() => {
    fetchActiveUser();
  }, [id]);

  return (
    <div className="h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="h-screen flex flex-col">
        <div className="flex-1 flex h-full">
          {/* Sidebar */}
          <div 
            className={`
              fixed inset-y-0 left-0 z-30 w-80 bg-white transform transition-transform duration-300 ease-in-out
              lg:relative lg:transform-none lg:transition-none
              ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            <ChatSidebar
              setActiveUser={setActiveUser} 
              onClose={() => setIsSidebarOpen(false)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full bg-white lg:border-l">
            <Outlet 
              context={{ 
                activeUser, 
                toggleSidebar: () => setIsSidebarOpen(!isSidebarOpen) 
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;