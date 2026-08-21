import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";

function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [completingId, setCompletingId] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);

    // Modal state for cancel confirmation
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedApptId, setSelectedApptId] = useState(null);

    const navigate = useNavigate();

    const loadAppointments = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/appointments/my");
            console.log("Appointments:", response.data);
            setAppointments(response.data.appointments || []);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to load appointments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, []);

    const completeAppointment = async (id) => {
        try {
            setCompletingId(id);
            const response = await api.patch(`/appointments/${id}/complete`);
            alert(response.data.message || "Appointment marked as completed");
            
            // Update UI immediately
            setAppointments(prev => prev.map(app => 
                app._id === id ? { ...app, status: 'completed' } : app
            ));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to complete appointment");
        } finally {
            setCompletingId(null);
        }
    };

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
            console.error(err);
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
                    title="No appointments yet" 
                    description="You currently have no patient appointments booked."
                />
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    {appointments.map((appointment) => {
                        const patientName = appointment.patient?.name || "Unknown Patient";
                        const patientEmail = appointment.patient?.email || "N/A";
                        const isActionable = appointment.status === "confirmed" || appointment.status === "booked";

                        return (
                            <Card key={appointment._id}>
                                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", marginBottom: "15px", alignItems: "flex-start" }}>
                                    <div>
                                        <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "var(--text-primary)" }}>
                                            Patient: {patientName}
                                        </h3>
                                        <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                                            Email: {patientEmail}
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
                                </div>

                                {isActionable && (
                                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                                        <Button
                                            onClick={() => completeAppointment(appointment._id)}
                                            disabled={completingId !== null || cancellingId !== null}
                                            variant="secondary"
                                            style={{ color: "var(--success)", borderColor: "var(--success)", height: "36px", fontSize: "13px" }}
                                        >
                                            {completingId === appointment._id ? "Completing..." : "Mark Completed"}
                                        </Button>
                                        <Button
                                            onClick={() => triggerCancelConfirmation(appointment._id)}
                                            disabled={completingId !== null || cancellingId !== null}
                                            variant="danger"
                                            style={{ height: "36px", fontSize: "13px" }}
                                        >
                                            Cancel Appointment
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
                        <p>Are you sure you want to cancel this scheduled appointment? This action cannot be undone and will notify the patient.</p>
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

export default DoctorAppointments;