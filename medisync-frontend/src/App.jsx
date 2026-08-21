import { useEffect, useState } from "react";
import api from "./api/axios";
import DoctorCard from "./components/DoctorCard";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
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
        } else if (token && location.pathname === "/doctors") {
            navigate("/find-doctor", { replace: true });
        }
    }, [token, location.pathname, navigate]);

    // Show the simple navbar on public doctor list and profile details pages
    const showDefaultNavbar = location.pathname.startsWith("/doctors");

    return (
        <div style={{ padding: location.pathname.startsWith("/doctor") || ["/find-doctor", "/appointments", "/symptom-analyzer"].includes(location.pathname) || location.pathname === "/" ? "0" : "20px", maxWidth: location.pathname.startsWith("/doctor") || ["/find-doctor", "/appointments", "/symptom-analyzer"].includes(location.pathname) || location.pathname === "/" ? "100%" : "1200px", margin: "0 auto" }}>
            {showDefaultNavbar && (
                <div style={{ 
                     display: "flex", 
                     justifyContent: "space-between", 
                     alignItems: "center", 
                     padding: "15px 20px", 
                     borderBottom: "1px solid #eee",
                     backgroundColor: "#fff",
                     boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                     borderRadius: "8px",
                     marginBottom: "20px" 
                }}>
                    <h1 style={{ margin: 0, fontSize: "24px", cursor: "pointer", color: "#176b7c" }} onClick={() => navigate(token ? "/find-doctor" : "/")}>
                        MediSync
                    </h1>
                    <div style={{ display: "flex", gap: "10px" }}>
                        {token ? (
                            <>
                                <button 
                                    onClick={() => navigate("/find-doctor")}
                                    style={{ 
                                        padding: "8px 15px", 
                                        cursor: "pointer", 
                                        borderRadius: "4px", 
                                        border: "1px solid #176b7c", 
                                        backgroundColor: "#176b7c", 
                                        color: "white", 
                                        fontWeight: "bold" 
                                    }}
                                >
                                    Find a Doctor
                                </button>
                                <button 
                                    onClick={() => navigate("/symptom-analyzer")}
                                    style={{ 
                                        padding: "8px 15px", 
                                        cursor: "pointer", 
                                        borderRadius: "4px", 
                                        border: "1px solid #17a2b8", 
                                        backgroundColor: "#17a2b8", 
                                        color: "white", 
                                        fontWeight: "bold" 
                                    }}
                                >
                                    AI Symptom Analyzer
                                </button>
                                <button 
                                    onClick={() => navigate("/appointments")}
                                    style={{ 
                                        padding: "8px 15px", 
                                        cursor: "pointer", 
                                        borderRadius: "4px", 
                                        border: "1px solid #007bff", 
                                        backgroundColor: "#007bff", 
                                        color: "white", 
                                        fontWeight: "bold" 
                                    }}
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
                                    style={{ 
                                        padding: "8px 15px", 
                                        cursor: "pointer", 
                                        borderRadius: "4px", 
                                        border: "1px solid #176b7c", 
                                        backgroundColor: "#fff", 
                                        color: "#176b7c",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Login
                                </button>
                                <button 
                                    onClick={() => navigate("/register")}
                                    style={{ 
                                        padding: "8px 15px", 
                                        cursor: "pointer", 
                                        borderRadius: "4px", 
                                        border: "none", 
                                        backgroundColor: "#176b7c", 
                                        color: "#fff",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </div>
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
                        <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto", minHeight: "calc(100vh - 250px)", boxSizing: "border-box" }}>
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