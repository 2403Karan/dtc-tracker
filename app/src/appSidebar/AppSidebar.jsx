import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AppSidebar.css";

const AppSidebar = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return "User";

    try {
      const payload = token.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return decoded.username || decoded.sub || decoded.name || "User";
    } catch {
      return "User";
    }
  };

  const username = getUsernameFromToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", shortLabel: "H" },
    { to: "/stop", label: "Stop Enquiry", shortLabel: "S" },
    { to: "/fare", label: "Check Fare", shortLabel: "F" },
  ];

  return (
    <div className="layout-wrapper">
      <div className="mobile-header d-md-none bg-dark text-white px-3 py-2 d-flex justify-content-between align-items-center">
        <button
          className="sidebar-toggle-btn"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
        <span className="fw-bold">DTC Tracker</span>
        <span style={{ width: "34px" }}></span>
      </div>

      {sidebarOpen && (
        <div
          className="sidebar-overlay d-md-none"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`app-sidebar ${sidebarOpen ? "show" : ""} ${
          collapsed ? "collapsed" : ""
        }`}
      >
        <div className="sidebar-top">
          <div className="d-flex justify-content-between align-items-center d-md-none">
            <h5 className="m-0 fw-bold sidebar-brand-mobile">DTC Tracker</h5>
            <button
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="d-none d-md-flex justify-content-between align-items-center">
            <h4 className="fw-bold m-0 sidebar-title">
              {collapsed ? "DTC" : "DTC Tracker"}
            </h4>

            <button
              className="collapse-btn"
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? "☰" : "☰"}
            </button>
          </div>
        </div>

        <ul className="nav nav-pills flex-column sidebar-nav">
        {navLinks.map((link) => (
            <li className="nav-item mb-2" key={link.to}>
            <NavLink
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                `nav-link sidebar-link ${
                    isActive ? "sidebar-link-active" : ""
                } ${collapsed ? "sidebar-link-collapsed" : ""}`
                }
                title={collapsed ? link.label : ""}
            >
                {/* 👇 Only ONE text based on condition */}
                <span className="sidebar-link-text">
                {collapsed ? link.shortLabel : link.label}
                </span>
            </NavLink>
            </li>
        ))}
        </ul>

        <div className={`sidebar-bottom ${collapsed ? "sidebar-bottom-collapsed" : ""}`}>
        <div className={`sidebar-user-row ${collapsed ? "sidebar-user-row-collapsed" : ""}`}>
            <div className="d-flex align-items-center gap-2 min-w-0">
            <div className="profile-circle">
                {username.charAt(0).toUpperCase()}
            </div>

            {!collapsed && (
                <div className="sidebar-user-info">
                <div className="sidebar-username text-truncate">{username}</div>
                </div>
            )}
            </div>

            <button
            className={`logout-btn ${collapsed ? "logout-btn-collapsed" : ""}`}
            onClick={handleLogout}
            title="Logout"
            >
            <span className="logout-icon">⎋</span>
            {!collapsed && <span>Logout</span>}
            </button>
        </div>
        </div>
      </aside>

      <main className="app-main bg-light">
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppSidebar;