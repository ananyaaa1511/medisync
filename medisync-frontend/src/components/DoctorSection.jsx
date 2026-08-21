import { useNavigate } from "react-router-dom";

function DoctorSection() {
    const navigate = useNavigate();

    return (
        <section id="doctors-section" className="landing-doctor-section">
            <div className="landing-doctor-container">
                {/* Left: Text & CTA */}
                <div className="doctor-info-side">
                    <span className="badge-tag">For Medical Professionals</span>
                    <h2>A smarter workspace for doctors.</h2>
                    <p className="desc">
                        MediSync helps doctors manage their professional profile, availability, and appointments all from one centralized, easy-to-use workspace dashboard.
                    </p>
                    <button onClick={() => navigate("/register")} className="btn-primary-cta">
                        Join MediSync as a Doctor
                    </button>
                </div>

                {/* Right: Mockup dashboard */}
                <div className="doctor-visual-side">
                    <div className="doctor-mockup-board">
                        <div className="doc-board-title">
                            <span>Today's Appointments</span>
                            <span className="doc-board-badge">Active</span>
                        </div>

                        <div className="doc-appts-list">
                            <div className="doc-appt-row">
                                <span className="doc-appt-time">09:00 AM</span>
                                <span className="doc-appt-name">John Doe</span>
                            </div>
                            <div className="doc-appt-row">
                                <span className="doc-appt-time">10:30 AM</span>
                                <span className="doc-appt-name">Priya Sharma</span>
                            </div>
                            <div className="doc-appt-row">
                                <span className="doc-appt-time">12:00 PM</span>
                                <span className="doc-appt-name">Rahul Kumar</span>
                            </div>
                        </div>

                        <div className="doc-slots-title">Available Slots Preview</div>
                        <div className="doc-slots-list">
                            <div className="doc-slot-row">
                                <span className="doc-slot-time">09:00 AM</span>
                                <span className="doc-slot-status available">● Available</span>
                            </div>
                            <div className="doc-slot-row">
                                <span className="doc-slot-time">10:30 AM</span>
                                <span className="doc-slot-status booked">✓ Booked</span>
                            </div>
                            <div className="doc-slot-row">
                                <span className="doc-slot-time">11:30 AM</span>
                                <span className="doc-slot-status available">● Available</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default DoctorSection;
