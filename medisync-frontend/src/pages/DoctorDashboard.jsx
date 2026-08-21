import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";

function DoctorDashboard() {
    const navigate = useNavigate();
    const [hasNoProfile, setHasNoProfile] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSlots: 0,
        availableSlots: 0,
        totalAppointments: 0
    });

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);

                // 1. Check doctor profile
                try {
                    await api.get("/doctors/me");
                    setHasNoProfile(false);
                } catch (error) {
                    if (error.response?.status === 404) {
                        setHasNoProfile(true);
                    } else {
                        console.error("Failed to load doctor profile:", error);
                    }
                }

                // 2. Fetch Slots & Appointments count for stats
                const [slotsRes, apptsRes] = await Promise.allSettled([
                    api.get("/slots/mine"),
                    api.get("/appointments/my")
                ]);

                let totalS = 0;
                let availS = 0;
                let totalA = 0;

                if (slotsRes.status === "fulfilled") {
                    totalS = slotsRes.value.data.length;
                    availS = slotsRes.value.data.filter(s => !s.isBooked).length;
                }

                if (apptsRes.status === "fulfilled") {
                    totalA = (apptsRes.value.data.appointments || []).length;
                }

                setStats({
                    totalSlots: totalS,
                    availableSlots: availS,
                    totalAppointments: totalA
                });

            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            {hasNoProfile && (
                <div className="ms-alert ms-alert-danger" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", padding: "20px" }}>
                    <h3 style={{ margin: 0, color: "var(--danger)" }}>Profile Required</h3>
                    <p style={{ margin: 0, color: "var(--danger)", fontSize: "14px" }}>
                        You haven't created your doctor profile yet. Patients cannot view your profile or book appointments with you until it is created.
                    </p>
                    <Button 
                        variant="danger" 
                        onClick={() => navigate("/doctor/profile/create")}
                        style={{ background: "var(--danger)", color: "white", border: "none" }}
                    >
                        Create Profile Now
                    </Button>
                </div>
            )}

            {/* Dashboard Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
                <Card style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyWindow: "center", justifyContent: "center" }}>
                        📅
                    </div>
                    <div>
                        <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
                            Total Slots
                        </span>
                        {loading ? <Skeleton style={{ height: "24px", width: "40px", marginTop: "4px" }} /> : (
                            <h3 style={{ margin: "4px 0 0 0", fontSize: "24px", fontWeight: "800" }}>{stats.totalSlots}</h3>
                        )}
                    </div>
                </Card>

                <Card style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyWindow: "center", justifyContent: "center" }}>
                        ●
                    </div>
                    <div>
                        <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
                            Available Slots
                        </span>
                        {loading ? <Skeleton style={{ height: "24px", width: "40px", marginTop: "4px" }} /> : (
                            <h3 style={{ margin: "4px 0 0 0", fontSize: "24px", fontWeight: "800", color: "var(--success)" }}>{stats.availableSlots}</h3>
                        )}
                    </div>
                </Card>

                <Card style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--info-bg)", color: "var(--info)", display: "flex", alignItems: "center", justifyWindow: "center", justifyContent: "center" }}>
                        👥
                    </div>
                    <div>
                        <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
                            Total Appointments
                        </span>
                        {loading ? <Skeleton style={{ height: "24px", width: "40px", marginTop: "4px" }} /> : (
                            <h3 style={{ margin: "4px 0 0 0", fontSize: "24px", fontWeight: "800" }}>{stats.totalAppointments}</h3>
                        )}
                    </div>
                </Card>
            </div>

            {/* Quick Actions Card */}
            <Card>
                <h3 style={{ margin: "0 0 8px 0" }}>Quick Actions</h3>
                <p style={{ margin: "0 0 20px 0" }}>Manage your consultation availability and see scheduled bookings.</p>
                <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
                    <Button onClick={() => navigate("/doctor/slots")} variant="primary">
                        Manage Slots
                    </Button>
                    <Button onClick={() => navigate("/doctor/appointments")} variant="secondary">
                        My Appointments
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default DoctorDashboard;