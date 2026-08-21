import { useNavigate } from "react-router-dom";

function CTASection() {
    const navigate = useNavigate();

    return (
        <section className="landing-cta-section">
            <div className="landing-cta-container">
                <div className="cta-glow-dot"></div>
                <h2>Your healthcare journey starts here.</h2>
                <p>Join MediSync today and experience a simpler, smarter way to manage appointments and consult medical specialists.</p>
                <div className="cta-actions">
                    <button onClick={() => navigate("/register")} className="btn-cta-patient">
                        Create Patient Account
                    </button>
                    <button onClick={() => navigate("/register")} className="btn-cta-doctor">
                        Join as a Doctor
                    </button>
                </div>
            </div>
        </section>
    );
}

export default CTASection;
