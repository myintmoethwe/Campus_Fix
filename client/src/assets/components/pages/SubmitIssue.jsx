import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import StudentSidebar from "../components/StudentSideBar";
import StudentNavbar from "../components/StudentNavBar";
import "../../../App.css";

function SubmitIssue() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      console.log("Submitting form:", form);

      const result = await apiRequest("/student/issue", {
        method: "POST",
        body: JSON.stringify(form),
      });

      alert(result.message || "Issue submitted successfully!");

      navigate("/student/dashboard");
    } catch (err) {
      console.error("Submit Issue Error:", err);
      setError(err.message || "Failed to submit issue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout submit-issue-layout">
      <StudentSidebar />

      <main className="main-content submit-issue-main">
        <StudentNavbar />

        <div className="submit-page-container">
          {/* Page Header */}
          <div className="submit-page-header">
            <div>
              <span className="submit-eyebrow">STUDENT PORTAL</span>

              <h2>Submit New Issue</h2>

              <p>
                Report a campus problem and help us improve your environment.
              </p>
            </div>

            <div className="submit-header-icon">
              <i className="bi bi-file-earmark-plus"></i>
            </div>
          </div>

          {/* Form Card */}
          <div className="submit-form-card">
            <div className="submit-form-heading">
              <div className="submit-form-heading-icon">
                <i className="bi bi-clipboard-check"></i>
              </div>

              <div>
                <h4>Issue Information</h4>
                <p>Please provide accurate information about the issue.</p>
              </div>
            </div>

            <div className="submit-divider"></div>

            {error && (
              <div className="submit-error">
                <i className="bi bi-exclamation-circle"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Issue Title */}
              <div className="submit-field">
                <label htmlFor="title">
                  Issue Title <span>*</span>
                </label>

                <div className="submit-input-wrapper">
                  <i className="bi bi-pencil"></i>

                  <input
                    id="title"
                    type="text"
                    name="title"
                    placeholder="Enter issue title"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="submit-field">
                <label htmlFor="category">
                  Category <span>*</span>
                </label>

                <div className="submit-input-wrapper">
                  <i className="bi bi-grid"></i>

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="submit-field">
                <label htmlFor="location">
                  Location <span>*</span>
                </label>

                <div className="submit-input-wrapper">
                  <i className="bi bi-geo-alt"></i>

                  <input
                    id="location"
                    type="text"
                    name="location"
                    placeholder="Example: Room 201, Library"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="submit-field">
                <label htmlFor="description">
                  Issue Description <span>*</span>
                </label>

                <div className="submit-textarea-wrapper">
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe the problem in detail..."
                    rows="5"
                    value={form.description}
                    onChange={handleChange}
                    required
                  />
                </div>

                <small className="submit-field-hint">
                  Provide enough details to help the administration understand
                  the problem.
                </small>
              </div>

              {/* Buttons */}
              <div className="submit-actions">
                <button
                  type="submit"
                  className="submit-primary-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send"></i>
                      Submit Issue
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="submit-cancel-btn"
                  onClick={() => navigate("/student/dashboard")}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Note */}
          <div className="submit-info-note">
            <i className="bi bi-info-circle"></i>
            <span>
              Your submitted issue will be reviewed by the campus
              administration.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SubmitIssue;
