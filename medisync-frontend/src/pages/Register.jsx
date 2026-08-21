import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import "./Auth.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("patient");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    const validateEmail = (emailStr) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(emailStr).toLowerCase());
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!name.trim()) {
            setErrorMsg("Full name is required.");
            return;
        }

        if (!email.trim() || !validateEmail(email)) {
            setErrorMsg("Please enter a valid email address.");
            return;
        }

        if (!password) {
            setErrorMsg("Password is required.");
            return;
        }

        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters long.");
            return;
        }

        if (!confirmPassword) {
            setErrorMsg("Please confirm your password.");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match.");
            return;
        }

        if (!role) {
            setErrorMsg("Please select an account type.");
            return;
        }

        if (role === "doctor") {
            navigate("/doctor-profile", {
                state: {
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    password,
                    role: "doctor"
                }
            });
        } else {
            try {
                setLoading(true);

                const response = await api.post("/auth/register", {
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    password,
                    role: "patient"
                });

                console.log("Patient registration response:", response.data);
                alert("Registration successful");
                navigate("/login");

            } catch (err) {
                console.error("Patient registration error:", err);
                const msg = err.response?.data?.message || "Registration failed. Please try again.";
                setErrorMsg(msg);
            } finally {
                setLoading(false);
            }
        }
    };

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
                            Take control of
                            <br />
                            your healthcare.
                        </h1>
                        <p>
                            Create your MediSync account and make appointments, manage your healthcare, and connect with doctors more easily.
                        </p>
                    </div>

                    <div className="auth-brand-points">
                        <div className="auth-brand-point">
                            <div className="icon">✓</div>
                            <div>
                                <strong>Simple appointment booking</strong>
                                <span>Choose your doctor and preferred timing in seconds.</span>
                            </div>
                        </div>

                        <div className="auth-brand-point">
                            <div className="icon">✓</div>
                            <div>
                                <strong>Organized healthcare</strong>
                                <span>Keep all your appointments and logs in one dashboard.</span>
                            </div>
                        </div>

                        <div className="auth-brand-point">
                            <div className="icon">✓</div>
                            <div>
                                <strong>Secure healthcare management</strong>
                                <span>Your private patient-doctor interaction is strictly confidential.</span>
                            </div>
                        </div>
                    </div>

                    <div className="auth-brand-footer">
                        <span>© 2026 MediSync</span>
                        <span>Healthcare Management Platform</span>
                    </div>
                </div>

                {/* Right registration form */}
                <div className="auth-form-section">
                    <div className="auth-form-wrapper">
                        <div className="auth-mobile-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                            <span className="symbol">+</span>
                            <span>MediSync</span>
                        </div>

                        <div className="auth-heading">
                            <span className="auth-heading-label">CREATE ACCOUNT</span>
                            <h2>Get Started</h2>
                            <p>Register as a patient or medical professional.</p>
                        </div>

                        {errorMsg && (
                            <div className="ms-alert ms-alert-danger" role="alert">
                                <strong>Error:</strong> {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit}>
                            <Input
                                id="name-input"
                                label="Full Name"
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />

                            <Input
                                id="email-input"
                                label="Email Address"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <div style={{ marginBottom: "18px" }}>
                                <Input
                                    id="password-input"
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ marginBottom: "0" }}
                                    required
                                />
                                <label className="auth-show-password-label">
                                    <input
                                        type="checkbox"
                                        checked={showPassword}
                                        onChange={(e) => setShowPassword(e.target.checked)}
                                    />
                                    <span>Show password</span>
                                </label>
                            </div>

                            <div style={{ marginBottom: "18px" }}>
                                <Input
                                    id="confirm-password-input"
                                    label="Confirm Password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    style={{ marginBottom: "0" }}
                                    required
                                />
                                <label className="auth-show-password-label">
                                    <input
                                        type="checkbox"
                                        checked={showConfirmPassword}
                                        onChange={(e) => setShowConfirmPassword(e.target.checked)}
                                    />
                                    <span>Show password</span>
                                </label>
                            </div>

                            <div className="ms-form-group">
                                <label className="ms-label" htmlFor="role-select">Account Type</label>
                                <select
                                    id="role-select"
                                    className="ms-input"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    required
                                >
                                    <option value="patient">Patient</option>
                                    <option value="doctor">Doctor</option>
                                </select>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                style={{ width: "100%", marginTop: "10px" }}
                            >
                                {loading ? "Please wait..." : role === "doctor" ? "Next" : "Create account"}
                            </Button>
                        </form>

                        <div className="auth-footer-link-row">
                            <span>Already have a MediSync account?</span>
                            <button type="button" onClick={() => navigate("/login")}>
                                Login
                            </button>
                        </div>

                        <div className="auth-security-notice">
                            <span className="auth-security-dot"></span>
                            Your information is securely protected
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
