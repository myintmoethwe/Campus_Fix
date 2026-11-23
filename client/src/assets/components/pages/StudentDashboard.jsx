import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSideBar";
import StudentNavbar from "../components/StudentNavBar";
import { apiRequest } from "../services/api";
import "../../../App.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await apiRequest("/student/myIssue");

      console.log("Dashboard API Response:", result);

      const myIssues = result.issues || result.data || [];
      setIssues(myIssues);
    } catch (err) {
      console.error("Dashboard Error:", err);
      setError(err.message || "Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatus = (status) => {
    const value = String(status || "")
      .trim()
      .toUpperCase();

    const statusMap = {
      P: "Pending",
      PENDING: "Pending",
      A: "Approved",
      APPROVED: "Approved",
      I: "In Progress",
      IN_PROGRESS: "In Progress",
      "IN PROGRESS": "In Progress",
      R: "Resolved",
      RESOLVED: "Resolved",
    };

    return statusMap[value] || "Unknown";
  };

  // Statistics
  const totalIssues = issues.length;

  const pendingIssues = issues.filter(
    (issue) => getStatus(issue.status) === "Pending",
  ).length;

  const inProgressIssues = issues.filter(
    (issue) => getStatus(issue.status) === "In Progress",
  ).length;

  const resolvedIssues = issues.filter((issue) => {
    const status = getStatus(issue.status);
    return status === "Completed" || status === "Resolved";
  }).length;

  // Latest five issues
  const recentIssues = [...issues]
    .sort((a, b) => {
      return (
        new Date(b.created_at || b.createdAt || 0) -
        new Date(a.created_at || a.createdAt || 0)
      );
    })
    .slice(0, 5);

  const stats = [
    {
      title: "Total Issues",
      value: totalIssues,
      description: "All reported issues",
      icon: "bi-clipboard-data",
      color: "total",
    },
    {
      title: "Pending",
      value: pendingIssues,
      description: "Waiting for review",
      icon: "bi-clock-history",
      color: "pending",
    },
    {
      title: "In Progress",
      value: inProgressIssues,
      description: "Currently being fixed",
      icon: "bi bi-arrow-repeat",
      color: "progress",
    },
    {
      title: "Resolved",
      value: resolvedIssues,
      description: "Successfully completed",
      icon: "bi-check-circle",
      color: "resolved",
    },
  ];

  const displayName = user.name || "Student";

  return (
    <div className="dashboard-layout">
      <StudentSidebar />

      <main className="main-content">
        <StudentNavbar />

        <div className="student-dashboard">
          {/* PAGE HEADER */}
          <div className="dashboard-header">
            <div>
              <div className="dashboard-breadcrumb">
                STUDENT PORTAL <span>/</span> OVERVIEW
              </div>

              <h1>Dashboard</h1>
              <p>Welcome back, {displayName}!</p>
            </div>

            <button
              className="dashboard-submit-btn"
              onClick={() => navigate("/student/submit-issue")}
            >
              <i className="bi bi-plus-lg"></i>
              Submit New Issue
            </button>
          </div>

          {/* WELCOME BANNER */}
          <section className="dashboard-welcome">
            <div className="welcome-content">
              <span className="welcome-label">YOUR CAMPUS, YOUR VOICE</span>

              <h2>Hello, {displayName}! </h2>

              <p>
                Help us make your campus a better place. Report problems and
                keep track of their progress.
              </p>

              <button
                className="welcome-action"
                onClick={() => navigate("/student/submit-issue")}
              >
                Report an Issue
                <i className="bi bi-arrow-right"></i>
              </button>
            </div>

            <div className="welcome-decoration">
              <i className="bi bi-buildings"></i>
            </div>
          </section>

          {/* LOADING */}
          {loading && (
            <div className="dashboard-message">
              <div className="spinner-border"></div>
              <p>Loading your dashboard...</p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="dashboard-error">
              <i className="bi bi-exclamation-circle"></i>
              <span>{error}</span>
              <button onClick={fetchDashboardData}>Try Again</button>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* STATISTICS */}
              <section className="dashboard-stats-section">
                <div className="dashboard-section-title">
                  <div>
                    <h3>Issue Overview</h3>
                    <p>Summary of your submitted reports</p>
                  </div>
                </div>

                <div className="dashboard-stats-grid">
                  {stats.map((stat) => (
                    <div className="dashboard-stat-card" key={stat.title}>
                      <div className="stat-top">
                        <div className={`stat-icon ${stat.color}`}>
                          <i className={`bi ${stat.icon}`}></i>
                        </div>

                        <span className="stat-period">OVERVIEW</span>
                      </div>

                      <h2>{stat.value}</h2>

                      <h4>{stat.title}</h4>

                      <p>{stat.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* RECENT ISSUES */}
              <section className="dashboard-recent-section">
                <div className="dashboard-section-title">
                  <div>
                    <h3>Recent Issues</h3>
                    <p>Keep track of the latest issues you have reported.</p>
                  </div>

                  <button
                    className="dashboard-view-all"
                    onClick={() => navigate("/student/my-issue")}
                  >
                    View All
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>

                <div className="dashboard-table-card">
                  <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          <th>ISSUE ID</th>
                          <th>ISSUE TITLE</th>
                          <th>CATEGORY</th>
                          <th>DATE REPORTED</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>

                      <tbody>
                        {recentIssues.length > 0 ? (
                          recentIssues.map((issue) => {
                            const status = getStatus(issue.status);

                            return (
                              <tr key={issue.id}>
                                <td>
                                  <span className="issue-id">
                                    CF{String(issue.id).padStart(3, "0")}
                                  </span>
                                </td>

                                <td>
                                  <strong className="issue-title">
                                    {issue.title}
                                  </strong>
                                </td>

                                <td>
                                  <span className="issue-category">
                                    {issue.category}
                                  </span>
                                </td>

                                <td>
                                  <span className="issue-date">
                                    {issue.created_at || issue.createdAt
                                      ? new Date(
                                          issue.created_at || issue.createdAt,
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </span>
                                </td>

                                <td>
                                  <span
                                    className={`dashboard-status ${status
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}`}
                                  >
                                    <span className="status-dot"></span>
                                    {status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5">
                              <div className="dashboard-empty">
                                <div className="empty-icon">
                                  <i className="bi bi-clipboard-x"></i>
                                </div>

                                <h4>No issues reported yet</h4>

                                <p>
                                  You haven't submitted any campus issues. Start
                                  by reporting your first issue.
                                </p>

                                <button
                                  onClick={() =>
                                    navigate("/student/submit-issue")
                                  }
                                >
                                  <i className="bi bi-plus-lg"></i>
                                  Submit Your First Issue
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {recentIssues.length > 0 && (
                    <div className="dashboard-table-footer">
                      Showing {recentIssues.length} of {totalIssues} reported
                      issues
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default StudentDashboard;
