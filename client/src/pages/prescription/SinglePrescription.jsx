import React from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaHeartbeat,
  FaPills,
  FaBriefcase,
  FaHome,
  FaUserMd,
  FaGraduationCap,
  FaClipboardList,
  FaPhone,
  FaHeart,
} from "react-icons/fa";
import {
  MdMood,
  MdPsychology,
  MdFamilyRestroom,
  MdOutlineHealthAndSafety,
  MdNotes,
  MdHistoryEdu,
} from "react-icons/md";
import { BsPeople } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import customFetch from "@/utils/customFetch";
import companyLogo from "../../assets/images/SukoonSphere_Logo.png";

const SinglePrescription = () => {
  const { id: prescriptionId } = useParams();
  const [prescription, setPrescription] = useState(null);

  // Fetch prescription data
  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        const { data } = await customFetch.get(
          `prescriptions/${prescriptionId}`
        );
        setPrescription(data?.prescription);
      } catch (error) {
        console.error("Error fetching prescription:", error);
      }
    };
    fetchPrescription();
  }, [prescriptionId]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formattedDate = formatDate(prescription?.createdAt);

  // Handle print functionality
  const handlePrint = () => {
    const printContents = document.getElementById("print-content").innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // Reload to restore the original content
  };

  return (
    <div className="max-w-7xl mx-auto bg-white p-8 shadow-md print:shadow-none">
      {/* Print Content */}
      <div id="print-content">
        {/* Header */}
        <div className="border-b-2 border-blue-700 pb-4 mb-6 flex justify-between items-center">
          <div>
            <img
              src={companyLogo}
              alt="Sukoonsphere Logo"
              width={120}
              height={100}
              className="inline-block"
            />
            <h1 className="text-2xl font-bold text-blue-800">
              SukoonSphere Health
            </h1>
            <p className="text-gray-600">
              Mental Health Prescription & Evaluation
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mt-2">
              <h4 className="text-md font-bold text-[var(--grey--900)]">
                Dr. Chandana Barat
              </h4>
              <span className="font-semibold"></span> Ph.D. Biochemistry and
              Molecular Biology, IISc
            </p>
            <p className="text-sm text-gray-600">
              <FaPhone className="inline mr-1" />
              8825063816
            </p>
          </div>
        </div>

        {/* Patient Information */}
        <section className="mb-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <FaUser className="mr-2" /> Patient Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {prescription?.patientDetails?.name || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Age:</span>{" "}
                  {prescription?.patientDetails?.age || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Gender:</span>{" "}
                  {prescription?.patientDetails?.gender || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Contact Number:</span>{" "}
                  {prescription?.patientDetails?.contactNumber ||
                    "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Therapist Information */}
        <section className="mb-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <FaUserMd className="mr-2" /> Therapist Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {prescription?.therapistDetails?.name || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Age:</span>{" "}
                  {prescription?.therapistDetails?.age || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Gender:</span>{" "}
                  {prescription?.therapistDetails?.gender || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Contact Number:</span>{" "}
                  {prescription?.therapistDetails?.contactNumber ||
                    "Not specified"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Credentials:</span>{" "}
                  {prescription?.therapistDetails?.credentials ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Specialties:</span>{" "}
                  {prescription?.therapistDetails?.specialties?.join(", ") ||
                    "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Session Details */}
        <section className="mb-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <FaCalendarAlt className="mr-2" /> Session Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">Date & Time:</span>{" "}
                  {formatDate(prescription?.basicDetails?.dateTime) ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Duration:</span>{" "}
                  {prescription?.basicDetails?.duration || "Not specified"}{" "}
                  minutes
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Session Type:</span>{" "}
                  {prescription?.basicDetails?.type || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Session Number:</span>{" "}
                  {prescription?.basicDetails?.sessionNumber || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Current Status */}
        <section className="mb-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <FaHeartbeat className="mr-2" /> Current Status
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">Mood/Affect:</span>{" "}
                  {prescription?.currentStatus?.moodAffect || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Energy Levels:</span>{" "}
                  {prescription?.currentStatus?.energyLevels || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Sleep Patterns:</span>{" "}
                  {prescription?.currentStatus?.sleepPatterns ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Appetite Changes:</span>{" "}
                  {prescription?.currentStatus?.appetiteChanges ||
                    "Not specified"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Recent Events:</span>{" "}
                  {prescription?.currentStatus?.recentEvents?.join(", ") ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Self-Reported Concerns:</span>{" "}
                  {prescription?.currentStatus?.selfReportedConcerns ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Physical Health:</span>{" "}
                  {prescription?.currentStatus?.physicalHealth ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Substance Use:</span>{" "}
                  {prescription?.currentStatus?.substanceUse || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Session Summary */}
        <section className="mb-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <FaClipboardList className="mr-2" /> Session Summary
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">Topics Discussed:</span>{" "}
                  {prescription?.sessionSummary?.topicsDiscussed?.join(", ") ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">
                    Insights & Breakthroughs:
                  </span>{" "}
                  {prescription?.sessionSummary?.insightsBreakthroughs ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Emotional Responses:</span>{" "}
                  {prescription?.sessionSummary?.emotionalResponses?.join(
                    ", "
                  ) || "Not specified"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Techniques Used:</span>{" "}
                  {prescription?.sessionSummary?.techniquesUsed?.join(", ") ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Engagement Level:</span>{" "}
                  {prescription?.sessionSummary?.engagementLevel ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Notable Quotes:</span>{" "}
                  {prescription?.sessionSummary?.notableQuotes?.join(", ") ||
                    "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Plan */}
        <section className="mb-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <FaBriefcase className="mr-2" /> Action Plan
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">Goals:</span>{" "}
                  {prescription?.actionPlan?.goals?.join(", ") ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Homework:</span>{" "}
                  {prescription?.actionPlan?.homework?.join(", ") ||
                    "Not specified"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Coping Strategies:</span>{" "}
                  {prescription?.actionPlan?.copingStrategies?.join(", ") ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Lifestyle Adjustments:</span>{" "}
                  {prescription?.actionPlan?.lifestyleAdjustments?.join(", ") ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Resources Shared:</span>{" "}
                  {prescription?.actionPlan?.resourcesShared?.join(", ") ||
                    "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Prescriptions */}
        <section className="mb-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <FaPills className="mr-2" /> Prescriptions
            </h2>
            {prescription?.prescriptions?.map((prescription, index) => (
              <div key={index} className="mb-4">
                <p>
                  <span className="font-semibold">Medication:</span>{" "}
                  {prescription.medication || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Dosage:</span>{" "}
                  {prescription.dosage || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Side Effects:</span>{" "}
                  {prescription.sideEffects?.join(", ") || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Changes:</span>{" "}
                  {prescription.changes || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Monitoring:</span>{" "}
                  {prescription.monitoring || "Not specified"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Referrals */}
        <section className="mb-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <FaUserMd className="mr-2" /> Referrals
            </h2>
            {prescription?.referrals?.map((referral, index) => (
              <div key={index} className="mb-4">
                <p>
                  <span className="font-semibold">Specialist:</span>{" "}
                  {referral.specialist || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Reason:</span>{" "}
                  {referral.reason || "Not specified"}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Lab Tests */}
        <section className="mb-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <FaClipboardList className="mr-2" /> Lab Tests
            </h2>
            <p>
              {prescription?.labTests?.join(", ") || "No lab tests specified"}
            </p>
          </div>
        </section>

        {/* Follow-Up */}
        <section className="mb-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <FaCalendarAlt className="mr-2" /> Follow-Up
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">Next Session:</span>{" "}
                  {formatDate(prescription?.followUp?.nextSession) ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Preparations:</span>{" "}
                  {prescription?.followUp?.preparations || "Not specified"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Emergency Plan:</span>{" "}
                  {prescription?.followUp?.emergencyPlan || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Crisis Management:</span>{" "}
                  {prescription?.followUp?.crisisManagement || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Availability:</span>{" "}
                  {prescription?.followUp?.availability || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Patient Feedback */}
        <section className="mb-6">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <FaHeart className="mr-2" /> Patient Feedback
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>
                  <span className="font-semibold">Self-Reflection:</span>{" "}
                  {prescription?.patientFeedback?.selfReflection ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Rating:</span>{" "}
                  {prescription?.patientFeedback?.rating || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Progress Perception:</span>{" "}
                  {prescription?.patientFeedback?.progressPerception ||
                    "Not specified"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">
                    Emotional State Post-Session:
                  </span>{" "}
                  {prescription?.patientFeedback?.emotionalStatePost ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Suggestions:</span>{" "}
                  {prescription?.patientFeedback?.suggestions ||
                    "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t-2 border-gray-300">
          <div className="flex justify-between">
            <div>
              <p className="font-semibold">SukoonSphere Health</p>
              <p className="text-sm text-gray-600">Mental Health Services</p>
              <p className="text-sm text-gray-600">
                Document ID: {prescription?._id}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-900 font-bold">
                Issue Date: {formattedDate}
              </p>
              <p className="text-sm text-gray-600">
                Provider ID: {prescription?.doctorId}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print button - only visible on screen, not in print */}
      <div className="mt-6 text-center print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Print Prescription
        </button>
      </div>
    </div>
  );
};

export default SinglePrescription;
