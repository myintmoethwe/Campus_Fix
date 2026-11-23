import { NavLink, useNavigate } from "react-router-dom";

function StudentSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuItems = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
      icon: "bi-grid-1x2-fill",
    },
    {
      name: "Submit Issue",
      path: "/student/submit-issue",
      icon: "bi-plus-square-fill",
    },
    {
      name: "My Issues",
      path: "/student/my-issue",
      icon: "bi-clipboard2-check-fill",
    },
  ];

  return (
    <aside className="cf-sidebar">
      {/* BRAND */}
      <div className="cf-brand">
        <div className="cf-brand-icon">
          <i className="bi bi-tools"></i>
        </div>
        <div>
          <h4>CampusFix</h4>
          <span>Campus Management</span>
        </div>
      </div>

      <div className="cf-menu-label">STUDENT WORKSPACE</div>

      {/* NAVIGATION */}
      <nav className="cf-navigation">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `cf-nav-link ${isActive ? "active" : ""}`
            }
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.name}</span>
            {item.name === "Dashboard" && (
              <i className="bi bi-chevron-right cf-arrow"></i>
            )}
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM SECTION */}
      <div className="cf-sidebar-bottom">
        <div className="cf-user-card">
          <div className="cf-avatar">
            {(user.name || "S").charAt(0).toUpperCase()}
          </div>
          <div className="cf-user-info">
            <strong>{user.name || "Student"}</strong>
            <span>Student Account</span>
          </div>
          <i className="bi bi-person-check-fill cf-user-status"></i>
        </div>

        <button className="cf-logout" onClick={handleLogout}>
          <i className="bi bi-box-arrow-left"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default StudentSidebar;
