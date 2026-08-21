import React from "react";

function EmptyState({ icon, title, description, children }) {
    return (
        <div className="ms-empty-state">
            <div className="ms-empty-icon">
                {icon ? (
                    icon
                ) : (
                    <svg viewBox="0 0 24 24" style={{ width: "24px", height: "24px", stroke: "currentColor", fill: "none", strokeWidth: "2" }}>
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                    </svg>
                )}
            </div>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
            {children}
        </div>
    );
}

export default EmptyState;
