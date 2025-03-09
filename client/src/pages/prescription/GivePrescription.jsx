import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlus, FaTrash, FaSave, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from "axios";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";

const GivePrescription = () => {
  const { id: patientId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Form state
  const [prescriptionData, setPrescriptionData] = useState({
    demographicInfo: {
      age: "",
      gender: "",
      raceEthnicity: "",
      maritalStatus: "",
      occupation: "",
      educationLevel: "",
      socioeconomicStatus: ""
    },
    presentingSymptoms: [
      {
        description: "",
        severity: "Moderate",
        duration: "",
        impactOnFunctioning: ""
      }
    ],
    psychiatricHistory: {
      pastDiagnoses: [""],
      previousTreatments: [""],
      treatmentAdherence: "",
      hospitalizations: [""]
    },
    familyHistory: {
      mentalHealthDiagnoses: [""],
      significantEvents: ""
    },
    socialHistory: {
      livingSituation: "",
      socialSupport: "",
      relationshipDynamics: "",
      employmentStatus: "",
      substanceUse: ""
    },
    stressors: {
      currentStressors: [""],
      majorLifeEvents: [""]
    },
    copingMechanisms: {
      healthy: [""],
      maladaptive: [""]
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
      insightJudgment: ""
    },
    culturalConsiderations: "",
    comorbidities: [""],
    medications: [
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: ""
      }
    ],
    additionalNotes: ""
  });

  // Handle form input changes
  const handleInputChange = (section, field, value) => {
    setPrescriptionData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle nested array changes (for arrays of strings)
  const handleArrayChange = (section, field, index, value) => {
    setPrescriptionData(prev => {
      const newArray = [...prev[section][field]];
      newArray[index] = value;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray
        }
      };
    });
  };

  // Handle nested object array changes (for arrays of objects)
  const handleObjectArrayChange = (section, index, field, value) => {
    setPrescriptionData(prev => {
      const newArray = [...prev[section]];
      newArray[index] = {
        ...newArray[index],
        [field]: value
      };
      return {
        ...prev,
        [section]: newArray
      };
    });
  };

  // Add item to array
  const addArrayItem = (section, field) => {
    setPrescriptionData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], ""]
      }
    }));
  };

  // Remove item from array
  const removeArrayItem = (section, field, index) => {
    setPrescriptionData(prev => {
      const newArray = [...prev[section][field]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray
        }
      };
    });
  };

  // Add item to object array
  const addObjectArrayItem = (section, template) => {
    setPrescriptionData(prev => ({
      ...prev,
      [section]: [...prev[section], template]
    }));
  };

  // Remove item from object array
  const removeObjectArrayItem = (section, index) => {
    setPrescriptionData(prev => {
      const newArray = [...prev[section]];
      newArray.splice(index, 1);
      return {
        ...prev,
        [section]: newArray
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await customFetch.post(`/prescriptions/${patientId}`, prescriptionData);
      toast.success("Prescription created successfully");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.msg || "Failed to create prescription");
    } finally {
      setLoading(false);
    }
  };

  // Steps content
  const steps = [
    {
      title: "Demographic Information",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Patient Demographics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.demographicInfo.name}
                onChange={(e) => handleInputChange("demographicInfo", "name", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <input
                type="number"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.demographicInfo.age}
                onChange={(e) => handleInputChange("demographicInfo", "age", e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.demographicInfo.gender}
                onChange={(e) => handleInputChange("demographicInfo", "gender", e.target.value)}
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
              <label className="block text-sm font-medium mb-1">Race/Ethnicity</label>
              <input
                type="text"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.demographicInfo.raceEthnicity}
                onChange={(e) => handleInputChange("demographicInfo", "raceEthnicity", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Marital Status</label>
              <select
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.demographicInfo.maritalStatus}
                onChange={(e) => handleInputChange("demographicInfo", "maritalStatus", e.target.value)}
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
              <label 
              className="block text-sm font-medium mb-1"
              >Occupation</label>
              <input
                type="text"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.demographicInfo.occupation}
                onChange={(e) => handleInputChange("demographicInfo", "occupation", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Education Level</label>
              <select
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.demographicInfo.educationLevel}
                onChange={(e) => handleInputChange("demographicInfo", "educationLevel", e.target.value)}
              >
                <option value="">Select Level</option>
                <option value="No formal education">No formal education</option>
                <option value="Primary education">Primary education</option>
                <option value="Secondary education">Secondary education</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Graduate">Graduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Socioeconomic Status</label>
              <select
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.demographicInfo.socioeconomicStatus}
                onChange={(e) => handleInputChange("demographicInfo", "socioeconomicStatus", e.target.value)}
              >
                <option value="">Select Status</option>
                <option value="Low income">Low income</option>
                <option value="Lower middle income">Lower middle income</option>
                <option value="Middle income">Middle income</option>
                <option value="Upper middle income">Upper middle income</option>
                <option value="High income">High income</option>
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Presenting Symptoms",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Presenting Symptoms</h3>
          {prescriptionData.presentingSymptoms.map((symptom, index) => (
            <div key={index} className="p-4 border rounded mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Symptom {index + 1}</h4>
                {prescriptionData.presentingSymptoms.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeObjectArrayItem("presentingSymptoms", index)}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={symptom.description}
                    onChange={(e) => handleObjectArrayChange("presentingSymptoms", index, "description", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Severity</label>
                  <select
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={symptom.severity}
                    onChange={(e) => handleObjectArrayChange("presentingSymptoms", index, "severity", e.target.value)}
                    required
                  >
                    <option value="Mild">Mild</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Severe">Severe</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="e.g., 3 weeks, 2 months"
                    value={symptom.duration}
                    onChange={(e) => handleObjectArrayChange("presentingSymptoms", index, "duration", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Impact on Functioning</label>
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={symptom.impactOnFunctioning}
                    onChange={(e) => handleObjectArrayChange("presentingSymptoms", index, "impactOnFunctioning", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => 
              addObjectArrayItem("presentingSymptoms", {
                description: "",
                severity: "Moderate",
                duration: "",
                impactOnFunctioning: ""
              })
            }
            className="flex items-center text-blue-500"
          >
            <FaPlus className="mr-1" /> Add Another Symptom
          </button>
        </div>
      )
    },
    {
      title: "Psychiatric History",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Psychiatric History</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Past Diagnoses</label>
            {prescriptionData.psychiatricHistory.pastDiagnoses.map((diagnosis, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={diagnosis}
                  onChange={(e) => handleArrayChange("psychiatricHistory", "pastDiagnoses", index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("psychiatricHistory", "pastDiagnoses", index)}
                  className="ml-2 text-red-500"
                  disabled={prescriptionData.psychiatricHistory.pastDiagnoses.length <= 1}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("psychiatricHistory", "pastDiagnoses")}
              className="flex items-center text-blue-500 mt-1"
            >
              <FaPlus className="mr-1" /> Add Diagnosis
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Previous Treatments</label>
            {prescriptionData.psychiatricHistory.previousTreatments.map((treatment, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={treatment}
                  onChange={(e) => handleArrayChange("psychiatricHistory", "previousTreatments", index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("psychiatricHistory", "previousTreatments", index)}
                  className="ml-2 text-red-500"
                  disabled={prescriptionData.psychiatricHistory.previousTreatments.length <= 1}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("psychiatricHistory", "previousTreatments")}
              className="flex items-center text-blue-500 mt-1"
            >
              <FaPlus className="mr-1" /> Add Treatment
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Treatment Adherence</label>
            <input
              type="text"
              className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              value={prescriptionData.psychiatricHistory.treatmentAdherence}
              onChange={(e) => handleInputChange("psychiatricHistory", "treatmentAdherence", e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Hospitalizations</label>
            {prescriptionData.psychiatricHistory.hospitalizations.map((hospitalization, index) => (
              <div key={index} className="flex items-center mb-2">
                <input
                  type="text"
                  className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={hospitalization}
                  onChange={(e) => handleArrayChange("psychiatricHistory", "hospitalizations", index, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem("psychiatricHistory", "hospitalizations", index)}
                  className="ml-2 text-red-500"
                  disabled={prescriptionData.psychiatricHistory.hospitalizations.length <= 1}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem("psychiatricHistory", "hospitalizations")}
              className="flex items-center text-blue-500 mt-1"
            >
              <FaPlus className="mr-1" /> Add Hospitalization
            </button>
          </div>
        </div>
      )
    },
    {
      title: "Family & Social History",
      content: (
        <div className="space-y-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Family History</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Mental Health Diagnoses in Family</label>
              {prescriptionData.familyHistory.mentalHealthDiagnoses.map((diagnosis, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={diagnosis}
                    onChange={(e) => handleArrayChange("familyHistory", "mentalHealthDiagnoses", index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("familyHistory", "mentalHealthDiagnoses", index)}
                    className="ml-2 text-red-500"
                    disabled={prescriptionData.familyHistory.mentalHealthDiagnoses.length <= 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("familyHistory", "mentalHealthDiagnoses")}
                className="flex items-center text-blue-500 mt-1"
              >
                <FaPlus className="mr-1" /> Add Diagnosis
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Significant Family Events</label>
              <textarea
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                rows="3"
                value={prescriptionData.familyHistory.significantEvents}
                onChange={(e) => handleInputChange("familyHistory", "significantEvents", e.target.value)}
              ></textarea>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Social History</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Living Situation</label>
                <input
                  type="text"
                  className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={prescriptionData.socialHistory.livingSituation}
                  onChange={(e) => handleInputChange("socialHistory", "livingSituation", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Social Support</label>
                <input
                  type="text"
                  className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={prescriptionData.socialHistory.socialSupport}
                  onChange={(e) => handleInputChange("socialHistory", "socialSupport", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Relationship Dynamics</label>
                <input
                  type="text"
                  className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={prescriptionData.socialHistory.relationshipDynamics}
                  onChange={(e) => handleInputChange("socialHistory", "relationshipDynamics", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Employment Status</label>
                <input
                  type="text"
                  className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  value={prescriptionData.socialHistory.employmentStatus}
                  onChange={(e) => handleInputChange("socialHistory", "employmentStatus", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Substance Use</label>
              <textarea
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                rows="3"
                value={prescriptionData.socialHistory.substanceUse}
                onChange={(e) => handleInputChange("socialHistory", "substanceUse", e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Stressors & Coping",
      content: (
        <div className="space-y-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Stressors</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Current Stressors</label>
              {prescriptionData.stressors.currentStressors.map((stressor, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={stressor}
                    onChange={(e) => handleArrayChange("stressors", "currentStressors", index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("stressors", "currentStressors", index)}
                    className="ml-2 text-red-500"
                    disabled={prescriptionData.stressors.currentStressors.length <= 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("stressors", "currentStressors")}
                className="flex items-center text-blue-500 mt-1"
              >
                <FaPlus className="mr-1" /> Add Stressor
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Major Life Events</label>
              {prescriptionData.stressors.majorLifeEvents.map((event, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={event}
                    onChange={(e) => handleArrayChange("stressors", "majorLifeEvents", index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("stressors", "majorLifeEvents", index)}
                    className="ml-2 text-red-500"
                    disabled={prescriptionData.stressors.majorLifeEvents.length <= 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("stressors", "majorLifeEvents")}
                className="flex items-center text-blue-500 mt-1"
              >
                <FaPlus className="mr-1" /> Add Life Event
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Coping Mechanisms</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Healthy Coping Strategies</label>
              {prescriptionData.copingMechanisms.healthy.map((strategy, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={strategy}
                    onChange={(e) => handleArrayChange("copingMechanisms", "healthy", index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("copingMechanisms", "healthy", index)}
                    className="ml-2 text-red-500"
                    disabled={prescriptionData.copingMechanisms.healthy.length <= 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("copingMechanisms", "healthy")}
                className="flex items-center text-blue-500 mt-1"
              >
                <FaPlus className="mr-1" /> Add Strategy
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Maladaptive Coping Strategies</label>
              {prescriptionData.copingMechanisms.maladaptive.map((strategy, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={strategy}
                    onChange={(e) => handleArrayChange("copingMechanisms", "maladaptive", index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("copingMechanisms", "maladaptive", index)}
                    className="ml-2 text-red-500"
                    disabled={prescriptionData.copingMechanisms.maladaptive.length <= 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("copingMechanisms", "maladaptive")}
                className="flex items-center text-blue-500 mt-1"
              >
                <FaPlus className="mr-1" /> Add Strategy
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Mental Status Exam",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Mental Status Examination</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Appearance</label>
              <input
                type="text"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.mentalStatusExam.appearance}
                onChange={(e) => handleInputChange("mentalStatusExam", "appearance", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Behavior</label>
              <input
                type="text"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.mentalStatusExam.behavior}
                onChange={(e) => handleInputChange("mentalStatusExam", "behavior", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Speech</label>
              <input
                type="text"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.mentalStatusExam.speech}
                onChange={(e) => handleInputChange("mentalStatusExam", "speech", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mood</label>
              <input
                type="text"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.mentalStatusExam.mood}
                onChange={(e) => handleInputChange("mentalStatusExam", "mood", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Affect</label>
              <input
                type="text"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.mentalStatusExam.affect}
                onChange={(e) => handleInputChange("mentalStatusExam", "affect", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Thought Process</label>
              <input
                type="text"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.mentalStatusExam.thoughtProcess}
                onChange={(e) => handleInputChange("mentalStatusExam", "thoughtProcess", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Thought Content</label>
              <input
                type="text"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.mentalStatusExam.thoughtContent}
                onChange={(e) => handleInputChange("mentalStatusExam", "thoughtContent", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Perceptions</label>
              <input
                type="text"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.mentalStatusExam.perceptions}
                onChange={(e) => handleInputChange("mentalStatusExam", "perceptions", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Cognition</label>
              <input
                type="text"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.mentalStatusExam.cognition}
                onChange={(e) => handleInputChange("mentalStatusExam", "cognition", e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Insight & Judgment</label>
              <input
                type="text"
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                value={prescriptionData.mentalStatusExam.insightJudgment}
                onChange={(e) => handleInputChange("mentalStatusExam", "insightJudgment", e.target.value)}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Other Considerations",
      content: (
        <div className="space-y-4">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Cultural & Medical Considerations</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Cultural Considerations</label>
              <textarea
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                rows="3"
                value={prescriptionData.culturalConsiderations}
                onChange={(e) => setPrescriptionData(prev => ({
                  ...prev,
                  culturalConsiderations: e.target.value
                }))}
              ></textarea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Comorbidities</label>
              {prescriptionData.comorbidities.map((condition, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={condition}
                    onChange={(e) => {
                      const newComorbidities = [...prescriptionData.comorbidities];
                      newComorbidities[index] = e.target.value;
                      setPrescriptionData(prev => ({
                        ...prev,
                        comorbidities: newComorbidities
                      }));
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newComorbidities = [...prescriptionData.comorbidities];
                      newComorbidities.splice(index, 1);
                      setPrescriptionData(prev => ({
                        ...prev,
                        comorbidities: newComorbidities
                      }));
                    }}
                    className="ml-2 text-red-500"
                    disabled={prescriptionData.comorbidities.length <= 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setPrescriptionData(prev => ({
                    ...prev,
                    comorbidities: [...prev.comorbidities, ""]
                  }));
                }}
                className="flex items-center text-blue-500 mt-1"
              >
                <FaPlus className="mr-1" /> Add Condition
              </button>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Medications",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Medications</h3>
          
          {prescriptionData.medications.map((medication, index) => (
            <div key={index} className="p-4 border rounded mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">Medication {index + 1}</h4>
                {prescriptionData.medications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newMedications = [...prescriptionData.medications];
                      newMedications.splice(index, 1);
                      setPrescriptionData(prev => ({
                        ...prev,
                        medications: newMedications
                      }));
                    }}
                    className="text-red-500"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={medication.name}
                    onChange={(e) => handleObjectArrayChange("medications", index, "name", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Dosage</label>
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={medication.dosage}
                    onChange={(e) => handleObjectArrayChange("medications", index, "dosage", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Frequency</label>
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={medication.frequency}
                    onChange={(e) => handleObjectArrayChange("medications", index, "frequency", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Duration</label>
                  <input
                    type="text"
                    className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    value={medication.duration}
                    onChange={(e) => handleObjectArrayChange("medications", index, "duration", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={() => {
              setPrescriptionData(prev => ({
                ...prev,
                medications: [
                  ...prev.medications, 
                  {
                    name: "",
                    dosage: "",
                    frequency: "",
                    duration: ""
                  }
                ]
              }));
            }}
            className="flex items-center text-blue-500"
          >
            <FaPlus className="mr-1" /> Add Medication
          </button>
        </div>
      )
    },
    {
      title: "Additional Notes",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
          
          <div>
            <textarea
                className="w-full  bg-[var(--white-color)] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                rows="5"
              value={prescriptionData.additionalNotes}
              onChange={(e) => setPrescriptionData(prev => ({
                ...prev,
                additionalNotes: e.target.value
              }))}
              placeholder="Enter any additional information, observations, or notes here..."
            ></textarea>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Create Prescription</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex items-center">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div 
                className={`${
                  currentStep > index 
                    ? "bg-blue-500 text-white" 
                    : currentStep === index 
                    ? "bg-blue-100 border-blue-500 text-blue-500" 
                    : "bg-gray-100"
                } rounded-full h-8 w-8 flex items-center justify-center font-medium cursor-pointer`}
                onClick={() => setCurrentStep(index + 1)}
              >
                {index + 1}
              </div>
              
              {index < steps.length - 1 && (
                <div className={`h-1 w-10 ${currentStep > index ? "bg-blue-500" : "bg-gray-200"}`}></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600">{steps[currentStep - 1].title}</span>
          <span className="text-sm text-gray-600">Step {currentStep} of {steps.length}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          {/* Current step content */}
          {steps[currentStep - 1].content}
        </div>
        
        <div className="flex justify-between mt-6">
          <button
            type="button"
            className="flex items-center px-4 py-2 bg-gray-200 rounded"
            onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
            disabled={currentStep === 1}
          >
            <FaArrowLeft className="mr-2" /> Previous
          </button>
          
          {currentStep < steps.length ? (
            <button
              type="button"
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setCurrentStep(prev => Math.min(prev + 1, steps.length))}
            >
              Next <FaArrowRight className="ml-2" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : <><FaSave className="mr-2" /> Save Prescription</>}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GivePrescription;