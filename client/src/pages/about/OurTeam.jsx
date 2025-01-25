import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { FaUsers, FaUser, FaEye } from "react-icons/fa";
import { PageIntro } from "@/components";
import { FaHandsHelping } from "react-icons/fa";
function OurTeam() {
  // Fetch data from the loader (replace with actual data)
  const data = useLoaderData();
  // Display a fallback if `data.posts` is missing or empty

  return (
    <>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
        <PageIntro
          title={" SukoonSphere Contributors"}
          description={` Our qualified physicians and mental health expertsensure compassionate, accurate, and inclusive content that
            prioritizes your well-being.`}
        />
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="my-8 flex justify-center ">
            <div
              className="inline-flex items-center space-x-3 
            px-6 py-2 
            bg-[var(--grey--100)] 
            rounded-full 
            shadow-md 
            hover:shadow-lg 
            transition-all 
            group"
            >
              <span
                className="text-sm text-[var(--grey--800)] 
              group-hover:text-[var(--primary)] 
              transition-"
              >
                Expertise You Can Trust
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-[var(--primary)] 
              group-hover:animate-pulse"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className=" mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {!data?.posts || data?.posts?.length === 0 ? (
            <div className="text-center p-4 md:p-8 rounded-lg col-span-full">
              <div className="flex flex-col items-center justify-center  rounded-xl p-8 space-y-4 text-center">
                <div className="bg-blue-100 p-6 rounded-full">
                  <FaHandsHelping className="w-16 h-16 text-var(--primary) animate-pulse" />
                </div>
                <div className="max-w-md">
                  <h2 className="text-2xl font-bold text-[var(--grey--900)] mb-3">
                    No contributors found
                  </h2>
                  <p className="text-[var(--grey--800)] mb-6">
                    We are currently working on adding more contributors to our
                    platform.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {data?.posts?.map((member) => (
                <div
                  key={member?._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
                  data-aos="zoom-in-up"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={
                        member?.avatar ||
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/User-avatar.svg/2048px-User-avatar.svg.png"
                      }
                      alt={member?.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Link
                        to={`/about/user/${member._id}`}
                        className="bg-white text-black px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-opacity-90"
                      >
                        <FaEye className="w-5 h-5" />
                        <span>View Profile</span>
                      </Link>
                    </div>
                  </div>

                  <div className="p-6 text-center">
                    <Link to={`/about/user/${member?._id}`}>
                      <h3 className="text-2xl font-bold text-[var(--grey--900)] mb-2 group-hover:text-blue-600 transition-colors">
                        {member?.name}
                      </h3>
                    </Link>
                    <div className="flex justify-center space-x-4 text-[var(--grey--800)]">
                      <div className="flex items-center space-x-1">
                        <FaUsers className="w-5 h-5" />
                        <span>{member.followers?.length || 0} Followers</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FaUser className="w-4 h-4" />
                        <span>{member.following?.length || 0} Following</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default OurTeam;
