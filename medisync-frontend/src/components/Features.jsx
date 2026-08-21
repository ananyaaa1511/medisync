function Features() {
    const featuresList = [
        {
            title: "Smart Appointments",
            desc: "Book and manage doctor appointments effortlessly in just a few clicks.",
            icon: (
                <svg viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
            )
        },
        {
            title: "AI Symptom Analysis",
            desc: "Use intelligent symptom analysis powered by Gemini AI to better understand your health conditions.",
            icon: (
                <svg viewBox="0 0 24 24">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
            )
        },
        {
            title: "Doctor Management",
            desc: "Doctors can organize schedules, manage profiles, and view scheduled consultations.",
            icon: (
                <svg viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
            )
        },
        {
            title: "Real-Time Availability",
            desc: "Instantly view open slots and confirm bookings without tedious phone calls or delays.",
            icon: (
                <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
            )
        },
        {
            title: "Secure Healthcare",
            desc: "Secure patient logins, role-based access, and token authentication keep your data private.",
            icon: (
                <svg viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            )
        },
        {
            title: "Connected Care",
            desc: "Bridge communication between doctors and patients on a unified cloud hospital framework.",
            icon: (
                <svg viewBox="0 0 24 24">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
            )
        }
    ];

    return (
        <section id="features" className="landing-features-section">
            <div className="section-header">
                <h2>Everything you need for smarter healthcare</h2>
                <p>MediSync simplifies healthcare management by bringing essential services into one connected platform.</p>
            </div>

            <div className="features-grid">
                {featuresList.map((feat, index) => (
                    <div key={index} className="feature-card">
                        <div className="feature-icon-wrapper">
                            {feat.icon}
                        </div>
                        <h3>{feat.title}</h3>
                        <p>{feat.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Features;
