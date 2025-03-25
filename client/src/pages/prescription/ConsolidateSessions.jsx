import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaUser, FaClipboardList, FaBriefcase } from "react-icons/fa";
import { BiRightArrow } from "react-icons/bi";
import customFetch from "@/utils/customFetch";
import CompanyLogo from "../../assets/images/SukoonSphere_Logo.png";

const ConsolidateSessions = () => {
  const { id: patientId } = useParams();
  const [prescriptions, setPrescriptions] = useState([]);

  // Fetch prescription data (array of sessions)
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const { data } = await customFetch.get(
          `/prescriptions/patient/${patientId}`
        );
        setPrescriptions(
          Array.isArray(data?.prescriptions) ? data.prescriptions : []
        );
        console.log({ data });
      } catch (error) {
        console.error("Error fetching prescriptions:", error);
        setPrescriptions([]);
      }
    };
    fetchPrescriptions();
  }, [patientId]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");

    // Patient Information (single instance, taken from first session)
    const patientInfoSection = `
      <div class="section">
        <h2 class="section-title">Patient Information</h2>
        <div class="info-grid two-column">
          <div class="info-item"><span class="info-label">Name:</span> ${prescriptions[0]?.patientDetails?.name || "Not specified"}</div>
          <div class="info-item"><span class="info-label">Age:</span> ${prescriptions[0]?.patientDetails?.age || "Not specified"}</div>
          <div class="info-item"><span class="info-label">Gender:</span> ${prescriptions[0]?.patientDetails?.gender || "Not specified"}</div>
          <div class="info-item"><span class="info-label">Contact Number:</span> ${prescriptions[0]?.patientDetails?.contactNumber || "Not specified"}</div>
        </div>
      </div>
    `;

    // Session content (mapped over prescriptions)
    const sessionContent = prescriptions
      .map(
        (prescription, index) => `
        <div class="session-section" style="page-break-before: ${index > 0 ? "always" : "auto"};">
          <div class="date-header" style="margin-top: 20px; padding-top: 10px; border-bottom: 2px solid #d1d5db; text-align: center;">
            <p style="font-size: 12pt; color: #1f2937; font-weight: 700;">Prescription Issue Date: ${formatDate(prescription?.createdAt)}</p>
          </div>

          <div class="section">
            <h2 class="section-title">Session ${prescription?.basicDetails?.sessionNumber || index + 1} - Session Summary</h2>
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
            <h2 class="section-title">Session ${prescription?.basicDetails?.sessionNumber || index + 1} - Action Plan</h2>
            <div class="">
              <div class="info-item"><span class="info-label">Goals:</span> ${prescription?.actionPlan?.goals?.map((goal) => `<br><span class="bullet">→</span>${goal}`).join("") || "Not specified"}</div>
              <div class="info-item"><span class="info-label">Homework:</span> ${prescription?.actionPlan?.homework?.map((homework) => `<br><span class="bullet">→</span>${homework}`).join("") || "Not specified"}</div>
              <div class="info-item"><span class="info-label">Coping Strategies:</span> ${prescription?.actionPlan?.copingStrategies?.map((strategy) => `<br><span class="bullet">→</span>${strategy}`).join("") || "Not specified"}</div>
              <div class="info-item"><span class="info-label">Lifestyle Adjustments:</span> ${prescription?.actionPlan?.lifestyleAdjustments?.map((adj) => `<br><span class="bullet">→</span>${adj}`).join("") || "Not specified"}</div>
              <div class="info-item"><span class="info-label">Resources Shared:</span> ${prescription?.actionPlan?.resourcesShared?.join(", ") || "Not specified"}</div>
            </div>
          </div>
        </div>
      `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>SukoonSphere Consolidated Sessions</title>
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
              padding: 10mm 5mm;
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
              gap: 8px 16px;
            }
            
            .info-item {
              margin-bottom: 6px;
            }
            
            .info-label {
              font-weight: 700;
              color: #1f2937;
              margin-right: 4px;
            }
            
            .bullet {
              display: inline-block;
              margin-right: 6px;
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
            .section {
              margin: 20px 0px;
            }
            
            @media print {
              body {
                background: none;
                padding: 0;
                margin: 0;
              }
              .book-container {
                box-shadow: none;
                padding: 5mm;
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
                margin: 4px;
              }
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
              
              ${patientInfoSection}
              ${sessionContent}
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
      {/* Header */}
      <div className="border-b-2 border-blue-700 pb-4 mb-6 flex justify-between items-center">
        <div>
          <img
            src={CompanyLogo}
            alt="SukoonSphere Logo"
            width={260}
            height={100}
            className="inline-block"
          />
          <p className="text-[var(--grey--800)] text-md">
            Mental Health Prescription & Evaluation
          </p>
        </div>
        <div className="text-right">
          <h4 className="text-md font-bold text-[var(--grey--900)]">
            Dr. Chandana Barat
          </h4>
          <p className="text-sm text-[var(--grey--800)]">
            Ph.D. Biochemistry and Molecular Biology, IISc
          </p>
          <p className="text-sm text-[var(--grey--800)]">
            <FaUser className="inline mr-1" /> 8825063816
          </p>
        </div>
      </div>

      {/* Patient Information */}
      <section className="mb-6">
        <div className="bg-blue-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
            <FaUser className="mr-2" />
            Patient Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <span className="font-bold text-[var(--grey--900)]">Name:</span>{" "}
                {prescriptions[0]?.patientDetails?.name || "Not specified"}
              </p>
              <p>
                <span className="font-bold text-[var(--grey--900)]">Age:</span>{" "}
                {prescriptions[0]?.patientDetails?.age || "Not specified"}
              </p>
            </div>
            <div>
              <p>
                <span className="font-bold text-[var(--grey--900)]">
                  Gender:
                </span>{" "}
                {prescriptions[0]?.patientDetails?.gender || "Not specified"}
              </p>
              <p>
                <span className="font-bold text-[var(--grey--900)]">
                  Contact Number:
                </span>{" "}
                {prescriptions[0]?.patientDetails?.contactNumber ||
                  "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Render Each Session */}
      {prescriptions.length > 0 ? (
        prescriptions.map((prescription, index) => (
          <div
            key={prescription._id || index}
            className="mb-12 print:mb-0 print:pb-8"
          >
            <div className="mt-8 pt-4 border-b-2 border-gray-300 print:mt-4 text-center">
              <p className="text-base  font-bold bg-[var(--primary)] text-white inline-block p-2 rounded">
                Prescription Issue Date: {formatDate(prescription?.createdAt)}
              </p>
            </div>

            {/* Session Summary */}
            <section className="mb-6">
              <div className="bg-blue-50 p-4 rounded-md">
                <h2 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
                  <FaClipboardList className="mr-2" />
                  Session{" "}
                  {prescription?.basicDetails?.sessionNumber || index + 1} -
                  Session Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <span className="font-bold text-[var(--grey--900)]">
                        Topics Discussed:
                      </span>
                      {prescription?.sessionSummary?.topicsDiscussed?.map(
                        (event, idx) => (
                          <React.Fragment key={idx}>
                            <br />
                            <BiRightArrow className="inline" /> {event}
                          </React.Fragment>
                        )
                      ) || "Not specified"}
                    </p>
                    <p>
                      <span className="font-bold text-[var(--grey--900)]">
                        Insights & Breakthroughs:
                      </span>{" "}
                      {prescription?.sessionSummary?.insightsBreakthroughs ||
                        "Not specified"}
                    </p>
                    <p>
                      <span className="font-bold text-[var(--grey--900)]">
                        Emotional Responses:
                      </span>
                      {prescription?.sessionSummary?.emotionalResponses?.map(
                        (event, idx) => (
                          <React.Fragment key={idx}>
                            <br />
                            <BiRightArrow className="inline" /> {event}
                          </React.Fragment>
                        )
                      ) || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-bold text-[var(--grey--900)]">
                        Techniques Used:
                      </span>{" "}
                      {prescription?.sessionSummary?.techniquesUsed?.map(
                        (event, idx) => (
                          <React.Fragment key={idx}>
                            <br />
                            <BiRightArrow className="inline" /> {event}
                          </React.Fragment>
                        )
                      ) || "Not specified"}
                    </p>
                    <p>
                      <span className="font-bold text-[var(--grey--900)]">
                        Engagement Level:
                      </span>{" "}
                      {prescription?.sessionSummary?.engagementLevel ||
                        "Not specified"}
                    </p>
                    <p>
                      <span className="font-bold text-[var(--grey--900)]">
                        Notable Quotes:
                      </span>{" "}
                      {prescription?.sessionSummary?.notableQuotes?.map(
                        (quote, idx) => (
                          <React.Fragment key={idx}>
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
                  <FaBriefcase className="mr-2" />
                  Session{" "}
                  {prescription?.basicDetails?.sessionNumber || index + 1} -
                  Action Plan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p>
                      <span className="font-bold text-[var(--grey--900)]">
                        Goals:
                      </span>{" "}
                      {prescription?.actionPlan?.goals?.map((goal, idx) => (
                        <React.Fragment key={idx}>
                          <br />
                          <BiRightArrow className="inline" /> {goal}
                        </React.Fragment>
                      )) || "Not specified"}
                    </p>
                    <p>
                      <span className="font-bold text-[var(--grey--900)]">
                        Homework:
                      </span>{" "}
                      {prescription?.actionPlan?.homework?.map(
                        (homework, idx) => (
                          <React.Fragment key={idx}>
                            <br />
                            <BiRightArrow className="inline" /> {homework}
                          </React.Fragment>
                        )
                      ) || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-bold text-[var(--grey--900)]">
                        Coping Strategies:
                      </span>{" "}
                      {prescription?.actionPlan?.copingStrategies?.map(
                        (strategy, idx) => (
                          <React.Fragment key={idx}>
                            <br />
                            <BiRightArrow className="inline" /> {strategy}
                          </React.Fragment>
                        )
                      ) || "Not specified"}
                    </p>
                    <p>
                      <span className="font-bold text-[var(--grey--900)]">
                        Lifestyle Adjustments:
                      </span>{" "}
                      {prescription?.actionPlan?.lifestyleAdjustments?.map(
                        (adj, idx) => (
                          <React.Fragment key={idx}>
                            <br />
                            <BiRightArrow className="inline" /> {adj}
                          </React.Fragment>
                        )
                      ) || "Not specified"}
                    </p>
                    <p>
                      <span className="font-bold text-[var(--grey--900)]">
                        Resources Shared:
                      </span>{" "}
                      {prescription?.actionPlan?.resourcesShared?.join(", ") ||
                        "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">
          No prescriptions found for this patient.
        </p>
      )}

      {/* Print Button */}
      <div className="mt-6 text-center print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Print Prescriptions
        </button>
      </div>
    </div>
  );
};

export default ConsolidateSessions;
