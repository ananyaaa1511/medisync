import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";

function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);
    const navigate = useNavigate();

    // Modal state
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedApptId, setSelectedApptId] = useState(null);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/appointments/my");
            setAppointments(response.data.appointments || []);
        } catch (err) {
            console.error("Error fetching appointments:", err);
            setError(err.response?.data?.message || "Failed to fetch appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const triggerCancelConfirmation = (id) => {
        setSelectedApptId(id);
        setShowCancelModal(true);
    };

    const confirmCancelAppointment = async () => {
        if (!selectedApptId) return;

        try {
            setCancellingId(selectedApptId);
            setShowCancelModal(false);
            const response = await api.delete(`/appointments/${selectedApptId}`);
            
            alert(response.data.message || "Appointment cancelled successfully");
            
            // Update UI immediately
            setAppointments(prev => prev.map(app => 
                app._id === selectedApptId ? { ...app, status: 'cancelled' } : app
            ));
        } catch (err) {
            console.error("Error cancelling appointment:", err);
            alert(err.response?.data?.message || "Failed to cancel appointment");
        } finally {
            setCancellingId(null);
            setSelectedApptId(null);
        }
    };

    const formatDatePretty = (dateStr) => {
        if (!dateStr) return "";
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) return dateStr;
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return dateObj.toLocaleDateString('en-US', options);
    };

    const formatTime12Hr = (timeStr) => {
        if (!timeStr) return "";
        const parts = timeStr.split(":");
        let hours = parseInt(parts[0], 10);
        const minutes = parts[1] || "00";
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {error && (
                <div className="ms-alert ms-alert-danger" role="alert">
                    <span>⚠</span> {error}
                </div>
            )}

            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {[1, 2].map(i => (
                        <Card key={i} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <Skeleton style={{ height: "20px", width: "40%" }} />
                            <Skeleton style={{ height: "14px", width: "30%" }} />
                            <Skeleton style={{ height: "14px", width: "50%" }} />
                        </Card>
                    ))}
                </div>
            ) : appointments.length === 0 ? (
                <EmptyState 
                    title="No appointments scheduled" 
                    description="You have no appointments booked yet. Browse medical specialists and schedule your consultation."
                >
                    <Button variant="primary" onClick={() => navigate("/find-doctor")}>
                        Book an Appointment
                    </Button>
                </EmptyState>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {appointments.map((appointment) => {
                        const doctorName = appointment.doctor?.user?.name || "Unknown Doctor";
                        const specialization = appointment.doctor?.specialization || "N/A";
                        const fee = appointment.doctor?.consultationFee;
                        const isActionable = appointment.status !== "cancelled" && appointment.status !== "completed";

                        return (
                            <Card key={appointment._id}>
                                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "15px", alignItems: "flex-start" }}>
                                    <div>
                                        <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "var(--text-primary)" }}>
                                            Dr. {doctorName}
                                        </h3>
                                        <span style={{ 
                                            backgroundColor: "var(--primary-light)", 
                                            color: "var(--primary)", 
                                            padding: "3px 10px", 
                                            borderRadius: "12px", 
                                            fontSize: "11px", 
                                            fontWeight: "700",
                                            textTransform: "uppercase"
                                        }}>
                                            {specialization}
                                        </span>
                                    </div>
                                    <div>
                                        <Badge status={appointment.status} />
                                    </div>
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "20px" }}>
                                    <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                        <strong>Date:</strong> {formatDatePretty(appointment.date)}
                                    </div>
                                    <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                        <strong>Time:</strong> {formatTime12Hr(appointment.startTime)} – {formatTime12Hr(appointment.endTime)}
                                    </div>
                                    {fee !== undefined && (
                                        <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                                            <strong>Fee:</strong> ₹{fee}
                                        </div>
                                    )}
                                </div>

                                {isActionable && (
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <Button
                                            onClick={() => triggerCancelConfirmation(appointment._id)}
                                            disabled={cancellingId === appointment._id}
                                            variant="danger"
                                            style={{ height: "36px", fontSize: "13px" }}
                                        >
                                            {cancellingId === appointment._id ? "Cancelling..." : "Cancel Appointment"}
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Custom Modal Confirmation Dialog */}
            {showCancelModal && (
                <div className="ms-modal-backdrop">
                    <div className="ms-modal">
                        <h3>Cancel Appointment?</h3>
                        <p>Are you sure you want to cancel this scheduled appointment? This action cannot be undone and will notify the doctor.</p>
                        <div className="ms-modal-actions">
                            <Button variant="secondary" onClick={() => { setShowCancelModal(false); setSelectedApptId(null); }}>
                                No, Keep It
                            </Button>
                            <Button variant="danger" onClick={confirmCancelAppointment}>
                                Yes, Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyAppointments;
