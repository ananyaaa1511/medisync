import { useNavigate } from "react-router-dom";

function Footer() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleScrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <footer className="landing-footer">
            <div className="landing-footer-container">
                {/* Brand Column */}
                <div className="footer-brand-column">
                    <div className="footer-logo">
                        <span className="landing-navbar-symbol">+</span>
                        <span>MediSync</span>
                    </div>
                    <p>Smart healthcare management for patients and doctors.</p>
                </div>

                {/* Platform */}
                <div className="footer-column">
                    <h4>Platform</h4>
                    <ul className="footer-links">
                        <li><a onClick={() => handleScrollToSection("features")}>Features</a></li>
                        <li><a onClick={() => navigate(token ? "/appointments" : "/login")}>Appointments</a></li>
                        <li><a onClick={() => navigate(token ? "/symptom-analyzer" : "/login")}>AI Symptom Analysis</a></li>
                        <li><a onClick={() => navigate(token ? "/find-doctor" : "/doctors")}>Doctors</a></li>
                    </ul>
                </div>

                {/* Company */}
                <div className="footer-column">
                    <h4>Company</h4>
                    <ul className="footer-links">
                        <li><a onClick={() => handleScrollToSection("about-section")}>About</a></li>
                        <li><a href="mailto:support@medisync.com">Contact Support</a></li>
                        <li><a onClick={() => handleScrollToSection("about-section")}>Privacy Policy</a></li>
                        <li><a onClick={() => handleScrollToSection("about-section")}>Terms of Service</a></li>
                    </ul>
                </div>

                {/* Account */}
                <div className="footer-column">
                    <h4>Account</h4>
                    <ul className="footer-links">
                        <li><a onClick={() => navigate("/login")}>Patient Login</a></li>
                        <li><a onClick={() => navigate("/register")}>Patient Register</a></li>
                        <li><a onClick={() => navigate("/register")}>Doctor Registration</a></li>
                    </ul>
                </div>
            </div>

            <div className="landing-footer-bottom">
                <p className="footer-copyright">© 2026 MediSync. All rights reserved.</p>
                <div style={{ fontSize: "12px", opacity: 0.8 }}>
                    Designed with care for modern healthcare providers.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
