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
  FiPlusCircle,
  FiActivity,
  FiMessageSquare,
  FiList,
  FiSave,
} from "react-icons/fi";
import { format } from "date-fns";
import customFetch from "@/utils/customFetch";
import { useParams } from "react-router-dom";

// TagInput Component for nested arrays
const TagInput = ({
  section,
  field,
  placeholder,
  formData,
  setFormData,
  nestedSection,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim() === "") return;
    if (nestedSection) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [nestedSection]: {
            ...prev[section][nestedSection],
            [field]: [...prev[section][nestedSection][field], inputValue],
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: [...prev[section][field], inputValue],
        },
      }));
    }
    setInputValue("");
  };

  const handleRemove = (index) => {
    if (nestedSection) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [nestedSection]: {
            ...prev[section][nestedSection],
            [field]: prev[section][nestedSection][field].filter(
              (_, i) => i !== index
            ),
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: prev[section][field].filter((_, i) => i !== index),
        },
      }));
    }
  };

  const tags = nestedSection
    ? formData[section][nestedSection][field]
    : formData[section][field];

  return (
    <div className="mb-4">
      <div className="flex">
        <input
          type="text"
          className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap mt-2">
        {tags.map((item, index) => (
          <div
            key={index}
            className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm mr-2 mb-2"
          >
            {item}
            <button
              type="button"
              className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
              onClick={() => handleRemove(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ArrayTagInput Component for top-level arrays
const ArrayTagInput = ({ section, placeholder, formData, setFormData }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], inputValue],
    }));
    setInputValue("");
  };

  const handleRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mb-4">
      <div className="flex">
        <input
          type="text"
          className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap mt-2">
        {formData[section].map((item, index) => (
          <div
            key={index}
            className="flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm mr-2 mb-2"
          >
            {item}
            <button
              type="button"
              className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
              onClick={() => handleRemove(index)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const GivePrescription = () => {
  const { id: patientId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [previousSessions, setPreviousSessions] = useState([]);
  const [showPreviousSessions, setShowPreviousSessions] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    patientId: patientId,
    patientDetails: { name: "", age: "", gender: "", contactNumber: "" },
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
      openFeedback: "", // Added from schema
      emotionalStatePost: "",
      suggestions: "", // Added from schema
      therapyExperience: "", // Added from schema (was missing in UI)
      additionalComments: "",
    },
    createdAt: new Date().toISOString(), // Added from schema
    updatedAt: new Date().toISOString(), // Added from schema
  });

  useEffect(() => {
    fetchPreviousSessions();
  }, [patientId]);

  const fetchPreviousSessions = async () => {
    setIsLoading(true);
    try {
      const response = await customFetch.get(
        `/prescriptions/patient/${patientId}`
      );
      setPreviousSessions(response.data.prescriptions || []);
    } catch (error) {
      console.error("Error fetching previous sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewPreviousSession = (session) => {
    setSelectedSession(session);
  };

  const handleInputChange = (section, field, value, nestedSection) => {
    setFormData((prev) => {
      if (nestedSection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [nestedSection]: {
              ...prev[section][nestedSection],
              [field]: value,
            },
          },
        };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };
    });
  };

  const handleTopLevelChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleObjectArrayChange = (
    section,
    index,
    field,
    value,
    nestedSection
  ) => {
    setFormData((prev) => {
      if (nestedSection) {
        const newArray = [...prev[section][nestedSection]];
        newArray[index] = { ...newArray[index], [field]: value };
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [nestedSection]: newArray,
          },
        };
      }
      const newArray = [...prev[section]];
      newArray[index] = { ...newArray[index], [field]: value };
      return {
        ...prev,
        [section]: newArray,
      };
    });
  };

  const handleAddObjectToArray = (section, nestedSection) => {
    let newItem = {};
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
    } else if (nestedSection === "medication") {
      newItem = { name: "", dosage: "", adherence: "" };
    }
    setFormData((prev) => {
      if (nestedSection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [nestedSection]: [...prev[section][nestedSection], newItem],
          },
        };
      }
      return {
        ...prev,
        [section]: [...prev[section], newItem],
      };
    });
  };

  const handleRemoveObjectFromArray = (section, index, nestedSection) => {
    setFormData((prev) => {
      if (nestedSection) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [nestedSection]: prev[section][nestedSection].filter(
              (_, i) => i !== index
            ),
          },
        };
      }
      return {
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index),
      };
    });
  };

  const handleSideEffectChange = (prescriptionIndex, value) => {
    if (value.trim() === "") return;
    const newPrescriptions = [...formData.prescriptions];
    newPrescriptions[prescriptionIndex].sideEffects = [
      ...newPrescriptions[prescriptionIndex].sideEffects,
      value,
    ];
    setFormData((prev) => ({ ...prev, prescriptions: newPrescriptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    console.log({ formData });

    if (!formData.patientDetails.name || !formData.therapistDetails.name) {
      alert("Please fill in required fields: Patient Name, Therapist Name.");
      setIsLoading(false);
      return;
    }

    try {
      await customFetch.post(`/prescriptions/${patientId}`, formData);
      alert("Prescription saved successfully!");
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div
        className={`fixed inset-y-0 left-0 transform ${
          showPreviousSessions ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-20 overflow-y-auto`}
      >
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Previous Sessions</h3>
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowPreviousSessions(false)}
            >
              ×
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
                  {/* {format(
                    new Date(session.basicDetails.dateTime),
                    "MMM d, yyyy"
                  )} */}
                </div>
                {/* <div className="text-sm text-gray-500">
                  Session #{session.basicDetails.sessionNumber}
                </div> */}
                {/* <div className="text-sm text-gray-500">
                  {session.basicDetails.type} - {session.basicDetails.duration}{" "}
                  min
                </div> */}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col">
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

        <div className="flex-1 container mx-auto px-4 py-6">
          <form onSubmit={handleSubmit}>
            {activeStep === 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiUser className="mr-2" /> Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        value={formData.patientDetails.age}
                        onChange={(e) =>
                          handleInputChange(
                            "patientDetails",
                            "age",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        value={formData.patientDetails.gender}
                        onChange={(e) =>
                          handleInputChange(
                            "patientDetails",
                            "gender",
                            e.target.value
                          )
                        }
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
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                        Age
                      </label>
                      <input
                        type="number"
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        value={formData.therapistDetails.age}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistDetails",
                            "age",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        value={formData.therapistDetails.gender}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistDetails",
                            "gender",
                            e.target.value
                          )
                        }
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
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Specialties
                      </label>
                      <TagInput
                        section="therapistDetails"
                        field="specialties"
                        placeholder="e.g., CBT, Trauma (press Enter to add)"
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Credentials
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                  </div>
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
                          className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                          className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                          className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                          className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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

            {activeStep === 1 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiActivity className="mr-2" /> Current Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mood/Affect
                      </label>
                      <select
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Energy Levels
                      </label>
                      <select
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sleep Patterns
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Difficulty falling asleep"
                        value={formData.currentStatus.sleepPatterns}
                        onChange={(e) =>
                          handleInputChange(
                            "currentStatus",
                            "sleepPatterns",
                            e.target.value
                          )
                        }
                        rows="2"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Appetite Changes
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Reduced appetite"
                        value={formData.currentStatus.appetiteChanges}
                        onChange={(e) =>
                          handleInputChange(
                            "currentStatus",
                            "appetiteChanges",
                            e.target.value
                          )
                        }
                        rows="2"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Recent Events
                      </label>
                      <TagInput
                        section="currentStatus"
                        field="recentEvents"
                        placeholder="e.g., Job loss (press Enter to add)"
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Self-Reported Concerns
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                      />
                    </div>
                  </div>
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
                                  "currentStatus",
                                  index,
                                  "medication"
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
                              className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                              placeholder="e.g., Sertraline"
                              value={med.name}
                              onChange={(e) =>
                                handleObjectArrayChange(
                                  "currentStatus",
                                  index,
                                  "name",
                                  e.target.value,
                                  "medication"
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
                              className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                              placeholder="e.g., 50mg"
                              value={med.dosage}
                              onChange={(e) =>
                                handleObjectArrayChange(
                                  "currentStatus",
                                  index,
                                  "dosage",
                                  e.target.value,
                                  "medication"
                                )
                              }
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Adherence
                            </label>
                            <select
                              className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                              value={med.adherence}
                              onChange={(e) =>
                                handleObjectArrayChange(
                                  "currentStatus",
                                  index,
                                  "adherence",
                                  e.target.value,
                                  "medication"
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
                        handleAddObjectToArray("currentStatus", "medication")
                      }
                    >
                      <FiPlusCircle className="mr-1" /> Add Medication
                    </button>
                  </div>
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Physical Health
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Chronic back pain"
                        value={formData.currentStatus.physicalHealth}
                        onChange={(e) =>
                          handleInputChange(
                            "currentStatus",
                            "physicalHealth",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Substance Use
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Occasional alcohol"
                        value={formData.currentStatus.substanceUse}
                        onChange={(e) =>
                          handleInputChange(
                            "currentStatus",
                            "substanceUse",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                      <TagInput
                        section="sessionSummary"
                        field="topicsDiscussed"
                        placeholder="e.g., Work stress (press Enter to add)"
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Techniques Used
                      </label>
                      <TagInput
                        section="sessionSummary"
                        field="techniquesUsed"
                        placeholder="e.g., CBT (press Enter to add)"
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emotional Responses
                      </label>
                      <TagInput
                        section="sessionSummary"
                        field="emotionalResponses"
                        placeholder="e.g., Frustration (press Enter to add)"
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notable Quotes
                      </label>
                      <TagInput
                        section="sessionSummary"
                        field="notableQuotes"
                        placeholder='e.g., "I can’t keep going" (press Enter to add)'
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Insights & Breakthroughs
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Realized avoidance pattern"
                        value={formData.sessionSummary.insightsBreakthroughs}
                        onChange={(e) =>
                          handleInputChange(
                            "sessionSummary",
                            "insightsBreakthroughs",
                            e.target.value
                          )
                        }
                        rows="4"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Engagement Level
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        value={formData.sessionSummary.engagementLevel}
                        onChange={(e) =>
                          handleInputChange(
                            "sessionSummary",
                            "engagementLevel",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiEye className="mr-2" /> Therapist Observations
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Behavior
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Poor eye contact"
                        value={formData.therapistObservations.behavior}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistObservations",
                            "behavior",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cognitive Patterns
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Distorted thinking"
                        value={formData.therapistObservations.cognitivePatterns}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistObservations",
                            "cognitivePatterns",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emotional Reactions
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Avoidance"
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
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Progress
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Improved since last session"
                        value={formData.therapistObservations.progress}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistObservations",
                            "progress",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Concerns
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Mild suicidal ideation"
                        value={formData.therapistObservations.concerns}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistObservations",
                            "concerns",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                      <TagInput
                        section="actionPlan"
                        field="goals"
                        placeholder="e.g., Reduce anxiety (press Enter to add)"
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Homework
                      </label>
                      <TagInput
                        section="actionPlan"
                        field="homework"
                        placeholder="e.g., Journal daily (press Enter to add)"
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Coping Strategies
                      </label>
                      <TagInput
                        section="actionPlan"
                        field="copingStrategies"
                        placeholder="e.g., Deep breathing (press Enter to add)"
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Lifestyle Adjustments
                      </label>
                      <TagInput
                        section="actionPlan"
                        field="lifestyleAdjustments"
                        placeholder="e.g., Improve sleep hygiene (press Enter to add)"
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resources Shared
                      </label>
                      <TagInput
                        section="actionPlan"
                        field="resourcesShared"
                        placeholder="e.g., Mindfulness app (press Enter to add)"
                        formData={formData}
                        setFormData={setFormData}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiFileText className="mr-2" /> Medication & Referrals
                </h2>
                <div>
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
                            className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                            className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                            className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                            className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                          <TagInput
                            section="prescriptions"
                            field="sideEffects"
                            placeholder="e.g., Nausea (press Enter to add)"
                            formData={{
                              prescriptions: {
                                sideEffects: prescription.sideEffects,
                              },
                            }}
                            setFormData={(newData) =>
                              handleSideEffectChange(
                                index,
                                newData.prescriptions.sideEffects.slice(-1)[0]
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
                    onClick={() => handleAddObjectToArray("prescriptions")}
                  >
                    <FiPlusCircle className="mr-1" /> Add Prescription
                  </button>

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
                            className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                            placeholder="e.g., Psychiatrist"
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
                            className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                            placeholder="e.g., Medication review"
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

                  <h3 className="text-lg font-medium mb-3 border-t pt Plants vs Zombies6">
                    Lab Tests
                  </h3>
                  <ArrayTagInput
                    section="labTests"
                    placeholder="e.g., Bloodwork (press Enter to add)"
                    formData={formData}
                    setFormData={setFormData}
                  />

                  <h3 className="text-lg font-medium mb-3 border-t pt-6">
                    Therapist Notes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Key Takeaways
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Patient needs support"
                        value={formData.therapistNotes.keyTakeaways}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistNotes",
                            "keyTakeaways",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Risks & Concerns
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Monitor self-harm"
                        value={formData.therapistNotes.risksConcerns}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistNotes",
                            "risksConcerns",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Support
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Refer to psychiatrist"
                        value={formData.therapistNotes.additionalSupport}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistNotes",
                            "additionalSupport",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Readiness
                      </label>
                      <input
                        type="text"
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Stable"
                        value={formData.therapistNotes.readiness}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistNotes",
                            "readiness",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ethical Considerations
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Confidentiality discussed"
                        value={formData.therapistNotes.ethicalConsiderations}
                        onChange={(e) =>
                          handleInputChange(
                            "therapistNotes",
                            "ethicalConsiderations",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 6 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiCalendar className="mr-2" /> Follow-up
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Next Session
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                        Preparations
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Bring journal"
                        value={formData.followUp.preparations}
                        onChange={(e) =>
                          handleInputChange(
                            "followUp",
                            "preparations",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Plan
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Call crisis line"
                        value={formData.followUp.emergencyPlan}
                        onChange={(e) =>
                          handleInputChange(
                            "followUp",
                            "emergencyPlan",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Crisis Management
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Safety plan created"
                        value={formData.followUp.crisisManagement}
                        onChange={(e) =>
                          handleInputChange(
                            "followUp",
                            "crisisManagement",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Availability
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Prefers mornings"
                        value={formData.followUp.availability}
                        onChange={(e) =>
                          handleInputChange(
                            "followUp",
                            "availability",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Felt lighter"
                        value={formData.patientFeedback.selfReflection}
                        onChange={(e) =>
                          handleInputChange(
                            "patientFeedback",
                            "selfReflection",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        value={formData.patientFeedback.rating}
                        onChange={(e) =>
                          handleInputChange(
                            "patientFeedback",
                            "rating",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Progress Perception
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Slow but steady"
                        value={formData.patientFeedback.progressPerception}
                        onChange={(e) =>
                          handleInputChange(
                            "patientFeedback",
                            "progressPerception",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Open Feedback
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Liked the homework"
                        value={formData.patientFeedback.openFeedback}
                        onChange={(e) =>
                          handleInputChange(
                            "patientFeedback",
                            "openFeedback",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emotional State Post-Session
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Calmer"
                        value={formData.patientFeedback.emotionalStatePost}
                        onChange={(e) =>
                          handleInputChange(
                            "patientFeedback",
                            "emotionalStatePost",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Suggestions
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Focus on work stress"
                        value={formData.patientFeedback.suggestions}
                        onChange={(e) =>
                          handleInputChange(
                            "patientFeedback",
                            "suggestions",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Therapy Experience
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Finding sessions helpful"
                        value={formData.patientFeedback.therapyExperience}
                        onChange={(e) =>
                          handleInputChange(
                            "patientFeedback",
                            "therapyExperience",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Comments
                      </label>
                      <textarea
                        className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                        placeholder="e.g., Any other feedback"
                        value={formData.patientFeedback.additionalComments}
                        onChange={(e) =>
                          handleInputChange(
                            "patientFeedback",
                            "additionalComments",
                            e.target.value
                          )
                        }
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 8 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <FiSend className="mr-2" /> Review & Submit
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Created At
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={formData.createdAt.slice(0, 16)}
                    onChange={(e) =>
                      handleTopLevelChange("createdAt", e.target.value)
                    }
                    disabled
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Updated At
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={formData.updatedAt.slice(0, 16)}
                    onChange={(e) =>
                      handleTopLevelChange("updatedAt", e.target.value)
                    }
                    disabled
                  />
                </div>
              </div>
            )}

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
                  type="submit"
                  disabled={isLoading}
                  className={`px-4 py-2 rounded ${
                    isLoading
                      ? "bg-green-300 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600"
                  }`}
                >
                  {isLoading ? "Saving..." : "Save"}{" "}
                  <FiSave className="inline ml-2" />
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
