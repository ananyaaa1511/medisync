import { Link } from "react-router-dom";
import Card from "./ui/Card";
import Button from "./ui/Button";

function DoctorCard({ doctor }) {
    return (
        <Card style={{ width: "300px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "var(--text-primary)" }}>
                Dr. {doctor.user?.name || "Unknown Doctor"}
            </h3>

            <p style={{ margin: "0", fontSize: "13px", color: "var(--text-secondary)" }}>
                <strong>Specialization:</strong> {doctor.specialization}
            </p>

            <p style={{ margin: "0", fontSize: "13px", color: "var(--text-secondary)" }}>
                <strong>Qualification:</strong> {doctor.qualification}
            </p>

            <p style={{ margin: "0", fontSize: "13px", color: "var(--text-secondary)" }}>
                <strong>Experience:</strong> {doctor.experienceYears} years
            </p>

            <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                <strong>Consultation Fee:</strong> ₹{doctor.consultationFee}
            </p>

            <Link to={`/doctors/${doctor._id}`} style={{ textDecoration: "none", marginTop: "auto" }}>
                <Button variant="primary" style={{ width: "100%", height: "36px" }}>
                    View Profile
                </Button>
            </Link>
        </Card>
    );
}

export default DoctorCard;