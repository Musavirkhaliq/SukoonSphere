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
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const { id: prescriptionId } = useParams();
  const [prescription, setPrescription] = useState(null);

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

  const formattedDate = formatDate(prescription?.createdAt);

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
                  {prescription?.demographicInfo?.name || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Age:</span>{" "}
                  {prescription?.demographicInfo?.age}
                </p>
                <p>
                  <span className="font-semibold">Gender:</span>{" "}
                  {prescription?.demographicInfo?.gender}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-semibold">Ethnicity:</span>{" "}
                  {prescription?.demographicInfo?.raceEthnicity ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Marital Status:</span>{" "}
                  {prescription?.demographicInfo?.maritalStatus ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Occupation:</span>{" "}
                  {prescription?.demographicInfo?.occupation || "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Education Level:</span>{" "}
                  {prescription?.demographicInfo?.educationLevel ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-semibold">Socioeconomic Status:</span>{" "}
                  {prescription?.demographicInfo?.socioeconomicStatus ||
                    "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Presenting Symptoms */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center border-b pb-1">
              <MdPsychology className="mr-2" /> Presenting Symptoms
            </h2>
            {prescription?.presentingSymptoms &&
            prescription.presentingSymptoms.length > 0 ? (
              <ul className="list-disc pl-6">
                {prescription.presentingSymptoms.map((symptom, index) => (
                  <li key={index} className="mb-2">
                    <div className="font-medium">
                      {symptom.description || "Unspecified symptom"}
                    </div>
                    {symptom.severity && (
                      <div>Severity: {symptom.severity}</div>
                    )}
                    {symptom.duration && (
                      <div>Duration: {symptom.duration}</div>
                    )}
                    {symptom.impactOnFunctioning && (
                      <div>Impact: {symptom.impactOnFunctioning}</div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No symptoms recorded</p>
            )}
          </section>

          {/* Mental Status Exam */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center border-b pb-1">
              <MdMood className="mr-2" /> Mental Status Examination
            </h2>
            <div className="grid grid-cols-1 gap-2">
              <p>
                <span className="font-semibold">Appearance:</span>{" "}
                {prescription?.mentalStatusExam?.appearance || "Not assessed"}
              </p>
              <p>
                <span className="font-semibold">Behavior:</span>{" "}
                {prescription?.mentalStatusExam?.behavior || "Not assessed"}
              </p>
              <p>
                <span className="font-semibold">Speech:</span>{" "}
                {prescription?.mentalStatusExam?.speech || "Not assessed"}
              </p>
              <p>
                <span className="font-semibold">Mood:</span>{" "}
                {prescription?.mentalStatusExam?.mood || "Not assessed"}
              </p>
              <p>
                <span className="font-semibold">Affect:</span>{" "}
                {prescription?.mentalStatusExam?.affect || "Not assessed"}
              </p>
              <p>
                <span className="font-semibold">Thought Process:</span>{" "}
                {prescription?.mentalStatusExam?.thoughtProcess ||
                  "Not assessed"}
              </p>
              <p>
                <span className="font-semibold">Thought Content:</span>{" "}
                {prescription?.mentalStatusExam?.thoughtContent ||
                  "Not assessed"}
              </p>
              <p>
                <span className="font-semibold">Perceptions:</span>{" "}
                {prescription?.mentalStatusExam?.perceptions || "Not assessed"}
              </p>
              <p>
                <span className="font-semibold">Cognition:</span>{" "}
                {prescription?.mentalStatusExam?.cognition || "Not assessed"}
              </p>
              <p>
                <span className="font-semibold">Insight/Judgment:</span>{" "}
                {prescription?.mentalStatusExam?.insightJudgment ||
                  "Not assessed"}
              </p>
            </div>
          </section>

          {/* Psychiatric History */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center border-b pb-1">
              <MdHistoryEdu className="mr-2" /> Psychiatric History
            </h2>
            <div>
              <h4 className="font-bold mt-2">Past Diagnoses:</h4>
              {prescription?.psychiatricHistory?.pastDiagnoses &&
              prescription.psychiatricHistory.pastDiagnoses.length > 0 ? (
                <ul className="list-disc pl-6 mb-2">
                  {prescription.psychiatricHistory.pastDiagnoses.map(
                    (diagnosis, index) => (
                      <li key={index}>
                        <div>
                          {diagnosis.diagnosis || "Unspecified diagnosis"}
                        </div>
                        {diagnosis.dateDiagnosed && (
                          <div className="text-sm">
                            Date: {formatDate(diagnosis.dateDiagnosed)}
                          </div>
                        )}
                        {diagnosis.diagnosedBy && (
                          <div className="text-sm">
                            Diagnosed by: {diagnosis.diagnosedBy}
                          </div>
                        )}
                        {diagnosis.symptoms &&
                          diagnosis.symptoms.length > 0 && (
                            <div className="text-sm">
                              Symptoms: {diagnosis.symptoms.join(", ")}
                            </div>
                          )}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p className="pl-2 mb-2">No past diagnoses recorded</p>
              )}

              <h4 className="font-bold">Previous Treatments:</h4>
              {prescription?.psychiatricHistory?.previousTreatments &&
              prescription.psychiatricHistory.previousTreatments.length > 0 ? (
                <ul className="list-disc pl-6 mb-2">
                  {prescription.psychiatricHistory.previousTreatments.map(
                    (treatment, index) => (
                      <li key={index}>{treatment}</li>
                    )
                  )}
                </ul>
              ) : (
                <p className="pl-2 mb-2">No previous treatments recorded</p>
              )}

              <p>
                <span className="font-semibold">Treatment Adherence:</span>{" "}
                {prescription?.psychiatricHistory?.treatmentAdherence ||
                  "Not specified"}
              </p>

              <h4 className="font-bold">Hospitalizations:</h4>
              {prescription?.psychiatricHistory?.hospitalizations &&
              prescription.psychiatricHistory.hospitalizations.length > 0 ? (
                <ul className="list-disc pl-6">
                  {prescription.psychiatricHistory.hospitalizations.map(
                    (hospitalization, index) => (
                      <li key={index}>{hospitalization}</li>
                    )
                  )}
                </ul>
              ) : (
                <p className="pl-2">No hospitalizations recorded</p>
              )}
            </div>
          </section>

          {/* Medications */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center border-b pb-1">
              <FaPills className="mr-2" /> Medications
            </h2>
            {prescription?.medications &&
            prescription.medications.length > 0 ? (
              <ul className="list-disc pl-6">
                {prescription.medications.map((med, index) => (
                  <li key={index} className="mb-2">
                    <div className="font-medium">
                      {med.name || "Unspecified medication"}
                    </div>
                    {med.dosage && <div>Dosage: {med.dosage}</div>}
                    {med.frequency && <div>Frequency: {med.frequency}</div>}
                    {med.duration && <div>Duration: {med.duration}</div>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No current medications</p>
            )}
          </section>

          {/* Family History */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center border-b pb-1">
              <MdFamilyRestroom className="mr-2" /> Family History
            </h2>
            <div>
              <h4 className="font-bold">Mental Health Diagnoses:</h4>
              {prescription?.familyHistory?.mentalHealthDiagnoses &&
              prescription.familyHistory.mentalHealthDiagnoses.length > 0 ? (
                <ul className="list-disc pl-6 mb-2">
                  {prescription.familyHistory.mentalHealthDiagnoses.map(
                    (diagnosis, index) => (
                      <li key={index}>{diagnosis}</li>
                    )
                  )}
                </ul>
              ) : (
                <p className="pl-2 mb-2">
                  No family mental health diagnoses reported
                </p>
              )}

              <p>
                <span className="font-semibold">Significant Events:</span>{" "}
                {prescription?.familyHistory?.significantEvents ||
                  "None reported"}
              </p>
            </div>
          </section>

          {/* Comorbidities */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center border-b pb-1">
              <FaHeartbeat className="mr-2" /> Comorbidities
            </h2>
            {prescription?.comorbidities &&
            prescription.comorbidities.length > 0 ? (
              <ul className="list-disc pl-6">
                {prescription.comorbidities.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            ) : (
              <p>No comorbidities reported</p>
            )}
          </section>

          {/* Social History */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center border-b pb-1">
              <BsPeople className="mr-2" /> Social History
            </h2>
            <div>
              <p>
                <span className="font-semibold">Living Situation:</span>{" "}
                {prescription?.socialHistory?.livingSituation ||
                  "Not specified"}
              </p>
              <p>
                <span className="font-semibold">Social Support:</span>{" "}
                {prescription?.socialHistory?.socialSupport || "Not specified"}
              </p>
              <p>
                <span className="font-semibold">Relationship Dynamics:</span>{" "}
                {prescription?.socialHistory?.relationshipDynamics ||
                  "Not specified"}
              </p>
              <p>
                <span className="font-semibold">Employment Status:</span>{" "}
                {prescription?.socialHistory?.employmentStatus ||
                  "Not specified"}
              </p>
              <p>
                <span className="font-semibold">Substance Use:</span>{" "}
                {prescription?.socialHistory?.substanceUse || "Not specified"}
              </p>
            </div>
          </section>

          {/* Stressors */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center border-b pb-1">
              <FaBriefcase className="mr-2" /> Stressors
            </h2>
            <div>
              <h4 className="font-bold">Current Stressors:</h4>
              {prescription?.stressors?.currentStressors &&
              prescription.stressors.currentStressors.length > 0 ? (
                <ul className="list-disc pl-6 mb-2">
                  {prescription.stressors.currentStressors.map(
                    (stressor, index) => (
                      <li key={index}>{stressor}</li>
                    )
                  )}
                </ul>
              ) : (
                <p className="pl-2 mb-2">No current stressors reported</p>
              )}

              <h4 className="font-bold">Major Life Events:</h4>
              {prescription?.stressors?.majorLifeEvents &&
              prescription.stressors.majorLifeEvents.length > 0 ? (
                <ul className="list-disc pl-6">
                  {prescription.stressors.majorLifeEvents.map(
                    (event, index) => (
                      <li key={index}>{event}</li>
                    )
                  )}
                </ul>
              ) : (
                <p className="pl-2">No major life events reported</p>
              )}
            </div>
          </section>

          {/* Coping Mechanisms */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center border-b pb-1">
              {/* <BsBrain className="mr-2" /> Coping Mechanisms */}
            </h2>
            <div>
              <h4 className="font-bold text-[var(--grey--900)]">
                Healthy Mechanisms:
              </h4>
              {prescription?.copingMechanisms?.healthy &&
              prescription.copingMechanisms.healthy.length > 0 ? (
                <ul className="list-disc pl-6 mb-2">
                  {prescription.copingMechanisms.healthy.map(
                    (mechanism, index) => (
                      <li key={index}>{mechanism}</li>
                    )
                  )}
                </ul>
              ) : (
                <p className="pl-2 mb-2">
                  No healthy coping mechanisms reported
                </p>
              )}

              <h4 className="font-bold text-[var(--grey--900)]">
                Maladaptive Mechanisms:
              </h4>
              {prescription?.copingMechanisms?.maladaptive &&
              prescription.copingMechanisms.maladaptive.length > 0 ? (
                <ul className="list-disc pl-6">
                  {prescription.copingMechanisms.maladaptive.map(
                    (mechanism, index) => (
                      <li key={index}>{mechanism}</li>
                    )
                  )}
                </ul>
              ) : (
                <p className="pl-2">
                  No maladaptive coping mechanisms reported
                </p>
              )}
            </div>
          </section>

          {/* Cultural Considerations */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center border-b pb-1">
              <FaGraduationCap className="mr-2" /> Cultural Considerations
            </h2>
            <p>{prescription?.culturalConsiderations || "None specified"}</p>
          </section>

          {/* Additional Notes */}
          <section className="mb-6 md:col-span-2">
            <h2 className="text-lg font-semibold text-blue-800 mb-2 flex items-center border-b pb-1">
              <MdNotes className="mr-2" /> Additional Notes
            </h2>
            <p className="whitespace-pre-line">
              {prescription?.additionalNotes || "No additional notes"}
            </p>
          </section>
        </div>

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
