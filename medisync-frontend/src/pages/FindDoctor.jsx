import { useNavigate, useLocation } from "react-router-dom";
import DoctorCard from "../components/DoctorCard";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

function FindDoctor({ doctors, loading, error }) {
    const navigate = useNavigate();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const specialty = queryParams.get("specialty");

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {specialty && (
                <div className="ms-alert ms-alert-success" style={{ justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>🔍</span>
                        <span>
                            Showing recommended doctors for: <strong>{specialty}</strong>
                        </span>
                    </div>
                    <Button 
                        variant="secondary" 
                        onClick={() => navigate("/find-doctor")}
                        style={{ height: "28px", padding: "0 10px", fontSize: "12px", border: "1px solid var(--success)" }}
                    >
                        Clear Filter
                    </Button>
                </div>
            )}

            {loading ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="ms-card" style={{ width: "300px", height: "180px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            <Skeleton style={{ height: "20px", width: "70%" }} />
                            <Skeleton style={{ height: "14px", width: "50%" }} />
                            <Skeleton style={{ height: "14px", width: "40%" }} />
                            <Skeleton style={{ height: "36px", marginTop: "auto" }} />
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="ms-alert ms-alert-danger">
                    <span>⚠</span> {error}
                </div>
            ) : doctors.length === 0 ? (
                <EmptyState 
                    title="No doctors found" 
                    description="There are currently no healthcare specialists matching your search filters."
                />
            ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
                    {doctors.map(doctor => (
                        <DoctorCard
                            key={doctor._id}
                            doctor={doctor}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default FindDoctor;
