import React from "react";

function Skeleton({ className = "", ...props }) {
    return <div className={`ms-skeleton ${className}`} {...props} />;
}

export default Skeleton;
