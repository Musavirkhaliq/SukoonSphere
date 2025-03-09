import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  FaUser, 
  FaNotesMedical, 
  FaHistory, 
  FaFileMedical,
  FaUserMd,
  FaPrint,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa";
import customFetch from "@/utils/customFetch";
import CompanyLogo from "../../assets/images/SukoonSphere_Logo.png";

const SinglePrescription = () => {
  const { id: prescriptionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const printRef = useRef();

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        setLoading(true);
        const { data } = await customFetch.get(`prescriptions/${prescriptionId}`);
        setPrescription(data.prescription);
        console.log(data);
      } catch (error) {
        console.error("Error fetching prescription:", error);
        setError("Failed to load prescription");
      } finally {
        setLoading(false);
      }
    };
    fetchPrescription();
  }, [prescriptionId]);

  const nextPage = () => {
    if (currentPage < 3) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handlePrint = () => {
    const printContent = document.getElementById('printable-prescription');
    const originalContents = document.body.innerHTML;
    
    document.body.innerHTML = printContent.innerHTML;
    
    window.print();
    
    document.body.innerHTML = originalContents;
    
    // Reattach event listeners and reset React state
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-semibold text-blue-600">Loading prescription...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  const renderPageContent = () => {
    switch (currentPage) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-blue-800 flex items-center">
              <FaUser className="mr-2" /> Patient Information
            </h2>
            
            {/* Demographics */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Demographics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{prescription.demographicInfo.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium">{prescription.demographicInfo.age} years</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium">{prescription.demographicInfo.gender}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-600">Occupation:</span>
                  <span className="font-medium">{prescription.demographicInfo.occupation || "Not specified"}</span>
                </div>
              </div>
            </div>
            
            {/* Presenting Symptoms */}
            <h2 className="text-xl font-semibold text-blue-800 flex items-center">
              <FaNotesMedical className="mr-2" /> Presenting Symptoms
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              {prescription.presentingSymptoms && prescription.presentingSymptoms.length > 0 ? (
                prescription.presentingSymptoms.map((symptom, index) => (
                  <div key={index} className="mb-3 p-3 bg-white rounded-md shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-gray-600">Description:</span>
                        <span className="font-medium">{symptom.description || "Not specified"}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600">Severity:</span>
                        <span className={`font-medium ${
                          symptom.severity === 'Mild' ? 'text-green-600' : 
                          symptom.severity === 'Moderate' ? 'text-yellow-600' : 
                          symptom.severity === 'Severe' ? 'text-red-600' : ''
                        }`}>
                          {symptom.severity || "Not specified"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No symptoms documented</p>
              )}
            </div>
            
            {/* Psychiatric History */}
            <h2 className="text-xl font-semibold text-blue-800 flex items-center mt-6">
              <FaHistory className="mr-2" /> Psychiatric History
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="mb-4">
                <h3 className="font-medium text-gray-700">Past Diagnoses:</h3>
                {prescription.psychiatricHistory && prescription.psychiatricHistory.pastDiagnoses && prescription.psychiatricHistory.pastDiagnoses.length > 0 ? (
                  <ul className="list-disc pl-5 mt-2">
                    {prescription.psychiatricHistory.pastDiagnoses.map((diagnosis, index) => (
                      <li key={index} className="mt-1">{diagnosis}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic mt-1">No past diagnoses documented</p>
                )}
              </div>
              
              <div className="mb-2">
                <h3 className="font-medium text-gray-700">Previous Treatments:</h3>
                {prescription.psychiatricHistory && prescription.psychiatricHistory.previousTreatments && prescription.psychiatricHistory.previousTreatments.length > 0 ? (
                  <ul className="list-disc pl-5 mt-2">
                    {prescription.psychiatricHistory.previousTreatments.map((treatment, index) => (
                      <li key={index} className="mt-1">{treatment}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 italic mt-1">No previous treatments documented</p>
                )}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {/* Mental Status */}
            <h2 className="text-xl font-semibold text-blue-800 flex items-center">
              <FaUserMd className="mr-2" /> Mental Status Exam
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {prescription.mentalStatusExam && Object.entries(prescription.mentalStatusExam)
                  .filter(([_, value]) => value)
                  .map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                      <span className="text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
              </div>
              {(!prescription.mentalStatusExam || Object.values(prescription.mentalStatusExam).every(v => !v)) && (
                <p className="text-gray-500 italic">No mental status exam documented</p>
              )}
            </div>
            
            {/* Coping & Stressors - Condensed */}
            <h2 className="text-xl font-semibold text-blue-800 flex items-center">
              <FaNotesMedical className="mr-2" /> Stressors & Support
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current Stressors */}
                <div>
                  <h3 className="font-medium text-gray-700">Current Stressors:</h3>
                  {prescription.stressors && prescription.stressors.currentStressors && prescription.stressors.currentStressors.length > 0 ? (
                    <ul className="list-disc pl-5 mt-2">
                      {prescription.stressors.currentStressors.map((stressor, index) => (
                        <li key={index} className="mt-1">{stressor}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 italic mt-1">None documented</p>
                  )}
                </div>
                
                {/* Social Support */}
                <div>
                  <h3 className="font-medium text-gray-700">Social Support:</h3>
                  <p className="mt-2">{prescription.socialHistory && prescription.socialHistory.socialSupport || "Not specified"}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-blue-800 flex items-center">
              <FaFileMedical className="mr-2" /> Medications & Notes
            </h2>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-3">Prescribed Medications:</h3>
              {prescription.medications && prescription.medications.length > 0 ? (
                <div className="space-y-3">
                  {prescription.medications.map((medication, index) => (
                    <div key={index} className="p-3 bg-white rounded-md shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-gray-600">Medication:</span>
                          <span className="font-medium text-blue-800">{medication.name}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-600">Dosage:</span>
                          <span className="font-medium">{medication.dosage}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-600">Frequency:</span>
                          <span className="font-medium">{medication.frequency}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{medication.duration || "As directed"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No medications prescribed</p>
              )}
              
              <h3 className="font-medium text-gray-700 mt-6 mb-3">Additional Notes:</h3>
              <div className="p-3 bg-white rounded-md shadow-sm">
                <p className="whitespace-pre-line">{prescription.additionalNotes || "No additional notes"}</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Combine all pages for printing
  const renderAllPages = () => {
    return (
      <div>
        {/* Page 1 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-800">Patient Information</h2>
          <div className="bg-blue-50 p-4 rounded-lg mb-6 mt-2">
            <h3 className="font-medium text-gray-700 mb-2">Demographics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{prescription.demographicInfo.age} years</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium">{prescription.demographicInfo.gender}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">Occupation:</span>
                <span className="font-medium">{prescription.demographicInfo.occupation || "Not specified"}</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-blue-800">Presenting Symptoms</h2>
          <div className="bg-blue-50 p-4 rounded-lg mt-2">
            {prescription.presentingSymptoms && prescription.presentingSymptoms.length > 0 ? (
              prescription.presentingSymptoms.map((symptom, index) => (
                <div key={index} className="mb-3 p-3 bg-white rounded-md shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-medium">{symptom.description || "Not specified"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-gray-600">Severity:</span>
                      <span className="font-medium">{symptom.severity || "Not specified"}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No symptoms documented</p>
            )}
          </div>
          
          <h2 className="text-xl font-semibold text-blue-800 mt-6">Psychiatric History</h2>
          <div className="bg-blue-50 p-4 rounded-lg mt-2">
            <div className="mb-4">
              <h3 className="font-medium text-gray-700">Past Diagnoses:</h3>
              {prescription.psychiatricHistory && prescription.psychiatricHistory.pastDiagnoses && prescription.psychiatricHistory.pastDiagnoses.length > 0 ? (
                <ul className="list-disc pl-5 mt-2">
                  {prescription.psychiatricHistory.pastDiagnoses.map((diagnosis, index) => (
                    <li key={index} className="mt-1">{diagnosis}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic mt-1">No past diagnoses documented</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Page 2 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-800">Mental Status Exam</h2>
          <div className="bg-blue-50 p-4 rounded-lg mt-2 mb-6">
            <div className="grid grid-cols-2 gap-3">
              {prescription.mentalStatusExam && Object.entries(prescription.mentalStatusExam)
                .filter(([_, value]) => value)
                .map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
            </div>
            {(!prescription.mentalStatusExam || Object.values(prescription.mentalStatusExam).every(v => !v)) && (
              <p className="text-gray-500 italic">No mental status exam documented</p>
            )}
          </div>
        </div>
        
        {/* Page 3 */}
        <div>
          <h2 className="text-xl font-semibold text-blue-800">Medications & Notes</h2>
          <div className="bg-blue-50 p-4 rounded-lg mt-2">
            <h3 className="font-medium text-gray-700 mb-3">Prescribed Medications:</h3>
            {prescription.medications && prescription.medications.length > 0 ? (
              <div className="space-y-3">
                {prescription.medications.map((medication, index) => (
                  <div key={index} className="p-3 bg-white rounded-md shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-gray-600">Medication:</span>
                        <span className="font-medium text-blue-800">{medication.name}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600">Dosage:</span>
                        <span className="font-medium">{medication.dosage}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600">Frequency:</span>
                        <span className="font-medium">{medication.frequency}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{medication.duration || "As directed"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No medications prescribed</p>
            )}
            
            <h3 className="font-medium text-gray-700 mt-6 mb-3">Additional Notes:</h3>
            <div className="p-3 bg-white rounded-md shadow-sm">
              <p>{prescription.additionalNotes || "No additional notes"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hidden printable version with all data */}
      <div id="printable-prescription" className="hidden">
        <div className="p-4">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <img src={CompanyLogo} alt="Logo" className="w-20 mb-2 " />
            </div>
            <h1 className="text-2xl font-bold">Psychiatric Evaluation & Prescription abc</h1>
            <p className="mt-1">Date: {new Date(prescription.createdAt).toLocaleDateString()}</p>
          </div>
          
          {renderAllPages()}
        </div>
      </div>
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-blue-600 p-4 text-white">
          <div>
            <h1 className="text-2xl font-bold">Psychiatric Evaluation & Prescription</h1>
            <p className="text-sm md:text-base">Created: {new Date(prescription.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center space-x-2 mt-2 md:mt-0">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white text-blue-600 rounded font-medium flex items-center"
            >
              <FaPrint className="mr-2" /> Print Prescription
            </button>
          </div>
        </div>
        
        {/* Reference IDs */}
        <div className="bg-gray-100 p-3 border-b grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <span className="text-gray-600 font-medium">Patient ID:</span> 
            <span className="ml-2">{prescription.patientId}</span>
          </div>
          <div>
            <span className="text-gray-600 font-medium">Doctor ID:</span> 
            <span className="ml-2">{prescription.doctorId}</span>
          </div>
        </div>
        
        {/* Page Navigation */}
        <div className="flex justify-between items-center bg-gray-100 p-3 border-b">
          <button 
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded flex items-center ${currentPage === 1 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            <FaChevronLeft className="mr-1" /> Previous
          </button>
          
          <div className="font-medium">
            Page {currentPage} of 3
          </div>
          
          <button 
            onClick={nextPage}
            disabled={currentPage === 3}
            className={`px-3 py-1 rounded flex items-center ${currentPage === 3 ? 'text-gray-400' : 'text-blue-600 hover:bg-blue-50'}`}
          >
            Next <FaChevronRight className="ml-1" />
          </button>
        </div>
        
        {/* Page Content */}
        <div className="p-6" ref={printRef}>
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
};

export default SinglePrescription;