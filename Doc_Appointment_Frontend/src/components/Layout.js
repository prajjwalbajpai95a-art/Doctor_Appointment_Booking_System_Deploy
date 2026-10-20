import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "../Data/data";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message, Avatar, Dropdown, Tooltip } from "antd";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  //========== Logout ============
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logged out successfully");
    navigate("/login");
  };

  //========== Role Checks ============
  const isAdminUser = Boolean(user?.isAdmin);
  const isDoctorUser = Boolean(user?.isDoctor);

  //========== Doctor Menu ============
  const doctorMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Appointments",
      path: "/doctor-appointments",
      icon: "fa-solid fa-list",
    },

     {
    name: "Apply Doctor",
    path: "/apply-doctor",
    icon: "fa-solid fa-user-doctor",
  },
    
    {
      name: "Profile",
      path: user?._id ? `/doctor/profile/${user._id}` : "/profile",
      icon: "fa-solid fa-user",
    },
  ];

  //========== Sidebar Menu Selection ============
  const SidebarMenu = isAdminUser
    ? adminMenu
    : isDoctorUser
    ? doctorMenu
    : userMenu;

  //========== Name Initials ============
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  //========== Profile Navigation ============
  const handleProfileClick = () => {
    if (isDoctorUser && !isAdminUser) {
      navigate(`/doctor/profile/${user?._id}`);
    } else {
      navigate("/profile");
    }
  };

  //========== Role Label ============
  const roleLabel = isAdminUser
    ? "Administrator"
    : isDoctorUser
    ? "Specialist Doctor"
    : "Patient";

  //========== User Dropdown Items ============
  const userDropdownItems = [
    {
      key: "profile",
      label: (
        <div className="d-flex align-items-center gap-2 py-1">
          <i className="fa-solid fa-user text-primary"></i>
          <span className="fw-medium">My Profile</span>
        </div>
      ),
      onClick: handleProfileClick,
    },
    { type: "divider" },
    {
      key: "logout",
      label: (
        <div className="d-flex align-items-center gap-2 py-1 text-danger">
          <i className="fa-solid fa-right-from-bracket"></i>
          <span className="fw-semibold">Logout</span>
        </div>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <div className="main">
      <div className="layout">
        {/* ==================== SIDEBAR ==================== */}
        <div
          className="sidebar shadow"
          style={{
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            minHeight: "100vh",
            color: "#fff",
            overflowY: "auto",
          }}
        >
          {/* Brand Logo */}
          <div className="logo p-3 text-center">
            <div className="d-flex align-items-center justify-content-center gap-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                style={{
                  width: "42px",
                  height: "42px",
                  backgroundColor: "#ffffff",
                  color: "#1e3c72",
                }}
              >
                <i className="fa-solid fa-user-doctor fs-5"></i>
              </div>
              <h4
                className="m-0 fw-bold"
                style={{ letterSpacing: "1.5px", textTransform: "uppercase" }}
              >
                <span style={{ color: "#ffffff" }}>DOC</span>{" "}
                <span
                  style={{
                    color: "#64b5f6",
                    backgroundColor: "rgba(255,255,255,0.15)",
                    padding: "2px 8px",
                    borderRadius: "6px",
                  }}
                >
                  APP
                </span>
              </h4>
            </div>

            <hr
              style={{
                border: "none",
                height: "3px",
                backgroundColor: "#ffffff",
                opacity: 0.9,
                borderRadius: "2px",
                marginTop: "15px",
                marginBottom: "15px",
              }}
            />
          </div>

          {/* Sidebar Menu */}
          <div className="menu">
            {SidebarMenu.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={menu.name}
                  className={`menu-item ${isActive ? "active" : ""}`}
                  style={{
                    padding: "12px 20px",
                    margin: "5px 10px",
                    borderRadius: "8px",
                    backgroundColor: isActive
                      ? "rgba(255, 255, 255, 0.2)"
                      : "transparent",
                    transition: "all 0.3s ease",
                  }}
                >
                  <i className={`${menu.icon} text-white me-3`}></i>
                  <Link
                    to={menu.path}
                    className="text-white text-decoration-none fw-semibold"
                  >
                    {menu.name}
                  </Link>
                </div>
              );
            })}

            {/* Logout — NO Link to avoid double navigation */}
            <div
              className="menu-item"
              onClick={handleLogout}
              style={{
                padding: "12px 20px",
                margin: "20px 10px 5px 10px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <i className="fa-solid fa-right-from-bracket text-white me-3"></i>
              <span className="text-white fw-semibold">Logout</span>
            </div>
          </div>
        </div>

        {/* ==================== CONTENT ==================== */}
        <div className="content">
          {/* Header */}
          <div
            className="header shadow-sm border-bottom px-4 bg-white d-flex align-items-center justify-content-between"
            style={{ minHeight: "65px", paddingTop: "10px", paddingBottom: "10px" }}
          >
            {/* Welcome Text */}
            <div className="d-flex align-items-center">
              <span className="fw-semibold text-secondary small">
                Welcome back,&nbsp;
              </span>
              <span className="fw-bold text-dark text-capitalize">
                {user?.name || "User"}
              </span>
            </div>

            <div className="d-flex align-items-center gap-3">
              {/* Notification Bell */}
              <Tooltip title="Notifications">
                <div
                  className="notification-box rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "42px",
                    height: "42px",
                    backgroundColor: "#f4f6f9",
                    cursor: "pointer",
                    padding: 0,
                    transition: "background 0.2s ease",
                  }}
                  onClick={() => navigate("/notifications")}
                >
                  <Badge
                    count={user?.notification?.length || 0}
                    overflowCount={99}
                    offset={[2, -2]}
                    className="d-flex align-items-center justify-content-center"
                  >
                    <i
                      className="fa-solid fa-bell fs-5"
                      style={{ color: "#1e3c72" }}
                    ></i>
                  </Badge>
                </div>
              </Tooltip>

              {/* User Profile Dropdown */}
              <Dropdown
                menu={{ items: userDropdownItems }}
                trigger={["click"]}
                placement="bottomRight"
                arrow
              >
                <div
                  className="user-header-card d-flex align-items-center gap-2 px-3 py-1 rounded-pill shadow-sm"
                  style={{
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {/* Avatar + Online Dot */}
                  <div className="position-relative d-flex align-items-center">
                    <Avatar
                      size={36}
                      style={{
                        background:
                          "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      {getInitials(user?.name)}
                    </Avatar>
                    <span
                      className="position-absolute bottom-0 end-0 rounded-circle border border-2 border-white"
                      style={{
                        width: "10px",
                        height: "10px",
                        backgroundColor: "#22c55e",
                      }}
                    />
                  </div>

                  {/* Name + Role */}
                  <div className="d-flex flex-column text-start me-1">
                    <div className="d-flex align-items-center gap-1">
                      <span
                        className="fw-bold text-dark lh-1"
                        style={{ fontSize: "14px" }}
                      >
                        {user?.name || "User"}
                      </span>
                      <i
                        className="fa-solid fa-circle-check text-primary"
                        style={{ fontSize: "11px" }}
                      ></i>
                    </div>
                    <span
                      className="fw-semibold"
                      style={{
                        fontSize: "10px",
                        color: "#64748b",
                        textTransform: "uppercase",
                        marginTop: "3px",
                      }}
                    >
                      {roleLabel}
                    </span>
                  </div>

                  {/* Chevron */}
                  <i
                    className="fa-solid fa-chevron-down text-muted ms-1"
                    style={{ fontSize: "11px" }}
                  ></i>
                </div>
              </Dropdown>
            </div>
          </div>

          {/* Page Body */}
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;