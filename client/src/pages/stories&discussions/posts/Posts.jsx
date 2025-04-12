import React from "react";
import { Outlet } from "react-router-dom";
import UserSearchBar from "../../../components/common/UserSearchBar";
import { FaUsers } from "react-icons/fa";
import TopPublicGroups from "../../../components/shared/TopPublicGroups";
import MobileGroupIcons from "../../../components/shared/MobileGroupIcons";
import "../../../components/shared/MobileGroupIcons.css";

const Posts = () => {


  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 py-2">
      <div className="grid grid-cols-12 gap-2">

        {/* Left Sidebar - Groups */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="sticky top-20">
            <TopPublicGroups />
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-6 space-y-4 order-2 lg:order-0">
          <div >
            <Outlet />
          </div>
        </div>

        {/* Mobile User Search - Visible on small screens */}
        <div className="lg:hidden col-span-full  order-0 lg:order-1">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="mb-2">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FaUsers className="mr-2 text-[var(--primary)]" />
                Find People
              </h3>
              <UserSearchBar isMobile={true} />
            </div>
          </div>
        </div>
        {/* Mobile Groups - Visible on small screens */}
        <div className="lg:hidden col-span-full mb-2 order-0">
          <MobileGroupIcons />
        </div>

        {/* Right Sidebar - User Search (Desktop) */}
        <div className="hidden shadow-sm lg:block lg:col-span-3 rounded-lg order-2">
          <div className="bg-white p-4 rounded-lg sticky top-20">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <FaUsers className="mr-2 text-[var(--primary)]" />
                Find People
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Search for users to follow and connect with
              </p>
              <UserSearchBar isMobile={false} />
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-2">Why Connect?</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">•</span>
                  <span>Follow users to see their posts in your feed</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">•</span>
                  <span>Connect with people who share similar interests</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[var(--primary)] mr-2">•</span>
                  <span>Build your support network for mental wellness</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
