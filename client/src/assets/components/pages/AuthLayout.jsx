import "../../../../Auth.css";

function AuthLayout({ children }) {
  return (
    <div className="auth-page">
      {/* LEFT: BRANDING */}
      <section className="auth-welcome">
        <div className="brand">
          <div className="brand-icon">
            <i className="bi bi-tools"></i>
          </div>
          <span>CampusFix</span>
        </div>

        <div className="welcome-text">
          <h1>WELCOME TO THE</h1>
          <h2>Student Portal</h2>
          <p>Making your campus better, one issue at a time.</p>
        </div>

        <div className="welcome-footer">CAMPUSFIX MANAGEMENT SYSTEM</div>
      </section>

      {/* RIGHT: AUTH FORM */}
      <section className="auth-panel">
        <div className="auth-card">{children}</div>
      </section>
    </div>
  );
}

export default AuthLayout;
