import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import "./Layouts.css";
import LogoutConfirmationModal from "../components/LogoutConfirmationModal";

function DoctorLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState("Doctor");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await api.get("/auth/me");
                if (response.data && response.data.name) {
                    setName(response.data.name);
                }
            } catch (error) {
                console.error("Failed to load user info:", error);
            }
        };

        fetchUserData();
    }, [navigate]);

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    // Dynamic header details based on path
    const getHeaderDetails = () => {
        switch (location.pathname) {
            case "/doctor/dashboard":
                return {
                    label: "Overview Panel",
                    title: "Welcome Back",
                    desc: "Here's what is happening with your schedules today."
                };
            case "/doctor/slots":
                return {
                    label: "Doctor Schedule",
                    title: "Manage Your Slots",
                    desc: "Create and manage your appointment availability for patients."
                };
            case "/doctor/appointments":
                return {
                    label: "Patient Consultations",
                    title: "My Appointments",
                    desc: "View and organize patient appointments and actions."
                };
            default:
                return {
                    label: "MediSync Portal",
                    title: "Doctor Workspace",
                    desc: "Manage your professional care availability."
                };
        }
    };

    const header = getHeaderDetails();

    return (
        <div className="ms-dashboard-layout">
            {/* Mobile Header Banner */}
            <div className="ms-mobile-header">
                <div className="logo" onClick={() => navigate("/")}>
                    <span className="symbol">+</span>
                    <span>MediSync</span>
                </div>
                <button 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                    className="ms-mobile-toggle"
                >
                    ☰
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside className={`ms-sidebar ${mobileMenuOpen ? "open" : ""}`}>
                <div className="ms-sidebar-brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                    <span className="symbol">+</span>
                    <span>MediSync</span>
                </div>

                <ul className="ms-sidebar-menu">
                    <li>
                        <button 
                            className={isActive("/doctor/dashboard") ? "active" : ""}
                            onClick={() => { setMobileMenuOpen(false); navigate("/doctor/dashboard"); }}
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                            Dashboard
                        </button>
                    </li>
                    <li>
                        <button 
                            className={isActive("/doctor/slots") ? "active" : ""}
                            onClick={() => { setMobileMenuOpen(false); navigate("/doctor/slots"); }}
                        >
                            <svg viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            Manage Slots
                        </button>
                    </li>
                    <li>
                        <button 
                            className={isActive("/doctor/appointments") ? "active" : ""}
                            onClick={() => { setMobileMenuOpen(false); navigate("/doctor/appointments"); }}
                        >
                            <svg viewBox="0 0 24 24">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            My Appointments
                        </button>
                    </li>
                </ul>

                <div className="ms-sidebar-footer">
                    <button onClick={() => setShowLogoutModal(true)} className="ms-logout-btn">
                        <svg viewBox="0 0 24 24">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="ms-main-content">
                {/* Header */}
                <div className="ms-header">
                    <div className="ms-header-info">
                        <span className="ms-label" style={{ letterSpacing: "1px", textTransform: "uppercase", fontSize: "11px", fontWeight: "750", color: "var(--primary)" }}>
                            {header.label}
                        </span>
                        <h1>
                            {header.title === "Welcome Back" ? `Welcome Back, Dr. ${name.split(" ")[0]}` : header.title}
                        </h1>
                        <p>{header.desc}</p>
                    </div>

                    <div className="ms-header-profile">
                        <div className="ms-profile-avatar">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ms-profile-info">
                            <span className="ms-profile-name">Dr. {name}</span>
                            <span className="ms-profile-role">Doctor</span>
                        </div>
                    </div>
                </div>

                {/* Sub-page Render */}
                <Outlet />
            </main>

            <LogoutConfirmationModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={logout}
            />
        </div>
    );
}

export default DoctorLayout;
