import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FiEye,
  FiCalendar,
  FiClock,
  FiUser,
  FiActivity,
  FiFileText,
  FiChevronRight,
  FiTrendingUp,
} from "react-icons/fi";
import customFetch from "@/utils/customFetch";
import { useUser } from "@/context/UserContext";

const PatientPrescriptions = () => {
  const { id: patientId } = useParams();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const { data } = await customFetch.get(
          `prescriptions/patient/${patientId}`
        );
        setPrescriptions(data.prescriptions);
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setError("Failed to load prescriptions");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  // Format date in a friendly way
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get session icon based on type
  const getSessionIcon = (type) => {
    if (type === "Video") return "👨‍💻";
    if (type === "Phone") return "📱";
    return "👥"; // in-person default
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 mt-4">Loading your prescriptions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 font-medium">{error}</p>
          <p className="text-gray-600 mt-2">
            Please try again or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Your Prescription History
            </h2>
            <p className="text-gray-600">
              Review and access your complete therapy journey
            </p>
          </div>
        </div>

        {/* Empty state */}
        {prescriptions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-4">
              <FiFileText className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No prescriptions found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no prescriptions available for your account at this
              time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map((prescription) => {
              return (
                <div
                  key={prescription._id}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
                >
                  {/* Top status bar */}
                  <div className="h-2 bg-[var(--grey--900)]"></div>

                  <div className="p-6">
                    {/* Session info */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <span className="text-2xl mr-2">
                          {getSessionIcon(prescription.basicDetails?.type)}
                        </span>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Session #
                            {prescription.basicDetails?.sessionNumber || "1"}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {prescription.basicDetails?.type || "Session"} •{" "}
                            {prescription.basicDetails?.duration || "--"} min
                          </p>
                        </div>
                      </div>

                      {/* Date badge */}
                      <div className="flex items-center text-sm text-gray-500">
                        <FiCalendar className="mr-1" />
                        {formatDate(prescription.createdAt)}
                      </div>
                    </div>

                    {/* Other details */}
                    <div className="space-y-2 mb-6">
                      {prescription.therapistDetails?.name && (
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-5 mr-2 text-gray-400">👩‍⚕️</div>
                          <span>
                            {prescription.therapistDetails.name
                              .toLowerCase()
                              .includes("dr")
                              ? prescription.therapistDetails.name
                              : `Dr. ${prescription.therapistDetails.name}`}
                          </span>
                        </div>
                      )}

                      {prescription.followUp?.nextSession && (
                        <div className="flex items-center text-sm text-gray-600">
                          <div className="w-5 mr-2 text-gray-400">📅</div>
                          <span>
                            Next Session :{" "}
                            {formatDate(prescription.followUp.nextSession)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action button */}
                    <Link
                      to={`/view-prescription/${prescription._id}`}
                      className="w-full btn-1 !py-2 !px-1  text-[9px]"
                    >
                      <FiEye className="mr-2" /> View Full Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPrescriptions;
