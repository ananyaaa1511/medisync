import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import "./DoctorProfile.css";

function DoctorProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [bookingSlotId, setBookingSlotId] = useState(null);

    const loadDoctorDetails = async () => {
        try {
            setLoading(true);
            setError("");

            const doctorResponse = await api.get(`/doctors/${id}`);
            setDoctor(doctorResponse.data);

            const slotResponse = await api.get(`/slots?doctorId=${id}`);
            setSlots(slotResponse.data);

        } catch (err) {
            console.error("Failed to load doctor profile:", err);
            setError("Failed to load doctor profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDoctorDetails();
    }, [id]);

    // Set default selected date once slots load
    useEffect(() => {
        if (slots.length > 0) {
            const uniqueDates = [...new Set(slots.map(slot => slot.date))].sort();
            if (uniqueDates.length > 0 && !selectedDate) {
                setSelectedDate(uniqueDates[0]);
            }
        } else {
            setSelectedDate("");
        }
    }, [slots]);

    const bookAppointment = async () => {
        if (!localStorage.getItem("token")) {
            alert("Please log in to book an appointment.");
            navigate("/login");
            return;
        }

        if (!selectedSlot) return;
        const slotId = selectedSlot._id;

        try {
            setBookingSlotId(slotId);

            const response = await api.post("/appointments", {
                slotId: slotId
            });

            console.log("Appointment booked:", response.data);
            alert("Appointment booked successfully!");

            // Update local slots (remove booked slot)
            setSlots(slots.filter(slot => slot._id !== slotId));
            setSelectedSlot(null);

        } catch (err) {
            console.error("Booking error:", err);
            alert(err.response?.data?.message || "Failed to book appointment");
        } finally {
            setBookingSlotId(null);
        }
    };

    // Formatter helpers
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

    const formatDatePretty = (dateStr) => {
        if (!dateStr) return "";
        const dateObj = new Date(dateStr);
        if (isNaN(dateObj.getTime())) return dateStr;
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return dateObj.toLocaleDateString('en-US', options);
    };

    const parseDateParts = (dateStr) => {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return { dayName: "DAY", num: "00", month: "MON" };
        const dayName = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
        const num = d.toLocaleDateString("en-US", { day: "numeric" });
        const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
        return { dayName, num, month };
    };

    // Calculate unique slots dates
    const uniqueDates = [...new Set(slots.map(slot => slot.date))].sort();

    // Filter slots by selected date
    const activeSlots = slots.filter(slot => slot.date === selectedDate);

    // Initial fallback avatar
    const getInitials = (name) => {
        if (!name) return "DR";
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <div className="doctor-profile-page">
                <div>
                    <Skeleton style={{ height: "16px", width: "120px", marginBottom: "20px" }} />
                </div>
                {/* Hero card skeleton */}
                <Card style={{ display: "flex", gap: "24px", padding: "30px", alignItems: "center" }}>
                    <Skeleton style={{ width: "100px", height: "100px", borderRadius: "50%" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", flexGrow: 1 }}>
                        <Skeleton style={{ height: "24px", width: "40%" }} />
                        <Skeleton style={{ height: "16px", width: "20%" }} />
                        <Skeleton style={{ height: "16px", width: "30%" }} />
                    </div>
                </Card>

                {/* Details layout skeleton */}
                <div className="dr-details-grid">
                    <Card style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <Skeleton style={{ height: "20px", width: "30%" }} />
                        <Skeleton style={{ height: "14px", width: "100%" }} />
                        <Skeleton style={{ height: "14px", width: "100%" }} />
                        <Skeleton style={{ height: "14px", width: "80%" }} />
                    </Card>
                    <Card style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <Skeleton style={{ height: "20px", width: "50%" }} />
                        <Skeleton style={{ height: "40px", width: "100%" }} />
                        <Skeleton style={{ height: "80px", width: "100%" }} />
                    </Card>
                </div>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="doctor-profile-page" style={{ alignItems: "center", textAlign: "center", padding: "60px 20px" }}>
                <div style={{ maxWidth: "450px" }}>
                    <div className="ms-alert ms-alert-danger" style={{ display: "block", padding: "24px" }}>
                        <h3 style={{ margin: "0 0 10px 0" }}>{doctor ? "Failed to load" : "Doctor Not Found"}</h3>
                        <p style={{ margin: "0 0 20px 0" }}>
                            {doctor
                                ? "Something went wrong while loading this doctor's profile."
                                : "The doctor profile you're looking for could not be found."
                            }
                        </p>
                        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                            <Button variant="secondary" onClick={() => navigate("/doctors")}>
                                ← Back to Doctors
                            </Button>
                            {doctor && (
                                <Button variant="primary" onClick={loadDoctorDetails}>
                                    Try Again
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const doctorName = doctor.user?.name || "Unknown Doctor";

    return (
        <div className="doctor-profile-page">
            {/* Back to Doctors */}
            <div>
                <a href="#back" onClick={(e) => { e.preventDefault(); navigate("/doctors"); }} className="back-link">
                    <svg viewBox="0 0 24 24">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    Back to Doctors
                </a>
            </div>

            {/* Doctor Hero Card */}
            <div className="dr-hero-card">
                <div className="dr-hero-avatar">
                    {getInitials(doctorName)}
                </div>

                <div className="dr-hero-info">
                    <span className="dr-neutral-badge">
                        <span>🛡</span> MediSync Doctor
                    </span>
                    <h1>Dr. {doctorName}</h1>
                    <p className="dr-hero-specialty">
                        <span>⚕</span> {doctor.specialization}
                    </p>

                    <div className="dr-stats-row">
                        <div className="dr-stat-box">
                            <span className="dr-stat-label">Experience</span>
                            <span className="dr-stat-value">{doctor.experienceYears}+ Years</span>
                        </div>
                        <div className="dr-stat-box">
                            <span className="dr-stat-label">Qualifications</span>
                            <span className="dr-stat-value">{doctor.qualification}</span>
                        </div>
                        <div className="dr-stat-box">
                            <span className="dr-stat-label">Consultation</span>
                            <span className="dr-stat-value">₹{doctor.consultationFee}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Two-Column Layout */}
            <div className="dr-details-grid">
                {/* Left Card: Info and bio */}
                <div className="dr-info-card">
                    <Card>
                        <h2 className="info-section-title">About the Doctor</h2>
                        {doctor.bio ? (
                            <p className="dr-bio-text">{doctor.bio}</p>
                        ) : (
                            <p className="dr-bio-text" style={{ fontStyle: "italic", color: "var(--text-muted)" }}>
                                No biography has been added yet.
                            </p>
                        )}
                    </Card>

                    <Card>
                        <h2 className="info-section-title">Professional Information</h2>
                        <div className="dr-info-grid">
                            <div className="dr-grid-item">
                                <div className="dr-grid-icon">🎓</div>
                                <div className="dr-grid-content">
                                    <span className="dr-grid-label">Qualifications</span>
                                    <span className="dr-grid-value">{doctor.qualification}</span>
                                </div>
                            </div>

                            <div className="dr-grid-item">
                                <div className="dr-grid-icon">💼</div>
                                <div className="dr-grid-content">
                                    <span className="dr-grid-label">Experience</span>
                                    <span className="dr-grid-value">{doctor.experienceYears} Years Practice</span>
                                </div>
                            </div>

                            <div className="dr-grid-item">
                                <div className="dr-grid-icon">⚕</div>
                                <div className="dr-grid-content">
                                    <span className="dr-grid-label">Specialization</span>
                                    <span className="dr-grid-value">{doctor.specialization}</span>
                                </div>
                            </div>

                            <div className="dr-grid-item">
                                <div className="dr-grid-icon">💳</div>
                                <div className="dr-grid-content">
                                    <span className="dr-grid-label">Consultation Fee</span>
                                    <span className="dr-grid-value">₹{doctor.consultationFee} per session</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Card: Date & Slot Selectors */}
                <Card className="booking-card">
                    <h2>Book an Appointment</h2>
                    <p className="desc">Choose a convenient date and available time slot.</p>

                    {/* Date Selector */}
                    {uniqueDates.length > 0 && (
                        <div>
                            <span className="booking-section-label">Select Date</span>
                            <div className="date-selector-container">
                                {uniqueDates.map(dateStr => {
                                    const { dayName, num, month } = parseDateParts(dateStr);
                                    const isActive = selectedDate === dateStr;
                                    return (
                                        <button
                                            key={dateStr}
                                            className={`date-btn ${isActive ? "active" : ""}`}
                                            onClick={() => {
                                                setSelectedDate(dateStr);
                                                setSelectedSlot(null);
                                            }}
                                        >
                                            <span className="date-btn-day">{dayName}</span>
                                            <span className="date-btn-num">{num}</span>
                                            <span className="date-btn-month">{month}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Time Slots Selector */}
                    <div>
                        <span className="booking-section-label">Available Time Slots</span>
                        {uniqueDates.length === 0 ? (
                            <EmptyState
                                title="No available slots"
                                description="This doctor currently has no available appointment slots. Please check back later."
                            />
                        ) : activeSlots.length === 0 ? (
                            <p style={{ fontStyle: "italic", color: "var(--text-muted)", fontSize: "13px" }}>
                                No slots listed for this date.
                            </p>
                        ) : (
                            <div className="time-slots-grid">
                                {activeSlots.map(slot => {
                                    const isSelected = selectedSlot?._id === slot._id;
                                    return (
                                        <button
                                            key={slot._id}
                                            className={`time-slot-btn ${isSelected ? "active" : ""}`}
                                            disabled={slot.isBooked}
                                            onClick={() => setSelectedSlot(slot)}
                                        >
                                            {formatTime12Hr(slot.startTime)}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Booking Summary & Trigger Button */}
                    {selectedSlot && (
                        <div className="booking-summary-box">
                            <h3>Appointment Summary</h3>
                            <div className="summary-row">
                                <span>Doctor</span>
                                <strong>Dr. {doctorName}</strong>
                            </div>
                            <div className="summary-row">
                                <span>Date</span>
                                <strong>{formatDatePretty(selectedSlot.date)}</strong>
                            </div>
                            <div className="summary-row">
                                <span>Time</span>
                                <strong>
                                    {formatTime12Hr(selectedSlot.startTime)} – {formatTime12Hr(selectedSlot.endTime)}
                                </strong>
                            </div>
                            <div className="summary-row">
                                <span>Consultation Fee</span>
                                <strong>₹{doctor.consultationFee}</strong>
                            </div>
                        </div>
                    )}

                    <Button
                        variant="primary"
                        onClick={bookAppointment}
                        disabled={!selectedSlot || bookingSlotId !== null}
                        style={{ width: "100%", height: "46px" }}
                    >
                        {bookingSlotId !== null
                            ? "Booking..."
                            : selectedSlot
                                ? "Book Appointment"
                                : "Select a time slot to book"
                        }
                    </Button>
                </Card>
            </div>
        </div>
    );
}

export default DoctorProfile;