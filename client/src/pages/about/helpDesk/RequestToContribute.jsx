import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  FaVideo,
  FaEdit,
  FaComments,
  FaLightbulb,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useUser } from "@/context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import customFetch from "@/utils/customFetch";

const RequestToContribute = () => {
  const { user } = useUser();
  const [secret, setSecretKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!secret) {
      toast.error("Please enter the secret key");
      return;
    }

    setLoading(true);
    try {
      const response = await customFetch.post("/user/request-contributor", {
        key: secret,
      });
      if (response.status === 200) {
        toast.success("Access granted! You can now contribute.");
        navigate(`/about/user/${user?._id}`);
      }
    } catch (err) {
      console.log({ errNEW: err });
      const errorMessage = err.response?.data?.error || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-[var(--body)] mt-2">
      <div className="bg-[var(--white-color)] shadow-lg rounded-xl p-8 w-[90%] max-w-md">
        <h2 className="text-[var(--primary)] font-bold text-2xl md:text-4xl text-center">
          Become a Contributor
        </h2>
        <p className="text-[var(--grey--700)] text-xs md:text-sm text-center mb-6">
          Enter the secret key to unlock contributor access. As a contributor,
          you can:
        </p>
        <ul className="text-[var(--grey--700)] text-sm mb-6 space-y-4">
          <li className="flex items-center space-x-3">
            <FaVideo className="text-[var(--primary)] text-lg" />
            <span>Post videos</span>
          </li>
          <li className="flex items-center space-x-3">
            <FaEdit className="text-[var(--primary)] text-lg" />
            <span>Create articles</span>
          </li>
          <li className="flex items-center space-x-3">
            <FaComments className="text-[var(--primary)] text-lg" />
            <span>Join and lead discussions</span>
          </li>
          <li className="flex items-center space-x-3">
            <FaLightbulb className="text-[var(--primary)] text-lg" />
            <span>Share resources and tips</span>
          </li>
        </ul>
        <div className="bg-[var(--light-bg)] border-l-4 border-[var(--primary)] px-4 py-2 rounded-lg mb-6">
          <h2 className="text-[var(--gray--900)] font-bold text-sm">
            Tip: Contribute to our growing platform and make a difference in our
            community!
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative ">
            <input
              type={showPassword ? "text" : "password"}
              name="secret"
              placeholder="Enter secret key..."
              value={secret}
              onChange={(e) => setSecretKey(e.target.value)}
              className="input w-full bg-gray-100 text-[var(--black-color)] border border-[var(--grey--300)] rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all duration-300 placeholder-[var(--grey--600)]"
            />
            <span
              className="absolute top-0 right-0 px-4 py-3 cursor-pointer "
              onClick={togglePassword}
            >
              {showPassword ? (
                <FaEye className="text-[var(--grey--700)] size-6" />
              ) : (
                <FaEyeSlash className="text-[var(--grey--700)] size-6" />
              )}
            </span>
          </div>
          <div>
            <p>
              To obtain a key, please{" "}
              <Link to="/get-a-key" className="text-blue-600">
                click here
              </Link>
              .
            </p>
          </div>
          <button
            type="submit"
            className={`w-full ${loading ? " btn-2 bg-[var(--grey--300)] cursor-not-allowed" : "btn-2"}`} // Disable button when loading
            disabled={loading}
          >
            {loading ? "Verifying..." : "Unlock Access"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RequestToContribute;
