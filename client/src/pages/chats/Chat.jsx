import React, { useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { ChatSidebar } from "@/components";

const Chat = () => {
  const { id } = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(id ? false : true);

  return (
    <div
      style={{ height: `calc(100vh - 65px)` }}
      className=" bg-gray-50 relative"
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
        className=" flex flex-col "
      >
        <div className="flex-1 flex h-full">
          {/* Sidebar */}
          <div
            className={`
              fixed inset-y-0 left-0 z-30 w-full md:w-80 bg-white transform transition-transform duration-300 ease-in-out
              lg:relative lg:transform-none lg:transition-none
              ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
          >
            <ChatSidebar onClose={() => setIsSidebarOpen(false)} />
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full bg-white lg:border-l">
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
