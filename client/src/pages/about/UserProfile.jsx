import { ProfileCard, ProfileDetails } from "@/components";
import customFetch from "@/utils/customFetch";
import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PeopleViewd from "@/components/user/userProfile/PeopleViewd";

const UserProfile = () => {
  const { id: paramId } = useParams();
  const { data: user = {}, refetch: fetchUserById } = useQuery({
    queryKey: ["user", paramId],
    queryFn: async () => {
      const { data } = await customFetch.get(`user/user-details/${paramId}`);
      return data;
    },
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Cache persists for 30 minutes
  });
  return (
    <>
      <div className="relative max-w-7xl mx-auto p-4 lg:p-8 space-y-4">
            {/* Profile Card Section */}
            <div className="">
              <div className="lg:sticky top-[80px] transition-all duration-300 hover:shadow-lg rounded-2xl">
                <ProfileCard fetchUserById={fetchUserById} user={user} />
            </div>
          </div>
            {/* Main Content Section */}
        <div className=" md:col-span-full">
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 lg:p-6">
                <ProfileDetails user={user} />
              </div>
            </div>
      </div>
    </>
  );
};

export default UserProfile;
