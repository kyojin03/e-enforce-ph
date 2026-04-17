import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "e_enforce_reports";

const issueTypes = [
  {
    id: "dumping",
    title: "Illegal Dumping",
    description: "Improper disposal of waste in rivers, roadsides, or open areas.",
    image: "/images/dumping.jpg",
  },
  {
    id: "logging",
    title: "Illegal Logging",
    description: "Unauthorized cutting or removal of trees and forest resources.",
    image: "/images/logging.jpg",
  },
  {
    id: "water",
    title: "Water Pollution",
    description: "Contamination of rivers, creeks, lakes, or coastal areas.",
    image: "/images/water.jpg",
  },
  {
    id: "air",
    title: "Air Pollution",
    description: "Smoke, fumes, or harmful emissions affecting air quality.",
    image: "/images/air.jpg",
  },
  {
    id: "wildlife",
    title: "Wildlife Harm",
    description: "Illegal capture, trade, abuse, or destruction of wildlife.",
    image: "/images/wildlife.jfif",
  },
  {
    id: "other",
    title: "Other Environmental Issue",
    description: "Any other environmental concern that requires reporting.",
    image: "/images/other.jpg",
  },
];

const officeList = [
  {
    name: "DENR NCR Office",
    location: "Quezon City, Metro Manila",
    contact: "(02) 1234-5678",
  },
  {
    name: "DENR CALABARZON",
    location: "Lipa City, Batangas",
    contact: "(043) 123-4567",
  },
  {
    name: "DENR Central Visayas",
    location: "Cebu City, Cebu",
    contact: "(032) 123-4567",
  },
];

function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

function generateTrackingCode(existingReports) {
  if (existingReports.length === 0) return "EEP-0001";

  const numbers = existingReports
    .map((report) => {
      const match = report.trackingCode?.match(/EEP-(\d+)/);
      return match ? Number(match[1]) : 0;
    })
    .filter((num) => !Number.isNaN(num));

  const nextNumber = (numbers.length ? Math.max(...numbers) : 0) + 1;
  return `EEP-${String(nextNumber).padStart(4, "0")}`;
}

export default function App() {
  const [page, setPage] = useState("home");
  const [reports, setReports] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [reporterName, setReporterName] = useState("");
  const [reporterContact, setReporterContact] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const [trackingCodeInput, setTrackingCodeInput] = useState("");
  const [foundReport, setFoundReport] = useState(null);

  useEffect(() => {
    const savedReports = localStorage.getItem(STORAGE_KEY);
    if (savedReports) {
      setReports(JSON.parse(savedReports));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }, [reports]);

  const totalReports = reports.length;
  const checkingCount = useMemo(
    () => reports.filter((report) => report.status === "Under Review").length,
    [reports]
  );
  const fixedCount = useMemo(
    () => reports.filter((report) => report.status === "In Progress").length,
    [reports]
  );
  const doneCount = useMemo(
    () => reports.filter((report) => report.status === "Resolved").length,
    [reports]
  );

  function resetForm() {
    setSelectedIssue("");
    setLocation("");
    setDetails("");
    setIsAnonymous(true);
    setReporterName("");
    setReporterContact("");
  }

  function handleSubmitReport() {
    if (!selectedIssue || !location.trim() || !details.trim()) {
      alert("Please complete the issue type, location, and details.");
      return;
    }

    if (!isAnonymous && (!reporterName.trim() || !reporterContact.trim())) {
      alert("Please provide your name and contact number.");
      return;
    }

    const trackingCode = generateTrackingCode(reports);
    const now = new Date().toISOString();
    const issue = issueTypes.find((item) => item.id === selectedIssue);

    const newReport = {
      id: Date.now(),
      trackingCode,
      issueType: issue?.title || "Other Environmental Issue",
      location,
      details,
      isAnonymous,
      reporterName: isAnonymous ? "" : reporterName,
      reporterContact: isAnonymous ? "" : reporterContact,
      status: "Under Review",
      submittedAt: now,
      updatedAt: now,
    };

    const updatedReports = [newReport, ...reports];
    setReports(updatedReports);
    setSubmittedCode(trackingCode);
    resetForm();
    setPage("report-success");
  }

  function handleTrackReport() {
    const match = reports.find(
      (report) =>
        report.trackingCode.toLowerCase() ===
        trackingCodeInput.trim().toLowerCase()
    );

    if (!match) {
      setFoundReport(null);
      alert("Tracking code not found. Please check and try again.");
      return;
    }

    setFoundReport(match);
  }

  function seedDemoData() {
    if (reports.length > 0) return;

    const demoReports = [
      {
        id: 1,
        trackingCode: "EEP-0001",
        issueType: "Illegal Dumping",
        location: "Barangay San Isidro, Quezon City",
        details: "Several trash bags were dumped beside the creek.",
        isAnonymous: true,
        reporterName: "",
        reporterContact: "",
        status: "Under Review",
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        trackingCode: "EEP-0002",
        issueType: "Water Pollution",
        location: "Near riverbank, Cebu City",
        details: "Water appears dark and has a strong chemical smell.",
        isAnonymous: false,
        reporterName: "Maria Santos",
        reporterContact: "09123456789",
        status: "In Progress",
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    setReports(demoReports);
  }

  function clearAllReports() {
    const confirmed = window.confirm("Delete all saved reports?");
    if (!confirmed) return;
    setReports([]);
    setFoundReport(null);
    setSubmittedCode("");
    localStorage.removeItem(STORAGE_KEY);
  }

  const cardStyle = {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    border: "1px solid #d1fae5",
  };

  const buttonStyle = {
    padding: "12px 18px",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #86efac",
    marginTop: "6px",
    boxSizing: "border-box",
    color: "#14532d",
  };

  const headingColor = "#166534";
  const bodyColor = "#14532d";
  const mutedColor = "#4d7c0f";
  const primaryGreen = "#15803d";
  const lightGreen = "#f0fdf4";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7fff9",
        color: bodyColor,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #dcfce7",
          padding: "16px 24px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="/logo.jpg.jfif"
              alt="e-Enforce PH logo"
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #22c55e",
              }}
            />
            <div>
              <h1
  style={{
    margin: 0,
    color: headingColor,
    fontWeight: "bold",
    fontSize: "34px",
  }}
>
  e-Enforce PH
</h1>

<p
  style={{
    marginTop: "4px",   // 👈 THIS is the important fix
    fontSize: "12px",
    color: mutedColor,
  }}
>
  Environmental Reporting System
</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              ["home", "Home"],
              ["report", "Submit a Report"],
              ["track", "Track a Report"],
              ["rules", "Rules & Process"],
              ["offices", "DENR Offices"],
              ["about", "About Us"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPage(key)}
                style={{
                  ...buttonStyle,
                  background: page === key ? primaryGreen : "#ffffff",
                  color: page === key ? "#ffffff" : bodyColor,
                  border: "1px solid #86efac",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
        {page === "home" && (
          <div style={{ display: "grid", gap: "24px" }}>
            <section
              style={{
                background: "linear-gradient(to right, #166534, #16a34a, #22c55e)",
                color: "white",
                borderRadius: "24px",
                padding: "40px",
              }}
            >
              <h2 style={{ fontSize: "42px", marginTop: 0, fontWeight: "bold", color: "#ffffff" }}>
                Protect the Environment. Report Issues That Matter.
              </h2>
            <p style={{ maxWidth: "700px", fontSize: "18px", color: "#dcfce7" }}>
                A centralized platform where citizens can report environmental
                concerns, receive a tracking code, and monitor the status of
                their reports.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => setPage("report")}
                  style={{
                    ...buttonStyle,
                    background: "#14532d",
                    color: "#fff",
                    border: "1px solid #dcfce7",
                  }}
                >
                  Submit a Report
                </button>
                <button
                  onClick={() => setPage("track")}
                  style={{
                    ...buttonStyle,
                    background: "#ffffff",
                    color: "#14532d",
                  }}
                >
                  Track a Report
                </button>
              </div>
            </section>

            <section
              style={{
                display: "grid",
                gap: "16px",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              }}
            >
              <div style={cardStyle}>
                <h3 style={{ color: headingColor, fontWeight: "bold" }}>
                  Submit an Environmental Report
                </h3>
                <p>File a report quickly by providing the necessary details.</p>
                <button
                  onClick={() => setPage("report")}
                  style={{
                    ...buttonStyle,
                    width: "100%",
                    background: primaryGreen,
                    color: "#fff",
                  }}
                >
                  Submit Now
                </button>
              </div>

              <div style={cardStyle}>
                <h3 style={{ color: headingColor, fontWeight: "bold" }}>
                  Locate the Proper DENR Office
                </h3>
                <p>View office information for report handling and coordination.</p>
                <button
                  onClick={() => setPage("offices")}
                  style={{
                    ...buttonStyle,
                    width: "100%",
                    background: primaryGreen,
                    color: "#fff",
                  }}
                >
                  View Offices
                </button>
              </div>

              <div style={cardStyle}>
                <h3 style={{ color: headingColor, fontWeight: "bold" }}>
                  Check Report Status
                </h3>
                <p>Use your tracking code to monitor the progress of a report.</p>
                <button
                  onClick={() => setPage("track")}
                  style={{
                    ...buttonStyle,
                    width: "100%",
                    background: primaryGreen,
                    color: "#fff",
                  }}
                >
                  Track Report
                </button>
              </div>
            </section>

            <section
              style={{
                display: "grid",
                gap: "16px",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              }}
            >
              <div style={cardStyle}>
                <p style={{ color: mutedColor }}>Total Reports</p>
                <h2 style={{ color: headingColor, fontWeight: "bold" }}>
                  {totalReports}
                </h2>
              </div>
              <div style={cardStyle}>
                <p style={{ color: mutedColor }}>Under Review</p>
                <h2 style={{ color: headingColor, fontWeight: "bold" }}>
                  {checkingCount}
                </h2>
              </div>
              <div style={cardStyle}>
                <p style={{ color: mutedColor }}>In Progress</p>
                <h2 style={{ color: headingColor, fontWeight: "bold" }}>
                  {fixedCount}
                </h2>
              </div>
              <div style={cardStyle}>
                <p style={{ color: mutedColor }}>Resolved</p>
                <h2 style={{ color: headingColor, fontWeight: "bold" }}>
                  {doneCount}
                </h2>
              </div>
            </section>

            <section
              style={{
                display: "grid",
                gap: "16px",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              }}
            >
              <div style={cardStyle}>
                <h3 style={{ color: headingColor, fontWeight: "bold" }}>
                  Our Purpose
                </h3>
                <p>
                  e-Enforce PH supports easier reporting of environmental concerns
                  by providing a structured submission and tracking process.
                </p>
                <p>
                  Citizens can submit concerns, receive a tracking code, and
                  monitor report progress through the system.
                </p>
              </div>

              <div style={cardStyle}>
                <h3 style={{ color: headingColor, fontWeight: "bold" }}>
                  Common Issues You Can Report
                </h3>
                <p>• Illegal dumping</p>
                <p>• Illegal logging</p>
                <p>• Water pollution</p>
                <p>• Air pollution</p>
                <p>• Wildlife harm</p>
              </div>
            </section>

            <section style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                onClick={seedDemoData}
                style={{
                  ...buttonStyle,
                  background: "#ffffff",
                  border: "1px solid #86efac",
                  color: bodyColor,
                }}
              >
                Load Sample Reports
              </button>
              <button
                onClick={clearAllReports}
                style={{
                  ...buttonStyle,
                  background: "#ffffff",
                  border: "1px solid #86efac",
                  color: bodyColor,
                }}
              >
                Clear Reports
              </button>
            </section>
          </div>
        )}

        {page === "report" && (
          <div
            style={{
              display: "grid",
              gap: "24px",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            }}
          >
            <div style={cardStyle}>
              <h2 style={{ color: headingColor, fontWeight: "bold" }}>
                Submit a Report
              </h2>
              <p style={{ color: mutedColor }}>
                Provide the necessary details about the environmental issue you
                observed.
              </p>

              <div style={{ marginTop: "20px" }}>
                <label>
                  <strong>Step 1: Select the type of issue</strong>
                </label>
                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    marginTop: "12px",
                  }}
                >
                  {issueTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedIssue(type.id)}
                      style={{
                        textAlign: "left",
                        padding: "16px",
                        borderRadius: "16px",
                        border:
                          selectedIssue === type.id
                            ? "2px solid #16a34a"
                            : "1px solid #bbf7d0",
                        background:
                          selectedIssue === type.id ? lightGreen : "#fff",
                        cursor: "pointer",
                        color: bodyColor,
                      }}
                    >
                      <div
                        style={{
                          overflow: "hidden",
                          borderRadius: "12px",
                          marginBottom: "10px",
                        }}
                      >
                        <img
                          src={type.image}
                          alt={type.title}
                          style={{
                            width: "100%",
                            height: "140px",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      </div>
                      <h4
                        style={{
                          marginBottom: "6px",
                          color: headingColor,
                          fontWeight: "bold",
                        }}
                      >
                        {type.title}
                      </h4>
                      <p
                        style={{
                          margin: 0,
                          color: mutedColor,
                          fontSize: "14px",
                        }}
                      >
                        {type.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <label>
                  <strong>Step 2: Specify the location</strong>
                </label>
                <input
                  style={inputStyle}
                  placeholder="Enter the barangay, city, municipality, or landmark"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div style={{ marginTop: "20px" }}>
                <label>
                  <strong>Step 3: Describe the situation</strong>
                </label>
                <textarea
                  style={{ ...inputStyle, minHeight: "120px" }}
                  placeholder="Provide clear details about the issue"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  border: "1px solid #bbf7d0",
                  borderRadius: "16px",
                  background: "#fcfffd",
                }}
              >
                <label>
                  <strong>Step 4: Choose your reporting preference</strong>
                </label>
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginTop: "12px",
                  }}
                >
                  <button
                    onClick={() => setIsAnonymous(true)}
                    style={{
                      ...buttonStyle,
                      background: isAnonymous ? primaryGreen : "#fff",
                      color: isAnonymous ? "#fff" : bodyColor,
                      border: "1px solid #86efac",
                    }}
                  >
                    Remain Anonymous
                  </button>
                  <button
                    onClick={() => setIsAnonymous(false)}
                    style={{
                      ...buttonStyle,
                      background: !isAnonymous ? primaryGreen : "#fff",
                      color: !isAnonymous ? "#fff" : bodyColor,
                      border: "1px solid #86efac",
                    }}
                  >
                    Provide My Information
                  </button>
                </div>

                {!isAnonymous && (
                  <div
                    style={{
                      display: "grid",
                      gap: "12px",
                      gridTemplateColumns: "1fr 1fr",
                      marginTop: "16px",
                    }}
                  >
                    <div>
                      <label>Your Name</label>
                      <input
                        style={inputStyle}
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label>Contact Number</label>
                      <input
                        style={inputStyle}
                        value={reporterContact}
                        onChange={(e) => setReporterContact(e.target.value)}
                        placeholder="Enter your contact number"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={handleSubmitReport}
                  style={{
                    ...buttonStyle,
                    background: primaryGreen,
                    color: "#fff",
                  }}
                >
                  Submit Report
                </button>
                <button
                  onClick={resetForm}
                  style={{
                    ...buttonStyle,
                    background: "#fff",
                    border: "1px solid #86efac",
                    color: bodyColor,
                  }}
                >
                  Clear Form
                </button>
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ color: headingColor, fontWeight: "bold" }}>
                Reporting Guidelines
              </h3>
              <div
                style={{
                  background: "#f0fdf4",
                  padding: "14px",
                  borderRadius: "14px",
                  marginBottom: "12px",
                  border: "1px solid #bbf7d0",
                }}
              >
                <strong>Provide complete details</strong>
                <p>
                  Include the exact location and a clear description to help
                  authorities review the concern properly.
                </p>
              </div>
              <div
                style={{
                  background: "#f0fdf4",
                  padding: "14px",
                  borderRadius: "14px",
                  marginBottom: "12px",
                  border: "1px solid #bbf7d0",
                }}
              >
                <strong>Use accurate information</strong>
                <p>
                  Reports with complete and accurate details are easier to assess
                  and process.
                </p>
              </div>
              <div
                style={{
                  background: "#f0fdf4",
                  padding: "14px",
                  borderRadius: "14px",
                  border: "1px solid #bbf7d0",
                }}
              >
                <strong>Save your tracking code</strong>
                <p>
                  Keep your tracking code so you can monitor the status of your
                  report.
                </p>
              </div>
            </div>
          </div>
        )}

        {page === "report-success" && (
          <div
            style={{
              ...cardStyle,
              maxWidth: "700px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <h2 style={{ color: headingColor, fontWeight: "bold" }}>
              Report Submitted Successfully
            </h2>
            <p>
              Your report has been received. Use the tracking code below to
              monitor its status.
            </p>
            <div
              style={{
                background: lightGreen,
                border: "2px dashed #22c55e",
                borderRadius: "18px",
                padding: "24px",
                margin: "20px 0",
              }}
            >
              <p>Your Tracking Code</p>
              <h1
                style={{
                  color: headingColor,
                  letterSpacing: "3px",
                  fontWeight: "bold",
                }}
              >
                {submittedCode}
              </h1>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setPage("track")}
                style={{
                  ...buttonStyle,
                  background: primaryGreen,
                  color: "#fff",
                }}
              >
                Track Report
              </button>
              <button
                onClick={() => setPage("home")}
                style={{
                  ...buttonStyle,
                  background: "#fff",
                  border: "1px solid #86efac",
                  color: bodyColor,
                }}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {page === "track" && (
          <div
            style={{
              display: "grid",
              gap: "24px",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            }}
          >
            <div style={cardStyle}>
              <h2 style={{ color: headingColor, fontWeight: "bold" }}>
                Track a Report
              </h2>
              <p style={{ color: mutedColor }}>
                Enter your tracking code to view the current status of your
                report.
              </p>

              <div style={{ marginTop: "20px" }}>
                <label>
                  <strong>Enter your tracking code</strong>
                </label>
                <input
                  style={inputStyle}
                  placeholder="Example: EEP-0001"
                  value={trackingCodeInput}
                  onChange={(e) => setTrackingCodeInput(e.target.value)}
                />
              </div>

              <button
                onClick={handleTrackReport}
                style={{
                  ...buttonStyle,
                  background: primaryGreen,
                  color: "#fff",
                  marginTop: "16px",
                }}
              >
                Check Status
              </button>
            </div>

            <div style={cardStyle}>
              <h2 style={{ color: headingColor, fontWeight: "bold" }}>
                Report Status
              </h2>
              {!foundReport ? (
                <div
                  style={{
                    padding: "30px",
                    border: "1px dashed #86efac",
                    borderRadius: "16px",
                    textAlign: "center",
                    color: mutedColor,
                  }}
                >
                  Enter a valid tracking code to view report details.
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      background: "#f6fff8",
                      borderRadius: "16px",
                      padding: "16px",
                      marginBottom: "16px",
                      border: "1px solid #dcfce7",
                    }}
                  >
                    <p>Tracking Code</p>
                    <h2 style={{ color: headingColor, fontWeight: "bold" }}>
                      {foundReport.trackingCode}
                    </h2>
                    <p>
                      <strong>Status:</strong> {foundReport.status}
                    </p>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <strong>Issue Type:</strong> {foundReport.issueType}
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <strong>Location:</strong> {foundReport.location}
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <strong>Details:</strong> {foundReport.details}
                  </div>
                  <div style={{ marginBottom: "12px" }}>
                    <strong>Date Submitted:</strong>{" "}
                    {formatDate(foundReport.submittedAt)}
                  </div>
                  <div>
                    <strong>Last Updated:</strong>{" "}
                    {formatDate(foundReport.updatedAt)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {page === "rules" && (
          <div
            style={{
              display: "grid",
              gap: "24px",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            }}
          >
            <div style={cardStyle}>
              <h2 style={{ color: headingColor, fontWeight: "bold" }}>
                Report Handling Process
              </h2>
              <ol>
                <li>Report is received by the system</li>
                <li>Report is forwarded to the appropriate office</li>
                <li>Issue is reviewed and verified</li>
                <li>Necessary action is initiated</li>
                <li>Status is updated in the system</li>
              </ol>
            </div>

            <div style={cardStyle}>
              <h2 style={{ color: headingColor, fontWeight: "bold" }}>
                Types of Reportable Issues
              </h2>
              <p>
                <strong>Illegal Logging</strong> - Unauthorized cutting or
                removal of trees.
              </p>
              <p>
                <strong>Illegal Dumping</strong> - Improper disposal of waste in
                open areas, rivers, or roadsides.
              </p>
              <p>
                <strong>Water Pollution</strong> - Pollution affecting rivers,
                lakes, and other water sources.
              </p>
              <p>
                <strong>Air Pollution</strong> - Harmful smoke, emissions, or
                poor air quality concerns.
              </p>
              <p>
                <strong>Wildlife Harm</strong> - Illegal wildlife capture, trade,
                abuse, or destruction.
              </p>
            </div>
          </div>
        )}

        {page === "offices" && (
          <div style={cardStyle}>
            <h2 style={{ color: headingColor, fontWeight: "bold" }}>
              DENR Offices
            </h2>
            <p style={{ color: mutedColor }}>
              Offices responsible for reviewing and handling environmental
              reports.
            </p>
            <div
              style={{
                display: "grid",
                gap: "16px",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                marginTop: "20px",
              }}
            >
              {officeList.map((office) => (
                <div
                  key={office.name}
                  style={{
                    border: "1px solid #dcfce7",
                    borderRadius: "16px",
                    padding: "16px",
                    background: "#fcfffd",
                  }}
                >
                  <h3 style={{ color: headingColor, fontWeight: "bold" }}>
                    {office.name}
                  </h3>
                  <p>{office.location}</p>
                  <p>{office.contact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {page === "about" && (
          <div style={cardStyle}>
            <h2 style={{ color: headingColor, fontWeight: "bold" }}>
              About Us
            </h2>

            <p>
              e-Enforce PH is an environmental reporting system designed to make
              it easier for citizens to report environmental concerns and track
              their resolution.
            </p>

            <p>
              Developed by students from{" "}
              <strong>Nueva Ecija University of Science and Technology (NEUST)</strong>.
            </p>

            <p>
              <strong>Program:</strong> Bachelor of Science in Business
              Administration Major in Human Resource Management (BSBA-HRM)
              <br />
              <strong>Section:</strong> BSBA-HRM-2-A
              <br />
              <strong>College:</strong> College of Management, Business and
              Technology
            </p>

            <h3 style={{ marginTop: "20px", color: headingColor, fontWeight: "bold" }}>
              Team Members
            </h3>
            <ul>
              <li>Bulos, Roa Sunshine P.</li>
              <li>Ferrer, Pretty Rose C.</li>
              <li>Linda, Cassandra Mei M.</li>
              <li>Padua, Resciebel V.</li>
              <li>Sanchez, Jillian G.</li>
            </ul>
          </div>
        )}

        <section style={{ marginTop: "30px" }}>
          <div style={cardStyle}>
            <h2 style={{ color: headingColor, fontWeight: "bold" }}>
              Recent Reports
            </h2>
            <p style={{ color: mutedColor }}>
              View submitted reports and their current status.
            </p>

            {reports.length === 0 ? (
              <div
                style={{
                  padding: "30px",
                  border: "1px dashed #86efac",
                  borderRadius: "16px",
                  textAlign: "center",
                  color: mutedColor,
                }}
              >
                No reports available at this time.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: "16px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  marginTop: "20px",
                }}
              >
                {reports.map((report) => (
                  <div
                    key={report.id}
                    style={{
                      border: "1px solid #dcfce7",
                      borderRadius: "16px",
                      padding: "16px",
                      background: "#fcfffd",
                    }}
                  >
                    <p style={{ fontSize: "12px", color: mutedColor }}>
                      {report.trackingCode}
                    </p>
                    <h3 style={{ color: headingColor, fontWeight: "bold" }}>
                      {report.issueType}
                    </h3>
                    <p>
                      <strong>Status:</strong> {report.status}
                    </p>
                    <p>
                      <strong>Location:</strong> {report.location}
                    </p>
                    <p>{report.details}</p>
                    <p style={{ fontSize: "12px", color: mutedColor }}>
                      Submitted: {formatDate(report.submittedAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}