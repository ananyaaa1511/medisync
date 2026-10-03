import { useEffect, useState } from "react";
import api from "./api/axios";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import DoctorProfile from "./pages/DoctorProfile";
import Footer from "./components/Footer";
import BookAppointment from "./pages/BookAppointment";
import Register from "./pages/Register";
import Login from "./pages/Login";
import DoctorSlots from "./pages/DoctorSlots";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorProfileCreate from "./pages/DoctorProfileCreate";
import DoctorProfessionalDetails from "./pages/DoctorProfessionalDetails";
import Home from "./pages/Home";
import MyAppointments from "./pages/MyAppointments";
import SymptomAnalyzer from "./pages/SymptomAnalyzer";
import FindDoctor from "./pages/FindDoctor";
import DoctorLayout from "./layouts/DoctorLayout";
import PatientLayout from "./layouts/PatientLayout";
import LogoutConfirmationModal from "./components/LogoutConfirmationModal";

function App() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const specialty = queryParams.get("specialty");

        setLoading(true);
        setError("");
        let url = "/doctors";
        if (specialty) {
            url += `?specialization=${encodeURIComponent(specialty)}`;
        }

        api.get(url)
            .then(response => {
                console.log(response.data);
                setDoctors(response.data);
            })
            .catch(error => {
                console.log(error);
                setError("Failed to load doctors");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [location.search]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    useEffect(() => {
        if (!token && location.pathname === "/find-doctor") {
            navigate("/doctors", { replace: true });
        }
    }, [token, location.pathname, navigate]);

    // Show the simple navbar on public doctor list and profile details pages
    const showDefaultNavbar = location.pathname.startsWith("/doctors");

    const [publicMenuOpen, setPublicMenuOpen] = useState(false);
    const isFullWidthPage = location.pathname.startsWith("/doctor") || ["/find-doctor", "/appointments", "/symptom-analyzer"].includes(location.pathname) || location.pathname === "/";

    const navigateFromPublicMenu = (path) => {
        setPublicMenuOpen(false);
        navigate(path);
    };

    return (
        <div className={`app-page-wrapper ${isFullWidthPage ? "app-page-wrapper-full" : ""}`}>
            {showDefaultNavbar && (
                <header className="public-navbar">
                    <h1 className="public-navbar-brand" onClick={() => navigate(token ? "/find-doctor" : "/")}>
                        MediSync
                    </h1>
                    <div className="public-navbar-actions">
                        {token ? (
                            <>
                                <button 
                                    onClick={() => navigate("/find-doctor")}
                                    className="public-nav-button public-nav-primary"
                                >
                                    Find a Doctor
                                </button>
                                <button 
                                    onClick={() => navigate("/symptom-analyzer")}
                                    className="public-nav-button public-nav-ai"
                                >
                                    AI Symptom Analyzer
                                </button>
                                <button 
                                    onClick={() => navigate("/appointments")}
                                    className="public-nav-button public-nav-appointments"
                                >
                                    My Appointments
                                </button>
                                <button 
                                    onClick={() => setShowLogoutModal(true)}
                                    className="ms-logout-btn"
                                >
                                    <svg viewBox="0 0 24 24" style={{ width: "16px", height: "16px", stroke: "currentColor", fill: "none", strokeWidth: 2 }}>
                                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                        <polyline points="16 17 21 12 16 7"></polyline>
                                        <line x1="21" y1="12" x2="9" y2="12"></line>
                                    </svg>
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={() => navigate("/login")}
                                    className="public-nav-button public-nav-login"
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={() => navigate("/register")}
                                    className="public-nav-button public-nav-primary"
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                    <button className="public-menu-toggle" onClick={() => setPublicMenuOpen(open => !open)} aria-label="Toggle navigation menu" aria-expanded={publicMenuOpen}>
                        {publicMenuOpen ? "✕" : "☰"}
                    </button>
                    <div className={`public-mobile-menu ${publicMenuOpen ? "open" : ""}`}>
                        {token ? <>
                            <button className="public-nav-button public-nav-primary" onClick={() => navigateFromPublicMenu("/find-doctor")}>Find a Doctor</button>
                            <button className="public-nav-button public-nav-ai" onClick={() => navigateFromPublicMenu("/symptom-analyzer")}>AI Symptom Analyzer</button>
                            <button className="public-nav-button public-nav-appointments" onClick={() => navigateFromPublicMenu("/appointments")}>My Appointments</button>
                            <button className="ms-logout-btn" onClick={() => { setPublicMenuOpen(false); setShowLogoutModal(true); }}>Logout</button>
                        </> : <>
                            <button className="public-nav-button public-nav-login" onClick={() => navigateFromPublicMenu("/login")}>Login</button>
                            <button className="public-nav-button public-nav-primary" onClick={() => navigateFromPublicMenu("/register")}>Register</button>
                        </>}
                    </div>
                </header>
            )}
            <Routes>

            <Route
                path="/"
                element={<Home />}
            />

            {/* Patient Portal Pages (Under PatientLayout) */}
            <Route element={<PatientLayout />}>
                <Route
                    path="/find-doctor"
                    element={<FindDoctor doctors={doctors} loading={loading} error={error} />}
                />
                <Route
                    path="/appointments"
                    element={<MyAppointments />}
                />
                <Route
                    path="/symptom-analyzer"
                    element={<SymptomAnalyzer />}
                />
                <Route
                    path="/appointments/:doctorId"
                    element={<BookAppointment />}
                />
            </Route>

            <Route
                path="/doctors"
                element={
                    <>
                        <div className="public-doctor-list-page">
                            <FindDoctor doctors={doctors} loading={loading} error={error} />
                        </div>
                        <Footer />
                    </>
                }
            />

            <Route
                path="/doctors/:id"
                element={<DoctorProfile />}
            />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/doctor-profile" element={<DoctorProfessionalDetails />} />

            {/* Doctor Portal Pages (Under DoctorLayout) */}
            <Route element={<DoctorLayout />}>
                <Route
                    path="/doctor/slots"
                    element={<DoctorSlots />}
                />
                <Route
                    path="/doctor/appointments"
                    element={<DoctorAppointments />}
                />
                <Route
                    path="/doctor/dashboard"
                    element={<DoctorDashboard />}
                />
                <Route
                    path="/doctor/profile/create"
                    element={<DoctorProfileCreate />}
                />
            </Route>
        </Routes>

        <LogoutConfirmationModal
            isOpen={showLogoutModal}
            onClose={() => setShowLogoutModal(false)}
            onConfirm={() => {
                setShowLogoutModal(false);
                handleLogout();
            }}
        />
        </div>
    );
}

export default App;
