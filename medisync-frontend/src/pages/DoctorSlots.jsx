import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import Skeleton from "../components/ui/Skeleton";

function DoctorSlots() {
    const navigate = useNavigate();

    // Form inputs state
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    // Data lists state
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    const [profileError, setProfileError] = useState(false);

    // Filter states
    const [statusFilter, setStatusFilter] = useState("all");
    const [dateFilter, setDateFilter] = useState("all");

    // UX messages state
    const [formSuccess, setFormSuccess] = useState("");
    const [formError, setFormError] = useState("");
    const [timeValidationError, setTimeValidationError] = useState("");

    // Helpers to get today, tomorrow and this week strings
    const getTodayStr = () => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const getTomorrowStr = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const yyyy = tomorrow.getFullYear();
        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const dd = String(tomorrow.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };

    const isWithinSevenDays = (dateStr) => {
        const slotDate = new Date(dateStr);
        slotDate.setHours(0,0,0,0);
        const today = new Date();
        today.setHours(0,0,0,0);
        const sevenDaysLater = new Date();
        sevenDaysLater.setDate(today.getDate() + 7);
        sevenDaysLater.setHours(23,59,59,999);
        return slotDate >= today && slotDate <= sevenDaysLater;
    };

    // Form Time Validation Effect
    useEffect(() => {
        if (startTime && endTime) {
            const startMinutes = getMinutesFromTime(startTime);
            const endMinutes = getMinutesFromTime(endTime);
            if (endMinutes <= startMinutes) {
                setTimeValidationError("End time must be later than start time.");
            } else {
                setTimeValidationError("");
            }
        } else {
            setTimeValidationError("");
        }
    }, [startTime, endTime]);

    const getMinutesFromTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
    };

    // Form submission
    const createSlot = async (e) => {
        e.preventDefault();
        setFormSuccess("");
        setFormError("");

        if (timeValidationError) {
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/slots", {
                date,
                startTime,
                endTime
            });

            console.log("Created slot:", response.data);

            setFormSuccess("Slot created successfully");
            setDate("");
            setStartTime("");
            setEndTime("");

            // Clear success message after 4 seconds
            setTimeout(() => setFormSuccess(""), 4000);

            await loadSlots();

        } catch (error) {
            console.error(error);
            const errMsg = error.response?.data?.message || "Unable to create slot. Please try again.";
            setFormError(errMsg);
        } finally {
            setLoading(false);
        }
    };

    // Load slots
    const loadSlots = async () => {
        try {
            setFetchLoading(true);
            setFetchError(false);
            const response = await api.get("/slots/mine");
            console.log("My slots:", response.data);
            setSlots(response.data);
            setProfileError(false);
        } catch (error) {
            console.error(error);
            if (error.response?.status === 404) {
                setProfileError(true);
            } else {
                setFetchError(true);
            }
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => {
        loadSlots();
    }, []);

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

    // Computed Stats (from local array data)
    const totalSlots = slots.length;
    const availableSlots = slots.filter(s => !s.isBooked).length;
    const bookedSlots = slots.filter(s => s.isBooked).length;
    const todayStr = getTodayStr();
    const todaysSlotsCount = slots.filter(s => s.date === todayStr).length;

    // Filter Slots list
    const filteredSlots = slots.filter(slot => {
        // Status filter
        if (statusFilter === "available" && slot.isBooked) return false;
        if (statusFilter === "booked" && !slot.isBooked) return false;

        // Date filter
        if (dateFilter === "today" && slot.date !== todayStr) return false;
        if (dateFilter === "tomorrow" && slot.date !== getTomorrowStr()) return false;
        if (dateFilter === "week" && !isWithinSevenDays(slot.date)) return false;

        return true;
    });

    if (profileError) {
        return (
            <div style={{ padding: "20px", maxWidth: "600px", margin: "80px auto", textAlign: "center" }}>
                <h1>MediSync</h1>
                <div style={{
                    backgroundColor: "#ffebee",
                    color: "#c62828",
                    padding: "30px",
                    borderRadius: "12px",
                    border: "1px solid #ffcdd2",
                    boxShadow: "0 6px 20px rgba(31, 55, 65, 0.05)"
                }}>
                    <h2 style={{ marginTop: 0, marginBottom: "15px" }}>Profile Required</h2>
                    <p style={{ margin: "0 0 20px 0", fontSize: "16px", lineHeight: "1.6" }}>
                        You must create your doctor profile before you can manage your availability slots.
                    </p>
                    <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                        <Button
                            variant="primary"
                            onClick={() => navigate("/doctor/profile/create")}
                            style={{ background: "#d32f2f" }}
                        >
                            Create Profile Now
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/doctor/dashboard")}
                        >
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            {/* Statistics Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
                <Card style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyWindow: "center", justifyContent: "center" }}>
                        📅
                    </div>
                    <div>
                        <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
                            Total Slots
                        </span>
                        <h3 style={{ margin: "4px 0 0 0", fontSize: "24px", fontWeight: "800" }}>{totalSlots}</h3>
                    </div>
                </Card>

                <Card style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--success-bg)", color: "var(--success)", display: "flex", alignItems: "center", justifyWindow: "center", justifyContent: "center" }}>
                        ●
                    </div>
                    <div>
                        <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
                            Available
                        </span>
                        <h3 style={{ margin: "4px 0 0 0", fontSize: "24px", fontWeight: "800", color: "var(--success)" }}>{availableSlots}</h3>
                    </div>
                </Card>

                <Card style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--blue-bg)", color: "var(--blue-badge)", display: "flex", alignItems: "center", justifyWindow: "center", justifyContent: "center" }}>
                        👥
                    </div>
                    <div>
                        <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
                            Booked
                        </span>
                        <h3 style={{ margin: "4px 0 0 0", fontSize: "24px", fontWeight: "800", color: "var(--blue-badge)" }}>{bookedSlots}</h3>
                    </div>
                </Card>

                <Card style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--info-bg)", color: "var(--info)", display: "flex", alignItems: "center", justifyWindow: "center", justifyContent: "center" }}>
                        ●
                    </div>
                    <div>
                        <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.5px" }}>
                            Today
                        </span>
                        <h3 style={{ margin: "4px 0 0 0", fontSize: "24px", fontWeight: "800" }}>{todaysSlotsCount}</h3>
                    </div>
                </Card>
            </div>

            {/* Dashboard grid (Form & List) */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "30px", alignItems: "start" }}>
                {/* Left: Create Form */}
                <Card>
                    <h2 style={{ margin: "0 0 4px 0" }}>Create a New Slot</h2>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 20px 0" }}>Set your availability for patients to book appointments.</p>

                    {formSuccess && (
                        <div className="ms-alert ms-alert-success">
                            <span>✓</span> {formSuccess}
                        </div>
                    )}

                    {formError && (
                        <div className="ms-alert ms-alert-danger">
                            <span>⚠</span> {formError}
                        </div>
                    )}

                    <form onSubmit={createSlot}>
                        <Input
                            id="slot-date-input"
                            label="Date"
                            type="date"
                            min={todayStr}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />

                        <Input
                            id="slot-start-input"
                            label="Start Time"
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            required
                        />

                        <Input
                            id="slot-end-input"
                            label="End Time"
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            error={timeValidationError}
                            required
                        />

                        <Button 
                            type="submit" 
                            disabled={loading || !!timeValidationError}
                            style={{ width: "100%", marginTop: "24px" }}
                        >
                            {loading ? "Creating..." : "+ Create Slot"}
                        </Button>
                    </form>
                </Card>

                {/* Right: Slot Listing */}
                <Card>
                    <h2 style={{ margin: "0 0 4px 0" }}>Your Appointment Slots</h2>
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 0 20px 0" }}>View and filter your upcoming availability.</p>

                    {/* Filters row */}
                    <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
                        <div style={{ flexGrow: 1, minWidth: "140px" }}>
                            <select 
                                className="ms-input"
                                value={dateFilter} 
                                onChange={(e) => setDateFilter(e.target.value)}
                                aria-label="Filter Slots by Date"
                                style={{ height: "40px", fontWeight: "600", fontSize: "13px" }}
                            >
                                <option value="all">All Dates</option>
                                <option value="today">Today</option>
                                <option value="tomorrow">Tomorrow</option>
                                <option value="week">This Week (7 days)</option>
                            </select>
                        </div>

                        <div style={{ flexGrow: 1, minWidth: "140px" }}>
                            <select 
                                className="ms-input"
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                                aria-label="Filter Slots by Booking Status"
                                style={{ height: "40px", fontWeight: "600", fontSize: "13px" }}
                            >
                                <option value="all">All Statuses</option>
                                <option value="available">Available Only</option>
                                <option value="booked">Booked Only</option>
                            </select>
                        </div>
                    </div>

                    {/* Fetch State Handling */}
                    {fetchLoading ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="ms-card" style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <Skeleton style={{ height: "16px", width: "30%" }} />
                                    <Skeleton style={{ height: "16px", width: "40%" }} />
                                    <Skeleton style={{ height: "20px", width: "15%" }} />
                                </div>
                            ))}
                        </div>
                    ) : fetchError ? (
                        <div style={{ textAlign: "center", padding: "30px 20px" }}>
                            <p style={{ color: "var(--danger)", fontSize: "14px", fontWeight: "600", marginBottom: "16px" }}>
                                Unable to load your slots. Something went wrong while retrieving availability.
                            </p>
                            <Button onClick={loadSlots} variant="secondary">
                                Try Again
                            </Button>
                        </div>
                    ) : filteredSlots.length === 0 ? (
                        <EmptyState 
                            title="No appointment slots yet" 
                            description="Create your first availability slot on the left form so patients can start booking appointments."
                        />
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {filteredSlots.map((slot) => (
                                <div 
                                    key={slot._id} 
                                    style={{ 
                                        padding: "16px", 
                                        display: "flex", 
                                        justifyContent: "space-between", 
                                        alignItems: "center",
                                        border: "1px solid var(--border)",
                                        borderRadius: "var(--radius-md)",
                                        background: "var(--surface)",
                                        flexWrap: "wrap",
                                        gap: "12px"
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: "14px", fontWeight: "700", marginBottom: "4px" }}>
                                            {formatDatePretty(slot.date)}
                                        </div>
                                        <div style={{ fontSize: "13px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                                            <span>🕐</span> {formatTime12Hr(slot.startTime)} – {formatTime12Hr(slot.endTime)}
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <Badge status={slot.isBooked ? "booked" : "available"} />
                                        {slot.isBooked ? (
                                            <Button 
                                                onClick={() => navigate("/doctor/appointments")} 
                                                variant="secondary"
                                                style={{ height: "32px", padding: "0 12px", fontSize: "12px" }}
                                            >
                                                View Appointment
                                            </Button>
                                        ) : (
                                            <span style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic" }}>—</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default DoctorSlots;