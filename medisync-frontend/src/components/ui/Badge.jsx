import React from "react";

function Badge({ status, className = "", ...props }) {
    // status: available, booked, pending, completed, cancelled, confirmed
    const formattedStatus = status.toLowerCase();
    return (
        <span className={`ms-badge ms-badge-${formattedStatus} ${className}`} {...props}>
            ● {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
}

export default Badge;
