import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function SymptomAnalyzer() {
    const [symptoms, setSymptoms] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleAnalyze = async (e) => {
        e.preventDefault();

        if (!symptoms.trim()) {
            setError("Please describe your symptoms first.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setResult(null);

            const response = await api.post("/symptoms/analyze", {
                symptoms: symptoms
            });

            setResult(response.data);
        } catch (err) {
            console.error("AI Symptom Analysis Error:", err);
            setError(
                err.response?.data?.message || 
                "Unable to analyze symptoms right now. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <Card>
                <h3 style={{ margin: "0 0 12px 0" }}>Describe your symptoms</h3>
                <p style={{ margin: "0 0 20px 0" }}>Enter a details overview of what you are currently experiencing (e.g. fever, headache, body aches).</p>

                {error && (
                    <div className="ms-alert ms-alert-danger" role="alert">
                        <span>⚠</span> {error}
                    </div>
                )}

                <form onSubmit={handleAnalyze}>
                    <Input
                        id="symptoms-textarea"
                        isTextarea={true}
                        value={symptoms}
                        onChange={(e) => {
                            setSymptoms(e.target.value);
                            if (error) setError("");
                        }}
                        placeholder="e.g. I have a dry cough, mild fever, and a sore throat for two days."
                        rows="5"
                        required
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        style={{ marginTop: "10px" }}
                    >
                        {loading ? "Analyzing symptoms..." : "Analyze Symptoms"}
                    </Button>
                </form>
            </Card>

            {result && (
                <Card style={{ borderLeft: "4px solid var(--primary)" }}>
                    <h3 style={{ color: "var(--primary)", borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginTop: 0 }}>
                        Analysis Results
                    </h3>

                    <div style={{ marginBottom: "20px", marginTop: "15px" }}>
                        <h4 style={{ color: "var(--text-primary)", margin: "0 0 8px 0", fontSize: "14px", fontWeight: "700" }}>Possible Conditions</h4>
                        <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.6", fontSize: "13px", color: "var(--text-secondary)" }}>
                            {result.possibleConditions?.map((cond, idx) => (
                                <li key={idx}>{cond}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <h4 style={{ color: "var(--text-primary)", margin: "0 0 8px 0", fontSize: "14px", fontWeight: "700" }}>Recommended Specialty</h4>
                        <p style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "700", color: "var(--primary)" }}>
                            {result.recommendedSpecialty || "General Medicine"}
                        </p>
                        
                        {result.recommendedSpecialty && (
                            <Button
                                onClick={() => navigate(`/find-doctor?specialty=${encodeURIComponent(result.recommendedSpecialty.toLowerCase())}`)}
                                style={{
                                    height: "32px",
                                    padding: "0 12px",
                                    fontSize: "12px",
                                    background: "var(--success)"
                                }}
                            >
                                Find Recommended Doctors
                            </Button>
                        )}
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <h4 style={{ color: "var(--text-primary)", margin: "0 0 8px 0", fontSize: "14px", fontWeight: "700" }}>General Advice</h4>
                        <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.6", fontSize: "13px", color: "var(--text-secondary)" }}>
                            {result.advice?.map((adv, idx) => (
                                <li key={idx}>{adv}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <h4 style={{ color: "var(--danger)", margin: "0 0 8px 0", fontSize: "14px", fontWeight: "700" }}>Warning Signs</h4>
                        <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: "1.6", color: "var(--danger)", fontSize: "13px" }}>
                            {result.warningSigns?.map((warn, idx) => (
                                <li key={idx}>{warn}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{
                        marginTop: "25px",
                        padding: "15px",
                        backgroundColor: "var(--bg-light)",
                        borderRadius: "var(--radius-sm)",
                        borderLeft: "4px solid var(--primary)",
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        lineHeight: "1.5"
                    }}>
                        <strong>Disclaimer:</strong> {result.disclaimer}
                    </div>
                </Card>
            )}
        </div>
    );
}

export default SymptomAnalyzer;
