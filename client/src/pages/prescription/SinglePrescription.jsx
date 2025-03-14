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
  // const handlePrint = () => {
  //   const printContents = document.getElementById("print-content").innerHTML;
  //   const originalContents = document.body.innerHTML;
  //   document.body.innerHTML = printContents;
  //   window.print();
  //   document.body.innerHTML = originalContents;
  //   window.location.reload(); // Reload to restore the original content
  // };

  const handlePrint = () => {
    // Create a new print window with book-style layout
    const printWindow = window.open("", "_blank");

    // Add CSS for book styling
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
            padding: 20px;
            line-height: 1.5;
            font-size: 11pt;
          }
          
          .book-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 30px 40px;
            background-color: #fff;
            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.05) inset;
            border-radius: 2px;
            position: relative;
          }
          
          .book-pages {
            position: relative;
            padding: 15px 30px;
            background-color: #fff;
            z-index: 1;
            border-left: 1px solid #e5e5e5;
            min-height: 1100px;
            background-image: 
              radial-gradient(rgba(0,0,0,0.02) 2px, transparent 2px);
            background-size: 28px 28px;
            background-position: -14px -14px;
          }
          
          .book-binding {
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 35px;
            background: linear-gradient(to right, #d3c4a9, #f5f2e9);
            box-shadow: inset -7px 0 10px -5px rgba(0,0,0,0.1);
            border-right: 1px solid rgba(0,0,0,0.1);
          }
          
          .book-title {
            text-align: center;
            font-size: 18px;
            color: #44546A;
            margin-bottom: 20px;
            border-bottom: 1px solid #44546A;
            padding-bottom: 8px;
          }
          
          .section {
            margin-bottom: 18px;
            padding: 10px 15px;
            border-bottom: 1px dashed #d3c4a9;
          }
          
          .section-title {
            font-size: 14px;
            color: #44546A;
            margin-bottom: 8px;
            font-weight: bold;
          }
          
          /* Two-column grid for specific sections only */
          .info-grid {
            display: block;
          }
          
          .info-grid.two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 5px 15px;
          }
          
          .info-item {
            margin-bottom: 4px;
            font-size: 11pt;
          }
          
          .info-label {
            font-weight: bold;
            color: #555;
            font-size: 10.5pt;
          }
          
          .footer {
            margin-top: 25px;
            text-align: center;
            font-size: 9pt;
            color: #777;
            padding-top: 15px;
            border-top: 1px solid #d3c4a9;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #44546A;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }
          
          .clinic-info {
            text-align: center;
          }
          
          .clinic-info h1 {
            margin-bottom: 5px;
          }
          
          .clinic-info p {
            margin: 2px 0;
            font-size: 8pt;
          }
          
          .doctor-info {
            font-size: 10pt;
            text-align: right;
          }
          
          .doctor-info p {
            margin: 2px 0;
          }
          
          /* Book edge styling */
          .page-edge {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background: linear-gradient(to left, #d3c4a9, #fff);
          }
          
          /* Prescription styling */
          .prescription-item {
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px dotted #eee;
          }
          
          .prescription-item:last-child {
            border-bottom: none;
          }
          
          /* Full-width sections where applicable */
          .full-width {
            width: 100%;
          }
          
          @media print {
            body {
              background: none;
            }
            
            .book-container {
              box-shadow: none;
              padding: 10px;
            }
            
            .book-pages {
              padding: 0 20px;
            }
            
            .no-print {
              display: none;
            }
            
            /* Remove date/time headers from print */
            @page {
              margin: 0;
              size: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="book-container">
          <div class="book-binding"></div>
          <div class="page-edge"></div>
          <div class="book-pages">
            <div class="header">
              <div class="clinic-info">
                <img src="${CompanyLogo}" alt="SukoonSphere Health Logo" class="logo" width="220" />
                <p>Mental Health Prescription & Evaluation</p>
              </div>
              <div class="doctor-info">
                <p>Dr. Chandana Barat</p>
                <p>Ph.D. Biochemistry and Molecular Biology, IISc</p>
                <p>Phone: 8825063816</p>
              </div>
            </div>
            
  `);

    // Write content sections - two columns for basic information sections
    printWindow.document.write(`
    <div class="section">
      <h2 class="section-title">Patient Information</h2>
      <div class="info-grid two-column">
        <div class="info-item">
          <span class="info-label">Name:</span> ${prescription?.patientDetails?.name || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Age:</span> ${prescription?.patientDetails?.age || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Gender:</span> ${prescription?.patientDetails?.gender || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Contact Number:</span> ${prescription?.patientDetails?.contactNumber || "Not specified"}
        </div>
      </div>
    </div>

  `);

    // Current Status section - longer text items better as single column
    printWindow.document.write(`
    <div class="section">
      <h2 class="section-title">Current Status</h2>
      <div class="info-grid two-column">
        <div class="info-item">
          <span class="info-label">Mood/Affect:</span> ${prescription?.currentStatus?.moodAffect || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Energy Levels:</span> ${prescription?.currentStatus?.energyLevels || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Sleep Patterns:</span> ${prescription?.currentStatus?.sleepPatterns || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Appetite Changes:</span> ${prescription?.currentStatus?.appetiteChanges || "Not specified"}
        </div>
      </div>
      <div class="info-grid">  <!-- Single column for potentially longer content -->
        <div class="info-item">
          <span class="info-label">Recent Events:</span> ${prescription?.currentStatus?.recentEvents?.join(", ") || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Self-Reported Concerns:</span> ${prescription?.currentStatus?.selfReportedConcerns || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Physical Health:</span> ${prescription?.currentStatus?.physicalHealth || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Substance Use:</span> ${prescription?.currentStatus?.substanceUse || "Not specified"}
        </div>
      </div>
    </div>
  `);

    // Session Summary - single column for detailed text
    printWindow.document.write(`
    <div class="section">
      <h2 class="section-title">Session Summary</h2>
      <div class="info-grid">  <!-- Single column for detailed text -->
        <div class="info-item">
          <span class="info-label">Topics Discussed:</span> ${prescription?.sessionSummary?.topicsDiscussed?.join(", ") || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Insights & Breakthroughs:</span> ${prescription?.sessionSummary?.insightsBreakthroughs || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Emotional Responses:</span> ${prescription?.sessionSummary?.emotionalResponses?.join(", ") || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Techniques Used:</span> ${prescription?.sessionSummary?.techniquesUsed?.join(", ") || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Engagement Level:</span> ${prescription?.sessionSummary?.engagementLevel || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Notable Quotes:</span> ${prescription?.sessionSummary?.notableQuotes?.join(", ") || "Not specified"}
        </div>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">Action Plan</h2>
      <div class="info-grid">  <!-- Single column for detailed text -->
        <div class="info-item">
          <span class="info-label">Goals:</span> ${prescription?.actionPlan?.goals?.join(", ") || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Homework:</span> ${prescription?.actionPlan?.homework?.join(", ") || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Coping Strategies:</span> ${prescription?.actionPlan?.copingStrategies?.join(", ") || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Lifestyle Adjustments:</span> ${prescription?.actionPlan?.lifestyleAdjustments?.join(", ") || "Not specified"}
        </div>
        <div class="info-item">
          <span class="info-label">Resources Shared:</span> ${prescription?.actionPlan?.resourcesShared?.join(", ") || "Not specified"}
        </div>
      </div>
    </div>
  `);

    // Add prescriptions - two columns for medication details
    printWindow.document.write(`
    <div class="section">
      <h2 class="section-title">Prescriptions</h2>
  `);

    if (prescription?.prescriptions && prescription.prescriptions.length > 0) {
      prescription.prescriptions.forEach((med, index) => {
        printWindow.document.write(`
        <div class="prescription-item">
          <div class="info-grid two-column">
            <div class="info-item">
              <span class="info-label">Medication:</span> ${med.medication || "Not specified"}
            </div>
            <div class="info-item">
              <span class="info-label">Dosage:</span> ${med.dosage || "Not specified"}
            </div>
            <div class="info-item">
              <span class="info-label">Side Effects:</span> ${med.sideEffects?.join(", ") || "Not specified"}
            </div>
            <div class="info-item">
              <span class="info-label">Changes:</span> ${med.changes || "Not specified"}
            </div>
            <div class="info-item">
              <span class="info-label">Monitoring:</span> ${med.monitoring || "Not specified"}
            </div>
          </div>
        </div>
      `);
      });
    } else {
      printWindow.document.write(`<p>No prescriptions specified</p>`);
    }

    printWindow.document.write(`</div>`);

    // Complete the document with remaining sections and footer
    printWindow.document.write(`
            <div class="section">
              <h2 class="section-title">Follow-Up</h2>
              <div class="info-grid two-column">
                <div class="info-item">
                  <span class="info-label">Next Session:</span> ${formatDate(prescription?.followUp?.nextSession) || "Not specified"}
                </div>
                <div class="info-item">
                  <span class="info-label">Preparations:</span> ${prescription?.followUp?.preparations || "Not specified"}
                </div>
                <div class="info-item">
                  <span class="info-label">Emergency Plan:</span> ${prescription?.followUp?.emergencyPlan || "Not specified"}
                </div>
                <div class="info-item">
                  <span class="info-label">Crisis Management:</span> ${prescription?.followUp?.crisisManagement || "Not specified"}
                </div>
              </div>
            </div>
            
            <div class="footer">
              <p>SukoonSphere Health - Mental Health Services</p>
              <p>Issue Date: ${formattedDate}</p>
            </div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            // Remove browser-generated headers and footers
            const style = document.createElement('style');
            style.innerHTML = '@page { size: auto; margin: 0mm; }';
            document.head.appendChild(style);
            
            // Print after a short delay to ensure styles are applied
            setTimeout(function() {
              window.print();
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
