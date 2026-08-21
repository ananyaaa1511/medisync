import { useNavigate } from "react-router-dom";

function AISymptomSection() {
    const navigate = useNavigate();

    return (
        <section className="landing-ai-section">
            <div className="landing-ai-container">
                {/* Left: AI mockup card */}
                <div className="ai-visual-side">
                    <div className="ai-mockup-card">
                        <div className="scanning-beam"></div>
                        <div className="ai-card-title">AI Symptom Analyzer</div>
                        
                        <div style={{ marginBottom: "15px" }}>
                            <span className="ai-symptom-tag">✓ Headache</span>
                            <span className="ai-symptom-tag">✓ Mild fever</span>
                            <span className="ai-symptom-tag">✓ Fatigue</span>
                        </div>

                        <div className="ai-status-bar">
                            <div className="ai-status-loader"></div>
                            <span>Analyzing symptoms...</span>
                        </div>

                        <div className="ai-assessment-box">
                            <h4 className="ai-assess-title">AI Assessment Draft</h4>
                            <div className="ai-assess-item">
                                <span className="ai-assess-dot"></span>
                                <span><strong>Possible Cause:</strong> Viral Syndrome (Flu or Cold)</span>
                            </div>
                            <div className="ai-assess-item">
                                <span className="ai-assess-dot"></span>
                                <span><strong>Next Steps:</strong> Stay hydrated, monitor temperature, and rest.</span>
                            </div>
                            <div className="ai-assess-item">
                                <span className="ai-assess-dot"></span>
                                <span><strong>Caution:</strong> Consult a General Medicine practitioner if fever persists.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Text and CTA */}
                <div className="ai-info-side">
                    <span className="badge-tag">Powered by AI</span>
                    <h2>Understand your symptoms with intelligent assistance.</h2>
                    <p className="desc">
                        MediSync's AI-powered symptom analysis helps users organize their symptoms and receive useful guidance before consulting a healthcare professional.
                    </p>
                    
                    <button onClick={() => navigate("/symptom-analyzer")} className="btn-primary-cta">
                        Try AI Symptom Analysis
                    </button>

                    <div className="ai-disclaimer">
                        <span>⚠️</span>
                        <span>
                            <strong>Medical Disclaimer:</strong> AI-generated information is for informational purposes only and is not a medical diagnosis.
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AISymptomSection;
