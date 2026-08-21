import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function DoctorProfileCreate() {
    const [specialization, setSpecialization] = useState("");
    const [qualification, setQualification] = useState("");
    const [experienceYears, setExperienceYears] = useState("");
    const [consultationFee, setConsultationFee] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!specialization.trim()) {
            setErrorMsg("Specialization is required.");
            return;
        }

        if (!qualification.trim()) {
            setErrorMsg("Qualification is required.");
            return;
        }

        if (experienceYears === "" || Number(experienceYears) < 0) {
            setErrorMsg("Please enter a valid experience period.");
            return;
        }

        if (consultationFee === "" || Number(consultationFee) < 0) {
            setErrorMsg("Please enter a valid consultation fee.");
            return;
        }

        if (!bio.trim()) {
            setErrorMsg("Professional bio is required.");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post("/doctors", {
                specialization: specialization.trim(),
                qualification: qualification.trim(),
                experienceYears: Number(experienceYears),
                consultationFee: Number(consultationFee),
                bio: bio.trim()
            });

            console.log("Doctor profile:", response.data);
            alert("Doctor profile created successfully");
            navigate("/doctor/dashboard");

        } catch (error) {
            console.log(error);
            const msg = error.response?.data?.message || "Failed to create doctor profile. Please try again.";
            setErrorMsg(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
            <Card>
                <h2 style={{ margin: "0 0 4px 0" }}>Create Your Doctor Profile</h2>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 24px 0" }}>
                    Patients will see this information when searching for specialists and booking slots.
                </p>

                {errorMsg && (
                    <div className="ms-alert ms-alert-danger" role="alert">
                        <strong>Error:</strong> {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input
                        id="specialization-input"
                        label="Specialization"
                        type="text"
                        placeholder="e.g. Cardiology, Pediatrics"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        required
                    />

                    <Input
                        id="qualification-input"
                        label="Qualification"
                        type="text"
                        placeholder="e.g. MBBS, MD, FRCP"
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        required
                    />

                    <Input
                        id="experience-input"
                        label="Experience (Years)"
                        type="number"
                        min="0"
                        placeholder="e.g. 5"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value)}
                        required
                    />

                    <Input
                        id="fee-input"
                        label="Consultation Fee (₹)"
                        type="number"
                        min="0"
                        placeholder="e.g. 500"
                        value={consultationFee}
                        onChange={(e) => setConsultationFee(e.target.value)}
                        required
                    />

                    <Input
                        id="bio-textarea"
                        label="Professional Bio"
                        isTextarea={true}
                        placeholder="Write a brief overview about your medical expertise and practice..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        disabled={loading}
                        style={{ width: "100%", marginTop: "15px" }}
                    >
                        {loading ? "Creating profile..." : "Create Profile"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}

export default DoctorProfileCreate;