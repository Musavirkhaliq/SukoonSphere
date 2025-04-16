import React, { useState, useEffect } from "react";
import { Outlet, useParams, useLocation } from "react-router-dom";
import ImprovedChatSidebar from "@/components/chatsComponents/ImprovedChatSidebar";
import "@/components/chatsComponents/ChatMobile.css";
import { FaArrowLeft } from "react-icons/fa";

const Chat = () => {
  const { id } = useParams();
  const location = useLocation();

  // Always keep sidebar open by default on all screen sizes
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Flag to prevent sidebar from closing when search is focused
  const [preventSidebarClose, setPreventSidebarClose] = useState(false);

  // Remove the effect that closes sidebar on mobile when navigating
  useEffect(() => {
    // No need to close sidebar on mobile; keep it open unless manually toggled
  }, [id, location, preventSidebarClose]);

  // Listen for window resize to keep sidebar open on all sizes
  useEffect(() => {
    const handleResize = () => {
      // Always keep sidebar open, regardless of window size
      // setIsSidebarOpen(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{ height: `calc(100vh - 65px)` }}
      className="bg-gray-50 relative overflow-hidden"
    >
      {/* Mobile Sidebar Overlay - Only show when sidebar can be closed */}
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
              shadow-lg lg:shadow-md lg:border-r border-gray-200 chat-sidebar
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            <ImprovedChatSidebar
              onClose={() => setIsSidebarOpen(false)}
              setPreventSidebarClose={setPreventSidebarClose}
              keepSidebarOpen={() => setIsSidebarOpen(true)}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full bg-white overflow-hidden relative chat-main-content">
            {/* Mobile Back Button - Only visible when no chat is selected and on mobile */}
            {!id && !isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="absolute top-4 left-4 p-3 bg-blue-500 text-white rounded-full shadow-md lg:hidden z-10"
                aria-label="Show sidebar"
              >
                <FaArrowLeft />
              </button>
            )}
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