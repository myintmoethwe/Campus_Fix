import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import StudentSidebar from "../components/StudentSideBar";

function MyIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await apiRequest("/student/myIssue");

      setIssues(result.issues || result.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load your issues.");
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (status) => {
    const statuses = {
      P: "Pending",
      A: "Approved",
      I: "In Progress",
      R: "Resolved",
    };

    return statuses[status?.trim()] || status || "Unknown";
  };

  const getStatusStyle = (status) => {
    const styles = {
      P: "pending",
      A: "approved",
      I: "In Progress",
      R: "Resolved",
    };

    return styles[status?.trim()] || "unknown";
  };

  return (
    <div className="d-flex myissues-layout">
      <StudentSidebar />

      <main className="myissues-main">
        {/* Header */}
        <div className="myissues-header">
          <div>
            <span className="myissues-eyebrow">STUDENT PORTAL</span>
            <h2>My Issues</h2>
            <p>
              Track and monitor the progress of your submitted campus reports.
            </p>
          </div>

          <div className="myissues-header-icon">
            <i className="bi bi-clipboard2-check"></i>
          </div>
        </div>

        {/* Summary */}
        <div className="row g-3 myissues-summary">
          <div className="col-md-6">
            <div className="summary-card">
              <div>
                <span>Total Submissions</span>
                <h3>{issues.length}</h3>
                <small>All your reported issues</small>
              </div>
              <div className="summary-icon">
                <i className="bi bi-file-earmark-text"></i>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="summary-card">
              <div>
                <span>Completed Issues</span>
                <h3>
                  {
                    issues.filter((issue) => issue.status?.trim() === "C")
                      .length
                  }
                </h3>
                <small>Successfully resolved reports</small>
              </div>
              <div className="summary-icon completed-icon">
                <i className="bi bi-check2-circle"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Section */}
        <div className="issues-section">
          <div className="issues-section-header">
            <div>
              <h4>Your Submissions</h4>
              <p>All issues you have reported</p>
            </div>

            <button
              className="refresh-btn"
              onClick={fetchMyIssues}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise"></i>
              Refresh
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="issues-message">
              <div className="spinner-border text-primary"></div>
              <p>Loading your issues...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="issues-error">
              <i className="bi bi-exclamation-circle"></i>
              <p>{error}</p>
              <button onClick={fetchMyIssues}>Try Again</button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && issues.length === 0 && (
            <div className="empty-issues">
              <div className="empty-icon">
                <i className="bi bi-inbox"></i>
              </div>
              <h5>No issues submitted yet</h5>
              <p>When you report a campus issue, it will appear here.</p>
            </div>
          )}

          {/* Issue Cards */}
          {!loading && !error && issues.length > 0 && (
            <div className="row g-3">
              {issues.map((issue) => (
                <div className="col-12 col-lg-6" key={issue.id}>
                  <div className="issue-card">
                    <div className="issue-card-top">
                      <div className="issue-category-icon">
                        <i className="bi bi-exclamation-circle"></i>
                      </div>

                      <span
                        className={`issue-status ${getStatusStyle(
                          issue.status,
                        )}`}
                      >
                        <span className="status-dot"></span>
                        {getStatus(issue.status)}
                      </span>
                    </div>

                    <div className="issue-content">
                      <h5>{issue.title}</h5>

                      <span className="issue-category">{issue.category}</span>

                      <p className="issue-description">{issue.description}</p>
                    </div>

                    <div className="issue-details">
                      <div>
                        <i className="bi bi-geo-alt"></i>
                        <span>{issue.location}</span>
                      </div>

                      <div>
                        <i className="bi bi-calendar3"></i>
                        <span>
                          {issue.created_at
                            ? new Date(issue.created_at).toLocaleDateString()
                            : "Not available"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyIssues;
