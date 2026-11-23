import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { apiRequest } from "../../services/api";

function AdminDashboard() {
  const [statistics, setStatistics] = useState({
    total_issues: 0,
    pending_issues: 0,
    in_progress_issues: 0,
    resolved_issues: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/admin/dashboard");
      setStatistics(data.statistics);
    } catch (err) {
      console.error("Dashboard error:", err);
      setError("Failed to load dashboard information.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Issues",
      value: statistics.total_issues,
      icon: "bi-clipboard-data",
      color: "#365f78",
      bg: "#eaf1f5",
      description: "All reported issues",
    },
    {
      title: "Pending Issues",
      value: statistics.pending_issues,
      icon: "bi-clock-history",
      color: "#d99a36",
      bg: "#fff6e8",
      description: "Waiting for action",
    },
    {
      title: "In Progress",
      value: statistics.in_progress_issues,
      icon: "bi-arrow-repeat",
      color: "#478ba8",
      bg: "#eaf5fa",
      description: "Currently being handled",
    },
    {
      title: "Resolved",
      value: statistics.resolved_issues,
      icon: "bi-check-circle",
      color: "#369477",
      bg: "#eaf6f1",
      description: "Successfully completed",
    },
  ];

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", background: "#F5F8FA" }}
      >
        <div className="text-center">
          <div className="spinner-border" style={{ color: "#365f78" }}></div>
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const total = Number(statistics.total_issues || 0);

  return (
    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        background: "#F5F8FA",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <AdminSidebar />

      <main className="flex-grow-1 p-3 p-md-4 p-xl-5" style={{ minWidth: 0 }}>
        {/* HEADER */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <div
              className="small fw-semibold mb-2"
              style={{ color: "#7891a0" }}
            >
              CAMPUSFIX / ADMINISTRATION
            </div>

            <h2
              className="fw-bold mb-2"
              style={{ color: "#263d4b", letterSpacing: "-0.7px" }}
            >
              Dashboard Overview
            </h2>

            <p className="text-secondary mb-0">
              Monitor and manage campus issues from one place.
            </p>
          </div>

          <button
            onClick={fetchDashboard}
            className="btn d-flex align-items-center gap-2 px-4 py-2"
            style={{
              background: "#365f78",
              color: "white",
              borderRadius: "9px",
              border: "none",
              fontWeight: "500",
            }}
          >
            <i className="bi bi-arrow-clockwise"></i>
            Refresh Data
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={fetchDashboard}
            >
              Retry
            </button>
          </div>
        )}

        {/* STATISTICS */}
        <div className="row g-3 g-xl-4 mb-4">
          {statCards.map((card, index) => (
            <div className="col-12 col-sm-6 col-xl-3" key={index}>
              <div
                className="h-100 p-4 bg-white"
                style={{
                  borderRadius: "14px",
                  border: "1px solid #e8eef2",
                  boxShadow: "0 3px 15px rgba(39, 68, 85, 0.04)",
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <p
                      className="mb-2 fw-medium"
                      style={{ color: "#788b97", fontSize: "14px" }}
                    >
                      {card.title}
                    </p>

                    <h2
                      className="fw-bold mb-0"
                      style={{
                        color: "#263d4b",
                        fontSize: "32px",
                      }}
                    >
                      {Number(card.value || 0)}
                    </h2>
                  </div>

                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: card.bg,
                      color: card.color,
                    }}
                  >
                    <i className={`bi ${card.icon} fs-5`}></i>
                  </div>
                </div>

                <div className="small" style={{ color: "#9aaab3" }}>
                  {card.description}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ISSUE OVERVIEW */}
        <div className="row g-4">
          <div className="col-12 col-xl-8">
            <div
              className="bg-white p-4 h-100"
              style={{
                borderRadius: "14px",
                border: "1px solid #e8eef2",
                boxShadow: "0 3px 15px rgba(39, 68, 85, 0.04)",
              }}
            >
              <div className="mb-4">
                <h5 className="fw-bold mb-1" style={{ color: "#263d4b" }}>
                  Issue Overview
                </h5>

                <p className="text-secondary small mb-0">
                  Current distribution of reported issues
                </p>
              </div>

              {statCards.slice(1).map((card, index) => {
                const count = Number(card.value || 0);
                const percentage = total > 0 ? (count / total) * 100 : 0;

                return (
                  <div className="mb-4" key={index}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span
                          style={{
                            width: "9px",
                            height: "9px",
                            borderRadius: "50%",
                            background: card.color,
                            display: "inline-block",
                          }}
                        ></span>

                        <span
                          className="fw-medium"
                          style={{
                            color: "#536a78",
                            fontSize: "14px",
                          }}
                        >
                          {card.title}
                        </span>
                      </div>

                      <div>
                        <strong style={{ color: "#263d4b" }}>{count}</strong>

                        <span
                          className="small ms-2"
                          style={{ color: "#9aaab3" }}
                        >
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        height: "9px",
                        background: "#edf1f4",
                        borderRadius: "20px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: card.color,
                          borderRadius: "20px",
                          transition: "width 0.5s ease",
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}

              <div
                className="d-flex justify-content-between align-items-center pt-3 mt-2"
                style={{ borderTop: "1px solid #edf1f4" }}
              >
                <span className="small text-secondary">
                  Total reported issues
                </span>

                <strong style={{ color: "#365f78" }}>{total}</strong>
              </div>
            </div>
          </div>

          {/* SUMMARY CARD */}
          <div className="col-12 col-xl-4">
            <div
              className="p-4 h-100"
              style={{
                background: "#365f78",
                borderRadius: "14px",
                color: "white",
                boxShadow: "0 5px 18px rgba(54, 95, 120, 0.12)",
              }}
            >
              <div
                className="d-flex align-items-center justify-content-center mb-4"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.14)",
                }}
              >
                <i className="bi bi-graph-up-arrow fs-5"></i>
              </div>

              <h5 className="fw-bold mb-2">Campus Issue Summary</h5>

              <p
                className="small mb-4"
                style={{ color: "#d0e0e9", lineHeight: "1.7" }}
              >
                Here's the current status of issues reported across your campus.
              </p>

              <div
                className="p-3 mb-3"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: "10px",
                }}
              >
                <div className="small mb-1" style={{ color: "#d0e0e9" }}>
                  Total Issues
                </div>

                <h2 className="fw-bold mb-0">{total}</h2>
              </div>

              <div
                className="d-flex justify-content-between align-items-center py-2"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}
              >
                <span className="small">Resolved</span>
                <strong>{Number(statistics.resolved_issues || 0)}</strong>
              </div>

              <div className="d-flex justify-content-between align-items-center py-2">
                <span className="small">Still need attention</span>

                <strong>
                  {Number(statistics.pending_issues || 0) +
                    Number(statistics.in_progress_issues || 0)}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="text-center mt-5 pt-3 small"
          style={{
            color: "#9aaab3",
            borderTop: "1px solid #e8eef2",
          }}
        >
          CampusFix Administration © 2026
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
