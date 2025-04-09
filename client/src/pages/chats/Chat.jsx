import React, { useState, useEffect } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
// Import the improved sidebar component
import ImprovedChatSidebar from "@/components/chatsComponents/ImprovedChatSidebar";

const Chat = () => {
  const { id } = useParams();
  const location = useLocation();
  // Always keep sidebar closed on mobile by default
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  // Close sidebar on mobile when navigating to a chat or location changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [id, location]);

  // Listen for window resize to handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{ height: `calc(100vh - 65px)` }}
      className="bg-gray-50 relative overflow-hidden"
    >
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        style={{ height: `calc(100vh - 65px)` }}
        className="flex flex-col w-full"
      >
        <div className="flex-1 flex h-full">
          {/* Sidebar */}
          <div
            className={`
              fixed inset-y-0 left-0 z-30 w-full sm:w-96 md:w-80 bg-white transform transition-transform duration-300 ease-in-out
              lg:relative lg:transform-none lg:transition-none lg:h-full lg:min-h-0
              shadow-lg lg:shadow-md lg:border-r border-gray-200
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            <ImprovedChatSidebar onClose={() => setIsSidebarOpen(false)} />
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full bg-white overflow-hidden">
            <Outlet
              context={{
                toggleSidebar: () => setIsSidebarOpen(!isSidebarOpen),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
