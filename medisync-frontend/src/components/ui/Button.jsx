import React from "react";

function Button({ children, variant = "primary", className = "", ...props }) {
    return (
        <button className={`ms-btn ms-btn-${variant} ${className}`} {...props}>
            {children}
        </button>
    );
}

export default Button;
