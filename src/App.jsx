import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "e_enforce_reports";

const issueTypes = [
  {
    id: "dumping",
    title: "Illegal Dumping",
    description: "Garbage thrown in rivers, roadsides, or empty lots.",
    emoji: "🗑️",
  },
  {
    id: "logging",
    title: "Illegal Logging",
    description: "Cutting trees without permission.",
    emoji: "🌳",
  },
  {
    id: "water",
    title: "Dirty Water",
    description: "Polluted rivers, creeks, lakes, or coastal areas.",
    emoji: "💧",
  },
  {
    id: "air",
    title: "Air Pollution",
    description: "Smoke, fumes, or harmful emissions.",
    emoji: "🏭",
  },
  {
    id: "wildlife",
    title: "Wildlife Harm",
    description: "Illegal capture, trade, or abuse of wildlife.",
    emoji: "🐾",
  },
  {
    id: "other",
    title: "Other Issue",
    description: "Any other environmental concern.",
    emoji: "⚠️",
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
  const nextNumber = existingReports.length + 1;
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
    () => reports.filter((report) => report.status === "Being Checked").length,
    [reports]
  );
  const fixedCount = useMemo(
    () => reports.filter((report) => report.status === "Being Fixed").length,
    [reports]
  );
  const doneCount = useMemo(
    () => reports.filter((report) => report.status === "Done").length,
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
      alert("Please complete the issue type, location, and details first.");
      return;
    }

    const trackingCode = generateTrackingCode(reports);
    const now = new Date().toISOString();
    const issue = issueTypes.find((item) => item.id === selectedIssue);

    const newReport = {
      id: Date.now(),
      trackingCode,
      issueType: issue?.title || "Other Issue",
      location,
      details,
      isAnonymous,
      reporterName: isAnonymous ? "" : reporterName,
      reporterContact: isAnonymous ? "" : reporterContact,
      status: "Being Checked",
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
      alert("Tracking code not found on this computer/browser.");
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
        status: "Being Checked",
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        trackingCode: "EEP-0002",
        issueType: "Dirty Water",
        location: "Near riverbank, Cebu City",
        details: "Water looks dark and has a strong chemical smell.",
        isAnonymous: false,
        reporterName: "Maria Santos",
        reporterContact: "09123456789",
        status: "Being Fixed",
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    setReports(demoReports);
  }

  function clearAllReports() {
    const confirmed = window.confirm(
      "Delete all prototype reports saved on this computer?"
    );
    if (!confirmed) return;
    setReports([]);
    setFoundReport(null);
    setSubmittedCode("");
    localStorage.removeItem(STORAGE_KEY);
  }

  const cardStyle = {
    background: "#fff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
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
    border: "1px solid #cbd5e1",
    marginTop: "6px",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", color: "#1e293b", fontFamily: "Arial, sans-serif" }}>
      <header
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #e2e8f0",
          padding: "16px 24px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="/logo.jpg.jfif"
              alt="e-Enforce PH logo"
              style={{ width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover" }}
            />
            <div>
              <h1 style={{ margin: 0, color: "#15803d" }}>naniningil na po collateral lang to :)</h1>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}></p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              ["home", "Home"],
              ["report", "Report a Problem"],
              ["track", "Track Your Report"],
              ["rules", "Rules & Steps"],
              ["offices", "DENR Offices"],
              ["about", "About Us"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPage(key)}
                style={{
                  ...buttonStyle,
                  background: page === key ? "#16a34a" : "#ffffff",
                  color: page === key ? "#ffffff" : "#0f172a",
                  border: "1px solid #cbd5e1",
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
                background: "linear-gradient(to right, #16a34a, #22c55e, #2563eb)",
                color: "white",
                borderRadius: "24px",
                padding: "40px",
              }}
            >
              <h2 style={{ fontSize: "42px", marginTop: 0 }}>
                Help Protect Our Philippines' Environment - Report Problems Easily!
              </h2>
              <p style={{ maxWidth: "700px", fontSize: "18px" }}>
                A simple reporting website where citizens can submit environmental concerns,
                receive a tracking code, and check updates on the same computer.
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "20px" }}>
                <button
                  onClick={() => setPage("report")}
                  style={{ ...buttonStyle, background: "#f97316", color: "#fff" }}
                >
                  Click Here to Report
                </button>
                <button
                  onClick={() => setPage("track")}
                  style={{ ...buttonStyle, background: "#fff", color: "#0f172a" }}
                >
                  Track Your Report
                </button>
              </div>
            </section>

            <section style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
              <div style={cardStyle}>
                <h3>Click Here to Report</h3>
                <p>Send an environmental concern in a few simple steps.</p>
                <button
                  onClick={() => setPage("report")}
                  style={{ ...buttonStyle, width: "100%", background: "#16a34a", color: "#fff" }}
                >
                  Report Now
                </button>
              </div>

              <div style={cardStyle}>
                <h3>Find Your Local DENR Office</h3>
                <p>See sample DENR office contact information for the prototype.</p>
                <button
                  onClick={() => setPage("offices")}
                  style={{ ...buttonStyle, width: "100%", background: "#2563eb", color: "#fff" }}
                >
                  Find Offices
                </button>
              </div>

              <div style={cardStyle}>
                <h3>See What's Being Fixed</h3>
                <p>Track saved reports and check their current status.</p>
                <button
                  onClick={() => setPage("track")}
                  style={{ ...buttonStyle, width: "100%", background: "#f97316", color: "#fff" }}
                >
                  Track Reports
                </button>
              </div>
            </section>

            <section style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
              <div style={cardStyle}>
                <p>Total Reports</p>
                <h2 style={{ color: "#15803d" }}>{totalReports}</h2>
              </div>
              <div style={cardStyle}>
                <p>Being Checked</p>
                <h2 style={{ color: "#1d4ed8" }}>{checkingCount}</h2>
              </div>
              <div style={cardStyle}>
                <p>Being Fixed</p>
                <h2 style={{ color: "#ea580c" }}>{fixedCount}</h2>
              </div>
              <div style={cardStyle}>
                <p>Done</p>
                <h2 style={{ color: "#059669" }}>{doneCount}</h2>
              </div>
            </section>

            <section style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              <div style={cardStyle}>
                <h3>What We Do</h3>
                <p>We make environmental reporting easier for students and citizens.</p>
                <p>Reports are saved in this browser as a prototype so you can demonstrate the full user flow.</p>
                <p>Users can submit concerns, receive a tracking code, and check updates later on the same computer.</p>
              </div>

              <div style={cardStyle}>
                <h3>Common Problems to Report</h3>
                <p>• Illegal dumping</p>
                <p>• Illegal logging / cutting trees</p>
                <p>• Dirty or polluted water</p>
                <p>• Smoke and air pollution</p>
                <p>• Wildlife harm</p>
              </div>
            </section>

            <section style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={seedDemoData} style={{ ...buttonStyle, background: "#fff", border: "1px solid #cbd5e1" }}>
                Load Demo Reports
              </button>
              <button onClick={clearAllReports} style={{ ...buttonStyle, background: "#fff", border: "1px solid #cbd5e1" }}>
                Clear Prototype Data
              </button>
            </section>
          </div>
        )}

        {page === "report" && (
          <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            <div style={cardStyle}>
              <h2>Report a Problem</h2>
              <p style={{ color: "#64748b" }}>
                This prototype saves your report only on this computer/browser.
              </p>

              <div style={{ marginTop: "20px" }}>
                <label><strong>Step 1: Choose the kind of problem</strong></label>
                <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: "12px" }}>
                  {issueTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedIssue(type.id)}
                      style={{
                        textAlign: "left",
                        padding: "16px",
                        borderRadius: "16px",
                        border: selectedIssue === type.id ? "2px solid #22c55e" : "1px solid #cbd5e1",
                        background: selectedIssue === type.id ? "#f0fdf4" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: "28px" }}>{type.emoji}</div>
                      <h4 style={{ marginBottom: "6px" }}>{type.title}</h4>
                      <p style={{ margin: 0, color: "#64748b", fontSize: "14px" }}>{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <label><strong>Step 2: Where did it happen?</strong></label>
                <input
                  style={inputStyle}
                  placeholder="Type the location, barangay, city, or landmark"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div style={{ marginTop: "20px" }}>
                <label><strong>Step 3: Tell us what you saw</strong></label>
                <textarea
                  style={{ ...inputStyle, minHeight: "120px" }}
                  placeholder="Write the details of the issue here"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              <div style={{ marginTop: "20px", padding: "16px", border: "1px solid #cbd5e1", borderRadius: "16px" }}>
                <label><strong>Step 4: Choose anonymity option</strong></label>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "12px" }}>
                  <button
                    onClick={() => setIsAnonymous(true)}
                    style={{
                      ...buttonStyle,
                      background: isAnonymous ? "#16a34a" : "#fff",
                      color: isAnonymous ? "#fff" : "#000",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    Stay Anonymous
                  </button>
                  <button
                    onClick={() => setIsAnonymous(false)}
                    style={{
                      ...buttonStyle,
                      background: !isAnonymous ? "#2563eb" : "#fff",
                      color: !isAnonymous ? "#fff" : "#000",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    Give My Name / Number
                  </button>
                </div>

                {!isAnonymous && (
                  <div style={{ display: "grid", gap: "12px", gridTemplateColumns: "1fr 1fr", marginTop: "16px" }}>
                    <div>
                      <label>Your Name</label>
                      <input
                        style={inputStyle}
                        value={reporterName}
                        onChange={(e) => setReporterName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label>Phone Number</label>
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

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "20px" }}>
                <button
                  onClick={handleSubmitReport}
                  style={{ ...buttonStyle, background: "#16a34a", color: "#fff" }}
                >
                  Send My Report
                </button>
                <button
                  onClick={resetForm}
                  style={{ ...buttonStyle, background: "#fff", border: "1px solid #cbd5e1" }}
                >
                  Clear Form
                </button>
              </div>
            </div>

            <div style={cardStyle}>
              <h3>Prototype Notes</h3>
              <div style={{ background: "#eff6ff", padding: "14px", borderRadius: "14px", marginBottom: "12px" }}>
                <strong>How this demo saves data</strong>
                <p>Reports are stored in localStorage, which means they stay on this browser only.</p>
              </div>
              <div style={{ background: "#f0fdf4", padding: "14px", borderRadius: "14px", marginBottom: "12px" }}>
                <strong>What works now</strong>
                <p>Submit report, generate tracking code, track reports, and show saved records on the same computer.</p>
              </div>
              <div style={{ background: "#fff7ed", padding: "14px", borderRadius: "14px" }}>
                <strong>Current limitation</strong>
                <p>If you open the site on another device or clear browser storage, the reports will not be there.</p>
              </div>
            </div>
          </div>
        )}

        {page === "report-success" && (
          <div style={{ ...cardStyle, maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ color: "#15803d" }}>Report Sent Successfully</h2>
            <p>Save this tracking code so you can check the status later on this computer.</p>
            <div style={{ background: "#f0fdf4", border: "2px dashed #86efac", borderRadius: "18px", padding: "24px", margin: "20px 0" }}>
              <p>Your Tracking Code</p>
              <h1 style={{ color: "#15803d", letterSpacing: "3px" }}>{submittedCode}</h1>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={() => setPage("track")} style={{ ...buttonStyle, background: "#2563eb", color: "#fff" }}>
                Track My Report
              </button>
              <button onClick={() => setPage("home")} style={{ ...buttonStyle, background: "#fff", border: "1px solid #cbd5e1" }}>
                Back to Home
              </button>
            </div>
          </div>
        )}

        {page === "track" && (
          <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            <div style={cardStyle}>
              <h2>Track Your Report</h2>
              <p style={{ color: "#64748b" }}>
                We update this prototype manually. Saved reports exist only in this browser.
              </p>

              <div style={{ marginTop: "20px" }}>
                <label><strong>Enter your tracking code</strong></label>
                <input
                  style={inputStyle}
                  placeholder="Example: EEP-0001"
                  value={trackingCodeInput}
                  onChange={(e) => setTrackingCodeInput(e.target.value)}
                />
              </div>

              <button
                onClick={handleTrackReport}
                style={{ ...buttonStyle, background: "#2563eb", color: "#fff", marginTop: "16px" }}
              >
                Check Status
              </button>
            </div>

            <div style={cardStyle}>
              <h2>Status Result</h2>
              {!foundReport ? (
                <div style={{ padding: "30px", border: "1px dashed #cbd5e1", borderRadius: "16px", textAlign: "center", color: "#64748b" }}>
                  Enter a tracking code to see the report status.
                </div>
              ) : (
                <div>
                  <div style={{ background: "#f8fafc", borderRadius: "16px", padding: "16px", marginBottom: "16px" }}>
                    <p>Tracking Code</p>
                    <h2>{foundReport.trackingCode}</h2>
                    <p><strong>Status:</strong> {foundReport.status}</p>
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
                    <strong>Date Submitted:</strong> {formatDate(foundReport.submittedAt)}
                  </div>
                  <div>
                    <strong>Last Updated:</strong> {formatDate(foundReport.updatedAt)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {page === "rules" && (
          <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
            <div style={cardStyle}>
              <h2>How We Handle Reports</h2>
              <ol>
                <li>Report comes in</li>
                <li>We send it to the right office</li>
                <li>Office checks the problem</li>
                <li>Office fixes it or takes action</li>
                <li>We update the status</li>
              </ol>
            </div>

            <div style={cardStyle}>
              <h2>Types of Problems</h2>
              <p><strong>Illegal Logging</strong> - Cutting trees without permission.</p>
              <p><strong>Illegal Dumping</strong> - Throwing trash in open areas, rivers, or roadsides.</p>
              <p><strong>Dirty Water</strong> - Pollution affecting rivers, lakes, and other water sources.</p>
              <p><strong>Air Pollution</strong> - Harmful smoke, emissions, or bad air quality concerns.</p>
              <p><strong>Wildlife Harm</strong> - Illegal wildlife capture, abuse, or trade.</p>
            </div>
          </div>
        )}

        {page === "offices" && (
          <div style={cardStyle}>
            <h2>DENR Offices</h2>
            <p style={{ color: "#64748b" }}>Sample office list for demonstration only.</p>
            <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: "20px" }}>
              {officeList.map((office) => (
                <div key={office.name} style={{ border: "1px solid #e5e7eb", borderRadius: "16px", padding: "16px" }}>
                  <h3>{office.name}</h3>
                  <p>{office.location}</p>
                  <p>{office.contact}</p>
                </div>
              ))}
            </div>
          </div>
        )}

{page === "about" && (
  <div style={cardStyle}>
    <h2>About Us</h2>

    <p>
      e-Enforce PH is a student-friendly prototype for a universal environmental reporting website.
    </p>

    <p>
      Developed by students from <strong>Nueva Ecija University of Science and Technology (NEUST)</strong>.
    </p>

    <p>
      <strong>Program:</strong> Bachelor of Science in Business Administration Major in Human Resource Management (BSBA-HRM)<br />
      <strong>Section:</strong> BSBA-HRM-2-A<br />
      <strong>College:</strong> College of Management, Business and Technology
    </p>

    <h3 style={{ marginTop: "20px" }}>Team Members</h3>
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
            <h2>Saved Reports on This Computer</h2>
            <p style={{ color: "#64748b" }}>
              These reports are stored in your browser using localStorage.
            </p>

            {reports.length === 0 ? (
              <div style={{ padding: "30px", border: "1px dashed #cbd5e1", borderRadius: "16px", textAlign: "center", color: "#64748b" }}>
                No saved reports yet. Submit a report or load demo reports.
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", marginTop: "20px" }}>
                {reports.map((report) => (
                  <div key={report.id} style={{ border: "1px solid #e5e7eb", borderRadius: "16px", padding: "16px" }}>
                    <p style={{ fontSize: "12px", color: "#64748b" }}>{report.trackingCode}</p>
                    <h3>{report.issueType}</h3>
                    <p><strong>Status:</strong> {report.status}</p>
                    <p><strong>Location:</strong> {report.location}</p>
                    <p>{report.details}</p>
                    <p style={{ fontSize: "12px", color: "#94a3b8" }}>
                      Saved: {formatDate(report.submittedAt)}
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
