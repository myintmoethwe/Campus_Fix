import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
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
      path: "/admin/dashboard",
      icon: "bi-grid-1x2-fill",
    },
    {
      name: "Manage Issues",
      path: "/admin/issues",
      icon: "bi-clipboard2-data-fill",
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

      <div className="cf-menu-label">ADMIN WORKSPACE</div>

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
          </NavLink>
        ))}
      </nav>

      {/* BOTTOM SECTION */}
      <div className="cf-sidebar-bottom">
        <div className="cf-user-card">
          <div className="cf-avatar">
            {(user.name || "A").charAt(0).toUpperCase()}
          </div>
          <div className="cf-user-info">
            <strong>{user.name || "Administrator"}</strong>
            <span>Administrator</span>
          </div>
          <i className="bi bi-shield-check cf-user-status"></i>
        </div>

        <button className="cf-logout" onClick={handleLogout}>
          <i className="bi bi-box-arrow-left"></i>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
