import { useEffect, useState } from "react";
import { apiRequest } from "../../services/api";
import AdminSidebar from "../../components/AdminSidebar";

function ManageIssue() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState(null);

  // CUSTOM STATUS MODAL
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const statusOptions = [
    { value: "P", label: "Pending" },
    { value: "A", label: "Approved" },
    { value: "I", label: "In Progress" },
    { value: "R", label: "Resolved" },
  ];

  // FETCH ALL ISSUES
  const fetchIssues = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/admin/issues");
      setIssues(data.issues || data.data || []);
    } catch (err) {
      console.error("Fetch Issues Error:", err);
      setError(err.message || "Failed to load issues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // STATUS LABEL
  const getStatusLabel = (status) => {
    const labels = {
      P: "Pending",
      A: "Approved",
      I: "In Progress",
      R: "Resolved",
    };

    return labels[String(status || "").toUpperCase()] || "Unknown";
  };

  // STATUS CLASS
  const getStatusClass = (status) => {
    const classes = {
      P: "status-pending",
      A: "status-approved",
      I: "status-progress",
      R: "status-resolved",
    };

    return classes[String(status || "").toUpperCase()] || "status-unknown";
  };

  // OPEN CUSTOM MODAL
  const openStatusModal = (issue, newStatus) => {
    const currentStatus = String(issue.status || "").toUpperCase();

    if (currentStatus === newStatus) return;

    setSelectedIssue(issue);
    setSelectedStatus(newStatus);
    setShowStatusModal(true);
  };

  // CLOSE CUSTOM MODAL
  const closeStatusModal = () => {
    if (updatingId !== null) return;

    setShowStatusModal(false);
    setSelectedIssue(null);
    setSelectedStatus("");
  };

  // UPDATE ISSUE STATUS
  const updateStatus = async () => {
    if (!selectedIssue || !selectedStatus) return;

    try {
      setUpdatingId(selectedIssue.id);

      const response = await apiRequest(
        `/admin/issues/${selectedIssue.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: selectedStatus,
          }),
        },
      );

      if (response.success === false) {
        throw new Error(response.message || "Update failed");
      }

      setShowStatusModal(false);
      setSelectedIssue(null);
      setSelectedStatus("");

      await fetchIssues();
    } catch (err) {
      console.error("Update Status Error:", err);
      alert(err.message || "Failed to update issue status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // SEARCH AND FILTER
  const filteredIssues = issues.filter((issue) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      String(issue.title || "")
        .toLowerCase()
        .includes(keyword) ||
      String(issue.category || "")
        .toLowerCase()
        .includes(keyword) ||
      String(issue.location || "")
        .toLowerCase()
        .includes(keyword) ||
      String(issue.description || "")
        .toLowerCase()
        .includes(keyword) ||
      String(issue.student_name || "")
        .toLowerCase()
        .includes(keyword) ||
      String(issue.student_email || "")
        .toLowerCase()
        .includes(keyword);

    const matchesStatus =
      statusFilter === "ALL" ||
      String(issue.status || "").toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // STATISTICS
  const totalIssues = issues.length;
  const pendingIssues = issues.filter((i) => i.status === "P").length;
  const approvedIssues = issues.filter((i) => i.status === "A").length;
  const inProgressIssues = issues.filter((i) => i.status === "I").length;
  const resolvedIssues = issues.filter((i) => i.status === "R").length;

  const statistics = [
    {
      title: "Total Issues",
      value: totalIssues,
      icon: "bi-clipboard-data",
      color: "stat-blue",
      description: "All submitted issues",
    },
    {
      title: "Pending",
      value: pendingIssues,
      icon: "bi-clock-history",
      color: "stat-orange",
      description: "Waiting for review",
    },
    {
      title: "Approved",
      value: approvedIssues,
      icon: "bi-patch-check",
      color: "stat-purple",
      description: "Approved requests",
    },
    {
      title: "In Progress",
      value: inProgressIssues,
      icon: "bi-arrow-repeat",
      color: "stat-cyan",
      description: "Currently working on",
    },
    {
      title: "Resolved",
      value: resolvedIssues,
      icon: "bi-check-circle",
      color: "stat-green",
      description: "Successfully completed",
    },
  ];

  return (
    <div className="d-flex manage-issue-page">
      <AdminSidebar />

      <main className="manage-issue-main flex-grow-1">
        <div className="container-fluid px-3 px-lg-4 py-4">
          {/* PAGE HEADER */}
          <div className="manage-header d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
            <div>
              <div className="page-breadcrumb mb-2">
                <i className="bi bi-house-door me-2"></i>
                Admin / <span>Manage Issues</span>
              </div>

              <h2 className="page-title mb-1">Manage Issues</h2>

              <p className="page-subtitle mb-0">
                Review, track and manage campus issues submitted by students.
              </p>
            </div>

            <button
              className="refresh-btn"
              onClick={fetchIssues}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Refresh Data
            </button>
          </div>

          {/* STATISTICS */}
          <div className="row g-3 mb-4">
            {statistics.map((stat, index) => (
              <div className="col-6 col-md-4 col-xl" key={index}>
                <div className="stat-card h-100">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="stat-title">{stat.title}</p>
                      <h3 className="stat-number">{stat.value}</h3>
                    </div>

                    <div className={`stat-icon ${stat.color}`}>
                      <i className={`bi ${stat.icon}`}></i>
                    </div>
                  </div>

                  <p className="stat-description mb-0">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* MAIN CARD */}
          <div className="issue-content-card">
            {/* CARD HEADER */}
            <div className="issue-card-header">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h5 className="section-title mb-1">
                    <i className="bi bi-list-ul me-2"></i>
                    All Submitted Issues
                  </h5>

                  <p className="section-subtitle mb-0">
                    View and update student issue reports.
                  </p>
                </div>

                <span className="total-count">
                  {issues.length} Total Issues
                </span>
              </div>
            </div>

            {/* SEARCH AND FILTER */}
            <div className="issue-toolbar">
              <div className="row g-3">
                <div className="col-md-8">
                  <div className="search-box">
                    <i className="bi bi-search"></i>

                    <input
                      type="text"
                      placeholder="Search by title, student, category or location..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />

                    {search && (
                      <button
                        type="button"
                        className="clear-search"
                        onClick={() => setSearch("")}
                      >
                        <i className="bi bi-x-circle"></i>
                      </button>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="filter-box">
                    <i className="bi bi-funnel"></i>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="ALL">All Statuses</option>

                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ISSUES TABLE */}
            <div className="issue-table-wrapper">
              {loading ? (
                <div className="loading-state">
                  <div className="spinner-border"></div>
                  <p>Loading issues...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <i className="bi bi-exclamation-circle"></i>
                  <p>{error}</p>

                  <button onClick={fetchIssues}>Try Again</button>
                </div>
              ) : filteredIssues.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="bi bi-inbox"></i>
                  </div>

                  <h6>No Issues Found</h6>

                  <p>No issues match your current search or filter.</p>

                  <button
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("ALL");
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table issue-table align-middle mb-0">
                    <thead>
                      <tr>
                        <th className="ps-4">ISSUE ID</th>
                        <th>ISSUE DETAILS</th>
                        <th>CATEGORY</th>
                        <th>LOCATION</th>
                        <th>STUDENT</th>
                        <th>STATUS</th>
                        <th className="pe-4">UPDATE STATUS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredIssues.map((issue) => {
                        const currentStatus = String(
                          issue.status || "",
                        ).toUpperCase();

                        return (
                          <tr key={issue.id}>
                            <td className="ps-4">
                              <span className="issue-id">#{issue.id}</span>
                            </td>

                            <td>
                              <div className="issue-detail">
                                <h6>{issue.title || "Untitled"}</h6>
                                <p>
                                  {issue.description ||
                                    "No description provided"}
                                </p>
                              </div>
                            </td>

                            <td>
                              <span className="category-tag">
                                {issue.category || "-"}
                              </span>
                            </td>

                            <td>
                              <div className="location-text">
                                <i className="bi bi-geo-alt me-1"></i>
                                {issue.location || "-"}
                              </div>
                            </td>

                            <td>
                              <div className="student-info">
                                <div className="student-avatar">
                                  <i className="bi bi-person"></i>
                                </div>

                                <div>
                                  <div className="student-name">
                                    {issue.student_name ||
                                      issue.student_email ||
                                      `Student ${issue.student_id || ""}`}
                                  </div>

                                  {issue.student_email && (
                                    <small>{issue.student_email}</small>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td>
                              <span
                                className={`status-badge ${getStatusClass(currentStatus)}`}
                              >
                                <span className="status-dot"></span>
                                {getStatusLabel(currentStatus)}
                              </span>
                            </td>

                            <td className="pe-4">
                              <div className="status-control">
                                <select
                                  className="status-select"
                                  value={currentStatus}
                                  disabled={updatingId === issue.id}
                                  onChange={(e) =>
                                    openStatusModal(issue, e.target.value)
                                  }
                                >
                                  {statusOptions.map((status) => (
                                    <option
                                      key={status.value}
                                      value={status.value}
                                    >
                                      {status.label}
                                    </option>
                                  ))}
                                </select>

                                {updatingId === issue.id && (
                                  <small className="updating-text">
                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                    Updating...
                                  </small>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* TABLE FOOTER */}
            <div className="issue-table-footer">
              <span>
                Showing <strong>{filteredIssues.length}</strong> of{" "}
                <strong>{issues.length}</strong> issues
              </span>

              <span>
                <i className="bi bi-shield-check me-1"></i>
                Admin Management
              </span>
            </div>
          </div>

          <div className="page-footer">
            CampusFix Admin Panel · Issue Management
          </div>
        </div>
      </main>

      {/* CUSTOM STATUS CONFIRMATION MODAL */}
      {showStatusModal && selectedIssue && (
        <div
          className="status-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeStatusModal();
          }}
        >
          <div className="status-modal">
            <div className="modal-top">
              <div className="modal-icon">
                <i className="bi bi-arrow-left-right"></i>
              </div>

              <button
                className="modal-close"
                onClick={closeStatusModal}
                disabled={updatingId !== null}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <h5>Update Issue Status</h5>

            <p className="modal-description">
              Are you sure you want to change the status of this issue?
            </p>

            <div className="modal-issue-info">
              <span>ISSUE #{selectedIssue.id}</span>
              <h6>{selectedIssue.title || "Untitled Issue"}</h6>
            </div>

            <div className="status-change-container">
              <div className="status-change-item">
                <small>Current Status</small>

                <span
                  className={`status-badge ${getStatusClass(selectedIssue.status)}`}
                >
                  <span className="status-dot"></span>
                  {getStatusLabel(selectedIssue.status)}
                </span>
              </div>

              <i className="bi bi-arrow-right status-arrow"></i>

              <div className="status-change-item">
                <small>New Status</small>

                <span
                  className={`status-badge ${getStatusClass(selectedStatus)}`}
                >
                  <span className="status-dot"></span>
                  {getStatusLabel(selectedStatus)}
                </span>
              </div>
            </div>

            <p className="modal-note">
              <i className="bi bi-info-circle me-1"></i>
              This action will update the issue status.
            </p>

            <div className="modal-actions">
              <button
                className="modal-cancel-btn"
                onClick={closeStatusModal}
                disabled={updatingId !== null}
              >
                Cancel
              </button>

              <button
                className="modal-confirm-btn"
                onClick={updateStatus}
                disabled={updatingId !== null}
              >
                {updatingId !== null ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check2 me-1"></i>
                    Confirm Update
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style>{`
        .manage-issue-page {
          --primary: #365f78;
          --primary-dark: #294c63;
          background: #f5f7f9;
          min-height: 100vh;
          color: #263b49;
        }

        .manage-issue-main {
          min-width: 0;
          background: #f5f7f9;
        }

        .page-breadcrumb {
          color: #99a6af;
          font-size: 13px;
          font-weight: 500;
        }

        .page-breadcrumb span {
          color: #365f78;
        }

        .page-title {
          color: #294c63;
          font-size: 27px;
          font-weight: 750;
          letter-spacing: -.7px;
        }

        .page-subtitle {
          color: #8796a1;
          font-size: 14px;
        }

        .refresh-btn {
          border: 1px solid #dce5ea;
          background: white;
          color: #365f78;
          padding: 10px 17px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          transition: .2s;
        }

        .refresh-btn:hover {
          background: #365f78;
          color: white;
          border-color: #365f78;
        }

        .refresh-btn:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        /* STATISTICS */

        .stat-card {
          background: white;
          border: 1px solid #edf0f2;
          border-radius: 12px;
          padding: 17px;
          transition: .2s;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 22px rgba(39, 70, 89, .07);
        }

        .stat-title {
          font-size: 12px;
          color: #8998a3;
          font-weight: 600;
          margin-bottom: 9px;
        }

        .stat-number {
          font-size: 27px;
          color: #294c63;
          font-weight: 750;
          margin-bottom: 0;
        }

        .stat-icon {
          width: 39px;
          height: 39px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .stat-blue {
          background: #eaf1f5;
          color: #365f78;
        }

        .stat-orange {
          background: #fff4e5;
          color: #d99532;
        }

        .stat-purple {
          background: #f1edfa;
          color: #8468b8;
        }

        .stat-cyan {
          background: #e7f5f7;
          color: #3994a5;
        }

        .stat-green {
          background: #e9f5ee;
          color: #47966a;
        }

        .stat-description {
          font-size: 11px;
          color: #a0acb4;
          margin-top: 12px;
        }

        /* MAIN CARD */

        .issue-content-card {
          background: white;
          border: 1px solid #e9eef1;
          border-radius: 13px;
          overflow: hidden;
          box-shadow: 0 3px 15px rgba(36, 65, 83, .035);
        }

        .issue-card-header {
          padding: 23px 24px 19px;
          border-bottom: 1px solid #edf0f2;
        }

        .section-title {
          font-size: 16px;
          color: #294c63;
          font-weight: 700;
        }

        .section-subtitle {
          color: #98a4ad;
          font-size: 12px;
        }

        .total-count {
          background: #edf3f6;
          color: #365f78;
          font-size: 12px;
          font-weight: 650;
          padding: 8px 13px;
          border-radius: 7px;
        }

        /* SEARCH AND FILTER */

        .issue-toolbar {
          padding: 17px 24px;
          border-bottom: 1px solid #edf0f2;
        }

        .search-box,
        .filter-box {
          height: 42px;
          border: 1px solid #e4eaee;
          background: #fafcfd;
          border-radius: 8px;
          display: flex;
          align-items: center;
          padding: 0 13px;
          gap: 10px;
          color: #8b9ba6;
          transition: .2s;
        }

        .search-box:focus-within,
        .filter-box:focus-within {
          border-color: #6c91a8;
          background: white;
          box-shadow: 0 0 0 3px rgba(54, 95, 120, .07);
        }

        .search-box input,
        .filter-box select {
          width: 100%;
          min-width: 0;
          height: 100%;
          border: none;
          outline: none;
          background: transparent;
          font-size: 12px;
          color: #405564;
        }

        .search-box input::placeholder {
          color: #aab5bc;
        }

        .filter-box select {
          cursor: pointer;
        }

        .clear-search {
          border: none;
          background: none;
          color: #99a7b0;
          padding: 0;
        }

        /* TABLE */

        .issue-table-wrapper {
          min-height: 220px;
        }

        .issue-table {
          white-space: nowrap;
        }

        .issue-table thead th {
          background: #f8fafb;
          color: #84939e;
          font-size: 10px;
          letter-spacing: .6px;
          font-weight: 700;
          padding: 16px 12px;
          border-bottom: 1px solid #e9eef1;
        }

        .issue-table tbody td {
          padding: 16px 12px;
          border-bottom: 1px solid #f0f2f4;
          font-size: 12px;
          color: #526572;
        }

        .issue-table tbody tr {
          transition: background .2s;
        }

        .issue-table tbody tr:hover {
          background: #f8fbfc;
        }

        .issue-table tbody tr:last-child td {
          border-bottom: none;
        }

        .issue-id {
          color: #365f78;
          background: #edf3f6;
          border-radius: 6px;
          padding: 6px 9px;
          font-weight: 700;
          font-size: 11px;
        }

        .issue-detail {
          max-width: 210px;
          white-space: normal;
        }

        .issue-detail h6 {
          color: #344b5a;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 5px;
        }

        .issue-detail p {
          color: #98a5ae;
          font-size: 11px;
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .category-tag {
          display: inline-block;
          background: #f0f4f6;
          color: #536c7c;
          padding: 6px 9px;
          border-radius: 5px;
          font-size: 11px;
          font-weight: 600;
        }

        .location-text {
          color: #70818d;
          font-size: 11px;
        }

        .location-text i {
          color: #365f78;
        }

        .student-info {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .student-avatar {
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #edf3f6;
          color: #365f78;
          border-radius: 50%;
          font-size: 15px;
        }

        .student-name {
          color: #405564;
          font-weight: 650;
          font-size: 11px;
          max-width: 135px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .student-info small {
          display: block;
          color: #a0acb4;
          font-size: 10px;
          margin-top: 3px;
        }

        /* STATUS BADGES */

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: 650;
          white-space: nowrap;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .status-pending {
          background: #fff5e6;
          color: #c88a2e;
        }

        .status-approved {
          background: #eaf1fb;
          color: #527eb5;
        }

        .status-progress {
          background: #e6f4f7;
          color: #368a9b;
        }

        .status-resolved {
          background: #e9f5ed;
          color: #4c9567;
        }

        .status-unknown {
          background: #f0f2f4;
          color: #7b8790;
        }

        /* STATUS SELECT */

        .status-control {
          min-width: 125px;
        }

        .status-select {
          width: 100%;
          border: 1px solid #e1e8ec;
          background: white;
          color: #365f78;
          border-radius: 7px;
          padding: 8px 9px;
          font-size: 11px;
          font-weight: 600;
          outline: none;
          cursor: pointer;
        }

        .status-select:focus {
          border-color: #365f78;
          box-shadow: 0 0 0 3px rgba(54, 95, 120, .08);
        }

        .status-select:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .updating-text {
          display: block;
          color: #365f78;
          margin-top: 5px;
          font-size: 10px;
        }

        /* LOADING / EMPTY / ERROR */

        .loading-state,
        .empty-state,
        .error-state {
          min-height: 260px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 30px;
        }

        .loading-state .spinner-border {
          color: #365f78;
        }

        .loading-state p {
          color: #95a2ab;
          font-size: 13px;
          margin-top: 13px;
        }

        .empty-icon {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: #edf3f6;
          color: #365f78;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 26px;
          margin-bottom: 15px;
        }

        .empty-state h6 {
          color: #405564;
          font-weight: 700;
        }

        .empty-state p,
        .error-state p {
          color: #98a5ae;
          font-size: 12px;
        }

        .empty-state button,
        .error-state button {
          background: #365f78;
          border: none;
          color: white;
          padding: 8px 15px;
          border-radius: 7px;
          font-size: 12px;
          margin-top: 5px;
        }

        .error-state > i {
          color: #d66c6c;
          font-size: 30px;
          margin-bottom: 10px;
        }

        /* TABLE FOOTER */

        .issue-table-footer {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          padding: 15px 24px;
          border-top: 1px solid #edf0f2;
          color: #98a5ae;
          font-size: 11px;
        }

        .issue-table-footer strong {
          color: #365f78;
        }

        .issue-table-footer i {
          color: #365f78;
        }

        .page-footer {
          color: #a3afb7;
          text-align: center;
          font-size: 11px;
          padding: 22px 0 5px;
        }

        /* CUSTOM MODAL */

        .status-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(25, 43, 55, .48);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          padding: 20px;
          animation: modalFade .2s ease;
        }

        .status-modal {
          background: white;
          width: 100%;
          max-width: 440px;
          border-radius: 16px;
          padding: 30px;
          box-shadow: 0 20px 60px rgba(20, 45, 60, .18);
          animation: modalSlide .25s ease;
        }

        .modal-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 17px;
        }

        .modal-icon {
          width: 52px;
          height: 52px;
          background: #edf3f6;
          color: #365f78;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
        }

        .modal-close {
          width: 32px;
          height: 32px;
          background: #f5f7f8;
          color: #84939e;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          transition: .2s;
        }

        .modal-close:hover {
          background: #edf1f3;
          color: #365f78;
        }

        .modal-close:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .status-modal h5 {
          color: #294c63;
          font-weight: 750;
          font-size: 19px;
          margin-bottom: 8px;
        }

        .modal-description {
          color: #8796a1;
          font-size: 13px;
          line-height: 1.6;
        }

        .modal-issue-info {
          background: #f7f9fa;
          border: 1px solid #edf0f2;
          border-radius: 10px;
          padding: 14px;
          margin: 20px 0;
        }

        .modal-issue-info span {
          color: #365f78;
          font-size: 10px;
          font-weight: 750;
          letter-spacing: .7px;
        }

        .modal-issue-info h6 {
          color: #344b5a;
          font-size: 13px;
          font-weight: 650;
          margin: 7px 0 0;
        }

        .status-change-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 15px 10px;
          background: #fbfcfd;
          border: 1px solid #edf0f2;
          border-radius: 10px;
        }

        .status-change-item {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .status-change-item small {
          color: #98a5ae;
          font-size: 10px;
          font-weight: 600;
        }

        .status-arrow {
          color: #365f78;
          font-size: 18px;
        }

        .modal-note {
          color: #8b9aa4;
          font-size: 11px;
          margin: 17px 0 20px;
        }

        .modal-note i {
          color: #365f78;
        }

        .modal-actions {
          display: flex;
          gap: 10px;
        }

        .modal-actions button {
          flex: 1;
          padding: 11px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 650;
          transition: .2s;
        }

        .modal-cancel-btn {
          background: white;
          color: #71818c;
          border: 1px solid #dfe6ea;
        }

        .modal-cancel-btn:hover {
          background: #f5f7f8;
        }

        .modal-confirm-btn {
          background: #365f78;
          color: white;
          border: 1px solid #365f78;
        }

        .modal-confirm-btn:hover {
          background: #294c63;
        }

        .modal-confirm-btn:disabled,
        .modal-cancel-btn:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        @keyframes modalFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlide {
          from {
            opacity: 0;
            transform: translateY(15px) scale(.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* RESPONSIVE */

        @media (max-width: 768px) {
          .page-title {
            font-size: 23px;
          }

          .issue-card-header {
            padding: 18px;
          }

          .issue-toolbar {
            padding: 15px 18px;
          }

          .issue-table-footer {
            padding: 14px 18px;
          }
        }

        @media (max-width: 480px) {
          .stat-card {
            padding: 13px;
          }

          .stat-number {
            font-size: 23px;
          }

          .stat-description {
            font-size: 10px;
          }

          .status-modal {
            padding: 22px;
          }

          .status-change-container {
            gap: 5px;
          }

          .status-change-item .status-badge {
            font-size: 9px;
            padding: 6px;
          }
        }
      `}</style>
    </div>
  );
}

export default ManageIssue;
