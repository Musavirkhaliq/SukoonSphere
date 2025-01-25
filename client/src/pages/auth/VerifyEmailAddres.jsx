import customFetch from "@/utils/customFetch";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
const LoadingIcon = () => (
  <svg className="w-10 h-10 text-indigo-600 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-10 h-10 text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M15 9L9 15M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const SuccessIcon = () => (
  <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const VerifyEmailAddres = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const query = useQuery();

  const verifyToken = async () => {
    setLoading(true);

    try {
      const { data } = await customFetch.post("/auth/verify-email", {
        verificationToken: query.get("token"),
        email: query.get("email"),
      });
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    verifyToken();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                <LoadingIcon />
              </div>
              <div className="absolute -bottom-1 -right-1">
                <div className="w-6 h-6 rounded-full bg-indigo-600 animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Verifying Your Email
              </h2>
              <p className="text-gray-600">
                Please wait while we confirm your email address...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <ErrorIcon />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Verification Failed
                </h2>
                <p className="text-gray-600">
                  There was an error verifying your email address. Please check
                  your verification link and try again.
                </p>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-[5px] text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <SuccessIcon />
            </div>
            <div className="absolute -bottom-1 -right-1">
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 13L9 17L19 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Email Verified!
              </h2>
              <p className="text-gray-600">
                Your email has been successfully verified. You can now log in to
                your account.
              </p>
            </div>

            <Link
              to="/auth/sign-in"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-[5px] text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
            >
              Login Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VerifyEmailAddres;
