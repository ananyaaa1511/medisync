import { useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate();

    const handleExplore = () => {
        const element = document.getElementById("features");
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="landing-hero-section">
            <div className="landing-hero-container">
                {/* Left Side text */}
                <div className="hero-left">
                    <span className="badge-tag">
                        Smart Healthcare • Simplified
                    </span>
                    <h1>
                        Your health.
                        <br />
                        <span className="highlight">Smarter, simpler, connected.</span>
                    </h1>
                    <p className="lead">
                        MediSync brings patients, doctors, appointments, and intelligent healthcare tools together in one seamless platform.
                    </p>
                    <div className="hero-actions">
                        <button onClick={() => navigate("/register")} className="btn-primary-cta">
                            Get Started
                        </button>
                        <button onClick={() => navigate("/doctors")} className="btn-doctors-cta">
                            <svg viewBox="0 0 24 24" className="cta-icon">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            See Doctors
                        </button>
                        <button onClick={handleExplore} className="btn-secondary-cta">
                            Explore MediSync
                        </button>
                    </div>
                </div>

                {/* Right Side visual */}
                <div className="hero-right">
                    <div className="dashboard-mockup">
                        <div className="mockup-header">
                            <h3 className="mockup-user">Good morning, Ananya</h3>
                            <p className="mockup-desc">Your health is in good hands.</p>
                        </div>
                        
                        <div className="mockup-appointment-card">
                            <div className="appt-title">Upcoming Appointment</div>
                            <h4 className="appt-doctor">Dr. Sarah Williams</h4>
                            <p className="appt-dept">Cardiology Specialist</p>
                            <div className="appt-time">Today • 10:30 AM</div>
                            <span className="appt-badge">Confirmed</span>
                        </div>
                    </div>

                    {/* Floating Cards */}
                    <div className="floating-badge float-badge-1">
                        <span className="badge-icon-check">✓</span>
                        <span>Appointment Confirmed</span>
                    </div>

                    <div className="floating-badge float-badge-2">
                        <span className="badge-percent">98%</span>
                        <span>Health Tracking</span>
                    </div>

                    <div className="floating-badge float-badge-3">
                        <span className="badge-pulse"></span>
                        <span>AI Symptom Analysis</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
