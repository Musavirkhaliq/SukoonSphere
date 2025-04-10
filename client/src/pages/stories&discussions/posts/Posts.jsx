import React from "react";
import { Outlet } from "react-router-dom";
import UserSearchBar from "../../../components/common/UserSearchBar";
import { FaUsers } from "react-icons/fa";

const Posts = () => {
  const groups = [
    {
      id: 1,
      name: "Mindfulness Practices 🧘‍♂️",
      image: "https://example.com/image_mindfulness.jpg",
    },
    {
      id: 2,
      name: "Coping with Anxiety 💭",
      image: "https://example.com/image_anxiety.jpg",
    },
    {
      id: 3,
      name: "Therapy Techniques 📖",
      image: "https://example.com/image_therapy.jpg",
    },
    {
      id: 4,
      name: "Depression Support Group ❤️",
      image: "https://example.com/image_depression.jpg",
    },
    {
      id: 5,
      name: "Stress Management Workshops 🌱",
      image: "https://example.com/image_stress.jpg",
    },
  ];


  return (
    <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-4 py-4">
      <div className="grid grid-cols-12 gap-2">
        {/* Left Sidebar - Groups */}
        <div className="rounded-lg shadow-sm hidden lg:block lg:col-span-3 ">
          <div className="bg-white p-4 rounded-lg sticky top-20">
            <h3 className="text-lg font-semibold mb-4">Coming Soon</h3>
            <div className="space-y-4">
              {groups.map((group) => (
                <div key={group.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    {group.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{group.name}</p>
                    <p className="text-xs text-gray-500">Starting soon</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-6 space-y-4 order-2 lg:order-0">
          {/* Add Post Card */}
          <div >
            <Outlet />
          </div>
        </div>

        {/* Mobile User Search - Visible on small screens */}
        <div className="lg:hidden col-span-full mb-4  order-0 lg:order-1">
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
