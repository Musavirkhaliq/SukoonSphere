import React, { useState } from "react";
import {
  FaShareAlt,
  FaKey,
  FaUserPlus,
  FaRocket,
  FaGlobe,
  FaTrophy,
} from "react-icons/fa";
import { toast } from "react-toastify";
import customFetch from "../../../utils/customFetch";
import { useUser } from "../../../context/UserContext";
import { Link } from "react-router-dom";

const GetAKey = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to request contributor access");
      return;
    }

    try {
      setIsLoading(true);
      const response = await customFetch.post("/user/verify-contributor/", {
        fullname: name,
        message,
      });

      toast.success(response.data.msg);
      // Clear form
      setName("");
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-3">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden grid md:grid-cols-2 gap-0">
        {/* Left Section */}
        <div className="bg-gradient-to-br from-[#0b3948] to-[#061c23] text-white p-4 md:px-6 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-2 md:mb-4">
            <FaRocket className="w-6 h-6 md:w-10 md:h-10 text-white mb-2 md:mb-3 opacity-80" />
            <h2 className="text-xl md:text-5xl font-extrabold mb-2 md:mb-4 text-white leading-tight">
              Elevate Your Impact
            </h2>
          </div>
          <p className="text-sm md:text-xl mb-2 md:mb-4 text-[var(--grey--600)] font-light">
            Transform your passion into meaningful contributions. Here's how you
            can make a difference:
          </p>

          <div className="space-y-2 md:space-y-4">
            {[
              {
                icon: FaGlobe,
                title: "Global Reach",
                description: "Expand your influence beyond boundaries",
              },
              {
                icon: FaTrophy,
                title: "Recognition",
                description: "Showcase your expertise and achievements",
              },
              {
                icon: FaShareAlt,
                title: "Collaborative Growth",
                description: "Connect with like-minded innovators",
              },
            ].map(({ icon: Icon, title, description }, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 md:space-x-6 bg-white/10 p-3 md:p-4 rounded-xl hover:bg-white/20 transition duration-300"
              >
                <Icon className="w-7 h-7 md:w-10 md:h-10 text-[var(--secondary)]" />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    {title}
                  </h2>
                  <p className="text-xs md:text-sm text-[var(--grey--600)]">
                    {description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="py-4 px-4 bg-white flex items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="text-center mb-2 md:mb-4">
              <div className="flex justify-center mb-2">
                <FaKey className="w-6 h-6 md:w-10 md:h-10 text-[var(--green)] animate-pulse" />
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-1 md:mb-2">
                Unlock Your Potential
              </h2>
              <p className="text-gray-500 text-sm md:text-lg">
                Join our exclusive contributor network
              </p>
            </div>

            <div className="space-y-2 md:space-y-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full bg-[var(--white-color)] px-3 py-2 md:px-4 md:py-3 rounded-lg border-2 border-gray-100 focus:border-[var(--green)] transition duration-300"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">
                  Your Contribution Vision
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your unique contribution idea"
                  rows={4}
                  className="w-full bg-[var(--white-color)] px-3 py-2 md:px-4 md:py-3 rounded-lg border-2 border-gray-100 focus:border-[var(--green)] transition duration-300"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className={`w-full flex btn-2 btn-2-hover items-center justify-center transition duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isLoading}
              >
                <FaUserPlus className="mr-2 md:mr-3" />
                {isLoading ? "Submitting..." : "Claim Your Spot"}
              </button>
            </div>

            <div className="mt-4 text-center text-red-400 text-sm font-light">
              <span className="bg-[var(--white-color)] px-2 py-1 rounded-full border border-gray-200">
                Note:
              </span>
              &nbsp;Your request will be reviewed by our team and a key (number)
              will be provided through your registered email which you can use{" "}
              <Link
                to="/user/request-contributor"
                className="text-[var(--ternery)] hover:underline"
              >
                here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GetAKey;
