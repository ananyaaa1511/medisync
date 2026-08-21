import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import "./Auth.css";

function DoctorProfessionalDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const registrationData = location.state;

    // Redirect to register if step 1 data is missing
    useEffect(() => {
        if (!registrationData || registrationData.role !== "doctor") {
            alert("Please complete the basic registration details first.");
            navigate("/register");
        }
    }, [registrationData, navigate]);

    const [specialization, setSpecialization] = useState("General Medicine");
    const [customSpecialization, setCustomSpecialization] = useState("");
    const [qualification, setQualification] = useState("");
    const [experienceYears, setExperienceYears] = useState("");
    const [consultationFee, setConsultationFee] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        const finalSpecialization = specialization === "Other" ? customSpecialization.trim() : specialization;

        if (specialization === "Other" && !customSpecialization.trim()) {
            setErrorMsg("Please enter your custom specialization.");
            return;
        }

        if (!qualification.trim()) {
            setErrorMsg("Qualification is required.");
            return;
        }

        if (experienceYears === "" || Number(experienceYears) < 0) {
            setErrorMsg("Please enter a valid number of experience years.");
            return;
        }

        if (consultationFee === "" || Number(consultationFee) < 0) {
            setErrorMsg("Please enter a valid consultation fee.");
            return;
        }

        if (!bio.trim()) {
            setErrorMsg("Professional bio is required.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                name: registrationData.name,
                email: registrationData.email,
                password: registrationData.password,
                role: "doctor",
                specialization: finalSpecialization,
                qualification: qualification.trim(),
                experienceYears: Number(experienceYears),
                consultationFee: Number(consultationFee),
                bio: bio.trim()
            };

            const response = await api.post("/auth/register", payload);
            console.log("Doctor registration response:", response.data);

            alert("Doctor registration successful");
            navigate("/login");

        } catch (err) {
            console.error("Doctor registration error:", err);
            const msg = err.response?.data?.message || "Registration failed. Please try again.";
            setErrorMsg(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!registrationData || registrationData.role !== "doctor") {
        return null;
    }

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Left branding panel */}
                <div className="auth-brand">
                    <div className="auth-brand-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                        <span className="auth-brand-symbol">+</span>
                        <span>MediSync</span>
                    </div>

                    <div className="auth-brand-content">
                        <h1>
                            Welcome to the
                            <br />
                            MediSync Network.
                        </h1>
                        <p>
                            Complete your professional profile to join our network, consult patients, list schedules, and grow your practice.
                        </p>
                    </div>

                    <div className="auth-brand-points">
                        <div className="auth-brand-point">
                            <div className="icon">✓</div>
                            <div>
                                <strong>Consult patients digitally</strong>
                                <span>Interact and advise patients with ease.</span>
                            </div>
                        </div>

                        <div className="auth-brand-point">
                            <div className="icon">✓</div>
                            <div>
                                <strong>Flexible schedule slots</strong>
                                <span>Create and manage your consultation hours dynamically.</span>
                            </div>
                        </div>

                        <div className="auth-brand-point">
                            <div className="icon">✓</div>
                            <div>
                                <strong>Secure medical platform</strong>
                                <span>Full HIPAA-compliant standard security for all patient records.</span>
                            </div>
                        </div>
                    </div>

                    <div className="auth-brand-footer">
                        <span>© 2026 MediSync</span>
                        <span>Healthcare Management Platform</span>
                    </div>
                </div>

                {/* Right Form */}
                <div className="auth-form-section">
                    <div className="auth-form-wrapper">
                        <div className="auth-mobile-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                            <span className="symbol">+</span>
                            <span>MediSync</span>
                        </div>

                        <div className="auth-heading">
                            <span className="auth-heading-label">STEP 2 OF 2</span>
                            <h2>Professional Details</h2>
                            <p>Let patients know about your qualifications and expertise.</p>
                        </div>

                        {errorMsg && (
                            <div className="ms-alert ms-alert-danger" role="alert">
                                <strong>Error:</strong> {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="ms-form-group">
                                <label className="ms-label" htmlFor="specialization-select">Specialization</label>
                                <select
                                    id="specialization-select"
                                    className="ms-input"
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    required
                                >
                                    <option value="General Medicine">General Medicine</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Other">Other...</option>
                                </select>
                            </div>

                            {specialization === "Other" && (
                                <Input
                                    id="custom-specialization-input"
                                    label="Specify Specialization"
                                    type="text"
                                    placeholder="Enter your specialty (e.g. Ophthalmology)"
                                    value={customSpecialization}
                                    onChange={(e) => setCustomSpecialization(e.target.value)}
                                    required
                                />
                            )}

                            <Input
                                id="qualification-input"
                                label="Qualification"
                                type="text"
                                placeholder="e.g. MBBS, MD"
                                value={qualification}
                                onChange={(e) => setQualification(e.target.value)}
                                required
                            />

                            <Input
                                id="experience-input"
                                label="Experience (Years)"
                                type="number"
                                min="0"
                                placeholder="Number of years"
                                value={experienceYears}
                                onChange={(e) => setExperienceYears(e.target.value)}
                                required
                            />

                            <Input
                                id="fee-input"
                                label="Consultation Fee (₹)"
                                type="number"
                                min="0"
                                placeholder="Consultation fee amount"
                                value={consultationFee}
                                onChange={(e) => setConsultationFee(e.target.value)}
                                required
                            />

                            <Input
                                id="bio-textarea"
                                label="Professional Bio"
                                isTextarea={true}
                                placeholder="Enter a short professional description..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                required
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                style={{ width: "100%", marginTop: "10px" }}
                            >
                                {loading ? "Please wait..." : "Complete Registration"}
                            </Button>
                        </form>

                        <div className="auth-footer-link-row">
                            <button
                                type="button"
                                onClick={() => navigate("/register", { state: registrationData })}
                                style={{ color: "var(--text-secondary)", fontWeight: "600" }}
                            >
                                ← Go back to step 1
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorProfessionalDetails;
