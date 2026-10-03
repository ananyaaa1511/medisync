import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";

function BookAppointment() {
    const { doctorId } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [booking, setBooking] = useState(false);

    // Get doctor details
    useEffect(() => {
        api.get(`/doctors/${doctorId}`)
            .then(response => {
                console.log("Doctor:", response.data);
                setDoctor(response.data);
            })
            .catch(error => {
                console.log(error);
                setError("Failed to load doctor");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [doctorId]);

    // Get available slots
    useEffect(() => {
        api.get(`/slots?doctorId=${doctorId}`)
            .then(response => {
                console.log("Slots:", response.data);
                setSlots(response.data);
            })
            .catch(error => {
                console.log(error);
                setError("Failed to load slots");
            });
    }, [doctorId]);

    // Book appointment
    const handleBooking = () => {
        if (!selectedSlot) {
            alert("Please select an availability slot");
            return;
        }

        setBooking(true);
        api.post("/appointments", {
            slotId: selectedSlot._id
        })
            .then(response => {
                console.log("Appointment:", response.data);
                alert("Appointment booked successfully");

                // Remove booked slot from the list
                setSlots(slots.filter(slot => slot._id !== selectedSlot._id));
                setSelectedSlot(null);

                // Navigate back to my appointments list
                navigate("/appointments");
            })
            .catch(error => {
                console.log(error);
                alert(error.response?.data?.message || "Booking failed");
            })
            .finally(() => {
                setBooking(false);
            });
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

    if (loading) {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <Card style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <Skeleton style={{ height: "24px", width: "40%" }} />
                    <Skeleton style={{ height: "14px", width: "20%" }} />
                    <Skeleton style={{ height: "14px", width: "30%" }} />
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ms-alert ms-alert-danger">
                <span>⚠</span> {error}
            </div>
        );
    }

    return (
        <div className="responsive-two-column-grid">
            
            {/* Doctor profile details */}
            <Card>
                <span className="ms-label" style={{ color: "var(--primary)", textTransform: "uppercase", fontSize: "11px", fontWeight: "700" }}>
                    Practitioner Profile
                </span>
                <h2 style={{ marginTop: "4px", marginBottom: "8px" }}>Dr. {doctor?.user?.name}</h2>
                <span style={{ 
                    backgroundColor: "var(--primary-light)", 
                    color: "var(--primary)", 
                    padding: "3px 10px", 
                    borderRadius: "12px", 
                    fontSize: "11px", 
                    fontWeight: "700",
                    textTransform: "uppercase",
                    display: "inline-block",
                    marginBottom: "20px"
                }}>
                    {doctor?.specialization}
                </span>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--border)", paddingTop: "15px" }}>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                        <strong>Qualification:</strong> {doctor?.qualification}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                        <strong>Experience:</strong> {doctor?.experienceYears} Years
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                        <strong>Consultation Fee:</strong> ₹{doctor?.consultationFee}
                    </div>
                    {doctor?.bio && (
                        <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "10px", lineHeight: "1.5" }}>
                            <strong>About Doctor:</strong>
                            <p style={{ marginTop: "4px", fontSize: "13px" }}>{doctor.bio}</p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Availability Slots & Confirmation */}
            <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                <Card>
                    <h2 style={{ margin: "0 0 4px 0" }}>Available Slots</h2>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 20px 0" }}>Select one of the times below to consult with this doctor.</p>

                    {slots.length === 0 ? (
                        <EmptyState 
                            title="No available slots" 
                            description="This doctor has not listed any availability slots right now. Please check back later."
                        />
                    ) : (
                        <div className="responsive-slot-grid">
                            {slots.map(slot => {
                                const isSelected = selectedSlot?._id === slot._id;
                                return (
                                    <Button
                                        key={slot._id}
                                        variant={isSelected ? "primary" : "secondary"}
                                        onClick={() => setSelectedSlot(slot)}
                                        style={{ 
                                            height: "auto", 
                                            padding: "12px", 
                                            display: "flex", 
                                            flexDirection: "column", 
                                            gap: "4px",
                                            borderColor: isSelected ? "var(--primary)" : "var(--border)"
                                        }}
                                    >
                                        <span style={{ fontSize: "12px", fontWeight: "750" }}>
                                            {formatDatePretty(slot.date)}
                                        </span>
                                        <span style={{ fontSize: "11px", opacity: 0.85 }}>
                                            {formatTime12Hr(slot.startTime)} – {formatTime12Hr(slot.endTime)}
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </Card>

                {selectedSlot && (
                    <Card style={{ borderLeft: "4px solid var(--primary)" }}>
                        <h3 style={{ margin: "0 0 4px 0" }}>Selected Slot Details</h3>
                        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 15px 0" }}>Please confirm your booking details before scheduling.</p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                            <div style={{ fontSize: "13px" }}>
                                <strong>Consultation Date:</strong> {formatDatePretty(selectedSlot.date)}
                            </div>
                            <div style={{ fontSize: "13px" }}>
                                <strong>Timing:</strong> {formatTime12Hr(selectedSlot.startTime)} – {formatTime12Hr(selectedSlot.endTime)}
                            </div>
                            <div style={{ fontSize: "13px" }}>
                                <strong>Consultation Fee:</strong> ₹{doctor?.consultationFee}
                            </div>
                        </div>

                        <div className="responsive-action-row">
                            <Button 
                                variant="primary" 
                                onClick={handleBooking}
                                disabled={booking}
                            >
                                {booking ? "Booking..." : "Confirm Booking"}
                            </Button>
                            <Button 
                                variant="secondary" 
                                onClick={() => setSelectedSlot(null)}
                                disabled={booking}
                            >
                                Clear Selection
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default BookAppointment;
