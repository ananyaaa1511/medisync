import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import "./Layouts.css";
import LogoutConfirmationModal from "../components/LogoutConfirmationModal";

function PatientLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState("Patient");
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

    const getHeaderDetails = () => {
        if (location.pathname.startsWith("/appointments/")) {
            return {
                label: "Scheduling Book",
                title: "Book Consultation",
                desc: "Choose an available availability slot to schedule your consultation."
            };
        }

        switch (location.pathname) {
            case "/find-doctor":
                return {
                    label: "Doctor Directory",
                    title: "Find a Specialist",
                    desc: "Explore doctors based on specialization, qualification, and reviews."
                };
            case "/appointments":
                return {
                    label: "My Schedules",
                    title: "My Appointments",
                    desc: "View and manage your upcoming and historical appointments."
                };
            case "/symptom-analyzer":
                return {
                    label: "Clinical Assistant",
                    title: "AI Symptom Analyzer",
                    desc: "Use artificial intelligence to scan symptoms and find recommended specialties."
                };
            default:
                return {
                    label: "MediSync Portal",
                    title: "Patient Dashboard",
                    desc: "Manage your personal healthcare consults."
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
                            className={isActive("/find-doctor") ? "active" : ""}
                            onClick={() => { setMobileMenuOpen(false); navigate("/find-doctor"); }}
                        >
                            <svg viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            Find Doctors
                        </button>
                    </li>
                    <li>
                        <button 
                            className={isActive("/appointments") ? "active" : ""}
                            onClick={() => { setMobileMenuOpen(false); navigate("/appointments"); }}
                        >
                            <svg viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            My Appointments
                        </button>
                    </li>
                    <li>
                        <button 
                            className={isActive("/symptom-analyzer") ? "active" : ""}
                            onClick={() => { setMobileMenuOpen(false); navigate("/symptom-analyzer"); }}
                        >
                            <svg viewBox="0 0 24 24">
                                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                                <polyline points="2 17 12 22 22 17"></polyline>
                                <polyline points="2 12 12 17 22 12"></polyline>
                            </svg>
                            AI Assistant
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
                            {header.title === "Welcome Back" ? `Welcome Back, ${name.split(" ")[0]}` : header.title}
                        </h1>
                        <p>{header.desc}</p>
                    </div>

                    <div className="ms-header-profile">
                        <div className="ms-profile-avatar">
                            {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ms-profile-info">
                            <span className="ms-profile-name">{name}</span>
                            <span className="ms-profile-role">Patient</span>
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

export default PatientLayout;
