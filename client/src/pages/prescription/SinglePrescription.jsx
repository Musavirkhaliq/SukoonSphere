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

import CompanyLogo from "../../assets/images/SukoonSphere_Logo.png";
import { BsPeople } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import customFetch from "@/utils/customFetch";
import companyLogo from "../../assets/images/SukoonSphere_Logo.png";
import { BiRightArrow } from "react-icons/bi";

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
  console.log({ prescription });

  const formattedDate = formatDate(prescription?.createdAt);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <html>
      <head>
        <title>SukoonSphere Prescription</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap');
          
          body {
            font-family: 'Merriweather', serif;
            background-color: #f5f2e9;
            color: #333;
            padding: 0;
            margin: 0;
            line-height: 1.5;
            font-size: 11pt;
          }
          
          .book-container {
            width: 100%;
            margin: 0 auto;
            padding: 10mm 5mm; /* Reduced to 5mm for tighter margins */
            background-color: #fff;
            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
            border-radius: 2px;
            box-sizing: border-box;
          }
               .book-pages {
            background-color: #f0f7ff;
            border-radius: 4px;
            min-height: 100vh;
          }
          
          .book-binding {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 35px;
            background: linear-gradient(to right, #d3c4a9, #f5f2e9);
          }
       .section-title {
            font-size: 16px;
            color: #1e40af;
            margin-bottom: 8px; 
            font-weight: 600;
            display: flex;
            align-items: center;
          }
          
          .info-grid {
            display: block;
          }
          
          .info-grid.two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px 16px; /* Reduced gaps */
          }
          
          .info-item {
            margin-bottom: 6px; /* Reduced from 8px */
          }
          
          .info-label {
            font-weight: 700;
            color: #1f2937;
            margin-right: 4px;
          }
          
          .bullet {
            display: inline-block;
            margin-right: 6px; /* Reduced from 8px */
            color: #2563eb;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            border-bottom: 2px solid #1e40af;

          }

          .clinic-info {
            text-align: left;
            padding-bottom: 0px !important;
             margin-bottom: 0px !important;
          }
          .clinic-info p {
            font-size: 11px;
            color: #4b5563;
            padding-bottom: 0px !important;
            margin-bottom: 0px !important;
          }
          .doctor-info {
           margin-bottom: 0px !important;
            padding-bottom: 0px !important;
            text-align: right;
            color: #4b5563;
          }
          
          .doctor-info h4 {
           margin-bottom: 0px !important;
            padding-bottom: 0px !important;
            font-weight: 700;
            color: #1f2937;
          }

          .section{
            margin: 20px 0px; 
          }
          
      
          .footer {
            margin-top: 10mm; /* Reduced from 16px */
            padding-top: 5mm;
            border-top: 2px solid #d1d5db;
            display: flex;
            justify-content: space-between;
          }
          
          .footer p {
            color: #4b5563;
          }
          
          .footer .date {
            font-weight: 700;
            color: #1f2937;
          }
          
          @media print {
            body {
              background: none;
              padding: 0;
              margin: 0;
            }
            .book-container {
              box-shadow: none;
              padding: 5mm; /* Consistent small margin */
              width: 100%;
              box-sizing: border-box;
            }
            .book-pages {
              padding: 5mm;
              min-height: 0;
            }
            .book-binding {
              display: none;
            }
            @page {
              size: A4;
              margin: 4px; /* Reduced from 10mm for tighter margins */
            }
            /* Forcefully remove all browser headers and footers */
            @page {
              @bottom-left { content: " "; }
              @bottom-center { content: " "; }
              @bottom-right { content: " "; }
              margin-header: 0;
              margin-footer: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="book-container">
          <div class="book-binding"></div>
          <div class="book-pages">
            <div class="header">
              <div class="clinic-info">
                <img src="${CompanyLogo}" alt="SukoonSphere Health Logo" width="220" />
                <p>Mental Health Prescription & Evaluation</p>
              </div>
              <div class="doctor-info">
                <h4>Dr. Chandana Barat</h4>
                <p>Ph.D. Biochemistry and Molecular Biology, IISc</p>
                <p>Phone: 8825063816</p>
              </div>
            </div>
              
            <div class="section">
              <h2 class="section-title">Patient Information</h2>
              <div class="info-grid two-column">
                <div class="info-item"><span class="info-label">Name:</span> ${prescription?.patientDetails?.name || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Age:</span> ${prescription?.patientDetails?.age || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Gender:</span> ${prescription?.patientDetails?.gender || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Contact Number:</span> ${prescription?.patientDetails?.contactNumber || "Not specified"}</div>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Current Status</h2>
              <div class="">
                <div class="info-item"><span class="info-label">Mood/Affect:</span> ${prescription?.currentStatus?.moodAffect || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Energy Levels:</span> ${prescription?.currentStatus?.energyLevels || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Sleep Patterns:</span> ${
                  prescription?.currentStatus?.sleepPatterns
                    ?.split("##")
                    .map((line) => `<br><span class="bullet">→</span>${line}`)
                    .join("") || "Not specified"
                }</div>
                <div class="info-item"><span class="info-label">Appetite Changes:</span> ${
                  prescription?.currentStatus?.appetiteChanges
                    ?.split("##")
                    .map((line) => `<br><span class="bullet">→</span>${line}`)
                    .join("") || "Not specified"
                }</div>
                <div class="info-item"><span class="info-label">Recent Events:</span> ${prescription?.currentStatus?.recentEvents?.map((event) => `<br><span class="bullet">→</span>${event}`).join("") || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Self-Reported Concerns:</span> ${
                  prescription?.currentStatus?.selfReportedConcerns
                    ?.split("##")
                    .map(
                      (concern) => `<br><span class="bullet">→</span>${concern}`
                    )
                    .join("") || "Not specified"
                }</div>
                <div class="info-item"><span class="info-label">Physical Health:</span> ${prescription?.currentStatus?.physicalHealth || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Substance Use:</span> ${prescription?.currentStatus?.substanceUse || "Not specified"}</div>
              </div>
              <div class="">
                <h2 class="section-title" style="margin-top: 8px">Current Medication</h2>
                ${
                  prescription?.currentStatus?.medication?.length > 0
                    ? prescription.currentStatus.medication
                        .map(
                          (med) => `
                    <div class="info-item">
                      <div><span class="info-label">Name:</span> ${med.name || "Not specified"}</div>
                      <div><span class="info-label">Dosage:</span> ${med.dosage || "Not specified"}</div>
                      <div><span class="info-label">Frequency:</span> ${med.frequency || "Not specified"}</div>
                      <div><span class="info-label">Adherence:</span> ${med.adherence || "Not specified"}</div>
                      <div><span class="info-label">Duration:</span> ${med.duration || "Not specified"}</div>
                    </div>
                  `
                        )
                        .join("")
                    : `<p>No current medications specified</p>`
                }
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Session Summary</h2>
              <div class="">
                <div class="info-item"><span class="info-label">Topics Discussed:</span> ${prescription?.sessionSummary?.topicsDiscussed?.map((event) => `<br><span class="bullet">→</span>${event}`).join("") || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Insights & Breakthroughs:</span> ${prescription?.sessionSummary?.insightsBreakthroughs || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Emotional Responses:</span> ${prescription?.sessionSummary?.emotionalResponses?.map((event) => `<br><span class="bullet">→</span>${event}`).join("") || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Techniques Used:</span> ${prescription?.sessionSummary?.techniquesUsed?.map((event) => `<br><span class="bullet">→</span>${event}`).join("") || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Engagement Level:</span> ${prescription?.sessionSummary?.engagementLevel || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Notable Quotes:</span> ${prescription?.sessionSummary?.notableQuotes?.map((quote) => `<br><span class="bullet">→</span>${quote}`).join("") || "Not specified"}</div>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Action Plan</h2>
              <div class="">
                <div class="info-item"><span class="info-label">Goals:</span> ${prescription?.actionPlan?.goals?.map((goal) => `<br><span class="bullet">→</span>${goal}`).join("") || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Homework:</span> ${prescription?.actionPlan?.homework?.map((homework) => `<br><span class="bullet">→</span>${homework}`).join("") || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Coping Strategies:</span> ${prescription?.actionPlan?.copingStrategies?.map((strategy) => `<br><span class="bullet">→</span>${strategy}`).join("") || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Lifestyle Adjustments:</span> ${prescription?.actionPlan?.lifestyleAdjustments?.map((adj) => `<br><span class="bullet">→</span>${adj}`).join("") || "Not specified"}</div>
                <div class="info-item"><span class="info-label">Resources Shared:</span> ${prescription?.actionPlan?.resourcesShared?.join(", ") || "Not specified"}</div>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Prescriptions</h2>
              <div class="info-grid ${prescription?.prescriptions?.length > 1 ? "two-column" : ""}">
                ${
                  prescription?.prescriptions &&
                  prescription.prescriptions.length > 0
                    ? prescription.prescriptions
                        .map(
                          (med) => `
                    <div class="info-item">
                      <div><span class="info-label">Medication:</span> ${med.medication || "Not specified"}</div>
                      <div><span class="info-label">Dosage:</span> ${med.dosage || "Not specified"}</div>
                      <div><span class="info-label">Frequency:</span> ${med.frequency || "Not specified"}</div>
                      <div><span class="info-label">Duration:</span> ${med.duration || "Not specified"}</div>
                      <div><span class="info-label">Changes:</span> ${med.changes || "Not specified"}</div>
                    </div>
                  `
                        )
                        .join("")
                    : `<p>No prescriptions specified</p>`
                }
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Follow-Up</h2>
              <div class="info-grid two-column">
                <div class="info-item"><span class="info-label">Next Session:</span> ${formatDate(prescription?.followUp?.nextSession) || "Not specified"}</div>
              </div>
            </div>
            
            <div class="footer">
              <div>
                <p><span class="info-label">SukoonSphere Health</span></p>
                <p>Mental Health Services</p>
              </div>
              <div class="date">
                <p>Issue Date: ${formattedDate}</p>
              </div>
            </div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              window.close();
            }, 500);
          }
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
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
              width={260}
              height={100}
              className="inline-block"
            />
            <p className="text-[var(--grey--800)] text-md">
              Mental Health Prescription & Evaluation
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--grey--800)] mt-2">
              <h4 className="text-md font-bold text-[var(--grey--900)]">
                Dr. Chandana Barat
              </h4>
              <span className="font-semibold"></span> Ph.D. Biochemistry and
              Molecular Biology, IISc
            </p>
            <p className="text-sm text-[var(--grey--800)]">
              <FaPhone className="inline mr-1" />
              8825063816
            </p>
          </div>
        </div>

        {/* Patient & Therapist Information */}
        <section className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <FaUser className="mr-2" /> Patient Information
            </h2>
            <div className="grid grid-cols-1 gap-1">
              <p>
                <span className="font-bold text-[var(--grey--900)] ">
                  Name:
                </span>{" "}
                {prescription?.patientDetails?.name || "Not specified"}
              </p>
              <p>
                <span className="font-bold text-[var(--grey--900)]">Age:</span>{" "}
                {prescription?.patientDetails?.age || "Not specified"}
              </p>
              <p>
                <span className="font-bold text-[var(--grey--900)]">
                  Gender:
                </span>{" "}
                {prescription?.patientDetails?.gender || "Not specified"}
              </p>
              <p>
                <span className="font-bold text-[var(--grey--900)]">
                  Contact Number:
                </span>{" "}
                {prescription?.patientDetails?.contactNumber || "Not specified"}
              </p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
              <FaUserMd className="mr-2" /> Therapist Information
            </h2>
            <div className="grid grid-cols-1 gap-1">
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {prescription?.therapistDetails?.name || "Not specified"}
              </p>
              <p>
                <span className="font-semibold">Credentials:</span>{" "}
                {prescription?.therapistDetails?.credentials || "Not specified"}
              </p>
              <p>
                <span className="font-semibold">Specialties:</span>{" "}
                {prescription?.therapistDetails?.specialties?.join(", ") ||
                  "Not specified"}
              </p>
              <p>
                <span className="font-semibold">Contact Number:</span>{" "}
                {prescription?.therapistDetails?.contactNumber ||
                  "Not specified"}
              </p>
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
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Mood/Affect:
                  </span>{" "}
                  {prescription?.currentStatus?.moodAffect || "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Energy Levels:
                  </span>{" "}
                  {prescription?.currentStatus?.energyLevels || "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Sleep Patterns:
                  </span>{" "}
                  {prescription?.currentStatus?.sleepPatterns
                    ?.split("##")
                    .map((line, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" /> {line}
                      </React.Fragment>
                    )) || "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Appetite Changes:
                  </span>{" "}
                  {prescription?.currentStatus?.appetiteChanges
                    ?.split("##")
                    .map((line, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" /> {line}
                      </React.Fragment>
                    )) || "Not specified"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Recent Events:
                  </span>
                  {prescription?.currentStatus?.recentEvents?.map(
                    (event, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" /> {event}
                      </React.Fragment>
                    )
                  ) || "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Self-Reported Concerns:
                  </span>{" "}
                  {prescription?.currentStatus?.selfReportedConcerns
                    ?.split("##")
                    .map((concern, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" /> {concern}
                      </React.Fragment>
                    )) || "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Physical Health:
                  </span>{" "}
                  {prescription?.currentStatus?.physicalHealth ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Substance Use:
                  </span>{" "}
                  {prescription?.currentStatus?.substanceUse || "Not specified"}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
                <FaClipboardList className="mr-2" /> Current Medication
              </h2>
              <ul className="list-disc pl-4 grid grid-cols-2 gap-4 border-l-4 border-[var(--primary)]">
                {prescription?.currentStatus?.medication?.map(
                  (medication, index) => (
                    <div
                      className="grid grid-cols-2 gap-4"
                      key={medication._id}
                    >
                      <li>
                        <p>
                          <span className="font-bold text-base text-[var(--grey--900)]">
                            Name:
                          </span>{" "}
                          {medication?.name || "Not specified"}
                        </p>
                        <p>
                          <span className="font-bold text-base text-[var(--grey--900)]">
                            Dosage:
                          </span>{" "}
                          {medication?.dosage || "Not specified"}
                        </p>
                        <p>
                          <span className="font-bold text-base text-[var(--grey--900)]">
                            Frequency:
                          </span>{" "}
                          {medication?.frequency || "Not specified"}
                        </p>
                        <p>
                          <span className="font-bold text-base text-[var(--grey--900)]">
                            Adherence:
                          </span>{" "}
                          {medication?.adherence || "Not specified"}
                        </p>
                        <p>
                          <span className="font-bold text-base text-[var(--grey--900)]">
                            Duration:
                          </span>{" "}
                          {medication?.duration || "Not specified"}
                        </p>
                      </li>
                      {prescription?.currentStatus?.medication?.length > 1 &&
                        index !==
                          prescription?.currentStatus?.medication?.length -
                            1 && (
                          <li key={medication._id}>
                            <p>
                              <span className="font-semibold">Name:</span>{" "}
                              {prescription?.currentStatus?.medication[
                                index + 1
                              ]?.name || "Not specified"}
                            </p>
                            <p>
                              <span className="font-semibold">Dosage:</span>{" "}
                              {prescription?.currentStatus?.medication[
                                index + 1
                              ]?.dosage || "Not specified"}
                            </p>
                            <p>
                              <span className="font-semibold">Frequency:</span>{" "}
                              {prescription?.currentStatus?.medication[
                                index + 1
                              ]?.frequency || "Not specified"}
                            </p>
                            <p>
                              <span className="font-semibold">Adherence:</span>{" "}
                              {prescription?.currentStatus?.medication[
                                index + 1
                              ]?.adherence || "Not specified"}
                            </p>
                            <p>
                              <span className="font-semibold">Duration:</span>{" "}
                              {prescription?.currentStatus?.medication[
                                index + 1
                              ]?.duration || "Not specified"}
                            </p>
                          </li>
                        )}
                    </div>
                  )
                )}
              </ul>
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
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Recent Events:
                  </span>
                  {prescription?.sessionSummary?.topicsDiscussed?.map(
                    (event, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" /> {event}
                      </React.Fragment>
                    )
                  ) || "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Insights & Breakthroughs:
                  </span>{" "}
                  {prescription?.sessionSummary?.insightsBreakthroughs ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Emotional Responses:
                  </span>
                  {prescription?.sessionSummary?.emotionalResponses?.map(
                    (event, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" /> {event}
                      </React.Fragment>
                    )
                  ) || "Not specified"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Techniques Used:
                  </span>{" "}
                  {prescription?.sessionSummary?.techniquesUsed?.map(
                    (event, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" /> {event}
                      </React.Fragment>
                    )
                  ) || "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Engagement Level:
                  </span>{" "}
                  {prescription?.sessionSummary?.engagementLevel ||
                    "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Notable Quotes:
                  </span>{" "}
                  {prescription?.sessionSummary?.notableQuotes?.map(
                    (quote, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" /> {quote}
                      </React.Fragment>
                    )
                  ) || "Not specified"}
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
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Goals:
                  </span>{" "}
                  {prescription?.actionPlan?.goals?.map((goal, index) => (
                    <React.Fragment key={index}>
                      <br />
                      <BiRightArrow className="inline" /> {goal}
                    </React.Fragment>
                  )) || "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Homework:
                  </span>{" "}
                  {prescription?.actionPlan?.homework?.map(
                    (homework, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" /> {homework}
                      </React.Fragment>
                    )
                  ) || "Not specified"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Coping Strategies:
                  </span>{" "}
                  {prescription?.actionPlan?.copingStrategies?.map(
                    (copingStrategy, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" /> {copingStrategy}
                      </React.Fragment>
                    )
                  ) || "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Lifestyle Adjustments:
                  </span>{" "}
                  {prescription?.actionPlan?.lifestyleAdjustments?.map(
                    (lifestyleAdjustment, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" />{" "}
                        {lifestyleAdjustment}
                      </React.Fragment>
                    )
                  ) || "Not specified"}
                </p>
                {prescription?.actionPlan?.resourcesShared && (
                  <p>
                    <span className="font-bold text-base text-[var(--grey--900)]">
                      Resources Shared:
                    </span>{" "}
                    {prescription?.actionPlan?.resourcesShared?.join(", ") ||
                      "Not specified"}
                  </p>
                )}
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
            {prescription?.prescriptions?.length > 1 ? (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {prescription.prescriptions.map((prescription, index) => (
                  <div key={index} className="mb-4">
                    <p>
                      <span className="font-bold text-base text-[var(--grey--900)]">
                        Medication:
                      </span>{" "}
                      {prescription.medication || "Not specified"}
                    </p>
                    <p>
                      <span className="font-bold text-base text-[var(--grey--900)]">
                        Dosage:
                      </span>{" "}
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
            ) : (
              <div>
                {prescription?.prescriptions?.map((prescription, index) => (
                  <div key={index} className="mb-4">
                    <p>
                      <span className="font-bold text-base text-[var(--grey--900)]">
                        Medication:
                      </span>{" "}
                      {prescription.medication || "Not specified"}
                    </p>
                    <p>
                      <span className="font-bold text-base text-[var(--grey--900)]">
                        Dosage:
                      </span>{" "}
                      {prescription.dosage || "Not specified"}
                    </p>
                    <p>
                      <span className="font-bold text-base text-[var(--grey--900)]">
                        Side Effects:
                      </span>{" "}
                      {prescription.sideEffects?.join(", ") || "Not specified"}
                    </p>
                    <p>
                      <span className="font-bold text-base text-[var(--grey--900)]">
                        Changes:
                      </span>{" "}
                      {prescription.changes || "Not specified"}
                    </p>
                    <p>
                      <span className="font-bold text-base text-[var(--grey--900)]">
                        Monitoring:
                      </span>{" "}
                      {prescription.monitoring || "Not specified"}
                    </p>
                  </div>
                ))}
              </div>
            )}
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
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Specialist:
                  </span>{" "}
                  {referral.specialist || "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Reason:
                  </span>{" "}
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
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Next Session:
                  </span>{" "}
                  {formatDate(prescription?.followUp?.nextSession) ||
                    "Not specified"}
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
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Self-Reflection:
                  </span>{" "}
                  {prescription?.patientFeedback?.selfReflection
                    ?.split("##")
                    .map((line, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" /> {line}
                      </React.Fragment>
                    )) || "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Rating:
                  </span>{" "}
                  {prescription?.patientFeedback?.rating || "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Progress Perception:
                  </span>{" "}
                  {prescription?.patientFeedback?.progressPerception
                    ?.split("##")
                    .map((line, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" /> {line}
                      </React.Fragment>
                    )) || "Not specified"}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Emotional State Post-Session:
                  </span>{" "}
                  {prescription?.patientFeedback?.emotionalStatePost
                    ?.split("##")
                    .map((line, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" /> {line}
                      </React.Fragment>
                    )) || "Not specified"}
                </p>
                <p>
                  <span className="font-bold text-base text-[var(--grey--900)]">
                    Suggestions:
                  </span>{" "}
                  {prescription?.patientFeedback?.suggestions
                    ?.split("##")
                    .map((line, index) => (
                      <React.Fragment key={index}>
                        <br />
                        <BiRightArrow className="inline" /> {line}
                      </React.Fragment>
                    )) || "Not specified"}
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
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-900 font-bold">
                Issue Date: {formattedDate}
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
