import React from "react";

function Input({ label, error, className = "", id, isTextarea = false, ...props }) {
    const InputElement = isTextarea ? "textarea" : "input";
    return (
        <div className="ms-form-group">
            {label && (
                <label className="ms-label" htmlFor={id}>
                    {label}
                </label>
            )}
            <InputElement
                id={id}
                className={`ms-input ${error ? "error" : ""} ${className}`}
                {...props}
            />
            {error && <span className="ms-error">{error}</span>}
        </div>
    );
}

export default Input;
