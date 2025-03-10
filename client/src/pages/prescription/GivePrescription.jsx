import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUserMd,
  FaListAlt,
  FaHistory,
  FaUsers,
  FaHome,
  FaSadTear,
  FaSmile,
  FaNotesMedical,
  FaPills,
  FaCheck,
} from "react-icons/fa";
import { MdMood, MdOutlineNotes } from "react-icons/md";
import axios from "axios";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";

const PrescriptionForm = () => {
  const { id: patientId } = useParams();

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    demographicInfo: {
      age: "",
      gender: "",
      raceEthnicity: "",
      maritalStatus: "",
      occupation: "",
      educationLevel: "",
      socioeconomicStatus: "",
      name: "",
    },
    presentingSymptoms: [
      {
        description: "",
        severity: "Mild",
        duration: "",
        impactOnFunctioning: "",
      },
    ],
    psychiatricHistory: {
      pastDiagnoses: [
        {
          diagnosis: "",
          dateDiagnosed: "",
          diagnosedBy: "",
          symptoms: [""],
        },
      ],
      previousTreatments: [""],
      treatmentAdherence: "",
      hospitalizations: [""],
    },
    familyHistory: {
      mentalHealthDiagnoses: [""],
      significantEvents: "",
    },
    socialHistory: {
      livingSituation: "",
      socialSupport: "",
      relationshipDynamics: "",
      employmentStatus: "",
      substanceUse: "",
    },
    stressors: {
      currentStressors: [""],
      majorLifeEvents: [""],
    },
    copingMechanisms: {
      healthy: [""],
      maladaptive: [""],
    },
    mentalStatusExam: {
      appearance: "",
      behavior: "",
      speech: "",
      mood: "",
      affect: "",
      thoughtProcess: "",
      thoughtContent: "",
      perceptions: "",
      cognition: "",
      insightJudgment: "",
    },
    culturalConsiderations: "",
    comorbidities: [""],
    medications: [
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
      },
    ],
    additionalNotes: "",
  });

  const totalSteps = 11;

  // Handle input change for simple fields
  const handleInputChange = (section, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  // Handle changes for nested objects
  const handleNestedChange = (section, subsection, field, value) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [subsection]: {
          ...formData[section][subsection],
          [field]: value,
        },
      },
    });
  };

  // Handle array changes
  const handleArrayChange = (section, index, value) => {
    const newArray = [...formData[section]];
    newArray[index] = value;
    setFormData({ ...formData, [section]: newArray });
  };

  // Handle nested array changes
  const handleNestedArrayChange = (section, subsection, index, value) => {
    const newArray = [...formData[section][subsection]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [subsection]: newArray,
      },
    });
  };

  // Handle array of objects changes
  const handleArrayObjectChange = (section, index, field, value) => {
    const newArray = [...formData[section]];
    newArray[index] = { ...newArray[index], [field]: value };
    setFormData({ ...formData, [section]: newArray });
  };

  // Handle nested array of objects changes
  const handleNestedArrayObjectChange = (
    section,
    subsection,
    index,
    field,
    value
  ) => {
    const newArray = [...formData[section][subsection]];
    newArray[index] = { ...newArray[index], [field]: value };
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [subsection]: newArray,
      },
    });
  };

  // Handle symptoms array in pastDiagnoses
  const handleSymptomsChange = (diagnosisIndex, symptomIndex, value) => {
    const newPastDiagnoses = [...formData.psychiatricHistory.pastDiagnoses];
    const newSymptoms = [...newPastDiagnoses[diagnosisIndex].symptoms];
    newSymptoms[symptomIndex] = value;
    newPastDiagnoses[diagnosisIndex] = {
      ...newPastDiagnoses[diagnosisIndex],
      symptoms: newSymptoms,
    };
    setFormData({
      ...formData,
      psychiatricHistory: {
        ...formData.psychiatricHistory,
        pastDiagnoses: newPastDiagnoses,
      },
    });
  };

  // Add functions to add items to arrays
  const addItemToArray = (section, subsection = null) => {
    if (subsection) {
      const newArray = [...formData[section][subsection], ""];
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [subsection]: newArray,
        },
      });
    } else {
      const newArray = [...formData[section], ""];
      setFormData({ ...formData, [section]: newArray });
    }
  };

  const addObjectToArray = (section, template) => {
    const newArray = [...formData[section], template];
    setFormData({ ...formData, [section]: newArray });
  };

  const addNestedObjectToArray = (section, subsection, template) => {
    const newArray = [...formData[section][subsection], template];
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [subsection]: newArray,
      },
    });
  };

  // Remove item from array functions
  const removeItemFromArray = (section, index, subsection = null) => {
    if (subsection) {
      if (formData[section][subsection].length > 1) {
        const newArray = [...formData[section][subsection]];
        newArray.splice(index, 1);
        setFormData({
          ...formData,
          [section]: {
            ...formData[section],
            [subsection]: newArray,
          },
        });
      }
    } else {
      if (formData[section].length > 1) {
        const newArray = [...formData[section]];
        newArray.splice(index, 1);
        setFormData({ ...formData, [section]: newArray });
      }
    }
  };

  const removeSymptomFromDiagnosis = (diagnosisIndex, symptomIndex) => {
    if (
      formData.psychiatricHistory.pastDiagnoses[diagnosisIndex].symptoms
        .length > 1
    ) {
      const newPastDiagnoses = [...formData.psychiatricHistory.pastDiagnoses];
      const newSymptoms = [...newPastDiagnoses[diagnosisIndex].symptoms];
      newSymptoms.splice(symptomIndex, 1);
      newPastDiagnoses[diagnosisIndex] = {
        ...newPastDiagnoses[diagnosisIndex],
        symptoms: newSymptoms,
      };
      setFormData({
        ...formData,
        psychiatricHistory: {
          ...formData.psychiatricHistory,
          pastDiagnoses: newPastDiagnoses,
        },
      });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await customFetch.post(`/prescriptions/${patientId}`, formData);
      toast.success("Prescription created successfully");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create prescription");
      setLoading(false);
    }
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaUser className="mr-2" /> Demographic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name*
                </label>
                <input
                  type="text"
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.demographicInfo.name}
                  onChange={(e) =>
                    handleInputChange("demographicInfo", "name", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Age*
                </label>
                <input
                  type="number"
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.demographicInfo.age}
                  onChange={(e) =>
                    handleInputChange("demographicInfo", "age", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender*
                </label>
                <select
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.demographicInfo.gender}
                  onChange={(e) =>
                    handleInputChange(
                      "demographicInfo",
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
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Race/Ethnicity
                </label>
                <input
                  type="text"
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.demographicInfo.raceEthnicity}
                  onChange={(e) =>
                    handleInputChange(
                      "demographicInfo",
                      "raceEthnicity",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Marital Status
                </label>
                <select
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.demographicInfo.maritalStatus}
                  onChange={(e) =>
                    handleInputChange(
                      "demographicInfo",
                      "maritalStatus",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Occupation
                </label>
                <input
                  type="text"
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.demographicInfo.occupation}
                  onChange={(e) =>
                    handleInputChange(
                      "demographicInfo",
                      "occupation",
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Education Level
                </label>
                <select
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.demographicInfo.educationLevel}
                  onChange={(e) =>
                    handleInputChange(
                      "demographicInfo",
                      "educationLevel",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select Education Level</option>
                  <option value="Elementary">Elementary</option>
                  <option value="High School">High School</option>
                  <option value="Some College">Some College</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Doctorate">Doctorate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Socioeconomic Status
                </label>
                <select
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.demographicInfo.socioeconomicStatus}
                  onChange={(e) =>
                    handleInputChange(
                      "demographicInfo",
                      "socioeconomicStatus",
                      e.target.value
                    )
                  }
                >
                  <option value="">Select Status</option>
                  <option value="Low income">Low income</option>
                  <option value="Middle income">Middle income</option>
                  <option value="High income">High income</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaListAlt className="mr-2" /> Presenting Symptoms
            </h2>
            {formData.presentingSymptoms.map((symptom, index) => (
              <div
                key={index}
                className="p-4 border rounded-md shadow-sm space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Symptom {index + 1}</h3>
                  {formData.presentingSymptoms.length > 1 && (
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                      onClick={() =>
                        removeItemFromArray("presentingSymptoms", index)
                      }
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={symptom.description}
                    onChange={(e) =>
                      handleArrayObjectChange(
                        "presentingSymptoms",
                        index,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Severity
                  </label>
                  <select
                    className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={symptom.severity}
                    onChange={(e) =>
                      handleArrayObjectChange(
                        "presentingSymptoms",
                        index,
                        "severity",
                        e.target.value
                      )
                    }
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="e.g., 2 weeks, 3 months"
                    value={symptom.duration}
                    onChange={(e) =>
                      handleArrayObjectChange(
                        "presentingSymptoms",
                        index,
                        "duration",
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Impact on Functioning
                  </label>
                  <textarea
                    className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={symptom.impactOnFunctioning}
                    onChange={(e) =>
                      handleArrayObjectChange(
                        "presentingSymptoms",
                        index,
                        "impactOnFunctioning",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() =>
                addObjectToArray("presentingSymptoms", {
                  description: "",
                  severity: "Mild",
                  duration: "",
                  impactOnFunctioning: "",
                })
              }
            >
              + Add Symptom
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaHistory className="mr-2" /> Psychiatric History
            </h2>

            <h3 className="font-medium mt-4">Past Diagnoses</h3>
            {formData.psychiatricHistory.pastDiagnoses.map(
              (diagnosis, diagIndex) => (
                <div
                  key={diagIndex}
                  className="p-4 border rounded-md shadow-sm space-y-3 my-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Diagnosis {diagIndex + 1}</h4>
                    {formData.psychiatricHistory.pastDiagnoses.length > 1 && (
                      <button
                        type="button"
                        className="text-red-600 hover:text-red-800"
                        onClick={() =>
                          removeItemFromArray(
                            "psychiatricHistory",
                            diagIndex,
                            "pastDiagnoses"
                          )
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Diagnosis
                    </label>
                    <input
                      type="text"
                      className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      value={diagnosis.diagnosis}
                      onChange={(e) =>
                        handleNestedArrayObjectChange(
                          "psychiatricHistory",
                          "pastDiagnoses",
                          diagIndex,
                          "diagnosis",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date Diagnosed
                    </label>
                    <input
                      type="date"
                      className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      value={
                        diagnosis.dateDiagnosed
                          ? new Date(diagnosis.dateDiagnosed)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleNestedArrayObjectChange(
                          "psychiatricHistory",
                          "pastDiagnoses",
                          diagIndex,
                          "dateDiagnosed",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Diagnosed By
                    </label>
                    <input
                      type="text"
                      className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                      value={diagnosis.diagnosedBy}
                      onChange={(e) =>
                        handleNestedArrayObjectChange(
                          "psychiatricHistory",
                          "pastDiagnoses",
                          diagIndex,
                          "diagnosedBy",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Symptoms
                    </label>
                    {diagnosis.symptoms.map((symptom, sympIndex) => (
                      <div key={sympIndex} className="flex items-center mt-2">
                        <input
                          type="text"
                          className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                          value={symptom}
                          onChange={(e) =>
                            handleSymptomsChange(
                              diagIndex,
                              sympIndex,
                              e.target.value
                            )
                          }
                        />
                        {diagnosis.symptoms.length > 1 && (
                          <button
                            type="button"
                            className="ml-2 text-red-600 hover:text-red-800"
                            onClick={() =>
                              removeSymptomFromDiagnosis(diagIndex, sympIndex)
                            }
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                      onClick={() => {
                        const newPastDiagnoses = [
                          ...formData.psychiatricHistory.pastDiagnoses,
                        ];
                        newPastDiagnoses[diagIndex] = {
                          ...newPastDiagnoses[diagIndex],
                          symptoms: [
                            ...newPastDiagnoses[diagIndex].symptoms,
                            "",
                          ],
                        };
                        setFormData({
                          ...formData,
                          psychiatricHistory: {
                            ...formData.psychiatricHistory,
                            pastDiagnoses: newPastDiagnoses,
                          },
                        });
                      }}
                    >
                      + Add Symptom
                    </button>
                  </div>
                </div>
              )
            )}
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() =>
                addNestedObjectToArray("psychiatricHistory", "pastDiagnoses", {
                  diagnosis: "",
                  dateDiagnosed: "",
                  diagnosedBy: "",
                  symptoms: [""],
                })
              }
            >
              + Add Diagnosis
            </button>

            <h3 className="font-medium mt-6">Previous Treatments</h3>
            {formData.psychiatricHistory.previousTreatments.map(
              (treatment, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={treatment}
                    onChange={(e) =>
                      handleNestedArrayChange(
                        "psychiatricHistory",
                        "previousTreatments",
                        index,
                        e.target.value
                      )
                    }
                    placeholder="e.g., CBT, Medication, Group therapy"
                  />
                  {formData.psychiatricHistory.previousTreatments.length >
                    1 && (
                    <button
                      type="button"
                      className="ml-2 text-red-600 hover:text-red-800"
                      onClick={() =>
                        removeItemFromArray(
                          "psychiatricHistory",
                          index,
                          "previousTreatments"
                        )
                      }
                    >
                      ✕
                    </button>
                  )}
                </div>
              )
            )}
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-800"
              onClick={() =>
                addItemToArray("psychiatricHistory", "previousTreatments")
              }
            >
              + Add Treatment
            </button>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Treatment Adherence
              </label>
              <textarea
                className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={formData.psychiatricHistory.treatmentAdherence}
                onChange={(e) =>
                  handleInputChange(
                    "psychiatricHistory",
                    "treatmentAdherence",
                    e.target.value
                  )
                }
                placeholder="Describe patient's adherence to past treatments"
              />
            </div>

            <h3 className="font-medium mt-4">Hospitalizations</h3>
            {formData.psychiatricHistory.hospitalizations.map(
              (hospitalization, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={hospitalization}
                    onChange={(e) =>
                      handleNestedArrayChange(
                        "psychiatricHistory",
                        "hospitalizations",
                        index,
                        e.target.value
                      )
                    }
                    placeholder="Details of hospitalization"
                  />
                  {formData.psychiatricHistory.hospitalizations.length > 1 && (
                    <button
                      type="button"
                      className="ml-2 text-red-600 hover:text-red-800"
                      onClick={() =>
                        removeItemFromArray(
                          "psychiatricHistory",
                          index,
                          "hospitalizations"
                        )
                      }
                    >
                      ✕
                    </button>
                  )}
                </div>
              )
            )}
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-800"
              onClick={() =>
                addItemToArray("psychiatricHistory", "hospitalizations")
              }
            >
              + Add Hospitalization
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaUsers className="mr-2" /> Family History
            </h2>

            <h3 className="font-medium">Mental Health Diagnoses in Family</h3>
            {formData.familyHistory.mentalHealthDiagnoses.map(
              (diagnosis, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={diagnosis}
                    onChange={(e) =>
                      handleNestedArrayChange(
                        "familyHistory",
                        "mentalHealthDiagnoses",
                        index,
                        e.target.value
                      )
                    }
                    placeholder="e.g., Mother: Depression, Father: Anxiety"
                  />
                  {formData.familyHistory.mentalHealthDiagnoses.length > 1 && (
                    <button
                      type="button"
                      className="ml-2 text-red-600 hover:text-red-800"
                      onClick={() =>
                        removeItemFromArray(
                          "familyHistory",
                          index,
                          "mentalHealthDiagnoses"
                        )
                      }
                    >
                      ✕
                    </button>
                  )}
                </div>
              )
            )}
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-800"
              onClick={() =>
                addItemToArray("familyHistory", "mentalHealthDiagnoses")
              }
            >
              + Add Family Diagnosis
            </button>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Significant Family Events
              </label>
              <textarea
                className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={formData.familyHistory.significantEvents}
                onChange={(e) =>
                  handleInputChange(
                    "familyHistory",
                    "significantEvents",
                    e.target.value
                  )
                }
                placeholder="Describe any significant family events that may impact mental health"
                rows={4}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaHome className="mr-2" /> Social History
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Living Situation
              </label>
              <textarea
                className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={formData.socialHistory.livingSituation}
                onChange={(e) =>
                  handleInputChange(
                    "socialHistory",
                    "livingSituation",
                    e.target.value
                  )
                }
                placeholder="Describe patient's living conditions and arrangement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Social Support
              </label>
              <textarea
                className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={formData.socialHistory.socialSupport}
                onChange={(e) =>
                  handleInputChange(
                    "socialHistory",
                    "socialSupport",
                    e.target.value
                  )
                }
                placeholder="Describe patient's support network"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Relationship Dynamics
              </label>
              <textarea
                className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={formData.socialHistory.relationshipDynamics}
                onChange={(e) =>
                  handleInputChange(
                    "socialHistory",
                    "relationshipDynamics",
                    e.target.value
                  )
                }
                placeholder="Describe significant relationships and their dynamics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employment Status
              </label>
              <select
                className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={formData.socialHistory.employmentStatus}
                onChange={(e) =>
                  handleInputChange(
                    "socialHistory",
                    "employmentStatus",
                    e.target.value
                  )
                }
              >
                <option value="">Select Status</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Self-employed">Self-employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Student">Student</option>
                <option value="Retired">Retired</option>
                <option value="Disability">On Disability</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Substance Use
              </label>
              <textarea
                className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={formData.socialHistory.substanceUse}
                onChange={(e) =>
                  handleInputChange(
                    "socialHistory",
                    "substanceUse",
                    e.target.value
                  )
                }
                placeholder="Describe any substance use, frequency, and impact"
                rows={3}
              />
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaSadTear className="mr-2" /> Stressors
            </h2>

            <h3 className="font-medium">Current Stressors</h3>
            {formData.stressors.currentStressors.map((stressor, index) => (
              <div key={index} className="flex items-center mt-2">
                <input
                  type="text"
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={stressor}
                  onChange={(e) =>
                    handleNestedArrayChange(
                      "stressors",
                      "currentStressors",
                      index,
                      e.target.value
                    )
                  }
                  placeholder="Describe stressor"
                />
                {formData.stressors.currentStressors.length > 1 && (
                  <button
                    type="button"
                    className="ml-2 text-red-600 hover:text-red-800"
                    onClick={() =>
                      removeItemFromArray(
                        "stressors",
                        index,
                        "currentStressors"
                      )
                    }
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-800"
              onClick={() => addItemToArray("stressors", "currentStressors")}
            >
              + Add Stressor
            </button>

            <h3 className="font-medium mt-4">Major Life Events</h3>
            {formData.stressors.majorLifeEvents.map((event, index) => (
              <div key={index} className="flex items-center mt-2">
                <input
                  type="text"
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={event}
                  onChange={(e) =>
                    handleNestedArrayChange(
                      "stressors",
                      "majorLifeEvents",
                      index,
                      e.target.value
                    )
                  }
                  placeholder="Describe major life event"
                />
                {formData.stressors.majorLifeEvents.length > 1 && (
                  <button
                    type="button"
                    className="ml-2 text-red-600 hover:text-red-800"
                    onClick={() =>
                      removeItemFromArray("stressors", index, "majorLifeEvents")
                    }
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-800"
              onClick={() => addItemToArray("stressors", "majorLifeEvents")}
            >
              + Add Life Event
            </button>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaSmile className="mr-2" /> Coping Mechanisms
            </h2>

            <h3 className="font-medium">Healthy Coping Strategies</h3>
            {formData.copingMechanisms.healthy.map((strategy, index) => (
              <div key={index} className="flex items-center mt-2">
                <input
                  type="text"
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={strategy}
                  onChange={(e) =>
                    handleNestedArrayChange(
                      "copingMechanisms",
                      "healthy",
                      index,
                      e.target.value
                    )
                  }
                  placeholder="e.g., Exercise, Meditation, Journaling"
                />
                {formData.copingMechanisms.healthy.length > 1 && (
                  <button
                    type="button"
                    className="ml-2 text-red-600 hover:text-red-800"
                    onClick={() =>
                      removeItemFromArray("copingMechanisms", index, "healthy")
                    }
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-800"
              onClick={() => addItemToArray("copingMechanisms", "healthy")}
            >
              + Add Healthy Strategy
            </button>

            <h3 className="font-medium mt-4">Maladaptive Coping Strategies</h3>
            {formData.copingMechanisms.maladaptive.map((strategy, index) => (
              <div key={index} className="flex items-center mt-2">
                <input
                  type="text"
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={strategy}
                  onChange={(e) =>
                    handleNestedArrayChange(
                      "copingMechanisms",
                      "maladaptive",
                      index,
                      e.target.value
                    )
                  }
                  placeholder="e.g., Substance use, Avoidance, Isolation"
                />
                {formData.copingMechanisms.maladaptive.length > 1 && (
                  <button
                    type="button"
                    className="ml-2 text-red-600 hover:text-red-800"
                    onClick={() =>
                      removeItemFromArray(
                        "copingMechanisms",
                        index,
                        "maladaptive"
                      )
                    }
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-800"
              onClick={() => addItemToArray("copingMechanisms", "maladaptive")}
            >
              + Add Maladaptive Strategy
            </button>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <MdMood className="mr-2" /> Mental Status Exam
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Appearance
                </label>
                <textarea
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.mentalStatusExam.appearance}
                  onChange={(e) =>
                    handleInputChange(
                      "mentalStatusExam",
                      "appearance",
                      e.target.value
                    )
                  }
                  placeholder="Describe patient's appearance"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Behavior
                </label>
                <textarea
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.mentalStatusExam.behavior}
                  onChange={(e) =>
                    handleInputChange(
                      "mentalStatusExam",
                      "behavior",
                      e.target.value
                    )
                  }
                  placeholder="Describe patient's behavior during exam"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Speech
                </label>
                <textarea
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.mentalStatusExam.speech}
                  onChange={(e) =>
                    handleInputChange(
                      "mentalStatusExam",
                      "speech",
                      e.target.value
                    )
                  }
                  placeholder="Describe patient's speech patterns"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mood
                </label>
                <textarea
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.mentalStatusExam.mood}
                  onChange={(e) =>
                    handleInputChange(
                      "mentalStatusExam",
                      "mood",
                      e.target.value
                    )
                  }
                  placeholder="Describe patient's mood"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Affect
                </label>
                <textarea
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.mentalStatusExam.affect}
                  onChange={(e) =>
                    handleInputChange(
                      "mentalStatusExam",
                      "affect",
                      e.target.value
                    )
                  }
                  placeholder="Describe patient's affect"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Thought Process
                </label>
                <textarea
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.mentalStatusExam.thoughtProcess}
                  onChange={(e) =>
                    handleInputChange(
                      "mentalStatusExam",
                      "thoughtProcess",
                      e.target.value
                    )
                  }
                  placeholder="Describe patient's thought process"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Thought Content
                </label>
                <textarea
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.mentalStatusExam.thoughtContent}
                  onChange={(e) =>
                    handleInputChange(
                      "mentalStatusExam",
                      "thoughtContent",
                      e.target.value
                    )
                  }
                  placeholder="Describe patient's thought content"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Perceptions
                </label>
                <textarea
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.mentalStatusExam.perceptions}
                  onChange={(e) =>
                    handleInputChange(
                      "mentalStatusExam",
                      "perceptions",
                      e.target.value
                    )
                  }
                  placeholder="Describe patient's perceptions (hallucinations, etc.)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cognition
                </label>
                <textarea
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.mentalStatusExam.cognition}
                  onChange={(e) =>
                    handleInputChange(
                      "mentalStatusExam",
                      "cognition",
                      e.target.value
                    )
                  }
                  placeholder="Describe patient's cognitive function"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Insight/Judgment
                </label>
                <textarea
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={formData.mentalStatusExam.insightJudgment}
                  onChange={(e) =>
                    handleInputChange(
                      "mentalStatusExam",
                      "insightJudgment",
                      e.target.value
                    )
                  }
                  placeholder="Describe patient's insight and judgment"
                />
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaNotesMedical className="mr-2" /> Medical Information
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cultural Considerations
              </label>
              <textarea
                className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={formData.culturalConsiderations}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    culturalConsiderations: e.target.value,
                  })
                }
                placeholder="Describe any cultural factors relevant to treatment"
                rows={3}
              />
            </div>

            <h3 className="font-medium mt-4">Comorbidities</h3>
            {formData.comorbidities.map((comorbidity, index) => (
              <div key={index} className="flex items-center mt-2">
                <input
                  type="text"
                  className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={comorbidity}
                  onChange={(e) =>
                    handleArrayChange("comorbidities", index, e.target.value)
                  }
                  placeholder="e.g., Diabetes, Hypertension, Chronic Pain"
                />
                {formData.comorbidities.length > 1 && (
                  <button
                    type="button"
                    className="ml-2 text-red-600 hover:text-red-800"
                    onClick={() => removeItemFromArray("comorbidities", index)}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="text-sm text-indigo-600 hover:text-indigo-800"
              onClick={() => addItemToArray("comorbidities")}
            >
              + Add Comorbidity
            </button>
          </div>
        );

      case 10:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <FaPills className="mr-2" /> Medications
            </h2>

            {formData.medications.map((medication, index) => (
              <div
                key={index}
                className="p-4 border rounded-md shadow-sm space-y-3"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Medication {index + 1}</h3>
                  {formData.medications.length > 1 && (
                    <button
                      type="button"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => removeItemFromArray("medications", index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={medication.name}
                    onChange={(e) =>
                      handleArrayObjectChange(
                        "medications",
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Medication name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dosage
                  </label>
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={medication.dosage}
                    onChange={(e) =>
                      handleArrayObjectChange(
                        "medications",
                        index,
                        "dosage",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 20mg, 50mcg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Frequency
                  </label>
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={medication.frequency}
                    onChange={(e) =>
                      handleArrayObjectChange(
                        "medications",
                        index,
                        "frequency",
                        e.target.value
                      )
                    }
                    placeholder="e.g., Once daily, Twice daily"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={medication.duration}
                    onChange={(e) =>
                      handleArrayObjectChange(
                        "medications",
                        index,
                        "duration",
                        e.target.value
                      )
                    }
                    placeholder="e.g., 30 days, 6 months"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() =>
                addObjectToArray("medications", {
                  name: "",
                  dosage: "",
                  frequency: "",
                  duration: "",
                })
              }
            >
              + Add Medication
            </button>
          </div>
        );

      case 11:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold flex items-center">
              <MdOutlineNotes className="mr-2" /> Additional Notes
            </h2>

            <div>
              <textarea
                className="w-full  bg-[var(--white-color)] p-2  border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={formData.additionalNotes}
                onChange={(e) =>
                  setFormData({ ...formData, additionalNotes: e.target.value })
                }
                placeholder="Enter any additional information, observations, or treatment recommendations"
                rows={6}
              />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium">Final Review</h3>
              <p className="text-gray-600">
                Please review all information before submitting. Once submitted,
                this prescription will be saved to the patient's record.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaUserMd className="mr-2" /> Create Prescription
          </h1>
          {/* Progress Indicator */}
          <div className="my-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {error && (
            <div className="p-4 my-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="btn-3"
                >
                  Previous
                </button>
              )}
              <div>
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="btn-2"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {loading ? (
                      <span>Submitting...</span>
                    ) : (
                      <span className="flex items-center">
                        <FaCheck className="mr-2" /> Submit Prescription
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm;
