import React, { useState, useEffect } from "react";
import {
  FiClock,
  FiCalendar,
  FiUser,
  FiFileText,
  FiClipboard,
  FiEye,
  FiHeart,
  FiSend,
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiBookmark,
  FiPlusCircle,
  FiActivity,
  FiAward,
  FiEdit,
  FiMessageSquare,
  FiSearch,
  FiList,
  FiSave,
} from "react-icons/fi";
import axios from "axios";
import { format } from "date-fns";
import customFetch from "@/utils/customFetch";
import { useParams } from "react-router-dom";

const GivePrescription = () => {
  const { id: patientId } = useParams();
  console.log({ patientId });
  const [activeStep, setActiveStep] = useState(0);
  const [previousSessions, setPreviousSessions] = useState([]);
  const [showPreviousSessions, setShowPreviousSessions] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientDetails: {
      name: "",
      age: "",
      gender: "",
      contactNumber: "",
    },
    therapistDetails: {
      name: "",
      age: "",
      gender: "",
      contactNumber: "",
      specialties: [],
      credentials: "",
    },
    basicDetails: {
      dateTime: new Date().toISOString().slice(0, 16),
      duration: 60,
      type: "In-person",
      sessionNumber: "1",
    },
    currentStatus: {
      moodAffect: "calm",
      energyLevels: "medium",
      sleepPatterns: "",
      appetiteChanges: "",
      recentEvents: [],
      selfReportedConcerns: "",
      medication: [{ name: "", dosage: "", adherence: "" }],
      physicalHealth: "",
      substanceUse: "",
    },
    sessionSummary: {
      topicsDiscussed: [],
      insightsBreakthroughs: "",
      emotionalResponses: [],
      techniquesUsed: [],
      engagementLevel: "",
      notableQuotes: [],
    },
    therapistObservations: {
      behavior: "",
      cognitivePatterns: "",
      emotionalReactions: "",
      progress: "",
      concerns: "",
    },
    actionPlan: {
      goals: [],
      homework: [],
      copingStrategies: [],
      lifestyleAdjustments: [],
      resourcesShared: [],
    },
    therapistNotes: {
      keyTakeaways: "",
      risksConcerns: "",
      additionalSupport: "",
      readiness: "",
      ethicalConsiderations: "",
    },
    prescriptions: [
      {
        medication: "",
        dosage: "",
        sideEffects: [],
        changes: "",
        monitoring: "",
      },
    ],
    referrals: [{ specialist: "", reason: "" }],
    labTests: [],
    followUp: {
      nextSession: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16),
      preparations: "",
      emergencyPlan: "",
      crisisManagement: "",
      availability: "",
    },
    patientFeedback: {
      selfReflection: "",
      rating: 3,
      progressPerception: "",
      openFeedback: "",
      emotionalStatePost: "",
      suggestions: "",
    },
  });

  useEffect(() => {
    fetchPreviousSessions();
  }, []);

  const fetchPreviousSessions = async () => {
    setIsLoading(true);
    try {
      const response = customFetch.get(`/prescriptions/patient/${patientId}`);
      setPreviousSessions(response.data.prescriptions);
    } catch (error) {
      console.error("Error fetching previous sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPreviousSession = (session) => {
    setSelectedSession(session);
  };

  console.log({ previousSessions });

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayInputChange = (section, field, value) => {
    if (value.trim() === "") return;

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], value],
      },
    }));
  };

  const handleRemoveArrayItem = (section, field, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index),
      },
    }));
  };

  const handleObjectArrayChange = (section, index, field, value) => {
    const newArray = [...formData[section]];
    newArray[index] = { ...newArray[index], [field]: value };

    setFormData((prev) => ({
      ...prev,
      [section]: newArray,
    }));
  };

  const handleAddObjectToArray = (section) => {
    let newItem;

    if (section === "prescriptions") {
      newItem = {
        medication: "",
        dosage: "",
        sideEffects: [],
        changes: "",
        monitoring: "",
      };
    } else if (section === "referrals") {
      newItem = { specialist: "", reason: "" };
    } else if (section === "currentStatus") {
      newItem = { name: "", dosage: "", adherence: "" };
    }

    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], newItem],
    }));
  };

  const handleRemoveObjectFromArray = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const handleSideEffectChange = (prescriptionIndex, value) => {
    if (value.trim() === "") return;

    const newPrescriptions = [...formData.prescriptions];
    newPrescriptions[prescriptionIndex].sideEffects = [
      ...newPrescriptions[prescriptionIndex].sideEffects,
      value,
    ];

    setFormData((prev) => ({
      ...prev,
      prescriptions: newPrescriptions,
    }));
  };

  const handleRemoveSideEffect = (prescriptionIndex, effectIndex) => {
    const newPrescriptions = [...formData.prescriptions];
    newPrescriptions[prescriptionIndex].sideEffects = newPrescriptions[
      prescriptionIndex
    ].sideEffects.filter((_, i) => i !== effectIndex);

    setFormData((prev) => ({
      ...prev,
      prescriptions: newPrescriptions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Assume patientId is available in the URL or context
      const patientId = new URLSearchParams(window.location.search).get(
        "patientId"
      );
      await axios.post(`/api/prescriptions/${patientId}`, formData);
      alert("Prescription saved successfully!");
      // Reset form or redirect
    } catch (error) {
      console.error("Error submitting prescription:", error);
      alert("Failed to save prescription. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { name: "Basic Information", icon: <FiUser /> },
    { name: "Current Status", icon: <FiActivity /> },
    { name: "Session Summary", icon: <FiMessageSquare /> },
    { name: "Observations", icon: <FiEye /> },
    { name: "Action Plan", icon: <FiList /> },
    { name: "Medication & Referrals", icon: <FiFileText /> },
    { name: "Follow-up", icon: <FiCalendar /> },
    { name: "Patient Feedback", icon: <FiHeart /> },
    { name: "Review & Submit", icon: <FiSend /> },
  ];

  const nextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const renderTagInput = (section, field, placeholder) => {
    const [inputValue, setInputValue] = useState("");

    return (
      <div className="mb-4">
        <div className="flex">
          <input
            type="text"
            className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleArrayInputChange(section, field, inputValue);
                setInputValue("");
              }
            }}
          />
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
            onClick={() => {
              handleArrayInputChange(section, field, inputValue);
              setInputValue("");
            }}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap mt-2">
          {formData[section][field].map((item, index) => (
            <div
              key={index}
              className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm mr-2 mb-2"
            >
              {item}
              <button
                type="button"
                className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                onClick={() => handleRemoveArrayItem(section, field, index)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for previous sessions */}
      <div
        className={`fixed inset-y-0 left-0 transform ${showPreviousSessions ? "translate-x-0" : "-translate-x-full"} w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-20 overflow-y-auto`}
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Previous Sessions</h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowPreviousSessions(false)}
            >
              &times;
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="p-4 text-center">Loading sessions...</div>
        ) : previousSessions.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No previous sessions found
          </div>
        ) : (
          <div className="divide-y">
            {previousSessions.map((session) => (
              <div
                key={session._id}
                className="p-4 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleViewPreviousSession(session)}
              >
                <div className="font-medium">
                  {format(
                    new Date(session.basicDetails.dateTime),
                    "MMM d, yyyy"
                  )}
                </div>
                <div className="text-sm text-gray-500">
                  Session #{session.basicDetails.sessionNumber}
                </div>
                <div className="text-sm text-gray-500">
                  {session.basicDetails.type} - {session.basicDetails.duration}{" "}
                  min
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Therapy Session Record
            </h1>
            <button
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              onClick={() => setShowPreviousSessions(!showPreviousSessions)}
            >
              <FiClipboard />
              <span>Previous Sessions</span>
            </button>
          </div>
        </div>

        {/* Steps navigation */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 overflow-x-auto">
            <div className="flex py-2 min-w-max">
              {steps.map((step, index) => (
                <button
                  key={index}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md mx-1 whitespace-nowrap text-sm font-medium ${
                    activeStep === index
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <span>{step.icon}</span>
                  <span>{step.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 container mx-auto px-4 py-6">
          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            {activeStep === 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiUser className="mr-2" /> Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">
                      Patient Details
                    </h3>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.patientDetails.name}
                        onChange={(e) =>
                          handleInputChange(
                            "patientDetails",
                            "name",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.patientDetails.age}
                        onChange={(e) =>
                          handleInputChange(
                            "patientDetails",
                            "age",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.patientDetails.gender}
                        onChange={(e) =>
                          handleInputChange(
                            "patientDetails",
                            "gender",
                            e.target.value
                          )
                        }
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">
                          Prefer not to say
                        </option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.patientDetails.contactNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "patientDetails",
                            "contactNumber",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Therapist Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium border-b pb-2">
                      Therapist Details
                    </h3>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.therapistDetails.name}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistDetails",
                            "name",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credentials
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., PhD, LMFT"
                        value={formData.therapistDetails.credentials}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistDetails",
                            "credentials",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialties
                      </label>
                      {renderTagInput(
                        "therapistDetails",
                        "specialties",
                        "e.g., CBT, Trauma (press Enter to add)"
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.therapistDetails.contactNumber}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistDetails",
                            "contactNumber",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="space-y-4 md:col-span-2">
                    <h3 className="text-lg font-medium border-b pb-2">
                      Session Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <FiCalendar className="inline mr-1" /> Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.basicDetails.dateTime}
                          onChange={(e) =>
                            handleInputChange(
                              "basicDetails",
                              "dateTime",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          <FiClock className="inline mr-1" /> Duration (minutes)
                        </label>
                        <select
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.basicDetails.duration}
                          onChange={(e) =>
                            handleInputChange(
                              "basicDetails",
                              "duration",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="30">30 minutes</option>
                          <option value="45">45 minutes</option>
                          <option value="60">60 minutes</option>
                          <option value="75">75 minutes</option>
                          <option value="90">90 minutes</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Session Type
                        </label>
                        <select
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.basicDetails.type}
                          onChange={(e) =>
                            handleInputChange(
                              "basicDetails",
                              "type",
                              e.target.value
                            )
                          }
                          required
                        >
                          <option value="In-person">In-person</option>
                          <option value="Video">Video</option>
                          <option value="Phone">Phone</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Session Number
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={formData.basicDetails.sessionNumber}
                          onChange={(e) =>
                            handleInputChange(
                              "basicDetails",
                              "sessionNumber",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Current Status */}
            {activeStep === 1 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiActivity className="mr-2" /> Current Status
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mood and Energy */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mood/Affect
                      </label>
                      <select
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.currentStatus.moodAffect}
                        onChange={(e) =>
                          handleInputChange(
                            "currentStatus",
                            "moodAffect",
                            e.target.value
                          )
                        }
                      >
                        <option value="anxious">Anxious</option>
                        <option value="calm">Calm</option>
                        <option value="depressed">Depressed</option>
                        <option value="irritable">Irritable</option>
                        <option value="neutral">Neutral</option>
                        <option value="euphoric">Euphoric</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Energy Levels
                      </label>
                      <select
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.currentStatus.energyLevels}
                        onChange={(e) =>
                          handleInputChange(
                            "currentStatus",
                            "energyLevels",
                            e.target.value
                          )
                        }
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="fluctuating">Fluctuating</option>
                      </select>
                    </div>
                  </div>

                  {/* Sleep and Appetite */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sleep Patterns
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Difficulty falling asleep, early waking"
                        value={formData.currentStatus.sleepPatterns}
                        onChange={(e) =>
                          handleInputChange(
                            "currentStatus",
                            "sleepPatterns",
                            e.target.value
                          )
                        }
                        rows="2"
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Appetite Changes
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Reduced appetite, comfort eating"
                        value={formData.currentStatus.appetiteChanges}
                        onChange={(e) =>
                          handleInputChange(
                            "currentStatus",
                            "appetiteChanges",
                            e.target.value
                          )
                        }
                        rows="2"
                      ></textarea>
                    </div>
                  </div>

                  {/* Recent Events and Concerns */}
                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recent Events
                      </label>
                      {renderTagInput(
                        "currentStatus",
                        "recentEvents",
                        "e.g., Job loss, Family conflict (press Enter to add)"
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Self-Reported Concerns
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Struggling with work stress"
                        value={formData.currentStatus.selfReportedConcerns}
                        onChange={(e) =>
                          handleInputChange(
                            "currentStatus",
                            "selfReportedConcerns",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>
                  </div>

                  {/* Medication */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-3">
                      Current Medication
                    </h3>

                    {formData.currentStatus.medication.map((med, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded mb-4 bg-gray-50"
                      >
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">
                            Medication #{index + 1}
                          </h4>
                          {formData.currentStatus.medication.length > 1 && (
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700"
                              onClick={() =>
                                handleRemoveObjectFromArray(
                                  "currentStatus.medication",
                                  index
                                )
                              }
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., Sertraline"
                              value={med.name}
                              onChange={(e) =>
                                handleObjectArrayChange(
                                  "currentStatus.medication",
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Dosage
                            </label>
                            <input
                              type="text"
                              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., 50mg"
                              value={med.dosage}
                              onChange={(e) =>
                                handleObjectArrayChange(
                                  "currentStatus.medication",
                                  index,
                                  "dosage",
                                  e.target.value
                                )
                              }
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Adherence
                            </label>
                            <select
                              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              value={med.adherence}
                              onChange={(e) =>
                                handleObjectArrayChange(
                                  "currentStatus.medication",
                                  index,
                                  "adherence",
                                  e.target.value
                                )
                              }
                            >
                              <option value="">Select adherence</option>
                              <option value="Consistent">Consistent</option>
                              <option value="Occasional missed doses">
                                Occasional missed doses
                              </option>
                              <option value="Frequent missed doses">
                                Frequent missed doses
                              </option>
                              <option value="Stopped taking">
                                Stopped taking
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                      onClick={() =>
                        handleAddObjectToArray("currentStatus.medication")
                      }
                    >
                      <FiPlusCircle className="mr-1" /> Add Medication
                    </button>
                  </div>

                  {/* Physical Health and Substance Use */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Physical Health
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Chronic back pain, recent illness"
                        value={formData.currentStatus.physicalHealth}
                        onChange={(e) =>
                          handleInputChange(
                            "currentStatus",
                            "physicalHealth",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Substance Use
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Occasional alcohol, smoking"
                        value={formData.currentStatus.substanceUse}
                        onChange={(e) =>
                          handleInputChange(
                            "currentStatus",
                            "substanceUse",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Session Summary */}
            {activeStep === 2 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiMessageSquare className="mr-2" /> Session Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Topics Discussed
                      </label>
                      {renderTagInput(
                        "sessionSummary",
                        "topicsDiscussed",
                        "e.g., Work stress, Relationships (press Enter to add)"
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Techniques Used
                      </label>
                      {renderTagInput(
                        "sessionSummary",
                        "techniquesUsed",
                        "e.g., CBT, Mindfulness (press Enter to add)"
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emotional Responses
                      </label>
                      {renderTagInput(
                        "sessionSummary",
                        "emotionalResponses",
                        "e.g., Frustration, Relief (press Enter to add)"
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notable Quotes
                      </label>
                      {renderTagInput(
                        "sessionSummary",
                        "notableQuotes",
                        'e.g., "I can\'t keep going like this" (press Enter to add)'
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Insights & Breakthroughs
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Realized avoidance pattern in relationships"
                        value={formData.sessionSummary.insightsBreakthroughs}
                        onChange={(e) =>
                          handleInputChange(
                            "sessionSummary",
                            "insightsBreakthroughs",
                            e.target.value
                          )
                        }
                        rows="4"
                      ></textarea>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Engagement Level
                      </label>
                      <select
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.sessionSummary.engagementLevel}
                        onChange={(e) =>
                          handleInputChange(
                            "sessionSummary",
                            "engagementLevel",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select engagement level</option>
                        <option value="Highly engaged">Highly engaged</option>
                        <option value="Moderately engaged">
                          Moderately engaged
                        </option>
                        <option value="Minimally engaged">
                          Minimally engaged
                        </option>
                        <option value="Resistant">Resistant</option>
                        <option value="Avoidant">Avoidant</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Therapist Observations */}
            {activeStep === 3 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiEye className="mr-2" /> Therapist Observations
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Observed Behavior
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Poor eye contact, fidgeting"
                        value={formData.therapistObservations.behavior}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistObservations",
                            "behavior",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cognitive Patterns
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., All-or-nothing thinking, overgeneralization"
                        value={formData.therapistObservations.cognitivePatterns}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistObservations",
                            "cognitivePatterns",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emotional Reactions
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Avoidance when discussing childhood"
                        value={
                          formData.therapistObservations.emotionalReactions
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "therapistObservations",
                            "emotionalReactions",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Progress
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Improved since last session, using coping skills"
                        value={formData.therapistObservations.progress}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistObservations",
                            "progress",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Concerns
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Mild suicidal ideation, self-harm risk"
                        value={formData.therapistObservations.concerns}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistObservations",
                            "concerns",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                          <svg
                            className="h-5 w-5 text-yellow-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-yellow-800">
                            Important Note
                          </h3>
                          <div className="mt-2 text-sm text-yellow-700">
                            <p>
                              If you observe any indications of harm to self or
                              others, ensure you follow appropriate crisis
                              protocols and document your risk assessment and
                              safety plan.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Plan */}
            {activeStep === 4 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiList className="mr-2" /> Action Plan
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Goals
                      </label>
                      {renderTagInput(
                        "actionPlan",
                        "goals",
                        "e.g., Reduce anxiety, improve sleep quality (press Enter to add)"
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Homework
                      </label>
                      {renderTagInput(
                        "actionPlan",
                        "homework",
                        "e.g., Journal daily, practice mindfulness (press Enter to add)"
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coping Strategies
                      </label>
                      {renderTagInput(
                        "actionPlan",
                        "copingStrategies",
                        "e.g., Deep breathing, thought challenging (press Enter to add)"
                      )}
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lifestyle Adjustments
                      </label>
                      {renderTagInput(
                        "actionPlan",
                        "lifestyleAdjustments",
                        "e.g., Improve sleep hygiene, daily exercise (press Enter to add)"
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resources Shared
                      </label>
                      {renderTagInput(
                        "actionPlan",
                        "resourcesShared",
                        "e.g., Mindfulness app, book recommendation (press Enter to add)"
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Therapist Notes */}
            {activeStep === 5 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiFileText className="mr-2" /> Medication & Referrals
                </h2>

                <div>
                  {/* Prescription section */}
                  <h3 className="text-lg font-medium mb-3">Prescriptions</h3>

                  {formData.prescriptions.map((prescription, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded mb-4 bg-gray-50"
                    >
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">
                          Prescription #{index + 1}
                        </h4>
                        {formData.prescriptions.length > 1 && (
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() =>
                              handleRemoveObjectFromArray(
                                "prescriptions",
                                index
                              )
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Medication
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Zoloft"
                            value={prescription.medication}
                            onChange={(e) =>
                              handleObjectArrayChange(
                                "prescriptions",
                                index,
                                "medication",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dosage
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 50mg daily"
                            value={prescription.dosage}
                            onChange={(e) =>
                              handleObjectArrayChange(
                                "prescriptions",
                                index,
                                "dosage",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Changes
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Increased from 25mg"
                            value={prescription.changes}
                            onChange={(e) =>
                              handleObjectArrayChange(
                                "prescriptions",
                                index,
                                "changes",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Monitoring
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Check in 2 weeks"
                            value={prescription.monitoring}
                            onChange={(e) =>
                              handleObjectArrayChange(
                                "prescriptions",
                                index,
                                "monitoring",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Side Effects
                          </label>
                          <div className="flex mb-2">
                            <input
                              type="text"
                              id={`side-effect-${index}`}
                              className="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., Nausea, Insomnia"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSideEffectChange(index, e.target.value);
                                  e.target.value = "";
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                              onClick={() => {
                                const input = document.getElementById(
                                  `side-effect-${index}`
                                );
                                handleSideEffectChange(index, input.value);
                                input.value = "";
                              }}
                            >
                              Add
                            </button>
                          </div>
                          <div className="flex flex-wrap">
                            {prescription.sideEffects.map(
                              (effect, effectIndex) => (
                                <div
                                  key={effectIndex}
                                  className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm mr-2 mb-2"
                                >
                                  {effect}
                                  <button
                                    type="button"
                                    className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                                    onClick={() =>
                                      handleRemoveSideEffect(index, effectIndex)
                                    }
                                  >
                                    &times;
                                  </button>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
                    onClick={() => handleAddObjectToArray("prescriptions")}
                  >
                    <FiPlusCircle className="mr-1" /> Add Prescription
                  </button>

                  {/* Referrals section */}
                  <h3 className="text-lg font-medium mb-3 border-t pt-6">
                    Referrals
                  </h3>

                  {formData.referrals.map((referral, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded mb-4 bg-gray-50"
                    >
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">Referral #{index + 1}</h4>
                        {formData.referrals.length > 1 && (
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() =>
                              handleRemoveObjectFromArray("referrals", index)
                            }
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Specialist
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Psychiatrist, Nutritionist"
                            value={referral.specialist}
                            onChange={(e) =>
                              handleObjectArrayChange(
                                "referrals",
                                index,
                                "specialist",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reason
                          </label>
                          <input
                            type="text"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Medication review, Eating disorder assessment"
                            value={referral.reason}
                            onChange={(e) =>
                              handleObjectArrayChange(
                                "referrals",
                                index,
                                "reason",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
                    onClick={() => handleAddObjectToArray("referrals")}
                  >
                    <FiPlusCircle className="mr-1" /> Add Referral
                  </button>

                  {/* Lab Tests section */}
                  <h3 className="text-lg font-medium mb-3 border-t pt-6">
                    Lab Tests
                  </h3>
                  {renderTagInput(
                    "labTests",
                    "labTests",
                    "e.g., Thyroid panel, Vitamin D (press Enter to add)"
                  )}

                  {/* Notes section */}
                  <h3 className="text-lg font-medium mb-3 border-t pt-6">
                    Therapist Notes
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Key Takeaways
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Patient needs increased family support"
                        value={formData.therapistNotes.keyTakeaways}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistNotes",
                            "keyTakeaways",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Risks & Concerns
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Monitor for self-harm behaviors"
                        value={formData.therapistNotes.risksConcerns}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistNotes",
                            "risksConcerns",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Support Needed
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Refer to support group"
                        value={formData.therapistNotes.additionalSupport}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistNotes",
                            "additionalSupport",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Readiness for Change
                      </label>
                      <select
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.therapistNotes.readiness}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistNotes",
                            "readiness",
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select readiness</option>
                        <option value="Pre-contemplation">
                          Pre-contemplation
                        </option>
                        <option value="Contemplation">Contemplation</option>
                        <option value="Preparation">Preparation</option>
                        <option value="Action">Action</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Relapse">Relapse</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ethical Considerations
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Confidentiality limitations discussed"
                        value={formData.therapistNotes.ethicalConsiderations}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistNotes",
                            "ethicalConsiderations",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Follow-up */}
            {activeStep === 6 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiCalendar className="mr-2" /> Follow-up
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Next Session Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.followUp.nextSession}
                        onChange={(e) =>
                          handleInputChange(
                            "followUp",
                            "nextSession",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Preparations for Next Session
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Bring journal, complete worksheets"
                        value={formData.followUp.preparations}
                        onChange={(e) =>
                          handleInputChange(
                            "followUp",
                            "preparations",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Plan
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Contact crisis line if needed"
                        value={formData.followUp.emergencyPlan}
                        onChange={(e) =>
                          handleInputChange(
                            "followUp",
                            "emergencyPlan",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Crisis Management
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Safety plan created, contact support network"
                        value={formData.followUp.crisisManagement}
                        onChange={(e) =>
                          handleInputChange(
                            "followUp",
                            "crisisManagement",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability & Scheduling Notes
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Patient prefers morning appointments, is flexible on Thursdays"
                        value={formData.followUp.availability}
                        onChange={(e) =>
                          handleInputChange(
                            "followUp",
                            "availability",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Patient Feedback */}
            {activeStep === 7 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiHeart className="mr-2" /> Patient Feedback
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Self-Reflection
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Patient felt relieved after talking"
                        value={formData.patientFeedback.selfReflection}
                        onChange={(e) =>
                          handleInputChange(
                            "patientFeedback",
                            "selfReflection",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Progress Perception
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Slow but steady, frustrating"
                        value={formData.patientFeedback.progressPerception}
                        onChange={(e) =>
                          handleInputChange(
                            "patientFeedback",
                            "progressPerception",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>
                  </div>

                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emotional State Post-Session
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Calmer, more hopeful"
                        value={formData.patientFeedback.emotionalStatePost}
                        onChange={(e) =>
                          handleInputChange(
                            "patientFeedback",
                            "emotionalStatePost",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Therapy Experience
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Finding sessions helpful, wants more concrete strategies"
                        value={formData.patientFeedback.therapyExperience}
                        onChange={(e) =>
                          handleInputChange(
                            "patientFeedback",
                            "therapyExperience",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Comments
                      </label>
                      <textarea
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Any other feedback from the patient"
                        value={formData.patientFeedback.additionalComments}
                        onChange={(e) =>
                          handleInputChange(
                            "patientFeedback",
                            "additionalComments",
                            e.target.value
                          )
                        }
                        rows="3"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={activeStep === 0}
                className={`px-4 py-2 rounded ${
                  activeStep === 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
              >
                <FiArrowLeft className="inline mr-2" /> Previous
              </button>

              {activeStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Next <FiArrowRight className="inline ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Save <FiSave className="inline ml-2" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GivePrescription;
