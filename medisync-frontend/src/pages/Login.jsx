import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import "./Auth.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            setLoading(true);

            const response = await api.post("/auth/login", {
                email: email.trim().toLowerCase(),
                password
            });

            console.log("Login response:", response.data);

            localStorage.setItem("token", response.data.token);

            if (response.data.role === "doctor") {
                navigate("/doctor/dashboard");
            } else {
                navigate("/find-doctor");
            }

        } catch (error) {
            console.log(error);
            const msg = error.response?.data?.message || "Login failed. Please check your credentials.";
            setErrorMsg(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Left branding section */}
                <div className="auth-brand">
                    <div className="auth-brand-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                        <span className="auth-brand-symbol">+</span>
                        <span>MediSync</span>
                    </div>

                    <div className="auth-brand-content">
                        <h1>
                            Healthcare that
                            <br />
                            works for you.
                        </h1>

                        <p>
                            Find the right doctor, book appointments, and manage your healthcare — all in one place.
                        </p>
                    </div>

                    <div className="auth-brand-points">
                        <div className="auth-brand-point">
                            <div className="icon">✓</div>
                            <div>
                                <strong>Find trusted doctors</strong>
                                <span>Choose specialists based on your needs.</span>
                            </div>
                        </div>

                        <div className="auth-brand-point">
                            <div className="icon">✓</div>
                            <div>
                                <strong>Book with ease</strong>
                                <span>Choose an available time that works for you.</span>
                            </div>
                        </div>

                        <div className="auth-brand-point">
                            <div className="icon">✓</div>
                            <div>
                                <strong>Manage appointments</strong>
                                <span>Keep your upcoming appointments organized.</span>
                            </div>
                        </div>
                    </div>

                    <div className="auth-brand-footer">
                        <span>© 2026 MediSync</span>
                        <span>Healthcare Management Platform</span>
                    </div>
                </div>

                {/* Right Login section */}
                <div className="auth-form-section">
                    <div className="auth-form-wrapper">
                        <div className="auth-mobile-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                            <span className="symbol">+</span>
                            <span>MediSync</span>
                        </div>

                        <div className="auth-heading">
                            <span className="auth-heading-label">ACCOUNT LOGIN</span>
                            <h2>Welcome back</h2>
                            <p>Sign in to access your MediSync account.</p>
                        </div>

                        {errorMsg && (
                            <div className="ms-alert ms-alert-danger" role="alert">
                                <strong>Error:</strong> {errorMsg}
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            <Input
                                id="email"
                                label="Email address"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <div style={{ marginBottom: "22px" }}>
                                <Input
                                    id="password-input"
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
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

                            <Button
                                type="submit"
                                variant="primary"
                                disabled={loading}
                                style={{ width: "100%", marginTop: "4px" }}
                            >
                                {loading ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>

                        <div className="auth-footer-link-row">
                            <span>Don't have a MediSync account?</span>
                            <button type="button" onClick={() => navigate("/register")}>
                                Create an account
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

export default Login;
