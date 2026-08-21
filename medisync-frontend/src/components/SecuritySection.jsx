function SecuritySection() {
    return (
        <section id="about-section" className="landing-security-section">
            <div className="section-header">
                <h2>Built with privacy and security in mind</h2>
                <p>We ensure that your healthcare records, professional credentials, and logs are protected.</p>
            </div>

            <div className="security-cards-grid">
                <div className="security-card">
                    <div className="security-icon-wrapper">
                        <svg viewBox="0 0 24 24">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                    </div>
                    <h3>Secure Authentication</h3>
                    <p>Uses JWT web token structures and bcrypt password hashing to safeguard account credentials.</p>
                </div>

                <div className="security-card">
                    <div className="security-icon-wrapper">
                        <svg viewBox="0 0 24 24">
                            <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                            <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
                        </svg>
                    </div>
                    <h3>Protected User Data</h3>
                    <p>MongoDB storage structured securely with Mongoose constraints to prevent exposure or injections.</p>
                </div>

                <div className="security-card">
                    <div className="security-icon-wrapper">
                        <svg viewBox="0 0 24 24">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    </div>
                    <h3>Role-Based Access</h3>
                    <p>Clean separations of access. Patients can only query and book slots; doctors can only manage slots.</p>
                </div>
            </div>
        </section>
    );
}

export default SecuritySection;
